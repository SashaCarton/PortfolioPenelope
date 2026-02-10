/**
 * Custom route pour les statistiques de visites
 */
export default {
  routes: [
    {
      method: 'GET',
      path: '/visites/stats',
      handler: 'visite.stats',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
