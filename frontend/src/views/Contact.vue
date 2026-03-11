<template>
  <div class="page-contact" ref="pageRef" @mousemove="onMouseMove">

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
        <span class="hero-eyebrow" ref="eyebrowRef">Contact</span>
        <h1 class="hero-title">
          <span class="title-line" data-gsap="title">Discutons</span>
          <span class="title-line title-accent" data-gsap="title">ensemble</span>
        </h1>
        <p class="hero-sub" ref="subRef">Une question, une opportunité ou simplement envie de dire bonjour&nbsp;?</p>
      </div>

      <div class="scroll-ind" ref="scrollIndRef" @click="scrollToSection('form')">
        <span>scroll</span>
        <div class="scroll-bar"></div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════
         FORMULAIRE
         ═══════════════════════════════════════ -->
    <section class="form-section" id="form">
      <div class="section-head" ref="formHeadRef">
        <span class="section-tag">01</span>
        <h2 class="section-title">Envoyer un message</h2>
        <div class="section-line"></div>
      </div>

      <div class="form-wrapper" ref="formWrapperRef">
        <form @submit.prevent="handleSubmit" class="contact-form">
          <div class="form-group" ref="fg0">
            <label for="name">Nom</label>
            <input v-model="form.name" type="text" id="name" aria-label="Nom" required placeholder="Votre nom" />
          </div>

          <div class="form-group" ref="fg1">
            <label for="email">Email</label>
            <input v-model="form.email" type="email" id="email" aria-label="Email" required placeholder="votre@email.com" />
          </div>

          <div class="form-group" ref="fg2">
            <label for="message">Message</label>
            <textarea v-model="form.message" id="message" rows="5" aria-label="Message" required placeholder="Votre message…"></textarea>
          </div>

          <button type="submit" :disabled="loading" class="submit-btn" ref="submitRef">
            <span v-if="!loading">Envoyer</span>
            <span v-else>Envoi…</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M8 3l5 5-5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>

          <p v-if="success" class="msg msg-ok">Merci pour votre message&nbsp;! Je vous répondrai bientôt.</p>
          <p v-if="error" class="msg msg-err">{{ errorMessage }}</p>
        </form>

        <!-- Socials -->
        <div class="socials" ref="socialsRef">
          <span class="socials-label">Retrouvez-moi</span>
          <div class="socials-row">
            <a href="https://www.linkedin.com/in/penelopeletienne/" target="_blank" rel="noopener" aria-label="LinkedIn" class="social-link">
              <img src="/assets/linkedin.svg" alt="LinkedIn" width="24" height="24" />
              <span>LinkedIn</span>
            </a>
            <a href="https://github.com/Penny0507" target="_blank" rel="noopener" aria-label="GitHub" class="social-link">
              <img src="/assets/github.svg" alt="GitHub" width="24" height="24" />
              <span>GitHub</span>
            </a>
            <a href="https://www.instagram.com/penny_things/" target="_blank" rel="noopener" aria-label="Instagram" class="social-link">
              <img src="/assets/insta.png" alt="Instagram" width="24" height="24" />
              <span>Instagram</span>
            </a>
            <a href="mailto:penelope.letienne@ensaama.net" target="_blank" rel="noopener" aria-label="Email" class="social-link">
              <img src="/assets/email.svg" alt="Email" width="24" height="24" />
              <span>Email</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

const form = ref({ name: '', email: '', message: '' })
const loading = ref(false)
const success = ref(false)
const error = ref(false)
const errorMessage = ref('')

// ── Refs ──
const pageRef = ref(null)
const heroRef = ref(null)
const blobRef = ref(null)
const eyebrowRef = ref(null)
const subRef = ref(null)
const scrollIndRef = ref(null)
const formHeadRef = ref(null)
const formWrapperRef = ref(null)
const fg0 = ref(null)
const fg1 = ref(null)
const fg2 = ref(null)
const submitRef = ref(null)
const socialsRef = ref(null)

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

// ── Submit ──
async function handleSubmit() {
  if (!form.value.name || !form.value.email || !form.value.message) {
    error.value = true
    errorMessage.value = 'Tous les champs sont requis.'
    return
  }

  loading.value = true
  success.value = false
  error.value = false
  errorMessage.value = ''

  try {
    const response = await fetch('https://api.penelopeletienne.ovh/api/contacts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        data: { Nom: form.value.name, Email: form.value.email, Message: form.value.message }
      }),
    })

    if (!response.ok) {
      const details = await response.json()
      throw new Error(`Erreur ${response.status}: ${details.error?.message || response.statusText}`)
    }

    success.value = true
    form.value = { name: '', email: '', message: '' }

    // Celebrate animation
    if (submitRef.value) {
      gsap.fromTo(submitRef.value, { scale: 1 }, { scale: 1.05, duration: 0.15, yoyo: true, repeat: 1 })
    }
  } catch (err) {
    error.value = true
    errorMessage.value = err.message
  } finally {
    loading.value = false
  }
}

// ═══════════════════════════════════════
// GSAP
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
      .to('[data-gsap="title"]', { opacity: 1, y: 0, rotateX: 0, duration: 0.9, stagger: 0.15 }, 0.5)
      .to(subRef.value, { opacity: 1, y: 0, duration: 0.7 }, 1.2)
      .to(scrollIndRef.value, { opacity: 1, y: 0, duration: 0.6 }, 1.6)
      .add(() => { scrollToSection('form') }, 2.5)

    // ── Hero parallax ──
    gsap.to('.hero-inner', {
      y: -80, opacity: 0.3, ease: 'none',
      scrollTrigger: { trigger: heroRef.value, start: 'top top', end: 'bottom top', scrub: true }
    })

    // ── Form head reveal ──
    if (formHeadRef.value) {
      gsap.fromTo(formHeadRef.value.querySelectorAll('.section-tag, .section-title, .section-line'),
        { opacity: 0, y: 25 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: 'power2.out',
          scrollTrigger: { trigger: formHeadRef.value, start: 'top 85%', once: true } }
      )
    }

    // ── Form fields stagger ──
    const fgs = [fg0.value, fg1.value, fg2.value, submitRef.value].filter(Boolean)
    gsap.fromTo(fgs,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.12, ease: 'power2.out',
        scrollTrigger: { trigger: formWrapperRef.value, start: 'top 85%', once: true } }
    )

    // ── Socials stagger ──
    if (socialsRef.value) {
      gsap.fromTo(socialsRef.value.querySelectorAll('.social-link'),
        { opacity: 0, y: 20, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.08, ease: 'back.out(1.7)',
          scrollTrigger: { trigger: socialsRef.value, start: 'top 90%', once: true } }
      )
    }

  })
})

onUnmounted(() => {
  gsapCtx?.revert()
})
</script>

<style scoped>
/* ════════════════════════════════════════
   PAGE
   ════════════════════════════════════════ */
.page-contact {
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
  max-width: 440px;
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
   FORM SECTION
   ════════════════════════════════════════ */
.form-section {
  padding: 6rem 0 8rem;
  background: #fff;
}

.section-head {
  display: flex; align-items: center; gap: 1.2rem;
  margin-bottom: 3rem; padding: 0 5vw;
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

.form-wrapper {
  max-width: 600px;
  margin: 0 auto;
  padding: 0 2rem;
}

/* Form */
.contact-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.form-group label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #999;
}

.form-group input,
.form-group textarea {
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  padding: 0.9rem 1rem;
  border: 1.5px solid rgba(0,0,0,0.1);
  border-radius: 10px;
  background: #fafafa;
  color: #111;
  transition: border-color 0.3s, box-shadow 0.3s;
  outline: none;
}

.form-group input:focus,
.form-group textarea:focus {
  border-color: rgba(140,100,255,0.5);
  box-shadow: 0 0 0 3px rgba(140,100,255,0.08);
}

.form-group input::placeholder,
.form-group textarea::placeholder {
  color: #ccc;
}

.form-group textarea {
  resize: vertical;
  min-height: 140px;
}

/* Submit */
.submit-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.8rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #fff;
  background: #111;
  border: 1.5px solid #111;
  border-radius: 50px;
  padding: 0.85rem 2.5rem;
  cursor: pointer;
  transition: all 0.35s cubic-bezier(.4,0,.2,1);
  align-self: flex-start;
}

.submit-btn:hover:not(:disabled) {
  background: transparent;
  color: #111;
  transform: translateY(-3px);
  box-shadow: 0 8px 30px rgba(0,0,0,0.12);
}

.submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.submit-btn svg { transition: transform 0.3s; }
.submit-btn:hover:not(:disabled) svg { transform: translateX(4px); }

.msg {
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  margin-top: 0.5rem;
}

.msg-ok { color: #22c55e; }
.msg-err { color: #ef4444; }

/* ════════════════════════════════════════
   SOCIALS
   ════════════════════════════════════════ */
.socials {
  margin-top: 4rem;
  text-align: center;
}

.socials-label {
  display: block;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.65rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: #bbb;
  margin-bottom: 1.5rem;
}

.socials-row {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.social-link {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;
  padding: 1rem 1.2rem;
  border-radius: 12px;
  border: 1px solid rgba(0,0,0,0.06);
  background: #fafafa;
  text-decoration: none;
  transition: transform 0.3s, box-shadow 0.3s, background 0.3s;
}

.social-link:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.06);
  background: #fff;
}

.social-link img {
  width: 24px; height: 24px;
  object-fit: contain;
  filter: grayscale(0.3) brightness(0.9);
  transition: filter 0.3s;
}

.social-link:hover img {
  filter: grayscale(0) brightness(1);
}

.social-link span {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.6rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #666;
}

/* ════════════════════════════════════════
   RESPONSIVE
   ════════════════════════════════════════ */
@media (max-width: 768px) {
  .page-hero { height: 85vh; margin-top: 40px; }
  .hero-title { font-size: clamp(1.8rem, 10vw, 3rem); }
  .bg-blob { width: 350px; height: 350px; }

  .form-wrapper { padding: 0 1.5rem; }

  .socials-row {
    flex-wrap: wrap;
    gap: 0.8rem;
  }

  .social-link {
    flex: 0 0 calc(50% - 0.4rem);
  }
}
</style>
