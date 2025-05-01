<template>
    <section class="home">
        <!-- Skip link pour l'accessibilité -->
        <a href="#main-content" class="skip-link">Passer au contenu principal</a>

        <!-- Contenu principal -->
        <main id="main-content" class="home__main">
            <h1 class="home__title">
                Pénélope<br>
                <span class="home__lastname">Letienne</span>
            </h1>
            <p class="home__subtitle">Digital Design Student</p>

            <div class="home__arrow">↓</div>

            <div class="home__text">
                <p>
                    Now a digital design student at the ENSAAMA school of Paris since September,
                    I am currently looking for an internship in the world of new technologies
                    combined with creative techniques and knowledge.
                </p>
                <p>
                    Trained in fine arts for 9 years at the plastic arts school of Lens since 2012,
                    I then joined the ESAAT school of Roubaix in order to achieve a BAC STD2A
                    (applied art). At the same time, I worked on many digital projects, because
                    I am a fan of technologies, web, games, immersive experiences …
                </p>
            </div>

            <!-- Section « Derniers projets » -->
            <section class="home__projects">
                <h2>Derniers projets</h2>
                <div class="projects-grid">
                    <div v-for="project in projects" :key="project.id" class="project-item">
                        <img :src="`/assets/project${project.id}.jpg`" :alt="project.title" />
                        <p class="project-title">{{ project.title }}</p>
                        <p class="project-desc">{{ project.description }}</p>
                    </div>
                </div>
            </section>

            <!-- Réseaux & CV -->
            <div class="home__links">
                <a href="#" aria-label="WhatsApp">Whatsapp</a>
                <a href="#" aria-label="LinkedIn">LinkedIn</a>
                <a href="mailto:sashacarton2005@gmail.com" aria-label="Email">mail</a>
                <a href="#" aria-label="GitHub">GitHub</a>
                <a href="#" aria-label="Instagram">Instagram</a>
                <a href="/assets/CV_Pénélope_LETIENNE.pdf" class="btn-cv" download>
                    Télécharger le CV
                </a>
            </div>

            <div class="home__arrow home__arrow--bottom">↓</div>
        </main>
    </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const projects = ref([]);

onMounted(async () => {
    try {
        const response = await fetch('http://localhost:3000/api/projects');
        if (!response.ok) throw new Error('Erreur réseau');
        projects.value = await response.json();
    } catch (error) {
        console.error('Impossible de charger les projets :', error);
    }
});
</script>

<style scoped>
.home {
    position: relative;
    background: #fff;
    color: #6a4b8a;
    font-family: "Helvetica Neue", sans-serif;
    overflow: hidden;
}

/* Skip link invisible sauf au focus */
.skip-link {
    position: absolute;
    top: -40px;
    left: 1rem;
    background: #6a4b8a;
    color: #fff;
    padding: 0.5rem 1rem;
    text-decoration: none;
    z-index: 10;
    transition: top 0.3s;
}

.skip-link:focus {
    top: 1rem;
}

/* Contenu principal centré */
.home__main {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0 2rem 4rem;
    text-align: center;
}

.home__title {
    font-size: 4rem;
    font-weight: 300;
    margin: 0;
    line-height: 1;
    letter-spacing: 2px;
    text-transform: uppercase;
}

.home__lastname {
    font-weight: 700;
}

.home__subtitle {
    font-size: 1.125rem;
    font-weight: 300;
    margin: 1rem 0 2rem;
    text-transform: uppercase;
    opacity: 0.7;
    letter-spacing: 1px;
}

/* Flèche */
.home__arrow {
    font-size: 2rem;
    margin-bottom: 2rem;
    opacity: 0.5;
    animation: bounce 2s infinite;
}

.home__arrow--bottom {
    margin-top: 2rem;
}

/* Texte d’introduction */
.home__text {
    max-width: 600px;
}

.home__text p {
    margin: 1rem 0;
    font-size: 1rem;
    line-height: 1.6;
    font-weight: 300;
}

/* Section projets */
.home__projects {
    width: 100%;
    margin: 3rem 0;
}

.home__projects h2 {
    font-size: 1.5rem;
    font-weight: 300;
    margin-bottom: 1.5rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    opacity: 0.8;
}

.projects-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 2rem;
}

.project-item {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.project-item img {
    width: 100%;
    height: auto;
    object-fit: cover;
    border-radius: 4px;
}

.project-title {
    margin-top: 0.75rem;
    font-size: 0.875rem;
    font-weight: 300;
    text-align: center;
    opacity: 0.9;
}

.project-desc {
    font-size: 0.75rem;
    font-weight: 300;
    text-align: center;
    opacity: 0.7;
    margin-top: 0.3rem;
}

/* Réseaux sociaux & CV */
.home__links {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    justify-content: center;
    margin: 2rem 0;
}

.home__links a {
    font-size: 0.875rem;
    font-weight: 300;
    text-decoration: none;
    color: #6a4b8a;
    text-transform: uppercase;
    letter-spacing: 1px;
}

.btn-cv {
    border: 1px solid #6a4b8a;
    padding: 0.5rem 1rem;
    transition: background 0.3s, color 0.3s;
}

.btn-cv:hover {
    background: #6a4b8a;
    color: #fff;
}

/* Animation simple */
@keyframes bounce {

    0%,
    100% {
        transform: translateY(0)
    }

    50% {
        transform: translateY(10px)
    }
}

/* Responsive */
@media (max-width: 768px) {
    .home__main {
        padding: 0 1rem 3rem;
    }

    .home__title {
        font-size: 3rem;
    }

    .home__subtitle {
        font-size: 1rem;
    }

    .projects-grid {
        grid-template-columns: 1fr;
    }
}
</style>