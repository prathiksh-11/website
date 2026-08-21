import { EyeOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import {
  Button,
  Drawer,
  Empty,
  Form,
  Input,
  InputNumber,
  Select,
  Table,
  Tooltip,
  message,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import {
  Clock3,
  Copy,
  MapPin,
  Ticket,
  UserCheck,
  Users,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { getCouponExpiresAt } from '@/api/coupon.api';
import { PageSkeleton } from '@/components/common';
import { PAGE_SIZE_OPTIONS } from '@/constants';
import { useBranches } from '@/hooks/useBranches';
import { useCouponMutations, useCoupons } from '@/hooks/useCoupons';
import { useTableParams } from '@/hooks/useTableParams';
import { useAuthStore } from '@/store/auth.store';
import type { Coupon } from '@/types';
import { formatCurrency, formatDateTime } from '@/utils/format';

dayjs.extend(duration);

const shortBranch = (name: string) =>
  name
    .replace(/^Game On Fitness\s*/i, '')
    .replace(/^(Premium Club|Luxury Club)\s*-?\s*/i, '')
    .trim() || name;

const statusClass = (status: string) => {
  if (status === 'active') return 'coupon-status coupon-status--active';
  if (status === 'used') return 'coupon-status coupon-status--used';
  if (status === 'expired') return 'coupon-status coupon-status--expired';
  return 'coupon-status';
};

const statusLabel = (status: string) => {
  if (status === 'expired') return 'Expired';
  if (status === 'active') return 'Active';
  if (status === 'used') return 'Used';
  if (status === 'inactive') return 'Inactive';
  return status;
};

const copyCode = async (code: string) => {
  try {
    await navigator.clipboard.writeText(code);
    message.success('Coupon code copied to clipboard!');
  } catch {
    message.error('Could not copy code');
  }
};

const formatRemaining = (coupon: Coupon, now: number) => {
  if (coupon.status === 'used' || coupon.status === 'expired') return '—';

  const expiresAt = getCouponExpiresAt(coupon);
  const diffMs = dayjs(expiresAt).valueOf() - now;
  if (diffMs <= 0) return 'Expired';

  const d = dayjs.duration(diffMs);
  const hours = Math.floor(d.asHours());
  const mins = d.minutes();
  const secs = d.seconds();

  if (hours > 0) return `${hours}h ${mins}m left`;
  if (mins > 0) return `${mins}m ${secs}s left`;
  return `${secs}s left`;
};

const useNowTicker = (enabled: boolean, intervalMs = 1000) => {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!enabled) return undefined;
    const id = window.setInterval(() => setNow(Date.now()), intervalMs);
    return () => window.clearInterval(id);
  }, [enabled, intervalMs]);

  return now;
};

export const CouponList = () => {
  const user = useAuthStore((s) => s.user);
  const { params, setSearch, setBranchId, setStatus, setPage } = useTableParams({
    pageSize: 20,
  });
  const { data, isLoading, isFetching } = useCoupons(params);
  const { data: branchesData } = useBranches({ page: 1, pageSize: 200 });
  const { create } = useCouponMutations();
  const branches = branchesData?.data ?? [];

  const [createOpen, setCreateOpen] = useState(false);
  const [selected, setSelected] = useState<Coupon | null>(null);
  const [form] = Form.useForm();

  const roleHint =
    user?.role === 'Super Admin'
      ? 'Coupons created across all branches'
      : 'Coupons created for your assigned branches';

  const summary = data?.summary;
  const items = data?.items ?? [];

  const hasActive = useMemo(
    () => items.some((row) => row.status === 'active'),
    [items],
  );
  const now = useNowTicker(hasActive || createOpen || Boolean(selected));

  const openCreate = () => {
    form.resetFields();
    form.setFieldsValue({ price: 500 });
    setCreateOpen(true);
  };

  const onSubmit = async () => {
    const values = await form.validateFields();
    const created = await create.mutateAsync({
      couponName: values.couponName,
      price: values.price,
      branchId: values.branchId,
    });
    const expiresAt = getCouponExpiresAt(created);
    message.info(`Coupon active! Expires at ${formatDateTime(expiresAt)} (1 hour)`);
    setCreateOpen(false);
  };

  const columns: ColumnsType<Coupon> = [
    {
      title: 'Coupon Code & Name',
      key: 'coupon',
      render: (_, row) => (
        <div className="coupon-cell">
          <button
            type="button"
            className="coupon-row__chip"
            onClick={(e) => {
              e.stopPropagation();
              void copyCode(row.couponCode);
            }}
            title="Click to copy coupon code"
          >
            <span>{row.couponCode}</span>
            <Copy size={13} />
          </button>
          <strong>{row.couponName || 'Untitled coupon'}</strong>
        </div>
      ),
    },
    {
      title: 'Value',
      dataIndex: 'price',
      key: 'price',
      width: 110,
      render: (value: number) => (
        <span className="coupon-value">{formatCurrency(value)}</span>
      ),
    },
    {
      title: 'Time Remaining',
      key: 'remaining',
      width: 140,
      render: (_, row) => {
        const remainingStr = formatRemaining(row, now);
        if (remainingStr === 'Expired') {
          return <span className="coupon-status coupon-status--expired">Expired</span>;
        }
        if (remainingStr === '—') {
          return <span className="coupon-muted">—</span>;
        }
        return (
          <span className="coupon-remain">
            <Clock3 size={13} />
            {remainingStr}
          </span>
        );
      },
    },
    {
      title: 'Created By',
      dataIndex: 'createdByName',
      key: 'createdBy',
      width: 160,
      ellipsis: true,
      render: (value?: string) => (
        <div className="coupon-meta">
          <Users size={14} />
          <span>{value || 'System'}</span>
        </div>
      ),
    },
    {
      title: 'Used By',
      key: 'usedBy',
      width: 150,
      ellipsis: true,
      render: (_, row) =>
        row.usedByName ? (
          <div className="coupon-meta coupon-meta--used">
            <UserCheck size={14} />
            <span>{row.usedByName}</span>
          </div>
        ) : (
          <span className="coupon-muted">Unused</span>
        ),
    },
    {
      title: 'Branch',
      dataIndex: 'branchName',
      key: 'branch',
      width: 150,
      ellipsis: true,
      render: (value?: string) => (
        <span className="emp-branch">
          <MapPin size={14} />
          {value ? shortBranch(value) : 'Unassigned'}
        </span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 110,
      render: (value: string) => (
        <span className={statusClass(value)}>{statusLabel(value)}</span>
      ),
    },
    {
      title: 'Actions',
      key: 'view',
      width: 80,
      fixed: 'right',
      render: (_, row) => (
        <Tooltip title="View Coupon Details">
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={(e) => {
              e.stopPropagation();
              setSelected(row);
            }}
            aria-label={`View coupon ${row.couponCode}`}
          />
        </Tooltip>
      ),
    },
  ];

  if (isLoading && (!items || items.length === 0)) {
    return <PageSkeleton variant="list" />;
  }

  return (
    <div className="coupon">
      <header className="coupon__hero">
        <div>
          <p className="coupon__kicker">Offers & Promotions</p>
          <h1>Coupon History</h1>
          <p className="coupon__sub">{roleHint}</p>
          <div className="coupon__ttl-note">
            <Clock3 size={14} />
            <span>Unused coupons automatically expire in 1 hour from creation</span>
          </div>
        </div>
        <div className="coupon__hero-actions">
          <div className="coupon__hero-meta">
            <Ticket size={18} />
            <div>
              <strong>{summary?.total ?? 0}</strong>
              <span>Issued</span>
            </div>
          </div>
          <Button type="primary" size="large" icon={<PlusOutlined />} onClick={openCreate}>
            Create Coupon
          </Button>
        </div>
      </header>

      {/* Stats Cards Section */}
      <section className="coupon__stats" aria-label="Coupon stats">
        <article className="coupon-stat">
          <span>Total</span>
          <strong>{summary?.total ?? '—'}</strong>
        </article>
        <article className="coupon-stat">
          <span>Active</span>
          <strong>{summary?.active ?? '—'}</strong>
        </article>
        <article className="coupon-stat">
          <span>Redeemed</span>
          <strong>{summary?.used ?? '—'}</strong>
        </article>
        <article className="coupon-stat">
          <span>Expired</span>
          <strong>{summary?.expired ?? '—'}</strong>
        </article>
        <article className="coupon-stat">
          <span>Value</span>
          <strong>{summary ? formatCurrency(summary.totalValue) : '—'}</strong>
        </article>
      </section>

      {/* Main Panel */}
      <section className="coupon__panel">
        <div className="coupon__toolbar">
          <Input
            allowClear
            size="large"
            prefix={<SearchOutlined />}
            placeholder="Search coupon code, name, creator, customer, branch…"
            value={params.search}
            onChange={(e) => setSearch(e.target.value)}
            className="coupon__search"
          />
          <Select
            allowClear
            size="large"
            placeholder="Filter by Branch"
            value={params.branchId}
            onChange={(value) => setBranchId(value)}
            options={[
              { value: '', label: 'All Branches' },
              ...branches.map((b) => ({
                value: b.id,
                label: shortBranch(b.name),
              })),
            ]}
            className="coupon__select"
          />
          <Select
            allowClear
            size="large"
            placeholder="Status"
            value={params.status}
            onChange={(value) => setStatus(value)}
            options={[
              { value: 'active', label: 'Active' },
              { value: 'used', label: 'Used' },
              { value: 'expired', label: 'Expired' },
              { value: 'inactive', label: 'Inactive' },
            ]}
            className="coupon__select"
          />
        </div>

        <Table
          rowKey="id"
          loading={isLoading || isFetching}
          columns={columns}
          dataSource={items}
          onRow={(row) => ({
            onClick: () => setSelected(row),
            style: { cursor: 'pointer' },
          })}
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="No coupons found matching your search"
              />
            ),
          }}
          pagination={{
            current: data?.page ?? params.page ?? 1,
            pageSize: data?.pageSize ?? params.pageSize ?? 20,
            total: data?.total ?? 0,
            showSizeChanger: true,
            pageSizeOptions: PAGE_SIZE_OPTIONS.map(String),
            onChange: (page, pageSize) => setPage(page, pageSize),
          }}
          scroll={{ x: 900 }}
        />
      </section>

      {/* Coupon Details Sidebar Drawer */}
      <Drawer
        title="Coupon"
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        width={460}
        destroyOnClose
        className="coupon-drawer"
      >
        {selected ? (
          <div className="coupon-detail">
            {/* Ticket Voucher Graphic Card */}
            <div className="coupon-voucher-card">
              <div className="coupon-voucher__header">
                <div>
                  <span className="coupon-voucher__kicker">Discount Voucher</span>
                  <div className="coupon-voucher__amount">
                    {formatCurrency(selected.price)}
                  </div>
                  <div className="coupon-voucher__name">
                    {selected.couponName || 'Untitled coupon'}
                  </div>
                </div>
                <span className={statusClass(selected.status)}>
                  {statusLabel(selected.status)}
                </span>
              </div>

              {/* Coupon Code Ticket Stub */}
              <div className="coupon-voucher__stub">
                <span className="coupon-voucher__code">{selected.couponCode}</span>
                <Button
                  size="small"
                  icon={<Copy size={13} />}
                  onClick={() => void copyCode(selected.couponCode)}
                  style={{ borderRadius: 8 }}
                >
                  Copy Code
                </Button>
              </div>
            </div>

            {/* Creation Info Card */}
            <div className="coupon-detail__card">
              <div className="coupon-detail__card-title">
                <Users size={15} />
                <span>Issued</span>
              </div>
              <div className="coupon-detail__grid">
                <div className="coupon-detail__grid-item">
                  <span className="coupon-detail__grid-label">Created By</span>
                  <span className="coupon-detail__grid-value">{selected.createdByName || 'System'}</span>
                </div>
                <div className="coupon-detail__grid-item">
                  <span className="coupon-detail__grid-label">Created At</span>
                  <span className="coupon-detail__grid-value">{formatDateTime(selected.createdAt)}</span>
                </div>
                <div className="coupon-detail__grid-item coupon-detail__grid-item--full">
                  <span className="coupon-detail__grid-label">Creator User ID</span>
                  <span className="coupon-detail__grid-value">{selected.createdBy || '—'}</span>
                </div>
              </div>
            </div>

            {/* Customer Usage Card */}
            <div className="coupon-detail__card">
              <div className="coupon-detail__card-title">
                <UserCheck size={15} />
                <span>Redemption</span>
              </div>
              <div className="coupon-detail__grid">
                <div className="coupon-detail__grid-item">
                  <span className="coupon-detail__grid-label">Used By Customer</span>
                  <span className="coupon-detail__grid-value">{selected.usedByName || 'Not Used Yet'}</span>
                </div>
                <div className="coupon-detail__grid-item">
                  <span className="coupon-detail__grid-label">Redeemed At</span>
                  <span className="coupon-detail__grid-value">
                    {selected.usedAt ? formatDateTime(selected.usedAt) : '—'}
                  </span>
                </div>
                <div className="coupon-detail__grid-item">
                  <span className="coupon-detail__grid-label">Customer ID</span>
                  <span className="coupon-detail__grid-value">{selected.usedBy || '—'}</span>
                </div>
                <div className="coupon-detail__grid-item">
                  <span className="coupon-detail__grid-label">Transaction ID</span>
                  <span className="coupon-detail__grid-value">{selected.transactionId || '—'}</span>
                </div>
              </div>
            </div>

            {/* Branch & Expiry Card */}
            <div className="coupon-detail__card">
              <div className="coupon-detail__card-title">
                <Clock3 size={15} />
                <span>Branch & expiry</span>
              </div>
              <div className="coupon-detail__grid">
                <div className="coupon-detail__grid-item">
                  <span className="coupon-detail__grid-label">Assigned Branch</span>
                  <span className="coupon-detail__grid-value">{shortBranch(selected.branchName) || 'Unassigned'}</span>
                </div>
                <div className="coupon-detail__grid-item">
                  <span className="coupon-detail__grid-label">Time Remaining</span>
                  <span className="coupon-detail__grid-value">
                    {formatRemaining(selected, now)}
                  </span>
                </div>
                <div className="coupon-detail__grid-item coupon-detail__grid-item--full">
                  <span className="coupon-detail__grid-label">Auto-Expiration Timestamp</span>
                  <span className="coupon-detail__grid-value">
                    {formatDateTime(getCouponExpiresAt(selected))}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </Drawer>

      {/* Add Coupon Modal Form */}
      <Drawer
        title="Issue coupon"
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        width={420}
        destroyOnClose
        extra={
          <Button
            type="primary"
            loading={create.isPending}
            onClick={() => void onSubmit()}
          >
            Issue Coupon
          </Button>
        }
      >
        <Form form={form} layout="vertical" requiredMark={false}>
          <Form.Item
            name="couponName"
            label="Coupon Name / Title"
            rules={[{ required: true, message: 'Enter a coupon title' }]}
          >
            <Input placeholder="e.g. Summer Special Welcome Pass" size="large" />
          </Form.Item>

          <Form.Item
            name="price"
            label="Discount Value (₹)"
            rules={[{ required: true, message: 'Enter a coupon value' }]}
          >
            <InputNumber
              min={1}
              prefix="₹"
              size="large"
              style={{ width: '100%' }}
            />
          </Form.Item>

          {/* Preset Buttons */}
          <div className="coupon-presets">
            {[100, 250, 500, 1000].map((amount) => (
              <button
                key={amount}
                type="button"
                className="coupon-preset"
                onClick={() => form.setFieldsValue({ price: amount })}
              >
                ₹{amount}
              </button>
            ))}
          </div>

          <Form.Item
            name="branchId"
            label="Target Branch"
            rules={[{ required: true, message: 'Select a branch' }]}
          >
            <Select
              size="large"
              placeholder="Select branch"
              options={branches.map((b) => ({
                value: b.id,
                label: shortBranch(b.name),
              }))}
              showSearch
              optionFilterProp="label"
            />
          </Form.Item>

          <div className="coupon-create-expiry">
            <Clock3 size={18} />
            <div>
              <strong>1-Hour Expiry Window</strong>
              <span>
                Coupons auto-expire at{' '}
                <strong>{formatDateTime(dayjs().add(1, 'hour').toISOString())}</strong>. Unused coupons cannot be redeemed after 1 hour.
              </span>
            </div>
          </div>
        </Form>
      </Drawer>
    </div>
  );
};
