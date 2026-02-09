/**
 * visite routes — inclut les routes CRUD standard + la route stats custom
 */
export default {
  routes: [
    {
      method: 'POST',
      path: '/visites',
      handler: 'visite.create',
      config: {
        // Route publique — pas besoin d'auth pour enregistrer une visite
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/visites/stats',
      handler: 'visite.stats',
      config: {
        // Protégée par Bearer token
        policies: [],
        middlewares: [],
      },
    },
  ],
};
