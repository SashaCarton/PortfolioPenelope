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

      <!-- Scène 3D seulement pour ID = 125 -->
      <div v-if="project.id === 125" ref="threeContainer" class="three-scene"></div>

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

<script setup>
import { ref, onMounted, nextTick, onBeforeUnmount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import VueEasyLightbox from 'vue-easy-lightbox';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const project = ref(null);
const route = useRoute();
const router = useRouter();

const lightboxVisible = ref(false);
const lightboxImages = ref([]);
const lightboxIndex = ref(0);
const threeContainer = ref(null);

let renderer, camera, scene, controls, animationId;

onMounted(async () => {
  const projectId = route.params.id;
  try {
    const response = await fetch(`https://api.penelopeletienne.ovh/api/projets?populate=*`);
    if (!response.ok) throw new Error('Erreur lors de la récupération des projets');

    const { data } = await response.json();
    const projectData = data.find((proj) => proj.id === parseInt(projectId));

    if (!projectData) throw new Error('Projet non trouvé');

    project.value = {
      id: projectData.id,
      title: projectData.Titre || 'Sans titre',
      description: projectData.Description || 'Pas de description',
      createdAt: projectData.createdAt,
      cover: projectData.Cover?.formats?.medium?.url
        ? `https://api.penelopeletienne.ovh${projectData.Cover.formats.medium.url}`
        : null,
      media: projectData.Media || [],
      video: projectData.Video || [],
    };

    if (project.value.id === 125) {
      await nextTick();
      initThreeScene();
    }

    lightboxImages.value = project.value.media
      .filter((media) => media.mime.startsWith('image'))
      .map((media) => `https://api.penelopeletienne.ovh${media.url}`);
  } catch (error) {
    console.error('Erreur :', error);
  }
});

onBeforeUnmount(() => {
  if (animationId) cancelAnimationFrame(animationId);
  if (renderer) {
    renderer.dispose();
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

function goBackToProjects() {
  router.push('/projects');
}

// Scène THREE.js avec import d'un objet et OrbitControls
function initThreeScene() {
  const container = threeContainer.value;
  if (!container) return;

  // Scène
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x222222);

  // Caméra
  camera = new THREE.PerspectiveCamera(
    75,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  );
  camera.position.set(0, 1, 3);

  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  // Lumières
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(2, 2, 5);
  scene.add(light);
  
  const ambient = new THREE.AmbientLight(0x404040, 1.5);
  scene.add(ambient);

  // OrbitControls
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true; // mouvement plus smooth
  controls.dampingFactor = 0.05;
  controls.enablePan = true;
  controls.enableZoom = true;

  // Charger un modèle GLB/GLTF
  const loader = new GLTFLoader();
  loader.load(
    '../assets/house.glb', // 👉 mets ton chemin correct ici
    (gltf) => {
      const model = gltf.scene;
      model.scale.set(1, 1, 1);
      model.position.set(0, 0, 0);
      scene.add(model);
    },
    undefined,
    (error) => {
      console.error('Erreur de chargement du modèle :', error);
    }
  );

  // Resize responsive
  window.addEventListener('resize', onWindowResize);

  // Animation
  function animate() {
    animationId = requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }
  animate();
}

function onWindowResize() {
  if (!renderer || !camera || !threeContainer.value) return;
  const container = threeContainer.value;
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
}
function render(time) {
  time *= 0.001;  // convert time to seconds
  renderer.render(scene, camera);
 
  requestAnimationFrame(render);
}
requestAnimationFrame(render);
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
.project-media video {
  width: auto;
  height: 200px;
  border-radius: 12px;
}

.media-item {
  margin-bottom: 1.5rem;
  border-radius: 12px;
  overflow: hidden;
  padding: 0.5rem;
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
