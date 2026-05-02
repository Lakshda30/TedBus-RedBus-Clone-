self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('message', (event) => {
  const data = event.data;

  if (!data || data.type !== 'SHOW_NOTIFICATION') {
    return;
  }

  const payload = data.payload || {};
  const title = payload.title || 'New Notification';
  const options = {
    body: payload.message || '',
    tag: payload.tag || `notification-${Date.now()}`,
    data: {
      url: payload.url || '/'
    }
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('push', (event) => {
  const payload = event.data ? event.data.json() : {};
  const title = payload.title || 'New Notification';
  const options = {
    body: payload.message || '',
    tag: payload.tag || `push-${Date.now()}`,
    data: {
      url: payload.url || '/notifications'
    }
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || '/';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      for (const client of clients) {
        if ('focus' in client) {
          client.navigate(targetUrl);
          return client.focus();
        }
      }

      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }

      return Promise.resolve();
    })
  );
});
