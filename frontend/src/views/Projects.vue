<template>
  <section class="projects">
    <h1>Mes Projets</h1>
    <div class="projects-grid">
      <div v-for="project in projects" :key="project.id" class="project-item">
        <img :src="`http://localhost:3000/uploads/${project.image}`" :alt="project.title" />
        <h3>{{ project.title }}</h3>
        <p>{{ project.description }}</p>
        <router-link :to="`/projects/${project.id}`" class="btn">Voir le projet</router-link>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const projects = ref([]);

onMounted(async () => {
  try {
    const response = await fetch('http://localhost:3000/api/projects');
    if (!response.ok) throw new Error('Erreur réseau');
    projects.value = await response.json();
  } catch (error) {
    console.error('Impossible de charger les projets :', error);
  }
});
</script>

<style scoped>
.projects {
  padding: 2rem;
  text-align: center;
}

.projects h1 {
  font-size: 2.5rem;
  margin-bottom: 2rem;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.project-item {
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
}

.project-item:hover {
  transform: translateY(-5px);
}

.project-item img {
  width: 100%;
  height: auto;
}

.project-item h3 {
  font-size: 1.5rem;
  margin: 1rem 0;
}

.project-item p {
  font-size: 1rem;
  margin: 0 1rem 1rem;
}

.btn {
  display: inline-block;
  margin: 1rem;
  padding: 0.5rem 1rem;
  background: #000;
  color: #fff;
  text-decoration: none;
  font-size: 1rem;
  text-transform: uppercase;
  border-radius: 4px;
  transition: background 0.3s;
}

.btn:hover {
  background: #333;
}
</style>
