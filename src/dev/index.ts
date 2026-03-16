import express from "express";
import { env } from "process";

const app = express();
app.use(express.static("www"));

const port = env["PORT"] || 3000;
app.listen(port, () => {
  console.log(`Development server is running on http://localhost:${port}`);
});
