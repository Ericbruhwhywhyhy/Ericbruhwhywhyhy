self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('tetrio-dyn').then(function(cache) {
      return cache.addAll([
				'/',
                '/bootstrap.js',
                '/res/font/hun2.ttf',
                '/res/font/hun2-cheeky.ttf',
				'/js/tetrio.js',
				'/css/tetrio.css',
				'/sfx/tetrio.ogg',
				'https://raw.githubusercontent.com/Ericbruhwhywhyhy/Ericbruhwhywhyhy/main/ericsw.js',
				'/res/icon/error.svg'
			]);
    })
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method === 'POST') {
    return; // Never cache POST
  }
  if (event.request.url.indexOf('//tetr.io') === -1) {
    return; // Never cache non-TETR.IO resources
  }
  if (event.request.url.indexOf('/res/') > -1) {
    // Try cache first
    event.respondWith(
      caches.open('tetrio-dyn').then((cache) => {
        return cache.match(event.request).then((response) => {
          return response || fetch(event.request).then((response) => {
            if (response.ok) {
              cache.put(event.request, response.clone());
            }
            return response;
          });
        });
      })
    );
    return;
  }
  // Try network first
  event.respondWith(
    caches.open('tetrio-dyn').then((cache) => {
      return fetch(event.request).then((response) => {
        if (response.ok) {
          cache.put(event.request, response.clone());
        }
        return response;
      }).catch(function() {
        return caches.match(event.request);
      });
    })
  );
});
