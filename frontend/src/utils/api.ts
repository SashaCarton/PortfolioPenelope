/**
 * Configuration de l'API
 * Gère automatiquement les URLs selon l'environnement (local/production)
 */

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.penelopeletienne.ovh';

export function getApiUrl(endpoint: string): string {
  const base = API_BASE_URL.replace(/\/$/, ''); // retire le trailing slash
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${base}${path}`;
}

export function getImageUrl(imagePath?: string): string {
  if (!imagePath) return '';
  if (imagePath.startsWith('http')) return imagePath;
  return getApiUrl(imagePath);
}
