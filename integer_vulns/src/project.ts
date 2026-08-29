import {makeProject} from '@motion-canvas/core';
import narration from '../audio/final-mix.wav';

import s00 from './scenes/00-hook?scene';
import s01 from './scenes/01-evidence?scene';
import s02 from './scenes/02-source?scene';
import s03 from './scenes/03-odometer?scene';
import s04 from './scenes/04-wheel?scene';
import s05 from './scenes/05-trigger?scene';
import s06 from './scenes/06-dominoes?scene';
import s07 from './scenes/07-mismatch?scene';
import s08 from './scenes/08-signedness?scene';
import s09 from './scenes/09-addition?scene';
import s10 from './scenes/10-underflow?scene';
import s11 from './scenes/11-truncation?scene';
import s12 from './scenes/12-bounds?scene';
import s13 from './scenes/13-conversion?scene';
import s14 from './scenes/14-allocation?scene';
import s15 from './scenes/15-heap?scene';
import s16 from './scenes/16-index?scene';
import s17 from './scenes/17-pointer?scene';
import s18 from './scenes/18-architecture?scene';
import s19 from './scenes/19-disasm?scene';
import s20 from './scenes/20-fix?scene';
import s21 from './scenes/21-checklist?scene';
import s22 from './scenes/22-outro?scene';

export default makeProject({
  audio: narration,
  scenes: [s00, s01, s02, s03, s04, s05, s06, s07, s08, s09, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22],
});
