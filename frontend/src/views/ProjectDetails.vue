<template>
  <section class="project-details">
    <div v-if="loading" class="loading">Chargement du projet...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="project" class="project-container">
      <h1>{{ project.title }}</h1>
      <img :src="`http://localhost:3000${project.image}`" :alt="project.title" class="project-image" />
      <p class="project-description">{{ project.description }}</p>
      <ul class="project-tags">
        <li v-for="tag in project.tags" :key="tag" class="tag-item">{{ tag }}</li>
      </ul>
      <a v-if="project.link" :href="project.link" target="_blank" class="project-link">Voir le projet</a>

      <!-- Galerie d'images et vidéos associées au projet -->
      <div class="project-gallery">
        <div v-for="(media, index) in project.media" :key="index" class="media-item">
          <img v-if="media.type === 'image'" :src="`http://localhost:3000/uploads/${media.filename}`" :alt="`Image ${index + 1}`" />
          <video v-else-if="media.type === 'video'" controls>
            <source :src="`http://localhost:3000/uploads/${media.filename}`" :type="media.type" />
            Votre navigateur ne supporte pas la lecture de vidéos.
          </video>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const project = ref(null);
const loading = ref(true);
const error = ref(null);

onMounted(async () => {
  const projectId = route.params.id;
  try {
    const response = await fetch(`http://localhost:3000/api/projects/${projectId}`);
    if (!response.ok) {
      throw new Error(`Erreur réseau : ${response.statusText}`);
    }
    const data = await response.json();
    project.value = data;
  } catch (err) {
    console.error('Erreur lors du chargement du projet :', err);
    error.value = 'Impossible de charger le projet. Veuillez réessayer plus tard.';
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.project-details {
  animation: fadeIn 0.8s ease-in-out;
}

.project-details {
  max-width: 800px;
  margin: 2rem auto;
  padding: 1rem;
  font-family: 'Helvetica Neue', sans-serif;
  color: #6a4b8a;
  text-align: center;
}

.project-container {
  background: #fff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.project-image {
  width: 100%;
  height: auto;
  border-radius: 8px;
  margin: 1rem 0;
}

.project-gallery {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-top: 2rem;
}

.media-item img,
.media-item video {
  width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.project-description {
  font-size: 1.2rem;
  line-height: 1.6;
  margin: 1rem 0;
}

.project-tags {
  list-style: none;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
}

.tag-item {
  background: #6a4b8a;
  color: #fff;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-size: 0.875rem;
}

.project-link {
  display: inline-block;
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  background: #6a4b8a;
  color: #fff;
  text-decoration: none;
  border-radius: 4px;
  font-size: 1rem;
  text-transform: uppercase;
  font-weight: 300;
  letter-spacing: 1px;
  transition: background 0.3s ease;
}

.project-link:hover {
  background: #563d6e;
}

.loading {
  text-align: center;
  font-size: 1.5rem;
  color: #6a4b8a;
}

.error {
  text-align: center;
  font-size: 1.2rem;
  color: red;
}
</style>