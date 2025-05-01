<template>
  <div>
    <nav class="home__nav">
      <ul>
        <li><router-link to="/">Accueil</router-link></li>
        <li><router-link to="/about">À propos</router-link></li>
        <li><router-link to="/projects">Projets</router-link></li>
        <li><router-link to="/contact">Contact</router-link></li>
        <li><router-link to="/admin">Admin</router-link></li>
      </ul>
    </nav>

    <main>
      <router-view></router-view> <!-- C'est ici que les pages vont s'afficher -->
    </main>

    <footer>
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
  font-size: 0.875rem;
  font-weight: 300;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.home__nav a:hover {
  color: #4b306a;
  /* Violet plus foncé pour le survol */
  text-decoration: underline;
}

footer {
  background: #333;
  color: #fff;
  text-align: center;
  padding: 1rem;
  font-size: 0.875rem;
}
</style>
