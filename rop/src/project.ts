import {makeProject} from '@motion-canvas/core';
import finalMix from '../audio/final-mix.wav';

import intro from './scenes/00-intro?scene';
import returnMachine from './scenes/01-return-machine?scene';
import challenge from './scenes/02-challenge?scene';
import nx from './scenes/03-nx?scene';
import gadgets from './scenes/04-gadgets?scene';
import target from './scenes/05-target?scene';
import writing from './scenes/06-writing?scene';
import registers from './scenes/07-registers?scene';
import syscall from './scenes/08-syscall?scene';
import notRet2win from './scenes/09-not-ret2win?scene';
import deepIdea from './scenes/10-deep-idea?scene';
import outro from './scenes/11-outro?scene';

export default makeProject({
  audio: finalMix,
  scenes: [
    intro,
    returnMachine,
    challenge,
    nx,
    gadgets,
    target,
    writing,
    registers,
    syscall,
    notRet2win,
    deepIdea,
    outro,
  ],
});
