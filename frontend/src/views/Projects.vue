<template>
  <div class="page-projects" ref="pageRef" @mousemove="onMouseMove">

    <!-- ═══════════════════════════════════════
         HERO HEADER
         ═══════════════════════════════════════ -->
    <section class="page-hero" ref="heroRef">
      <div class="page-bg">
        <div class="bg-blob" ref="blobRef"></div>
        <div class="bg-grid"></div>
        <div class="bg-noise"></div>
      </div>

      <div class="hero-inner">
        <span class="hero-eyebrow" ref="eyebrowRef">Tous les projets</span>
        <h1 class="hero-title" ref="titleRef">
          <span class="title-line" data-gsap="title">Travaux</span>
          <span class="title-line title-accent" data-gsap="title">&amp; explorations</span>
        </h1>
        <p class="hero-sub" ref="subRef">Design numérique · UX · 3D · Arts plastiques</p>
      </div>

      <div class="scroll-ind" ref="scrollIndRef" @click="scrollTo('grid')">
        <span>scroll</span>
        <div class="scroll-bar"></div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════
         GRID DE PROJETS
         ═══════════════════════════════════════ -->
    <section class="grid-section" id="grid">
      <div class="section-head" ref="headRef">
        <span class="section-tag">01</span>
        <h2 class="section-title">Projets sélectionnés</h2>
        <div class="section-line"></div>
      </div>

      <div class="projects-grid" ref="gridRef">
        <!-- Skeleton -->
        <div v-if="isLoading" v-for="n in 6" :key="'sk-'+n" class="card skeleton">
          <div class="skeleton-img"></div>
          <div class="skeleton-info">
            <div class="skeleton-title"></div>
            <div class="skeleton-text"></div>
          </div>
        </div>

        <!-- Cards -->
        <div
          v-else
          v-for="(project, i) in projects"
          :key="project.id"
          class="card"
          :class="{ 'is-fav': project.favorite }"
          @click="goToProjectDetails(project.id)"
        >
          <div class="card-img">
            <img
              :src="project.cover"
              :alt="project.title"
              :loading="i < 6 ? 'eager' : 'lazy'"
              :fetchpriority="i < 3 ? 'high' : 'auto'"
              decoding="async"
              width="500" height="600"
            />
            <div class="card-num">{{ String(i + 1).padStart(2, '0') }}</div>
            <span v-if="project.has3D" class="three-badge">3D</span>
          </div>
          <div class="card-info">
            <div>
              <h3>{{ project.title }}</h3>
              <p>{{ project.description }}</p>
            </div>
            <span class="card-arrow">→</span>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { projectThumbnail } from '../utils/cdn'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

const router = useRouter()
const projects = ref([])
const isLoading = ref(true)

// ── Refs ──
const pageRef = ref(null)
const heroRef = ref(null)
const blobRef = ref(null)
const eyebrowRef = ref(null)
const titleRef = ref(null)
const subRef = ref(null)
const scrollIndRef = ref(null)
const headRef = ref(null)
const gridRef = ref(null)

let gsapCtx = null

// ── Mouse tracking ──
function onMouseMove(e) {
  if (!blobRef.value) return
  gsap.to(blobRef.value, {
    x: e.clientX - window.innerWidth / 2,
    y: e.clientY - window.innerHeight / 2,
    duration: 1.2,
    ease: 'power2.out',
  })
}

// ── Scroll helper ──
function scrollTo(id) {
  const el = document.getElementById(id)
  if (el) gsap.to(window, { scrollTo: { y: el, offsetY: 0 }, duration: 1, ease: 'power3.inOut' })
}

function goToProjectDetails(id) {
  router.push({ name: 'ProjectDetails', params: { id } })
}

// ═══════════════════════════════════════
// GSAP animations
// ═══════════════════════════════════════
onMounted(() => {
  gsapCtx = gsap.context(() => {

    // ── Hero entrance ──
    gsap.set([eyebrowRef.value, subRef.value, scrollIndRef.value], { opacity: 0, y: 30 })
    gsap.set('[data-gsap="title"]', { opacity: 0, y: 60, rotateX: 10 })
    gsap.set(blobRef.value, { opacity: 0, scale: 0.3 })

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
    tl
      .to(blobRef.value, { opacity: 1, scale: 1, duration: 1.5, ease: 'power2.out' }, 0.2)
      .to(eyebrowRef.value, { opacity: 1, y: 0, duration: 0.7 }, 0.3)
      .to('[data-gsap="title"]', {
        opacity: 1, y: 0, rotateX: 0, duration: 0.9, stagger: 0.15, ease: 'power3.out'
      }, 0.5)
      .to(subRef.value, { opacity: 1, y: 0, duration: 0.7 }, 1.2)
      .to(scrollIndRef.value, { opacity: 1, y: 0, duration: 0.6 }, 1.6)
      // auto-scroll vers la grille
      .add(() => { scrollTo('grid') }, 2.5)

    // ── Hero parallax ──
    gsap.to('.hero-inner', {
      y: -80, opacity: 0.3, ease: 'none',
      scrollTrigger: { trigger: heroRef.value, start: 'top top', end: 'bottom top', scrub: true }
    })

    // ── Section head reveal ──
    if (headRef.value) {
      gsap.fromTo(headRef.value.querySelectorAll('.section-tag, .section-title, .section-line'),
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: 'power2.out',
          scrollTrigger: { trigger: headRef.value, start: 'top 85%', once: true } }
      )
    }

  })
})

// ── Fetch projets ──
onMounted(async () => {
  isLoading.value = true
  try {
    const response = await fetch('https://api.penelopeletienne.ovh/api/projets?populate=*')
    if (!response.ok) throw new Error('Erreur lors de la récupération des projets')
    const { data } = await response.json()

    projects.value = data.map(project => {
      const modelUrls = []
      if (project.URL_SUPABASE && Array.isArray(project.URL_SUPABASE)) {
        project.URL_SUPABASE.forEach(m => { if (m?.url) modelUrls.push(m.url) })
      }
      if (project.model?.data?.attributes?.url) modelUrls.push(`https://api.penelopeletienne.ovh${project.model.data.attributes.url}`)
      if (project.Model?.data?.attributes?.url) modelUrls.push(`https://api.penelopeletienne.ovh${project.Model.data.attributes.url}`)
      if (project.modelUrl) modelUrls.push(project.modelUrl)
      const uniqueModelUrls = Array.from(new Set(modelUrls))

      return {
        id: project.id,
        title: project.Titre || 'Sans titre',
        description: project.Description || 'Pas de description',
        favorite: project.Favorite || false,
        cover: projectThumbnail(
          project.Cover?.formats?.small?.url
            ? `https://api.penelopeletienne.ovh${project.Cover.formats.small.url}`
            : project.Cover?.formats?.medium?.url
            ? `https://api.penelopeletienne.ovh${project.Cover.formats.medium.url}`
            : project.Cover?.url
            ? `https://api.penelopeletienne.ovh${project.Cover.url}`
            : null
        ),
        has3D: uniqueModelUrls.length > 0,
      }
    })

    // Favoris en premier
    projects.value.sort((a, b) => (a.favorite === b.favorite ? 0 : a.favorite ? -1 : 1))

    isLoading.value = false

    // GSAP stagger cards
    await nextTick()
    if (gridRef.value) {
      const cards = gridRef.value.querySelectorAll('.card')
      if (cards.length) {
        gsap.fromTo(cards,
          { opacity: 0, y: 50, scale: 0.92 },
          { opacity: 1, y: 0, scale: 1, duration: 0.7, stagger: 0.08, ease: 'power2.out',
            scrollTrigger: { trigger: gridRef.value, start: 'top 85%', once: true } }
        )
      }
    }
  } catch (error) {
    console.error('Erreur :', error)
    isLoading.value = false
  }
})

onUnmounted(() => {
  gsapCtx?.revert()
})
</script>

<style scoped>
/* ════════════════════════════════════════
   PAGE WRAPPER
   ════════════════════════════════════════ */
.page-projects {
  background: #fafafa;
  min-height: 100vh;
}

/* ════════════════════════════════════════
   HERO
   ════════════════════════════════════════ */
.page-hero {
  position: relative;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.page-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  overflow: hidden;
}

.bg-blob {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 600px;
  height: 600px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(140,100,255,0.18), rgba(80,150,255,0.12), transparent 70%);
  filter: blur(80px);
  will-change: transform;
  transform: translate(-50%, -50%);
  pointer-events: none;
}

.bg-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px);
  background-size: 50px 50px;
  mask-image: radial-gradient(ellipse 60% 60% at 50% 50%, black 40%, transparent 100%);
}

.bg-noise {
  position: absolute;
  inset: 0;
  opacity: 0.3;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
}

.hero-inner {
  position: relative;
  z-index: 1;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.hero-eyebrow {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.65rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #999;
  margin-bottom: 1.5rem;
}

.hero-title {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: 'Inter', sans-serif;
  font-size: clamp(2.5rem, 7vw, 5rem);
  font-weight: 300;
  line-height: 1.1;
  letter-spacing: -0.03em;
  color: #111;
  margin: 0 0 1.5rem;
}

.title-line {
  display: block;
  will-change: transform, opacity;
  transform-origin: center bottom;
}

.title-accent { color: #111; }

.hero-sub {
  font-family: 'JetBrains Mono', monospace;
  font-size: clamp(0.65rem, 1.1vw, 0.85rem);
  letter-spacing: 0.1em;
  color: #888;
}

.scroll-ind {
  position: absolute;
  bottom: 2.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  z-index: 1;
}

.scroll-ind span {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.55rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #bbb;
}

.scroll-bar {
  width: 1px;
  height: 36px;
  background: linear-gradient(to bottom, #bbb, transparent);
  animation: pulse-bar 2s ease-in-out infinite;
}

@keyframes pulse-bar {
  0%, 100% { opacity: 0.3; transform: scaleY(0.5); }
  50% { opacity: 1; transform: scaleY(1); }
}

/* ════════════════════════════════════════
   SECTION HEADERS
   ════════════════════════════════════════ */
.grid-section {
  padding: 6rem 0 8rem;
  background: #fff;
}

.section-head {
  display: flex;
  align-items: center;
  gap: 1.2rem;
  margin-bottom: 3rem;
  padding: 0 5vw;
}

.section-tag {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.65rem;
  letter-spacing: 0.15em;
  color: #bbb;
}

.section-title {
  font-family: 'JetBrains Mono', monospace;
  font-weight: 400;
  font-size: clamp(1.2rem, 2.5vw, 1.8rem);
  letter-spacing: -0.01em;
  color: #111;
  margin: 0;
}

.section-line {
  flex: 1;
  height: 1px;
  background: rgba(0,0,0,0.1);
}

/* ════════════════════════════════════════
   PROJECTS GRID
   ════════════════════════════════════════ */
.projects-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  padding: 0 5vw;
}

.card {
  position: relative;
  cursor: pointer;
  border-radius: 12px;
  overflow: hidden;
  background: #fff;
  opacity: 0; /* GSAP animera */
  transition: transform 0.4s cubic-bezier(.4,0,.2,1), box-shadow 0.4s;
}

.card:hover {
  transform: translateY(-6px);
  box-shadow: 0 16px 48px rgba(0,0,0,0.1);
}

.card-img {
  position: relative;
  width: 100%;
  aspect-ratio: 3 / 4;
  overflow: hidden;
}

.card-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(.4,0,.2,1);
}

.card:hover .card-img img {
  transform: scale(1.08);
}

.card-num {
  position: absolute;
  top: 0.8rem;
  left: 0.8rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.6rem;
  letter-spacing: 0.1em;
  color: rgba(255,255,255,0.7);
  background: rgba(0,0,0,0.3);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  padding: 0.25rem 0.5rem;
  border-radius: 20px;
}

.three-badge {
  position: absolute;
  top: 0.8rem;
  right: 0.8rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.6rem;
  letter-spacing: 0.1em;
  color: #111;
  background: rgba(255,255,255,0.85);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  padding: 0.25rem 0.5rem;
  border-radius: 20px;
  font-weight: 600;
}

.card-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.2rem;
  background: #fff;
}

.card-info h3 {
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  font-weight: 400;
  color: #222;
  margin: 0 0 0.2rem;
}

.card-info p {
  font-family: 'Inter', sans-serif;
  font-size: 0.75rem;
  color: #999;
  margin: 0;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-arrow {
  font-size: 1.1rem;
  color: #999;
  transition: transform 0.3s, color 0.3s;
  flex-shrink: 0;
  margin-left: 0.5rem;
}

.card:hover .card-arrow {
  transform: translateX(4px);
  color: #111;
}

/* ════════════════════════════════════════
   SKELETON
   ════════════════════════════════════════ */
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.card.skeleton {
  opacity: 1;
  pointer-events: none;
}

.skeleton-img {
  width: 100%;
  aspect-ratio: 3 / 4;
  border-radius: 12px 12px 0 0;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

.skeleton-info {
  padding: 1rem 1.2rem;
}

.skeleton-title {
  width: 60%;
  height: 14px;
  border-radius: 4px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  margin-bottom: 0.5rem;
}

.skeleton-text {
  width: 80%;
  height: 10px;
  border-radius: 4px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

/* ════════════════════════════════════════
   RESPONSIVE
   ════════════════════════════════════════ */
@media (max-width: 768px) {
  .page-hero { height: 85vh; margin-top: 40px; }
  .hero-title { font-size: clamp(1.8rem, 10vw, 3rem); }
  .bg-blob { width: 350px; height: 350px; }

  .projects-grid {
    grid-template-columns: 1fr;
    padding: 0 4vw;
  }

  .grid-section { padding: 4rem 0 5rem; }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .projects-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
