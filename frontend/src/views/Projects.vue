<template>
  <section class="projects">
    <h1>  </h1>
    <div class="projects-container">
      <!-- Skeleton loading -->
      <div
        v-if="isLoading"
        v-for="n in 6"
        :key="'skeleton-'+n"
        class="project-item skeleton"
      >
        <div class="skeleton-image"></div>
        <div class="skeleton-title"></div>
        <div class="skeleton-text"></div>
        <div class="fade"></div>
      </div>

      <!-- Actual projects -->
      <div
        v-else
        v-for="(project, index) in projects"
        :key="project.id"
        class="project-item"
        @click="goToProjectDetails(project.id)"
      >
        <span v-if="project.has3D" class="three-badge">3D</span>
        <img :src="project.cover" :alt="project.title" />
        <h3>{{ project.title }}</h3>
        <p>{{ project.description }}</p>
        <div class="fade"></div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const projects = ref([]);
const isLoading = ref(true);
const router = useRouter();

onMounted(async () => {
  isLoading.value = true;
  try {
    // demander tous les champs (y compris URL_SUPABASE si présent)
    const response = await fetch('https://api.penelopeletienne.ovh/api/projets?populate=*');
    if (!response.ok) throw new Error('Erreur lors de la récupération des projets');
    const { data } = await response.json();
    
    projects.value = data.map(project => {
      // Récupérer toutes les URLs possibles (URL_SUPABASE peut être un tableau)
      const modelUrls = [];
      if (project.URL_SUPABASE && Array.isArray(project.URL_SUPABASE)) {
        project.URL_SUPABASE.forEach((m) => { if (m?.url) modelUrls.push(m.url); });
      }
      // champs locaux / relations
      if (project.model?.data?.attributes?.url) {
        modelUrls.push(`https://api.penelopeletienne.ovh${project.model.data.attributes.url}`);
      }
      if (project.Model?.data?.attributes?.url) {
        modelUrls.push(`https://api.penelopeletienne.ovh${project.Model.data.attributes.url}`);
      }
      if (project.modelUrl) {
        modelUrls.push(project.modelUrl);
      }
      // retirer doublons
      const uniqueModelUrls = Array.from(new Set(modelUrls));

      return {
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
        has3D: uniqueModelUrls.length > 0,
        modelUrls: uniqueModelUrls,
      };
    });
    
    isLoading.value = false;
  } catch (error) {
    console.error('Erreur :', error);
    isLoading.value = false;
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
  font-size: 2rem;
  margin-bottom: 3rem;
  margin-top: 80px;
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
  height: 400px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  overflow: hidden;
  position: relative;
}

.fade {
  position: absolute;
  bottom: 0px;
  left: 0;
  width: 100%;
  height: 50px;
  background: linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,1));
}

.project-item img {
  width: auto;
  max-height: 70%;
  border-radius: 5px;
  transition: transform 0.3s ease;
}

.project-item:hover img {
  transform: scale(1.10);
}

.project-item h3 {
  margin-top: 1rem;
  margin-bottom: 0.2rem;
  font-size: 1.2rem;
  color: #333;
}

.project-item p {
  font-size: 0.9rem;
  height: 1.5rem;
  color: #666;
  margin-top: 0.5rem;
  text-align: center;
}

/* Skeleton Loading Styles */
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

.skeleton-image {
  width: 100%;
  height: 70%;
  border-radius: 5px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

.skeleton-title {
  width: 60%;
  height: 24px;
  margin: 0.5rem auto;
  border-radius: 4px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

.skeleton-text {
  width: 80%;
  height: 16px;
  margin: 0.5rem auto;
  border-radius: 4px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

/* Animation d'apparition */
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

.project-item:not(.skeleton) {
  animation: fadeIn 0.8s ease-out forwards;
}

/* Responsive Adjustments */
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

h1 {
  font-size: 1.6rem;
  margin-bottom: 3rem;
  margin-top: 30px;
  color: #000;
  text-align: center;
  font-family: 'Inter', sans-serif;
}
}

/* Badge 3D */
.three-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background: #ffffff;
  color: #111;
  padding: 0.28rem 0.45rem;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.8rem;
  z-index: 5;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}
</style>
