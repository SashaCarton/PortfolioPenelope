import { ref, onMounted, onBeforeUnmount, defineAsyncComponent } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import VueEasyLightbox from 'vue-easy-lightbox';
// Lazy-load le viewer pour alléger le bundle
const ThreeViewer = defineAsyncComponent(() => import('../components/ThreeViewer.vue'));
const project = ref(null);
const route = useRoute();
const router = useRouter();
const lightboxVisible = ref(false);
const lightboxImages = ref([]);
const lightboxIndex = ref(0);
// gestion des modèles 3D (index sélectionné + contrôles)
const selectedModelIndex = ref(-1);
function selectModel(i) {
    if (!project.value?.modelUrls)
        return;
    selectedModelIndex.value = Math.max(0, Math.min(i, project.value.modelUrls.length - 1));
}
function nextModel() {
    if (!project.value?.modelUrls)
        return;
    selectModel((selectedModelIndex.value + 1 + project.value.modelUrls.length) % project.value.modelUrls.length);
}
function prevModel() {
    if (!project.value?.modelUrls)
        return;
    selectModel((selectedModelIndex.value - 1 + project.value.modelUrls.length) % project.value.modelUrls.length);
}
function onKeydown(e) {
    // navigation clavier ← / →
    if (!project.value?.modelUrls || selectedModelIndex.value < 0)
        return;
    const key = e.key;
    if (key === 'ArrowLeft') {
        e.preventDefault?.();
        prevModel();
    }
    else if (key === 'ArrowRight') {
        e.preventDefault?.();
        nextModel();
    }
}
onMounted(async () => {
    const projectId = Number(route.params.id);
    try {
        const response = await fetch(`https://api.penelopeletienne.ovh/api/projets?populate=*`);
        if (!response.ok)
            throw new Error('Erreur lors de la récupération des projets');
        const { data } = await response.json();
        const projectData = data.find((proj) => proj.id === projectId);
        if (!projectData)
            throw new Error('Projet non trouvé');
        // Détection robuste de l'URL du modèle (supporte URL_SUPABASE, media local, champs directs)
        let candidateModelUrl = null;
        if (projectData.URL_SUPABASE && Array.isArray(projectData.URL_SUPABASE) && projectData.URL_SUPABASE[0]?.url) {
            candidateModelUrl = projectData.URL_SUPABASE[0].url;
        }
        else if (projectData.model?.data?.attributes?.url) {
            candidateModelUrl = `https://api.penelopeletienne.ovh${projectData.model.data.attributes.url}`;
        }
        else if (projectData.Model?.data?.attributes?.url) {
            candidateModelUrl = `https://api.penelopeletienne.ovh${projectData.Model.data.attributes.url}`;
        }
        else if (projectData.modelUrl) {
            candidateModelUrl = projectData.modelUrl; // peut être URL absolue (ex: Supabase)
        }
        else if (projectData.Model && typeof projectData.Model === 'string') {
            candidateModelUrl = projectData.Model;
        }
        // Collecte toutes les URLs de modèles disponibles
        const modelUrls = [];
        if (projectData.URL_SUPABASE && Array.isArray(projectData.URL_SUPABASE)) {
            projectData.URL_SUPABASE.forEach((m) => { if (m?.url)
                modelUrls.push(m.url); });
        }
        if (projectData.model?.data?.attributes?.url) {
            modelUrls.push(`https://api.penelopeletienne.ovh${projectData.model.data.attributes.url}`);
        }
        if (projectData.Model?.data?.attributes?.url) {
            modelUrls.push(`https://api.penelopeletienne.ovh${projectData.Model.data.attributes.url}`);
        }
        if (projectData.modelUrl) {
            modelUrls.push(projectData.modelUrl);
        }
        const uniqueModelUrls = Array.from(new Set(modelUrls));
        // Définit le projet côté frontend
        project.value = {
            id: projectData.id,
            title: projectData.Titre || 'Sans titre',
            description: projectData.Description || 'Pas de description',
            createdAt: projectData.createdAt,
            cover: projectData.Cover?.formats?.medium?.url
                ? `https://api.penelopeletienne.ovh${projectData.Cover.formats.medium.url}`
                : projectData.Cover?.url
                    ? `https://api.penelopeletienne.ovh${projectData.Cover.url}`
                    : null,
            media: projectData.Media || [],
            video: projectData.Video || [],
            has3D: uniqueModelUrls.length > 0,
            modelUrls: uniqueModelUrls,
        };
        // Construire la liste d'images pour la lightbox — robustifier selon la forme des media reçus
        const rawMedia = (project.value.media || []);
        const imageMedia = rawMedia.filter((m) => {
            if (!m)
                return false;
            if (typeof m === 'string')
                return true; // supposer que c'est déjà une URL valide
            return typeof m.mime === 'string' && m.mime.startsWith('image') && !!m.url;
        });
        lightboxImages.value = imageMedia
            .map((m) => {
            if (typeof m === 'string')
                return m;
            const url = m.url || '';
            return url.startsWith('http') ? url : `https://api.penelopeletienne.ovh${url}`;
        })
            .filter(Boolean);
        // sélection par défaut du premier modèle (si présent)
        if (project.value.modelUrls && project.value.modelUrls.length) {
            selectedModelIndex.value = 0;
        }
        else {
            selectedModelIndex.value = -1;
        }
        // add keyboard navigation listeners
        window.addEventListener('keydown', onKeydown);
    }
    catch (error) {
        console.error('Erreur :', error);
    }
});
onBeforeUnmount(() => {
    // Rien de spécial à nettoyer ici — ThreeViewer gère sa propre scène
    window.removeEventListener('keydown', onKeydown);
});
onBeforeUnmount(() => {
    // Rien de spécial à nettoyer ici — ThreeViewer gère sa propre scène
});
function formatDate(dateString) {
    if (!dateString)
        return '';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
}
function openLightbox(index) {
    lightboxIndex.value = index;
    lightboxVisible.value = true;
}
function goBackToProjects() {
    router.push('/projects');
}
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['project-meta']} */ ;
/** @type {__VLS_StyleScopedClasses['project-media']} */ ;
/** @type {__VLS_StyleScopedClasses['project-media']} */ ;
/** @type {__VLS_StyleScopedClasses['project-media']} */ ;
/** @type {__VLS_StyleScopedClasses['media-item']} */ ;
/** @type {__VLS_StyleScopedClasses['project-media']} */ ;
/** @type {__VLS_StyleScopedClasses['project-media']} */ ;
/** @type {__VLS_StyleScopedClasses['back-button']} */ ;
/** @type {__VLS_StyleScopedClasses['three-scene']} */ ;
/** @type {__VLS_StyleScopedClasses['model-controls']} */ ;
/** @type {__VLS_StyleScopedClasses['model-controls']} */ ;
/** @type {__VLS_StyleScopedClasses['model-list']} */ ;
/** @type {__VLS_StyleScopedClasses['model-list']} */ ;
/** @type {__VLS_StyleScopedClasses['model-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['model-controls']} */ ;
/** @type {__VLS_StyleScopedClasses['model-list']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({
    ...{ class: "project-details" },
});
if (__VLS_ctx.project) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "project-container" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)({});
    (__VLS_ctx.project.title);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.img)({
        src: (__VLS_ctx.project.cover || ''),
        alt: (__VLS_ctx.project.title),
        ...{ class: "project-cover" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "project-description" },
    });
    (__VLS_ctx.project.description);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "project-meta" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.strong, __VLS_intrinsicElements.strong)({});
    (__VLS_ctx.formatDate(__VLS_ctx.project.createdAt));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "project-media" },
    });
    for (const [media, index] of __VLS_getVForSourceType((__VLS_ctx.project.media))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            key: (media.id),
            ...{ class: "media-item" },
        });
        if (media.mime.startsWith('image')) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.img)({
                ...{ onClick: (...[$event]) => {
                        if (!(__VLS_ctx.project))
                            return;
                        if (!(media.mime.startsWith('image')))
                            return;
                        __VLS_ctx.openLightbox(index);
                    } },
                src: (`https://api.penelopeletienne.ovh${media.url}`),
                alt: (media.name),
                ...{ class: "media-image" },
            });
        }
    }
    for (const [video] of __VLS_getVForSourceType((__VLS_ctx.project.video))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            key: (video.id),
            ...{ class: "media-item" },
        });
        if (video.mime.startsWith('video')) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.video, __VLS_intrinsicElements.video)({
                controls: true,
                autoplay: true,
                muted: true,
                loop: true,
                ...{ class: "media-video" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.source)({
                src: (`https://api.penelopeletienne.ovh${video.url}`),
                type: (video.mime),
            });
        }
    }
    if (__VLS_ctx.project.has3D && __VLS_ctx.project.modelUrls?.length && __VLS_ctx.selectedModelIndex >= 0) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "three-scene" },
        });
        const __VLS_0 = {}.ThreeViewer;
        /** @type {[typeof __VLS_components.ThreeViewer, ]} */ ;
        // @ts-ignore
        const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
            modelUrl: (__VLS_ctx.project.modelUrls[__VLS_ctx.selectedModelIndex]),
        }));
        const __VLS_2 = __VLS_1({
            modelUrl: (__VLS_ctx.project.modelUrls[__VLS_ctx.selectedModelIndex]),
        }, ...__VLS_functionalComponentArgsRest(__VLS_1));
        if (__VLS_ctx.project.modelUrls && __VLS_ctx.project.modelUrls.length > 1) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "model-controls" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
                ...{ onClick: (__VLS_ctx.prevModel) },
                'aria-label': "Précédent",
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
                ...{ onClick: (__VLS_ctx.nextModel) },
                'aria-label': "Suivant",
            });
        }
        if (__VLS_ctx.project.modelUrls && __VLS_ctx.project.modelUrls.length) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "model-list" },
            });
            for (const [m, i] of __VLS_getVForSourceType((__VLS_ctx.project.modelUrls))) {
                __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
                    ...{ onClick: (...[$event]) => {
                            if (!(__VLS_ctx.project))
                                return;
                            if (!(__VLS_ctx.project.has3D && __VLS_ctx.project.modelUrls?.length && __VLS_ctx.selectedModelIndex >= 0))
                                return;
                            if (!(__VLS_ctx.project.modelUrls && __VLS_ctx.project.modelUrls.length))
                                return;
                            __VLS_ctx.selectModel(i);
                        } },
                    key: (i),
                    ...{ class: (['model-btn', { active: i === __VLS_ctx.selectedModelIndex }]) },
                });
                ((m.split('/').pop()) || ('model-' + (i + 1)));
            }
        }
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (__VLS_ctx.goBackToProjects) },
        ...{ class: "back-button" },
    });
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
}
const __VLS_4 = {}.VueEasyLightbox;
/** @type {[typeof __VLS_components.VueEasyLightbox, typeof __VLS_components.vueEasyLightbox, ]} */ ;
// @ts-ignore
const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
    ...{ 'onHide': {} },
    visible: (__VLS_ctx.lightboxVisible),
    imgs: (__VLS_ctx.lightboxImages),
    index: (__VLS_ctx.lightboxIndex),
}));
const __VLS_6 = __VLS_5({
    ...{ 'onHide': {} },
    visible: (__VLS_ctx.lightboxVisible),
    imgs: (__VLS_ctx.lightboxImages),
    index: (__VLS_ctx.lightboxIndex),
}, ...__VLS_functionalComponentArgsRest(__VLS_5));
let __VLS_8;
let __VLS_9;
let __VLS_10;
const __VLS_11 = {
    onHide: (...[$event]) => {
        __VLS_ctx.lightboxVisible = false;
    }
};
var __VLS_7;
/** @type {__VLS_StyleScopedClasses['project-details']} */ ;
/** @type {__VLS_StyleScopedClasses['project-container']} */ ;
/** @type {__VLS_StyleScopedClasses['project-cover']} */ ;
/** @type {__VLS_StyleScopedClasses['project-description']} */ ;
/** @type {__VLS_StyleScopedClasses['project-meta']} */ ;
/** @type {__VLS_StyleScopedClasses['project-media']} */ ;
/** @type {__VLS_StyleScopedClasses['media-item']} */ ;
/** @type {__VLS_StyleScopedClasses['media-image']} */ ;
/** @type {__VLS_StyleScopedClasses['media-item']} */ ;
/** @type {__VLS_StyleScopedClasses['media-video']} */ ;
/** @type {__VLS_StyleScopedClasses['three-scene']} */ ;
/** @type {__VLS_StyleScopedClasses['model-controls']} */ ;
/** @type {__VLS_StyleScopedClasses['model-list']} */ ;
/** @type {__VLS_StyleScopedClasses['active']} */ ;
/** @type {__VLS_StyleScopedClasses['model-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['back-button']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            VueEasyLightbox: VueEasyLightbox,
            ThreeViewer: ThreeViewer,
            project: project,
            lightboxVisible: lightboxVisible,
            lightboxImages: lightboxImages,
            lightboxIndex: lightboxIndex,
            selectedModelIndex: selectedModelIndex,
            selectModel: selectModel,
            nextModel: nextModel,
            prevModel: prevModel,
            formatDate: formatDate,
            openLightbox: openLightbox,
            goBackToProjects: goBackToProjects,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
