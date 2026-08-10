import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { App } from 'antd';
import { useEffect } from 'react';
import { notificationApi } from '@/api/notification.api';
import { listenForegroundMessages, requestFcmToken } from '@/lib/fcm';
import { isFirebaseConfigured } from '@/lib/firebase';
import {
  disconnectNotificationSocket,
  getNotificationSocket,
} from '@/lib/socket';
import { useAuthStore } from '@/store/auth.store';
import type { SendNotificationPayload } from '@/types';
import { showPushToast } from '@/utils/push-toast';
import {
  CASH_PAYMENT_EVENT,
  CASH_PAYMENT_RESOLVED_EVENT,
} from '@/components/cash/CashPaymentApprovalHost';

const LIST_KEY = ['notifications'];
const UNREAD_KEY = ['notifications', 'unread'];

export const useNotifications = (enabled = true) =>
  useQuery({
    queryKey: LIST_KEY,
    queryFn: () => notificationApi.list(),
    enabled,
    refetchInterval: 60_000,
  });

export const useUnreadNotificationCount = (enabled = true) =>
  useQuery({
    queryKey: UNREAD_KEY,
    queryFn: () => notificationApi.unreadCount(),
    enabled,
    refetchInterval: 15_000,
    refetchOnWindowFocus: true,
  });

/** Live unread badge via Socket.IO `notification_count_{userId}`. */
export const useNotificationRealtime = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const userId = useAuthStore((s) => s.user?.id);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!isAuthenticated || !userId) {
      disconnectNotificationSocket();
      return;
    }

    const socket = getNotificationSocket();
    if (!socket) return;

    const events = Array.from(
      new Set([
        `notification_count_${userId}`,
        `notification_count_${Number(userId)}`,
        `notification_count_${String(userId)}`,
      ]),
    );

    const onCount = (payload: { unread_count?: number }) => {
      const count = Number(payload?.unread_count ?? 0);
      queryClient.setQueryData(UNREAD_KEY, count);
      void queryClient.invalidateQueries({ queryKey: LIST_KEY });
      void queryClient.invalidateQueries({ queryKey: UNREAD_KEY });
    };

    const onConnect = () => {
      console.log('[socket] connected for notification counts', events);
    };

    if (!socket.connected) socket.connect();
    socket.on('connect', onConnect);
    events.forEach((event) => socket.on(event, onCount));

    return () => {
      socket.off('connect', onConnect);
      events.forEach((event) => socket.off(event, onCount));
    };
  }, [isAuthenticated, userId, queryClient]);

  useEffect(() => {
    if (isAuthenticated) return;
    disconnectNotificationSocket();
  }, [isAuthenticated]);
};

export const useNotificationMutations = () => {
  const queryClient = useQueryClient();

  const invalidate = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: LIST_KEY }),
      queryClient.invalidateQueries({ queryKey: UNREAD_KEY }),
    ]);
  };

  const markRead = useMutation({
    mutationFn: (payload?: { ids?: string[]; readAll?: boolean }) =>
      notificationApi.markRead(payload?.ids, payload?.readAll),
    onSuccess: (unread) => {
      queryClient.setQueryData(UNREAD_KEY, unread);
      void invalidate();
    },
  });

  const remove = useMutation({
    mutationFn: (payload?: { ids?: string[]; deleteAll?: boolean }) =>
      notificationApi.remove(payload?.ids, payload?.deleteAll),
    onSuccess: invalidate,
  });

  const send = useMutation({
    mutationFn: (payload: SendNotificationPayload) =>
      notificationApi.send(payload),
    onSuccess: async () => {
      await invalidate();
      // Sender is now a recipient for broadcasts — refresh badge immediately
      const unread = await notificationApi.unreadCount();
      queryClient.setQueryData(UNREAD_KEY, unread);
    },
  });

  return { markRead, remove, send, invalidate };
};

/** Register web FCM token + listen for foreground pushes while logged in. */
export const useFcmRegistration = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const queryClient = useQueryClient();
  const { notification } = App.useApp();

  useEffect(() => {
    if (!isAuthenticated || !isFirebaseConfigured()) return;

    let unsubscribe: (() => void) | undefined;
    let cancelled = false;

    const run = async () => {
      console.log('[FCM] useFcmRegistration — fetching token for logged-in user');
      const token = await requestFcmToken();
      if (cancelled) return;

      if (!token) {
        console.warn('[FCM] No token to store on backend');
        return;
      }

      try {
        await notificationApi.updateFcmToken(token);
        console.log('[FCM] Token stored on backend (users.fcm_token) via PUT /auth/fcm-token');
      } catch (error) {
        console.error('[FCM] Failed to save token on backend:', error);
      }

      unsubscribe = await listenForegroundMessages((payload) => {
        console.log('[FCM] Foreground message:', payload);
        const title =
          payload.notification?.title ||
          payload.data?.title ||
          'New notification';
        const body =
          payload.notification?.body ||
          payload.data?.body ||
          payload.data?.message ||
          '';
        const type =
          payload.data?.type ||
          payload.data?.notification_type ||
          undefined;

        showPushToast(notification, {
          title: String(title),
          body: String(body),
          type: type ? String(type) : undefined,
        });

        if (String(type) === 'cash_payment_pending' && payload.data) {
          window.dispatchEvent(
            new CustomEvent(CASH_PAYMENT_EVENT, {
              detail: payload.data as Record<string, unknown>,
            }),
          );
        }

        if (String(type) === 'cash_payment_resolved' && payload.data) {
          window.dispatchEvent(
            new CustomEvent(CASH_PAYMENT_RESOLVED_EVENT, {
              detail: payload.data as Record<string, unknown>,
            }),
          );
        }

        void queryClient.invalidateQueries({ queryKey: LIST_KEY });
        void queryClient.invalidateQueries({ queryKey: UNREAD_KEY });
      });
    };

    void run();

    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, [isAuthenticated, notification, queryClient]);
};
