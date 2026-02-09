<template>
  <div class="home" ref="homeRef" @mousemove="onMouseMove">

    <!-- ═══════════════════════════════════════
         HERO — plein écran, fond interactif
         ═══════════════════════════════════════ -->
    <section class="hero" ref="heroRef">
      <!-- Fond interactif : blob qui suit la souris -->
      <div class="hero-bg" ref="heroBgRef">
        <div class="bg-blob" ref="blobRef"></div>
        <div class="bg-grid"></div>
        <div class="bg-noise"></div>
      </div>

      <div class="hero-content">
        <span class="hero-eyebrow" ref="eyebrowRef">Portfolio — 2026</span>

        <h1 class="hero-title" ref="titleRef">
          <span class="title-line" data-gsap="title">Créer des</span>
          <span class="title-line title-accent" data-gsap="title">expériences</span>
          <span class="title-line title-italic" data-gsap="title"><em>qui marquent</em></span>
        </h1>

        <p class="hero-sub" ref="heroSubRef">
          Design numérique · UX · Arts plastiques
        </p>

        <div class="hero-stats" ref="statsRef">
          <div class="stat">
            <span class="stat-num" ref="statCountRef">0</span>
            <span class="stat-lbl">projets</span>
          </div>
          <div class="stat-sep"></div>
          <div class="stat">
            <span class="stat-num">ENSAAMA</span>
            <span class="stat-lbl">formation</span>
          </div>
          <div class="stat-sep"></div>
          <div class="stat">
            <span class="stat-num">9 ans</span>
            <span class="stat-lbl">beaux-arts</span>
          </div>
        </div>

        <button class="hero-cta" ref="ctaRef" @click="scrollTo('projects')">
          <span>Découvrir</span>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 3v10M3 8l5 5 5-5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
      </div>

      <div class="scroll-ind" ref="scrollIndRef" @click="scrollTo('projects')">
        <span>scroll</span>
        <div class="scroll-bar"></div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════
         PROJETS — showcase immersif
         ═══════════════════════════════════════ -->
    <section class="projects" id="projects" ref="projectsRef">
      <div class="section-head" ref="projHeadRef">
        <span class="section-tag">01</span>
        <h2 class="section-title">Projets sélectionnés</h2>
        <div class="section-line"></div>
      </div>

      <!-- Carousel -->
      <div class="carousel" ref="carouselRef">
        <div class="carousel-window"
          @mousedown="startDrag" @mouseup="endDrag" @mouseleave="endDrag"
          @touchstart="handleTouchStart" @touchmove="handleTouchMove" @touchend="handleTouchEnd"
        >
          <div class="carousel-track" :style="trackStyle">
            <div v-if="isLoading" v-for="s in skeletons" :key="s" class="card skeleton">
              <div class="skeleton-img"></div>
            </div>
            <div v-else v-for="(p, i) in projects" :key="p.id"
              class="card" :class="{ 'is-fav': p.favorite }"
              @click="goTo(p.id)"
            >
              <div class="card-img">
                <img :src="p.cover" :alt="p.title"
                  :loading="i < 4 ? 'eager' : 'lazy'"
                  :fetchpriority="i < 2 ? 'high' : 'auto'"
                  decoding="async" width="600" height="720" />
                <div class="card-num">{{ String(i + 1).padStart(2, '0') }}</div>
              </div>
              <div class="card-info">
                <h3>{{ p.title }}</h3>
                <span class="card-arrow">→</span>
              </div>
            </div>
          </div>
        </div>

        <div class="carousel-nav">
          <button class="nav-btn" @click="prevSlide" aria-label="Précédent">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M12 4l-6 6 6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
          <span class="nav-count">{{ currentIndex + 1 }} / {{ projects.length || '—' }}</span>
          <button class="nav-btn" @click="nextSlide" aria-label="Suivant">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M8 4l6 6-6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
        </div>

        <button class="all-projects-btn" ref="allProjBtnRef" @click="router.push({ name: 'Projects' })">
          Voir tous les projets →
        </button>
      </div>
    </section>

    <!-- ═══════════════════════════════════════
         MARQUEE — bande défilante
         ═══════════════════════════════════════ -->
    <section class="marquee" ref="marqueeRef" aria-hidden="true">
      <div class="marquee-track">
        <span v-for="n in 4" :key="n" class="marquee-txt">
          UX DESIGN&ensp;·&ensp;ARTS PLASTIQUES&ensp;·&ensp;MOTION&ensp;·&ensp;3D&ensp;·&ensp;INTERACTION&ensp;·&ensp;TYPOGRAPHIE&ensp;·&ensp;RECHERCHE&ensp;·&ensp;EXPÉRIENCE&ensp;·&ensp;
        </span>
      </div>
    </section>

    <!-- ═══════════════════════════════════════
         ABOUT — présentation
         ═══════════════════════════════════════ -->
    <section class="about" ref="aboutRef">
      <div class="section-head" ref="aboutHeadRef">
        <span class="section-tag">02</span>
        <h2 class="section-title">À propos</h2>
        <div class="section-line"></div>
      </div>

      <div class="about-body">
        <div class="about-visual" ref="aboutVisualRef">
          <video autoplay loop muted playsinline width="380" height="350" aria-label="ASCII art">
            <source src="/images/ASCII woman.webm" type="video/webm" />
            <source src="/images/ASCII woman.mp4" type="video/mp4" />
          </video>
        </div>
        <div class="about-text" ref="aboutTextRef">
          <h3>Étudiante en design numérique — approche hybride de l'expérience, de la sensibilité et de la recherche</h3>
          <p>Après neuf années de formation aux beaux-arts, j'ai obtenu un bac STD2A (arts appliqués) qui m'a naturellement conduite vers le design et l'expérience utilisateur.</p>
          <p>Je suis passionnée par l'architecture de l'information, les micro-interactions et la dimension émotionnelle des interfaces. Actuellement, je poursuis ma formation à l'ENSAAMA, école parisienne de design et de métiers d'art.</p>
          <button @click="router.push({ name: 'About' })" class="link-btn">En savoir plus →</button>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup>
import { ref, onMounted, computed, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { carouselCover } from '../utils/cdn'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

const router = useRouter()
const projects = ref([])
const isLoading = ref(true)
const currentIndex = ref(0)
const isInitialLoad = ref(true)

// ── Refs ──
const homeRef = ref(null)
const heroRef = ref(null)
const heroBgRef = ref(null)
const blobRef = ref(null)
const eyebrowRef = ref(null)
const titleRef = ref(null)
const heroSubRef = ref(null)
const statsRef = ref(null)
const statCountRef = ref(null)
const ctaRef = ref(null)
const scrollIndRef = ref(null)
const projectsRef = ref(null)
const projHeadRef = ref(null)
const carouselRef = ref(null)
const allProjBtnRef = ref(null)
const marqueeRef = ref(null)
const aboutRef = ref(null)
const aboutHeadRef = ref(null)
const aboutVisualRef = ref(null)
const aboutTextRef = ref(null)

let gsapCtx = null
const skeletons = Array.from({ length: 6 }, (_, i) => i)

// ── Mouse tracking ──
function onMouseMove(e) {
  if (!blobRef.value) return
  const x = e.clientX
  const y = e.clientY
  gsap.to(blobRef.value, {
    x: x - window.innerWidth / 2,
    y: y - window.innerHeight / 2,
    duration: 1.2,
    ease: 'power2.out',
  })
}

// ── Scroll helpers ──
function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

// ═══════════════════════════════════════
// GSAP — animations d'entrée + scroll
// ═══════════════════════════════════════
onMounted(() => {
  gsapCtx = gsap.context(() => {

    // ── HERO entrance timeline ──
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

    // Cacher tout au départ
    gsap.set([eyebrowRef.value, heroSubRef.value, statsRef.value, ctaRef.value, scrollIndRef.value], {
      opacity: 0, y: 30
    })
    gsap.set('[data-gsap="title"]', { opacity: 0, y: 60, rotateX: 10 })
    gsap.set(blobRef.value, { opacity: 0, scale: 0.3 })

    tl
      // Blob bg fade in
      .to(blobRef.value, { opacity: 1, scale: 1, duration: 1.5, ease: 'power2.out' }, 0.2)
      // Eyebrow
      .to(eyebrowRef.value, { opacity: 1, y: 0, duration: 0.7 }, 0.3)
      // Title lines stagger
      .to('[data-gsap="title"]', {
        opacity: 1, y: 0, rotateX: 0,
        duration: 0.9, stagger: 0.15, ease: 'power3.out',
      }, 0.5)
      // Subtitle
      .to(heroSubRef.value, { opacity: 1, y: 0, duration: 0.7 }, 1.2)
      // Stats
      .to(statsRef.value, { opacity: 1, y: 0, duration: 0.7 }, 1.4)
      // Counter animation
      .add(() => {
        if (statCountRef.value) {
          const o = { v: 0 }
          const total = projects.value.length || 8
          gsap.to(o, {
            v: total, duration: 1.2, ease: 'power1.out',
            onUpdate: () => { if (statCountRef.value) statCountRef.value.textContent = Math.round(o.v) }
          })
        }
      }, 1.5)
      // CTA button
      .to(ctaRef.value, { opacity: 1, y: 0, duration: 0.6 }, 1.7)
      // Scroll indicator
      .to(scrollIndRef.value, { opacity: 1, y: 0, duration: 0.6 }, 2.0)
      // Auto-scroll vers les projets après la phase d'entrée
      .add(() => {
        const el = document.getElementById('projects')
        if (el) {
          gsap.to(window, {
            scrollTo: { y: el, offsetY: 0 },
            duration: 1.4,
            ease: 'power3.inOut',
          })
        }
      }, 3.0)

    // ── Hero parallax on scroll ──
    gsap.to('.hero-content', {
      y: -80,
      opacity: 0.3,
      ease: 'none',
      scrollTrigger: { trigger: heroRef.value, start: 'top top', end: 'bottom top', scrub: true }
    })

    // ── PROJECTS section ──
    if (projHeadRef.value) {
      // Section header reveal
      gsap.fromTo(projHeadRef.value.querySelectorAll('.section-tag, .section-title, .section-line'),
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: 'power2.out',
          scrollTrigger: { trigger: projHeadRef.value, start: 'top 85%', once: true } }
      )
    }

    // ── MARQUEE scrub ──
    if (marqueeRef.value) {
      gsap.to('.marquee-track', {
        xPercent: -8, ease: 'none',
        scrollTrigger: { trigger: marqueeRef.value, start: 'top bottom', end: 'bottom top', scrub: 1.5 }
      })
    }

    // ── ABOUT section ──
    if (aboutHeadRef.value) {
      gsap.fromTo(aboutHeadRef.value.querySelectorAll('.section-tag, .section-title, .section-line'),
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: 'power2.out',
          scrollTrigger: { trigger: aboutHeadRef.value, start: 'top 85%', once: true } }
      )
    }
    if (aboutVisualRef.value) {
      gsap.fromTo(aboutVisualRef.value,
        { opacity: 0, x: -60, rotateY: 8 },
        { opacity: 1, x: 0, rotateY: 0, duration: 1, ease: 'power2.out',
          scrollTrigger: { trigger: aboutRef.value, start: 'top 75%', once: true } }
      )
    }
    if (aboutTextRef.value) {
      gsap.fromTo(aboutTextRef.value,
        { opacity: 0, x: 60 },
        { opacity: 1, x: 0, duration: 1, ease: 'power2.out',
          scrollTrigger: { trigger: aboutRef.value, start: 'top 75%', once: true } }
      )
    }

  }) // end gsap context
})

// ═══════════════════════════════════════
// FETCH projets + carousel logic
// ═══════════════════════════════════════
const itemsPerSlide = 4
const startX = ref(0)
const currentX = ref(0)
const isDragging = ref(false)

onMounted(async () => {
  isLoading.value = true
  isInitialLoad.value = true
  try {
    const res = await fetch('https://api.penelopeletienne.ovh/api/projets?populate=Cover')
    if (!res.ok) throw new Error('fetch error')
    const { data } = await res.json()
    const mapped = data.map(p => {
      const cov = p.Cover
      const fmt = cov?.formats?.small?.url || cov?.formats?.medium?.url
      const seg = fmt || cov?.url
      const url = seg?.startsWith('http') ? seg : `https://api.penelopeletienne.ovh${seg}`
      return { id: p.id, title: p.Titre, cover: carouselCover(url) || '/images/default-cover.jpg', favorite: p.Favorite === true }
    })
    projects.value = mapped.sort((a, b) => (a.favorite === b.favorite ? 0 : a.favorite ? -1 : 1))
    isLoading.value = false
    setTimeout(() => { isInitialLoad.value = false }, 50)

    // GSAP stagger cards after load
    await nextTick()
    if (carouselRef.value) {
      const cards = carouselRef.value.querySelectorAll('.card')
      if (cards.length) {
        gsap.fromTo(cards,
          { opacity: 0, y: 50, scale: 0.92 },
          { opacity: 1, y: 0, scale: 1, duration: 0.8, stagger: 0.08, ease: 'power3.out',
            scrollTrigger: { trigger: carouselRef.value, start: 'top 85%', once: true } }
        )
      }
    }
    if (allProjBtnRef.value) {
      gsap.fromTo(allProjBtnRef.value,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out',
          scrollTrigger: { trigger: allProjBtnRef.value, start: 'top 92%', once: true } }
      )
    }
  } catch (e) {
    console.error('Erreur chargement projets:', e)
    isLoading.value = false
    isInitialLoad.value = false
  }
})

const trackStyle = computed(() => {
  if (isLoading.value) return { transform: 'translateX(0)', transition: 'none' }
  const mobile = window.innerWidth <= 768
  if (mobile) {
    const base = -(currentIndex.value * 100)
    const drag = isDragging.value ? ((currentX.value - startX.value) / window.innerWidth) * 100 : 0
    return { transform: `translateX(${base + drag}%)`, transition: isInitialLoad.value || isDragging.value ? 'none' : 'transform 0.4s cubic-bezier(.4,0,.2,1)' }
  }
  return { transform: `translateX(-${currentIndex.value * (100 / itemsPerSlide)}%)`, transition: isInitialLoad.value ? 'none' : 'transform 0.5s cubic-bezier(.4,0,.2,1)' }
})

function nextSlide() {
  if (!projects.value.length) return
  const mobile = window.innerWidth <= 768
  const max = mobile ? projects.value.length - 1 : projects.value.length - itemsPerSlide
  currentIndex.value = currentIndex.value >= max ? 0 : currentIndex.value + 1
}
function prevSlide() {
  if (!projects.value.length) return
  const mobile = window.innerWidth <= 768
  const max = mobile ? projects.value.length - 1 : projects.value.length - itemsPerSlide
  currentIndex.value = currentIndex.value <= 0 ? max : currentIndex.value - 1
}
function goTo(id) { router.push({ name: 'ProjectDetails', params: { id } }) }

// Auto-scroll
let autoInt = null, autoTo = null
function startAuto() { stopAuto(); if (window.innerWidth > 768) { autoTo = setTimeout(() => { autoInt = setInterval(nextSlide, 3500) }, 3500) } }
function stopAuto() { clearTimeout(autoTo); clearInterval(autoInt) }
function resetAuto() { if (window.innerWidth > 768) { stopAuto(); startAuto() } }

document.addEventListener('mousedown', resetAuto)
document.addEventListener('touchstart', resetAuto)

onMounted(() => { startAuto() })

// Swipe mobile
function handleTouchStart(e) { if (window.innerWidth <= 768) { startX.value = e.touches[0].clientX; currentX.value = startX.value; isDragging.value = true; stopAuto() } }
function handleTouchMove(e) { if (isDragging.value && window.innerWidth <= 768) { e.preventDefault(); currentX.value = e.touches[0].clientX } }
function handleTouchEnd() {
  if (!isDragging.value || window.innerWidth > 768) return
  const d = currentX.value - startX.value
  if (Math.abs(d) > window.innerWidth * 0.2) { d > 0 && currentIndex.value > 0 ? currentIndex.value-- : d < 0 && currentIndex.value < projects.value.length - 1 ? currentIndex.value++ : null }
  isDragging.value = false; startAuto()
}
function startDrag() {}
function endDrag() {}

// Resize
onMounted(() => { window.addEventListener('resize', () => { startAuto() }) })

onUnmounted(() => {
  stopAuto()
  document.removeEventListener('mousedown', resetAuto)
  document.removeEventListener('touchstart', resetAuto)
  if (gsapCtx) gsapCtx.revert()
  ScrollTrigger.getAll().forEach(st => st.kill())
})
</script>

<style scoped>
/* ════════════════════════════════════════
   BASE
   ════════════════════════════════════════ */
.home {
  width: 100%;
  overflow-x: hidden;
}

/* ════════════════════════════════════════
   HERO
   ════════════════════════════════════════ */
.hero {
  position: relative;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #fafafa;
  overflow: hidden;
  margin-top: 60px;
}

/* Fond interactif */
.hero-bg {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.bg-blob {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 600px;
  height: 600px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(200,180,255,0.25) 0%, rgba(180,220,255,0.15) 40%, transparent 70%);
  filter: blur(80px);
  will-change: transform;
  transform: translate(-50%, -50%);
}

.bg-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(0,0,0,0.035) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0,0,0,0.035) 1px, transparent 1px);
  background-size: 50px 50px;
  mask-image: radial-gradient(ellipse 60% 55% at 50% 50%, black 20%, transparent 100%);
  -webkit-mask-image: radial-gradient(ellipse 60% 55% at 50% 50%, black 20%, transparent 100%);
}

.bg-noise {
  position: absolute;
  inset: 0;
  opacity: 0.04;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  background-repeat: repeat;
  background-size: 256px 256px;
}

/* Hero content */
.hero-content {
  position: relative;
  z-index: 1;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
}

.hero-eyebrow {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.65rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #999;
  margin-bottom: 2rem;
}

.hero-title {
  font-family: 'JetBrains Mono', monospace;
  font-weight: 300;
  font-size: clamp(2.2rem, 7vw, 5.5rem);
  line-height: 1.1;
  letter-spacing: -0.03em;
  color: #111;
  margin: 0 0 1.5rem;
}

.title-line {
  display: block;
  transform-origin: center bottom;
}

.title-accent {
  color: #111;
}

.title-italic em {
  font-style: italic;
  color: #666;
  font-weight: 200;
}

.hero-sub {
  font-family: 'JetBrains Mono', monospace;
  font-size: clamp(0.65rem, 1.1vw, 0.85rem);
  letter-spacing: 0.1em;
  color: #888;
  margin-bottom: 2rem;
}

/* Stats */
.hero-stats {
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 2.5rem;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.15rem;
}

.stat-num {
  font-family: 'JetBrains Mono', monospace;
  font-size: 1.2rem;
  font-weight: 600;
  color: #111;
}

.stat-lbl {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.55rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: #aaa;
}

.stat-sep {
  width: 1px;
  height: 28px;
  background: rgba(0,0,0,0.1);
}

/* CTA */
.hero-cta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.8rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #111;
  background: transparent;
  border: 1.5px solid #111;
  border-radius: 50px;
  padding: 0.75rem 2rem;
  cursor: pointer;
  transition: all 0.35s cubic-bezier(.4,0,.2,1);
}

.hero-cta:hover {
  background: #111;
  color: #fff;
  transform: translateY(-3px);
  box-shadow: 0 8px 30px rgba(0,0,0,0.12);
}

.hero-cta svg { transition: transform 0.35s; }
.hero-cta:hover svg { transform: translateY(3px); }

/* Scroll indicator */
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
   PROJECTS
   ════════════════════════════════════════ */
.projects {
  padding: 6rem 0 4rem;
  background: #fff;
}

.carousel {
  position: relative;
}

.carousel-window {
  overflow: hidden;
  width: 100vw;
  cursor: grab;
}

.carousel-window:active { cursor: grabbing; }

.carousel-track {
  display: flex;
  padding: 0 5vw;
  gap: 1.2rem;
}

.card {
  flex: 0 0 calc((100% - 3 * 1.2rem) / 4);
  position: relative;
  cursor: pointer;
  border-radius: 12px;
  overflow: hidden;
  opacity: 0; /* GSAP will animate */
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

.card-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background: #fff;
}

.card-info h3 {
  font-family: 'Inter', sans-serif;
  font-size: 0.85rem;
  font-weight: 400;
  color: #222;
  margin: 0;
}

.card-arrow {
  font-size: 1rem;
  color: #999;
  transition: transform 0.3s, color 0.3s;
}

.card:hover .card-arrow {
  transform: translateX(4px);
  color: #111;
}

/* Carousel nav */
.carousel-nav {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  margin-top: 2rem;
}

.nav-btn {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 1.5px solid rgba(0,0,0,0.15);
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #333;
  transition: all 0.3s;
}

.nav-btn:hover {
  border-color: #111;
  background: #111;
  color: #fff;
}

.nav-count {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem;
  letter-spacing: 0.1em;
  color: #999;
  min-width: 60px;
  text-align: center;
}

.all-projects-btn {
  display: block;
  margin: 2.5rem auto 0;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.8rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #111;
  background: transparent;
  border: 1.5px solid #111;
  border-radius: 50px;
  padding: 0.7rem 2rem;
  cursor: pointer;
  opacity: 0; /* GSAP */
  transition: all 0.3s;
}

.all-projects-btn:hover {
  background: #111;
  color: #fff;
}

/* ════════════════════════════════════════
   MARQUEE
   ════════════════════════════════════════ */
.marquee {
  width: 100vw;
  overflow: hidden;
  padding: 2rem 0;
  background: #111;
  border-top: 1px solid #222;
  border-bottom: 1px solid #222;
}

.marquee-track {
  display: flex;
  width: max-content;
  animation: mq-scroll 30s linear infinite;
}

.marquee-txt {
  font-family: 'JetBrains Mono', monospace;
  font-size: clamp(0.7rem, 1.2vw, 1rem);
  letter-spacing: 0.18em;
  color: #fff;
  white-space: nowrap;
  text-transform: uppercase;
}

@keyframes mq-scroll {
  0% { transform: translateX(0); }
  100% { transform: translateX(-25%); }
}

/* ════════════════════════════════════════
   ABOUT
   ════════════════════════════════════════ */
.about {
  padding: 6rem 0 8rem;
  background: #fff;
}

.about-body {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4rem;
  padding: 0 5vw;
}

.about-visual {
  flex-shrink: 0;
  width: 340px;
  height: 320px;
  border-radius: 16px;
  overflow: hidden;
  opacity: 0; /* GSAP */
}

.about-visual video {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.about-text {
  max-width: 500px;
  opacity: 0; /* GSAP */
}

.about-text h3 {
  font-family: 'Inter', sans-serif;
  font-size: 1.5rem;
  font-weight: 400;
  line-height: 1.4;
  color: #111;
  margin: 0 0 1.2rem;
}

.about-text p {
  font-family: 'Inter', sans-serif;
  font-size: 0.95rem;
  line-height: 1.7;
  color: #555;
  margin: 0 0 1rem;
}

.link-btn {
  display: inline-flex;
  align-items: center;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.8rem;
  letter-spacing: 0.05em;
  color: #111;
  background: transparent;
  border: 1.5px solid #111;
  border-radius: 50px;
  padding: 0.6rem 1.5rem;
  cursor: pointer;
  margin-top: 0.5rem;
  transition: all 0.3s;
}

.link-btn:hover {
  background: #111;
  color: #fff;
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
  border-radius: 12px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

/* ════════════════════════════════════════
   RESPONSIVE
   ════════════════════════════════════════ */
@media (max-width: 768px) {
  .hero {
    height: 90vh;
    margin-top: 40px;
  }

  .hero-title {
    font-size: clamp(1.8rem, 10vw, 3rem);
  }

  .hero-stats { gap: 1rem; }
  .stat-num { font-size: 1rem; }
  .hero-cta { font-size: 0.7rem; padding: 0.65rem 1.5rem; }

  .bg-blob {
    width: 350px;
    height: 350px;
  }

  .section-head {
    padding: 0 4vw;
  }

  .carousel-track {
    padding: 0 4vw;
    gap: 0;
  }

  .card {
    flex: 0 0 100%;
    border-radius: 8px;
  }

  .carousel-nav { margin-top: 1rem; }

  .about-body {
    flex-direction: column;
    padding: 0 5vw;
    gap: 2rem;
  }

  .about-visual {
    width: 80vw;
    height: auto;
    aspect-ratio: 380 / 350;
  }

  .about-text {
    max-width: 100%;
    text-align: center;
  }

  .about-text h3 { font-size: 1.2rem; }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .card {
    flex: 0 0 calc((100% - 2 * 1.2rem) / 3);
  }
}
</style>
