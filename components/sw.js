const CACHE_NAME = 'vico-ai-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './main.js',
  './App.js',
  './manifest.json',
  './icon.png',
  'https://cdn.tailwindcss.com',
  'https://esm.sh/lucide-react@0.344.0?deps=react@18.2.0'
];

// Instalación: Guardar archivos en caché
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Activación: Limpiar cachés antiguas
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
});

// Estrategia: Cache First, luego Red
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
