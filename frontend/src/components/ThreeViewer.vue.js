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
let loadingTimeout = null;
const autoRotate = ref(!!props.autoRotate);
function clearLoadingTimeout() {
    if (loadingTimeout !== null) {
        clearTimeout(loadingTimeout);
        loadingTimeout = null;
    }
}
function init() {
    if (!container.value)
        return;
    scene = new THREE.Scene();
    // si une couleur de fond est passée en prop, on l'utilise. Sinon on laisse le canvas transparent
    if (props.background) {
        scene.background = new THREE.Color(props.background);
    }
    else {
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
    clearLoadingTimeout();
    loading.value = true;
    // fallback: si le loader ne répond pas, on retire le loader après 12s
    loadingTimeout = window.setTimeout(() => {
        loading.value = false;
        loadingTimeout = null;
    }, 12000);
    const loader = new GLTFLoader();
    loader.load(url, (gltf) => {
        clearLoadingTimeout();
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
        // petit délai pour éviter un flash : on garde le loader 120ms
        setTimeout(() => { loading.value = false; }, 120);
    }, (xhr) => {
        // progress callback (optionnel)
        // console.log('[ThreeViewer] progress', xhr.loaded, xhr.total);
    }, (err) => {
        clearLoadingTimeout();
        console.error('[ThreeViewer] Error loading model', err);
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
function toggleAutoRotate() {
    autoRotate.value = !autoRotate.value;
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
    // nettoyer timeout éventuel
    clearLoadingTimeout();
    loading.value = false;
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['three-viewer']} */ ;
/** @type {__VLS_StyleScopedClasses['loading-debug']} */ ;
/** @type {__VLS_StyleScopedClasses['control-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['control-toggle']} */ ;
/** @type {__VLS_StyleScopedClasses['control-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['control-toggle']} */ ;
/** @type {__VLS_StyleScopedClasses['control-toggle']} */ ;
/** @type {__VLS_StyleScopedClasses['control-toggle']} */ ;
/** @type {__VLS_StyleScopedClasses['control-toggle']} */ ;
/** @type {__VLS_StyleScopedClasses['active']} */ ;
/** @type {__VLS_StyleScopedClasses['control-toggle']} */ ;
/** @type {__VLS_StyleScopedClasses['active']} */ ;
/** @type {__VLS_StyleScopedClasses['control-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['control-toggle']} */ ;
/** @type {__VLS_StyleScopedClasses['control-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['control-toggle']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-text']} */ ;
/** @type {__VLS_StyleScopedClasses['controls']} */ ;
/** @type {__VLS_StyleScopedClasses['control-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-text']} */ ;
/** @type {__VLS_StyleScopedClasses['control-toggle']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-text']} */ ;
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
    const __VLS_0 = __VLS_asFunctionalComponent(LoadingScreen, new LoadingScreen({
        ...{ 'onDismiss': {} },
        dismissible: (true),
    }));
    const __VLS_1 = __VLS_0({
        ...{ 'onDismiss': {} },
        dismissible: (true),
    }, ...__VLS_functionalComponentArgsRest(__VLS_0));
    let __VLS_3;
    let __VLS_4;
    let __VLS_5;
    const __VLS_6 = {
        onDismiss: (...[$event]) => {
            if (!(__VLS_ctx.loading))
                return;
            __VLS_ctx.loading = false;
        }
    };
    var __VLS_2;
}
if (__VLS_ctx.loading) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "loading-debug" },
        'aria-hidden': (!__VLS_ctx.loading),
    });
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "controls" },
    role: "toolbar",
    'aria-label': "Contrôles scène",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (__VLS_ctx.resetView) },
    ...{ class: "control-btn" },
    disabled: (__VLS_ctx.loading),
    title: "Reset view",
    'aria-label': "Reset view",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)({
    viewBox: "0 0 24 24",
    'aria-hidden': "true",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.path)({
    d: "M12 6V3L8 7l4 4V8c2.8 0 5 2.2 5 5 0 1.1-.3 2.1-.9 3l1.5 1.5C20.2 16.1 21 14.1 21 12c0-4.97-4.03-9-9-9z",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "btn-text" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (__VLS_ctx.toggleAutoRotate) },
    ...{ class: (['control-toggle', { active: __VLS_ctx.autoRotate }]) },
    'aria-pressed': (__VLS_ctx.autoRotate),
    disabled: (__VLS_ctx.loading),
    title: "Auto-rotate",
    'aria-label': "Auto-rotate",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)({
    viewBox: "0 0 24 24",
    'aria-hidden': "true",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.path)({
    d: "M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6a6 6 0 11-6-6z",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "btn-text" },
});
/** @type {__VLS_StyleScopedClasses['three-viewer']} */ ;
/** @type {__VLS_StyleScopedClasses['loading-debug']} */ ;
/** @type {__VLS_StyleScopedClasses['controls']} */ ;
/** @type {__VLS_StyleScopedClasses['control-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-text']} */ ;
/** @type {__VLS_StyleScopedClasses['active']} */ ;
/** @type {__VLS_StyleScopedClasses['control-toggle']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-text']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            LoadingScreen: LoadingScreen,
            container: container,
            loading: loading,
            autoRotate: autoRotate,
            toggleAutoRotate: toggleAutoRotate,
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
