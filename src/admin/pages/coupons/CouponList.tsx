import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import {
  Button,
  Drawer,
  Empty,
  Form,
  Input,
  InputNumber,
  Select,
  Tag,
  message,
} from 'antd';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Copy, MapPin, Ticket, UserRound } from 'lucide-react';
import { useMemo, useState } from 'react';
import { PageSkeleton } from '@/components/common';
import { PAGE_SIZE_OPTIONS } from '@/constants';
import { useBranches } from '@/hooks/useBranches';
import { useCouponMutations, useCoupons } from '@/hooks/useCoupons';
import { useTableParams } from '@/hooks/useTableParams';
import { useAuthStore } from '@/store/auth.store';
import type { Coupon } from '@/types';
import { formatCurrency, formatDateTime } from '@/utils/format';

dayjs.extend(relativeTime);

const shortBranch = (name: string) =>
  name
    .replace(/^Game On Fitness\s*/i, '')
    .replace(/^(Premium Club|Luxury Club)\s*-?\s*/i, '')
    .trim() || name;

const statusColor = (status: string) => {
  if (status === 'active') return 'success';
  if (status === 'used') return 'processing';
  if (status === 'inactive') return 'default';
  return 'default';
};

const initials = (name: string) => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
};

const copyCode = async (code: string) => {
  try {
    await navigator.clipboard.writeText(code);
    message.success('Coupon code copied');
  } catch {
    message.error('Could not copy code');
  }
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

  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();

  const roleHint =
    user?.role === 'Super Admin'
      ? 'Every coupon created across all branches'
      : 'Coupons created for your assigned branches';

  const summary = data?.summary;
  const items = data?.items ?? [];

  const recent = useMemo(() => items.slice(0, 4), [items]);

  const openCreate = () => {
    form.resetFields();
    form.setFieldsValue({ price: 0 });
    setOpen(true);
  };

  const onSubmit = async () => {
    const values = await form.validateFields();
    await create.mutateAsync({
      couponName: values.couponName,
      price: values.price,
      branchId: values.branchId,
    });
    setOpen(false);
  };

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
          <span>Total value</span>
          <strong>
            {summary ? formatCurrency(summary.totalValue) : '—'}
          </strong>
        </article>
      </section>

      {recent.length > 0 ? (
        <section className="coupon__recent" aria-label="Recently added">
          <div className="coupon__recent-head">
            <h2>Recently added</h2>
            <p>Who created it, when, and for which branch</p>
          </div>
          <div className="coupon__timeline">
            {recent.map((row, index) => (
              <CouponHistoryCard
                key={row.id}
                coupon={row}
                isLast={index === recent.length - 1}
              />
            ))}
          </div>
        </section>
      ) : null}

      <section className="coupon__panel">
        <div className="coupon__toolbar">
          <Input
            allowClear
            prefix={<SearchOutlined />}
            placeholder="Search code, name, creator, branch"
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
              { value: 'inactive', label: 'Inactive' },
            ]}
            className="coupon__select"
          />
        </div>

        <div className="coupon__list" aria-busy={isLoading || isFetching}>
          {items.length === 0 ? (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="No coupons found"
            />
          ) : (
            <>
              <div className="coupon-row coupon-row--head" aria-hidden>
                <span>Coupon</span>
                <span>Added by</span>
                <span>When</span>
                <span>Branch</span>
                <span>Status</span>
              </div>
              {items.map((row) => (
                <article key={row.id} className="coupon-row">
                  <div className="coupon-row__code">
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
                    <span className="coupon-row__price">
                      {formatCurrency(row.price)}
                    </span>
                  </div>

                  <div className="coupon-row__who">
                    <span className="coupon-row__avatar" aria-hidden>
                      {initials(row.createdByName)}
                    </span>
                    <div className="coupon-row__text">
                      <strong>{row.createdByName}</strong>
                      <span>Creator</span>
                    </div>
                  </div>

                  <div className="coupon-row__when">
                    <strong>{formatDateTime(row.createdAt)}</strong>
                    <span>{dayjs(row.createdAt).fromNow()}</span>
                  </div>

                  <div className="coupon-row__branch">
                    <MapPin size={15} />
                    <div className="coupon-row__text">
                      <strong>{shortBranch(row.branchName)}</strong>
                      <span>Location</span>
                    </div>
                  </div>

                  <div className="coupon-row__status">
                    <Tag color={statusColor(row.status)}>{row.status}</Tag>
                    {row.status === 'used' && row.usedByName ? (
                      <span className="txn__partial-meta">
                        Used by {row.usedByName}
                      </span>
                    ) : null}
                  </div>
                </article>
              ))}
            </>
          )}
        </div>

        {data && data.total > 0 ? (
          <div className="coupon__pager">
            <Button
              disabled={(data.page ?? 1) <= 1}
              onClick={() => setPage((data.page ?? 1) - 1, data.pageSize)}
            >
              Previous
            </Button>
            <span>
              Page {data.page} · {data.total} total
            </span>
            <Select
              value={data.pageSize}
              options={PAGE_SIZE_OPTIONS.map((size) => ({
                value: size,
                label: `${size} / page`,
              }))}
              onChange={(pageSize) => setPage(1, pageSize)}
              className="coupon__select"
            />
            <Button
              disabled={(data.page ?? 1) * (data.pageSize ?? 20) >= data.total}
              onClick={() => setPage((data.page ?? 1) + 1, data.pageSize)}
            >
              Next
            </Button>
          </div>
        ) : null}
      </section>

      <Drawer
        title="Add coupon"
        open={open}
        onClose={() => setOpen(false)}
        width={420}
        destroyOnClose
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
            <InputNumber min={0} prefix="₹" className="coupon__full" style={{ width: '100%' }} />
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
        </Form>
      </Drawer>
    </div>
  );
};

const CouponHistoryCard = ({
  coupon,
  isLast,
}: {
  coupon: Coupon;
  isLast: boolean;
}) => (
  <article className={`coupon-card${isLast ? ' is-last' : ''}`}>
    <div className="coupon-card__rail" aria-hidden>
      <span className="coupon-card__dot" />
      {!isLast ? <span className="coupon-card__line" /> : null}
    </div>

    <div className="coupon-card__body">
      <div className="coupon-card__top">
        <button
          type="button"
          className="coupon-row__chip"
          onClick={() => void copyCode(coupon.couponCode)}
          title="Copy code"
        >
          <span>{coupon.couponCode}</span>
          <Copy size={14} />
        </button>
        <Tag color={statusColor(coupon.status)}>{coupon.status}</Tag>
      </div>

      <h3>{coupon.couponName || 'Untitled coupon'}</h3>
      <p className="coupon-card__value">{formatCurrency(coupon.price)}</p>

      <div className="coupon-card__facts">
        <div>
          <UserRound size={14} />
          <div>
            <strong>{coupon.createdByName}</strong>
            <span>Added by</span>
          </div>
        </div>
        <div>
          <Ticket size={14} />
          <div>
            <strong>{dayjs(coupon.createdAt).fromNow()}</strong>
            <span>{formatDateTime(coupon.createdAt)}</span>
          </div>
        </div>
        <div>
          <MapPin size={14} />
          <div>
            <strong>{shortBranch(coupon.branchName)}</strong>
            <span>Branch</span>
          </div>
        </div>
      </div>
    </div>
  </article>
);
