<template>
    <section class="about">
        <h1>Pénélope Letienne</h1>
        <p class="subtitle">Graphiste & illustratrice indépendante</p>

        <div class="content">
            <!-- Section « À propos de moi » -->
            <section>
                <div class="section-inner">
                    <img class="about__img" src="/images/60F38FC4-A2B0-4AC5-87B4-33657F70F795_edi.avif"
                        alt="Pénélope en atelier" />
                    <div class="text-block">
                        <h2>À propos de moi</h2>
                        <p>
                            Formée aux beaux-arts pendant 9 ans à l'école des arts plastiques de
                            Lens, j'ai ensuite rejoint l'école ESAAT de Roubaix pour obtenir
                            un BAC STD2A (arts appliqués). En parallèle, j'ai travaillé sur de
                            nombreux projets numériques, car je suis passionnée par les
                            technologies, le web, les jeux, et les expériences immersives...
                        </p>
                        <p>
                            Aujourd'hui étudiante en design numérique à l'école ENSAAMA de
                            Paris depuis septembre, je suis actuellement à la recherche d'un
                            stage dans le monde des nouvelles technologies combinées aux
                            techniques créatives et au savoir-faire.
                        </p>
                    </div>
                </div>
            </section>

            <!-- Section « À propos de mes études » -->
            <section>
                <div class="section-inner">
                    <img class="about__img" src="/images/expo pixel.avif" alt="Travail étudiant en design numérique" />
                    <div class="text-block">
                        <h2>À propos de mes études</h2>
                        <p>
                            Issu du graphisme numérique, ce cursus vise à former les étudiants
                            à la création-conception et à la production d'environnements
                            numériques, liés à :
                        </p>
                        <ul>
                            <li>Motion design vidéo 2D/3D</li>
                            <li>Web documentaires</li>
                            <li>Interfaces graphiques pour sites web et applis mobiles</li>
                            <li>Objets connectés, serious games et e-learning</li>
                            <li>Installations multimédia, mapping, etc.</li>
                        </ul>
                    </div>
                </div>
            </section>

            <!-- Section « À propos de mes loisirs » -->
            <section>
                <div class="section-inner">
                    <img class="about__img" src="/images/scoutisme.avif" alt="Loisirs créatifs" />
                    <div class="text-block">
                        <h2>À propos de mes loisirs</h2>
                        <p>
                            On me décrit souvent comme ambitieuse, débrouillarde et très
                            curieuse. J'aime toucher à tout, aussi bien traditionnel que
                            numérique, et m'instruire, que ce soit en cinéma, mode, pop culture,
                            science, histoire...
                        </p>
                        <p>
                            Scout pendant 8 ans, je suis très indépendante mais j'aime travailler
                            en unité avec un groupe.
                        </p>
                        <p>
                            J'adore apprendre : j'ai parfois pris des cours particuliers en
                            dehors des cours, notamment en japonais, modélisation 3D et couture.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    </section>
</template>

<script setup>
// pas de logique nécessaire
</script>

<style scoped>
.about {
    max-width: 900px;
    margin: 0 auto;
    padding: 4rem 2rem;
    background: #fff;
    color: #6a4b8a;
    font-family: "Helvetica Neue", sans-serif;
}

/* Titre et sous-titre */
.about h1 {
    font-size: 3rem;
    font-weight: 300;
    margin-bottom: 0.5rem;
    text-transform: uppercase;
    letter-spacing: 2px;
}

.subtitle {
    font-size: 1rem;
    font-weight: 300;
    text-transform: uppercase;
    opacity: 0.7;
    margin-bottom: 3rem;
    letter-spacing: 1px;
}

/* Contenu : chaque section avec image + texte */
.section-inner {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    align-items: start;
    margin-bottom: 4rem;
}

.about__img {
    width: 100%;
    height: auto;
    object-fit: cover;
    border-radius: 4px;
}

.text-block h2 {
    font-size: 1.5rem;
    font-weight: 300;
    margin-bottom: 1rem;
    border-bottom: 1px solid #d6b8e8;
    padding-bottom: 0.3rem;
    text-transform: uppercase;
    letter-spacing: 1px;
}

.text-block p {
    font-size: 1rem;
    line-height: 1.6;
    font-weight: 300;
    margin: 1rem 0;
}

.text-block ul {
    list-style: none;
    padding: 0;
    margin: 1rem 0;
}

.text-block li {
    position: relative;
    padding-left: 1.5rem;
    margin-bottom: 0.8rem;
    font-weight: 300;
}

.text-block li::before {
    content: "•";
    position: absolute;
    left: 0;
    top: 0;
    font-size: 1.2rem;
    line-height: 1;
    color: #6a4b8a;
    opacity: 0.8;
}

/* Footer épuré */
footer {
    text-align: center;
    font-size: 0.75rem;
    font-weight: 300;
    opacity: 0.6;
    border-top: 1px solid #f1ebf7;
    padding-top: 1.5rem;
}

/* Responsive : empilement sur petits écrans */
@media (max-width: 768px) {
    .section-inner {
        grid-template-columns: 1fr;
        gap: 1.5rem;
    }

    .about {
        padding: 2rem 1rem;
    }

    .about h1 {
        font-size: 2.5rem;
    }

    .text-block h2 {
        font-size: 1.3rem;
    }
}
</style>