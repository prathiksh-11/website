import {
  ClockCircleOutlined,
  EditOutlined,
  MailOutlined,
  PhoneOutlined,
  SearchOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  Avatar,
  Button,
  Drawer,
  Empty,
  Form,
  Input,
  Select,
  Skeleton,
  Tabs,
  Tag,
  TimePicker,
} from 'antd';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { Building2, MapPin } from 'lucide-react';
import { useMemo, useState } from 'react';
import { StatusBadge, PageSkeleton } from '@/components/common';
import {
  useBranchDetails,
  useBranchMutations,
  useBranches,
  useBranchesAll,
} from '@/hooks/useBranches';
import { useAuthStore } from '@/store/auth.store';
import { useTableParams } from '@/hooks/useTableParams';
import type { Branch, BranchPerson } from '@/types';

dayjs.extend(customParseFormat);

const shortBranch = (name: string) =>
  name
    .replace(/^Game On Fitness\s*/i, '')
    .replace(/^(Premium Club|Luxury Club)\s*-?\s*/i, '')
    .trim() || name;

const formatIndianTime = (timeStr?: string) => {
  if (!timeStr) return '—';
  if (/am|pm/i.test(timeStr)) return timeStr.toUpperCase();
  const parts = timeStr.split(':');
  if (parts.length >= 2) {
    let hours = parseInt(parts[0], 10);
    const minutes = parts[1].padStart(2, '0');
    if (isNaN(hours)) return timeStr;
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${hours}:${minutes} ${ampm}`;
  }
  return timeStr;
};

const formatBranchHours = (opening?: string, closing?: string) => {
  if (!opening && !closing) return '—';
  return `${formatIndianTime(opening)} – ${formatIndianTime(closing)}`;
};

const parseClock = (value?: string) =>
  value ? dayjs(value, ['HH:mm:ss', 'HH:mm', 'h:mm A'], true) : undefined;

const initials = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');

const PersonList = ({ people }: { people: BranchPerson[] }) => {
  if (!people.length) {
    return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="None" />;
  }

  return (
    <ul className="brch-people">
      {people.map((person) => (
        <li key={person.id}>
          <Avatar src={person.image} size={36}>
            {initials(person.name)}
          </Avatar>
          <div>
            <strong>{person.name}</strong>
            <span>{person.mobile || person.roleName || '—'}</span>
          </div>
        </li>
      ))}
    </ul>
  );
};

export const BranchList = () => {
  const user = useAuthStore((s) => s.user);
  const { params, setSearch, setStatus, setPage } = useTableParams({
    pageSize: 24,
  });
  const { data: allBranches, isLoading: loadingAll } = useBranchesAll();
  const { data, isLoading } = useBranches(params);
  const { update } = useBranchMutations();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editing, setEditing] = useState<Branch | null>(null);
  const [form] = Form.useForm();
  const { data: details, isLoading: loadingDetails } =
    useBranchDetails(selectedId);

  const stats = useMemo(() => {
    const list = allBranches ?? [];
    const active = list.filter((b) => b.status === 'active').length;
    const members = list.reduce((sum, b) => sum + (b.customerCount || 0), 0);
    return { total: list.length, active, members };
  }, [allBranches]);

  const selectedListItem = useMemo(
    () => (allBranches ?? []).find((b) => b.id === selectedId) ?? null,
    [allBranches, selectedId],
  );

  const roleHint =
    user?.role === 'Super Admin'
      ? 'All club locations across the network'
      : 'Locations assigned to your account';

  const openBranch = (branch: Branch) => setSelectedId(branch.id);

  const openEdit = (branch: Branch) => {
    const opening = parseClock(branch.openingTime);
    const closing = parseClock(branch.closingTime);
    setEditing(branch);
    form.setFieldsValue({
      name: branch.name,
      address: branch.address,
      phone: branch.phone,
      email: branch.email,
      location: branch.location || branch.city,
      status: branch.status || 'active',
      openingTime: opening?.isValid() ? opening : undefined,
      closingTime: closing?.isValid() ? closing : undefined,
    });
  };

  const onSubmit = async () => {
    if (!editing) return;
    const values = await form.validateFields();
    await update.mutateAsync({
      id: editing.id,
      payload: {
        name: values.name,
        address: values.address,
        phone: values.phone,
        email: values.email,
        location: values.location,
        status: values.status,
        openingTime: values.openingTime
          ? values.openingTime.format('HH:mm')
          : '',
        closingTime: values.closingTime
          ? values.closingTime.format('HH:mm')
          : '',
      },
    });
    setEditing(null);
  };

  if (loadingAll && !allBranches) {
    return <PageSkeleton variant="cards" />;
  }

  return (
    <div className="brch">
      <header className="brch__hero">
        <div>
          <p className="brch__kicker">Locations</p>
          <h1>Branches</h1>
          <p className="brch__sub">{roleHint}</p>
        </div>
        <div className="brch__hero-meta">
          <Building2 size={18} />
          <div>
            <strong>{stats.total}</strong>
            <span>clubs loaded</span>
          </div>
        </div>
      </header>

      <section className="brch__stats" aria-label="Branch stats">
        <article className="brch-stat">
          <span>Total branches</span>
          <strong>{loadingAll ? '—' : stats.total}</strong>
        </article>
        <article className="brch-stat">
          <span>Active</span>
          <strong>{loadingAll ? '—' : stats.active}</strong>
        </article>
        <article className="brch-stat">
          <span>Total people</span>
          <strong>{loadingAll ? '—' : stats.members}</strong>
        </article>
      </section>

      <section className="brch__panel">
        <div className="brch__toolbar">
          <Input
            allowClear
            size="large"
            prefix={<SearchOutlined />}
            placeholder="Search name, address, manager, phone…"
            value={params.search}
            onChange={(e) => setSearch(e.target.value)}
            className="brch__search"
          />
          <Select
            allowClear
            size="large"
            placeholder="Status"
            className="brch__filter"
            value={params.status}
            onChange={setStatus}
            options={[
              { value: 'active', label: 'Active' },
              { value: 'inactive', label: 'Inactive' },
            ]}
          />
        </div>

        {isLoading ? (
          <PageSkeleton variant="cards" />
        ) : !data?.data?.length ? (
          <Empty description="No branches found" />
        ) : (
          <div className="brch__grid">
            {data.data.map((branch) => (
              <article key={branch.id} className="brch-card">
                <button
                  type="button"
                  className="brch-card__hit"
                  onClick={() => openBranch(branch)}
                >
                  <div
                    className={`brch-card__media${branch.image ? '' : ' brch-card__media--empty'}`}
                    style={
                      branch.image
                        ? { backgroundImage: `url(${branch.image})` }
                        : undefined
                    }
                  >
                    {!branch.image && (
                      <span className="brch-card__fallback" aria-hidden>
                        <Building2 size={36} strokeWidth={1.5} />
                      </span>
                    )}
                    <StatusBadge status={branch.status} />
                  </div>

                  <div className="brch-card__body">
                    <h3>{shortBranch(branch.name)}</h3>
                    <p className="brch-card__full">{branch.name}</p>

                    <p className="brch-card__addr">
                      <MapPin size={14} />
                      <span>{branch.address || 'Address not set'}</span>
                    </p>

                    <div className="brch-card__meta">
                      {(branch.openingTime || branch.closingTime) && (
                        <span>
                          <ClockCircleOutlined />
                          {formatBranchHours(
                            branch.openingTime,
                            branch.closingTime,
                          )}
                        </span>
                      )}
                    </div>

                    <div className="brch-card__foot">
                      <span>
                        <UserOutlined />
                        {branch.managerName}
                      </span>
                    </div>
                  </div>
                </button>

                <div className="brch-card__actions">
                  <Button
                    type="text"
                    icon={<EditOutlined />}
                    onClick={() => openEdit(branch)}
                    className="brch-card__btn-edit"
                  >
                    Edit
                  </Button>
                </div>
              </article>
            ))}
          </div>
        )}

        {data && data.total > (data.pageSize ?? 24) && (
          <div className="brch__pager">
            <button
              type="button"
              disabled={(data.page ?? 1) <= 1}
              onClick={() => setPage((data.page ?? 1) - 1)}
            >
              Previous
            </button>
            <span>
              Page {data.page} · {data.total} branches
            </span>
            <button
              type="button"
              disabled={
                (data.page ?? 1) * (data.pageSize ?? 24) >= (data.total ?? 0)
              }
              onClick={() => setPage((data.page ?? 1) + 1)}
            >
              Next
            </button>
          </div>
        )}
      </section>

      <Drawer
        open={Boolean(selectedId)}
        onClose={() => setSelectedId(null)}
        width={520}
        destroyOnHidden
        title={null}
        className="brch-drawer"
        extra={
          selectedListItem || details ? (
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => openEdit(details ?? selectedListItem!)}
            >
              Edit
            </Button>
          ) : null
        }
      >
        {loadingDetails && !details ? (
          <Skeleton active paragraph={{ rows: 10 }} />
        ) : (
          (() => {
            const branch = details ?? selectedListItem;
            if (!branch) return <Empty description="Branch not found" />;

            return (
              <div className="brch-detail">
                <div
                  className={`brch-detail__hero${branch.image ? '' : ' brch-detail__hero--empty'}`}
                  style={
                    branch.image
                      ? { backgroundImage: `url(${branch.image})` }
                      : undefined
                  }
                >
                  {!branch.image && (
                    <span className="brch-detail__fallback" aria-hidden>
                      <Building2 size={48} strokeWidth={1.4} />
                    </span>
                  )}
                </div>

                <div className="brch-detail__head">
                  <StatusBadge status={branch.status} />
                  <h2>{branch.name}</h2>
                  <p>
                    <MapPin size={14} />
                    {branch.address || '—'}
                  </p>
                </div>

                <dl className="brch-detail__grid">
                  <div>
                    <dt>Phone</dt>
                    <dd>
                      {branch.phone ? (
                        <a href={`tel:${branch.phone}`}>
                          <PhoneOutlined /> {branch.phone}
                        </a>
                      ) : (
                        '—'
                      )}
                    </dd>
                  </div>
                  <div>
                    <dt>Email</dt>
                    <dd>
                      {branch.email ? (
                        <a href={`mailto:${branch.email}`}>
                          <MailOutlined /> {branch.email}
                        </a>
                      ) : (
                        '—'
                      )}
                    </dd>
                  </div>
                  <div>
                    <dt>Hours</dt>
                    <dd>
                      {formatBranchHours(branch.openingTime, branch.closingTime)}
                    </dd>
                  </div>
                  <div>
                    <dt>Manager</dt>
                    <dd>{branch.managerName}</dd>
                  </div>
                  <div>
                    <dt>People</dt>
                    <dd>{branch.customerCount}</dd>
                  </div>
                  <div>
                    <dt>Account ID</dt>
                    <dd>
                      {branch.accountId ? (
                        <Tag>{branch.accountId}</Tag>
                      ) : (
                        'Not linked'
                      )}
                    </dd>
                  </div>
                </dl>

                {details?.counts && (
                  <div className="brch-detail__counts">
                    <article>
                      <strong>{details.counts.customers}</strong>
                      <span>Customers</span>
                    </article>
                    <article>
                      <strong>{details.counts.employees}</strong>
                      <span>Trainers</span>
                    </article>
                    <article>
                      <strong>{details.counts.managers}</strong>
                      <span>Managers</span>
                    </article>
                    <article>
                      <strong>{details.counts.admins}</strong>
                      <span>Admins</span>
                    </article>
                  </div>
                )}

                {details && (
                  <Tabs
                    items={[
                      {
                        key: 'managers',
                        label: `Managers (${details.managers.length})`,
                        children: <PersonList people={details.managers} />,
                      },
                      {
                        key: 'employees',
                        label: `Trainers (${details.employees.length})`,
                        children: <PersonList people={details.employees} />,
                      },
                      {
                        key: 'customers',
                        label: `Customers (${details.customers.length})`,
                        children: <PersonList people={details.customers} />,
                      },
                      {
                        key: 'admins',
                        label: `Admins (${details.admins.length})`,
                        children: <PersonList people={details.admins} />,
                      },
                    ]}
                  />
                )}
              </div>
            );
          })()
        )}
      </Drawer>

      <Drawer
        title="Edit branch"
        open={Boolean(editing)}
        onClose={() => setEditing(null)}
        width={480}
        destroyOnHidden
        extra={
          <Button
            type="primary"
            onClick={() => void onSubmit()}
            loading={update.isPending}
          >
            Save
          </Button>
        }
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Branch name"
            rules={[{ required: true, message: 'Enter branch name' }]}
          >
            <Input placeholder="Game On Fitness – Indiranagar" />
          </Form.Item>

          <Form.Item name="address" label="Address">
            <Input.TextArea rows={3} placeholder="Street, area, city" />
          </Form.Item>

          <Form.Item name="location" label="Location">
            <Input placeholder="City or locality" />
          </Form.Item>

          <div className="brch-form-row">
            <Form.Item name="phone" label="Phone" style={{ flex: 1, marginBottom: 0 }}>
              <Input placeholder="080 1234 5678" />
            </Form.Item>
            <Form.Item
              name="email"
              label="Email"
              rules={[{ type: 'email', message: 'Enter a valid email' }]}
              style={{ flex: 1, marginBottom: 0 }}
            >
              <Input placeholder="branch@example.com" />
            </Form.Item>
          </div>

          <div className="brch-form-row" style={{ marginTop: 24 }}>
            <Form.Item
              name="openingTime"
              label="Opening time"
              style={{ flex: 1, marginBottom: 0 }}
            >
              <TimePicker use12Hours format="hh:mm A" style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item
              name="closingTime"
              label="Closing time"
              style={{ flex: 1, marginBottom: 0 }}
            >
              <TimePicker use12Hours format="hh:mm A" style={{ width: '100%' }} />
            </Form.Item>
          </div>

          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true }]}
            style={{ marginTop: 24 }}
          >
            <Select
              options={[
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' },
              ]}
            />
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
};
