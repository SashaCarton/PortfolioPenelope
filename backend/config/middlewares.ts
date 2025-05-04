module.exports = [
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'frame-ancestors': [
            "'self'",
            'https://api.penelopeletienne.ovh',
            'https://penelopeletienne.ovh',
            'http://localhost:5173',
          ],
        },
      },
    },
  },
  {
    name: 'strapi::cors',
    config: {
      origin: [
        'https://api.penelopeletienne.ovh',
        'https://penelopeletienne.ovh',
        'http://localhost:5173',
      ],
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
