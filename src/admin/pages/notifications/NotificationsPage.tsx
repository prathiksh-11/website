import {
  CheckOutlined,
  DeleteOutlined,
  SendOutlined,
} from '@ant-design/icons';
import {
  App,
  Button,
  Empty,
  Form,
  Input,
  Select,
  Skeleton,
  Tag,
} from 'antd';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Bell, Inbox, Megaphone } from 'lucide-react';
import { useMemo, useState, type MouseEvent } from 'react';
import { PageSkeleton } from '@/components/common';
import { useBranches } from '@/hooks/useBranches';
import { useCustomersAll } from '@/hooks/useCustomers';
import {
  useNotificationMutations,
  useNotifications,
  useUnreadNotificationCount,
} from '@/hooks/useNotifications';
import { useTrainersAll } from '@/hooks/useTrainers';
import { CASH_PAYMENT_REOPEN_EVENT } from '@/components/cash/CashPaymentApprovalHost';
import type { AdminNotification, NotificationSendTarget } from '@/types';

dayjs.extend(relativeTime);

type InboxFilter = 'all' | 'unread' | 'read';

interface SendFormValues {
  title: string;
  message: string;
  target: NotificationSendTarget;
  branchId?: string;
  userIds?: string[];
}

const isCashPaymentNotification = (item: AdminNotification) => {
  const type = String(item.type || '').toLowerCase();
  const title = String(item.title || '').toLowerCase();
  const body = String(item.message || '').toLowerCase();
  return (
    type.includes('cash') ||
    title.includes('cash payment') ||
    body.includes('cash payment')
  );
};

export const NotificationsPage = () => {
  const { message } = App.useApp();
  const [form] = Form.useForm<SendFormValues>();
  const target = Form.useWatch('target', form) as NotificationSendTarget | undefined;
  const [filter, setFilter] = useState<InboxFilter>('all');

  const { data: items = [], isLoading } = useNotifications();
  const { data: unread = 0 } = useUnreadNotificationCount();
  const { markRead, remove, send } = useNotificationMutations();
  const { data: branchesData } = useBranches({ page: 1, pageSize: 200 });
  const { data: customers = [] } = useCustomersAll();
  const { data: trainers = [] } = useTrainersAll();

  const branches = branchesData?.data ?? [];

  const recipientOptions = useMemo(() => {
    const people = [
      ...customers.map((c) => ({
        value: c.id,
        label: `${c.name} · Customer${c.phone ? ` (${c.phone})` : ''}`,
      })),
      ...trainers.map((t) => ({
        value: t.id,
        label: `${t.name} · ${t.trainerType || t.roleName || 'Trainer'}${t.phone ? ` (${t.phone})` : ''}`,
      })),
    ];
    const seen = new Set<string>();
    return people.filter((p) => {
      if (seen.has(p.value)) return false;
      seen.add(p.value);
      return true;
    });
  }, [customers, trainers]);

  const filtered = useMemo(() => {
    if (filter === 'unread') return items.filter((n) => !n.isRead);
    if (filter === 'read') return items.filter((n) => n.isRead);
    return items;
  }, [items, filter]);

  const onSend = async (values: SendFormValues) => {
    try {
      let finalTarget: NotificationSendTarget = values.target;
      let finalUserIds = values.userIds;

      if (values.target === 'all_customers') {
        finalTarget = 'user_ids';
        finalUserIds = customers.map((c) => c.id).filter(Boolean);
        if (!finalUserIds.length) {
          message.error('No registered customers found to notify');
          return;
        }
      } else if (values.target === 'all_employees') {
        finalTarget = 'user_ids';
        finalUserIds = trainers.map((t) => t.id).filter(Boolean);
        if (!finalUserIds.length) {
          message.error('No employees found to notify');
          return;
        }
      }

      const result = await send.mutateAsync({
        title: values.title.trim(),
        message: values.message.trim(),
        target: finalTarget,
        branchId: values.branchId,
        userIds: finalUserIds,
        type: 'admin_broadcast',
      });
      message.success(
        `Sent to ${result.sent} recipient${result.sent === 1 ? '' : 's'}${result.failed ? ` (${result.failed} failed)` : ''
        }`,
      );
      form.resetFields(['title', 'message', 'userIds']);
      form.setFieldsValue({ target: values.target, branchId: values.branchId });
    } catch (error) {
      const apiMessage =
        error &&
          typeof error === 'object' &&
          'response' in error &&
          error.response &&
          typeof error.response === 'object' &&
          'data' in error.response &&
          error.response.data &&
          typeof error.response.data === 'object' &&
          'message' in error.response.data
          ? String(
            (error.response.data as { message?: string }).message ?? '',
          )
          : '';
      message.error(apiMessage || 'Failed to send notification');
    }
  };

  const onOpenItem = (item: AdminNotification) => {
    if (!item.isRead) {
      void markRead.mutateAsync({ ids: [item.id] });
    }
    if (isCashPaymentNotification(item)) {
      window.dispatchEvent(new Event(CASH_PAYMENT_REOPEN_EVENT));
    }
  };

  const onDeleteItem = (
    event: MouseEvent,
    item: AdminNotification,
  ) => {
    event.stopPropagation();
    void remove.mutateAsync({ ids: [item.id] });
  };

  if (isLoading && !items.length) {
    return <PageSkeleton variant="inbox" />;
  }

  return (
    <div className="notif-page">
      <header className="notif-page__hero">
        <div>
          <p className="notif-page__kicker">Communications</p>
          <h1>Notifications</h1>
          <p className="notif-page__sub">
            Send announcements and manage your inbox with live unread counts.
          </p>
        </div>
        <div className="notif-page__stats">
          <div>
            <strong>{unread}</strong>
            <span>Unread</span>
          </div>
          <div>
            <strong>{items.length}</strong>
            <span>Total</span>
          </div>
        </div>
      </header>

      <div className="notif-page__grid">
        <section className="notif-page__compose">
          <div className="notif-page__panel-head">
            <Megaphone size={18} />
            <div>
              <strong>Send notification</strong>
              <span>Any message text — stored in Firebase + DB, then pushed</span>
            </div>
          </div>

          <Form
            form={form}
            layout="vertical"
            initialValues={{ target: 'all_admins' }}
            onFinish={(values) => void onSend(values)}
            requiredMark={false}
          >
            <Form.Item
              name="title"
              label="Title"
              rules={[{ required: true, message: 'Add a title' }]}
            >
              <Input placeholder="Membership renewal reminder" />
            </Form.Item>

            <Form.Item
              name="message"
              label="Message"
              rules={[{ required: true, message: 'Add a message' }]}
            >
              <Input.TextArea
                rows={5}
                placeholder="Write any notification message…"
                autoSize={{ minRows: 4, maxRows: 12 }}
              />
            </Form.Item>

            <Form.Item
              name="target"
              label="Audience"
              initialValue="all_customers"
              rules={[{ required: true, message: 'Please select an audience' }]}
            >
              <Select
                options={[
                  {
                    value: 'all_customers',
                    label: `All Customers (${customers.length})`,
                  },
                  {
                    value: 'all_employees',
                    label: `All Employees & Trainers (${trainers.length})`,
                  },
                  {
                    value: 'all_admins',
                    label: 'All Admins & Managers',
                  },
                  {
                    value: 'branch',
                    label: 'Everyone at a branch',
                  },
                  {
                    value: 'user_ids',
                    label: 'Specific people (Customers / Staff)',
                  },
                ]}
              />
            </Form.Item>

            {target === 'branch' ? (
              <Form.Item
                name="branchId"
                label="Branch"
                rules={[{ required: true, message: 'Pick a branch' }]}
              >
                <Select
                  showSearch
                  optionFilterProp="label"
                  placeholder="Select branch"
                  options={branches.map((b) => ({
                    value: b.id,
                    label: b.name,
                  }))}
                />
              </Form.Item>
            ) : null}

            {target === 'user_ids' ? (
              <Form.Item
                name="userIds"
                label="Recipients"
                rules={[
                  {
                    required: true,
                    type: 'array',
                    min: 1,
                    message: 'Select at least one person',
                  },
                ]}
              >
                <Select
                  mode="multiple"
                  showSearch
                  optionFilterProp="label"
                  placeholder="Search customers or trainers"
                  options={recipientOptions}
                  maxTagCount="responsive"
                />
              </Form.Item>
            ) : null}

            <Button
              type="primary"
              htmlType="submit"
              icon={<SendOutlined />}
              loading={send.isPending}
              block
            >
              Send & store
            </Button>
          </Form>
        </section>

        <section className="notif-page__inbox">
          <div className="notif-page__panel-head">
            <Inbox size={18} />
            <div>
              <strong>Your inbox</strong>
              <span>Read, unread, and delete in real time</span>
            </div>
          </div>

          <div className="notif-page__filters">
            {(
              [
                ['all', 'All'],
                ['unread', 'Unread'],
                ['read', 'Read'],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                className={
                  filter === key
                    ? 'notif-page__chip notif-page__chip--on'
                    : 'notif-page__chip'
                }
                onClick={() => setFilter(key)}
              >
                {label}
              </button>
            ))}

            <div className="notif-page__inbox-actions">
              <Button
                type="text"
                size="small"
                icon={<CheckOutlined />}
                disabled={!items.some((n) => !n.isRead)}
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
                disabled={!items.length}
                loading={remove.isPending}
                onClick={() => void remove.mutateAsync({ deleteAll: true })}
              >
                Clear
              </Button>
            </div>
          </div>

          <div className="notif-page__list">
            {isLoading ? (
              <div className="notif-page__empty">
                <Skeleton active paragraph={{ rows: 4 }} />
              </div>
            ) : filtered.length ? (
              filtered.map((item) => (
                <article
                  key={item.id}
                  className={
                    item.isRead
                      ? 'notif-page__item'
                      : 'notif-page__item notif-page__item--unread'
                  }
                  onClick={() => onOpenItem(item)}
                >
                  <div className="notif-page__item-top">
                    <div className="notif-page__item-title">
                      {!item.isRead ? <span className="notif-page__dot" /> : null}
                      <strong>{item.title}</strong>
                      {item.type ? <Tag>{item.type}</Tag> : null}
                    </div>
                    <div className="notif-page__item-meta">
                      <time>{dayjs(item.createdAt).fromNow()}</time>
                      <Button
                        type="text"
                        size="small"
                        danger
                        icon={<DeleteOutlined />}
                        aria-label="Delete notification"
                        onClick={(event) => onDeleteItem(event, item)}
                      />
                    </div>
                  </div>
                  <p>{item.message}</p>
                </article>
              ))
            ) : (
              <div className="notif-page__empty">
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={
                    filter === 'unread'
                      ? 'No unread notifications'
                      : 'No notifications yet'
                  }
                />
              </div>
            )}
          </div>
        </section>
      </div>

      <p className="notif-page__hint">
        <Bell size={14} /> Unread badge updates live over websocket when new
        notifications arrive.
      </p>
    </div>
  );
};
