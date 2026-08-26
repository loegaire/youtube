import {makeProject} from '@motion-canvas/core';
import scene1 from './scenes/01-hook?scene';
import scene2 from './scenes/02-examples?scene';
import scene3 from './scenes/03-toy-hash?scene';
import scene4 from './scenes/04-sha-inner-workings?scene';

export default makeProject({
  scenes: [scene1, scene2, scene3, scene4],
});
