<template>
  <Transition name="fade">
    <div v-if="isLoading" class="loading-screen">
      <div class="terminal-box">
        <pre class="typing-text">{{ displayedText }}<span class="cursor">▉</span></pre>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const isLoading = ref(true);
const fullText = 'PENELOPE LETIENNE';
const displayedText = ref('');
let index = 0;
let hasFinishedFirstLoop = false;

const typeWriter = () => {
  if (index < fullText.length) {
    displayedText.value += fullText[index];
    index++;
    setTimeout(typeWriter, 100);
  } else {
    if (!hasFinishedFirstLoop) {
      hasFinishedFirstLoop = true;
      setTimeout(() => {
        isLoading.value = false; // ✅ On cache l’écran seulement maintenant
      }, 500); // petite pause élégante avant disparition
    } else {
      // recommencer l'animation en boucle (optionnel)
      setTimeout(() => {
        displayedText.value = '';
        index = 0;
        typeWriter();
      }, 1200);
    }
  }
};

onMounted(() => {
  window.addEventListener('load', () => {
    typeWriter(); // on ne commence qu’une fois que tout est prêt
  });
});
</script>


<style scoped>
.loading-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: black;
  display: flex;
  justify-content: center;
  align-items: center;
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
</style>
