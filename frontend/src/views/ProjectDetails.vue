<template>
  <section class="project-details">
    <div v-if="project" class="project-container">
      <h1>{{ project.title }}</h1>
      <img :src="project.cover" :alt="project.title" class="project-cover" />
      <p class="project-description">{{ project.description }}</p>
      <div class="project-meta">
        <p><strong>Date de création :</strong> {{ formatDate(project.createdAt) }}</p>
      </div>

      <!-- Images -->
      <div class="project-media">
        <div v-for="(media, index) in project.media" :key="media.id" class="media-item">
          <template v-if="media.mime.startsWith('image')">
            <img
              :src="`https://api.penelopeletienne.ovh${media.url}`"
              :alt="media.name"
              class="media-image"
              @click="openLightbox(index)"
            />
          </template>
        </div>

        <!-- Vidéos -->
        <div v-for="video in project.video" :key="video.id" class="media-item">
          <template v-if="video.mime.startsWith('video')">
            <video controls autoplay muted loop class="media-video">
              <source :src="`https://api.penelopeletienne.ovh${video.url}`" :type="video.mime" />
              Votre navigateur ne supporte pas la vidéo.
            </video>
          </template>
        </div>
      </div>

      <!-- Scène 3D si présent -->
      <div v-if="project.has3D && project.modelUrl" class="three-scene">
        <ThreeViewer :modelUrl="project.modelUrl" />
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

// Lazy-load le viewer pour alléger le bundle
const ThreeViewer = defineAsyncComponent(() => import('../components/ThreeViewer.vue'));

const project = ref(null);
const route = useRoute();
const router = useRouter();

const lightboxVisible = ref(false);
const lightboxImages = ref([]);
const lightboxIndex = ref(0);

onMounted(async () => {
  const projectId = Number(route.params.id);
  try {
    const response = await fetch(`https://api.penelopeletienne.ovh/api/projets?populate=*`);
    if (!response.ok) throw new Error('Erreur lors de la récupération des projets');

    const { data } = await response.json();
    const projectData = data.find((proj) => proj.id === projectId);

    if (!projectData) throw new Error('Projet non trouvé');

    // Détection robuste de l'URL du modèle (par différents schémas possibles)
    let candidateModelUrl: string | null = null;

    // cas : media field (Strapi v4 relation format)
    if (projectData.model?.data?.attributes?.url) {
      candidateModelUrl = `https://api.penelopeletienne.ovh${projectData.model.data.attributes.url}`;
    } else if (projectData.Model?.data?.attributes?.url) {
      candidateModelUrl = `https://api.penelopeletienne.ovh${projectData.Model.data.attributes.url}`;
    } else if (projectData.modelUrl) {
      candidateModelUrl = projectData.modelUrl; // peut être URL absolue (ex: Supabase)
    } else if (projectData.Model && typeof projectData.Model === 'string') {
      candidateModelUrl = projectData.Model;
    }

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
      has3D: !!candidateModelUrl,
      modelUrl: candidateModelUrl || null,
    };

    lightboxImages.value = project.value.media
      .filter((media) => media.mime.startsWith('image'))
      .map((media) => `https://api.penelopeletienne.ovh${media.url}`);
  } catch (error) {
    console.error('Erreur :', error);
  }
});

onBeforeUnmount(() => {
  // Rien de spécial à nettoyer ici — ThreeViewer gère sa propre scène
});

function formatDate(dateString) {
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
  text-align: center;
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
</style>
