import { ref, onMounted } from 'vue';
import ThreeViewer from '@/components/ThreeViewer.vue';
import ModelThumbnail from '@/components/ModelThumbnail.vue';
const models = ref([
    { id: 'house', title: 'House', thumb: '/models/thumbs/house.jpg', modelUrl: '/models/house.glb' },
    { id: 'chair', title: 'Chair', thumb: '/models/thumbs/chair.jpg', modelUrl: '/models/chair.glb' },
    { id: 'car', title: 'Car', thumb: '/models/thumbs/car.jpg', modelUrl: '/models/car.glb' },
]);
const selectedModel = ref(null);
function selectModel(model) {
    selectedModel.value = model;
}
onMounted(() => {
    // sélection par défaut
    selectedModel.value = models.value[0];
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['models-layout']} */ ;
/** @type {__VLS_StyleScopedClasses['models-grid']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "models-page" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.header, __VLS_intrinsicElements.header)({
    ...{ class: "page-header" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "models-layout" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.aside, __VLS_intrinsicElements.aside)({
    ...{ class: "models-grid" },
});
for (const [model] of __VLS_getVForSourceType((__VLS_ctx.models))) {
    /** @type {[typeof ModelThumbnail, ]} */ ;
    // @ts-ignore
    const __VLS_0 = __VLS_asFunctionalComponent(ModelThumbnail, new ModelThumbnail({
        ...{ 'onSelect': {} },
        key: (model.id),
        model: (model),
    }));
    const __VLS_1 = __VLS_0({
        ...{ 'onSelect': {} },
        key: (model.id),
        model: (model),
    }, ...__VLS_functionalComponentArgsRest(__VLS_0));
    let __VLS_3;
    let __VLS_4;
    let __VLS_5;
    const __VLS_6 = {
        onSelect: (__VLS_ctx.selectModel)
    };
    var __VLS_2;
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({
    ...{ class: "viewer-pane" },
});
if (__VLS_ctx.selectedModel) {
    /** @type {[typeof ThreeViewer, ]} */ ;
    // @ts-ignore
    const __VLS_7 = __VLS_asFunctionalComponent(ThreeViewer, new ThreeViewer({
        modelUrl: (__VLS_ctx.selectedModel.modelUrl),
    }));
    const __VLS_8 = __VLS_7({
        modelUrl: (__VLS_ctx.selectedModel.modelUrl),
    }, ...__VLS_functionalComponentArgsRest(__VLS_7));
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "empty-state" },
    });
}
/** @type {__VLS_StyleScopedClasses['models-page']} */ ;
/** @type {__VLS_StyleScopedClasses['page-header']} */ ;
/** @type {__VLS_StyleScopedClasses['models-layout']} */ ;
/** @type {__VLS_StyleScopedClasses['models-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['viewer-pane']} */ ;
/** @type {__VLS_StyleScopedClasses['empty-state']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            ThreeViewer: ThreeViewer,
            ModelThumbnail: ModelThumbnail,
            models: models,
            selectedModel: selectedModel,
            selectModel: selectModel,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
