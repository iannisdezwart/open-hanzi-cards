# OpenHanziCards

Free web-based flash card app for learning Chinese vocabulary and characters.

## Philosophy

I am a believer in free and open educational resources.
This goes hand in hand with [Free and Open-Source Software](https://en.wikipedia.org/wiki/Free_and_open-source_software).

I think that making educational resources freely accessible ultimately creates
more economic value for society than any single company could by selling them.

---

OpenHanziCards emerged from my frustration with the surplus of profit-driven
"all-in-one" Chinese vocabulary learning apps, and the lack of high-quality free
and open-source alternatives.

This is my attempt at creating a completely free flash card-based app for
learning Chinese vocabulary and characters, built using existing free resources,
and based on the official HSK word list — the most widely used standardised
Chinese proficiency test.

- OpenHanziCards is **free and open-source**; I have built it in my free time
  and shared it for free, and I welcome contributions from anyone who shares my
  philosophy. The source code is available on Github under the GPL3 license.

- OpenHanziCards is **lightweight**; there is no back-end — it is just a
  front-end app with minimal dependencies, using modern web technologies, and
  hosted for free on Github Pages.

- OpenHanziCards is **privacy-focused**; the user owns their data, stored
  locally in their browser.

- OpenHanziCards is **learner-centred**; no gamification or attention grabbing
  elements — just a flash card application with a spaced repetition algorithm,
  based on the official HSK word list so it can be used in conjunction with
  other HSK resources.

## Resources used

- [Hanyu Shuiping Kaoshi (HSK)](https://en.wikipedia.org/wiki/Hanyu_Shuiping_Kaoshi)
  - The vocabulary list matches the official Hanyu Shuiping Kaoshi (HSK) list,
    which is the standardised Chinese proficiency test administered by the
    Ministry of Education of the People's Republic of China.
  - The app uses the HSK levels as a way to structure the learning process.
    This way, the user can use other HSK resources for the level they are
    currently learning.
- [drkameleon's HSK word list](https://github.com/drkameleon/complete-hsk-vocabulary).
  - Project aiming to provide complete JSON structured vocabulary lists matching
    the official HSK word list.
  - Maintainer: [Yanis Zafirópulos (aka Dr.Kameleon)](https://github.com/drkameleon).
- [Hanzicraft](https://hanzicraft.com/)
  - Chinese character dictionary with detailed information about characters,
    including decomposition, frequency, meaning, and pronunciation clues.
  - Maintainer: [Niel de la Rouviere](http://nieldlr.com/).
- [Purple Culture](https://www.purpleculture.net/).
  - A Hong Kong-based _for-profit company_ that — besides paid learning
    materials — provides a variety of _free_ Chinese language learning tools.
  - The app uses their example sentences tool, so the user can see the word in
    context.

## Technologies used

- [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)
  - The app uses IndexedDB to store the user's progress and data locally in
    their browser. This allows the user to access their flash cards and
    progress without needing to create an account or log in, while still
    keeping their data persistent across sessions.
- [Progressive Web App (PWA)](https://web.dev/progressive-web-apps/)
  - The app is built as a Progressive Web App, which means it can be installed
    on the user's device and used fully offline.
- [Github Pages](https://pages.github.com/)
  - The app is hosted on Github Pages, which is a free hosting service for
    static websites provided by Github. This allows anyone to access the app
    without needing to set up their own server or hosting.
  - You can also clone the repository and run the app locally, or deploy it
    yourself, if you prefer.
- [Google Text-to-Speech API](https://cloud.google.com/text-to-speech)
  - The gTTS Python API was used to download audio files from Google's Translate
    API for all words in the HSK word list, so the user can listen to the
    correct Chinese pronunciation while learning.
  - The generated audio files come bundled with this repository, so you don't
    need to download everything yourself when using/contributing to the app.
- [Hanziwriter](https://hanziwriter.org/)
  - Free and open-source JavaScript library for Chinese character stroke order
    animations and stroke order practice quizzes.
  - The app uses Hanziwriter to quiz the user on stroke order.
  - Maintainer: [David Chanin](https://chanind.github.io/).
- [PNPM](https://pnpm.io/)
- [esbuild](https://esbuild.github.io/)

## Spaced repetition learning algorithm

The learning algorithm is essentially an algorithmic version of how I used to
practice flash cards for vocabulary exams in high school.

The core ideas are as follows:

- Eventually we need to know all cards well
- Give each card a score from 0–1, we call this the "revision level"
  (0: we don't know the card, 1: we've mastered the card).
- When we get the flash card correct, increase the score, else descrease.
- Introduce a "time component": we keep forgetting what we've learnt. If we
  haven't practiced a card for a while, its score is artifically lowered.
- Practice the cards with the lowest "knowledge level".
- Practice a small set of cards at once (I like 7). This means that if we
  incorrectly answer a card, its "revision level" decreases, so we will see it
  again in the next set.

The formula is as follows:

```
KnowledgeLevel = RevisionLevel * exp(-1, TimeSinceLastRevision / ScalingFactor)
```

The `ScalingFactor` is based on the number of total cards in the learning set.
The `TimeSinceLastRevision` equals how many _other_ cards we have practiced
since the last time we've revised the current card.

## Quiz types

1. Mandarin character + Pinyin → English
2. Mandarin character → Pinyin
3. English → Pinyin
4. English → Mandarin character

The quiz types are "unlocked" as the "revision level" of the card increases.
New cards are just quizzed using type 1, and if the user becomes comfortable
enough with the card, they are quizzed with type 1 and 2, and so on.