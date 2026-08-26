import {makeProject} from '@motion-canvas/core';
import scene1 from './scenes/01-hook?scene';
import scene2 from './scenes/02-examples?scene';
import scene3 from './scenes/03-toy-hash?scene';
import scene4 from './scenes/04-sha-inner-workings?scene';
import scene5 from './scenes/05-mini-sha?scene';
import scene6 from './scenes/06-security?scene';
import scene7 from './scenes/07-break-the-toy?scene';

export default makeProject({
  scenes: [scene1, scene2, scene3, scene4, scene5, scene6, scene7],
});
