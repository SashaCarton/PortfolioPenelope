/**
 * Utilitaire CDN image — utilise wsrv.nl (images.weserv.nl)
 * CDN gratuit, open-source, qui :
 *  - Convertit automatiquement en WebP/AVIF selon le navigateur
 *  - Redimensionne à la volée
 *  - Cache globalement via CDN (Cloudflare)
 *  - Aucun compte requis
 *
 * @see https://images.weserv.nl/docs/
 */

const CDN_BASE = 'https://images.weserv.nl/';

interface CdnImageOptions {
  /** Largeur souhaitée en pixels */
  width?: number;
  /** Hauteur souhaitée en pixels */
  height?: number;
  /** Qualité (1-100), défaut 80 */
  quality?: number;
  /** Format de sortie : auto détecte WebP/AVIF selon le navigateur */
  output?: 'auto' | 'webp' | 'avif' | 'png' | 'jpg';
  /** Mode de recadrage : cover (remplir), contain (contenir), fill */
  fit?: 'cover' | 'contain' | 'inside' | 'outside';
}

/**
 * Transforme une URL d'image en URL CDN optimisée.
 * Si l'URL est invalide ou locale, la retourne telle quelle.
 */
export function cdnImage(originalUrl: string | null | undefined, options: CdnImageOptions = {}): string {
  if (!originalUrl) return '/images/default-cover.jpg';

  // Ne pas proxifier les assets locaux (public/)
  if (originalUrl.startsWith('/') && !originalUrl.startsWith('//')) {
    return originalUrl;
  }

  // Ne pas proxifier les vidéos ou fichiers non-image
  const lowerUrl = originalUrl.toLowerCase();
  if (lowerUrl.match(/\.(mp4|webm|glb|gltf|mp3|wav|pdf)(\?|$)/)) {
    return originalUrl;
  }

  const {
    width,
    height,
    quality = 80,
    output = 'auto',
    fit = 'cover',
  } = options;

  const params = new URLSearchParams();

  // URL source
  params.set('url', originalUrl);

  // Dimensions
  if (width) params.set('w', String(width));
  if (height) params.set('h', String(height));

  // Qualité
  params.set('q', String(quality));

  // Fit mode
  params.set('fit', fit);

  // Format de sortie — 'auto' laisse le CDN choisir WebP/AVIF selon Accept header
  if (output === 'auto') {
    params.set('output', 'webp');   // WebP universellement supporté
  } else {
    params.set('output', output);
  }

  // Activer le flou progressif pour le chargement
  params.set('il', '');  // interlace/progressive

  return `${CDN_BASE}?${params.toString()}`;
}

/**
 * Helper spécifique pour les covers du carrousel Home (taille ~25vw)
 */
export function carouselCover(url: string | null | undefined): string {
  return cdnImage(url, { width: 600, height: 720, quality: 75, fit: 'cover' });
}

/**
 * Helper spécifique pour les vignettes de la grille Projects (taille ~33vw)
 */
export function projectThumbnail(url: string | null | undefined): string {
  return cdnImage(url, { width: 500, height: 600, quality: 75, fit: 'cover' });
}

/**
 * Helper pour les images pleine largeur (ProjectDetails cover)
 */
export function fullWidthImage(url: string | null | undefined): string {
  return cdnImage(url, { width: 1200, quality: 80, fit: 'inside' });
}

/**
 * Helper pour les images media dans ProjectDetails
 */
export function mediaImage(url: string | null | undefined): string {
  return cdnImage(url, { width: 900, quality: 80, fit: 'inside' });
}
