import { ref, onMounted, onUnmounted, watch } from 'vue';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import LoadingScreen from './LoadingScreen.vue';
const props = defineProps();
const container = ref(null);
let scene = null;
let camera = null;
let renderer = null;
let controls = null;
let currentModel = null;
const loading = ref(true);
const autoRotate = ref(!!props.autoRotate);
function init() {
    if (!container.value)
        return;
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
    if (!container.value || !camera || !renderer)
        return;
    camera.aspect = container.value.clientWidth / container.value.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.value.clientWidth, container.value.clientHeight);
}
function animate() {
    if (!renderer || !scene || !camera)
        return;
    requestAnimationFrame(animate);
    if (controls)
        controls.update();
    if (autoRotate.value && currentModel) {
        currentModel.rotation.y += 0.005;
    }
    renderer.render(scene, camera);
}
function loadModel(url) {
    if (!scene)
        return;
    loading.value = true;
    const loader = new GLTFLoader();
    loader.load(url, (gltf) => {
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
    }, undefined, (err) => {
        console.error('Error loading model', err);
        loading.value = false;
    });
}
function disposeModel(obj) {
    obj.traverse((child) => {
        if (child.isMesh) {
            child.geometry?.dispose();
            if (child.material) {
                if (Array.isArray(child.material)) {
                    child.material.forEach((m) => m.dispose());
                }
                else {
                    child.material.dispose();
                }
            }
        }
    });
}
function resetView() {
    if (!currentModel)
        return;
    currentModel.rotation.set(0, 0, 0);
    if (controls)
        controls.reset();
}
watch(() => props.modelUrl, (newUrl) => {
    if (!newUrl)
        return;
    loadModel(newUrl);
});
onMounted(() => {
    init();
    if (props.modelUrl)
        loadModel(props.modelUrl);
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
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ref: "container",
    ...{ class: "three-viewer" },
});
/** @type {typeof __VLS_ctx.container} */ ;
if (__VLS_ctx.loading) {
    /** @type {[typeof LoadingScreen, ]} */ ;
    // @ts-ignore
    const __VLS_0 = __VLS_asFunctionalComponent(LoadingScreen, new LoadingScreen({}));
    const __VLS_1 = __VLS_0({}, ...__VLS_functionalComponentArgsRest(__VLS_0));
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "controls" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (__VLS_ctx.resetView) },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
    type: "checkbox",
});
(__VLS_ctx.autoRotate);
/** @type {__VLS_StyleScopedClasses['three-viewer']} */ ;
/** @type {__VLS_StyleScopedClasses['controls']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            LoadingScreen: LoadingScreen,
            container: container,
            loading: loading,
            autoRotate: autoRotate,
            resetView: resetView,
        };
    },
    __typeProps: {},
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    __typeProps: {},
});
; /* PartiallyEnd: #4569/main.vue */
