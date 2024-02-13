const CACHE_NAME = `temperature-converter-v1`

// the install event pre-caches the initial resources
self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME)
    cache.addAll([
      '/',
      '/converter.js',
      '/converter.css'
    ])
  })())
})

self.addEventListener('fetch', event => {
  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME)

    // get the resource from the cache
    const cachedResponse = await cache.match(event.request)
    if (cachedResponse) {
      return cachedResponse
    } else {
      try {
        // if the resouce wasn't in the cache, try the network
        const fetchResponse = await fetch(event.request)

        // save the resource in the cache and return it
        cache.put(event.request, fetchResponse.clone())

        return fetchResponse
      } catch (error) {
        //  network failed
      }
    }
  })())
})

/*
The sw.js file will act as your PWA's service worker. The code listens to the install event and uses it to cache all resources the app needs to function: the start HTML page, the converter JavaScript file, and the converter CSS file.

The code also intercepts fetch events, which happen every time your app sends a request to the server, and applies a cache-first strategy. The service worker returns cached resources so your app can work offline, and if that fails attempts to download from the server.
*/