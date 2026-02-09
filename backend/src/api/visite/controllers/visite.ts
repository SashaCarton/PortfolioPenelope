/**
 * visite controller — endpoint public pour enregistrer les visites
 * et endpoint protégé pour lire les stats.
 */
import { factories } from '@strapi/strapi';

// @ts-expect-error — types will be generated after first `strapi build`
export default factories.createCoreController('api::visite.visite', ({ strapi }) => ({
  // POST /api/visites — public, crée une visite
  async create(ctx) {
    // Strapi v5 peut placer le body dans différentes structures
    const raw = ctx.request.body;
    const body = raw?.data ?? raw;

    // Debug temporaire — à retirer après validation
    strapi.log.info(`[visite] raw body keys: ${JSON.stringify(Object.keys(raw || {}))}`);
    strapi.log.info(`[visite] resolved body: ${JSON.stringify(body)}`);

    if (!body?.page) {
      return ctx.badRequest('Le champ "page" est requis');
    }

    // Extraire l'IP pour la géolocalisation (optionnel, via headers proxy)
    const ip = ctx.request.headers['x-forwarded-for']
      || ctx.request.headers['x-real-ip']
      || ctx.request.ip;

    // Détecter device/browser/os côté serveur à partir du User-Agent
    const ua = body.userAgent || ctx.request.headers['user-agent'] || '';
    const device = detectDevice(ua);
    const browser = detectBrowser(ua);
    const os = detectOS(ua);

    // @ts-expect-error — type generated after strapi build
    const entry = await strapi.entityService.create('api::visite.visite', {
      data: {
        page: body.page,
        referrer: body.referrer || '',
        userAgent: ua.substring(0, 500), // limiter la taille
        language: body.language || '',
        screenWidth: body.screenWidth || null,
        screenHeight: body.screenHeight || null,
        device,
        browser,
        os,
        sessionId: body.sessionId || '',
        duration: body.duration || 0,
        lcp: body.lcp || null,
        fcp: body.fcp || null,
        cls: body.cls || null,
        ttfb: body.ttfb || null,
      },
    });

    ctx.status = 201;
    return { data: { id: entry.id } };
  },

  // GET /api/visites/stats — protégé (Bearer token), retourne les statistiques agrégées
  async stats(ctx) {
    const token = ctx.request.headers.authorization;
    if (!token) {
      return ctx.unauthorized('Token requis');
    }

    const days = parseInt(ctx.query.days as string) || 30;
    const since = new Date();
    since.setDate(since.getDate() - days);

    // @ts-expect-error — type generated after strapi build
    const entries = await strapi.entityService.findMany('api::visite.visite', {
      filters: {
        createdAt: { $gte: since.toISOString() },
      },
      sort: { createdAt: 'desc' },
      limit: 10000,
    });

    const visites = entries as any[];

    // Agrégations
    const totalVisites = visites.length;

    // Visites par jour
    const parJour: Record<string, number> = {};
    visites.forEach(v => {
      const jour = v.createdAt.substring(0, 10);
      parJour[jour] = (parJour[jour] || 0) + 1;
    });

    // Pages les plus visitées
    const parPage: Record<string, number> = {};
    visites.forEach(v => {
      parPage[v.page] = (parPage[v.page] || 0) + 1;
    });

    // Navigateurs
    const parBrowser: Record<string, number> = {};
    visites.forEach(v => {
      const b = v.browser || 'Inconnu';
      parBrowser[b] = (parBrowser[b] || 0) + 1;
    });

    // Appareils
    const parDevice: Record<string, number> = {};
    visites.forEach(v => {
      const d = v.device || 'unknown';
      parDevice[d] = (parDevice[d] || 0) + 1;
    });

    // OS
    const parOS: Record<string, number> = {};
    visites.forEach(v => {
      const o = v.os || 'Inconnu';
      parOS[o] = (parOS[o] || 0) + 1;
    });

    // Referrers
    const parReferrer: Record<string, number> = {};
    visites.forEach(v => {
      let ref = 'Direct';
      try { if (v.referrer) ref = new URL(v.referrer).hostname; } catch { /* ignore bad URLs */ }
      parReferrer[ref] = (parReferrer[ref] || 0) + 1;
    });

    // Performance moyenne (Web Vitals)
    const perfMetrics = visites.filter(v => v.lcp || v.fcp || v.cls || v.ttfb);
    const avg = (arr: number[]) => arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : null;

    const performance = {
      lcp: avg(perfMetrics.filter(v => v.lcp).map(v => v.lcp)),
      fcp: avg(perfMetrics.filter(v => v.fcp).map(v => v.fcp)),
      cls: avg(perfMetrics.filter(v => v.cls).map(v => v.cls)),
      ttfb: avg(perfMetrics.filter(v => v.ttfb).map(v => v.ttfb)),
      count: perfMetrics.length,
    };

    // Durée moyenne de session
    const durations = visites.filter(v => v.duration > 0).map(v => v.duration);
    const dureeMoyenne = avg(durations);

    // Sessions uniques
    const sessionsUniques = new Set(visites.filter(v => v.sessionId).map(v => v.sessionId)).size;

    return {
      data: {
        totalVisites,
        sessionsUniques,
        dureeMoyenne: dureeMoyenne ? Math.round(dureeMoyenne) : 0,
        parJour,
        parPage: Object.entries(parPage).sort((a, b) => b[1] - a[1]),
        parBrowser: Object.entries(parBrowser).sort((a, b) => b[1] - a[1]),
        parDevice: Object.entries(parDevice).sort((a, b) => b[1] - a[1]),
        parOS: Object.entries(parOS).sort((a, b) => b[1] - a[1]),
        parReferrer: Object.entries(parReferrer).sort((a, b) => b[1] - a[1]),
        performance,
        jours: days,
      },
    };
  },
}));

// --- Helpers de détection ---

function detectDevice(ua: string): string {
  if (/tablet|ipad/i.test(ua)) return 'tablet';
  if (/mobile|iphone|android.*mobile/i.test(ua)) return 'mobile';
  if (/android/i.test(ua)) return 'tablet';
  return 'desktop';
}

function detectBrowser(ua: string): string {
  if (/edg\//i.test(ua)) return 'Edge';
  if (/opr\/|opera/i.test(ua)) return 'Opera';
  if (/firefox/i.test(ua)) return 'Firefox';
  if (/chrome/i.test(ua)) return 'Chrome';
  if (/safari/i.test(ua)) return 'Safari';
  if (/msie|trident/i.test(ua)) return 'IE';
  return 'Autre';
}

function detectOS(ua: string): string {
  if (/windows/i.test(ua)) return 'Windows';
  if (/macintosh|mac os/i.test(ua)) return 'macOS';
  if (/linux/i.test(ua)) return 'Linux';
  if (/android/i.test(ua)) return 'Android';
  if (/iphone|ipad|ipod/i.test(ua)) return 'iOS';
  return 'Autre';
}
