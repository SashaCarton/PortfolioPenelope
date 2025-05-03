<template>
    <section class="home">
        <div ref="grid" class="grid-container">
            <div
            v-for="media in medias"
            :key="media.id"
            class="grid-item"
            >
            <img :src="media.url" :alt="media.alt" />
        </div>
    </div>
</section>
<div class="home__text">
    <div class="picture">
        <img src="/images/60F38FC4-A2B0-4AC5-87B4-33657F70F795_edi.avif" alt="Pénélope Letienne" />
    </div>
    <div class="text">
        <h1>Pénélope Letienne</h1>
        <p>Étudiante en design numérique à l'école ENSAAMA de Paris depuis septembre, je suis actuellement à la recherche d'un stage dans le monde des nouvelles technologies combinées aux techniques créatives et au savoir-faire.</p>
        <p>Formée aux beaux-arts pendant 9 ans à l'école des arts plastiques de Lens depuis 2012, j'ai ensuite rejoint l'école ESAAT de Roubaix afin d'obtenir un BAC STD2A (arts appliqués). En parallèle, j'ai travaillé sur de nombreux projets numériques, car je suis passionnée par les technologies, le web, les jeux, les expériences immersives...</p>
    </div>
</div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';

const medias = ref([]);
const grid = ref(null);

onMounted(async () => {
    try {
        // 1. Récupère les projets avec leurs médias
        const res = await fetch('http://localhost:1337/api/projets?populate[0]=Media');
        const { data: projets } = await res.json();
        
        // 2. Aplatit tous les médias et limite à 32 images
        const allMedias = projets.flatMap(p =>
        (p.Media || []).map(m => {
            const src = m.url || m.formats?.small?.url || '';
            const fullUrl = src.startsWith('http')
            ? src
            : `http://localhost:1337${src}`;
            return {
                id: `${p.id}-${m.id}`,
                url: fullUrl,
                alt: m.alternativeText || p.Titre || '',
            };
        })
        ).slice(0, 32);
        medias.value = allMedias;
        
        // 3. Attendre le rendu puis ajuster chaque grid-item
        await nextTick();
        const container = grid.value;
        const items = container.querySelectorAll('.grid-item');
        
        const setSpan = item => {
            const rowH = parseInt(getComputedStyle(container).getPropertyValue('grid-auto-rows'));
            const rowGap = parseInt(getComputedStyle(container).getPropertyValue('grid-row-gap'));
            const imgH = item.querySelector('img').getBoundingClientRect().height;
            const span = Math.ceil((imgH + rowGap) / (rowH + rowGap));
            item.style.gridRowEnd = `span ${span}`;
        };
        
        items.forEach(item => {
            const img = item.querySelector('img');
            // si déjà chargé
            if (img.complete) {
                setSpan(item);
            } else {
                img.addEventListener('load', () => setSpan(item));
            }
        });
    } catch (err) {
        console.error('Erreur chargement médias :', err);
    }
});
</script>

<style scoped>
.home__text {
    display: flex;
    flex-direction: row-reverse;
    justify-content: space-between;
    align-items: center;
    margin-top: 50px;
    padding: 0 2.5vw;
}
.home__text .text {
    width: 50%;
    padding: 0 2.5vw;
}
.home__text .text p {
    width: 50%;
    padding: 0 1.5vw;
    text-align: justify;
    line-height: 1.6;
    font-size: 1rem;
    color: #555;
    justify-self: center;
}
.home__text .text h1 {
    font-family: "Cormorant Garamond", serif;
    font-size: 10rem;
    font-weight: 400;   
}
.home__text .picture img {
    width: 60%;
    height: auto;
    border-radius: 4px;
}.home__text .picture  {
    width: 50%;
    height: auto;
}
.home {
    background-color:#000;
    margin-top:-100px;
    padding: 100px 0 100px 0;
}
h1 {
    font-size: 2.5rem;
    margin-bottom: 2rem;
    text-align: center;
    color: #333;
}

.grid-container {
    margin-top: 50px;
    display: grid;
    /* on définit une hauteur de ligne de base très petite */
    grid-auto-rows: 8px;
    grid-gap: 8px;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
}

@media (min-width: 1024px) {
    .grid-container {
        grid-template-columns: repeat(6, 1fr);
    }
}

.grid-item {
    overflow: hidden;
    border-radius: 4px;
    position: relative;
}

.grid-item img {
    width: 100px;
    height: 100px;
    display: block;
    object-fit: cover;
    align-self: center;
    justify-self: center;
    /* pour un effet léger de zoom au survol */
    transition: transform 0.3s ease;
}

.overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    color: #fff;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    opacity: 0;
    transition: opacity 0.3s ease;
}

.grid-item:hover .overlay {
    opacity: 1;
}

.overlay h3 {
    font-size: 1.2rem;
    text-align: center;
}

.overlay p {
    font-size: 0.9rem;
    text-align: center;
    margin-top: 0.5rem;
}
</style>
