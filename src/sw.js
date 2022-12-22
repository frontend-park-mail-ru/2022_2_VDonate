/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
const CACHE_NAME = 'vdonate-static-cache-v1';
const CACHE_URLS = [];

console.log('Service worker is running');
/**
 * @description: There we are want to cache all the static files.
 * @param event - install event
 * @returns {Promise<void>} - nothing
 */
self.addEventListener('install', (event) => {
  event.waitUntil(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.addAll(CACHE_URLS);
      }),
  );
});

/**
 * @description: Delete old caches
 * @param event - activate event
 * @returns {Promise<void>} - nothing
 */
self.addEventListener('activate', (event) => {
  event.waitUntil(enableNavigationPreload());
});

/**
 * @description: If no connection, then we will fetch the
 *               static files from cache.
 * @param event - fetch request
 */
self.addEventListener('fetch', (request) => {
  if (request.method !== 'GET') {
    return false;
  }
  request.respondWith(
      cacheFirst({
        request: request.request,
        preloadResponseProm: request.preloadResponse,
      }),
  );
  return true;
});

/**
 * @description: Cache first strategy
 * @param request - request to cache
 * @returns {Promise<Response>} - cached response or network response
 */
const cacheFirst = async ({request, preloadResponseProm}) => {
  // Firstly trying to get the response from cache
  const cachedResponse = await caches.match(request);
  if (cachedResponse && !navigator.onLine) {
    return cachedResponse;
  }

  // Trying to get the response from preload
  const preloadResponse = await preloadResponseProm;
  if (preloadResponse) {
    void putInCache(request, preloadResponse.clone());
    return preloadResponse;
  }

  // If there is no response in cache and preloaded response
  // then we are trying to get it from network
  try {
    const networkResponse = await fetch(request);
    void putInCache(request, networkResponse.clone());
    return networkResponse;
  } catch (err) {
    return new Response('No internet connection', {
      status: 408,
      statusText: 'No internet connection',
    });
  }
};

const putInCache = async (request, response) => {
  const cache = await caches.open(CACHE_NAME);
  await cache.put(request, response);
};

const enableNavigationPreload = async () => {
  if (self.registration.navigationPreload) {
    // Enable navigation preloads!
    await self.registration.navigationPreload.enable();
  }
};
