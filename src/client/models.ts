// Shared type definitions and constants used across the client-side code

export type Form = {
  traditional: string;
  transcriptions: {
    pinyin: string;
    numeric: string;
    wadegiles: string;
    bopomofo: string;
    romatzyh: string;
  };
  meanings: string[];
  classifiers: string[];
};

export type Word = {
  simplified: string;
  radical: string;
  level: string[];
  frequency: number;
  pos: string[];
  forms: Form[];
};

export const REVISION_LEVEL_DELTA = 0.1;

export type FlashCard = {
  word: Word;
  starred: boolean;

  // 0 = new, 1 = mastered.
  // Any time the user gets it right, increases by REVISION_LEVEL_DELTA.
  // Any time they get it wrong, decreased by REVISION_LEVEL_DELTA.
  revisionLevel: number;

  // Number of times the user has revised this card.
  timesRevised: number;

  // Integer respresenting how long ago the user revised this card.
  // First card revised gets 1, second gets 2, etc. When the user revises a
  // card, update this to be the current highest revision + 1.
  lastRevision: number;

  // How well the user knows this card. The formula used to calculate this is:
  // RevisionLevel * exp(-1 * (MaxLastRevision - LastRevision) / (2 * TotalCards))
  // Is updated before each quiz round is started.
  knowledgeLevel: number;

  // Compound key, storing the level, part, knowledgeLevel & frequency.
  // Necessary for the learningOrder index.
  // (multiEntry compound indexes are not supported in IndexedDb API.)
  // Tuple layout: [level, part, knowledgeLevel, frequency]
  learningOrder: [string, number, number, number][];

  // Map of level -> part number (1-indexed). Precomputed during initDb().
  // E.g. { "new-1": 1, "old-1": 2 } means this card is part 1 of new-1, part 2 of old-1.
  partsByLevel: Record<string, number>;
};

export type Result = {
  revisionLevelDelta: number;
};

export const LEARNING_TYPES = [
  "mandarin_pinyin_to_english",
  "mandarin_to_pinyin",
  "english_to_pinyin",
  "english_to_mandarin",
] as const;

export const LEARNING_TYPE_UNLOCK_LEVELS: Record<LearningType, number> = {
  mandarin_pinyin_to_english: 0,
  mandarin_to_pinyin: 0.1,
  english_to_pinyin: 0.2,
  english_to_mandarin: 0.3,
};

export type LearningType = (typeof LEARNING_TYPES)[number];

export type QuizCard = {
  card: FlashCard;
  learningType: LearningType;
};
