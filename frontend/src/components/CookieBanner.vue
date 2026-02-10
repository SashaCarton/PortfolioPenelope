<template>
  <Transition name="cookie-slide">
    <div v-if="visible" class="cookie-banner" role="dialog" aria-label="Consentement cookies">
      <div class="cookie-inner">
        <div class="cookie-icon" aria-hidden="true">&#9881;</div>
        <div class="cookie-text">
          <p class="cookie-title">> cookies_</p>
          <p class="cookie-desc">
            Ce site utilise des <strong>cookies analytiques</strong> pour mesurer
            l'audience de manière anonyme. Aucune donnée personnelle n'est revendue.
            <br />
            <span class="cookie-detail">
              sessionStorage · sendBeacon · pas de fingerprinting
            </span>
          </p>
        </div>
        <div class="cookie-actions">
          <button class="cookie-btn accept" @click="accept">
            Accepter
          </button>
          <button class="cookie-btn refuse" @click="refuse">
            Refuser
          </button>
        </div>
      </div>
      <!-- Barre de progression style terminal -->
      <div class="cookie-progress" aria-hidden="true">
        <div class="cookie-progress-bar" :style="{ width: progressWidth + '%' }"></div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const emit = defineEmits(['consent'])

const visible = ref(false)
const progressWidth = ref(100)
let progressTimer = null
let autoCloseTimer = null

const COOKIE_KEY = 'cookie_consent'
const AUTO_CLOSE_SECONDS = 30

function getConsent() {
  return localStorage.getItem(COOKIE_KEY)
}

function accept() {
  localStorage.setItem(COOKIE_KEY, 'accepted')
  visible.value = false
  clearTimers()
  emit('consent', true)
}

function refuse() {
  localStorage.setItem(COOKIE_KEY, 'refused')
  visible.value = false
  clearTimers()
  emit('consent', false)
}

function clearTimers() {
  if (progressTimer) clearInterval(progressTimer)
  if (autoCloseTimer) clearTimeout(autoCloseTimer)
}

onMounted(() => {
  const consent = getConsent()

  if (consent === 'accepted') {
    emit('consent', true)
    return
  }

  if (consent === 'refused') {
    emit('consent', false)
    return
  }

  // Pas encore de choix → afficher le banner après un court délai
  setTimeout(() => {
    visible.value = true
    startProgressBar()
  }, 1500)
})

function startProgressBar() {
  const totalMs = AUTO_CLOSE_SECONDS * 1000
  const intervalMs = 50
  const decrement = (100 / totalMs) * intervalMs

  progressTimer = setInterval(() => {
    progressWidth.value = Math.max(0, progressWidth.value - decrement)
  }, intervalMs)

  // Auto-fermer sans choix = refuser par défaut (RGPD compliant)
  autoCloseTimer = setTimeout(() => {
    if (visible.value) {
      refuse()
    }
  }, totalMs)
}

onUnmounted(() => {
  clearTimers()
})
</script>

<style scoped>
.cookie-banner {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 10000;
  background: rgba(18, 18, 18, 0.96);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  color: #e0e0e0;
  font-family: 'JetBrains Mono', monospace;
}

.cookie-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.2rem 2rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.cookie-icon {
  font-size: 2rem;
  opacity: 0.6;
  flex-shrink: 0;
  animation: cookie-spin 8s linear infinite;
}

@keyframes cookie-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.cookie-text {
  flex: 1;
  min-width: 0;
}

.cookie-title {
  margin: 0 0 0.3rem 0;
  font-size: 0.85rem;
  font-weight: 600;
  color: #ffffff;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.cookie-desc {
  margin: 0;
  font-size: 0.75rem;
  line-height: 1.6;
  color: #b0b0b0;
  font-family: 'Inter', sans-serif;
}

.cookie-desc strong {
  color: #ffffff;
  font-weight: 600;
}

.cookie-detail {
  display: inline-block;
  margin-top: 0.2rem;
  font-size: 0.65rem;
  color: #777;
  font-family: 'JetBrains Mono', monospace;
  letter-spacing: 0.04em;
}

.cookie-actions {
  display: flex;
  gap: 0.8rem;
  flex-shrink: 0;
}

.cookie-btn {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.78rem;
  padding: 0.55rem 1.4rem;
  cursor: pointer;
  transition: all 0.25s ease;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  font-weight: 500;
}

.cookie-btn.accept {
  background: #ffffff;
  color: #111111;
  border: 1px solid #ffffff;
}

.cookie-btn.accept:hover {
  background: transparent;
  color: #ffffff;
}

.cookie-btn.refuse {
  background: transparent;
  color: #999;
  border: 1px solid #555;
}

.cookie-btn.refuse:hover {
  color: #ffffff;
  border-color: #999;
}

/* Barre de progression */
.cookie-progress {
  height: 2px;
  background: rgba(255, 255, 255, 0.05);
}

.cookie-progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #555, #fff);
  transition: width 0.05s linear;
}

/* Animation d'entrée/sortie */
.cookie-slide-enter-active {
  transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.5s ease;
}

.cookie-slide-leave-active {
  transition: transform 0.4s cubic-bezier(0.7, 0, 0.84, 0), opacity 0.3s ease;
}

.cookie-slide-enter-from {
  transform: translateY(100%);
  opacity: 0;
}

.cookie-slide-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

/* Mobile */
@media (max-width: 768px) {
  .cookie-inner {
    flex-direction: column;
    text-align: center;
    padding: 1rem 1.2rem;
    gap: 0.8rem;
  }

  .cookie-icon {
    font-size: 1.5rem;
  }

  .cookie-actions {
    width: 100%;
    justify-content: center;
  }

  .cookie-btn {
    flex: 1;
    max-width: 160px;
  }
}
</style>
