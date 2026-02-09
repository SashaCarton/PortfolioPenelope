<template>
  <div class="page-about" ref="pageRef" @mousemove="onMouseMove">

    <!-- ═══════════════════════════════════════
         HERO
         ═══════════════════════════════════════ -->
    <section class="page-hero" ref="heroRef">
      <div class="page-bg">
        <div class="bg-blob" ref="blobRef"></div>
        <div class="bg-grid"></div>
        <div class="bg-noise"></div>
      </div>

      <div class="hero-inner">
        <span class="hero-eyebrow" ref="eyebrowRef">À propos</span>
        <h1 class="hero-title">
          <span class="title-line" data-gsap="title">Étudiante en</span>
          <span class="title-line title-accent" data-gsap="title">design numérique</span>
        </h1>
        <p class="hero-sub" ref="subRef">Approche hybride de l'expérience, de la sensibilité et de la recherche</p>
      </div>

      <div class="scroll-ind" ref="scrollIndRef" @click="scrollToSection('content')">
        <span>scroll</span>
        <div class="scroll-bar"></div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════
         CONTENT — ASCII + textes
         ═══════════════════════════════════════ -->
    <section class="content-section" id="content">

      <!-- Bloc 1 : Démarche -->
      <div class="about-block" ref="block0Ref">
        <div class="section-head">
          <span class="section-tag">01</span>
          <h2 class="section-title">Ma démarche</h2>
          <div class="section-line"></div>
        </div>
        <div class="block-body">
          <div class="block-visual">
            <div class="ascii-container">
              <img :src="currentFrameSrc" alt="ASCII rotation" loading="eager" />
            </div>
          </div>
          <div class="block-text">
            <p>Formée aux beaux‑arts pendant 9 ans à l'école des arts plastiques de Lens, j'ai ensuite rejoint l'école ESAAT de Roubaix pour obtenir un BAC STD2A (arts appliqués). En parallèle, j'ai travaillé sur de nombreux projets numériques, car je suis passionnée par les technologies, le web, les jeux, et les expériences immersives…</p>
            <p>Aujourd'hui étudiante en design numérique à l'école ENSAAMA de Paris depuis septembre, je suis à la recherche d'un stage alliant nouvelles technologies, créativité et savoir‑faire.</p>
          </div>
        </div>
      </div>

      <!-- Bloc 2 : Études -->
      <div class="about-block" ref="block1Ref">
        <div class="section-head">
          <span class="section-tag">02</span>
          <h2 class="section-title">Mes études</h2>
          <div class="section-line"></div>
        </div>
        <div class="block-body reverse">
          <div class="block-text">
            <p>Issu du graphisme numérique, ce cursus vise à former les étudiants à la création-conception et à la production d'environnements numériques, comme&nbsp;:</p>
            <ul>
              <li>Motion design vidéo 2D/3D</li>
              <li>Web documentaires</li>
              <li>Interfaces graphiques pour sites web et applis mobiles</li>
              <li>Objets connectés, serious games et e‑learning</li>
              <li>Installations multimédia, mapping…</li>
            </ul>
          </div>
          <div class="block-visual">
            <div class="stat-card" ref="statCardRef">
              <div class="stat-big">ENSAAMA</div>
              <div class="stat-sub">Paris · Design numérique</div>
              <div class="stat-row">
                <div class="stat-item">
                  <span class="stat-num">9</span>
                  <span class="stat-lbl">ans beaux-arts</span>
                </div>
                <div class="stat-sep"></div>
                <div class="stat-item">
                  <span class="stat-num">STD2A</span>
                  <span class="stat-lbl">baccalauréat</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Bloc 3 : Loisirs -->
      <div class="about-block" ref="block2Ref">
        <div class="section-head">
          <span class="section-tag">03</span>
          <h2 class="section-title">Mes loisirs</h2>
          <div class="section-line"></div>
        </div>
        <div class="block-body">
          <div class="block-visual">
            <div class="trait-grid" ref="traitGridRef">
              <div class="trait" v-for="(trait, i) in traits" :key="i">
                <span class="trait-icon">{{ trait.icon }}</span>
                <span class="trait-label">{{ trait.label }}</span>
              </div>
            </div>
          </div>
          <div class="block-text">
            <p>On me décrit souvent comme ambitieuse, débrouillarde et très curieuse. J'aime toucher à tout, traditionnel ou numérique, et m'instruire en cinéma, mode, pop‑culture, science, histoire…</p>
            <p>Scout pendant 8 ans, je suis très indépendante mais j'aime aussi œuvrer en équipe.</p>
            <p>J'adore apprendre&nbsp;: j'ai suivi des cours de japonais, modélisation 3D et couture en dehors de la scolarité.</p>
          </div>
        </div>
      </div>

    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

// ── ASCII frames ──
const totalFrames = 42
const currentFrame = ref(42)

const currentFrameSrc = computed(() => {
  const n = String(currentFrame.value).padStart(6, '0')
  return `/assets/penny_frames/ascii-${n}.png`
})

// ── Traits ──
const traits = [
  { icon: '🎬', label: 'Cinéma' },
  { icon: '🎨', label: 'Arts' },
  { icon: '🧵', label: 'Couture' },
  { icon: '🇯🇵', label: 'Japonais' },
  { icon: '🏕️', label: 'Scoutisme' },
  { icon: '🧊', label: '3D' },
]

// ── Refs ──
const pageRef = ref(null)
const heroRef = ref(null)
const blobRef = ref(null)
const eyebrowRef = ref(null)
const subRef = ref(null)
const scrollIndRef = ref(null)
const block0Ref = ref(null)
const block1Ref = ref(null)
const block2Ref = ref(null)
const statCardRef = ref(null)
const traitGridRef = ref(null)

let gsapCtx = null

// ── Mouse tracking ──
function onMouseMove(e) {
  if (!blobRef.value) return
  gsap.to(blobRef.value, {
    x: e.clientX - window.innerWidth / 2,
    y: e.clientY - window.innerHeight / 2,
    duration: 1.2, ease: 'power2.out',
  })
}

function scrollToSection(id) {
  const el = document.getElementById(id)
  if (el) gsap.to(window, { scrollTo: { y: el, offsetY: 0 }, duration: 1, ease: 'power3.inOut' })
}

// ── Scroll-driven ASCII frames ──
function onScroll() {
  const scrollTop = window.scrollY
  const maxScroll = document.body.scrollHeight - window.innerHeight
  const fraction = scrollTop / maxScroll
  currentFrame.value = Math.min(totalFrames, Math.max(1, Math.round(totalFrames - (fraction * totalFrames)) + 1))
}

onMounted(() => {
  window.addEventListener('scroll', onScroll)
  window.scrollTo(0, 0)

  gsapCtx = gsap.context(() => {

    // ── Hero entrance ──
    gsap.set([eyebrowRef.value, subRef.value, scrollIndRef.value], { opacity: 0, y: 30 })
    gsap.set('[data-gsap="title"]', { opacity: 0, y: 60, rotateX: 10 })
    gsap.set(blobRef.value, { opacity: 0, scale: 0.3 })

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
    tl
      .to(blobRef.value, { opacity: 1, scale: 1, duration: 1.5, ease: 'power2.out' }, 0.2)
      .to(eyebrowRef.value, { opacity: 1, y: 0, duration: 0.7 }, 0.3)
      .to('[data-gsap="title"]', { opacity: 1, y: 0, rotateX: 0, duration: 0.9, stagger: 0.15 }, 0.5)
      .to(subRef.value, { opacity: 1, y: 0, duration: 0.7 }, 1.2)
      .to(scrollIndRef.value, { opacity: 1, y: 0, duration: 0.6 }, 1.6)
      .add(() => { scrollToSection('content') }, 2.5)

    // ── Hero parallax ──
    gsap.to('.hero-inner', {
      y: -80, opacity: 0.3, ease: 'none',
      scrollTrigger: { trigger: heroRef.value, start: 'top top', end: 'bottom top', scrub: true }
    })

    // ── About blocks stagger reveal ──
    const blocks = [block0Ref, block1Ref, block2Ref]
    blocks.forEach((blockRef) => {
      if (!blockRef.value) return

      // Section head
      gsap.fromTo(blockRef.value.querySelectorAll('.section-tag, .section-title, .section-line'),
        { opacity: 0, y: 25 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: 'power2.out',
          scrollTrigger: { trigger: blockRef.value, start: 'top 85%', once: true } }
      )

      // Visual
      const visual = blockRef.value.querySelector('.block-visual')
      if (visual) {
        gsap.fromTo(visual,
          { opacity: 0, x: -50, rotateY: 6 },
          { opacity: 1, x: 0, rotateY: 0, duration: 1, ease: 'power2.out',
            scrollTrigger: { trigger: blockRef.value, start: 'top 80%', once: true } }
        )
      }

      // Text
      const text = blockRef.value.querySelector('.block-text')
      if (text) {
        gsap.fromTo(text,
          { opacity: 0, x: 50 },
          { opacity: 1, x: 0, duration: 1, ease: 'power2.out',
            scrollTrigger: { trigger: blockRef.value, start: 'top 80%', once: true } }
        )
      }
    })

    // ── Trait grid stagger ──
    if (traitGridRef.value) {
      const items = traitGridRef.value.querySelectorAll('.trait')
      gsap.fromTo(items,
        { opacity: 0, y: 20, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.08, ease: 'back.out(1.7)',
          scrollTrigger: { trigger: traitGridRef.value, start: 'top 85%', once: true } }
      )
    }

    // ── Stat card ──
    if (statCardRef.value) {
      gsap.fromTo(statCardRef.value,
        { opacity: 0, scale: 0.92, y: 30 },
        { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: 'power2.out',
          scrollTrigger: { trigger: statCardRef.value, start: 'top 85%', once: true } }
      )
    }

  })
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  gsapCtx?.revert()
})
</script>

<style scoped>
/* ════════════════════════════════════════
   PAGE
   ════════════════════════════════════════ */
.page-about {
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
  position: absolute; inset: 0; z-index: 0; overflow: hidden;
}

.bg-blob {
  position: absolute; top: 50%; left: 50%;
  width: 600px; height: 600px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(140,100,255,0.18), rgba(80,150,255,0.12), transparent 70%);
  filter: blur(80px);
  will-change: transform;
  transform: translate(-50%, -50%);
  pointer-events: none;
}

.bg-grid {
  position: absolute; inset: 0;
  background-image:
    linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px);
  background-size: 50px 50px;
  mask-image: radial-gradient(ellipse 60% 60% at 50% 50%, black 40%, transparent 100%);
}

.bg-noise {
  position: absolute; inset: 0; opacity: 0.3;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
}

.hero-inner {
  position: relative; z-index: 1;
  text-align: center;
  display: flex; flex-direction: column; align-items: center;
}

.hero-eyebrow {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.65rem; letter-spacing: 0.2em; text-transform: uppercase;
  color: #999; margin-bottom: 1.5rem;
}

.hero-title {
  display: flex; flex-direction: column; align-items: center;
  font-family: 'Inter', sans-serif;
  font-size: clamp(2.5rem, 7vw, 5rem);
  font-weight: 300; line-height: 1.1; letter-spacing: -0.03em;
  color: #111; margin: 0 0 1.5rem;
}

.title-line { display: block; will-change: transform, opacity; transform-origin: center bottom; }
.title-accent { color: #111; }

.hero-sub {
  font-family: 'JetBrains Mono', monospace;
  font-size: clamp(0.65rem, 1.1vw, 0.85rem);
  letter-spacing: 0.1em; color: #888;
  max-width: 500px;
}

.scroll-ind {
  position: absolute; bottom: 2.5rem;
  display: flex; flex-direction: column; align-items: center;
  gap: 0.5rem; cursor: pointer; z-index: 1;
}

.scroll-ind span { font-family: 'JetBrains Mono', monospace; font-size: 0.55rem; letter-spacing: 0.2em; text-transform: uppercase; color: #bbb; }

.scroll-bar {
  width: 1px; height: 36px;
  background: linear-gradient(to bottom, #bbb, transparent);
  animation: pulse-bar 2s ease-in-out infinite;
}

@keyframes pulse-bar {
  0%, 100% { opacity: 0.3; transform: scaleY(0.5); }
  50% { opacity: 1; transform: scaleY(1); }
}

/* ════════════════════════════════════════
   CONTENT
   ════════════════════════════════════════ */
.content-section {
  padding: 6rem 0;
  background: #fff;
}

.about-block {
  padding: 0 5vw;
  margin-bottom: 8rem;
}

.about-block:last-child {
  margin-bottom: 4rem;
}

/* Section headers */
.section-head {
  display: flex; align-items: center; gap: 1.2rem;
  margin-bottom: 2.5rem;
}

.section-tag {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.65rem; letter-spacing: 0.15em; color: #bbb;
}

.section-title {
  font-family: 'JetBrains Mono', monospace;
  font-weight: 400; font-size: clamp(1.2rem, 2.5vw, 1.8rem);
  letter-spacing: -0.01em; color: #111; margin: 0;
}

.section-line {
  flex: 1; height: 1px; background: rgba(0,0,0,0.1);
}

/* Block body */
.block-body {
  display: flex;
  align-items: flex-start;
  gap: 4rem;
}

.block-body.reverse {
  flex-direction: row-reverse;
}

.block-visual {
  flex-shrink: 0;
  width: 380px;
}

.block-text {
  flex: 1;
  max-width: 550px;
}

.block-text p {
  font-family: 'Inter', sans-serif;
  font-size: 0.95rem;
  line-height: 1.8;
  color: #555;
  margin: 0 0 1rem;
}

.block-text ul {
  padding-left: 1.5rem;
  margin: 0.5rem 0 1rem;
}

.block-text li {
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  line-height: 1.8;
  color: #555;
}

/* ASCII */
.ascii-container {
  width: 100%;
  border-radius: 16px;
  overflow: hidden;
}

.ascii-container img {
  width: 100%;
  height: auto;
  display: block;
}

/* Stat card */
.stat-card {
  background: #fff;
  border: 1px solid rgba(0,0,0,0.06);
  border-radius: 16px;
  padding: 2.5rem;
  text-align: center;
  box-shadow: 0 8px 32px rgba(0,0,0,0.05);
}

.stat-big {
  font-family: 'Inter', sans-serif;
  font-size: 2rem;
  font-weight: 300;
  letter-spacing: -0.02em;
  color: #111;
  margin-bottom: 0.3rem;
}

.stat-sub {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem;
  letter-spacing: 0.1em;
  color: #999;
  margin-bottom: 2rem;
}

.stat-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
}

.stat-item {
  display: flex; flex-direction: column; align-items: center; gap: 0.15rem;
}

.stat-num {
  font-family: 'JetBrains Mono', monospace;
  font-size: 1.2rem; font-weight: 600; color: #111;
}

.stat-lbl {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.55rem; letter-spacing: 0.15em;
  text-transform: uppercase; color: #aaa;
}

.stat-sep {
  width: 1px; height: 28px; background: rgba(0,0,0,0.1);
}

/* Trait grid */
.trait-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.trait {
  display: flex; flex-direction: column; align-items: center;
  gap: 0.4rem;
  background: #fff;
  border: 1px solid rgba(0,0,0,0.06);
  border-radius: 12px;
  padding: 1.2rem 0.8rem;
  transition: transform 0.3s, box-shadow 0.3s;
}

.trait:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.06);
}

.trait-icon {
  font-size: 1.5rem;
}

.trait-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.65rem;
  letter-spacing: 0.1em;
  color: #666;
  text-transform: uppercase;
}

/* ════════════════════════════════════════
   RESPONSIVE
   ════════════════════════════════════════ */
@media (max-width: 768px) {
  .page-hero { height: 85vh; margin-top: 40px; }
  .hero-title { font-size: clamp(1.8rem, 10vw, 3rem); }
  .bg-blob { width: 350px; height: 350px; }

  .block-body,
  .block-body.reverse {
    flex-direction: column;
    gap: 2rem;
  }

  .block-visual {
    width: 100%;
    max-width: 320px;
    margin: 0 auto;
  }

  .block-text { max-width: 100%; }

  .about-block { margin-bottom: 5rem; }

  .trait-grid { grid-template-columns: repeat(2, 1fr); }
}
</style>
