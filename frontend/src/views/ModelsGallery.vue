<template>
  <div class="models-page">
    <header class="page-header">
      <h1>Galerie de modèles 3D</h1>
      <p>Sélectionnez un modèle pour l'afficher dans la scène.</p>
    </header>

    <div class="models-layout">
      <aside class="models-grid">
        <ModelThumbnail
          v-for="model in models"
          :key="model.id"
          :model="model"
          :selected="selectedModel && model.id === selectedModel.id"
          @select="selectModel"
        />
      </aside>

      <section class="viewer-pane">
        <div class="viewer-card">
          <ThreeViewer v-if="selectedModel" :modelUrl="selectedModel.modelUrl" />
          <div v-else class="empty-state">Sélectionnez un modèle à gauche.</div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import ThreeViewer from '../components/ThreeViewer.vue';
import ModelThumbnail from '../components/ModelThumbnail.vue';

const models = ref([
  { id: 'horse', title: 'Horse', thumb: '/assets/models/thumbs/horse.jpg', modelUrl: '/assets/models/horse.glb' },
  { id: 'chair', title: 'Chair', thumb: '/assets/models/thumbs/chair.jpg', modelUrl: '/assets/models/chair.glb' },
  { id: 'car', title: 'Car', thumb: '/assets/models/thumbs/car.jpg', modelUrl: '/assets/models/car.glb' },
]);

const selectedModel = ref(null as null | { id: string; title: string; thumb: string; modelUrl: string });

function selectModel(model: any) {
  selectedModel.value = model;
}

onMounted(() => {
  // sélection par défaut
  selectedModel.value = models.value[0];
});
</script>

<style scoped>
.models-page {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}
.page-header {
  text-align: center;
  margin-top: 6rem;
  margin-bottom: 1.5rem;
}
.page-header h1 {
  margin: 0 0 0.5rem 0;
  font-size: 2rem;
  color: #222;
  font-family: 'Inter', sans-serif;
}
.page-header p {
  margin: 0;
  color: #666;
}
.models-layout {
  display: flex;
  gap: 1.5rem;
  align-items: flex-start;
}
.models-grid {
  width: 320px;
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}
.viewer-pane {
  flex: 1;
  min-height: 500px;
  display: flex;
  align-items: stretch;
}
.viewer-card {
  width: 100%;
  background: #fff;
  border-radius: 12px;
  padding: 1rem;
  border: 1px solid #eee;
  box-shadow: 0 8px 24px rgba(0,0,0,0.06);
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 480px;
}
.viewer-card .three-viewer {
  width: 100%;
  height: 100%;
}
.empty-state {
  color: #888;
}

@media (max-width: 1024px) {
  .models-grid { width: 280px; }
}

@media (max-width: 800px) {
  .models-layout {
    flex-direction: column;
  }
  .models-grid { width: 100%; }
  .page-header { margin-top: 4rem; }
}

</style>