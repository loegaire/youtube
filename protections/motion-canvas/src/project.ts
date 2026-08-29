import {makeProject} from '@motion-canvas/core';
import masterAudio from '../audio/narration-with-music.wav';
import binaryDefenses from './scenes/binary-defenses?scene';

export default makeProject({
  audio: masterAudio,
  scenes: [binaryDefenses],
});
