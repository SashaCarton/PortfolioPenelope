<script setup>
import { ref, onMounted } from 'vue'

const projects = ref([])

onMounted(async () => {
    const res = await fetch('http://localhost:3000/api/projects')
    projects.value = await res.json()
})
</script>

<template>
    <section>
        <h2>Mes Projets</h2>
        <ul>
            <li v-for="project in projects" :key="project.id">
                <h3>{{ project.title }}</h3>
                <p>{{ project.description }}</p>
            </li>
        </ul>
    </section>
</template>

<style scoped>
h2 {
    margin-top: 2rem;
}
</style>
