import { USE_MOCK } from '@/constants';
import { delay } from '@/mocks/data';
import type {
  AdminNotification,
  SendNotificationPayload,
  SendNotificationResult,
} from '@/types';
import { apiClient } from './axios';
import { ENDPOINTS } from './endpoints';

interface ListResponse {
  success?: boolean;
  count?: number;
  data?: Record<string, unknown>[];
}

interface UnreadResponse {
  success?: boolean;
  unread_count?: number;
}

interface SendResponse {
  success?: boolean;
  sent?: number;
  failed?: number;
  recipient_ids?: number[];
  message?: string;
}

const mapNotification = (raw: Record<string, unknown>): AdminNotification => ({
  id: String(raw.id),
  title: String(raw.title ?? 'Notification'),
  message: String(raw.message ?? ''),
  type: raw.type ? String(raw.type) : undefined,
  isRead:
    raw.is_read === true ||
    raw.is_read === 1 ||
    raw.is_read === '1' ||
    raw.is_read === 't' ||
    raw.is_read === 'true',
  createdAt: String(raw.created_at ?? new Date().toISOString()),
  referenceId:
    raw.reference_id != null ? String(raw.reference_id) : undefined,
  branchId: raw.branch_id != null ? String(raw.branch_id) : undefined,
});

let mockNotifications: AdminNotification[] = [];

export const notificationApi = {
  list: async (): Promise<AdminNotification[]> => {
    if (USE_MOCK) {
      await delay(200);
      return [...mockNotifications];
    }
    const { data } = await apiClient.get<ListResponse>(
      ENDPOINTS.NOTIFICATIONS.ROOT,
    );
    const rows = Array.isArray(data?.data) ? data.data : [];
    return rows.map(mapNotification);
  },

  unreadCount: async (): Promise<number> => {
    if (USE_MOCK) {
      await delay(100);
      return mockNotifications.filter((n) => !n.isRead).length;
    }
    const { data } = await apiClient.get<UnreadResponse>(
      ENDPOINTS.NOTIFICATIONS.UNREAD_COUNT,
    );
    return Number(data?.unread_count ?? 0);
  },

  markRead: async (ids?: string[], readAll = false): Promise<number> => {
    if (USE_MOCK) {
      await delay(150);
      mockNotifications = mockNotifications.map((n) =>
        readAll || (ids && ids.includes(n.id)) ? { ...n, isRead: true } : n,
      );
      return mockNotifications.filter((n) => !n.isRead).length;
    }
    const { data } = await apiClient.post<{ unread_count?: number }>(
      ENDPOINTS.NOTIFICATIONS.READ,
      readAll
        ? { read_all: true }
        : { notification_ids: (ids ?? []).map(Number) },
    );
    return Number(data?.unread_count ?? 0);
  },

  remove: async (ids?: string[], deleteAll = false): Promise<void> => {
    if (USE_MOCK) {
      await delay(150);
      if (deleteAll) mockNotifications = [];
      else if (ids?.length) {
        mockNotifications = mockNotifications.filter((n) => !ids.includes(n.id));
      }
      return;
    }
    await apiClient.post(ENDPOINTS.NOTIFICATIONS.DELETE, deleteAll
      ? { delete_all: true }
      : { notification_ids: (ids ?? []).map(Number) });
  },

  updateFcmToken: async (fcmToken: string): Promise<void> => {
    if (USE_MOCK) {
      await delay(100);
      return;
    }
    await apiClient.put(ENDPOINTS.AUTH.FCM_TOKEN, { fcm_token: fcmToken });
  },

  send: async (
    payload: SendNotificationPayload,
  ): Promise<SendNotificationResult> => {
    if (USE_MOCK) {
      await delay(250);
      return { sent: payload.userIds?.length ?? 1, failed: 0, recipientIds: [] };
    }
    const { data } = await apiClient.post<SendResponse>(
      ENDPOINTS.NOTIFICATIONS.SEND,
      {
        title: payload.title,
        message: payload.message,
        type: payload.type ?? 'admin_broadcast',
        target: payload.target,
        branch_id:
          payload.branchId != null && payload.branchId !== ''
            ? Number(payload.branchId)
            : undefined,
        user_ids: (payload.userIds ?? []).map(Number),
      },
    );
    return {
      sent: Number(data?.sent ?? 0),
      failed: Number(data?.failed ?? 0),
      recipientIds: (data?.recipient_ids ?? []).map(String),
    };
  },
};
