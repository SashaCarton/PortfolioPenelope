<template>
  <div v-if="isLoading" class="loading-screen">
    <div class="terminal-box">
      <pre class="typing-text">{{ displayedText }}<span class="cursor">▉</span></pre>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const isLoading = ref(true);
const fullText = 'PENELOPE LETIENNE';
const displayedText = ref('');
let index = 0;

// Fonction pour simuler la frappe
const typeWriter = () => {
  if (index < fullText.length) {
    displayedText.value += fullText[index];
    index++;
    setTimeout(typeWriter, 100);
  } else {
    setTimeout(() => {
      displayedText.value = '';
      index = 0;
      typeWriter(); // recommence la boucle
    }, 1200);
  }
};

onMounted(() => {
  typeWriter();
  window.addEventListener('load', () => {
    setTimeout(() => {
      isLoading.value = false;
    }, 1200); // optionnel : délai après le chargement
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
  background: rgba(20, 20, 20, 0.95);
  padding: 2rem 3rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 1.5rem;
  color: #ffffff;
  border-radius: 8px;
  min-width: 22ch; /* empêche le rétrécissement */
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
</style>
