module.exports = [
  'strapi::logger',
  'strapi::errors',

  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        directives: {
          "default-src": ["'self'"],
          "script-src": ["'self'", "'unsafe-inline'"],
          "style-src": ["'self'", "'unsafe-inline'", "https:"],
          "img-src": ["'self'", "data:", "blob:"],
          "media-src": ["'self'", "data:", "blob:"],
          "connect-src": [
            "'self'",
            "https:",
            "http:",
            "ws:",
            "http://penelopeletienne.ovh",
            "https://penelopeletienne.ovh",
            "http://api.penelopeletienne.ovh",
            "https://api.penelopeletienne.ovh",
            "http://api.penelopeletienne.ovh:1338",
            "https://api.penelopeletienne.ovh:1338",
            "http://api.penelopeletienne.ovh:80",
            "http://localhost:5173",
            "https://portfolio-penelope-9tyg.vercel.app",
          ],
          "font-src": ["'self'", "https:", "data:"],
          "object-src": ["'none'"],
          "base-uri": ["'self'"],
          "form-action": ["'self'"],
          "script-src-attr": ["'none'"],
          "frame-ancestors": [
            "'self'",
            "https://penelopeletienne.ovh",
            "http://penelopeletienne.ovh",
            "http://localhost:5173",
            "https://api.penelopeletienne.ovh",
            "https://portfolio-penelope-9tyg.vercel.app"
          ],
        },
      },
    },
  },

  {
    name: 'strapi::cors',
    config: {
      origin: [
        'http://penelopeletienne.ovh',
        'https://penelopeletienne.ovh',
        'http://localhost:5173',
        'https://api.penelopeletienne.ovh',
        'http://api.penelopeletienne.ovh',
        'http://api.penelopeletienne.ovh:1338',
        'https://api.penelopeletienne.ovh:1338',
        'http://api.penelopeletienne.ovh:80',
        'https://portfolio-penelope-9tyg.vercel.app',
        /https:\/\/.*\.vercel\.app/,
      ],
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      headers: ['Content-Type', 'Authorization'],
      keepHeaderOnError: false,
    },
  },

  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
