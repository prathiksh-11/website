import { getToken, onMessage, type MessagePayload } from 'firebase/messaging';
import {
  getFirebaseMessaging,
  getFirebaseWebConfig,
  isFirebaseConfigured,
} from './firebase';

const SW_PATH = '/firebase-messaging-sw.js';

const writeSwConfig = async (registration: ServiceWorkerRegistration) => {
  const config = getFirebaseWebConfig();
  const send = () => {
    registration.active?.postMessage({
      type: 'FIREBASE_CONFIG',
      config,
    });
  };

  if (registration.active) {
    send();
    return;
  }

  await new Promise<void>((resolve) => {
    const worker = registration.installing || registration.waiting;
    if (!worker) {
      resolve();
      return;
    }
    worker.addEventListener('statechange', () => {
      if (worker.state === 'activated') {
        send();
        resolve();
      }
    });
  });
};

export const registerMessagingServiceWorker = async () => {
  if (!isFirebaseConfigured() || !('serviceWorker' in navigator)) return null;
  const registration = await navigator.serviceWorker.register(SW_PATH);
  await navigator.serviceWorker.ready;
  await writeSwConfig(registration);
  return registration;
};

export const requestFcmToken = async (): Promise<string | null> => {
  console.log('[FCM] requestFcmToken() called');

  if (!isFirebaseConfigured()) {
    console.warn(
      '[FCM] Firebase not fully configured. Check VITE_FIREBASE_* and VITE_FIREBASE_VAPID_KEY in .env',
      {
        hasApiKey: Boolean(import.meta.env.VITE_FIREBASE_API_KEY),
        hasProjectId: Boolean(import.meta.env.VITE_FIREBASE_PROJECT_ID),
        hasSenderId: Boolean(import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID),
        hasAppId: Boolean(import.meta.env.VITE_FIREBASE_APP_ID),
        hasVapidKey: Boolean(import.meta.env.VITE_FIREBASE_VAPID_KEY),
      },
    );
    return null;
  }
  if (!('Notification' in window)) {
    console.warn('[FCM] Notification API not supported in this browser');
    return null;
  }

  const permission =
    Notification.permission === 'granted'
      ? 'granted'
      : await Notification.requestPermission();

  console.log('[FCM] Notification permission:', permission);
  if (permission !== 'granted') {
    console.warn('[FCM] Permission denied — no token');
    return null;
  }

  const messaging = await getFirebaseMessaging();
  if (!messaging) {
    console.warn('[FCM] Messaging not available (unsupported or init failed)');
    return null;
  }

  const registration =
    (await registerMessagingServiceWorker()) ??
    (await navigator.serviceWorker.ready);

  const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY as string;

  try {
    const token = await getToken(messaging, {
      vapidKey,
      serviceWorkerRegistration: registration,
    });

    if (token) {
      console.log('[FCM] Token received:', token);
      try {
        localStorage.setItem('gym_admin_fcm_token', token);
        console.log('[FCM] Token saved to localStorage (gym_admin_fcm_token)');
      } catch {
        console.warn('[FCM] Could not write token to localStorage');
      }
      return token;
    }

    console.warn('[FCM] getToken returned empty');
    return null;
  } catch (error) {
    console.error('[FCM] getToken failed:', error);
    return null;
  }
};

export const listenForegroundMessages = async (
  onPayload: (payload: MessagePayload) => void,
) => {
  const messaging = await getFirebaseMessaging();
  if (!messaging) return () => undefined;

  return onMessage(messaging, onPayload);
};
