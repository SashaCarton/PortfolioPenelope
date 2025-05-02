<template>
  <section class="portfolio">
    <h1>Mes projets</h1>
    <!-- Grille de projets -->
    <div class="projects-grid">
      <div
        v-for="project in projects"
        :key="project.id"
        class="project-item"
        @click="goToProjectDetails(project.id)"
      >
        <img :src="`http://localhost:3000${project.image}`" :alt="project.title" />
        <div class="project-info">
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
    const response = await fetch('http://localhost:3000/api/projects');
    if (!response.ok) throw new Error('Erreur réseau');
    const data = await response.json();
    projects.value = data;
  } catch (error) {
    console.error('Impossible de charger les projets :', error);
  }
});

function goToProjectDetails(projectId) {
  router.push({ name: 'ProjectDetails', params: { id: projectId } });
}
</script>

<style scoped>
h1 {
  font-size: 2.5rem;
  font-weight: 300;
  margin-bottom: 1rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: 100px;
}
.portfolio {
  font-family: 'Helvetica Neue', sans-serif;
  color: #333;
  text-align: center;
  padding: 2rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
  text-transform: lowercase;
}

.nav a {
  margin: 0 1rem;
  text-decoration: none;
  color: #333;
  font-size: 1rem;
  font-weight: 300;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 2rem;  
  animation: fadeIn 0.8s ease-in-out;
}

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

@media (min-width: 1024px) {
  .projects-grid {
    grid-template-columns: repeat(4, 1fr); /* 4 projets par ligne sur desktop */
  }
}

@media (max-width: 768px) {
  .projects-grid {
    grid-template-columns: repeat(2, 1fr); /* 2 projets par ligne sur tablette */
  }
}

@media (max-width: 480px) {
  .projects-grid {
    grid-template-columns: 1fr; /* 1 projet par ligne sur mobile */
  }
}

.project-item {
  cursor: pointer;
  position: relative;
  background: #fff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
}

.project-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.project-item img {
  width: 100%;
  height: auto;
  display: block;
}

.project-info {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: opacity 0.3s;
  text-align: center;
  padding: 1rem;
  box-sizing: border-box;
}

.project-item:hover .project-info {
  opacity: 1;
}

.project-info h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: bold;
}

.project-info p {
  margin: 0.5rem 0 0;
  font-size: 1rem;
}
</style>
