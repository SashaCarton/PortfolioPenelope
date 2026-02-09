<template>
  <section class="not-found">
    <div class="glitch-wrapper">
      <h1 class="glitch" data-text="404">404</h1>
    </div>

    <div class="ascii-art" aria-hidden="true">
      <pre>
   ¯\_(ツ)_/¯
      </pre>
    </div>

    <p class="message">
      Cette page s'est égarée quelque part entre deux pixels…
    </p>
    <p class="sub-message">
      Pas de panique — les meilleurs projets sont à portée de clic.
    </p>

    <div class="actions">
      <router-link to="/projects" class="cta-button">
        Découvrir les projets →
      </router-link>
      <router-link to="/" class="home-link">
        Retour à l'accueil
      </router-link>
    </div>

    <!-- Petites particules décoratives flottantes -->
    <div class="particles" aria-hidden="true">
      <span v-for="n in 12" :key="n" class="particle" :style="particleStyle(n)"></span>
    </div>
  </section>
</template>

<script setup>
function particleStyle(n) {
  const size = 2 + (n % 4) * 2;
  const left = ((n * 8.3) % 100);
  const delay = (n * 0.4) % 5;
  const duration = 6 + (n % 4) * 2;
  return {
    width: size + 'px',
    height: size + 'px',
    left: left + '%',
    animationDelay: delay + 's',
    animationDuration: duration + 's',
  };
}
</script>

<style scoped>
.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  /* 100vh moins le header (60px) et le footer (~110px) */
  min-height: calc(100vh - 170px);
  padding: 5rem 2rem 2rem;
  text-align: center;
  position: relative;
  overflow: hidden;
  background: #fff;
}

/* ---------- Glitch 404 ---------- */
.glitch-wrapper {
  margin-bottom: 0.5rem;
}

.glitch {
  font-family: 'JetBrains Mono', monospace;
  font-size: clamp(6rem, 18vw, 14rem);
  font-weight: 700;
  letter-spacing: -0.04em;
  color: #111;
  position: relative;
  line-height: 1;
  margin: 0;
}

.glitch::before,
.glitch::after {
  content: attr(data-text);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.glitch::before {
  color: #111;
  animation: glitch-shift 3s infinite linear alternate-reverse;
  clip-path: inset(0 0 60% 0);
  transform: translate(-2px, -1px);
  opacity: 0.7;
}

.glitch::after {
  color: #c8c8c8;
  animation: glitch-shift 2.5s infinite linear alternate;
  clip-path: inset(40% 0 0 0);
  transform: translate(2px, 1px);
  opacity: 0.6;
}

@keyframes glitch-shift {
  0%, 90%, 100% { transform: translate(0); }
  92% { transform: translate(-3px, 1px); }
  94% { transform: translate(2px, -1px); }
  96% { transform: translate(-1px, 2px); }
  98% { transform: translate(3px, -2px); }
}

/* ---------- ASCII Art ---------- */
.ascii-art pre {
  font-family: 'JetBrains Mono', monospace;
  font-size: clamp(1.2rem, 3vw, 2rem);
  color: #999;
  margin: 0.5rem 0 1.5rem;
  line-height: 1.2;
}

/* ---------- Messages ---------- */
.message {
  font-family: 'JetBrains Mono', monospace;
  font-size: clamp(1rem, 2.5vw, 1.35rem);
  color: #111;
  max-width: 500px;
  margin: 0 auto 0.5rem;
  font-weight: 500;
}

.sub-message {
  font-family: 'Inter', sans-serif;
  font-size: clamp(0.85rem, 1.8vw, 1rem);
  color: #666;
  max-width: 440px;
  margin: 0 auto 2.5rem;
}

/* ---------- Actions ---------- */
.actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.cta-button {
  display: inline-block;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.95rem;
  font-weight: 500;
  color: #fff;
  background: #111;
  padding: 0.85rem 2rem;
  text-decoration: none;
  letter-spacing: 0.02em;
  transition: background 0.25s, transform 0.2s;
  border: 1px solid #111;
}

.cta-button:hover {
  background: #333;
  transform: translateY(-2px);
}

.home-link {
  font-family: 'Inter', sans-serif;
  font-size: 0.85rem;
  color: #999;
  text-decoration: none;
  position: relative;
  transition: color 0.25s;
}

.home-link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 1px;
  background: #111;
  transition: width 0.3s ease;
}

.home-link:hover {
  color: #111;
}

.home-link:hover::after {
  width: 100%;
}

/* ---------- Particules flottantes ---------- */
.particles {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}

.particle {
  position: absolute;
  bottom: -10px;
  border-radius: 50%;
  background: #ddd;
  opacity: 0;
  animation: float-up linear infinite;
}

@keyframes float-up {
  0% {
    transform: translateY(0) scale(1);
    opacity: 0;
  }
  10% {
    opacity: 0.5;
  }
  90% {
    opacity: 0.3;
  }
  100% {
    transform: translateY(-100vh) scale(0.4);
    opacity: 0;
  }
}

/* Texte et boutons au-dessus des particules */
.glitch-wrapper,
.ascii-art,
.message,
.sub-message,
.actions {
  position: relative;
  z-index: 1;
}

/* ---------- Responsive ---------- */
@media (max-width: 600px) {
  .not-found {
    padding: 1.5rem 1rem;
  }

  .cta-button {
    width: 100%;
    max-width: 280px;
    text-align: center;
  }
}
</style>
