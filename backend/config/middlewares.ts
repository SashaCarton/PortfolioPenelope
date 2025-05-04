module.exports = [
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'frame-ancestors': ["*"], // Autorise toutes les origines
        },
      },
    },
  },
  {
    name: 'strapi::cors',
    config: {
      origin: '*', // Autorise toutes les origines
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      headers: '*',
      credentials: true,
    },
  },
  'strapi::poweredBy',
  'strapi::logger',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
