declare module '*.wav' {
  const source: string;
  export default source;
}

declare module '*?scene' {
  import {FullSceneDescription} from '@motion-canvas/core';
  const scene: FullSceneDescription;
  export default scene;
}
