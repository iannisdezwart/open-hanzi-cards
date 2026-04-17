import esbuild from "esbuild";
import { writeFileSync } from "fs";
import { staticPageUtils } from "static-page-utils";
import { makePageShell } from "static-page-utils/page-shell/page-shell.js";
import { Settings } from "static-page-utils/settings.js";

const prefix = process.env["WEB_PREFIX"] || "";
const settings = {
  webroot: "www",
  cacheDir: "cache",
  prefix,
  logger: (lvl, msg) => {
    console.log(`[${lvl}] ${msg}`);
  },
} satisfies Settings;

const utils = staticPageUtils(settings);

const build = async () => {
  await esbuild.build({
    entryPoints: ["dist/client/index.js"],
    bundle: true,
    platform: "browser",
    format: "iife",
    globalName: "OpenHanziCards",
    outfile: "www/scripts/app.js",
    target: ["es2020"],
    logLevel: "info",
  });
  const shell = makePageShell(settings)({
    head: /* html */ `
    ${await utils.sass.import("src/client/styles/styles.sass")}
    `,
    tail: /* html */ `
    <script src="${prefix}/scripts/app.js"></script>
    <script>window.OpenHanziCards.startApp();</script>
    ${utils.pwa.importPwaServiceWorker("dist/pwa/service-worker.js")}
    `,
  });
  await utils.pwa.createManifest(
    {
      name: "OpenHanziCards",
      icon: { svg: "src/client/svg/icon.svg", png: "src/client/png/icon.png" },
      startURL: "/",
      backgroundColour: "#fff",
      themeColour: "#000",
      categories: ["education"],
      description:
        "Free web-based flash card app for learning Chinese vocabulary and characters",
      display: "standalone",
      lang: "en-UK",
      orientation: "portrait",
    },
    shell,
  );
  const page = await shell.build({
    lang: "en-UK",
    title: "OpenHanziCards",
    body: /* html */ `
    <h1>OpenHanziCards</h1>
    <div id="controls" class="controls"></div>
    <div id="app"></div>
    `,
    seo: {
      description: "Flash cards for HSK vocabulary",
      keywords: ["hsk", "flash cards", "chinese", "mandarin"],
      author: "Iannis de Zwart",
    },
  });
  utils.res.link("words.json");
  utils.res.link("tts/audio");
  utils.res.link("tts/offline-tts-bundle.zip");
  utils.res.link("strokes/offline-strokes-bundle.zip");
  writeFileSync("www/index.html", page);
};

build();
