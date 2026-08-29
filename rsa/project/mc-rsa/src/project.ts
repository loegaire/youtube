import {makeProject} from '@motion-canvas/core';

import scene1 from './scenes/scene1KeyGen?scene';
import scene2 from './scenes/scene2KeyGenMath?scene';
import scene3 from './scenes/scene3Encrypt?scene';
import scene4 from './scenes/scene4Decrypt?scene';
import scene5 from './scenes/scene5Euler?scene';
import scene6 from './scenes/scene6Group?scene';
import scene7 from './scenes/scene7Primes?scene';
import scene8 from './scenes/scene8FastExp?scene';
import scene9 from './scenes/scene9CRT?scene';
import scene10 from './scenes/scene10Garner?scene';
import scene11 from './scenes/scene11CRTExp?scene';
import scene12 from './scenes/scene12KeySize?scene';
import scene13 from './scenes/scene13PrimeAttacks?scene';
import scene14 from './scenes/scene14SideChannel?scene';
import scene15 from './scenes/scene15CCA?scene';
import scene16 from './scenes/scene16Conclusion?scene';

export default makeProject({
  scenes: [
    scene1,
    scene2,
    scene3,
    scene4,
    scene5,
    scene6,
    scene7,
    scene8,
    scene9,
    scene10,
    scene11,
    scene12,
    scene13,
    scene14,
    scene15,
    scene16,
  ],
});
