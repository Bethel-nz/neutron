self.addEventListener('push', function (event) {
	if (event.data) {
		const data = event.data.json()
		const options = {
			body: data.body,
			icon: '/android-chrome-512x512.png',
			badge: '/android-chrome-192x192.png',
			vibrate: [100, 50, 100],
			data: {
				dateOfArrival: Date.now(),
				primaryKey: '2',
			},
		}
		event.waitUntil(self.registration.showNotification(data.title, options))
	}
})

self.addEventListener('notificationclick', function (event) {
	event.notification.close()
	event.waitUntil(clients.openWindow('/'))
})

// Cache static assets
const CACHE_NAME = 'neutron-cache-v1'
const urlsToCache = [
	'/',
	'/manifest.webmanifest',
	'/android-chrome-192x192.png',
	'/android-chrome-512x512.png',
	'/apple-touch-icon.png',
	'/favicon-32x32.png',
	'/favicon-16x16.png',
	'/favicon.ico'
]

// Install event - cache core assets
self.addEventListener('install', (event) => {
	event.waitUntil(
		caches.open(CACHE_NAME)
			.then((cache) => cache.addAll(urlsToCache))
	)
	// Activate worker immediately
	self.skipWaiting()
})

// Activate event - cleanup old caches
self.addEventListener('activate', (event) => {
	event.waitUntil(
		caches.keys().then((cacheNames) => {
			return Promise.all(
				cacheNames
					.filter((name) => name !== CACHE_NAME)
					.map((name) => caches.delete(name))
			)
		})
	)
	// Ensure service worker takes control immediately
	self.clients.claim()
})

// Fetch event - network first, falling back to cache
self.addEventListener('fetch', (event) => {
	// Only handle GET requests
	if (event.request.method !== 'GET') return

	event.respondWith(
		fetch(event.request)
			.then((response) => {
				// Cache successful responses for future offline use
				if (response.ok) {
					const responseClone = response.clone()
					caches.open(CACHE_NAME).then((cache) => {
						cache.put(event.request, responseClone)
					})
				}
				return response
			})
			.catch(() => {
				// If network fails, try to get from cache
				return caches.match(event.request)
					.then((response) => {
						if (response) return response

						// If not in cache and offline, return offline page
						if (event.request.mode === 'navigate') {
							return caches.match('/')
						}
						return null
					})
			})
	)
}) 