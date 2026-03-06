<template>
  <section class="project-details">
    <div v-if="project" class="project-container">
      <h1>{{ project.title }}</h1>
      <img :src="project.cover || ''" :alt="project.title" class="project-cover" />
      <p class="project-description">{{ project.description }}</p>

      <!-- Boucle sur les sections -->
      <div v-for="section in project.sections" :key="section.id" class="project-section">
        <h2>{{ section.titre }}</h2>
        <p class="section-description" v-if="section.description">{{ section.description }}</p>

        <div class="project-media">
          <!-- Images de la section -->
          <div v-for="(media, index) in section.media" :key="media.id" class="media-item">
            <template v-if="media.mime.startsWith('image')">
              <img
                :src="mediaImage(getImageUrl(media.url))"
                :alt="media.name"
                class="media-image"
                @click="openLightbox(calculateGlobalMediaIndex(section.id, index))"
              />
            </template>
          </div>

          <!-- Vidéos de la section -->
          <div v-for="video in section.video" :key="video.id" class="media-item">
            <template v-if="video.mime.startsWith('video')">
              <video controls autoplay muted loop class="media-video">
                <source :src="getImageUrl(video.url)" :type="video.mime" />
                Votre navigateur ne supporte pas la vidéo.
              </video>
            </template>
          </div>
        </div>
      </div>

      <!-- Scène 3D si présent et index choisi -->
      <div v-if="project.has3D && project.modelUrls?.length && selectedModelIndex >= 0" class="three-scene">
        <ThreeViewer :modelUrl="project.modelUrls[selectedModelIndex]" />

        <!-- Contrôles de modèle si plusieurs -->
        <div class="model-controls" v-if="project.modelUrls && project.modelUrls.length > 1">
          <button @click="prevModel" aria-label="Précédent">◀</button>
          <button @click="nextModel" aria-label="Suivant">▶</button>
        </div>

        <!-- Liste des modèles pour sélection directe -->
        <div class="model-list" v-if="project.modelUrls && project.modelUrls.length">
          <button
            v-for="(m, i) in project.modelUrls"
            :key="i"
            :class="['model-btn', { active: i === selectedModelIndex } ]"
            @click="selectModel(i)"
          >
            {{ (m.split('/').pop()) || ('model-' + (i+1)) }}
          </button>
        </div>
      </div>

      <button @click="goBackToProjects" class="back-button">Retour à la liste des projets</button>
    </div>
    <div v-else>
      <p>Chargement des détails du projet...</p>
    </div>

    <!-- Lightbox -->
    <vue-easy-lightbox
      :visible="lightboxVisible"
      :imgs="lightboxImages"
      :index="lightboxIndex"
      @hide="lightboxVisible = false"
    />
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, defineAsyncComponent } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import VueEasyLightbox from 'vue-easy-lightbox';
import { fullWidthImage, mediaImage } from '../utils/cdn';
import { getApiUrl, getImageUrl } from '../utils/api';

// Lazy-load le viewer pour alléger le bundle
const ThreeViewer = defineAsyncComponent(() => import('../components/ThreeViewer.vue'));

// Types for project and media to satisfy TypeScript in the template
type MediaItem = { id: number | string; mime: string; url: string; name?: string };
type VideoItem = { id: number | string; mime: string; url: string; name?: string };
type SectionType = {
  id: number | string;
  titre: string;
  description?: string;
  media: MediaItem[];
  video: VideoItem[];
};
type ProjectType = {
  id: number;
  title: string;
  description: string;
  createdAt?: string;
  cover?: string | null;
  sections: SectionType[];
  has3D?: boolean;
  modelUrls?: string[];
};

const project = ref<ProjectType | null>(null);
const route = useRoute();
const router = useRouter();

const lightboxVisible = ref(false);
const lightboxImages = ref<string[]>([]);
const lightboxIndex = ref(0);

// gestion des modèles 3D (index sélectionné + contrôles)
const selectedModelIndex = ref(-1);
function selectModel(i: number) {
  if (!project.value?.modelUrls) return;
  selectedModelIndex.value = Math.max(0, Math.min(i, project.value.modelUrls.length - 1));
}
function nextModel() {
  if (!project.value?.modelUrls) return;
  selectModel((selectedModelIndex.value + 1 + project.value.modelUrls.length) % project.value.modelUrls.length);
}
function prevModel() {
  if (!project.value?.modelUrls) return;
  selectModel((selectedModelIndex.value - 1 + project.value.modelUrls.length) % project.value.modelUrls.length);
}

function onKeydown(e: KeyboardEvent) {
  // navigation clavier ← / →
  if (!project.value?.modelUrls || selectedModelIndex.value < 0) return;
  const key = e.key;
  if (key === 'ArrowLeft') {
    e.preventDefault?.();
    prevModel();
  } else if (key === 'ArrowRight') {
    e.preventDefault?.();
    nextModel();
  }
}

onMounted(async () => {
  const projectId = Number(route.params.id);
  try {
    const response = await fetch(getApiUrl('/api/projets?populate=*'));
    if (!response.ok) throw new Error('Erreur lors de la récupération des projets');

    const { data } = await response.json();
    const projectData = data.find((proj: any) => proj.id === projectId) as any;

    if (!projectData) throw new Error('Projet non trouvé');

    console.log('📦 Données du projet reçu:', projectData);
    console.log('🔧 Sections:', projectData.sections);

    // Détection robuste de l'URL du modèle (supporte URL_SUPABASE, media local, champs directs)
    let candidateModelUrl: string | null = null;

    if (projectData.URL_SUPABASE && Array.isArray(projectData.URL_SUPABASE) && projectData.URL_SUPABASE[0]?.url) {
      candidateModelUrl = projectData.URL_SUPABASE[0].url;
    } else if (projectData.model?.data?.attributes?.url) {
      candidateModelUrl = getImageUrl(projectData.model.data.attributes.url);
    } else if (projectData.Model?.data?.attributes?.url) {
      candidateModelUrl = getImageUrl(projectData.Model.data.attributes.url);
    } else if (projectData.modelUrl) {
      candidateModelUrl = projectData.modelUrl; // peut être URL absolue (ex: Supabase)
    } else if (projectData.Model && typeof projectData.Model === 'string') {
      candidateModelUrl = projectData.Model;
    }

    // Collecte toutes les URLs de modèles disponibles
    const modelUrls = [];
    if (projectData.URL_SUPABASE && Array.isArray(projectData.URL_SUPABASE)) {
      projectData.URL_SUPABASE.forEach((m: any) => { if (m?.url) modelUrls.push(m.url); });
    }
    if (projectData.model?.data?.attributes?.url) {
      modelUrls.push(getImageUrl(projectData.model.data.attributes.url));
    }
    if (projectData.Model?.data?.attributes?.url) {
      modelUrls.push(getImageUrl(projectData.Model.data.attributes.url));
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
      cover: fullWidthImage(
        projectData.Cover?.formats?.medium?.url
          ? getImageUrl(projectData.Cover.formats.medium.url)
          : projectData.Cover?.url
          ? getImageUrl(projectData.Cover.url)
          : null
      ),
      sections: (projectData.sections?.data || []).map((sectionData: any) => ({
        id: sectionData.id,
        titre: sectionData.attributes?.titre || 'Sans titre',
        description: sectionData.attributes?.description || '',
        media: sectionData.attributes?.media || [],
        video: sectionData.attributes?.video || [],
      })) || [
        // ⚠️ FALLBACK: Si pas de sections, créer une section par défaut avec les vieilles données
        {
          id: 'default',
          titre: 'Galerie',
          description: '',
          media: projectData.Media || [],
          video: projectData.Video || [],
        }
      ].filter(s => s.media.length > 0 || s.video.length > 0), // ne montrer la fallback que s'il y a du contenu
      has3D: uniqueModelUrls.length > 0,
      modelUrls: uniqueModelUrls,
    };

    // Construire la liste d'images pour la lightbox — robustifier selon la forme des media reçus
    const allImageMedia: any[] = [];
    project.value.sections.forEach(section => {
      if (Array.isArray(section.media)) {
        allImageMedia.push(...section.media);
      }
    });

    const imageMedia = allImageMedia.filter((m: any) => {
      if (!m) return false;
      if (typeof m === 'string') return true;
      return typeof m.mime === 'string' && m.mime.startsWith('image') && !!m.url;
    });

    lightboxImages.value = imageMedia
      .map((m: any) => {
        if (typeof m === 'string') return m;
        const url = m.url || '';
        return getImageUrl(url);
      })
      .filter(Boolean);

    // sélection par défaut du premier modèle (si présent)
    if (project.value.modelUrls && project.value.modelUrls.length) {
      selectedModelIndex.value = 0;
    } else {
      selectedModelIndex.value = -1;
    }

    // add keyboard navigation listeners
    window.addEventListener('keydown', onKeydown);
  } catch (error) {
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

function formatDate(dateString?: string) {
  if (!dateString) return '';
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('fr-FR', options);
}

function calculateGlobalMediaIndex(sectionId: string | number, indexInSection: number): number {
  let globalIndex = 0;
  const sectionIndex = project.value?.sections.findIndex(s => s.id === sectionId) ?? -1;

  // Compter tous les médias des sections précédentes
  if (project.value && sectionIndex >= 0) {
    for (let i = 0; i < sectionIndex; i++) {
      const imageCount = project.value.sections[i].media
        .filter((m: any) => m.mime?.startsWith('image'))
        .length;
      globalIndex += imageCount;
    }
  }

  globalIndex += indexInSection;
  return globalIndex;
}

function openLightbox(index: number) {
  lightboxIndex.value = index;
  lightboxVisible.value = true;
}

function goBackToProjects() {
  router.push('/projects');
}
</script>

<style scoped>
.project-details {
  padding: 2rem;
  display: flex;
  justify-content: center;
  min-height: 100vh;
}

.project-container {
  width: 100%;
  max-width: 1000px;
  border-radius: 16px;
  padding: 2rem;
}

h1 {
  font-size: 2.2rem;
  color: #222;
  margin-bottom: 1rem;
}
p {
  font-size: 1.2rem;
  color: #555;
  margin-bottom: 1rem;
  text-align: center;
  justify-self: center;
}

.project-cover {
  width: 50%;
  height: auto;
  border-radius: 12px;
  object-fit: cover;
  margin: 1.5rem 0;
}

.project-description {
  font-size: 1.15rem;
  line-height: 1.6;
  color: #444;
  margin-bottom: 2rem;
  text-align: left;
}

.project-section {
  margin-top: 2.5rem;
  padding-top: 2rem;
  border-top: 1px solid #e0e0e0;
}

.project-section h2 {
  font-size: 1.8rem;
  color: #222;
  margin-bottom: 0.5rem;
}

.section-description {
  font-size: 1.05rem;
  line-height: 1.6;
  color: #555;
  margin-bottom: 1.5rem;
  text-align: left;
}

.project-meta {
  text-align: left;
  font-size: 0.95rem;
  color: #666;
  margin-bottom: 2rem;
}
.project-meta strong {
  color: #333;
}

.project-media {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  width: 100%;
}

.project-media img {
  width: 200px;
  height: 200px;
  border-radius: 12px;
  object-fit: cover;
}

.project-media video {
  width: auto;
  height: 200px;
  border-radius: 12px;
}

.media-item {
  margin: 0;
  border-radius: 12px;
  overflow: hidden;
  padding: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

@media (max-width: 768px) {
  .project-media {
    padding: 0;
    gap: 0.5rem;
  }
  
  .media-item {
    width: 100%;
    padding: 0.25rem;
    margin: 0;
  }

  .project-media img,
  .project-media video {
    width: 100%;
    max-width: 300px;
    margin: 0 auto;
  }
}

.back-button {
  background-color: #000;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-top: 2rem;
  font-family: 'Inter', sans-serif;
  border: 1px solid #ffffff;
}
.back-button:hover {
  background-color: #ffffff;
  color: #000;
  transition: all 0.3s ease;
  border: 1px solid #000;
}

.three-scene {
  position: relative; /* contraindre l'overlay au conteneur */
  border: 1px solid #ccc;
  width: 100%;
  height: 500px;
  border-radius: 12px;
  overflow: hidden;
  margin-top: 2rem;
}
.three-scene canvas {
  display: block;
  width: 100% !important;
  height: 100% !important;
}

/* Controls for switching models */
.model-controls {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transform: translateY(-50%);
  pointer-events: none; /* allow buttons to control when enabled */
  z-index: 30;
}
.model-controls button {
  pointer-events: auto;
  background: rgba(0,0,0,0.6);
  color: #fff;
  border: none;
  padding: 0.6rem 0.9rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  box-shadow: 0 6px 18px rgba(0,0,0,0.18);
}
.model-controls button[disabled] { opacity: 0.45; cursor: not-allowed; }

/* Model list (bottom center) */
.model-list {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: 10px;
  display: flex;
  gap: 0.5rem;
  z-index: 30;
}
.model-list .model-btn {
  background: rgba(255,255,255,0.06);
  color: #111;
  border: 1px solid rgba(0,0,0,0.06);
  padding: 0.35rem 0.5rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.85rem;
}
.model-list .model-btn.active {
  background: #111;
  color: #fff;
  border-color: rgba(0,0,0,0.12);
}
/* Small screen adjustments */
@media (max-width: 520px) {
  .model-controls button { padding: 0.45rem 0.6rem; font-size: 0.95rem; }
  .model-list { gap: 0.35rem; bottom: 6px; }
}

</style>
