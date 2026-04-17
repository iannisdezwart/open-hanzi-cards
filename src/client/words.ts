import type { FlashCard, Word } from "./models";

const CARDS_PER_PART = 30;
const DB_NAME = "open_hanzi_cards";
const DB_VERSION = 1;
const STORE_NAME = "words";
const WORDS_PATH = "res/words.json";

let db: IDBDatabase;

export function initWordsDb(){
  return new Promise<void>((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    let upgradePromise: Promise<void> | null = null;

    req.onupgradeneeded = () => {
      upgradePromise = (async () => {
        db = req.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, {
            keyPath: "word.simplified",
          });
          store.createIndex("learningOrder", "learningOrder", {
            multiEntry: true,
          });
          store.createIndex("lastRevision", "lastRevision");
          store.createIndex("knowledgeLevel", "knowledgeLevel");
        }
        const res = await fetch(WORDS_PATH);
        const words: Word[] = await res.json();

        // First pass: create all flash cards
        const flashCards: Map<string, FlashCard> = new Map();
        for (const word of words) {
          const flashCard: FlashCard = {
            word,
            starred: false,
            revisionLevel: 0,
            timesRevised: 0,
            lastRevision: 0,
            knowledgeLevel: 0,
            learningOrder: [], // populated after parts determined
            partsByLevel: {},
          };
          flashCards.set(word.simplified, flashCard);
        }

        // Second pass: assign parts based on frequency within each level
        const cardsByLevel: Map<string, FlashCard[]> = new Map();
        for (const flashCard of flashCards.values()) {
          for (const level of flashCard.word.level) {
            if (!cardsByLevel.has(level)) {
              cardsByLevel.set(level, []);
            }
            cardsByLevel.get(level)!.push(flashCard);
          }
        }

        // Sort by frequency and assign parts
        for (const [level, cards] of cardsByLevel) {
          cards.sort((a, b) => a.word.frequency - b.word.frequency);
          for (let i = 0; i < cards.length; i++) {
            const part = Math.floor(i / CARDS_PER_PART) + 1;
            cards[i].partsByLevel[level] = part;
          }
        }

        // now that every card has its part for each level, build learningOrder keys
        for (const flashCard of flashCards.values()) {
          flashCard.learningOrder = flashCard.word.level.map((l) => [
            l,
            flashCard.partsByLevel[l] || 0,
            0,
            flashCard.word.frequency,
          ]);
        }

        // Store all cards
        const tx = db.transaction(STORE_NAME, "readwrite");
        const store = tx.objectStore(STORE_NAME);
        for (const flashCard of flashCards.values()) {
          store.put(flashCard);
        }
      })();
    };

    req.onsuccess = async () => {
      if (upgradePromise) {
        await upgradePromise;
      } else {
        db = req.result;
      }
      resolve();
    };
    req.onerror = () => {
      reject(req.error);
    };
  });
}

export const getMaxLastRevision = (): Promise<number> =>
  new Promise((resolve, reject) => {
    const req = db
      .transaction(STORE_NAME, "readonly")
      .objectStore(STORE_NAME)
      .index("lastRevision")
      .openCursor(null, "prev");
    req.onsuccess = (ev) => {
      const cursor = (ev.target as IDBRequest).result;
      if (cursor == null) {
        resolve(0);
        return;
      }
      resolve(cursor.value.lastRevision);
    };
    req.onerror = (ev) => {
      reject((ev.target as IDBRequest).error);
    };
  });

export const getTotalCards = () =>
  new Promise<number>((resolve, reject) => {
    const req = db
      .transaction(STORE_NAME, "readonly")
      .objectStore(STORE_NAME)
      .count();
    req.onsuccess = (ev) => {
      resolve((ev.target as IDBRequest).result);
    };
    req.onerror = (ev) => {
      reject((ev.target as IDBRequest).error);
    };
  });

export type LevelPartStats = {
  count: number;
  avgRevision: number;
};

export const getLevelPartStats = async (
  level: string,
  part?: number,
): Promise<LevelPartStats> => {
  const cards = await getLearningSet(level, Infinity, part);
  const count = cards.length;
  const avgRevision =
    count === 0
      ? 0
      : cards.reduce((sum, c) => sum + c.revisionLevel, 0) / count;
  return { count, avgRevision };
};

export const updateKnowledgeLevels = async (level: string) => {
  const maxLastRevision = await getMaxLastRevision();
  const totalCards = await getTotalCards();
  return await new Promise<void>((resolve, reject) => {
    const req = db
      .transaction(STORE_NAME, "readwrite")
      .objectStore(STORE_NAME)
      .index("learningOrder")
      .openCursor(
        IDBKeyRange.bound(
          [level, 0, 0, 0],
          [level, Infinity, Infinity, Infinity],
        ),
      );
    req.onsuccess = (ev) => {
      const cursor = (ev.target as IDBRequest).result;
      if (cursor == null) {
        resolve();
        return;
      }
      const flashCard: FlashCard = cursor.value;
      flashCard.knowledgeLevel =
        flashCard.revisionLevel *
        Math.exp(
          (-1 * (maxLastRevision - flashCard.lastRevision)) / (2 * totalCards),
        );
      flashCard.learningOrder = flashCard.word.level.map((l) => [
        l,
        flashCard.partsByLevel[l] ||
          (() => {
            throw new Error(
              `Card ${flashCard.word.simplified} missing part for level ${l}`,
            );
          })(),
        flashCard.knowledgeLevel,
        flashCard.word.frequency,
      ]);
      cursor.update(flashCard);
      cursor.continue();
    };
    req.onerror = (ev) => {
      reject((ev.target as IDBRequest).error);
    };
  });
};

// Gather all distinct levels present in the DB (e.g. "new-1", "old-3").
export const getAllLevels = (): Promise<string[]> =>
  new Promise((resolve, reject) => {
    const levels = new Set<string>();
    const req = db
      .transaction(STORE_NAME, "readonly")
      .objectStore(STORE_NAME)
      .openCursor();
    req.onsuccess = (ev) => {
      const cursor = (ev.target as IDBRequest).result;
      if (cursor == null) {
        resolve(Array.from(levels).sort());
        return;
      }
      const flashCard: FlashCard = cursor.value;
      for (const l of flashCard.word.level) levels.add(l);
      cursor.continue();
    };
    req.onerror = (ev) => reject((ev.target as IDBRequest).error);
  });

export const getLearningSet = async (
  level: string,
  count: number,
  part?: number,
) => {
  return await new Promise<FlashCard[]>((resolve, reject) => {
    const cards: FlashCard[] = [];
    const lower = part != null ? [level, part, 0, 0] : [level, 0, 0, 0];
    const upper =
      part != null
        ? [level, part, Infinity, Infinity]
        : [level, Infinity, Infinity, Infinity];
    const req = db
      .transaction(STORE_NAME, "readonly")
      .objectStore(STORE_NAME)
      .index("learningOrder")
      .openCursor(IDBKeyRange.bound(lower as any, upper as any));
    req.onsuccess = (ev) => {
      const cursor = (ev.target as IDBRequest).result;
      if (cursor == null || cards.length >= count) {
        resolve(cards);
        return;
      }
      cards.push(cursor.value);
      cursor.continue();
    };
    req.onerror = (ev) => {
      reject((ev.target as IDBRequest).error);
    };
  });
};

export const finaliseQuiz = async (cards: FlashCard[]) => {
  const maxLastRevision = await getMaxLastRevision();
  await new Promise<void>((resolve, reject) => {
    const req = db.transaction(STORE_NAME, "readwrite").objectStore(STORE_NAME);
    let processedCount = 0;
    for (const card of cards) {
      card.lastRevision = maxLastRevision + processedCount + 1;
      const updateReq = req.put(card);
      updateReq.onsuccess = () => {
        processedCount++;
        if (processedCount === cards.length) {
          resolve();
        }
      };
      updateReq.onerror = (ev) => {
        reject((ev.target as IDBRequest).error);
      };
    }
  });
};

export const getPartCountForLevel = async (level: string): Promise<number> => {
  return await new Promise<number>((resolve, reject) => {
    let maxPart = 0;
    const req = db
      .transaction(STORE_NAME, "readonly")
      .objectStore(STORE_NAME)
      .openCursor();
    req.onsuccess = (ev) => {
      const cursor = (ev.target as IDBRequest).result;
      if (cursor == null) {
        resolve(maxPart);
        return;
      }
      const flashCard: FlashCard = cursor.value;
      if (flashCard.partsByLevel[level]) {
        maxPart = Math.max(maxPart, flashCard.partsByLevel[level]);
      }
      cursor.continue();
    };
    req.onerror = (ev) => {
      reject((ev.target as IDBRequest).error);
    };
  });
};
