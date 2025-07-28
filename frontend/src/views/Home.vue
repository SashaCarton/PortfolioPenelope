<template>
    <section class="home-banner">
        <!-- Banner Carousel showing project covers 4 per view -->
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
                    <div
                    v-for="project in projects"
                    :key="project.id"
                    class="carousel-item"
                    @click="goToProjectDetails(project.id)"
                    >
                    <img :src="project.cover" :alt="project.title" />
                    <div class="item-overlay">
                        <h2>{{ project.title }}</h2>
                    </div>
                </div>
            </div>
        </div>
        <button class="carousel-control next" @click="nextSlide" aria-label="Diapositive suivante">›</button>
        <button class="projects-button" @click="router.push({ name: 'Projects' })">Voir tous les projets</button>
    </div>
    </section>
    
    <!-- Intro Text Below Banner -->
    <div class="home__text">
        <div class="picture">
            <img src="/images/60F38FC4-A2B0-4AC5-87B4-33657F70F795_edi.avif" alt="Pénélope Letienne" />
        </div>
        <div class="text">
            <h1>Pénélope Letienne</h1>
            <p>Étudiante en design numérique à l'école ENSAAMA de Paris depuis septembre, je suis actuellement à la recherche d'un stage dans le monde des nouvelles technologies combinées aux techniques créatives et au savoir-faire.</p>
            <p>Formée aux beaux-arts pendant 9 ans à l'école des arts plastiques de Lens depuis 2012, j'ai ensuite rejoint l'école ESAAT de Roubaix afin d'obtenir un BAC STD2A (arts appliqués). En parallèle, j'ai travaillé sur de nombreux projets numériques, car je suis passionnée par les technologies, le web, les jeux, les expériences immersives...</p>
            <button @click="router.push({ name: 'About' })" class="btn-secondary">En savoir plus</button>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';

const projects = ref([]);
const currentIndex = ref(0);
const router = useRouter();

// Nombre d'éléments visibles par diapositive
const itemsPerSlide = 4;

onMounted(async () => {
    try {
        const res = await fetch('https://api.penelopeletienne.ovh/api/projets?populate=Cover');
        if (!res.ok) throw new Error('Erreur récupération projets');
        const payload = await res.json();
        const rawProjects = payload.data; // array of project objects
        
        projects.value = rawProjects.map(proj => {
          const cov = proj.Cover;
          const fmt = cov?.formats?.medium?.url; // Vérifiez si formats et medium existent
          const urlSegment = fmt || cov?.url; // Utilisez l'URL par défaut si medium est absent
          const fullUrl = urlSegment?.startsWith('http')
            ? urlSegment
            : `https://api.penelopeletienne.ovh${urlSegment}`;
  
          return {
            id: proj.id,
            title: proj.Titre,
            cover: fullUrl || '/images/default-cover.jpg', // Image par défaut si aucune n'est disponible
          };
        });
    } catch (e) {
        console.error('Erreur chargement projets :', e);
    }
});

// Calcul du nombre total de diapositives
const slideCount = computed(() => Math.max(0, projects.value.length - itemsPerSlide + 1));

// Compute transform style: each slide is 100% of window
const trackStyle = computed(() => ({
    transform: `translateX(-${currentIndex.value * (100 / itemsPerSlide)}%)`,
}));

function nextSlide() {
    if (!projects.value.length) return;
    if (currentIndex.value >= projects.value.length - itemsPerSlide) {
        currentIndex.value = 0; // Retour au début
    } else {
        currentIndex.value = Math.min(currentIndex.value + 1, projects.value.length - itemsPerSlide);
    }
}

function prevSlide() {
    if (!projects.value.length) return;
    if (currentIndex.value <= 0) {
        currentIndex.value = projects.value.length - itemsPerSlide; // Retour à la fin
    } else {
        currentIndex.value = Math.max(currentIndex.value - 1, 0);
    }
}

function goToProjectDetails(id) {
    router.push({ name: 'ProjectDetails', params: { id } });
}

let isDragging = false;
let startX = 0;
let currentTranslate = 0;
let prevTranslate = 0;

// Suppression de la gestion du glissement (drag) pour le carrousel
function startDrag(event) {
    // Désactivé
}

function drag(event) {
    // Désactivé
}

function endDrag() {
    // Désactivé
}

// Ajout d'un défilement automatique du carrousel après une période d'inactivité
let autoScrollInterval = null;
let autoScrollTimeout = null;

function startAutoScroll() {
    stopAutoScroll(); // Arrête tout défilement automatique en cours
    if (window.innerWidth > 768) { // Active uniquement sur desktop
        const autoScrollDelay = 3000; // 3 secondes sur desktop
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

// Redémarre le défilement automatique à chaque interaction utilisateur
function resetAutoScroll() {
    if (window.innerWidth > 768) {
        stopAutoScroll();
        startAutoScroll();
    } // Ne réinitialise pas sur mobile
}

// Ajout des événements pour détecter l'interaction utilisateur
document.addEventListener('mousedown', resetAutoScroll);
document.addEventListener('touchstart', resetAutoScroll);
document.addEventListener('mousemove', resetAutoScroll);
document.addEventListener('touchmove', resetAutoScroll);

// Démarrage initial du défilement automatique
onMounted(() => {
    startAutoScroll();
});

onUnmounted(() => {
    stopAutoScroll(); // Nettoyage des intervalles et timeouts
});

</script>

<style scoped>
.home-banner {
    position: relative;
    background-color: #ffffff;
}

.carousel-container {
    position: relative;
    overflow: hidden;
    width: 100vw;
    height: 60vh;
    margin: 0 auto;
    padding-top:50px;
    margin-top:-50px;
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
    /* Affiche 4 éléments par vue */
    min-width: calc(100% / 4);
    height: 60vh;
    position: relative;
    cursor: pointer;
    gap: 1rem;
    transition: transform 0.3s ease;
}
.carousel-item:hover {
    transform: scale(1.05);
    transition: transform 0.3s ease;
}

.carousel-item img {
    width: 90%;
    height: 90%;
    object-fit: cover;
}

.item-overlay {
    position: absolute;
    bottom: 20px;
    left: 20px;
    background: rgba(179, 179, 179, 0.5);
    padding: 1rem 2rem;
    border-radius: 4px;
}

.item-overlay h2 {
    margin: 0;
    color: #fff;
    font-family: 'Inter', sans-serif;
    font-size: 1.5rem;
}

.carousel-control {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(255, 255, 255, 0);
    border: none;
    color: #000000;
    font-size: 2rem;
    width: 3rem;
    height: 3rem;
    cursor: pointer;
    border-radius: 50%;
    z-index: 2;
}

.carousel-control.prev { left: 2rem; }
.carousel-control.next { right: 2rem; }

.carousel-control:hover { background: rgba(255, 255, 255, 0); }

.home__text {
    display: flex;
    flex-direction: row-reverse;
    justify-content: space-around;
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
    font-size: 3rem;
    margin-bottom: 1rem;
}

.home__text p {
    font-size: 1rem;
    line-height: 1.6;
    margin-bottom: 1rem;
}
.home__text .btn-secondary {
    background: #ffffff;
    color: #000000;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
    transition: background 0.3s ease;
    font-family: 'Inter', sans-serif;
}
.home__text .btn-secondary:hover {
    background: #ffffff;
    color: #000;
}
.projects-button {
    background:rgb(255, 255, 255);
    color: #222222;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
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

/* Ajustement pour afficher 1 projet par vue sur mobile */
@media (max-width: 768px) {

    .item-overlay {
        left:50%;
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
    min-width: 100%; /* Affiche un seul élément par vue */
  }

  .carousel-control {
    display: none; /* Cache les flèches */
  }

  .carousel-window {
    cursor: grab; /* Indique que le glissement est possible */
  }

  .carousel-window:active {
    cursor: grabbing;
  }
}

/* Ajustement pour afficher 3 projets par vue sur les écrans moyens */
@media (min-width: 769px) and (max-width: 1024px) {
    .carousel-item {
        min-width: calc(100% / 3); /* Affiche 3 éléments par vue */
    }
}

.fade-in {
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
</style>
