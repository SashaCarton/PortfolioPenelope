<template>
  <section class="projects">
    <h1>Mes réalisations</h1>
    <div v-for="(group, groupIndex) in chunkProjects(projects, 11)" :key="groupIndex">
      <div class="row-container">
        <div
          v-for="(project, index) in group.slice(0, 2)"
          :key="project.id"
          class="row-item"
          @click="goToProjectDetails(project.id)"
        >
          <img :src="project.cover" :alt="project.title" />
          <h3>{{ project.title }}</h3>
          <p>{{ project.description }}</p>
        </div>
      </div>
      <div class="trait"></div>
      <div class="grid-container">
        <div
          v-for="(project, index) in group.slice(2)"
          :key="project.id"
          class="grid-item"
          @click="goToProjectDetails(project.id)"
        >
          <img :src="project.cover" :alt="project.title" />
          <h3>{{ project.title }}</h3>
          <p>{{ project.description }}</p>
        </div>
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

function chunkProjects(array, size) {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
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

.row-container {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 2rem;
  width: 100%;
  max-width: 1200px;
}

.row-item {
  cursor: pointer;
  text-align: center;
  flex: 1;
  max-width: 45%;
  height: 500px;
}

.row-item img {
  width: auto;
  height: 70%;
  border-radius: 12px;
  transition: transform 0.3s ease;
}

.row-item:hover img {
  transform: scale(1.02);
}

.row-item h3 {
  margin-top: 0.5rem;
  font-size: 1.5rem;
  color: #333;
}

.row-item p {
  font-size: 1rem;
  color: #666;
  margin-top: 0.5rem;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
  width: 100%;
  max-width: 1200px;
}

.grid-item {
  cursor: pointer;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.grid-item img {
  width: 100%;
  height: auto;
  border-radius: 8px;
  transition: transform 0.3s ease;
  align-self: center;
}

.grid-item:hover img {
  transform: scale(1.02);
}

.grid-item h3 {
  margin-top: 0.5rem;
  font-size: 1.2rem;
  color: #333;
  text-align: center;
}

.grid-item p {
  font-size: 0.9rem;
  color: #666;
  margin-top: 0.5rem;
  text-align: center;
}

.trait {
  width: 100%;
  height: 1px;
  background-color: #000;
  margin: 1rem auto;
  margin-bottom: 10rem;
}

@media (max-width: 1024px) {
  .row-container {
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 1.5rem;
  }

  .row-item {
    max-width: 100%;
  }
  .row-item img {
    width: 50%!important;
  }

  .grid-container {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .row-container {
    flex-direction: column;
    gap: 1rem;
  }

  .row-item {
    width: 100%;
  }
  .row-item img {
    width: 50%!important;
  }

  .grid-container {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .grid-container {
    grid-template-columns: 1fr;
  }

  .row-item img {
    width: 70%!important;
  }

  .row-item h3, .grid-item h3 {
    font-size: 1.2rem;
  }

  .row-item p, .grid-item p {
    font-size: 0.9rem;
  }
}
</style>
