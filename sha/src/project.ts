import {makeProject} from '@motion-canvas/core';
import scene1 from './scenes/01-hook?scene';
import scene2 from './scenes/02-examples?scene';
import scene3 from './scenes/03-toy-hash?scene';
import scene4 from './scenes/04-sha-inner-workings?scene';
import scene5 from './scenes/05-mini-sha?scene';
import scene6 from './scenes/06-security?scene';
import scene7 from './scenes/07-break-the-toy?scene';
import scene8 from './scenes/08-toy-hash-source?scene';
import scene9 from './scenes/09-executing-toy-hash?scene';
import scene10 from './scenes/10-why-not-sha?scene';
import scene11 from './scenes/11-hashing-speed?scene';
import scene12 from './scenes/12-hashing-vs-plaintext?scene';
import scene13 from './scenes/13-breaking-sha?scene';
import scene14 from './scenes/14-sha256-vs-sha1?scene';
import scene15 from './scenes/15-attacking-toy?scene';
import scene16 from './scenes/16-other-failures?scene';
import scene17 from './scenes/17-return-sha256?scene';
import scene18 from './scenes/18-final-summary?scene';

export default makeProject({
  scenes: [scene1, scene2, scene3, scene4, scene5, scene6, scene7, scene8, scene9, scene10, scene11, scene12, scene13, scene14, scene15, scene16, scene17, scene18],
});
