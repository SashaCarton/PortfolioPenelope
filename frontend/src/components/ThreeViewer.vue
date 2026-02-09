<template>
  <div ref="container" class="three-viewer">
    <LoadingScreen v-if="loading" :dismissible="true" @dismiss="loading = false" />
    <div v-if="loading" class="loading-debug" :aria-hidden="!loading">Chargement...</div>

    <div v-if="loadingError" class="error-overlay" role="alert" aria-live="assertive">
      <p><strong>Erreur :</strong> {{ loadingError }}</p>
      <div class="error-actions">
        <button class="btn-retry" @click="retryLoad">Réessayer</button>
      </div>
    </div>

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
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import LoadingScreen from './LoadingScreen.vue';

const props = defineProps<{
  modelUrl: string;
  autoRotate?: boolean;
  background?: string;
  groundOffset?: number; // meters to lower the model after aligning to ground (positive lowers)
}>();

const container = ref<HTMLElement | null>(null);
let scene: THREE.Scene | null = null;
let camera: THREE.PerspectiveCamera | null = null;
let renderer: THREE.WebGLRenderer | null = null;
let controls: any = null;
let currentModel: THREE.Group | null = null;
let dracoLoader: any = null;

const loading = ref(true);
const loadingError = ref<string | null>(null);
let loadingTimeout: number | null = null;
const autoRotate = ref(!!props.autoRotate);

function retryLoad() {
  if (props.modelUrl) loadModel(props.modelUrl);
} 

function clearLoadingTimeout() {
  if (loadingTimeout !== null) {
    clearTimeout(loadingTimeout as any);
    loadingTimeout = null;
  }
}

function init() {
  if (!container.value) return;
  scene = new THREE.Scene();
  // si une couleur de fond est passée en prop, on l'utilise. Sinon on laisse le canvas transparent
  if (props.background) {
    scene.background = new THREE.Color(props.background as any);
  } else {
    // couleur sombre par défaut (transparent attendu auparavant)
    scene.background = new THREE.Color(0x222222);
  }

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

  // Préparer DRACO loader pour les GLB compressés
  try {
    dracoLoader = new DRACOLoader();
    // CDN de décoders. Si vous préférez servir localement, changez ce chemin.
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
  } catch (err) {
    // si l'import échoue, on continue sans DRACO (loadModel gérera l'erreur)
    dracoLoader = null;
  }

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
  clearLoadingTimeout();
  loading.value = true;
  // fallback: si le loader ne répond pas, on retire le loader après 12s
  loadingTimeout = window.setTimeout(() => {
    loading.value = false;
    loadingTimeout = null;
  }, 12000);

  const loader = new GLTFLoader();
  // si DRACO est disponible, attacher pour décompresser les maillages
  if (dracoLoader) {
    loader.setDRACOLoader(dracoLoader);
  }

  // reset error state
  loadingError.value = null;

  loader.load(
    url,
    (gltf: any) => {
      clearLoadingTimeout();
      loadingError.value = null;
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
      const sizeVec = box.getSize(new THREE.Vector3());
      const size = Math.max(sizeVec.x, sizeVec.y, sizeVec.z) || 1;
      const center = box.getCenter(new THREE.Vector3());

      // recentrer au centre d'inertie
      currentModel.position.x -= center.x;
      currentModel.position.y -= center.y;
      currentModel.position.z -= center.z;

      // mise à l'échelle uniforme pour tenir dans la vue
      const scale = 1.5 / size;
      currentModel.scale.setScalar(scale);

      // recompute bbox après mise à l'échelle et positionner le bas du modèle à y=0
      const boxScaled = new THREE.Box3().setFromObject(currentModel);
      const minY = boxScaled.min.y || 0;
      const offset = typeof props.groundOffset === 'number' ? props.groundOffset : 1; // default -2cm (lower)
      currentModel.position.y -= (minY + offset); // place la base sur y=0 puis shift de `offset` (negative -> lower)

      // ajuster la cible des controls et la caméra pour cadrer le modèle
      const frameCenter = boxScaled.getCenter(new THREE.Vector3());
      if (controls) {
        controls.target.copy(frameCenter);
        controls.update();
      }

      if (camera) {
        const maxDim = Math.max(sizeVec.x, sizeVec.y, sizeVec.z) * scale;
        // positionner la caméra légèrement au-dessus et en retrait pour voir le modèle
        camera.position.set(0, Math.max(1.5, maxDim * 0.6), Math.max(2.5, maxDim * 1.2));
        camera.lookAt(frameCenter);
      }

      scene.add(currentModel);
      // petit délai pour éviter un flash : on garde le loader 120ms
      setTimeout(() => { loading.value = false; }, 120);
    },
    (xhr: ProgressEvent<EventTarget>) => {
      // progress callback (optionnel)
      // console.log('[ThreeViewer] progress', xhr.loaded, xhr.total);
    },
    (err: any) => {
      clearLoadingTimeout();
      const message = err?.message || (err && err.statusText) || 'Erreur lors du chargement du modèle';
      loadingError.value = String(message);
      console.error('[ThreeViewer] Error loading model', err);
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
  // nettoyer timeout éventuel
  clearLoadingTimeout();
  loading.value = false;
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
.loading-debug {
  position: absolute;
  inset: 0;
  display: none; /* affiché uniquement pour debug si nécessaire */
  justify-content: center;
  align-items: center;
  color: #fff;
  font-size: 0.9rem;
  z-index: 20;
}
.loading-debug[aria-hidden="false"] { display: flex; }
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

/* overlay d'erreur */
.error-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  justify-content: center;
  align-items: center;
  background: rgba(0,0,0,0.6);
  color: #fff;
  z-index: 30;
  padding: 1.2rem;
  text-align: center;
}
.error-overlay p { margin: 0; }
.error-actions { display:flex; gap:0.6rem; margin-top:0.4rem; }
.btn-retry { background:#fff; color:#000; border:none; padding:0.5rem 0.8rem; border-radius:6px; cursor:pointer; }
.btn-retry:hover { transform:translateY(-2px); }

</style>