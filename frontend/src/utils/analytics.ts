/**
 * Tracker analytique léger et respectueux de la vie privée.
 * - Pas de cookies
 * - Pas de fingerprinting
 * - Session basée sur sessionStorage (disparaît en fermant l'onglet)
 * - Envoie page views + Web Vitals vers l'API Strapi
 *
 * ~2 KB minifié — zéro dépendance externe.
 */

const API_URL = 'https://api.penelopeletienne.ovh/api/visites';

// Session ID unique par onglet (pas de tracking cross-session)
function getSessionId(): string {
  let id = sessionStorage.getItem('_sid');
  if (!id) {
    id = Math.random().toString(36).substring(2) + Date.now().toString(36);
    sessionStorage.setItem('_sid', id);
  }
  return id;
}

// Timer pour mesurer la durée de visite
let pageEnteredAt = Date.now();

interface TrackData {
  page: string;
  referrer: string;
  language: string;
  screenWidth: number;
  screenHeight: number;
  sessionId: string;
  duration: number;
  // Web Vitals (optionnels, envoyés séparément)
  lcp?: number;
  fcp?: number;
  cls?: number;
  ttfb?: number;
}

/** Envoie les données au serveur via sendBeacon (non-bloquant) ou fetch */
function send(data: Partial<TrackData>): void {
  const payload = JSON.stringify({ data });

  // sendBeacon est préféré : ne bloque pas la navigation, fonctionne sur unload
  if (navigator.sendBeacon) {
    const blob = new Blob([payload], { type: 'application/json' });
    navigator.sendBeacon(API_URL, blob);
  } else {
    fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload,
      keepalive: true,
    }).catch(() => {}); // silencieux si erreur
  }
}

/** Enregistre une visite de page */
export function trackPageView(path: string): void {
  pageEnteredAt = Date.now();

  send({
    page: path,
    referrer: document.referrer || '',
    language: navigator.language || '',
    screenWidth: window.screen.width,
    screenHeight: window.screen.height,
    sessionId: getSessionId(),
    duration: 0,
  });
}

/** Envoie la durée de visite quand l'utilisateur quitte la page */
export function trackPageLeave(path: string): void {
  const duration = Math.round((Date.now() - pageEnteredAt) / 1000);
  if (duration < 1) return; // Ignorer les visites < 1s (bots, etc.)

  send({
    page: path,
    sessionId: getSessionId(),
    duration,
  });
}

/** Collecte et envoie les Web Vitals (LCP, FCP, CLS, TTFB) */
export function trackWebVitals(path: string): void {
  if (!('PerformanceObserver' in window)) return;

  const vitals: Partial<TrackData> = {
    page: path,
    sessionId: getSessionId(),
  };

  let sent = false;
  const trySend = () => {
    // Envoyer une seule fois quand on a au moins LCP ou FCP
    if (sent) return;
    if (vitals.lcp || vitals.fcp) {
      sent = true;
      send(vitals);
    }
  };

  // FCP (First Contentful Paint)
  try {
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      if (entries.length) {
        vitals.fcp = Math.round(entries[entries.length - 1].startTime);
        trySend();
      }
    }).observe({ type: 'paint', buffered: true });
  } catch {}

  // LCP (Largest Contentful Paint)
  try {
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      if (entries.length) {
        vitals.lcp = Math.round((entries[entries.length - 1] as any).startTime);
        trySend();
      }
    }).observe({ type: 'largest-contentful-paint', buffered: true });
  } catch {}

  // CLS (Cumulative Layout Shift)
  try {
    let clsValue = 0;
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!(entry as any).hadRecentInput) {
          clsValue += (entry as any).value;
        }
      }
      vitals.cls = Math.round(clsValue * 1000) / 1000;
    }).observe({ type: 'layout-shift', buffered: true });
  } catch {}

  // TTFB (Time to First Byte)
  try {
    const navEntries = performance.getEntriesByType('navigation');
    if (navEntries.length) {
      vitals.ttfb = Math.round((navEntries[0] as any).responseStart);
    }
  } catch {}

  // Fallback : envoyer après 10s même sans LCP
  setTimeout(() => {
    if (!sent) {
      sent = true;
      send(vitals);
    }
  }, 10000);
}

/**
 * Plugin Vue Router — s'attache au router pour tracker automatiquement.
 * Usage dans main.ts :
 *   import { setupAnalytics } from './utils/analytics'
 *   setupAnalytics(router)
 */
export function setupAnalytics(router: any): void {
  // Ne pas tracker en développement
  if (import.meta.env?.DEV) {
    console.log('[Analytics] Mode dev — tracking désactivé');
    return;
  }

  let currentPath = '';

  router.afterEach((to: any) => {
    // Envoyer la durée de la page précédente
    if (currentPath) {
      trackPageLeave(currentPath);
    }

    currentPath = to.path;
    trackPageView(currentPath);
  });

  // Tracker les Web Vitals sur la première page
  trackWebVitals(window.location.pathname);

  // Envoyer la durée quand l'utilisateur quitte le site
  window.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden' && currentPath) {
      trackPageLeave(currentPath);
    }
  });
}
