const CACHE_NAME = 'vico-ai-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './main.js',
  './App.js',
  './NotesView.js',
  './LinksView.js',
  './AnalysisView.js',
  './DiscoveryView.js',
  './ProfileView.js',
  './CalendarView.js',
  './ChatWidget.js',
  './PomodoroWidget.js',
  './manifest.json',
  './icon.png',
  'https://cdn.tailwindcss.com',
  'https://esm.sh/lucide-react@0.344.0?deps=react@18.2.0'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
    ))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => response || fetch(event.request))
  );
});
