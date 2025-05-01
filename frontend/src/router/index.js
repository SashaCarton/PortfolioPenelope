import { createRouter, createWebHistory } from 'vue-router'
import About from '../views/About.vue'
import Projects from '../views/Projects.vue'
import Contact from '../views/Contact.vue'

const routes = [
    {
        path: '/',
        name: 'home',
        component: About,  // Page d'accueil (par exemple, "À propos")
    },
    {
        path: '/projects',
        name: 'projects',
        component: Projects,  // Page des projets
    },
    {
        path: '/contact',
        name: 'contact',
        component: Contact,  // Page de contact
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
