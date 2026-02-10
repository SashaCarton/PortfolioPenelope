import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
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
        path: '/login',
        name: 'Login',
        component: () => import('./views/Login.vue'),
    },
    {
        path: '/analytics',
        name: 'Analytics',
        component: () => import('./views/Analytics.vue'),
    },
    // Redirect old gallery route to Projects
    {
        path: '/models',
        redirect: '/projects'
    },
    // 404 catch-all — doit rester en dernier
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () => import('./views/NotFound.vue'),
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
