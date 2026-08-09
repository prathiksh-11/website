import { io, type Socket } from 'socket.io-client';

let socket: Socket | null = null;

const resolveSocketUrl = () => {
  const explicit = import.meta.env.VITE_SOCKET_URL?.trim();
  if (explicit) return explicit.replace(/\/$/, '');

  const apiBase = (import.meta.env.VITE_API_BASE_URL ?? '').trim();
  if (!apiBase) return '';

  try {
    const url = new URL(apiBase);
    return url.origin;
  } catch {
    return apiBase.replace(/\/api\/?$/, '');
  }
};

export const getNotificationSocket = (): Socket | null => {
  const url = resolveSocketUrl();
  if (!url) return null;

  if (!socket) {
    socket = io(url, {
      transports: ['websocket', 'polling'],
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: 12,
      path: '/socket.io',
    });
  }

  return socket;
};

export const disconnectNotificationSocket = () => {
  if (!socket) return;
  socket.removeAllListeners();
  socket.disconnect();
  socket = null;
};
