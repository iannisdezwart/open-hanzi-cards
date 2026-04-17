import {
  downloadOfflineAudio,
  downloadOfflineStrokes,
  initOfflineDb,
} from "./offline";
import { startQuizController } from "./quiz-controller";
import { initWordsDb } from "./words";

export async function startApp() {
  await initWordsDb();
  await initOfflineDb();
  await startQuizController();
  await downloadOfflineAudio();
  await downloadOfflineStrokes();
}
