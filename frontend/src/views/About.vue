<template>
    <section class="about">
      <h1>Pénélope Letienne</h1>
      <p class="subtitle">Étudiante en design numérique — approche hybride de l’expérience, de la sensibilité et de la recherche</p>
      <div class="content">
        <!-- À propos de moi -->
        <section class="section-inner">
          <img
            class="about__img"
            src="/images/60F38FC4-A2B0-4AC5-87B4-33657F70F795_edi.avif"
            alt="Pénélope en atelier"
          />
          <div class="text-block">
            <h2>À propos de moi</h2>
            <p>
              Formée aux beaux‑arts pendant 9 ans à l'école des arts plastiques de Lens,
              j'ai ensuite rejoint l'école ESAAT de Roubaix pour obtenir un BAC STD2A
              (arts appliqués). En parallèle, j'ai travaillé sur de nombreux projets
              numériques, car je suis passionnée par les technologies, le web, les jeux,
              et les expériences immersives...
            </p>
            <p>
              Aujourd'hui étudiante en design numérique à l'école ENSAAMA de Paris depuis
              septembre, je suis à la recherche d'un stage alliant nouvelles technologies,
              créativité et savoir‑faire.
            </p>
          </div>
        </section>
  
        <!-- À propos de mes études -->
        <section class="section-inner reverse">
          <img
            class="about__img"
            src="/images/expo pixel.avif"
            alt="Travail étudiant en design numérique"
          />
          <div class="text-block">
            <h2>MES ÉTUDES</h2>
            <p>
              Issu du graphisme numérique, ce cursus vise à former les étudiants à la
              création-conception et à la production d'environnements numériques, liés à :
            </p>
            <ul>
              <li>Motion design vidéo 2D/3D</li>
              <li>Web documentaires</li>
              <li>Interfaces graphiques pour sites web et applis mobiles</li>
              <li>Objets connectés, serious games et e‑learning</li>
              <li>Installations multimédia, mapping, etc.</li>
            </ul>
          </div>
        </section>
  
        <!-- À propos de mes loisirs -->
        <section class="section-inner">
          <img
            class="about__img"
            src="/images/scoutisme.avif"
            alt="Loisirs créatifs"
          />
          <div class="text-block">
            <h2>À propos de mes loisirs</h2>
            <p>
              On me décrit souvent comme ambitieuse, débrouillarde et très curieuse. J'aime
              toucher à tout, traditionnel ou numérique, et m'instruire en cinéma, mode,
              pop‑culture, science, histoire...
            </p>
            <p>
              Scout pendant 8 ans, je suis très indépendante mais j'aime aussi œuvrer en
              équipe.
            </p>
            <p>
              J'adore apprendre : j'ai suivi des cours de japonais, modélisation 3D et couture
              en dehors de la scolarité.
            </p>
          </div>
        </section>
      </div>
    </section>
  </template>
  
  <script setup>
  // Suppression de la logique de chargement
  </script>
  
  <style scoped>
  .about {
    max-width: 1000px;
    margin: 0 auto;
    padding: 4rem 2rem;
    background: #fff;
    color: #333;
    font-family: 'Montserrat', sans-serif;
    animation: fadeIn 0.8s ease-in-out;
  }
  
  .about h1 {
    font-family: 'Cormorant Garamond', serif;
    font-size: 3rem;
    font-weight: 400;
    text-align: center;
    color: #2f2f2f;
    margin-bottom: 0.5rem;
    text-transform: uppercase;
    letter-spacing: 2px;
  }
  
  .subtitle {
    text-align: center;
    font-size: 1rem;
    font-style: italic;
    color: #555;
    margin-bottom: 3rem;
    opacity: 0.8;
  }
  
  .content {
    display: flex;
    flex-direction: column;
    gap: 3rem;
  }
  
  .section-inner {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    align-items: center;
  }
  
  .section-inner.reverse {
    direction: rtl;
  }
  .section-inner.reverse .text-block {
    direction: ltr;
  }
  
  .about__img {
    width: 100%;
    height: auto;
    object-fit: cover;
    border-radius: 6px;
  }
  
  .text-block h2 {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.8rem;
    color: #2f2f2f;
    margin-bottom: 1rem;
    border-bottom: 2px solid #000;
    padding-bottom: 0.5rem;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
  
  .text-block p {
    line-height: 1.6;
    margin-bottom: 1rem;
    font-weight: 300;
  }
  
  .text-block ul {
    list-style: none;
    padding: 0;
    margin: 1rem 0;
  }
  
  .text-block li {
    position: relative;
    padding-left: 1.5rem;
    margin-bottom: 0.6rem;
    font-weight: 300;
  }
  
  .text-block li::before {
    content: '•';
    position: absolute;
    left: 0;
    top: 0;
    color: #6a4b8a;
    font-size: 1.2rem;
    line-height: 1;
  }
  
  @media (max-width: 768px) {
    .section-inner {
      grid-template-columns: 1fr;
    }
    .about {
      padding: 2rem 1rem;
      background-color: #f2eee9;
    }
    .about h1 {
      font-size: 2.5rem;
    }
    .text-block h2 {
      font-size: 1.5rem;
    }
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  </style>
