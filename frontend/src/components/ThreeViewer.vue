<template>
  <div ref="container" class="three-viewer">
    <LoadingScreen v-if="loading" />
    <div class="controls" role="toolbar" aria-label="Contrôles scène">
      <button
        class="control-btn"
        @click="resetView"
        :disabled="loading"
        title="Reset view"
        aria-label="Reset view"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 6V3L8 7l4 4V8c2.8 0 5 2.2 5 5 0 1.1-.3 2.1-.9 3l1.5 1.5C20.2 16.1 21 14.1 21 12c0-4.97-4.03-9-9-9z"/></svg>
        <span class="btn-text">Reset</span>
      </button>

      <button
        :class="['control-toggle', { active: autoRotate } ]"
        @click="toggleAutoRotate"
        :aria-pressed="autoRotate"
        :disabled="loading"
        title="Auto-rotate"
        aria-label="Auto-rotate"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6a6 6 0 11-6-6z"/></svg>
        <span class="btn-text">Auto-rotate</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import LoadingScreen from './LoadingScreen.vue';

const props = defineProps<{
  modelUrl: string;
  autoRotate?: boolean;
  background?: string;
}>();

const container = ref<HTMLElement | null>(null);
let scene: THREE.Scene | null = null;
let camera: THREE.PerspectiveCamera | null = null;
let renderer: THREE.WebGLRenderer | null = null;
let controls: any = null;
let currentModel: THREE.Group | null = null;

const loading = ref(true);
const autoRotate = ref(!!props.autoRotate);

function init() {
  if (!container.value) return;
  scene = new THREE.Scene();
  scene.background = new THREE.Color(props.background || 0x222222);

  camera = new THREE.PerspectiveCamera(45, container.value.clientWidth / container.value.clientHeight, 0.1, 100);
  camera.position.set(0, 1.5, 3);

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(container.value.clientWidth, container.value.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio || 1);
  container.value.appendChild(renderer.domElement);

  const ambient = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambient);
  const dir = new THREE.DirectionalLight(0xffffff, 0.8);
  dir.position.set(5, 10, 7.5);
  scene.add(dir);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  animate();
  window.addEventListener('resize', onWindowResize);
}

function onWindowResize() {
  if (!container.value || !camera || !renderer) return;
  camera.aspect = container.value.clientWidth / container.value.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.value.clientWidth, container.value.clientHeight);
}

function animate() {
  if (!renderer || !scene || !camera) return;
  requestAnimationFrame(animate);
  if (controls) controls.update();
  if (autoRotate.value && currentModel) {
    currentModel.rotation.y += 0.005;
  }
  renderer.render(scene, camera);
}

function loadModel(url: string) {
  if (!scene) return;
  loading.value = true;
  const loader = new GLTFLoader();
  loader.load(
    url,
    (gltf: any) => {
      if (currentModel && scene) {
        scene.remove(currentModel);
        disposeModel(currentModel);
      }
      currentModel = gltf.scene;
      if (!currentModel) {
        loading.value = false;
        return;
      }
      // center and scale
      if (!scene) {
        loading.value = false;
        return;
      }
      const box = new THREE.Box3().setFromObject(currentModel);
      const size = box.getSize(new THREE.Vector3()).length();
      const center = box.getCenter(new THREE.Vector3());
      currentModel.position.x += (currentModel.position.x - center.x);
      currentModel.position.y += (currentModel.position.y - center.y);
      currentModel.position.z += (currentModel.position.z - center.z);
      const scale = 1.5 / size;
      currentModel.scale.setScalar(scale);

      scene.add(currentModel);
      loading.value = false;
    },
    undefined,
    (err: any) => {
      console.error('Error loading model', err);
      loading.value = false;
    }
  );
}

function disposeModel(obj: any) {
  obj.traverse((child: any) => {
    if (child.isMesh) {
      child.geometry?.dispose();
      if (child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach((m: any) => m.dispose());
        } else {
          child.material.dispose();
        }
      }
    }
  });
}

function toggleAutoRotate() {
  autoRotate.value = !autoRotate.value;
}

function resetView() {
  if (!currentModel) return;
  currentModel.rotation.set(0, 0, 0);
  if (controls) controls.reset();
}

watch(() => props.modelUrl, (newUrl) => {
  if (!newUrl) return;
  loadModel(newUrl);
});

onMounted(() => {
  init();
  if (props.modelUrl) loadModel(props.modelUrl);
});

onUnmounted(() => {
  window.removeEventListener('resize', onWindowResize);
  if (renderer && renderer.domElement && container.value) {
    container.value.removeChild(renderer.domElement);
  }
  if (currentModel && scene) {
    disposeModel(currentModel);
    scene.remove(currentModel);
  }
  renderer?.dispose();
});
</script>

<style scoped>
.three-viewer {
  width: 100%;
  height: 100%;
  position: relative;
  min-height: 420px;
}
.three-viewer canvas {
  display: block;
  width: 100% !important;
  height: 100% !important;
}
.controls {
  position: absolute;
  left: 1rem;
  top: 1rem;
  z-index: 10;
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.control-btn,
.control-toggle {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: #000;
  color: #fff;
  border: none;
  padding: 0.45rem 0.6rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: transform 0.12s ease, box-shadow 0.12s ease, background 0.12s ease;
  box-shadow: 0 2px 8px rgba(0,0,0,0.12);
}

.control-btn svg,
.control-toggle svg {
  width: 18px;
  height: 18px;
  fill: currentColor;
  opacity: 0.95;
}

.control-btn:hover,
.control-toggle:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(0,0,0,0.25);
}

.control-toggle {
  background: transparent;
  border: 1px solid rgba(0,0,0,0.08);
  color: #111;
}

/* Auto-rotate active: white background with dark text */
.control-toggle.active {
  background: #ffffff;
  color: #111;
  border: 1px solid #e6e6e6;
  box-shadow: 0 8px 20px rgba(0,0,0,0.08);
}

.control-toggle.active svg { transform: rotate(20deg); transition: transform 0.3s ease; }

.control-toggle.active svg { transform: rotate(20deg); transition: transform 0.3s ease; }

.control-btn[disabled],
.control-toggle[disabled] { opacity: 0.5; cursor: not-allowed; transform: none; box-shadow: none; }

.control-btn .btn-text,
.control-toggle .btn-text { display: inline-block; }

@media (max-width: 520px) {
  .controls { right: 1rem; left: auto; top: 1rem; gap: 0.4rem; }
  .control-btn .btn-text, .control-toggle .btn-text { display: none; }
}
</style>