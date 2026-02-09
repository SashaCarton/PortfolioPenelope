import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // Import du routeur
import { setupAnalytics } from './utils/analytics';

// En production, neutraliser certains console.* pour éviter les logs en live
if (import.meta.env && import.meta.env.PROD) {
  ['log', 'debug', 'info', 'warn'].forEach((m) => {
    (console as any)[m] = () => {};
  });
}

const app = createApp(App);
app.use(router);

// Initialiser le suivi analytique (désactivé automatiquement en dev)
setupAnalytics(router);

app.mount('#app');
