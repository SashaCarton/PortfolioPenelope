<template>
  <section class="projects">
    <div v-for="(group, groupIndex) in chunkProjects(projects, 11)" :key="groupIndex">
      <div class="row-container">
        <div
          v-for="(project, index) in group.slice(0, 2)"
          :key="project.id"
          class="row-item"
          @click="goToProjectDetails(project.id)"
        >
          <img :src="project.cover" :alt="project.title" />
          <div class="trait"></div>

          <h3>{{ project.title }}</h3>
          <p>{{ project.description }}</p>
        </div>
      </div>
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
    const response = await fetch('http://localhost:1337/api/projets?populate=Cover');
    if (!response.ok) throw new Error('Erreur lors de la récupération des projets');

    const { data } = await response.json();
    projects.value = data.map(project => ({
      id: project.id,
      title: project.Titre || 'Sans titre',
      description: project.Description || 'Pas de description',
      favorite: project.Favorite || false,
      createdAt: project.createdAt,
      cover: project.Cover?.formats?.medium?.url 
        ? `http://localhost:1337${project.Cover.formats.medium.url}` 
        : project.Cover?.url 
        ? `http://localhost:1337${project.Cover.url}` 
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
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 2rem;
  color: #6a4b8a;
}

.row-container {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.row-item {
  cursor: pointer;
  text-align: center;
  width: 45%;
}

.row-item img {
  width: 60%;
  height: auto;
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
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
}

.grid-item {
  cursor: pointer;
  text-align: center;
}

.grid-item img {
  width: 40%;
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
}

.grid-item p {
  font-size: 0.9rem;
  color: #666;
  margin-top: 0.5rem;
}
.trait {
  width: 50%;
  height: 1px;
  background-color: #000;
  margin: 1rem auto;
}

@media (max-width: 768px) {
  .row-container {
    flex-direction: column;
    gap: 1rem;
  }

  .row-item {
    width: 100%;
  }

  .grid-container {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .grid-container {
    grid-template-columns: 1fr;
  }

  .row-item img, .grid-item img {
    width: 80%;
  }

  .row-item h3, .grid-item h3 {
    font-size: 1.2rem;
  }

  .row-item p, .grid-item p {
    font-size: 0.9rem;
  }
}
</style>
