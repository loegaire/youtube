import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
globalThis.window = globalThis;
await import(pathToFileURL(path.join(root, "assets", "segments.js")));
const segments = globalThis.SHELLCODE_SEGMENTS;

const stamp = (seconds, comma = true) => {
  const ms = Math.max(0, Math.round(seconds * 1000));
  const h = Math.floor(ms / 3_600_000);
  const m = Math.floor((ms % 3_600_000) / 60_000);
  const s = Math.floor((ms % 60_000) / 1000);
  const tail = ms % 1000;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}${comma ? "," : "."}${String(tail).padStart(3, "0")}`;
};

const slug = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const script = [
  "# Bytes Under the Spotlight — owner-voice narration",
  "",
  ...segments.flatMap((seg, index) => [
    `## ${String(index).padStart(2, "0")} — ${seg.title}`,
    "",
    seg.narration,
    "",
  ]),
].join("\n");
fs.writeFileSync(path.join(root, "SCRIPT.md"), script);

const storyboard = [
  "---",
  "mode: autonomous",
  "message: \"Bytes become behavior only when control flow treats them as instructions and defenses allow the path.\"",
  "audience: \"curious beginner hackers\"",
  "duration: 1265",
  "fps: 24",
  "current: left",
  "---",
  "",
  "# Storyboard",
  "",
  "Every frame uses staged reveals plus a leftward cut-the-curve seam. The persistent",
  "carrier is the stage itself; inside it, the byte, spotlight, ticket, or train performs",
  "the causal action. Motion recipes: `waterfall-entry`, `viewport-change`,",
  "`reactive-displacement`, `control-target-sync`, and `svg-path-draw`.",
  "",
  ...segments.flatMap((seg, index) => [
    `## Frame ${String(index + 1).padStart(2, "0")} — ${seg.title}`,
    "",
    "status: animated",
    `src: index.html#scene-${index}`,
    `time: ${seg.start}-${seg.end}s`,
    `world: ${seg.world}`,
    "motion: staged reveals + viewport-change + cut-the-curve LEFT",
    `beat: ${seg.beats.join(" → ")}`,
    "",
  ]),
].join("\n");
fs.writeFileSync(path.join(root, "STORYBOARD.md"), storyboard);

const narrationManifest = segments.map((seg, index) => ({
  id: String(index).padStart(2, "0"),
  slug: slug(seg.title),
  start: seg.start,
  end: seg.end,
  duration: seg.duration,
  text: seg.narration,
  words: seg.narration.trim().split(/\s+/).length,
  wpm_budget: Number((seg.narration.trim().split(/\s+/).length / seg.duration * 60).toFixed(1)),
}));
fs.mkdirSync(path.join(root, "assets", "audio"), { recursive: true });
fs.writeFileSync(
  path.join(root, "assets", "audio", "narration-segments.json"),
  JSON.stringify(narrationManifest, null, 2) + "\n",
);

const cues = [];
for (const seg of segments) {
  const words = seg.narration.trim().split(/\s+/);
  const chunks = [];
  for (let cursor = 0; cursor < words.length;) {
    let stop = Math.min(cursor + 7, words.length);
    for (let i = cursor + 4; i < Math.min(cursor + 9, words.length); i++) {
      if (/[,!?;:.]$/.test(words[i])) {
        stop = i + 1;
        break;
      }
    }
    chunks.push(words.slice(cursor, stop));
    cursor = stop;
  }
  let at = seg.start;
  for (const chunk of chunks) {
    const duration = seg.duration * chunk.length / words.length;
    cues.push({ start: at, end: Math.min(seg.end, at + duration - 0.05), text: chunk.join(" ") });
    at += duration;
  }
}

fs.mkdirSync(path.join(root, "assets", "captions"), { recursive: true });
const srt = cues.flatMap((cue, index) => [
  String(index + 1),
  `${stamp(cue.start)} --> ${stamp(cue.end)}`,
  cue.text,
  "",
]).join("\n");
fs.writeFileSync(path.join(root, "assets", "captions", "shellcode-explainer.srt"), srt);
fs.writeFileSync(
  path.join(root, "assets", "captions", "cues.js"),
  `window.SHELLCODE_CAPTION_CUES = ${JSON.stringify(cues)};\n`,
);

const assHeader = `[Script Info]
ScriptType: v4.00+
PlayResX: 1920
PlayResY: 1080
ScaledBorderAndShadow: yes

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: House,JetBrainsMono Nerd Font,56,&H00EEF3F1,&H009ACB8C,&H00110D0A,&HD0110D0A,-1,0,0,0,100,100,-1,0,3,3,0,2,120,120,38,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
`;
const ass = cues.map((cue) =>
  `Dialogue: 0,${stamp(cue.start, false).replace(/^00:/, "0:")},${stamp(cue.end, false).replace(/^00:/, "0:")},House,,0,0,0,,{\\c&H009ACB8C&}> {\\c&H00EEF3F1&}${cue.text.replaceAll("{", "\\{").replaceAll("}", "\\}")}`,
).join("\n");
fs.writeFileSync(path.join(root, "assets", "captions", "shellcode-explainer.ass"), assHeader + ass + "\n");

const ledger = {
  fps: 24,
  seams: segments.slice(1).map((seg, index) => ({
    id: `scene-${index}->scene-${index + 1}`,
    cut: seg.start,
    technique: "cut-the-curve LEFT",
    exit: { selector: `#scene-${index} .stage`, axis: "x", dir: -1, dur: 0.48 },
    entry: { selector: `#scene-${index + 1} .stage`, axis: "x", dir: -1, dur: 0.52, travel: 11.5 },
  })),
};
fs.writeFileSync(path.join(root, "ledger.json"), JSON.stringify(ledger, null, 2) + "\n");

const totalWords = narrationManifest.reduce((sum, item) => sum + item.words, 0);
const overBudget = narrationManifest.filter((item) => item.wpm_budget > 170);
const budget = {
  duration_s: 1265,
  total_words: totalWords,
  overall_wpm: Number((totalWords / 1265 * 60).toFixed(1)),
  over_170_wpm: overBudget.map(({ id, slug: segment, wpm_budget }) => ({ id, segment, wpm_budget })),
};
fs.writeFileSync(path.join(root, "assets", "audio", "narration-budget.json"), JSON.stringify(budget, null, 2) + "\n");
console.log(JSON.stringify({ segments: segments.length, cues: cues.length, ...budget }, null, 2));
