import { SearchOutlined } from '@ant-design/icons';
import { DatePicker, Empty, Input, Select, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs, { type Dayjs } from 'dayjs';
import { CreditCard, IndianRupee, Receipt } from 'lucide-react';
import { useMemo, useState } from 'react';
import { PageSkeleton } from '@/components/common';
import { PAGE_SIZE_OPTIONS } from '@/constants';
import { useBranches } from '@/hooks/useBranches';
import { useTableParams } from '@/hooks/useTableParams';
import { useTransactions } from '@/hooks/useTransactions';
import { useAuthStore } from '@/store/auth.store';
import type { PaymentTransaction } from '@/types';
import { formatCurrency, formatDateTime } from '@/utils/format';

const shortBranch = (name: string) =>
  name
    .replace(/^Game On Fitness\s*/i, '')
    .replace(/^(Premium Club|Luxury Club)\s*-?\s*/i, '')
    .trim() || name;

const typeLabel = (type: string) => {
  const map: Record<string, string> = {
    subscription: 'Subscription',
    sessions: 'PT Sessions',
    events: 'Event',
  };
  return map[type] ?? type;
};

const statusColor = (status: string) => {
  if (status === 'paid') return 'success';
  if (status === 'failed') return 'error';
  if (status === 'pending' || status === 'created') return 'warning';
  return 'default';
};

export const TransactionList = () => {
  const user = useAuthStore((s) => s.user);
  const { params, setSearch, setBranchId, setStatus, setPage, setParams } =
    useTableParams({ pageSize: 20 });
  const [type, setType] = useState<string | undefined>();
  const [range, setRange] = useState<[Dayjs | null, Dayjs | null] | null>(null);

  const listParams = useMemo(
    () => ({
      ...params,
      type,
      paymentStatus: params.status,
      startDate: range?.[0]?.format('YYYY-MM-DD'),
      endDate: range?.[1]?.format('YYYY-MM-DD'),
    }),
    [params, type, range],
  );

  const { data, isLoading, isFetching } = useTransactions(listParams);
  const { data: branchesData } = useBranches({ page: 1, pageSize: 200 });
  const branches = branchesData?.data ?? [];

  const roleHint =
    user?.role === 'Super Admin'
      ? 'Showing payments across all branches'
      : 'Showing payments for your assigned branches';

  const columns: ColumnsType<PaymentTransaction> = [
    {
      title: 'Date',
      key: 'date',
      width: 160,
      render: (_, row) => formatDateTime(row.paidAt || row.createdAt),
    },
    {
      title: 'Customer',
      key: 'customer',
      render: (_, row) => (
        <div className="txn__person">
          <strong>{row.userName || '—'}</strong>
          <span>{row.userMobile || 'No mobile'}</span>
        </div>
      ),
    },
    {
      title: 'Branch',
      dataIndex: 'branchName',
      key: 'branch',
      render: (value?: string) => (value ? shortBranch(value) : '—'),
    },
    {
      title: 'Item',
      key: 'item',
      render: (_, row) => (
        <div className="txn__person">
          <strong>{row.itemName || typeLabel(row.type)}</strong>
          <span>{typeLabel(row.type)}</span>
        </div>
      ),
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      align: 'right',
      width: 168,
      render: (value: number, row) => {
        const pending =
          row.isPartial && row.packageAmount != null
            ? Math.max(0, Number(row.packageAmount) - Number(value || 0))
            : 0;
        return (
          <div className="txn__money">
            <strong className="txn__amount">{formatCurrency(value)}</strong>
            {row.isPartial ? (
              <div className="txn__partial">
                <span className="txn__chip txn__chip--partial">Partial</span>
                {row.packageAmount != null ? (
                  <span className="txn__partial-meta">
                    Full {formatCurrency(row.packageAmount)}
                    {pending > 0
                      ? ` · Due ${formatCurrency(pending)}`
                      : ''}
                  </span>
                ) : null}
              </div>
            ) : null}
            {row.couponCode ? (
              <span className="txn__partial-meta">
                Coupon {row.couponCode}
                {row.couponDiscount != null
                  ? ` · −${formatCurrency(row.couponDiscount)}`
                  : ''}
              </span>
            ) : null}
          </div>
        );
      },
    },
    {
      title: 'Status',
      dataIndex: 'paymentStatus',
      key: 'status',
      width: 120,
      render: (value: string, row) => (
        <div className="txn__status">
          <Tag
            bordered={false}
            color={statusColor(value)}
            className="txn__tag"
          >
            {value}
          </Tag>
          {row.isPartial ? (
            <Tag bordered={false} color="orange" className="txn__tag">
              partial
            </Tag>
          ) : null}
        </div>
      ),
    },
    {
      title: 'Payment',
      key: 'payment',
      render: (_, row) => (
        <div className="txn__person">
          <strong>{row.paymentMethod || '—'}</strong>
          <span>
            {row.approvedByName
              ? `Approved by ${row.approvedByName}`
              : row.receipt || row.razorpayPaymentId || '—'}
          </span>
        </div>
      ),
    },
  ];

  const summary = data?.summary;

  if (isLoading && !data?.items?.length) {
    return <PageSkeleton variant="list" />;
  }

  return (
    <div className="txn">
      <header className="txn__hero">
        <div>
          <p className="txn__kicker">Payments</p>
          <h1>Transaction history</h1>
          <p className="txn__sub">{roleHint}</p>
        </div>
        <div className="txn__hero-meta">
          <Receipt size={18} />
          <div>
            <strong>{data?.total ?? 0}</strong>
            <span>records</span>
          </div>
        </div>
      </header>

      <section className="txn__stats" aria-label="Payment stats">
        <article className="txn-stat">
          <span>Paid amount</span>
          <strong>
            {summary ? formatCurrency(summary.paidAmount) : '—'}
          </strong>
        </article>
        <article className="txn-stat">
          <span>Paid</span>
          <strong>{summary?.paidCount ?? '—'}</strong>
        </article>
        <article className="txn-stat">
          <span>Pending</span>
          <strong>{summary?.pendingCount ?? '—'}</strong>
        </article>
        <article className="txn-stat">
          <span>Failed</span>
          <strong>{summary?.failedCount ?? '—'}</strong>
        </article>
      </section>

      <section className="txn__panel">
        <div className="txn__toolbar">
          <Input
            allowClear
            prefix={<SearchOutlined />}
            placeholder="Search name, mobile, receipt, order id"
            value={params.search}
            onChange={(e) => setSearch(e.target.value)}
            className="txn__search"
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
            className="txn__select"
          />
          <Select
            allowClear
            placeholder="Type"
            value={type}
            onChange={(value) => {
              setType(value);
              setParams((prev) => ({ ...prev, page: 1 }));
            }}
            options={[
              { value: 'subscription', label: 'Subscription' },
              { value: 'sessions', label: 'PT Sessions' },
              { value: 'events', label: 'Events' },
            ]}
            className="txn__select"
          />
          <Select
            allowClear
            placeholder="Status"
            value={params.status}
            onChange={(value) => setStatus(value)}
            options={[
              { value: 'paid', label: 'Paid' },
              { value: 'pending', label: 'Pending' },
              { value: 'created', label: 'Created' },
              { value: 'failed', label: 'Failed' },
            ]}
            className="txn__select"
          />
          <DatePicker.RangePicker
            value={range}
            onChange={(value) => {
              setRange(value);
              setParams((prev) => ({ ...prev, page: 1 }));
            }}
            className="txn__range"
          />
        </div>

        <Table
          rowKey="id"
          loading={isLoading || isFetching}
          columns={columns}
          dataSource={data?.items ?? []}
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="No transactions found"
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
          scroll={{ x: 980 }}
        />
      </section>

      <p className="txn__hint">
        <CreditCard size={14} />
        Super Admin sees every branch. Admin and Manager see assigned branches
        only.
        <IndianRupee size={14} />
      </p>
    </div>
  );
};
