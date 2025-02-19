// Define versions and constants at the top
const VERSION = '1.0.0';
const CACHE_NAME = `neutron-cache-v${VERSION}`;
const OFFLINE_URL = '/offline.html';
const API_CACHE_NAME = `neutron-api-cache-v${VERSION}`;

const STATIC_ASSETS = [
	'/',
	'/manifest.webmanifest',
	'/android-chrome-192x192.png',
	'/android-chrome-512x512.png',
	'/apple-touch-icon.png',
	'/favicon-32x32.png',
	'/favicon-16x16.png',
	'/favicon.ico',
	OFFLINE_URL,
];

// Separate API and static asset caching strategies
const cacheFirst = async (request) => {
	const cache = await caches.match(request);
	return cache || fetch(request);
};

const networkFirst = async (request) => {
	try {
		const response = await fetch(request);
		if (response.ok) {
			const cache = await caches.open(API_CACHE_NAME);
			cache.put(request, response.clone());
		}
		return response;
	} catch (error) {
		const cache = await caches.match(request);
		return cache || Response.error();
	}
};

// Enhanced install event
self.addEventListener('install', (event) => {
	event.waitUntil(
		Promise.all([
			caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS)),
			caches.open(API_CACHE_NAME),
		]).then(() => self.skipWaiting())
	);
});

// Enhanced activate event with better cache cleanup
self.addEventListener('activate', (event) => {
	event.waitUntil(
		Promise.all([
			caches.keys().then((keys) =>
				Promise.all(
					keys
						.filter(
							(key) =>
								key.startsWith('neutron-') &&
								![CACHE_NAME, API_CACHE_NAME].includes(key)
						)
						.map((key) => caches.delete(key))
				)
			),
			self.clients.claim(),
		])
	);
});

// Enhanced fetch event with different strategies for different requests
self.addEventListener('fetch', (event) => {
	const { request } = event;

	// Ignore non-GET requests
	if (request.method !== 'GET') return;

	// Parse the URL
	const url = new URL(request.url);

	// Different caching strategies based on request type
	if (request.mode === 'navigate') {
		// Navigation requests
		event.respondWith(networkFirst(request));
	} else if (request.destination === 'image' ||
		request.destination === 'font' ||
		request.destination === 'style') {
		// Static assets
		event.respondWith(cacheFirst(request));
	} else if (url.pathname.startsWith('/api/')) {
		// API requests
		event.respondWith(networkFirst(request));
	} else {
		// Other requests
		event.respondWith(networkFirst(request));
	}
});

// Enhanced push notification handling
self.addEventListener('push', (event) => {
	if (!event.data) return;

	try {
		const data = event.data.json();
		const options = {
			body: data.body,
			icon: '/android-chrome-512x512.png',
			badge: '/android-chrome-192x192.png',
			vibrate: [100, 50, 100],
			data: {
				dateOfArrival: Date.now(),
				primaryKey: data.id || '1',
				url: data.url || '/',
			},
			actions: [
				{
					action: 'open',
					title: 'Open',
				},
				{
					action: 'close',
					title: 'Close',
				},
			],
		};

		event.waitUntil(
			self.registration.showNotification(data.title, options)
		);
	} catch (error) {
		console.error('Push event processing failed:', error);
	}
});

// Enhanced notification click handling
self.addEventListener('notificationclick', (event) => {
	event.notification.close();

	if (event.action === 'close') return;

	const url = event.notification.data.url || '/';

	event.waitUntil(
		clients.matchAll({ type: 'window' }).then((windowClients) => {
			for (const client of windowClients) {
				if (client.url === url && 'focus' in client) {
					return client.focus();
				}
			}
			if (clients.openWindow) {
				return clients.openWindow(url);
			}
		})
	);
});

