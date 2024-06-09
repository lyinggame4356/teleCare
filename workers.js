const cacheName = 'my-cache';

const resourcesToCache = [
    'index.html',
    'add.html',
    'fetch.js',
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(cacheName)
        .then(cache => {
            return cache.addAll(resourcesToCache);
        })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
        .then(response => {
            if (response) {
                return response;
            }

            return fetch(event.request)
                .then(response => {
                    if (!response || response.status !== 200 ||response.type !== 'basic') {
                        return response;
                    }

                    const responseToCache = response.clone();

                    caches.open(cacheName)
                        .then(cache => {
                            cache.put(event, request, responseToCache);
                        });
                    return response;
                });
        })
    );
});
