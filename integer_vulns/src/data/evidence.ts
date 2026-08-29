import source from '../../store.c?raw';
import normalRun from '../../evidence/transcripts/normal-run.txt?raw';
import overflowRun from '../../evidence/transcripts/overflow-run.txt?raw';
import objdump from '../../evidence/disassembly/store.objdump.intel.txt?raw';

export const storeSource = source;
export const storeLines = source.split('\n');
export const normalLines = normalRun.split('\n').filter(Boolean);
export const overflowLines = overflowRun
  .split('\n')
  .filter(Boolean)
  .map(line => line.includes('flag not found') ? '[local reconstruction: flag output redacted]' : line);

export const imulLines = objdump
  .split('\n')
  .filter(line => /40061[89bd]|40062[ad]|400633|40064[ad]/.test(line))
  .map(line => line.trim().replace(/^([0-9a-f]+):\s*/, '0x$1  '));

export const sourcePath = '~/ctf/pico/flag_shop/store.c';
export const localBinaryPath = './evidence/bin/store';
