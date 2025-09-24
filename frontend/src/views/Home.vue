<template>
    <!-- Projects Carousel Section -->
    <section class="carousel-section">
        <div class="carousel-container">
            <button class="carousel-control prev" @click="prevSlide" aria-label="Diapositive précédente">‹</button>
            <div 
                class="carousel-window"
                @mousedown="startDrag"
                @mouseup="endDrag"
                @mouseleave="endDrag"
                @touchstart="startDrag"
                @touchend="endDrag"
            >
                <div class="carousel-track" :style="trackStyle">
                    <!-- Skeleton loading -->
                    <div
                        v-if="isLoading"
                        v-for="skeleton in skeletonProjects"
                        :key="skeleton.id"
                        class="carousel-item skeleton"
                    >
                        <div class="skeleton-image"></div>
                        <div class="item-overlay">
                            <div class="skeleton-title"></div>
                        </div>
                    </div>
                    
                    <!-- Actual projects -->
                    <div
                        v-else
                        v-for="project in projects"
                        :key="project.id"
                        class="carousel-item"
                        @click="goToProjectDetails(project.id)"
                    >
                        <div class="image-container">
                            <img :src="project.cover" :alt="project.title" />
                        </div>
                        <div class="item-overlay">
                            <h2>{{ project.title }}</h2>
                        </div>
                    </div>
                </div>
            </div>
            <button class="carousel-control next" @click="nextSlide" aria-label="Diapositive suivante">›</button>
            <button class="projects-button" @click="router.push({ name: 'Projects' })">Voir tous les projets →</button>
        </div>
    </section>

    <!-- Intro Text Section -->
    <div class="home__text">
        <div class="picture" :class="{ 'skeleton': isLoading }">
            <img v-if="!isLoading" src="\images\ASCII woman.gif" alt="Spinning ASCII art" />
            <div v-else class="skeleton-image"></div>
        </div>
        <div class="text" :class="{ 'skeleton-text': isLoading }">
            <template v-if="!isLoading">
                <h1>Étudiante en design numérique — approche hybride de l'expérience, de la sensibilité et de la recherche</h1>
                <p>Après neuf années de formation en beaux-arts, j'ai par la suite obtenu un bac STD2A (arts appliqués) qui m'a naturellement conduite vers le design et l'expérience utilisateur.</p>
                <p>Je suis passionnée par l'architecture de l'information, les micro-interactions et la dimension émotionnelle des interfaces. Actuellement, je poursuis ma formation à l'ENSAAMA, école parisienne de design et de métiers d'art.</p>
                <button @click="router.push({ name: 'About' })" class="btn-secondary">En savoir plus →</button>
            </template>
            <template v-else>
                <div class="skeleton-line skeleton-title"></div>
                <div class="skeleton-line"></div>
                <div class="skeleton-line"></div>
                <div class="skeleton-line" style="width: 70%"></div>
                <div class="skeleton-button"></div>
            </template>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';

const projects = ref([]);
const isLoading = ref(true);
const currentIndex = ref(0);
const router = useRouter();

// Nombre d'éléments visibles par diapositive
const itemsPerSlide = 4;

// Créer un tableau de skeletons pour le chargement
const skeletonProjects = Array(8).fill(null).map((_, i) => ({ id: `skeleton-${i}` }));

onMounted(async () => {
    isLoading.value = true;
    try {
        const res = await fetch('https://api.penelopeletienne.ovh/api/projets?populate=Cover');
        if (!res.ok) throw new Error('Erreur récupération projets');
        const payload = await res.json();
        const rawProjects = payload.data;
        
        // Simuler un petit délai pour montrer le skeleton (optionnel)
        
        projects.value = rawProjects.map(proj => {
            const cov = proj.Cover;
            const fmt = cov?.formats?.medium?.url;
            const urlSegment = fmt || cov?.url;
            const fullUrl = urlSegment?.startsWith('http')
                ? urlSegment
                : `https://api.penelopeletienne.ovh${urlSegment}`;
    
            return {
                id: proj.id,
                title: proj.Titre,
                cover: fullUrl || '/images/default-cover.jpg',
            };
        });
        
        isLoading.value = false;
    } catch (e) {
        console.error('Erreur chargement projets :', e);
        isLoading.value = false;
    }
});

// Calcul du nombre total de diapositives
const slideCount = computed(() => Math.max(0, projects.value.length - itemsPerSlide + 1));

// Style de transformation pour le défilement
const trackStyle = computed(() => ({
    transform: `translateX(-${currentIndex.value * (100 / itemsPerSlide)}%)`,
}));

function nextSlide() {
    if (!projects.value.length) return;
    if (currentIndex.value >= projects.value.length - itemsPerSlide) {
        currentIndex.value = 0;
    } else {
        currentIndex.value = Math.min(currentIndex.value + 1, projects.value.length - itemsPerSlide);
    }
}

function prevSlide() {
    if (!projects.value.length) return;
    if (currentIndex.value <= 0) {
        currentIndex.value = projects.value.length - itemsPerSlide;
    } else {
        currentIndex.value = Math.max(currentIndex.value - 1, 0);
    }
}

function goToProjectDetails(id) {
    router.push({ name: 'ProjectDetails', params: { id } });
}

// Gestion du défilement automatique
let autoScrollInterval = null;
let autoScrollTimeout = null;

function startAutoScroll() {
    stopAutoScroll();
    if (window.innerWidth > 768) {
        const autoScrollDelay = 3000;
        autoScrollTimeout = setTimeout(() => {
            autoScrollInterval = setInterval(() => {
                nextSlide();
            }, autoScrollDelay);
        }, autoScrollDelay);
    }
}

function stopAutoScroll() {
    clearTimeout(autoScrollTimeout);
    clearInterval(autoScrollInterval);
}

function resetAutoScroll() {
    if (window.innerWidth > 768) {
        stopAutoScroll();
        startAutoScroll();
    }
}

document.addEventListener('mousedown', resetAutoScroll);
document.addEventListener('touchstart', resetAutoScroll);
document.addEventListener('mousemove', resetAutoScroll);
document.addEventListener('touchmove', resetAutoScroll);

onMounted(() => {
    startAutoScroll();
});

onUnmounted(() => {
    stopAutoScroll();
    document.removeEventListener('mousedown', resetAutoScroll);
    document.removeEventListener('touchstart', resetAutoScroll);
    document.removeEventListener('mousemove', resetAutoScroll);
    document.removeEventListener('touchmove', resetAutoScroll);
});
</script>

<style scoped>
.carousel-section {
    margin-top: 60px;
}

.carousel-container {
    position: relative;
    overflow: hidden;
    width: 100vw;
    height: 60vh;
    margin: 0 auto;
    padding-top: 0px;
    padding-bottom: 75px;
}

.carousel-window {
    overflow: hidden;
    width: 100%;
    height: 100%;
    cursor: grab;
}

.carousel-window:active {
    cursor: grabbing;
}

.carousel-track {
    display: flex;
    transition: transform 0.6s ease;
}

.carousel-item {
    min-width: calc(100% / 4);
    height: 60vh;
    position: relative;
    cursor: pointer;
    gap: 1rem;
    overflow: hidden;
}

.carousel-item .image-container {
    width: 100%;
    height: 100%;
    overflow: hidden;
}

.carousel-item img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease-in-out;
}

.carousel-item:hover img {
    transform: scale(1.10);
}

.carousel-item:hover .item-overlay h2::after {
  content: " →";
  opacity: 1;
  margin-left: 6px;
  transition: all 0.3s ease;
}

.item-overlay {
    position: relative;
    bottom: 75px;
    left: 20px;
    width: fit-content;
    background-color: rgba(255, 255, 255, 0.08);
    backdrop-filter: blur(15px);
    -webkit-backdrop-filter: blur(15px);
    border: 1.5px solid rgba(0, 0, 0, 0.2);
    padding: 0.6rem 1rem;
    border-radius: 30px;
}

.item-overlay h2 {
    margin: 0;
    color: #000000;
    font-family: 'Inter', sans-serif;
    font-size: 0.8rem;
    font-weight: lighter;
    width: 150px;
    text-align: center;
}

.item-overlay:hover h2::after {
    content: ' →';
    transition: all 0.3s ease;
}

.carousel-control {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background-color: rgba(255, 255, 255, 0.08);
    backdrop-filter: blur(15px);
    -webkit-backdrop-filter: blur(15px);
    border: 1px solid rgba(0, 0, 0, 0.2);
    color: #000000;
    font-size: 1.2rem;
    width: 3.1rem;
    height: 3rem;
    cursor: pointer;
    border-radius: 50%;
    z-index: 2;
}

.carousel-control.prev { left: 2rem; }
.carousel-control.next { right: 2rem; }

.home__text {
    display: flex;
    flex-direction: row-reverse;
    justify-content: center;
    align-items: center;
    padding: 4rem 2.5vw;
    background: #ffffff;
    color: #000;
}

.home__text .picture img {
    width: 100%;
    border-radius: 8px;
}

.home__text .text {
    width: 45%;
    font-family: 'Inter', sans-serif;
}

.home__text h1 {
    font-family: 'Inter', sans-serif;
    font-size: 2rem;
    margin-bottom: 1rem;
    text-align: left;
}

.home__text p {
    font-size: 1rem;
    line-height: 1.6;
    text-align: left;
    margin-bottom: 1rem;
}

.home__text .btn-secondary {
    background: #fff;
    margin-top: 20px;
    color: #222;
    padding: .5rem 1rem;
    border: 1.5px solid rgba(0,0,0,1);
    border-radius: 30px;
    cursor: pointer;
    font-size: 1rem;
    transition: background .3s ease;
    font-family: Inter, sans-serif;
    display: flex;
}

.home__text .btn-secondary:hover {
    background: #000;
    color: #fff;
}

.projects-button {
    background: rgb(255, 255, 255);
    margin-top: 30px;
    color: #222222;
    padding: 0.5rem 1rem;
    border: 1.5px solid rgba(0, 0, 0, 1);
    border-radius: 30px;
    cursor: pointer;
    font-size: 1rem;
    transition: background 0.3s ease;
    font-family: 'Inter', sans-serif;
}

.projects-button:hover {
    background: #000;
    color: #fff;
}

.projects-button:active {
    background: #222222;
    color: #fff;
}

/* Responsive Adjustments */
@media (max-width: 768px) {
    .carousel-section {
        margin-top: 40px;
    }

    .item-overlay {
        left: 50%;
        transform: translateX(-50%);
        bottom: 60px;
        padding: 0.5rem 1rem;
    }

    .home__text {
        flex-direction: column;
        align-items: center;
        padding: 2rem 1rem;
    }

    .home__text .text {
        width: 90%;
        text-align: center;
    }

    .carousel-item {
        min-width: 100%;
    }

    .carousel-control {
        display: none;
    }
}

@media (min-width: 769px) and (max-width: 1024px) {
    .carousel-item {
        min-width: calc(100% / 3);
    }
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

.carousel-item.skeleton {
    height: 60vh;
    border-radius: 8px;
}

.skeleton-image {
    width: 100%;
    height: 100%;
    border-radius: 8px;
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
}

.skeleton-text .skeleton-line {
    height: 20px;
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
    margin: 10px 0;
    border-radius: 4px;
}

.skeleton-text .skeleton-title {
    height: 32px;
    width: 80%;
    margin-bottom: 20px;
}

.skeleton-text .skeleton-button {
    height: 40px;
    width: 150px;
    margin-top: 20px;
    border-radius: 30px;
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
}

/* Animations */
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

.content-loaded {
    animation: fadeIn 0.8s ease-out forwards;
}
</style>
