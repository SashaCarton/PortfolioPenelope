<template>
  <div class="page-detail" ref="pageRef" @mousemove="onMouseMove">

    <!-- ═══════════════════════════════════════
         HERO — Cover pleine largeur
         ═══════════════════════════════════════ -->
    <section class="detail-hero" ref="heroRef">
      <div class="hero-bg">
        <div class="bg-blob" ref="blobRef"></div>
        <div class="bg-grid"></div>
        <div class="bg-noise"></div>
      </div>

      <div v-if="project" class="hero-inner" ref="heroInnerRef">
        <span class="hero-eyebrow" ref="eyebrowRef">Projet {{ String(project.id).padStart(2, '0') }}</span>
        <h1 class="hero-title" ref="titleRef">{{ project.title }}</h1>
        <p class="hero-desc" ref="descRef">{{ project.description }}</p>
      </div>

      <div v-if="!project" class="hero-inner">
        <span class="hero-eyebrow">Chargement…</span>
      </div>
    </section>

    <!-- ═══════════════════════════════════════
         COVER IMAGE — parallax
         ═══════════════════════════════════════ -->
    <section v-if="project?.cover" class="cover-section" ref="coverRef">
      <div class="cover-wrapper">
        <img :src="project.cover" :alt="project.title" class="cover-img" ref="coverImgRef" />
      </div>
    </section>

    <!-- ═══════════════════════════════════════
         MEDIA — images & vidéos
         ═══════════════════════════════════════ -->
    <section v-if="project" class="media-section">
      <div class="section-head" ref="mediaHeadRef">
        <span class="section-tag">01</span>
        <h2 class="section-title">Galerie</h2>
        <div class="section-line"></div>
      </div>

      <div class="media-grid" ref="mediaGridRef">
        <div v-for="(media, index) in project.media" :key="media.id" class="media-item">
          <template v-if="media.mime.startsWith('image')">
            <img
              :src="mediaImage(`https://api.penelopeletienne.ovh${media.url}`)"
              :alt="media.name"
              class="media-img"
              @click="openLightbox(index)"
              loading="lazy"
              decoding="async"
            />
          </template>
        </div>

        <div v-for="video in project.video" :key="video.id" class="media-item media-video-wrap">
          <template v-if="video.mime.startsWith('video')">
            <video controls autoplay muted loop class="media-video" playsinline>
              <source :src="`https://api.penelopeletienne.ovh${video.url}`" :type="video.mime" />
            </video>
          </template>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════
         3D VIEWER
         ═══════════════════════════════════════ -->
    <section v-if="project?.has3D && project.modelUrls?.length && selectedModelIndex >= 0" class="viewer-section">
      <div class="section-head" ref="viewerHeadRef">
        <span class="section-tag">02</span>
        <h2 class="section-title">Vue 3D</h2>
        <div class="section-line"></div>
      </div>

      <div class="three-scene">
        <ThreeViewer :modelUrl="project.modelUrls[selectedModelIndex]" />

        <div class="model-controls" v-if="project.modelUrls.length > 1">
          <button @click="prevModel" aria-label="Précédent">◀</button>
          <button @click="nextModel" aria-label="Suivant">▶</button>
        </div>

        <div class="model-list" v-if="project.modelUrls.length">
          <button
            v-for="(m, i) in project.modelUrls" :key="i"
            :class="['model-btn', { active: i === selectedModelIndex }]"
            @click="selectModel(i)"
          >{{ (m.split('/').pop()) || ('model-' + (i+1)) }}</button>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════
         BACK BUTTON
         ═══════════════════════════════════════ -->
    <div class="back-section" ref="backRef">
      <button @click="goBackToProjects" class="back-btn">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 12L6 8l4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
        <span>Retour aux projets</span>
      </button>
    </div>

    <!-- Lightbox -->
    <vue-easy-lightbox
      :visible="lightboxVisible"
      :imgs="lightboxImages"
      :index="lightboxIndex"
      @hide="lightboxVisible = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, onUnmounted, defineAsyncComponent, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import VueEasyLightbox from 'vue-easy-lightbox'
import { fullWidthImage, mediaImage } from '../utils/cdn'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const ThreeViewer = defineAsyncComponent(() => import('../components/ThreeViewer.vue'))

type MediaItem = { id: number | string; mime: string; url: string; name?: string }
type VideoItem = { id: number | string; mime: string; url: string; name?: string }
type ProjectType = {
  id: number; title: string; description: string; createdAt?: string; cover?: string | null;
  media: MediaItem[]; video: VideoItem[]; has3D?: boolean; modelUrls?: string[];
}

const project = ref<ProjectType | null>(null)
const route = useRoute()
const router = useRouter()

const lightboxVisible = ref(false)
const lightboxImages = ref<string[]>([])
const lightboxIndex = ref(0)
const selectedModelIndex = ref(-1)

// Refs
const pageRef = ref<HTMLElement | null>(null)
const heroRef = ref<HTMLElement | null>(null)
const blobRef = ref<HTMLElement | null>(null)
const eyebrowRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const descRef = ref<HTMLElement | null>(null)
const heroInnerRef = ref<HTMLElement | null>(null)
const coverRef = ref<HTMLElement | null>(null)
const coverImgRef = ref<HTMLImageElement | null>(null)
const mediaHeadRef = ref<HTMLElement | null>(null)
const mediaGridRef = ref<HTMLElement | null>(null)
const viewerHeadRef = ref<HTMLElement | null>(null)
const backRef = ref<HTMLElement | null>(null)

let gsapCtx: ReturnType<typeof gsap.context> | null = null

// Mouse tracking
function onMouseMove(e: MouseEvent) {
  if (!blobRef.value) return
  gsap.to(blobRef.value, {
    x: e.clientX - window.innerWidth / 2,
    y: e.clientY - window.innerHeight / 2,
    duration: 1.2, ease: 'power2.out'
  })
}

// 3D model controls
function selectModel(i: number) {
  if (!project.value?.modelUrls) return
  selectedModelIndex.value = Math.max(0, Math.min(i, project.value.modelUrls.length - 1))
}
function nextModel() {
  if (!project.value?.modelUrls) return
  selectModel((selectedModelIndex.value + 1) % project.value.modelUrls.length)
}
function prevModel() {
  if (!project.value?.modelUrls) return
  selectModel((selectedModelIndex.value - 1 + project.value.modelUrls.length) % project.value.modelUrls.length)
}

function onKeydown(e: KeyboardEvent) {
  if (!project.value?.modelUrls || selectedModelIndex.value < 0) return
  if (e.key === 'ArrowLeft') { e.preventDefault(); prevModel() }
  else if (e.key === 'ArrowRight') { e.preventDefault(); nextModel() }
}

function openLightbox(index: number) {
  lightboxIndex.value = index
  lightboxVisible.value = true
}

function goBackToProjects() {
  router.push('/projects')
}

// ═══════════════════════════════════════
// GSAP
// ═══════════════════════════════════════
function initAnimations() {
  gsapCtx = gsap.context(() => {
    // blob
    if (blobRef.value) gsap.set(blobRef.value, { opacity: 0, scale: 0.3 })

    // Hero entrance
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

    if (blobRef.value) tl.to(blobRef.value, { opacity: 1, scale: 1, duration: 1.5, ease: 'power2.out' }, 0.1)
    if (eyebrowRef.value) { gsap.set(eyebrowRef.value, { opacity: 0, y: 20 }); tl.to(eyebrowRef.value, { opacity: 1, y: 0, duration: 0.6 }, 0.3) }
    if (titleRef.value) { gsap.set(titleRef.value, { opacity: 0, y: 40 }); tl.to(titleRef.value, { opacity: 1, y: 0, duration: 0.8 }, 0.5) }
    if (descRef.value) { gsap.set(descRef.value, { opacity: 0, y: 30 }); tl.to(descRef.value, { opacity: 1, y: 0, duration: 0.7 }, 0.8) }

    // Hero parallax
    if (heroInnerRef.value) {
      gsap.to(heroInnerRef.value, {
        y: -60, opacity: 0.3, ease: 'none',
        scrollTrigger: { trigger: heroRef.value, start: 'top top', end: 'bottom top', scrub: true }
      })
    }

    // Cover parallax
    if (coverImgRef.value && coverRef.value) {
      gsap.fromTo(coverImgRef.value,
        { scale: 1.1 },
        { scale: 1, ease: 'none',
          scrollTrigger: { trigger: coverRef.value, start: 'top bottom', end: 'bottom top', scrub: 1.5 } }
      )
    }

    // Section heads reveal
    const heads = [mediaHeadRef.value, viewerHeadRef.value].filter(Boolean) as HTMLElement[]
    heads.forEach(h => {
      gsap.fromTo(h.querySelectorAll('.section-tag, .section-title, .section-line'),
        { opacity: 0, y: 25 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: 'power2.out',
          scrollTrigger: { trigger: h, start: 'top 85%', once: true } }
      )
    })

    // Media grid stagger
    if (mediaGridRef.value) {
      const items = mediaGridRef.value.querySelectorAll('.media-item')
      if (items.length) {
        gsap.fromTo(items,
          { opacity: 0, y: 40, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.08, ease: 'power2.out',
            scrollTrigger: { trigger: mediaGridRef.value, start: 'top 85%', once: true } }
        )
      }
    }

    // Back button
    if (backRef.value) {
      gsap.fromTo(backRef.value,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out',
          scrollTrigger: { trigger: backRef.value, start: 'top 90%', once: true } }
      )
    }
  })
}

onMounted(async () => {
  const projectId = Number(route.params.id)
  try {
    const response = await fetch('https://api.penelopeletienne.ovh/api/projets?populate=*')
    if (!response.ok) throw new Error('Erreur')
    const { data } = await response.json()
    const projectData = data.find((proj: any) => proj.id === projectId) as any
    if (!projectData) throw new Error('Projet non trouvé')

    // Model URLs
    const modelUrls: string[] = []
    if (projectData.URL_SUPABASE && Array.isArray(projectData.URL_SUPABASE)) {
      projectData.URL_SUPABASE.forEach((m: any) => { if (m?.url) modelUrls.push(m.url) })
    }
    if (projectData.model?.data?.attributes?.url) modelUrls.push(`https://api.penelopeletienne.ovh${projectData.model.data.attributes.url}`)
    if (projectData.Model?.data?.attributes?.url) modelUrls.push(`https://api.penelopeletienne.ovh${projectData.Model.data.attributes.url}`)
    if (projectData.modelUrl) modelUrls.push(projectData.modelUrl)
    const uniqueModelUrls = Array.from(new Set(modelUrls))

    project.value = {
      id: projectData.id,
      title: projectData.Titre || 'Sans titre',
      description: projectData.Description || 'Pas de description',
      createdAt: projectData.createdAt,
      cover: fullWidthImage(
        projectData.Cover?.formats?.medium?.url
          ? `https://api.penelopeletienne.ovh${projectData.Cover.formats.medium.url}`
          : projectData.Cover?.url
          ? `https://api.penelopeletienne.ovh${projectData.Cover.url}`
          : null
      ),
      media: projectData.Media || [],
      video: projectData.Video || [],
      has3D: uniqueModelUrls.length > 0,
      modelUrls: uniqueModelUrls,
    }

    // Lightbox images
    const rawMedia = ((project.value.media as any[]) || [])
    lightboxImages.value = rawMedia
      .filter((m: any) => m && typeof m.mime === 'string' && m.mime.startsWith('image') && !!m.url)
      .map((m: any) => { const u = m.url || ''; return u.startsWith('http') ? u : `https://api.penelopeletienne.ovh${u}` })
      .filter(Boolean)

    if (project.value.modelUrls && project.value.modelUrls.length) {
      selectedModelIndex.value = 0
    }

    window.addEventListener('keydown', onKeydown)

    await nextTick()
    initAnimations()
  } catch (error) {
    console.error('Erreur :', error)
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  gsapCtx?.revert()
})
</script>

<style scoped>
/* ════════════════════════════════════════
   PAGE
   ════════════════════════════════════════ */
.page-detail {
  background: #fafafa;
  min-height: 100vh;
}

/* ════════════════════════════════════════
   HERO
   ════════════════════════════════════════ */
.detail-hero {
  position: relative;
  min-height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.hero-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  overflow: hidden;
}

.bg-blob {
  position: absolute;
  top: 50%; left: 50%;
  width: 500px; height: 500px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(140,100,255,0.15), rgba(80,150,255,0.1), transparent 70%);
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
  position: absolute; inset: 0;
  opacity: 0.3;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
}

.hero-inner {
  position: relative; z-index: 1;
  text-align: center;
  display: flex; flex-direction: column; align-items: center;
  max-width: 700px;
  padding: 0 2rem;
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
  font-family: 'Inter', sans-serif;
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 300;
  line-height: 1.15;
  letter-spacing: -0.03em;
  color: #111;
  margin: 0 0 1.2rem;
}

.hero-desc {
  font-family: 'Inter', sans-serif;
  font-size: clamp(0.9rem, 1.4vw, 1.1rem);
  line-height: 1.7;
  color: #666;
  max-width: 550px;
}

/* ════════════════════════════════════════
   COVER
   ════════════════════════════════════════ */
.cover-section {
  padding: 0 5vw;
  margin-top: -3rem;
  position: relative;
  z-index: 2;
}

.cover-wrapper {
  max-width: 900px;
  margin: 0 auto;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 24px 64px rgba(0,0,0,0.1);
}

.cover-img {
  width: 100%;
  height: auto;
  display: block;
  will-change: transform;
}

/* ════════════════════════════════════════
   SECTION HEADERS
   ════════════════════════════════════════ */
.section-head {
  display: flex;
  align-items: center;
  gap: 1.2rem;
  margin-bottom: 2.5rem;
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
  flex: 1; height: 1px;
  background: rgba(0,0,0,0.1);
}

/* ════════════════════════════════════════
   MEDIA GRID
   ════════════════════════════════════════ */
.media-section {
  padding: 5rem 0 4rem;
  background: #fff;
}

.media-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1.2rem;
  padding: 0 5vw;
}

.media-item {
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.4s cubic-bezier(.4,0,.2,1), box-shadow 0.4s;
}

.media-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 36px rgba(0,0,0,0.1);
}

.media-img {
  width: 100%;
  height: auto;
  display: block;
  object-fit: cover;
  transition: transform 0.5s cubic-bezier(.4,0,.2,1);
}

.media-item:hover .media-img {
  transform: scale(1.05);
}

.media-video-wrap {
  cursor: default;
}

.media-video {
  width: 100%;
  height: auto;
  display: block;
  border-radius: 12px;
}

/* ════════════════════════════════════════
   3D VIEWER
   ════════════════════════════════════════ */
.viewer-section {
  padding: 4rem 0;
  background: #fafafa;
}

.three-scene {
  position: relative;
  border: 1px solid rgba(0,0,0,0.06);
  width: calc(100% - 10vw);
  max-width: 1000px;
  height: 500px;
  border-radius: 16px;
  overflow: hidden;
  margin: 0 auto;
  background: #fff;
}

.three-scene canvas { display: block; width: 100% !important; height: 100% !important; }

.model-controls {
  position: absolute; top: 50%; left: 0; right: 0;
  display: flex; justify-content: space-between; align-items: center;
  transform: translateY(-50%);
  pointer-events: none;
  z-index: 30;
  padding: 0 0.5rem;
}

.model-controls button {
  pointer-events: auto;
  background: rgba(0,0,0,0.6);
  color: #fff; border: none;
  padding: 0.6rem 0.9rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
}

.model-list {
  position: absolute;
  left: 50%; transform: translateX(-50%);
  bottom: 12px;
  display: flex; gap: 0.5rem; z-index: 30;
}

.model-btn {
  background: rgba(255,255,255,0.8);
  backdrop-filter: blur(8px);
  color: #111; border: 1px solid rgba(0,0,0,0.08);
  padding: 0.35rem 0.6rem; border-radius: 6px;
  cursor: pointer; font-size: 0.8rem;
  font-family: 'JetBrains Mono', monospace;
}

.model-btn.active {
  background: #111; color: #fff;
}

/* ════════════════════════════════════════
   BACK
   ════════════════════════════════════════ */
.back-section {
  padding: 4rem 5vw 6rem;
  text-align: center;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
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
  transition: all 0.35s cubic-bezier(.4,0,.2,1);
}

.back-btn:hover {
  background: #111;
  color: #fff;
  transform: translateY(-3px);
  box-shadow: 0 8px 30px rgba(0,0,0,0.12);
}

.back-btn svg { transition: transform 0.3s; }
.back-btn:hover svg { transform: translateX(-3px); }

/* ════════════════════════════════════════
   RESPONSIVE
   ════════════════════════════════════════ */
@media (max-width: 768px) {
  .detail-hero { min-height: 55vh; margin-top: 40px; }
  .hero-title { font-size: clamp(1.6rem, 8vw, 2.5rem); }
  .bg-blob { width: 300px; height: 300px; }
  .cover-section { padding: 0 4vw; margin-top: -1rem; }
  .media-grid { grid-template-columns: 1fr; padding: 0 4vw; }
  .three-scene { height: 350px; width: calc(100% - 8vw); }
}
</style>
