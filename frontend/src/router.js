import { createRouter, createWebHistory } from 'vue-router';
const routes = [
    {
        path: '/',
        name: 'Home',
        component: () => import('./views/Home.vue'),
    },
    {
        path: '/about',
        name: 'About',
        component: () => import('./views/About.vue'),
    },
    {
        path: '/contact',
        name: 'Contact',
        component: () => import('./views/Contact.vue'),
    },
    {
        path: '/admin',
        name: 'Admin',
        component: () => import('./views/Admin.vue'),
    },
    {
        path: '/projects',
        name: 'Projects',
        component: () => import('./views/Projects.vue'),
    },
    {
        path: '/projects/:id',
        name: 'ProjectDetails',
        component: () => import('./views/ProjectDetails.vue'),
        props: true,
    },
    {
        path: '/models',
        name: 'ModelsGallery',
        component: () => import('./views/ModelsGallery.vue'),
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('./views/Login.vue'),
    },
];
const router = createRouter({
    history: createWebHistory(),
    routes,
});
export default router;
