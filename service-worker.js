const CACHE_NAME = 'mapasala-v1';

// Arquivos essenciais para funcionar offline
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-16.png',
  './icons/icon-32.png',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png',
  './icons/icon.svg',
  'https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&family=Sora:wght@400;500;600;700&display=swap'
];

// Instalação: faz cache de todos os assets essenciais
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS.map(url => new Request(url, { cache: 'reload' })))
        .catch(() => {
          // Se falhar em algum asset (ex: fonte offline), continua mesmo assim
          return cache.addAll(['./', './index.html', './manifest.json']);
        });
    }).then(() => self.skipWaiting())
  );
});

// Ativação: remove caches antigos
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

// Fetch: cache-first para assets locais, network-first para fontes externas
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Ignora requisições não-GET
  if (event.request.method !== 'GET') return;

  // Network-first para Google Fonts (para pegar atualizações)
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Cache-first para tudo mais (assets locais)
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        if (!response || response.status !== 200 || response.type === 'opaque') {
          return response;
        }
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        return response;
      });
    }).catch(() => {
      // Fallback para o index.html em caso de erro de navegação
      if (event.request.destination === 'document') {
        return caches.match('./index.html');
      }
    })
  );
});
