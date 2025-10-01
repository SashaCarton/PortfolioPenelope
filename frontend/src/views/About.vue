<template>
  <section class="about-scroll">
    <h1>Étudiante en design numérique — approche hybride de l’expérience, de la sensibilité et de la recherche</h1>
    <!-- Spacer pour le scroll -->
    <div class="ascii-spacer"></div>
    <div class="content">
      <!-- GIF ASCII contrôlé par le scroll -->
      <div class="ascii-container">
        <img :src="currentFrameSrc" alt="ASCII rotation" />
      </div>

      <!-- Texts -->
      <div class="text-container">
        <div 
          v-for="(block, index) in textBlocks" 
          :key="index" 
          class="text-block fade-scroll"
          :class="{ visible: visibleBlocks.includes(index) }"
          ref="textRefs"
        >
          <h2>{{ block.title }}</h2>
          <p v-for="(p, i) in block.paragraphs" :key="i">{{ p }}</p>
          <ul v-if="block.list">
            <li v-for="(item, j) in block.list" :key="j">{{ item }}</li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue";

// Nombre total de frames du GIF ASCII
const totalFrames = 42;
const currentFrame = ref(42);

// Génère le chemin vers la frame correspondante
const currentFrameSrc = computed(() => {
  const frameNumber = String(currentFrame.value).padStart(6, "0");
  return `/assets/penny_frames/ascii-${frameNumber}.png`;
});

const visibleBlocks = ref([]);

function onScroll() {
  const scrollTop = window.scrollY;
  const maxScroll = document.body.scrollHeight - window.innerHeight;
  const scrollFraction = scrollTop / maxScroll;

  // Réinitialise visibleBlocks à chaque scroll
  visibleBlocks.value = [];

  const thresholds = [0.1, 0.4, 0.7];
  thresholds.forEach((threshold, index) => {
    if (scrollFraction >= threshold) {
      visibleBlocks.value.push(index);
    }
  });

  // Logique pour les frames ASCII
  currentFrame.value = Math.min(
    totalFrames,
    Math.max(1, totalFrames - Math.floor(scrollFraction * totalFrames) + 1)
  );
}

onMounted(() => {
  window.addEventListener("scroll", onScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", onScroll);
});


// Textes
const textBlocks = [
  {
    title: "Ma démarche —",
    paragraphs: [
      "Formée aux beaux‑arts pendant 9 ans à l'école des arts plastiques de Lens, j'ai ensuite rejoint l'école ESAAT de Roubaix pour obtenir un BAC STD2A (arts appliqués). En parallèle, j'ai travaillé sur de nombreux projets numériques, car je suis passionnée par les technologies, le web, les jeux, et les expériences immersives...",
      "Aujourd'hui étudiante en design numérique à l'école ENSAAMA de Paris depuis septembre, je suis à la recherche d'un stage alliant nouvelles technologies, créativité et savoir‑faire."
    ]
  },
  {
    title: "Mes études —",
    paragraphs: [
      "Issu du graphisme numérique, ce cursus vise à former les étudiants à la création-conception et à la production d'environnements numériques, comme : Motion design vidéo 2D/3D, Web documentaires, Interfaces graphiques pour sites web et applis mobiles, Objets connectés, serious games et e‑learning, Installations multimédia, mapping, etc."
    ]
  },
  {
    title: "Mes loisirs —",
    paragraphs: [
      "On me décrit souvent comme ambitieuse, débrouillarde et très curieuse. J'aime toucher à tout, traditionnel ou numérique, et m'instruire en cinéma, mode, pop‑culture, science, histoire...",
      "Scout pendant 8 ans, je suis très indépendante mais j'aime aussi œuvrer en équipe.",
      "J'adore apprendre : j'ai suivi des cours de japonais, modélisation 3D et couture en dehors de la scolarité."
    ]
  }
];
</script>

<style scoped>
.about-scroll {
  position: relative;
  max-width: 1200px;
  margin: auto;
  padding: 4rem 2rem;
  color: #333;
  padding-top: 7rem;
}

.content {
  position: relative;
  display: flex;
  gap: 3rem;
  align-items: start;
  padding-top: 3rem;
}

.ascii-container {
  width: 50%;
  height: auto;
  z-index: 1;
}

.ascii-container img {
  width: auto;
  height: 80rem; /* conserve les proportions */
  display: block;
}

.text-container {
  width: 50%;
  margin-left: auto;
  padding-left: 2rem;
}

.text-block {
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s ease;
  margin-bottom: 30vh; /* Moitié moins que avant */
  text-align: left;
  min-height: 30vh;    /* Hauteur minimale réduite */
}

.text-block.visible {
  opacity: 1;
  transform: translateY(0);
}

/* Responsiveness */
@media (max-width: 1024px) {
  .ascii-container {
    position: relative; /* redevient normal sur tablette */
    width: 100%;
    height: 1200px;
  }

  .text-container {
    margin-left: 0;
    width: 100%;
  }
}

@media (max-width: 768px) {
  .ascii-container {
    height: 800px; /* mobile */
  }
}
</style>
