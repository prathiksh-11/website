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
import { Banknote, Building2, Calendar, Clock, CreditCard, Dumbbell, FileText, IndianRupee, Phone, Receipt, ShieldCheck, Ticket, User, Wallet } from 'lucide-react';
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

const shortBranch = (name?: string) => {
  if (!name) return '—';
  return (
    name
      .replace(/^Game On Fitness\s*/i, '')
      .replace(/^(Premium Club|Luxury Club)\s*-?\s*/i, '')
      .trim() || name
  );
};

const typeLabel = (type: string) => {
  const map: Record<string, string> = {
    subscription: 'Subscription',
    sessions: 'PT Sessions',
    events: 'Event',
  };
  return map[type] ?? type;
};

const stillPartial = (row: PaymentTransaction) =>
  Boolean(row.isPartial) && Number(row.amountPending || 0) > 0.009;

const getEffectiveAmount = (row: PaymentTransaction) => {
  const couponDisc = Number(row.couponDiscount || 0);
  const origAmt =
    row.originalAmount != null
      ? Number(row.originalAmount)
      : row.packageAmount != null
        ? Number(row.packageAmount)
        : null;
  const rawAmt = Number(row.amount || 0);

  if (
    couponDisc > 0 &&
    origAmt != null &&
    !stillPartial(row) &&
    Math.abs(rawAmt - origAmt) < 0.01
  ) {
    return Math.max(0, origAmt - couponDisc);
  }
  return rawAmt;
};

const paymentStatusLabel = (row: PaymentTransaction) => {
  const status = String(row.paymentStatus || '').toLowerCase();
  if (status === 'paid' && stillPartial(row)) return 'Partially paid';
  if (status === 'paid') return 'Paid';
  if (status === 'pending') return 'Pending';
  if (status === 'created') return 'Created';
  if (status === 'failed') return 'Failed';
  return row.paymentStatus || '—';
};

const paymentStatusColor = (row: PaymentTransaction) => {
  const status = String(row.paymentStatus || '').toLowerCase();
  if (status === 'paid' && stillPartial(row)) return 'orange';
  if (status === 'paid') return 'success';
  if (status === 'failed') return 'error';
  if (status === 'pending' || status === 'created') return 'warning';
  return 'default';
};

const isCashPayment = (row: PaymentTransaction) =>
  String(row.paymentMethod || '').toLowerCase() === 'cash';

const cleanSettlementHint = (hint?: string | null) => {
  if (!hint) return null;
  if (
    hint.includes('insufficient_account_balance') ||
    hint.includes('insufficient balance')
  ) {
    return 'Payment captured successfully. Expected bank settlement ~ T+2 working days.';
  }
  return hint;
};

const settlementLabel = (
  row: PaymentTransaction | TransactionSettlement | null | undefined,
) => {
  if (!row) return 'Not routed';
  if ('paymentMethod' in row && isCashPayment(row as PaymentTransaction)) {
    return '—';
  }

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

  const paymentStatus = String(
    ('paymentStatus' in row && (row as PaymentTransaction).paymentStatus) ||
    'paid',
  ).toLowerCase();

  if (paymentStatus === 'failed') return 'Failed';

  return 'Pending';
};

const settlementColor = (
  row: PaymentTransaction | TransactionSettlement | null | undefined,
) => {
  const label = settlementLabel(row);
  if (label === 'Settled') return 'success';
  if (label === 'On hold') return 'warning';
  if (label === 'Pending') return 'processing';
  if (label === 'Failed') return 'error';
  return 'default';
};

const money = (value?: number | null) =>
  value != null ? formatCurrency(value) : '—';

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

const BreakdownRow = ({
  label,
  value,
  tone,
  emphasis,
}: {
  label: string;
  value: string;
  tone?: 'deduct' | 'receive' | 'neutral';
  emphasis?: boolean;
}) => (
  <div
    className={[
      'txn-route__row',
      tone ? `txn-route__row--${tone}` : '',
      emphasis ? 'txn-route__row--emphasis' : '',
    ]
      .filter(Boolean)
      .join(' ')}
  >
    <span>{label}</span>
    <strong>{value}</strong>
  </div>
);

const RouteSettlementSection = ({
  transaction,
}: {
  transaction: PaymentTransaction;
}) => {
  const cash = isCashPayment(transaction);
  const { data: settlement, isLoading, isFetching, isError } =
    useTransactionSettlement(transaction.id, !cash);

  if (cash) return null;

  const paidAmount = settlement?.paidAmount ?? transaction.amount;
  const merchantBranchName =
    settlement?.merchantBranchName ?? transaction.merchantBranchName ?? null;
  const razorpayFee = settlement?.razorpayFee ?? transaction.razorpayFee ?? null;
  const razorpayTax = settlement?.razorpayTax ?? transaction.razorpayTax ?? null;
  const transferFees =
    settlement?.transferFees ?? transaction.transferFees ?? null;
  const transferTax =
    settlement?.transferTax ?? transaction.transferTax ?? null;
  const receivingAmount =
    settlement?.receivingAmount ?? transaction.receivingAmount ?? null;
  const settledAt = settlement?.settledAt ?? transaction.settledAt ?? null;
  const settlesAt = settlement?.settlesAt ?? transaction.settlesAt ?? null;
  const settlementHint =
    settlement?.settlementHint ?? transaction.settlementHint ?? null;
  const transferError =
    settlement?.transferError ?? transaction.transferError ?? null;
  const settlementUtr =
    settlement?.settlementUtr ?? transaction.settlementUtr ?? null;

  const hasFeeBreakdown =
    razorpayFee != null ||
    razorpayTax != null ||
    transferFees != null ||
    transferTax != null;
  const deductedAmount =
    receivingAmount != null
      ? Math.max(0, Math.round((paidAmount - receivingAmount) * 100) / 100)
      : null;

  return (
    <section className="txn-detail__section txn-detail__section--route">
      <h4>Razorpay breakdown</h4>
      {isLoading ? (
        <div className="txn-route__loading">
          <Spin size="small" />
          <span>Checking settlement…</span>
        </div>
      ) : (
        <>
          <div className="txn-route__card">
            <BreakdownRow
              label="Customer paid"
              value={money(paidAmount)}
              tone="neutral"
            />
            {hasFeeBreakdown ? (
              <>
                {razorpayFee != null ? (
                  <BreakdownRow
                    label="Razorpay fee"
                    value={`−${money(razorpayFee)}`}
                    tone="deduct"
                  />
                ) : null}
                {razorpayTax != null && razorpayTax > 0 ? (
                  <BreakdownRow
                    label="Razorpay tax"
                    value={`−${money(razorpayTax)}`}
                    tone="deduct"
                  />
                ) : null}
                {transferFees != null && transferFees > 0 ? (
                  <BreakdownRow
                    label="Transfer fee"
                    value={`−${money(transferFees)}`}
                    tone="deduct"
                  />
                ) : null}
                {transferTax != null && transferTax > 0 ? (
                  <BreakdownRow
                    label="Transfer tax"
                    value={`−${money(transferTax)}`}
                    tone="deduct"
                  />
                ) : null}
              </>
            ) : deductedAmount != null && deductedAmount > 0 ? (
              <BreakdownRow
                label="Razorpay deduction"
                value={`−${money(deductedAmount)}`}
                tone="deduct"
              />
            ) : null}
            <BreakdownRow
              label="Branch receives"
              value={money(receivingAmount)}
              tone="receive"
              emphasis
            />
            <p className="txn-route__branch">
              {merchantBranchName || 'No merchant branch'}
            </p>
          </div>

          <div className="txn-route__meta">
            <div className="txn-route__status">
              <span>Settlement</span>
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
            </div>

            <dl>
              <DetailField
                label="Settles at"
                value={settlesAt ? formatDateTime(settlesAt) : undefined}
              />
              <DetailField
                label="Settled at"
                value={settledAt ? formatDateTime(settledAt) : undefined}
              />
              <DetailField label="Settlement UTR" value={settlementUtr} />
            </dl>

            {transferError &&
            transferError.code !== 'BAD_REQUEST_TRANSFER_INSUFFICIENT_BALANCE' &&
            transferError.reason !== 'insufficient_account_balance' ? (
              <div className="txn-route__alert" role="alert">
                <strong>Transfer Notice</strong>
                <p>
                  {transferError.description ||
                    transferError.reason ||
                    transferError.code ||
                    'Transfer is being processed'}
                </p>
              </div>
            ) : null}

            {cleanSettlementHint(settlementHint) ? (
              <p className="txn-route__hint">
                {cleanSettlementHint(settlementHint)}
              </p>
            ) : null}

            {isError ? (
              <p className="txn-route__hint txn-route__hint--muted">
                Could not refresh from Razorpay — showing saved data
              </p>
            ) : null}
          </div>
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

  const columns: ColumnsType<PaymentTransaction> = [
    {
      title: 'Date',
      key: 'date',
      width: 155,
      render: (_, row) => formatDateTime(row.paidAt || row.createdAt),
    },
    {
      title: 'Customer',
      key: 'customer',
      width: 140,
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
      width: 180,
      ellipsis: true,
      render: (_, row) => row.itemName || typeLabel(row.type),
    },
    {
      title: 'Trainer',
      key: 'trainer',
      width: 140,
      ellipsis: true,
      render: (_, row) => row.trainerName || '—',
    },
    {
      title: 'Approved by',
      key: 'approvedBy',
      width: 140,
      ellipsis: true,
      render: (_, row) => row.approvedByName || '—',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      align: 'right',
      width: 140,
      render: (value: number, row) => (
        <span className="txn__amount-cell">
          <span className="txn__amount">
            {formatCurrency(getEffectiveAmount(row))}
          </span>
          {stillPartial(row) ? (
            <span className="txn__partial-meta">
              Pending {formatCurrency(row.amountPending)}
            </span>
          ) : row.lastPaidAmount != null &&
            row.payments &&
            row.payments.length > 1 ? (
            <span className="txn__partial-meta">
              Last {formatCurrency(row.lastPaidAmount)}
            </span>
          ) : null}
        </span>
      ),
    },
    {
      title: 'Payment status',
      key: 'paymentStatus',
      width: 150,
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
      width: 100,
      render: (value?: string) => value || '—',
    },
    {
      title: 'Settlement',
      key: 'settlement',
      width: 135,
      render: (_, row) =>
        isCashPayment(row) ? (
          <span className="txn__dash">—</span>
        ) : (
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
  const hasRows = (data?.items?.length ?? 0) > 0;

  const { computedPaidAmount, computedPendingAmount, computedPendingCount } =
    useMemo(() => {
      if (!data?.items?.length) {
        return {
          computedPaidAmount: summary?.paidAmount,
          computedPendingAmount: 0,
          computedPendingCount: summary?.pendingCount ?? 0,
        };
      }

      let paidSum = 0;
      let pendingSum = 0;
      let pendingCount = 0;

      for (const row of data.items) {
        const status = String(row.paymentStatus || '').toLowerCase();
        if (status === 'paid') {
          paidSum += getEffectiveAmount(row);
        }

        const pendingVal = Number(row.amountPending ?? 0);
        if (pendingVal > 0) {
          pendingSum += pendingVal;
        }

        if (status === 'pending' || (row.isPartial && pendingVal > 0)) {
          pendingCount += 1;
        }
      }

      return {
        computedPaidAmount: Math.round(paidSum * 100) / 100,
        computedPendingAmount: Math.round(pendingSum * 100) / 100,
        computedPendingCount: Math.max(
          pendingCount,
          summary?.pendingCount ?? 0,
        ),
      };
    }, [data, summary]);

  if (isLoading && !hasRows) {
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
            {computedPaidAmount != null
              ? formatCurrency(computedPaidAmount)
              : '—'}
          </strong>
        </article>
        <article className="txn-stat">
          <span>Paid</span>
          <strong>{summary?.paidCount ?? '—'}</strong>
        </article>
        <article className="txn-stat">
          <span>Pending balance</span>
          <strong
            style={{
              color: computedPendingAmount > 0 ? '#ea580c' : undefined,
            }}
          >
            {formatCurrency(computedPendingAmount)}
          </strong>
          {computedPendingCount > 0 ? (
            <small
              style={{
                fontSize: '0.72rem',
                color: '#8c95a6',
                marginTop: '0.15rem',
              }}
            >
              {computedPendingCount}{' '}
              {computedPendingCount === 1 ? 'order' : 'orders'}
            </small>
          ) : null}
        </article>
        <article className="txn-stat">
          <span>Failed</span>
          <strong>{summary?.failedCount ?? 0}</strong>
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
              { value: 'partial', label: 'Partially paid' },
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
          scroll={{ x: 1440 }}
        />
      </section>

      <p className="txn__hint">
        <CreditCard size={14} />
        Super Admin sees every branch. Admin and Manager see assigned branches
        only.
        <IndianRupee size={14} />
      </p>

      <Drawer
        title={
          selected ? (
            <div className="txn-drawer__title">
              {isCashPayment(selected) ? (
                <span className="txn-drawer__title-badge txn-drawer__title-badge--cash">
                  <Banknote size={16} /> Cash Payment
                </span>
              ) : (
                <span className="txn-drawer__title-badge txn-drawer__title-badge--online">
                  <CreditCard size={16} /> Online Payment
                </span>
              )}
              <span className="txn-drawer__receipt-id">
                #{selected.receipt || selected.id}
              </span>
            </div>
          ) : (
            'Transaction Details'
          )
        }
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        width={520}
        destroyOnHidden
        className="txn-drawer"
      >
        {selected ? (
          <div className="txn-detail">
            {/* Hero Payment Banner */}
            <div className="txn-hero-card">
              <div className="txn-hero-card__top">
                <div>
                  <span className="txn-hero-card__kicker">
                    {isCashPayment(selected)
                      ? 'Total Cash Collected'
                      : 'Total Customer Paid'}
                  </span>
                  <div className="txn-hero-card__amount">
                    {formatCurrency(getEffectiveAmount(selected))}
                    {stillPartial(selected) && (
                      <span className="txn-hero-card__partial-tag">
                        Installment
                      </span>
                    )}
                  </div>
                </div>
                <div className="txn-hero-card__badges">
                  <Tag
                    bordered={false}
                    color={paymentStatusColor(selected)}
                    className="txn__tag"
                  >
                    {paymentStatusLabel(selected)}
                  </Tag>
                  {!isCashPayment(selected) && (
                    <Tag
                      bordered={false}
                      color={settlementColor(selected)}
                      className="txn__tag"
                    >
                      {settlementLabel(selected)}
                    </Tag>
                  )}
                </div>
              </div>
              <div className="txn-hero-card__footer">
                <span className="txn-hero-card__date">
                  <Calendar size={13} />
                  {formatDateTime(selected.paidAt || selected.createdAt)}
                </span>
                <span className="txn-hero-card__method">
                  {isCashPayment(selected) ? (
                    <Wallet size={13} />
                  ) : (
                    <CreditCard size={13} />
                  )}
                  {(selected.paymentMethod || 'cash').toUpperCase()}
                </span>
              </div>
            </div>

            {/* Item & Package Details Card */}
            <div className="txn-card">
              <div className="txn-card__header">
                <Dumbbell size={16} className="txn-card__icon" />
                <span className="txn-card__title">Item & Package</span>
              </div>
              <div className="txn-card__body">
                <div className="txn-item-box">
                  <strong className="txn-item-box__name">
                    {selected.itemName || typeLabel(selected.type)}
                  </strong>
                  <div className="txn-item-box__meta">
                    <span className="txn-pill">{typeLabel(selected.type)}</span>
                    <span className="txn-pill">
                      <Building2 size={12} /> {shortBranch(selected.branchName)}
                    </span>
                    {selected.qty ? (
                      <span className="txn-pill">Qty: {selected.qty}</span>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing & Discount Breakdown Card */}
            <div className="txn-card">
              <div className="txn-card__header">
                <IndianRupee size={16} className="txn-card__icon" />
                <span className="txn-card__title">Payment Breakdown</span>
              </div>
              <div className="txn-card__body txn-breakdown">
                {selected.packageAmount != null && (
                  <div className="txn-breakdown__row">
                    <span>Package Price</span>
                    <strong>{formatCurrency(selected.packageAmount)}</strong>
                  </div>
                )}

                {selected.originalAmount != null &&
                  selected.originalAmount !== selected.packageAmount && (
                    <div className="txn-breakdown__row">
                      <span>Original Amount</span>
                      <span>{formatCurrency(selected.originalAmount)}</span>
                    </div>
                  )}

                {selected.couponCode ? (
                  <div className="txn-breakdown__row txn-breakdown__row--discount">
                    <span className="txn-coupon-tag">
                      <Ticket size={12} /> {selected.couponCode}
                    </span>
                    <strong className="txn-discount-text">
                      −{formatCurrency(selected.couponDiscount ?? 0)}
                    </strong>
                  </div>
                ) : null}

                {stillPartial(selected) ? (
                  <div className="txn-breakdown__row">
                    <span>Payment Structure</span>
                    <span className="txn-badge--amber">
                      Partial / EMI Payment
                    </span>
                  </div>
                ) : null}

                {selected.lastPaidAmount != null &&
                (selected.payments?.length || 0) > 1 ? (
                  <div className="txn-breakdown__row">
                    <span>Last paid</span>
                    <span>{formatCurrency(selected.lastPaidAmount)}</span>
                  </div>
                ) : null}

                {stillPartial(selected) ? (
                  <div className="txn-breakdown__row">
                    <span>Pending</span>
                    <strong className="txn-discount-text">
                      {formatCurrency(selected.amountPending)}
                    </strong>
                  </div>
                ) : null}

                <div className="txn-breakdown__row txn-breakdown__row--total">
                  <span>Net Amount Collected</span>
                  <strong className="txn-total-amount">
                    {formatCurrency(getEffectiveAmount(selected))}
                  </strong>
                </div>
              </div>
            </div>

            {(selected.payments?.length || 0) > 0 ? (
              <div className="txn-card">
                <div className="txn-card__header">
                  <Receipt size={16} className="txn-card__icon" />
                  <span className="txn-card__title">Payment history</span>
                </div>
                <div className="txn-card__body txn-history">
                  {selected.payments?.map((payment, index) => (
                    <div key={payment.id} className="txn-history__row">
                      <div>
                        <strong>
                          {selected.payments && selected.payments.length > 1
                            ? index === 0
                              ? 'First payment'
                              : `Installment ${index + 1}`
                            : 'Payment'}
                        </strong>
                        <span>
                          {formatDateTime(payment.paidAt || payment.createdAt)}
                          {payment.paymentMethod
                            ? ` · ${payment.paymentMethod}`
                            : ''}
                        </span>
                        {payment.approvedByName ? (
                          <span className="txn-history__approver">
                            Approved by {payment.approvedByName}
                            {payment.approvedAt
                              ? ` · ${formatDateTime(payment.approvedAt)}`
                              : ''}
                          </span>
                        ) : String(payment.paymentMethod || '').toLowerCase() ===
                          'cash' ? (
                          <span className="txn-history__approver">
                            Cash — approver not recorded
                          </span>
                        ) : null}
                      </div>
                      <div className="txn-history__amounts">
                        <strong>{formatCurrency(payment.amount)}</strong>
                        {payment.amountPending != null &&
                        payment.amountPending > 0.009 ? (
                          <small>
                            Pending {formatCurrency(payment.amountPending)}
                          </small>
                        ) : selected.payments && selected.payments.length > 1 ? (
                          <small>Balance cleared</small>
                        ) : (
                          <small>Paid in full</small>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {/* People Involved Card */}
            <div className="txn-card">
              <div className="txn-card__header">
                <User size={16} className="txn-card__icon" />
                <span className="txn-card__title">Customer & Staff</span>
              </div>
              <div className="txn-card__body txn-people-grid">
                {/* Customer */}
                <div className="txn-person-card">
                  <div className="txn-person-card__role">Customer</div>
                  <div className="txn-person-card__name">
                    {selected.userName || '—'}
                  </div>
                  {selected.userMobile && (
                    <div className="txn-person-card__phone">
                      <Phone size={12} /> {selected.userMobile}
                    </div>
                  )}
                </div>

                {/* Trainer */}
                <div className="txn-person-card">
                  <div className="txn-person-card__role">Trainer</div>
                  <div className="txn-person-card__name">
                    {selected.trainerName || 'Unassigned'}
                  </div>
                  {selected.trainerMobile && (
                    <div className="txn-person-card__phone">
                      <Phone size={12} /> {selected.trainerMobile}
                    </div>
                  )}
                </div>
              </div>

              {/* Approval Audit Trail */}
              {(selected.approvedByName ||
                selected.raisedByName ||
                selected.payments?.some((p) => p.approvedByName)) && (
                <div className="txn-approval-box">
                  <div className="txn-approval-box__title">
                    <ShieldCheck size={14} /> Approval Audit Trail
                  </div>
                  <div className="txn-approval-box__grid">
                    {selected.raisedByName && (
                      <div>
                        <span className="txn-sublabel">Collected By</span>
                        <strong>{selected.raisedByName}</strong>
                      </div>
                    )}
                    {selected.approvedByName &&
                    !(selected.payments && selected.payments.length > 1) ? (
                      <div>
                        <span className="txn-sublabel">Approved By</span>
                        <strong>{selected.approvedByName}</strong>
                        {selected.approvedByMobile && (
                          <small> ({selected.approvedByMobile})</small>
                        )}
                      </div>
                    ) : null}
                  </div>
                  {selected.payments &&
                  selected.payments.some((p) => p.approvedByName) ? (
                    <div className="txn-approval-box__payments">
                      {selected.payments.map((payment, index) =>
                        payment.approvedByName ? (
                          <div
                            key={payment.id}
                            className="txn-approval-box__time"
                          >
                            <Clock size={12} />
                            {selected.payments && selected.payments.length > 1
                              ? `${index === 0 ? 'First' : `Installment ${index + 1}`} · `
                              : ''}
                            Approved by {payment.approvedByName}
                            {payment.approvedAt
                              ? ` · ${formatDateTime(payment.approvedAt)}`
                              : ''}
                          </div>
                        ) : null,
                      )}
                    </div>
                  ) : selected.approvedAt ? (
                    <div className="txn-approval-box__time">
                      <Clock size={12} /> Verified on{' '}
                      {formatDateTime(selected.approvedAt)}
                    </div>
                  ) : null}
                </div>
              )}
            </div>

            {/* Banking & Settlement Section */}
            <RouteSettlementSection transaction={selected} />

            {/* Identifiers & Raw Meta */}
            <div className="txn-card txn-card--muted">
              <div className="txn-card__header">
                <FileText size={15} className="txn-card__icon" />
                <span className="txn-card__title">Identifiers & Meta</span>
              </div>
              <div className="txn-card__body txn-meta-grid">
                <div className="txn-meta-item">
                  <span>Transaction ID</span>
                  <code>#{selected.id}</code>
                </div>
                {selected.receipt && (
                  <div className="txn-meta-item">
                    <span>Receipt Ref</span>
                    <code>{selected.receipt}</code>
                  </div>
                )}
                {selected.razorpayOrderId && (
                  <div className="txn-meta-item">
                    <span>Order ID</span>
                    <code>{selected.razorpayOrderId}</code>
                  </div>
                )}
                {selected.razorpayPaymentId && (
                  <div className="txn-meta-item">
                    <span>Razorpay Payment ID</span>
                    <code>{selected.razorpayPaymentId}</code>
                  </div>
                )}
                {selected.linkedAccountId && (
                  <div className="txn-meta-item">
                    <span>Linked Account</span>
                    <code>{selected.linkedAccountId}</code>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : null}
      </Drawer>
    </div>
  );
};
