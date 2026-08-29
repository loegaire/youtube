import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const python = "/home/thinh/proj/youtube/fmstr2/.chatterbox-venv/bin/python";
const generator = path.join(root, "scripts", "generate-narration.py");
const manifest = JSON.parse(fs.readFileSync(path.join(root, "assets", "audio", "narration-segments.json"), "utf8"));
const out = path.join(root, "assets", "audio", "narration-clips");
fs.mkdirSync(out, { recursive: true });
const missing = manifest.filter((item) => !fs.existsSync(path.join(out, `${item.id}-${item.slug}.wav`)));

for (let index = 0; index < missing.length; index += 3) {
  const ids = missing.slice(index, index + 3).map((item) => item.id).join(",");
  console.log(`Narration batch ${Math.floor(index / 3) + 1}/${Math.ceil(missing.length / 3)}: ${ids}`);
  const result = spawnSync(python, [generator, "--ids", ids], {
    cwd: root,
    stdio: "inherit",
    env: {
      ...process.env,
      OMP_NUM_THREADS: "2",
      MKL_NUM_THREADS: "2",
      TOKENIZERS_PARALLELISM: "false",
      NUMBA_CACHE_DIR: "/tmp/shellcode-numba-cache",
      HF_HOME: "/home/thinh/proj/youtube/fmstr2/.chatterbox-models",
    },
  });
  if (result.status !== 0) process.exit(result.status ?? 1);
}
