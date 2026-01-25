import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // Import du routeur

// En production, neutraliser certains console.* pour éviter les logs en live
if (import.meta.env && import.meta.env.PROD) {
  ['log', 'debug', 'info', 'warn'].forEach((m) => {
    (console as any)[m] = () => {};
  });
}

createApp(App).use(router).mount('#app');
