/// <reference types="vite/client" />

declare module '*?raw' {
  const text: string;
  export default text;
}

declare module '*?scene' {
  import {FullSceneDescription} from '@motion-canvas/core';
  const scene: FullSceneDescription;
  export default scene;
}
