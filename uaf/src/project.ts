import {makeProject} from '@motion-canvas/core';
import s00 from './scenes/00-receipts?scene';
import s01 from './scenes/01-provenance?scene';
import s02 from './scenes/02-switchboard?scene';
import s03 from './scenes/03-normal-call?scene';
import s04 from './scenes/04-free?scene';
import s05 from './scenes/05-reuse?scene';
import s06 from './scenes/06-byte-loom?scene';
import s07 from './scenes/07-call-theater?scene';
import s08 from './scenes/08-clocks?scene';
import s09 from './scenes/09-fix?scene';

export default makeProject({scenes: [s00, s01, s02, s03, s04, s05, s06, s07, s08, s09]});
