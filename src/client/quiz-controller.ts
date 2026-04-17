import HanziWriter from "hanzi-writer";
import {
  FlashCard,
  LEARNING_TYPE_UNLOCK_LEVELS,
  LEARNING_TYPES,
  QuizCard,
  Result,
  REVISION_LEVEL_DELTA,
} from "./models";
import { ui } from "./ui";
import { applySign, clamp, levenshtein, shuffleArray } from "./util";
import {
  finaliseQuiz,
  getAllLevels,
  getLearningSet,
  getLevelPartStats,
  getPartCountForLevel,
  updateKnowledgeLevels,
} from "./words";

let selectedLevel = "new-1";
let selectedPart: number | undefined = undefined;
let totalParts = 1;
let quizCardIndex = 0;
let quizCards: QuizCard[] = [];
let quizSize = 7;

async function updateControls() {
  try {
    const levels = await getAllLevels();
    totalParts = await getPartCountForLevel(selectedLevel);

    const stats = await getLevelPartStats(
      selectedLevel,
      selectedPart || undefined,
    );

    ui.renderControls(
      levels,
      selectedLevel,
      totalParts,
      quizSize,
      stats,
      async (lvl) => {
        selectedLevel = lvl;
        selectedPart = undefined;
        await quiz(selectedLevel, selectedPart);
      },
      async (part) => {
        selectedPart = part;
        await quiz(selectedLevel, selectedPart);
      },
      async (size) => {
        quizSize = size;
        await quiz(selectedLevel, selectedPart);
      },
      selectedPart,
    );
  } catch (e) {
    console.warn("Could not update controls:", e);
  }
}

function computeResult(): Result {
  switch (quizCards[quizCardIndex].learningType) {
    case "mandarin_pinyin_to_english":
      return getResultMandarinPinyinToEnglish();
    case "mandarin_to_pinyin":
      return getResultMandarinToPinyin();
    case "english_to_pinyin":
      return getResultEnglishToPinyin();
    case "english_to_mandarin":
      return getResultEnglishToMandarin();
    default:
      throw new Error(
        `Unsupported learning type: ${quizCards[quizCardIndex].learningType}`,
      );
  }
}

function getResultMandarinPinyinToEnglish(): Result {
  const input = document.getElementById("answer-input") as HTMLInputElement;
  const answers = input.value.split(";").map((a) => a.trim().toLowerCase());

  const normalise = (s: string) => s.toLowerCase().trim();

  const expandMeaning = (m: string): string[] => {
    const trimmed = m.trim();

    // If whole meaning is parentheses, keep as-is.
    if (/^\([^()]+\)$/.test(trimmed)) return [normalise(trimmed.slice(1, -1))];

    // Version without parentheses.
    const without = trimmed.replace(/\s*\([^()]*\)/g, "").trim();

    // Version with parentheses content inserted inline.
    const withInline = trimmed.replace(/[()]/g, "");

    return [normalise(without), normalise(withInline)];
  };

  const isClose = (a: string, b: string) => {
    const dist = levenshtein(a, b);
    const maxLen = Math.max(a.length, b.length);
    return dist <= Math.max(1, Math.floor(maxLen * 0.2)); // 20% typo tolerance.
  };

  const isAnswerCorrect = (meaning: string, answer: string) => {
    const normalisedAnswer = normalise(answer);
    const expandedMeanings = meaning.split(";").flatMap(expandMeaning);
    return expandedMeanings.some((m) => isClose(m, normalisedAnswer));
  };

  const possibleAnswers = quizCards[quizCardIndex].card.word.forms
    .map((f) => f.meanings)
    .flat();
  const allAnswersCorrect = answers.every((answer) =>
    possibleAnswers.some((meaning) => isAnswerCorrect(meaning, answer)),
  );
  return {
    revisionLevelDelta: applySign(allAnswersCorrect, REVISION_LEVEL_DELTA),
  };
}

function getResultMandarinToPinyin(): Result {
  const inputEl = document.getElementById("answer-input") as HTMLInputElement;
  const answer = inputEl.value.trim().toLowerCase().replace(/\s+/g, " ");

  const possibleAnswers = quizCards[quizCardIndex].card.word.forms.map(
    (form) => {
      const numeric = form.transcriptions.numeric?.trim().toLowerCase();
      const noTone = numeric?.replace(/\d/g, "").trim();
      const pinyin = form.transcriptions.pinyin?.trim().toLowerCase();
      const options = [pinyin, numeric, noTone].filter(Boolean);
      return options.some((opt) => opt.replace(/\s+/g, " ") === answer);
    },
  );

  const anyCorrect = possibleAnswers.some((c) => c);
  return { revisionLevelDelta: applySign(anyCorrect, REVISION_LEVEL_DELTA) };
}

function getResultEnglishToPinyin(): Result {
  const inputEl = document.getElementById("answer-input") as HTMLInputElement;
  const answer = inputEl.value.trim().toLowerCase().replace(/\s+/g, " ");

  const possibleAnswers = quizCards[quizCardIndex].card.word.forms.map(
    (form) => {
      const numeric = form.transcriptions.numeric?.trim().toLowerCase();
      const noTone = numeric?.replace(/\d/g, "").trim();
      const pinyin = form.transcriptions.pinyin?.trim().toLowerCase();
      const options = [pinyin, numeric, noTone].filter(Boolean) as string[];
      return options.some((opt) => opt.replace(/\s+/g, " ") === answer);
    },
  );

  const anyCorrect = possibleAnswers.some((c) => c);
  return { revisionLevelDelta: applySign(anyCorrect, REVISION_LEVEL_DELTA) };
}

function getResultEnglishToMandarin(): Result {
  const mistakes = hanziWritersMistakes.reduce((a, b) => a + b, 0);
  const totalStrokes = hanziWritersTotalStrokes.reduce((a, b) => a + b, 0);
  const accuracy = (totalStrokes - mistakes) / totalStrokes;

  // At CUTOFF_ACCURACY accuracy or below, the user gets -REVISION_LEVEL_DELTA.
  // At 100% accuracy, the user gets +REVISION_LEVEL_DELTA.
  const CUTOFF_ACCURACY = 0.6;
  const score = 1 - (2 * accuracy - 2) / (CUTOFF_ACCURACY - 1);
  return {
    revisionLevelDelta: REVISION_LEVEL_DELTA * clamp(score, -1, 1),
  };
}

let hanziWritersMistakes: number[] = [];
let hanziWritersTotalStrokes: number[] = [];

function displayFlashCardInternal() {
  const result = computeResult();
  const quizCard = quizCards[quizCardIndex];
  const card = quizCard.card;
  const revisionLevelDelta = result.revisionLevelDelta;
  const revisionLevelDeltaStr = new Intl.NumberFormat("en", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    signDisplay: "always",
  }).format(revisionLevelDelta);
  card.revisionLevel = clamp(card.revisionLevel + revisionLevelDelta, 0, 1);
  card.timesRevised += 1;
  const progress = { current: quizCardIndex + 1, total: quizCards.length };
  ui.displayFlashCard(
    quizCard,
    revisionLevelDeltaStr,
    revisionLevelDelta,
    progress,
    quizNextQuestionPressed,
  );
}

function displayQuizCard() {
  const quizCard = quizCards[quizCardIndex];
  const progress = { current: quizCardIndex + 1, total: quizCards.length };
  switch (quizCard.learningType) {
    case "mandarin_pinyin_to_english":
      ui.displayQuestionMandarinPinyinToEnglish(
        quizCard.card,
        progress,
        quizSubmitAnswerPressed,
      );
      break;
    case "mandarin_to_pinyin":
      ui.displayQuestionMandarinToPinyin(
        quizCard.card,
        progress,
        quizSubmitAnswerPressed,
      );
      break;
    case "english_to_pinyin":
      ui.displayQuestionEnglishToPinyin(
        quizCard.card,
        progress,
        quizSubmitAnswerPressed,
      );
      break;
    case "english_to_mandarin":
      ui.displayQuestionEnglishToMandarin(quizCard.card, progress);
      initHanziWriter(quizCard.card);
      break;
    default:
      throw new Error(`Unsupported learning type: ${quizCard.learningType}`);
  }
}

function initHanziWriter(card: FlashCard) {
  const simplifiedChars = card.word.simplified.split("");
  hanziWritersMistakes = new Array(simplifiedChars.length).fill(0);
  hanziWritersTotalStrokes = new Array(simplifiedChars.length).fill(0);
  let completed = 0;
  for (let idx = 0; idx < simplifiedChars.length; idx++) {
    const writer = HanziWriter.create(
      document.querySelector<HTMLElement>(`#hanzi-char-${idx}`)!,
      simplifiedChars[idx],
      {
        width: 150,
        height: 150,
        showCharacter: false,
        showOutline: card.revisionLevel < 0.4,
        showHintAfterMisses: 1,
        highlightOnComplete: true,
        padding: 5,
      },
    );
    writer.quiz({
      onComplete: () => {
        completed++;
        if (completed === simplifiedChars.length) {
          setTimeout(() => {
            quizSubmitAnswerPressed();
          }, 1000);
        }
      },
      onMistake: () => {
        hanziWritersMistakes[idx]++;
      },
      onCorrectStroke: () => {
        hanziWritersTotalStrokes[idx]++;
      },
    });
  }
}

function quizSubmitAnswerPressed() {
  displayFlashCardInternal();
}

async function quizNextQuestionPressed() {
  quizCardIndex++;
  if (quizCardIndex >= quizCards.length) {
    await finaliseQuiz(quizCards.map((q) => q.card));
    await updateKnowledgeLevels(selectedLevel);
    await quiz(selectedLevel, selectedPart);
  } else {
    displayQuizCard();
  }
}

export async function quiz(level: string, part?: number) {
  await updateControls();

  try {
    const partCards = await getLearningSet(level, quizSize, part);
    quizCardIndex = 0;
    quizCards = shuffleArray(
      partCards
        .map((card) =>
          LEARNING_TYPES.filter(
            (lt) => card.revisionLevel >= LEARNING_TYPE_UNLOCK_LEVELS[lt],
          ).map((lt) => ({ card, learningType: lt })),
        )
        .flat(),
    );
    displayQuizCard();
  } catch (e) {
    console.warn("Could not load quiz cards:", e);
  }
}

export async function startQuizController() {
  await quiz(selectedLevel, selectedPart);
}
