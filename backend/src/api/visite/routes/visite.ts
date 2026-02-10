/**
 * visite routes — core router avec auth désactivée sur create
 */
import { factories } from '@strapi/strapi';

// @ts-expect-error — type generated after strapi build
export default factories.createCoreRouter('api::visite.visite', {
  config: {
    create: {
      auth: false,
    },
  },
});
