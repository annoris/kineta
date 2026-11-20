/**
 * KINETA — Photographic Trail Assets & Lazy Preload Helper
 * Supplies real compressed editorial photos for the footer cursor image trail
 * and lazily warms the image cache on first hover of [data-image-trail].
 */

export const TRAIL_PHOTO_URLS = [
  './src/assets/images/featured-volt-yuzu.jpg',
  './src/assets/images/flavor-berry-pulse.jpg',
  './src/assets/images/featured-solar-mango.jpg',
  './src/assets/images/featured-night-drop.jpg',
  './src/assets/images/intro-polaroid-1.jpg',
  './src/assets/images/intro-polaroid-2.jpg',
];

/**
 * Returns the 6 compressed studio photograph URLs for the footer cursor trail.
 * @returns {string[]}
 */
export function createTrailAssetDataUrls() {
  return [...TRAIL_PHOTO_URLS];
}

/**
 * Lightweight lazy-preload helper: warms the 6 trail photos only when the user
 * first hovers over a [data-image-trail] zone.
 */
export function initCanvasArt() {
  const trailZones = document.querySelectorAll('[data-image-trail]');
  if (trailZones.length === 0) return;

  let preloaded = false;
  const warmTrailCache = () => {
    if (preloaded) return;
    preloaded = true;
    TRAIL_PHOTO_URLS.forEach((src) => {
      const img = new Image();
      img.decoding = 'async';
      img.src = src;
    });
  };

  trailZones.forEach((zone) => {
    zone.addEventListener('pointerenter', warmTrailCache, { once: true, passive: true });
  });
}
