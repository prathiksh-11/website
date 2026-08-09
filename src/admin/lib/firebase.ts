import { initializeApp, type FirebaseApp, getApps } from 'firebase/app';
import { getMessaging, type Messaging, isSupported } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string | undefined,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string | undefined,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string | undefined,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string | undefined,
  messagingSenderId: import.meta.env
    .VITE_FIREBASE_MESSAGING_SENDER_ID as string | undefined,
  appId: import.meta.env.VITE_FIREBASE_APP_ID as string | undefined,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID as string | undefined,
};

export const isFirebaseConfigured = () =>
  Boolean(
    firebaseConfig.apiKey &&
      firebaseConfig.projectId &&
      firebaseConfig.messagingSenderId &&
      firebaseConfig.appId &&
      import.meta.env.VITE_FIREBASE_VAPID_KEY,
  );

let app: FirebaseApp | null = null;
let messaging: Messaging | null = null;

export const getFirebaseApp = () => {
  if (!isFirebaseConfigured()) return null;
  if (!app) {
    app = getApps().length ? getApps()[0]! : initializeApp(firebaseConfig);
  }
  return app;
};

export const getFirebaseMessaging = async () => {
  if (messaging) return messaging;
  const firebaseApp = getFirebaseApp();
  if (!firebaseApp) return null;
  if (!(await isSupported())) return null;
  messaging = getMessaging(firebaseApp);
  return messaging;
};

export const getFirebaseWebConfig = () => ({ ...firebaseConfig });
