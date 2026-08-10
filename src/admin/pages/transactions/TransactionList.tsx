import { EyeOutlined, SearchOutlined } from '@ant-design/icons';
import {
  Button,
  DatePicker,
  Drawer,
  Empty,
  Input,
  Select,
  Spin,
  Table,
  Tag,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { type Dayjs } from 'dayjs';
import { CreditCard, IndianRupee, Receipt } from 'lucide-react';
import { useMemo, useState } from 'react';
import { PageSkeleton } from '@/components/common';
import { PAGE_SIZE_OPTIONS } from '@/constants';
import { useBranches } from '@/hooks/useBranches';
import { useTableParams } from '@/hooks/useTableParams';
import {
  useTransactionSettlement,
  useTransactions,
} from '@/hooks/useTransactions';
import { useAuthStore } from '@/store/auth.store';
import type { PaymentTransaction, TransactionSettlement } from '@/types';
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

const paymentStatusLabel = (row: PaymentTransaction) => {
  const status = String(row.paymentStatus || '').toLowerCase();
  if (status === 'paid' && row.isPartial) return 'Partially paid';
  if (status === 'paid') return 'Paid';
  if (status === 'pending') return 'Pending';
  if (status === 'created') return 'Created';
  if (status === 'failed') return 'Failed';
  return row.paymentStatus || '—';
};

const paymentStatusColor = (row: PaymentTransaction) => {
  const status = String(row.paymentStatus || '').toLowerCase();
  if (status === 'paid' && row.isPartial) return 'orange';
  if (status === 'paid') return 'success';
  if (status === 'failed') return 'error';
  if (status === 'pending' || status === 'created') return 'warning';
  return 'default';
};

const settlementLabel = (
  row: PaymentTransaction | TransactionSettlement | null | undefined,
) => {
  if (!row) return 'Not routed';
  const routed =
    'routed' in row
      ? Boolean(row.routed)
      : Boolean(
          (row as PaymentTransaction).razorpayTransferId ||
            (row as PaymentTransaction).linkedAccountId,
        );
  if (!routed) return 'Not routed';

  const status = String(
    ('settlementStatus' in row && row.settlementStatus) ||
      (row as PaymentTransaction).settlementStatus ||
      '',
  ).toLowerCase();
  const onHold =
    ('onHold' in row && row.onHold) ||
    Boolean((row as PaymentTransaction).onHold);

  if (status === 'settled') return 'Settled';
  if (status === 'on_hold' || onHold) return 'On hold';
  if (status === 'pending') return 'Pending';
  return status ? status : 'Pending';
};

const settlementColor = (
  row: PaymentTransaction | TransactionSettlement | null | undefined,
) => {
  const label = settlementLabel(row);
  if (label === 'Settled') return 'success';
  if (label === 'On hold') return 'warning';
  if (label === 'Pending') return 'processing';
  return 'default';
};

const settlementWhenText = (
  settlement: TransactionSettlement | null | undefined,
  fallback: PaymentTransaction | null,
) => {
  const settledAt = settlement?.settledAt || fallback?.settledAt;
  if (settledAt) return `Settled at ${formatDateTime(settledAt)}`;

  const onHold =
    settlement?.onHold ?? fallback?.onHold ?? false;
  const onHoldUntil = settlement?.onHoldUntil || fallback?.onHoldUntil;
  if (onHold || String(settlement?.settlementStatus || fallback?.settlementStatus || '').toLowerCase() === 'on_hold') {
    return onHoldUntil
      ? `On hold until ${formatDateTime(onHoldUntil)}`
      : 'On hold';
  }

  const routed =
    settlement?.routed ??
    Boolean(fallback?.razorpayTransferId || fallback?.linkedAccountId);
  if (!routed) return '—';

  return (
    settlement?.settlementHint ||
    'Pending — settles per linked account schedule'
  );
};

const dueAmount = (row: PaymentTransaction) => {
  if (!row.isPartial || row.packageAmount == null) return 0;
  return Math.max(0, Number(row.packageAmount) - Number(row.amount || 0));
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

const RouteSettlementSection = ({
  transaction,
}: {
  transaction: PaymentTransaction;
}) => {
  const { data: settlement, isLoading, isFetching, isError } =
    useTransactionSettlement(transaction.id, true);

  const routed =
    settlement?.routed ??
    Boolean(transaction.razorpayTransferId || transaction.linkedAccountId);
  const transferAmount =
    settlement?.transferAmount ?? transaction.transferAmount ?? null;
  const linkedAccountId =
    settlement?.linkedAccountId ?? transaction.linkedAccountId ?? null;
  const transferId =
    settlement?.transferId ?? transaction.razorpayTransferId ?? null;
  const paymentId =
    settlement?.paymentId ?? transaction.razorpayPaymentId ?? null;

  return (
    <section className="txn-detail__section txn-detail__section--route">
      <h4>Razorpay Route</h4>
      {isLoading ? (
        <div className="txn-route__loading">
          <Spin size="small" />
          <span>Checking settlement…</span>
        </div>
      ) : (
        <>
          <div className="txn-route__flow" aria-label="Route flow">
            <div>
              <span>Customer paid</span>
              <strong>
                {formatCurrency(settlement?.paidAmount ?? transaction.amount)}
              </strong>
              <small>Main Razorpay account</small>
            </div>
            <div className="txn-route__arrow" aria-hidden>
              →
            </div>
            <div>
              <span>Routed to linked</span>
              <strong>
                {routed && transferAmount != null
                  ? formatCurrency(transferAmount)
                  : '—'}
              </strong>
              <small>{linkedAccountId || 'No linked account'}</small>
            </div>
          </div>

          <dl>
            <div>
              <dt>Settlement status</dt>
              <dd>
                <Tag
                  bordered={false}
                  color={settlementColor(settlement ?? transaction)}
                  className="txn__tag"
                >
                  {settlementLabel(settlement ?? transaction)}
                </Tag>
                {isFetching && !isLoading ? (
                  <span className="txn-route__refresh">Refreshing…</span>
                ) : null}
              </dd>
            </div>
            <DetailField
              label="When"
              value={settlementWhenText(settlement, transaction)}
            />
            <DetailField label="Linked account" value={linkedAccountId} />
            <DetailField label="Transfer ID" value={transferId} />
            <DetailField label="Payment ID" value={paymentId} />
            <DetailField
              label="Transfer status"
              value={
                settlement?.transferStatus || transaction.transferStatus
              }
            />
            {isError ? (
              <DetailField
                label="Note"
                value="Could not refresh from Razorpay — showing saved data"
              />
            ) : null}
            <DetailField
              label="Hint"
              value={
                settlement?.settlementHint ||
                (routed
                  ? 'Settles to linked account as per its Razorpay schedule (T+N)'
                  : 'Not routed — cash or no linked account')
              }
            />
          </dl>
        </>
      )}
    </section>
  );
};

export const TransactionList = () => {
  const user = useAuthStore((s) => s.user);
  const { params, setSearch, setBranchId, setStatus, setPage, setParams } =
    useTableParams({ pageSize: 20 });
  const [type, setType] = useState<string | undefined>();
  const [range, setRange] = useState<[Dayjs | null, Dayjs | null] | null>(null);
  const [selected, setSelected] = useState<PaymentTransaction | null>(null);

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

  const selectedDue = selected ? dueAmount(selected) : 0;

  const columns: ColumnsType<PaymentTransaction> = [
    {
      title: 'Date',
      key: 'date',
      width: 150,
      render: (_, row) => formatDateTime(row.paidAt || row.createdAt),
    },
    {
      title: 'Customer',
      key: 'customer',
      ellipsis: true,
      render: (_, row) => row.userName || '—',
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
      title: 'Item',
      key: 'item',
      ellipsis: true,
      render: (_, row) => row.itemName || typeLabel(row.type),
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      align: 'right',
      width: 110,
      render: (value: number) => (
        <span className="txn__amount">{formatCurrency(value)}</span>
      ),
    },
    {
      title: 'Payment status',
      key: 'paymentStatus',
      width: 130,
      render: (_, row) => (
        <Tag
          bordered={false}
          color={paymentStatusColor(row)}
          className="txn__tag"
        >
          {paymentStatusLabel(row)}
        </Tag>
      ),
    },
    {
      title: 'Method',
      dataIndex: 'paymentMethod',
      key: 'method',
      width: 90,
      render: (value?: string) => value || '—',
    },
    {
      title: 'Settlement',
      key: 'settlement',
      width: 110,
      render: (_, row) => (
        <Tag
          bordered={false}
          color={settlementColor(row)}
          className="txn__tag"
        >
          {settlementLabel(row)}
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
          aria-label={`View transaction ${row.id}`}
        />
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
          scroll={{ x: 1020 }}
        />
      </section>

      <p className="txn__hint">
        <CreditCard size={14} />
        Super Admin sees every branch. Admin and Manager see assigned branches
        only.
        <IndianRupee size={14} />
      </p>

      <Drawer
        title="Transaction details"
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        width={440}
        destroyOnHidden
        className="txn-drawer"
      >
        {selected ? (
          <div className="txn-detail">
            <div className="txn-detail__head">
              <div>
                <p className="txn-detail__kicker">Amount paid</p>
                <strong className="txn-detail__amount">
                  {formatCurrency(selected.amount)}
                </strong>
              </div>
              <div className="txn-detail__badges">
                <Tag
                  bordered={false}
                  color={paymentStatusColor(selected)}
                  className="txn__tag"
                >
                  {paymentStatusLabel(selected)}
                </Tag>
              </div>
            </div>

            <section className="txn-detail__section">
              <h4>Customer</h4>
              <dl>
                <DetailField label="Name" value={selected.userName} />
                <DetailField label="Mobile" value={selected.userMobile} />
                <DetailField label="Customer ID" value={selected.userId} />
                <DetailField
                  label="Branch"
                  value={
                    selected.branchName
                      ? shortBranch(selected.branchName)
                      : undefined
                  }
                />
              </dl>
            </section>

            <section className="txn-detail__section">
              <h4>Purchase</h4>
              <dl>
                <DetailField
                  label="Item"
                  value={selected.itemName || typeLabel(selected.type)}
                />
                <DetailField label="Type" value={typeLabel(selected.type)} />
                <DetailField label="Quantity" value={selected.qty} />
                <DetailField
                  label="Subscription ID"
                  value={selected.subscriptionId}
                />
                <DetailField label="Session ID" value={selected.sessionId} />
                <DetailField label="Event ID" value={selected.eventId} />
                <DetailField label="Trainer ID" value={selected.trainerId} />
                <DetailField label="Purchase ID" value={selected.purchaseId} />
              </dl>
            </section>

            <section className="txn-detail__section">
              <h4>Payment breakdown</h4>
              <dl>
                <DetailField
                  label="Paid amount"
                  value={formatCurrency(selected.amount)}
                />
                <DetailField
                  label="Package amount"
                  value={
                    selected.packageAmount != null
                      ? formatCurrency(selected.packageAmount)
                      : undefined
                  }
                />
                <DetailField
                  label="Amount due"
                  value={
                    selected.isPartial && selectedDue > 0
                      ? formatCurrency(selectedDue)
                      : selected.isPartial
                        ? formatCurrency(0)
                        : undefined
                  }
                />
                <DetailField
                  label="Original amount"
                  value={
                    selected.originalAmount != null
                      ? formatCurrency(selected.originalAmount)
                      : undefined
                  }
                />
                <DetailField label="Coupon code" value={selected.couponCode} />
                <DetailField
                  label="Coupon discount"
                  value={
                    selected.couponDiscount != null
                      ? `−${formatCurrency(selected.couponDiscount)}`
                      : undefined
                  }
                />
                <DetailField label="Coupon ID" value={selected.couponId} />
                <DetailField label="Currency" value={selected.currency} />
              </dl>
            </section>

            <section className="txn-detail__section">
              <h4>Payment info</h4>
              <dl>
                <DetailField
                  label="Payment method"
                  value={selected.paymentMethod}
                />
                <DetailField label="Receipt" value={selected.receipt} />
                <DetailField
                  label="Razorpay order ID"
                  value={selected.razorpayOrderId}
                />
                <DetailField
                  label="Razorpay payment ID"
                  value={selected.razorpayPaymentId}
                />
                <DetailField
                  label="Approved by"
                  value={selected.approvedByName}
                />
                <DetailField
                  label="Approved at"
                  value={
                    selected.approvedAt
                      ? formatDateTime(selected.approvedAt)
                      : undefined
                  }
                />
                <DetailField
                  label="Failure reason"
                  value={selected.failureReason}
                />
              </dl>
            </section>

            <RouteSettlementSection transaction={selected} />

            <section className="txn-detail__section">
              <h4>Record</h4>
              <dl>
                <DetailField label="Transaction ID" value={selected.id} />
                <DetailField
                  label="Paid at"
                  value={
                    selected.paidAt
                      ? formatDateTime(selected.paidAt)
                      : undefined
                  }
                />
                <DetailField
                  label="Created at"
                  value={formatDateTime(selected.createdAt)}
                />
                <DetailField
                  label="Updated at"
                  value={
                    selected.updatedAt
                      ? formatDateTime(selected.updatedAt)
                      : undefined
                  }
                />
              </dl>
            </section>
          </div>
        ) : null}
      </Drawer>
    </div>
  );
};
