// Minimal TypeScript shims for three examples used in this project.
// This avoids TS7016 errors when importing from 'three' examples paths.

declare module 'three/examples/jsm/loaders/GLTFLoader.js' {
  import { Loader } from 'three';
  export class GLTFLoader extends Loader {
    load(url: string, onLoad?: (gltf: any) => void, onProgress?: any, onError?: (err: any) => void): void;
  }
}

declare module 'three/examples/jsm/controls/OrbitControls.js' {
  import { Camera } from 'three';
  export class OrbitControls {
    constructor(object: Camera, domElement?: HTMLElement);
    enableDamping: boolean;
    update(): void;
    reset(): void;
    dispose(): void;
  }
}
