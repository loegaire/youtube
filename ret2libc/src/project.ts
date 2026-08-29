import {makeProject} from '@motion-canvas/core';
import s00 from './scenes/00?scene';
import s01 from './scenes/01?scene';
import s02 from './scenes/02?scene';
import s03 from './scenes/03?scene';
import s04 from './scenes/04?scene';
import s05 from './scenes/05?scene';
import s06 from './scenes/06?scene';
import s07 from './scenes/07?scene';
import s08 from './scenes/08?scene';
import s09 from './scenes/09?scene';
import s10 from './scenes/10?scene';
import s11 from './scenes/11?scene';

// Audio is attached only after the owner-voice pilot passes. The final encoder
// refuses to run until scripts/finalize-narration.mjs has produced narration.wav.
export default makeProject({scenes: [s00, s01, s02, s03, s04, s05, s06, s07, s08, s09, s10, s11]});
