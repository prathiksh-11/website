import { BellOutlined } from '@ant-design/icons';
import type { NotificationInstance } from 'antd/es/notification/interface';
import { playNotificationSound } from './notification-sound';

type PushToastInput = {
  title?: string;
  body?: string;
  type?: string;
};

const cleanTitle = (raw: string) =>
  raw.replace(/^[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\s]+/u, '').trim() ||
  raw.trim();

/** Pretty foreground push toast (Ant Design notification). */
export const showPushToast = (
  api: NotificationInstance,
  input: PushToastInput,
) => {
  const title = cleanTitle(input.title || 'New notification');
  const body = (input.body || '').trim();
  const typeLabel = (input.type || '').trim();

  void playNotificationSound();

  api.open({
    key: `push-${Date.now()}`,
    title: (
      <div className="admin-push-toast__card">
        <span className="admin-push-toast__icon" aria-hidden>
          <BellOutlined />
        </span>
        <div className="admin-push-toast__copy">
          <strong className="admin-push-toast__title">{title}</strong>
          {body ? <p className="admin-push-toast__text">{body}</p> : null}
          {typeLabel ? (
            <span className="admin-push-toast__tag">{typeLabel}</span>
          ) : null}
        </div>
      </div>
    ),
    description: null,
    placement: 'topRight',
    duration: 6,
    className: 'admin-push-toast',
  });
};
