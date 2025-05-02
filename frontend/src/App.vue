<template>
  <div>
    <nav class="home__nav">
      <ul>
        <li><router-link to="/">Accueil</router-link></li>
        <li><router-link to="/about">À propos</router-link></li>
        <li><router-link to="/projects">Projets</router-link></li> <!-- Lien corrigé -->
        <li><router-link to="/contact">Contact</router-link></li>
        <li><router-link to="/admin">Admin</router-link></li>
      </ul>
    </nav>
    
    <main>
      <router-view></router-view> <!-- C'est ici que les pages vont s'afficher -->
    </main>
    
    <footer>
      <div class="home__links">
        <a href="https://www.linkedin.com/in/p%C3%A9n%C3%A9lope-letienne-5515852b0/" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">LinkedIn</a>
        <a href="mailto:sashacarton2005@gmail.com" aria-label="Email" rel="noopener noreferrer">Email</a>
        <a href="https://github.com/Penny0507" aria-label="GitHub" target="_blank" rel="noopener noreferrer">GitHub</a>
        <a href="https://www.instagram.com/penelope.ltn" aria-label="Instagram" target="_blank" rel="noopener noreferrer">Instagram</a>
        <a href="/assets/Cv.pdf" class="btn-cv" download>
          Télécharger le CV
        </a>
      </div>
      <p>&copy; 2023 Pénélope Letienne. Tous droits réservés.</p>
    </footer>
  </div>
</template>

<script setup>
import router from './router'
</script>

<style scoped>
/* Mini-menu interne */
.home__nav {
  text-align: center;
  margin: 2rem 0;
}

.home__nav ul {
  list-style: none;
  padding: 0;
  display: inline-flex;
  gap: 2rem;
}

.home__nav a {
  text-decoration: none;
  color: #6a4b8a;
  /* Violet élégant */
  font-size: 1rem;
  font-weight: 400;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.home__nav a:hover {
  color: #4b306a;
  /* Violet plus foncé pour le survol */
  text-decoration: none;
  transition: color 0.3s ease;
}

footer {
  color: #6a4b8a;
  text-align: center;
  padding: 1.5rem 0;
  font-size: 0.875rem;
  font-weight: 300;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  align-items: center;
}

footer p {
  margin: 0;
}

.btn-cv {
  border: 1px solid #6a4b8a;
  padding: 0.5rem 1rem;
}

.btn-cv:hover {
  background: #6a4b8a;
  color: #fff;
}

/* Réseaux sociaux & CV */
.home__links {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
  margin: 2rem 0;
  align-items: center;
}

.home__links a {
  font-size: 0.875rem;
  font-weight: 300;
  color: #6a4b8a;
  text-transform: uppercase;
  letter-spacing: 1px;
  text-decoration: none!important;
}
.home__links a:hover {
  color: #4b306a;
}

@keyframes slideFadeIn {
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

main {
  animation: slideFadeIn 1s ease-in-out;
}
</style>
