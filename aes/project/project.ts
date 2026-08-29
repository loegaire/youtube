import {makeProject} from '@motion-canvas/core';
import narration from './audio/narration.wav';

import intro from './src/scenes/intro?scene';
import gfMath from './src/scenes/gfMath?scene';
import stateMatrix from './src/scenes/stateMatrix?scene';
import subBytes from './src/scenes/subBytes?scene';
import shiftRows from './src/scenes/shiftRows?scene';
import mixColumns from './src/scenes/mixColumns?scene';
import addRoundKey from './src/scenes/addRoundKey?scene';
import keyExpansion from './src/scenes/keyExpansion?scene';
import roundStructure from './src/scenes/roundStructure?scene';
import walkthrough from './src/scenes/walkthrough?scene';
import decryption from './src/scenes/decryption?scene';
import conclusion from './src/scenes/conclusion?scene';

export default makeProject({
  audio: narration,
  scenes: [
    intro,
    gfMath,
    stateMatrix,
    subBytes,
    shiftRows,
    mixColumns,
    addRoundKey,
    keyExpansion,
    roundStructure,
    walkthrough,
    decryption,
    conclusion,
  ],
});
