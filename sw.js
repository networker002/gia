
const CACHE_NAME = 'docs-app-v1';
// Список файлов, которые приложение сохранит в память телефона
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// Установка сервис-воркера и кэширование файлов
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// Активация и удаление старых версий кэша, если ты обновишь код
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
});

// Стратегия: Сначала пытаемся взять свежий файл из сети. 
// Если интернета нет или сеть лежит — выдаем файл из памяти телефона (офлайн-режим).
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});