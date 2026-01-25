<template>
  <Transition name="fade">
    <!-- Le parent contrôle l'affichage via v-if ; ici on affiche toujours le contenu
         Le comportement plein écran est activable via la prop `fullScreen` -->
    <div :class="['loading-screen', { full: fullScreen }]">
      <button v-if="dismissible" class="dismiss-btn" @click="$emit('dismiss')" aria-label="Fermer le loader">✕</button>
      <div class="terminal-box">
        <pre class="typing-text">{{ displayedText }}<span class="cursor">▉</span></pre>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, onMounted, defineProps, defineEmits } from 'vue';

const props = defineProps({ fullScreen: { type: Boolean, default: false }, dismissible: { type: Boolean, default: false } });
const emit = defineEmits(['dismiss']);

const fullText = 'PENELOPE LETIENNE';
const displayedText = ref('');
let index = 0;
let hasFinishedFirstLoop = false;

const typeWriter = () => {
  if (index < fullText.length) {
    displayedText.value += fullText[index];
    index++;
    setTimeout(typeWriter, 80);
  } else {
    if (!hasFinishedFirstLoop) {
      hasFinishedFirstLoop = true;
      setTimeout(() => {
        // on garde l'animation en arrière-plan : le parent décide quand cacher le composant
      }, 300);
    } else {
      setTimeout(() => {
        displayedText.value = '';
        index = 0;
        typeWriter();
      }, 1000);
    }
  }
};

onMounted(() => {
  // démarre l'animation immédiatement (le parent montrera/cachera le composant)
  typeWriter();
});
</script>


<style scoped>
.loading-screen {
  /* overlay inline par défaut (confiné au parent si parent est position: relative) */
  position: absolute;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0,0,0,0.35);
  z-index: 999;
}

/* mode plein écran explicitement activé */
.loading-screen.full {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.95);
  z-index: 9999;
}

.terminal-box {
  background: rgba(0, 0, 0, 0.95);
  padding: 2rem 3rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 1.5rem;
  color: #ffffff;
  border-radius: 8px;
}


.typing-text {
  margin: 0;
  white-space: pre;
  text-align: left;
  font-family: 'JetBrains Mono', monospace;
  width: 18ch; /* fixe la largeur à 18 caractères pour PENELOPE LETIENNE */
}


.cursor {
  animation: blink 1s infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

/* Animation d'apparition */
.fade-enter-active {
  animation: fadeIn 0.5s ease-out;
}

.fade-leave-active {
  animation: fadeOut 0.5s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes fadeOut {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

.dismiss-btn {
  position: absolute;
  right: 10px;
  top: 10px;
  background: rgba(255,255,255,0.06);
  color: #fff;
  border: none;
  padding: 0.25rem 0.4rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.95rem;
}
.dismiss-btn:hover { background: rgba(255,255,255,0.12); }
</style>
