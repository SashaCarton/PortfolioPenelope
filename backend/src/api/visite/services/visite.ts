import { factories } from '@strapi/strapi';

// @ts-expect-error — types will be generated after first `strapi build`
export default factories.createCoreService('api::visite.visite');
