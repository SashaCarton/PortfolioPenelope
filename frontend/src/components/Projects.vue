<script setup>
import { ref, onMounted } from 'vue';

const projects = ref([]);

onMounted(async () => {
    try {
        const response = await fetch('http://localhost:3000/api/projects');
        if (!response.ok) throw new Error('Erreur réseau');
        projects.value = await response.json(); // Les chemins des images sont déjà corrigés dans le backend
    } catch (error) {
        console.error('Impossible de charger les projets :', error);
    }
});
</script>

<template>
    <section>
        <h2>Mes Projets</h2>
        <ul>
            <li v-for="project in projects" :key="project.id">
                <h3>{{ project.title }}</h3>
                <p>{{ project.description }}</p>
                <img :src="project.image" :alt="project.title" v-if="project.image" />
            </li>
        </ul>
    </section>
</template>

<style scoped>
h2 {
    margin-top: 2rem;
}
</style>
