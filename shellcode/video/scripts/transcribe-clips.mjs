import { copyFileSync, existsSync, readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const manifest = JSON.parse(readFileSync(path.join(root, "assets/audio/narration-segments.json"), "utf8"));
const clips = path.join(root, "assets/audio/narration-clips");
const cli = path.join(root, "node_modules/.bin/hyperframes");
const scratch = path.join(clips, "transcript.json");

for (const [index, item] of manifest.entries()) {
  const wav = path.join(clips, `${item.id}-${item.slug}.wav`);
  const output = path.join(clips, `${item.id}-${item.slug}.transcript.json`);
  const result = spawnSync(cli, [
    "transcribe", wav,
    "--engine", "whisper",
    "--model", "tiny.en",
    "--language", "en",
    "--json",
    "--timeout", "180000",
  ], { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "inherit"] });
  if (result.status !== 0 || !existsSync(scratch)) {
    throw new Error(`Transcription failed for ${path.basename(wav)}: ${result.stdout}`);
  }
  copyFileSync(scratch, output);
  process.stdout.write(`ASR ${index + 1}/${manifest.length}: ${item.id}\n`);
}
