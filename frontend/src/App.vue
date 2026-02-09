<template>
  <div>
    <div :class="['app-container', currentPage]">
      <header class="header" :class="currentPage">
        <nav class="nav">
          <div class="menu-burger">
            <button @click="toggleMenu" class="burger-button">☰</button>
            <transition name="menu-fade">
              <div v-if="menuOpen" class="menu-overlay">
                <button @click="closeMenu" class="close-button">✖</button>
                <ul class="menu-list">
                  <li><div><router-link to="/" @click="closeMenu">Accueil</router-link></div></li>
                  <li><div><router-link to="/about" @click="closeMenu">À propos</router-link></div></li>
                  <li><div><router-link to="/projects" @click="closeMenu">Projets</router-link></div></li>

                  <li><div><router-link to="/contact" @click="closeMenu">Contact</router-link></div></li>
                </ul>
              </div>
            </transition>
          </div>
          <div class="center-title cormorant-garamond-title">
            <router-link to="/">PÉNÉLOPE LETIENNE</router-link>
          </div>
          <div class="contact-link">
            <router-link to="/contact">CONTACT</router-link>
          </div>
        </nav>
      </header>
      <main>
        <router-view />
      </main>
      <footer class="footer">
        <ul class="footer-links">
          <li class="desktop-only"><router-link to="/about">À propos</router-link></li>
          <li class="desktop-only"><router-link to="/projects">Projets</router-link></li>

          <li class="desktop-only"><router-link to="/contact">Contact</router-link></li>
          <li class="desktop-only"><a href="https://www.linkedin.com/in/p%C3%A9n%C3%A9lope-letienne-5515852b0/" target="_blank">LinkedIn</a></li>
          <li class="desktop-only"><a href="https://github.com" target="_blank">GitHub</a></li>
          <a href="/assets/CV_Pénélope_Letienne.pdf" download class="download-cv-button">Télécharger mon CV</a>
        </ul>
        <p>&copy; 2025 Pénélope Letienne. Tous droits réservés.</p>
      </footer>
    </div>
    <!-- Cookie Consent Banner -->
    <CookieBanner @consent="onCookieConsent" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import CookieBanner from './components/CookieBanner.vue'

const menuOpen = ref(false)

function toggleMenu() {
  menuOpen.value = !menuOpen.value
}

function closeMenu() {
  menuOpen.value = false
}

function onCookieConsent(accepted) {
  // Stocke l'état dans une variable globale accessible par le tracker
  window.__cookieConsent = accepted
  // Dispatch un événement custom pour que le tracker puisse réagir
  window.dispatchEvent(new CustomEvent('cookie-consent', { detail: { accepted } }))
}
</script>

<style scoped>
body {
  margin: 0;
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  color: #111111;
  background-color: #fff;
}

.header {
  position: fixed;
  top: 0;
  width: 95vw;
  z-index: 1000;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2.5vw;
  height: 60px;
  background-color: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-family: var(--font-mono);
  width: 100%;
  position: relative;
  height: 100%;
}

.menu-burger {
  position: relative;
}

.menu-burger a {
  text-decoration: none;
  color: #000000;
  font-size: 1.5rem;
}

.burger-button {
  background: none;
  border: none;
  font-size: 1.6rem;
  cursor: pointer;
  color: #000000;
}

.menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  padding: 4rem 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.80);
  backdrop-filter: blur(25px);
  -webkit-backdrop-filter: blur(15px);
  z-index: 9999;
  transition: all 0.3s ease-in-out;
}

.close-button {
  position: absolute;
  left: 0;
  top: 13.5px;
  padding: 0 3vw;
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #000000;
  cursor: pointer;
}

.menu-list {
  list-style: none;
  font-family: 'JetBrains Mono', monospace;
  padding: 0;
  margin: 0;
  left: 10%;
  top: 20%;
  position: absolute;
  text-align: left;
}

.menu-list li {
  margin: 2rem 0;
}

.menu-list li a {
  text-decoration: none;
  color: #000000;
  font-size: 3rem;
  font-weight: 300;
  text-transform: uppercase;
  display: inline-block;
  text-align: left;
  position: relative;
}

.menu-list li a::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 0;
  height: 3px;
  background: #000000;
  transition: width 0.3s ease-in-out;
}

.menu-list li a:hover::after {
  width: 100%;
}

.center-title {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  font-family: var(--font-mono);
  font-size: 1rem;
  letter-spacing: 0.04em;
  color: #000000;
  white-space: nowrap;
}

.center-title a {
  text-decoration: none;
  color: inherit;
  font-size: 1.1rem;
}

.contact-link {
  font-size: 1rem;
  font-weight: 500;
}

.contact-link a {
  text-decoration: none;
  color: #000000;
  padding: 0.5rem 1rem;
  transition: all;
  cursor: pointer;
  font-family: 'JetBrains Mono', monospace;
}

main {
  padding-top: 0px;
}

.footer {
  background: #c8c8c8;
  color: #000000;
  padding: 1rem 0;
  text-align: center;
  font-size: 0.800rem;
}

.footer-links {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
  align-items: center;
  padding: 0;
}

.footer-links li {
  margin: 0;
}

.footer-links a {
  color: #000000;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.75rem;
  transition: color 0.3s ease;
}

.footer-links a:hover {
  color: #ffffff;
}

.download-cv-button {
  border: 1px solid #000000;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  align-self: center;
  justify-content: center;
}

.download-cv-button:hover {
  background: rgb(0, 0, 0);
  color: #ffffff;
}

@media (max-width: 768px) {
  .contact-link {
    display: none;
  }

  .desktop-only {
    display: none;
  }

  .footer-links {
    justify-content: center;
  }

  .download-cv-button {
    margin: 0 auto;
  }

  .menu-burger {
    display: block;
  }
  
  .menu-overlay {
    padding: 1rem;
  }
  
  .menu-list li {
    margin: 1.5rem 0;
  }
  
  .menu-list li a {
    font-size: 2rem;
    width: 50%;
  }
  
  .close-button {
    font-size: 1.2rem;
  }
}

@media (max-width: 480px) {
  .menu-list li a {
    font-size: 1.5rem;
    width: 100%;
  }
  
  .menu-overlay {
    padding: 0.5rem;
  }
  
  .close-button {
    font-size: 1rem;
  }
}

.menu-fade-enter-active,
.menu-fade-leave-active {
  transition: opacity 0.5s;
}

.menu-fade-enter-from,
.menu-fade-leave-to {
  opacity: 0;
}

.cormorant-garamond-title {
  font-family: 'JetBrains Mono', monospace;
  font-optical-sizing: auto;
  font-weight: 500;
  font-style: normal;
}
</style>