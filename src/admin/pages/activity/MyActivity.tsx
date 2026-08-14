import { SearchOutlined } from '@ant-design/icons';
import { Button, Empty, Input, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Activity, Calendar, Phone } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { PageSkeleton } from '@/components/common';
import { PAGE_SIZE_OPTIONS } from '@/constants';
import { useMyActivity } from '@/hooks/useMyActivity';
import { useTableParams } from '@/hooks/useTableParams';
import { useAuthStore } from '@/store/auth.store';
import type { UserActivitySession } from '@/types';
import { formatDateTime } from '@/utils/format';

dayjs.extend(relativeTime);

type DatePreset = '7d' | '30d' | 'month' | 'all';

const PRESETS: { key: DatePreset; label: string }[] = [
  { key: '7d', label: '7 days' },
  { key: '30d', label: '30 days' },
  { key: 'month', label: 'This month' },
  { key: 'all', label: 'All' },
];

const statusLabel = (status: UserActivitySession['status']) => {
  if (status === 'online') return 'Online';
  if (status === 'active_today') return 'Active today';
  if (status === 'this_week') return 'This week';
  return 'Inactive';
};

const statusColor = (status: UserActivitySession['status']) => {
  if (status === 'online') return 'success';
  if (status === 'active_today') return 'processing';
  if (status === 'this_week') return 'warning';
  return 'default';
};

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('') || '?';

const presetRange = (preset: DatePreset) => {
  const today = dayjs();
  if (preset === '7d') {
    return {
      startDate: today.subtract(6, 'day').format('YYYY-MM-DD'),
      endDate: today.format('YYYY-MM-DD'),
    };
  }
  if (preset === '30d') {
    return {
      startDate: today.subtract(29, 'day').format('YYYY-MM-DD'),
      endDate: today.format('YYYY-MM-DD'),
    };
  }
  if (preset === 'month') {
    return {
      startDate: today.startOf('month').format('YYYY-MM-DD'),
      endDate: today.format('YYYY-MM-DD'),
    };
  }
  return { startDate: undefined, endDate: undefined };
};

export const MyActivity = () => {
  const user = useAuthStore((s) => s.user);
  const { params, setSearch, setPage } = useTableParams({ pageSize: 10 });
  const [preset, setPreset] = useState<DatePreset>('all');

  const listParams = useMemo(
    () => ({
      page: params.page,
      pageSize: params.pageSize,
      search: params.search,
      ...presetRange(preset),
    }),
    [params.page, params.pageSize, params.search, preset],
  );

  const { data, isLoading, isFetching } = useMyActivity(listParams);

  if (!user?.showActivityDashboard) {
    return <Navigate to="/dashboard" replace />;
  }

  const columns: ColumnsType<UserActivitySession> = [
    {
      title: '#',
      key: 'index',
      width: 56,
      render: (_value, _row, index) =>
        ((data?.page ?? 1) - 1) * (data?.pageSize ?? 10) + index + 1,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (name: string) => (
        <div className="coupon__user-cell">
          <span className="coupon__avatar">{initials(name)}</span>
          <div>
            <strong>{name}</strong>
            <div className="coupon__meta">User account</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Mobile',
      dataIndex: 'mobile',
      key: 'mobile',
      render: (mobile?: string) => (
        <span className="coupon__mobile">
          <Phone size={14} />
          {mobile || '—'}
        </span>
      ),
    },
    {
      title: 'Last Active',
      dataIndex: 'lastActive',
      key: 'lastActive',
      render: (value: string) => (
        <div className="coupon__last-active">
          <span>
            <Calendar size={14} />
            {formatDateTime(value)}
          </span>
          <small>{dayjs(value).fromNow()}</small>
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: UserActivitySession['status']) => (
        <Tag color={statusColor(status)}>
          {status === 'online' ? '🟢 ' : ''}
          {statusLabel(status)}
        </Tag>
      ),
    },
  ];

  if (isLoading && !data) {
    return <PageSkeleton variant="list" />;
  }

  return (
    <div className="coupon">
      <div className="coupon__header">
        <div>
          <h1 className="coupon__title">
            <Activity size={22} strokeWidth={1.75} />
            Recently Active Users
          </h1>
          <p className="coupon__subtitle">
            {data?.total ?? 0} user(s) found
          </p>
        </div>
      </div>

      <div className="coupon__toolbar coupon__toolbar--activity">
        <div className="coupon__preset-group">
          {PRESETS.map((item) => (
            <Button
              key={item.key}
              type={preset === item.key ? 'primary' : 'default'}
              onClick={() => {
                setPreset(item.key);
                setPage(1);
              }}
            >
              {item.label}
            </Button>
          ))}
        </div>

        <Input
          allowClear
          prefix={<SearchOutlined />}
          placeholder="Search name or mobile"
          value={params.search}
          onChange={(e) => setSearch(e.target.value)}
          className="coupon__search"
        />
      </div>

      <div className="coupon__table-wrap">
        <Table<UserActivitySession>
          rowKey="id"
          columns={columns}
          dataSource={data?.items ?? []}
          loading={isFetching}
          locale={{ emptyText: <Empty description="No active users found" /> }}
          pagination={{
            current: data?.page ?? params.page ?? 1,
            pageSize: data?.pageSize ?? params.pageSize ?? 10,
            total: data?.total ?? 0,
            showSizeChanger: true,
            pageSizeOptions: PAGE_SIZE_OPTIONS.map(String),
            onChange: (page, pageSize) => setPage(page, pageSize),
          }}
          scroll={{ x: 760 }}
        />
      </div>
    </div>
  );
};
