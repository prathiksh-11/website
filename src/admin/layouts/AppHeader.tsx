import {
  BellOutlined,
  CheckOutlined,
  DeleteOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  MoonOutlined,
  SunOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Avatar, Badge, Button, Dropdown, Empty, Skeleton } from 'antd';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import type { MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useNotificationMutations,
  useNotifications,
  useUnreadNotificationCount,
} from '@/hooks/useNotifications';
import { useAuthStore } from '@/store/auth.store';
import { useThemeStore } from '@/store/theme.store';
import type { AdminNotification } from '@/types';
import { CASH_PAYMENT_REOPEN_EVENT } from '@/components/cash/CashPaymentApprovalHost';

dayjs.extend(relativeTime);

const isCashPaymentNotification = (item: AdminNotification) => {
  const type = String(item.type || '').toLowerCase();
  const title = String(item.title || '').toLowerCase();
  const message = String(item.message || '').toLowerCase();
  return (
    type.includes('cash') ||
    title.includes('cash payment') ||
    message.includes('cash payment')
  );
};

const greetingForHour = (hour: number) => {
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
};

const NotificationPanel = () => {
  const navigate = useNavigate();
  const { data = [], isLoading } = useNotifications();
  const { markRead, remove } = useNotificationMutations();

  const onOpenItem = (item: AdminNotification) => {
    if (!item.isRead) {
      void markRead.mutateAsync({ ids: [item.id] });
    }
    if (isCashPaymentNotification(item)) {
      window.dispatchEvent(new Event(CASH_PAYMENT_REOPEN_EVENT));
    }
  };

  const onDeleteItem = (event: MouseEvent, item: AdminNotification) => {
    event.stopPropagation();
    void remove.mutateAsync({ ids: [item.id] });
  };

  return (
    <div className="admin-notify">
      <div className="admin-notify__head">
        <div>
          <strong>Notifications</strong>
          <span>{data.length} total</span>
        </div>
        <div className="admin-notify__actions">
          <Button
            type="text"
            size="small"
            icon={<CheckOutlined />}
            disabled={!data.some((n) => !n.isRead)}
            loading={markRead.isPending}
            onClick={() => void markRead.mutateAsync({ readAll: true })}
          >
            Read all
          </Button>
          <Button
            type="text"
            size="small"
            danger
            icon={<DeleteOutlined />}
            disabled={!data.length}
            loading={remove.isPending}
            onClick={() => void remove.mutateAsync({ deleteAll: true })}
          >
            Clear
          </Button>
        </div>
      </div>

      <div className="admin-notify__list">
        {isLoading ? (
          <div className="admin-notify__empty">
            <Skeleton active paragraph={{ rows: 4 }} title={false} />
          </div>
        ) : data.length ? (
          data.slice(0, 30).map((item) => (
            <div
              key={item.id}
              className={
                item.isRead
                  ? 'admin-notify__item'
                  : 'admin-notify__item admin-notify__item--unread'
              }
              role="button"
              tabIndex={0}
              onClick={() => onOpenItem(item)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  onOpenItem(item);
                }
              }}
            >
              <div className="admin-notify__item-top">
                <strong>{item.title}</strong>
                <div className="admin-notify__item-meta">
                  <time>{dayjs(item.createdAt).fromNow()}</time>
                  <button
                    type="button"
                    className="admin-notify__delete"
                    aria-label="Delete notification"
                    onClick={(event) => onDeleteItem(event, item)}
                  >
                    <DeleteOutlined />
                  </button>
                </div>
              </div>
              <p>{item.message}</p>
              {item.type ? <small>{item.type}</small> : null}
            </div>
          ))
        ) : (
          <div className="admin-notify__empty">
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="No notifications yet"
            />
          </div>
        )}
      </div>

      <div className="admin-notify__foot">
        <Button
          type="link"
          size="small"
          onClick={() => navigate('/notifications')}
        >
          Open notifications
        </Button>
      </div>
    </div>
  );
};

export const AppHeader = () => {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const { mode, collapsed, toggleCollapsed, toggleMode } = useThemeStore();
  const { data: unreadFromApi = 0 } = useUnreadNotificationCount();
  const { data: notifications = [] } = useNotifications();
  const unreadFromList = notifications.filter((n) => !n.isRead).length;
  const unread = Math.max(Number(unreadFromApi) || 0, unreadFromList);
  const firstName = user?.name?.split(' ')[0] ?? 'there';
  const today = dayjs().format('dddd, D MMMM YYYY');

  return (
    <header className="admin-header">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button
          type="button"
          className="admin-icon-btn"
          onClick={toggleCollapsed}
          aria-label="Toggle sidebar"
        >
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </button>
        <div className="admin-header__greeting hide-on-mobile">
          <strong>
            {greetingForHour(dayjs().hour())}, {firstName}
          </strong>
          <span>{today}</span>
        </div>
      </div>

      <div className="admin-header__actions">
        <button
          type="button"
          className="admin-icon-btn"
          onClick={toggleMode}
          aria-label="Toggle theme"
        >
          {mode === 'light' ? <MoonOutlined /> : <SunOutlined />}
        </button>
        <Badge
          count={unread}
          overflowCount={99}
          size="small"
          offset={[-2, 2]}
          className="admin-notify-badge"
        >
          <Dropdown
            trigger={['click']}
            placement="bottomRight"
            dropdownRender={() => <NotificationPanel />}
          >
            <button
              type="button"
              className="admin-icon-btn"
              aria-label="Notifications"
            >
              <BellOutlined />
            </button>
          </Dropdown>
        </Badge>
        <Dropdown
          menu={{
            items: [
              {
                key: 'profile',
                label: 'Profile',
                onClick: () => navigate('/profile'),
              },
              {
                key: 'settings',
                label: 'Settings',
                onClick: () => navigate('/settings'),
              },
              { type: 'divider' },
              {
                key: 'logout',
                label: 'Logout',
                onClick: () => {
                  void logout().then(() => navigate('/login'));
                },
              },
            ],
          }}
        >
          <div className="admin-user-chip">
            <Avatar
              size={34}
              icon={<UserOutlined />}
              style={{ background: 'linear-gradient(145deg,#ff5000,#e04800)' }}
            />
            <div className="admin-user-chip__meta">
              <strong>{user?.name}</strong>
              <span>{user?.role}</span>
            </div>
          </div>
        </Dropdown>
      </div>
    </header>
  );
};
