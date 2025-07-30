<template>
  <section class="projects">
    <h1>Mes réalisations</h1>
    <div class="projects-container">
      <div
        v-for="(project, index) in projects"
        :key="project.id"
        class="project-item"
        @click="goToProjectDetails(project.id)"
      >
        <img :src="project.cover" :alt="project.title" />
        <h3>{{ project.title }}</h3>
        <p>{{ project.description }}</p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const projects = ref([]);
const router = useRouter();

onMounted(async () => {
  try {
    const response = await fetch('https://api.penelopeletienne.ovh/api/projets?populate=Cover');
    if (!response.ok) throw new Error('Erreur lors de la récupération des projets');

    const { data } = await response.json();
    projects.value = data.map(project => ({
      id: project.id,
      title: project.Titre || 'Sans titre',
      description: project.Description || 'Pas de description',
      favorite: project.Favorite || false,
      createdAt: project.createdAt,
      cover: project.Cover?.formats?.medium?.url 
        ? `https://api.penelopeletienne.ovh${project.Cover.formats.medium.url}` 
        : project.Cover?.url 
        ? `https://api.penelopeletienne.ovh${project.Cover.url}` 
        : null,
    }));
  } catch (error) {
    console.error('Erreur :', error);
  }
});

function goToProjectDetails(projectId) {
  router.push({ name: 'ProjectDetails', params: { id: projectId } });
}
</script>

<style scoped>
.projects {
  padding: 2rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 3rem;
  color: #000;
  text-align: center;
  font-family: 'Inter', sans-serif;
}

.projects-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
  width: 80%;
}

.project-item {
  cursor: pointer;
  text-align: center;
  flex: 1 1 calc(33.333% - 1rem);
  max-width: calc(33.333% - 1rem);
  box-sizing: border-box;
  height: 350px; /* Hauteur fixe pour uniformiser les cartes */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
}

.project-item img {
  width: auto;
  max-height: 70%; /* Limite la hauteur de l'image pour s'adapter à la carte */
  border-radius: 12px;
  transition: transform 0.3s ease;
}

.project-item:hover img {
  transform: scale(1.02);
}

.project-item h3 {
  margin-top: 0.5rem;
  font-size: 1.2rem;
  color: #333;
}

.project-item p {
  font-size: 0.9rem;
  color: #666;
  margin-top: 0.5rem;
  text-align: center;
}

@media (max-width: 1024px) {
  .project-item {
    flex: 1 1 calc(50% - 1rem);
    max-width: calc(50% - 1rem);
  }
}

@media (max-width: 768px) {
  .project-item {
    flex: 1 1 calc(100% - 1rem);
    max-width: calc(100% - 1rem);
  }
}
</style>
