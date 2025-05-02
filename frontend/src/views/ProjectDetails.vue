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

      <!-- Galerie d'images associées au projet -->
      <div class="project-gallery">
        <img v-for="(image, index) in project.gallery" :key="index" :src="image" :alt="`Image ${index + 1}`" />
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
    project.value = {
      ...data,
      gallery: [
        // Exemple d'images associées au projet
        `http://localhost:3000/uploads/${data.image}`,
        `http://localhost:3000/uploads/example1.jpg`,
        `http://localhost:3000/uploads/example2.jpg`,
      ],
    };
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
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 1rem;
  margin-top: 2rem;
}

.project-gallery img {
  width: 100%;
  height: auto;
  border-radius: 8px; /* Coins arrondis pour un style plus doux */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  object-fit: cover;
}

/* Styles pour des hauteurs et tailles variées */
.project-gallery img:nth-child(1) {
  grid-row: span 2;
  grid-column: span 2;
  height: 300px;
}

.project-gallery img:nth-child(2) {
  grid-row: span 1;
  grid-column: span 1;
  height: 150px;
}

.project-gallery img:nth-child(3) {
  grid-row: span 1;
  grid-column: span 2;
  height: 200px;
}

.project-gallery img:nth-child(4) {
  grid-row: span 2;
  grid-column: span 1;
  height: 250px;
}

.project-gallery img:nth-child(5) {
  grid-row: span 1;
  grid-column: span 1;
  height: 150px;
}

.project-gallery img:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
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