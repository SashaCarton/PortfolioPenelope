<template>
  <section class="project-details">
    <div v-if="project" class="project-container">
      <h1>{{ project.title }}</h1>
      <img :src="project.cover" :alt="project.title" class="project-cover" />
      <p class="project-description">{{ project.description }}</p>
      <div class="project-meta">
        <p><strong>Date de création :</strong> {{ formatDate(project.createdAt) }}</p>
      </div>
      <div class="project-media">
        <div v-for="(media, index) in project.media" :key="media.id" class="media-item">
          <template v-if="media.mime.startsWith('image')">
            <img
              :src="`http://localhost:1337${media.url}`"
              :alt="media.name"
              class="media-image"
              @click="openLightbox(index)"
            />
          </template>
        </div>
        <div v-for="video in project.video" :key="video.id" class="media-item">
          <template v-if="video.mime.startsWith('video')">
            <video controls autoplay muted loop class="media-video">
              <source :src="`http://localhost:1337${video.url}`" :type="video.mime" />
              Votre navigateur ne supporte pas la vidéo.
            </video>
          </template>
        </div>
      </div>
    </div>
    <div v-else>
      <p>Chargement des détails du projet...</p>
    </div>

    <!-- Visualiseur -->
    <vue-easy-lightbox
      :visible="lightboxVisible"
      :imgs="lightboxImages"
      :index="lightboxIndex"
      @hide="lightboxVisible = false"
    />
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import VueEasyLightbox from 'vue-easy-lightbox';

const project = ref(null);
const route = useRoute();

const lightboxVisible = ref(false);
const lightboxImages = ref([]);
const lightboxIndex = ref(0);

onMounted(async () => {
  const projectId = route.params.id;
  try {
    const responseCover = await fetch(`http://localhost:1337/api/projets?populate=Cover`);
    const response = await fetch(`http://localhost:1337/api/projets?populate=Media`);
    const responseVideo = await fetch(`http://localhost:1337/api/projets?populate=Video`);

    if (!response.ok) throw new Error('Erreur lors de la récupération des projets');

    const { data: dataVideo } = await responseVideo.json();
    const videoData = dataVideo.find((proj) => proj.id === parseInt(projectId));

    const { data } = await response.json();
    const projectData = data.find((proj) => proj.id === parseInt(projectId));
    const coverData = await responseCover.json();
    const cover = coverData.data.find((proj) => proj.id === parseInt(projectId));
    if (cover) {
      projectData.Cover = cover.Cover;
    }
    if (!projectData) throw new Error('Erreur lors de la récupération du projet');
    if (!projectData) throw new Error('Projet non trouvé');

    project.value = {
      id: projectData.id,
      title: projectData.Titre || 'Sans titre',
      description: projectData.Description || 'Pas de description',
      createdAt: projectData.createdAt,
      cover: projectData.Cover?.formats?.medium?.url
        ? `http://localhost:1337${projectData.Cover.formats.medium.url}`
        : projectData.Cover?.url
        ? `http://localhost:1337${projectData.Cover.url}`
        : null,
      media: projectData.Media || [],
    };

    if (videoData) {
      project.value.video = videoData.Video || [];
    } else {
      project.value.video = null;
    }

    // Préparer les images pour le visualiseur
    lightboxImages.value = project.value.media
      .filter((media) => media.mime.startsWith('image'))
      .map((media) => `http://localhost:1337${media.url}`);
  } catch (error) {
    console.error('Erreur :', error);
  }
});

function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('fr-FR', options);
}

function openLightbox(index) {
  lightboxIndex.value = index;
  lightboxVisible.value = true;
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

.project-cover {
  width: 70%;
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
  width: 50%;
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
.project-media{
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
}
.project-media img {
  width: 200px;
  height: 200px;
  border-radius: 12px;
  object-fit: cover;
  margin-bottom: 1rem;
}
.project-media,
.project-video {
  margin-top: 2rem;
  text-align: left;
}
.project-media video {
  width: 200px;
  border-radius: 12px;
}

.project-media h2,
.project-video h2 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  border-left: 4px solid #6366f1;
  padding-left: 0.5rem;
  color: #333;
}

.media-item {
  margin-bottom: 1.5rem;
  border-radius: 12px;
  overflow: hidden;
  padding: 0.5rem;
}


@media (max-width: 768px) {
  .project-container {
    padding: 1rem;
  }

  h1 {
    font-size: 1.8rem;
  }

  .project-description {
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .project-details {
    padding: 1rem 0.5rem;
  }

  h1 {
    font-size: 1.5rem;
  }

  .project-description {
    font-size: 0.95rem;
  }
}

</style>