// Service Worker mínimo para suportar a instalação do PWA
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Não fazemos cache de nada por padrão para não interferir com o Next.js,
  // apenas respondemos ao evento para que o navegador reconheça o PWA.
  return;
});
