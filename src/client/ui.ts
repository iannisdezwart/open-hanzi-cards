import type { FlashCard, QuizCard } from "./models";

export const ui = {
  app: document.getElementById("app")!,

  posName(pos: string) {
    const mapping: Record<string, string> = {
      a: "adjective",
      ad: "adjective as adverbial",
      ag: "adjective morpheme",
      an: "adjective with nominal function",
      b: "non-predicate adjective",
      c: "conjunction",
      d: "adverb",
      dg: "adverb morpheme",
      e: "interjection",
      f: "directional locality",
      g: "morpheme",
      h: "prefix",
      i: "idiom",
      j: "abbreviation",
      k: "suffix",
      l: "fixed expression",
      m: "numeral",
      mg: "numeric morpheme",
      mq: "measure word",
      n: "common noun",
      ng: "noun morpheme",
      nr: "personal name",
      ns: "place name",
      nt: "organisation name",
      nx: "nominal character string",
      nz: "other proper noun",
      o: "onomatopoeia",
      p: "preposition",
      q: "quantifier",
      r: "pronoun",
      rg: "pronoun morpheme",
      s: "space word",
      t: "time word",
      tg: "time word morphene",
      u: "auxiliary",
      v: "verb",
      vd: "verb as adverbial",
      vg: "verb morpheme",
      vn: "verb with nominal function",
      w: "symbol and non-sential punctuation",
      x: "unclassified item",
      y: "modal particle",
      z: "descriptive",
    };
    if (!(pos in mapping)) {
      console.warn(`Unknown part of speech: ${pos}`);
      return pos;
    }
    return mapping[pos];
  },

  renderControls(
    levels: string[],
    selectedLevel: string,
    totalParts: number,
    quizSize: number,
    stats: { count: number; avgRevision: number },
    onLevelChange: (lvl: string) => void,
    onPartChange: (part: number) => void,
    onSizeChange: (size: number) => void,
    selectedPart?: number,
  ) {
    const controls = document.getElementById("controls")!;
    const levelOptions = levels
      .map((l) => /* html */ `<option value="${l}">${l}</option>`)
      .join("");
    const partOptionsArr = [
      /* html */ `<option value="all">All parts</option>`,
      ...Array.from({ length: totalParts }, (_, i) => {
        const part = i + 1;
        return /* html */ `<option value="${part}">Part ${part}</option>`;
      }),
    ];
    const partOptions = partOptionsArr.join("");

    const avgRevisionStr = new Intl.NumberFormat("en", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(stats.avgRevision);
    const statsHtml = /* html */ `
    <div id="controls-stats">
      cards: ${stats.count}, avg rev: ${avgRevisionStr}
    </div>
    `;

    controls.innerHTML = /* html */ `
    <div class="row">
      <label for="level-select">Level:</label>
      <select id="level-select">
        ${levelOptions}
      </select>
      <label for="part-select">Part:</label>
      <select id="part-select">
        ${partOptions}
      </select>
      <label for="quiz-size">Cards in quiz:</label>
      <input type="number" id="quiz-size" min="1" value="${quizSize}" max="${stats.count}">
      <button id="settings">⚙️</button>
    </div>
    <div class="row">
      ${statsHtml}
    </div>
    `;

    const lvlSelect = controls.querySelector(
      "#level-select",
    ) as HTMLSelectElement;
    if (!levels.includes(selectedLevel) && levels.length > 0) {
      selectedLevel = levels[0];
    }
    lvlSelect.value = selectedLevel;
    lvlSelect.addEventListener("change", () => onLevelChange(lvlSelect.value));

    const partSelect = controls.querySelector(
      "#part-select",
    ) as HTMLSelectElement;
    partSelect.value =
      selectedPart == null ? "all" : String(Math.min(selectedPart, totalParts));
    partSelect.addEventListener("change", () => {
      const val = partSelect.value;
      if (val === "all") {
        onPartChange(null as any);
      } else {
        onPartChange(parseInt(val));
      }
    });

    // quiz size input handling
    if (onSizeChange) {
      const sizeInput = controls.querySelector(
        "#quiz-size",
      ) as HTMLInputElement;
      sizeInput.value = String(quizSize);
      sizeInput.max = stats ? String(stats.count) : "";
      sizeInput.addEventListener("change", () => {
        const val = parseInt(sizeInput.value);
        if (!isNaN(val) && val >= 1) {
          onSizeChange(val);
        }
      });
    }
  },

  quizProgressBar(current: number, total: number) {
    return /* html */ `
    <div class="quiz-progress">Question ${current} of ${total}</div>
    `;
  },

  displayFlashCard(
    quizCard: QuizCard,
    revisionDeltaStr: string,
    revisionLevelDelta: number,
    progress: { current: number; total: number },
    onNext: () => void,
  ) {
    const card = quizCard.card;
    const newRevisionLevelStr = new Intl.NumberFormat("en", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(card.revisionLevel);
    this.app.innerHTML = /* html */ `
    <div class="flash-card">
      <div class="top-left-corner">
        <a
          href="https://hanzicraft.com/character/${encodeURIComponent(card.word.simplified)}"
          class="info-button" target="_blank">👁️‍🗨️</a>
        <a
          href="https://www.purpleculture.net/sample-sentences/?word=${encodeURIComponent(card.word.simplified)}"
          class="info-button" target="_blank">💬</a>
      </div>
      <div class="top-right-corner">
        <button class="tts-button">🔊</button>
      </div>
      <h1>${card.word.simplified}</h1>
      <div class="pos">
        ${card.word.pos.map((p) => /* html */ `<span>${this.posName(p)}</span>`).join("")}
      </div>
      <p class="starred">Starred: ${card.starred}</p>
      <p class="revision-level">
        RevisionLevel: ${newRevisionLevelStr}
        <span class="${revisionLevelDelta > 0 ? "positive" : "negative"}">
          ${revisionDeltaStr}
        </span>
      </p>
      ${card.word.forms
        .map(
          (form) => /* html */ `
          <p class="pinyin">${form.transcriptions.pinyin}</p>
          <p class="traditional">${form.traditional}</p>
          <ol>
            ${form.meanings.map((m) => /* html */ `<li>${m}</li>`).join("")}
          </ol>
          `,
        )
        .join("")}
      <button id="next-button">Next</button>
    </div>
    ${this.quizProgressBar(progress.current, progress.total)}
    `;
    const nextButton = document.getElementById("next-button")!;
    nextButton.addEventListener("click", onNext);
    setTimeout(() => nextButton.focus(), 0);
    const ttsBtn = document.querySelector(".tts-button")!;
    ttsBtn.addEventListener("click", () => this.playTts(card));

    if (
      quizCard.learningType === "mandarin_pinyin_to_english" ||
      quizCard.learningType === "english_to_mandarin"
    ) {
      this.playTts(card);
    }
  },

  registerAnswerInput(onSubmit: () => void) {
    document
      .getElementById("submit-answer")!
      .addEventListener("click", onSubmit);
    const input = document.getElementById("answer-input")!;
    input.focus();
    input.addEventListener("keydown", (ev) => {
      if (ev.key != "Enter") {
        return;
      }
      onSubmit();
      ev.stopPropagation();
    });
  },

  displayQuestionMandarinPinyinToEnglish(
    card: FlashCard,
    progress: { current: number; total: number },
    onSubmit: () => void,
  ) {
    const pinyin = new Set(card.word.forms.map((f) => f.transcriptions.pinyin));
    this.app.innerHTML = /* html */ `
    <div class="question">
      <div class="top-right-corner">
        <button class="tts-button">🔊</button>
      </div>
      <h1>${card.word.simplified}</h1>
      <p>${Array.from(pinyin).join(" / ")}</p>
      <input type="text" placeholder="Enter the English meaning" id="answer-input">
      <button id="submit-answer">Submit</button>
    </div>
    ${this.quizProgressBar(progress.current, progress.total)}
    `;
    this.registerAnswerInput(onSubmit);
    const ttsBtn = document.querySelector(".tts-button")!;
    ttsBtn.addEventListener("click", () => this.playTts(card));
    this.playTts(card);
  },

  displayQuestionMandarinToPinyin(
    card: FlashCard,
    progress: { current: number; total: number },
    onSubmit: () => void,
  ) {
    this.app.innerHTML = /* html */ `
    <div class="question">
      <h1>${card.word.simplified}</h1>
      <input type="text" placeholder="Enter the pinyin" id="answer-input">
      <button id="submit-answer">Submit</button>
    </div>
    ${this.quizProgressBar(progress.current, progress.total)}
    `;
    this.registerAnswerInput(onSubmit);
  },

  displayQuestionEnglishToPinyin(
    card: FlashCard,
    progress: { current: number; total: number },
    onSubmit: () => void,
  ) {
    this.app.innerHTML = /* html */ `
    <div class="question">
      ${card.word.forms
        .map(
          (form) => /* html */ `
          <ol>
            ${form.meanings.map((m) => /* html */ `<li>${m}</li>`).join("")}
          </ol>
          `,
        )
        .join("")}
      <input type="text" placeholder="Enter the pinyin" id="answer-input">
      <button id="submit-answer">Submit</button>
    </div>
    ${this.quizProgressBar(progress.current, progress.total)}
    `;
    this.registerAnswerInput(onSubmit);
  },

  displayQuestionEnglishToMandarin(
    card: FlashCard,
    progress: { current: number; total: number },
  ) {
    const simplifiedLetters = card.word.simplified.split("");
    this.app.innerHTML = /* html */ `
    <div class="question">
      <div class="top-right-corner">
        <button class="tts-button">🔊</button>
      </div>
      ${card.word.forms
        .map(
          (form) => /* html */ `
          <p class="pinyin">${form.transcriptions.pinyin}</p>
          <ol>
            ${form.meanings.map((m) => /* html */ `<li>${m}</li>`).join("")}
          </ol>
          `,
        )
        .join("")}
      <div class="hanzi-writer">
        <p>Write the character(s):</p>
        ${simplifiedLetters
          .map(
            (_, i) => /* html */ `
            <div class="hanzi-char" id="hanzi-char-${i}"></div>
            `,
          )
          .join("")}
      </div>
      ${this.quizProgressBar(progress.current, progress.total)}
    </div>
    `;

    const ttsBtn = document.querySelector(".tts-button")!;
    ttsBtn.addEventListener("click", () => this.playTts(card));
    this.playTts(card);
  },

  playTts(card: FlashCard) {
    const url = `res/audio/${encodeURIComponent(card.word.simplified)}.mp3`;
    const audio = new Audio(url);
    audio.play();
  },
};
