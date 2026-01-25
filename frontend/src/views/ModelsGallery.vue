<template>
  <section class="models-removed">
    <h1>Page supprimée</h1>
    <p>La galerie 3D a été retirée. Vous pouvez consulter les modèles sur les pages de projets.</p>
    <router-link to="/projects" class="btn">Voir les projets</router-link>
  </section>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();
// redirection immédiate pour éviter les accès directs
onMounted(() => {
  router.replace('/projects');
});
</script>

<style scoped>
.models-removed { padding: 3rem; text-align: center; }
.models-removed .btn { display: inline-block; margin-top: 1rem; padding: 0.6rem 1rem; background:#000; color:#fff; border-radius:6px; text-decoration:none }
</style>