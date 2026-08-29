import narration from '../audio/narration-segments.json';
import measuredTiming from '../data/timing.json';

export type Mode = 'recap' | 'source' | 'stack' | 'nx' | 'canary' | 'aslr' | 'pie' | 'relro' | 'summary';

export interface StoryBeat {
  id: string;
  number: number;
  duration: number;
  text: string;
  title: string;
  mode: Mode;
  evidence: string;
}

const titles = [
  'The exploit we already built', 'The uncomfortable laboratory conditions', 'Title and historical honesty',
  'The evidence lab', 'The build is part of the evidence', 'Five binaries, one source-level defect', 'The baseline source', 'The compiler already warns us',
  'Baseline: executable stack', 'Baseline: predictable placement', 'NX changes one permission', 'What the ELF header says', 'The page permission experiment', 'The history without mythology', 'When data cannot become code', 'The limitation of NX',
  'A canary is a tripwire', 'Reading the canary evidence', 'The guard lives beside the return path', 'What corruption changes', 'The check happens before ret', 'Why leakage changes the story', 'Canary history and scope', 'The canary is not a fix', 'The next assumption',
  'ASLR moves the map', 'The map is a runtime fact', 'Offsets still survive', 'The original PaX idea', 'A leak changes the search space', 'Exact base-plus-offset arithmetic', 'Entropy is not magic', 'ASLR is a moving target',
  'PIE moves the main binary', 'The ELF type matters', 'The same arithmetic returns', 'PIE joins ASLR', 'Main code is no longer a fixed island',
  'RELRO hardens relocation data', 'A GOT slot is a loader decision', 'Partial is not full', 'The runtime page tells the truth', 'Immediate binding changes the page', 'A historical engineering chain', 'Read-only is not secret', 'What RELRO does not stop', 'The final mitigation transition',
  'Build the summary only after the evidence', 'Same bug, different failure point', 'Why layers matter', 'Mitigation is not repair', 'Ret2libc now has a reason', 'Research wall and closing',
];

const evidenceByMode: Record<Mode, string> = {
  recap: 'evidence/raw/20-vuln-plain-greet-disassembly.txt',
  source: 'src/vuln.c → compiler warning',
  stack: 'objdump -d -M intel -S --disassemble=greet',
  nx: 'readelf -W -l → GNU_STACK',
  canary: 'objdump + TLS guard probe',
  aslr: 'cat /proc/<pid>/maps',
  pie: 'readelf -h → Type: DYN',
  relro: 'objdump -R + /proc/<pid>/maps',
  summary: 'evidence bundle → measured conclusions',
};

const durationById = new Map(measuredTiming.clips.map((clip) => [clip.id, clip.duration]));

export const beats: StoryBeat[] = narration.map((entry, index) => ({
  id: entry.id,
  number: index + 1,
  // Scene time follows the accepted owner-voice delivery, never a nominal
  // script duration.  The finalizer writes this after measuring every clip.
  duration: durationById.get(entry.id) ?? entry.duration,
  text: entry.text,
  title: titles[index] ?? entry.id,
  mode: index < 3 ? 'recap' : index < 8 ? 'source' : index < 10 ? 'stack' : index < 16 ? 'nx' : index < 25 ? 'canary' : index < 33 ? 'aslr' : index < 38 ? 'pie' : index < 47 ? 'relro' : 'summary',
  evidence: evidenceByMode[index < 3 ? 'recap' : index < 8 ? 'source' : index < 10 ? 'stack' : index < 16 ? 'nx' : index < 25 ? 'canary' : index < 33 ? 'aslr' : index < 38 ? 'pie' : index < 47 ? 'relro' : 'summary'],
}));

export const chapterStarts = new Set([1, 4, 9, 11, 17, 26, 34, 39, 48]);
