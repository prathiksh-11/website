/* eslint-disable no-undef */
/* Firebase messaging service worker for admin web push */

importScripts(
  'https://www.gstatic.com/firebasejs/11.6.0/firebase-app-compat.js',
);
importScripts(
  'https://www.gstatic.com/firebasejs/11.6.0/firebase-messaging-compat.js',
);

let messagingInitialized = false;

const initMessaging = (config) => {
  if (messagingInitialized || !config?.apiKey || !config?.projectId) return;

  firebase.initializeApp(config);
  const messaging = firebase.messaging();

  messaging.onBackgroundMessage((payload) => {
    const title =
      payload.notification?.title ||
      payload.data?.title ||
      'Game On Fitness';
    const body =
      payload.notification?.body ||
      payload.data?.body ||
      payload.data?.message ||
      '';

    self.registration.showNotification(title, {
      body,
      icon: '/favicon.ico',
      data: payload.data || {},
    });
  });

  messagingInitialized = true;
};

self.addEventListener('message', (event) => {
  if (event.data?.type === 'FIREBASE_CONFIG') {
    initMessaging(event.data.config);
  }
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || '/dashboard';
  event.waitUntil(
    clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then((windowClients) => {
        for (const client of windowClients) {
          if ('focus' in client) {
            client.navigate(targetUrl);
            return client.focus();
          }
        }
        if (clients.openWindow) return clients.openWindow(targetUrl);
        return undefined;
      }),
  );
});
