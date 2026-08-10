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
  Tag,
  message,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { Clock3, Copy, Ticket } from 'lucide-react';
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

const statusColor = (status: string) => {
  if (status === 'active') return 'success';
  if (status === 'used') return 'processing';
  if (status === 'expired') return 'error';
  if (status === 'inactive') return 'default';
  return 'default';
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
    message.success('Coupon code copied');
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

const DetailField = ({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) => (
  <div>
    <dt>{label}</dt>
    <dd>{value != null && value !== '' ? value : '—'}</dd>
  </div>
);

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
      ? 'Every coupon created across all branches'
      : 'Coupons created for your assigned branches';

  const summary = data?.summary;
  const items = data?.items ?? [];

  const hasActive = useMemo(
    () => items.some((row) => row.status === 'active'),
    [items],
  );
  const now = useNowTicker(hasActive || createOpen);

  const openCreate = () => {
    form.resetFields();
    form.setFieldsValue({ price: 0 });
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
    message.info(`Expires at ${formatDateTime(expiresAt)} (1 hour)`);
    setCreateOpen(false);
  };

  const columns: ColumnsType<Coupon> = [
    {
      title: 'Coupon',
      key: 'coupon',
      render: (_, row) => (
        <div className="coupon-cell">
          <button
            type="button"
            className="coupon-row__chip"
            onClick={() => void copyCode(row.couponCode)}
            title="Copy code"
          >
            <span>{row.couponCode}</span>
            <Copy size={14} />
          </button>
          <strong>{row.couponName || 'Untitled coupon'}</strong>
        </div>
      ),
    },
    {
      title: 'Value',
      dataIndex: 'price',
      key: 'price',
      width: 100,
      align: 'right',
      render: (value: number) => formatCurrency(value),
    },
    {
      title: 'Created by',
      dataIndex: 'createdByName',
      key: 'createdBy',
      width: 150,
      ellipsis: true,
      render: (value?: string) => value || '—',
    },
    {
      title: 'Used by',
      key: 'usedBy',
      width: 140,
      ellipsis: true,
      render: (_, row) => row.usedByName || '—',
    },
    {
      title: 'Branch',
      dataIndex: 'branchName',
      key: 'branch',
      width: 140,
      ellipsis: true,
      render: (value?: string) => (value ? shortBranch(value) : '—'),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 110,
      render: (value: string) => (
        <Tag bordered={false} color={statusColor(value)} className="coupon__tag">
          {statusLabel(value)}
        </Tag>
      ),
    },
    {
      title: '',
      key: 'view',
      width: 56,
      fixed: 'right',
      render: (_, row) => (
        <Button
          type="text"
          icon={<EyeOutlined />}
          onClick={() => setSelected(row)}
          aria-label={`View coupon ${row.couponCode}`}
        />
      ),
    },
  ];

  if (isLoading && !items.length) {
    return <PageSkeleton variant="list" />;
  }

  return (
    <div className="coupon">
      <header className="coupon__hero">
        <div>
          <p className="coupon__kicker">Offers</p>
          <h1>Coupon history</h1>
          <p className="coupon__sub">{roleHint}</p>
          <p className="coupon__ttl-note">
            Unused coupons expire in exactly 1 hour and cannot be used after that
          </p>
        </div>
        <div className="coupon__hero-actions">
          <div className="coupon__hero-meta">
            <Ticket size={18} />
            <div>
              <strong>{summary?.total ?? 0}</strong>
              <span>created</span>
            </div>
          </div>
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
            Add coupon
          </Button>
        </div>
      </header>

      <section className="coupon__stats" aria-label="Coupon stats">
        <article className="coupon-stat">
          <span>Total coupons</span>
          <strong>{summary?.total ?? '—'}</strong>
        </article>
        <article className="coupon-stat">
          <span>Active</span>
          <strong>{summary?.active ?? '—'}</strong>
        </article>
        <article className="coupon-stat">
          <span>Used</span>
          <strong>{summary?.used ?? '—'}</strong>
        </article>
        <article className="coupon-stat">
          <span>Expired</span>
          <strong>{summary?.expired ?? '—'}</strong>
        </article>
        <article className="coupon-stat">
          <span>Total value</span>
          <strong>
            {summary ? formatCurrency(summary.totalValue) : '—'}
          </strong>
        </article>
      </section>

      <section className="coupon__panel">
        <div className="coupon__toolbar">
          <Input
            allowClear
            prefix={<SearchOutlined />}
            placeholder="Search code, name, creator, customer, branch"
            value={params.search}
            onChange={(e) => setSearch(e.target.value)}
            className="coupon__search"
          />
          <Select
            allowClear
            placeholder="Branch"
            value={params.branchId}
            onChange={(value) => setBranchId(value)}
            options={branches.map((b) => ({
              value: b.id,
              label: shortBranch(b.name),
            }))}
            className="coupon__select"
          />
          <Select
            allowClear
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
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="No coupons found"
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
          scroll={{ x: 860 }}
        />
      </section>

      <Drawer
        title="Coupon details"
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        width={440}
        destroyOnHidden
        className="coupon-drawer"
      >
        {selected ? (
          <div className="coupon-detail">
            <div className="coupon-detail__head">
              <div>
                <p className="coupon-detail__kicker">Coupon value</p>
                <strong className="coupon-detail__amount">
                  {formatCurrency(selected.price)}
                </strong>
                <p className="coupon-detail__name">
                  {selected.couponName || 'Untitled coupon'}
                </p>
              </div>
              <Tag
                bordered={false}
                color={statusColor(selected.status)}
                className="coupon__tag"
              >
                {statusLabel(selected.status)}
              </Tag>
            </div>

            <button
              type="button"
              className="coupon-row__chip coupon-detail__code"
              onClick={() => void copyCode(selected.couponCode)}
              title="Copy code"
            >
              <span>{selected.couponCode}</span>
              <Copy size={14} />
            </button>

            <section className="coupon-detail__section">
              <h4>Created</h4>
              <dl>
                <DetailField
                  label="Created by"
                  value={selected.createdByName}
                />
                <DetailField
                  label="Created at"
                  value={formatDateTime(selected.createdAt)}
                />
                <DetailField label="Creator ID" value={selected.createdBy} />
              </dl>
            </section>

            <section className="coupon-detail__section">
              <h4>Customer usage</h4>
              <dl>
                <DetailField
                  label="Used by customer"
                  value={selected.usedByName}
                />
                <DetailField label="Customer ID" value={selected.usedBy} />
                <DetailField
                  label="Used at"
                  value={
                    selected.usedAt
                      ? formatDateTime(selected.usedAt)
                      : undefined
                  }
                />
                <DetailField
                  label="Transaction ID"
                  value={selected.transactionId}
                />
              </dl>
            </section>

            <section className="coupon-detail__section">
              <h4>Branch & expiry</h4>
              <dl>
                <DetailField
                  label="Branch"
                  value={shortBranch(selected.branchName)}
                />
                <DetailField label="Branch ID" value={selected.branchId} />
                <DetailField
                  label="Expires at"
                  value={formatDateTime(getCouponExpiresAt(selected))}
                />
                <DetailField
                  label="Time remaining"
                  value={formatRemaining(selected, now)}
                />
              </dl>
            </section>

            <section className="coupon-detail__section">
              <h4>Record</h4>
              <dl>
                <DetailField label="Coupon ID" value={selected.id} />
                <DetailField
                  label="Status"
                  value={statusLabel(selected.status)}
                />
              </dl>
            </section>
          </div>
        ) : null}
      </Drawer>

      <Drawer
        title="Add coupon"
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        width={420}
        destroyOnHidden
        extra={
          <Button
            type="primary"
            loading={create.isPending}
            onClick={() => void onSubmit()}
          >
            Create
          </Button>
        }
      >
        <Form form={form} layout="vertical" requiredMark={false}>
          <Form.Item
            name="couponName"
            label="Coupon name"
            rules={[{ required: true, message: 'Enter a coupon name' }]}
          >
            <Input placeholder="e.g. Summer welcome offer" />
          </Form.Item>
          <Form.Item
            name="price"
            label="Value"
            rules={[{ required: true, message: 'Enter a value' }]}
          >
            <InputNumber
              min={0}
              prefix="₹"
              className="coupon__full"
              style={{ width: '100%' }}
            />
          </Form.Item>
          <Form.Item
            name="branchId"
            label="Branch"
            rules={[{ required: true, message: 'Select a branch' }]}
          >
            <Select
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
            <Clock3 size={16} aria-hidden />
            <div>
              <strong>Auto-expires in 1 hour</strong>
              <span>
                If unused, it expires at{' '}
                {formatDateTime(dayjs().add(1, 'hour').toISOString())} and
                cannot be used by any user.
              </span>
            </div>
          </div>
        </Form>
      </Drawer>
    </div>
  );
};
