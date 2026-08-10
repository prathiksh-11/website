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

const isCashPayment = (row: PaymentTransaction) =>
  String(row.paymentMethod || '').toLowerCase() === 'cash';

const settlementLabel = (
  row: PaymentTransaction | TransactionSettlement | null | undefined,
) => {
  if (!row) return 'Not routed';
  if ('paymentMethod' in row && isCashPayment(row as PaymentTransaction)) {
    return '—';
  }

  const transferStatus = String(
    ('transferStatus' in row && row.transferStatus) ||
      (row as PaymentTransaction).transferStatus ||
      '',
  ).toLowerCase();
  if (transferStatus === 'failed') return 'Transfer failed';

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
  if (label === 'Transfer failed') return 'error';
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
    receivingAmount != null ? Math.max(0, paidAmount - receivingAmount) : null;

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

            {transferError ? (
              <div className="txn-route__alert" role="alert">
                <strong>Transfer failed</strong>
                <p>
                  {transferError.description ||
                    transferError.reason ||
                    transferError.code ||
                    'Transfer could not be completed'}
                </p>
              </div>
            ) : null}

            {settlementHint ? (
              <p className="txn-route__hint">{settlementHint}</p>
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
      title: 'Trainer',
      key: 'trainer',
      width: 130,
      ellipsis: true,
      render: (_, row) => row.trainerName || '—',
    },
    {
      title: 'Approved by',
      key: 'approvedBy',
      width: 130,
      ellipsis: true,
      render: (_, row) => row.approvedByName || '—',
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
          scroll={{ x: 1280 }}
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
          selected && isCashPayment(selected)
            ? 'Cash payment'
            : 'Razorpay payment'
        }
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        width={460}
        destroyOnHidden
        className="txn-drawer"
      >
        {selected ? (
          <div className="txn-detail">
            <div className="txn-detail__head">
              <div>
                <p className="txn-detail__kicker">
                  {isCashPayment(selected) ? 'Cash collected' : 'Customer paid'}
                </p>
                <strong className="txn-detail__amount">
                  {formatCurrency(selected.amount)}
                </strong>
                {!isCashPayment(selected) &&
                selected.receivingAmount != null ? (
                  <p className="txn-detail__receive">
                    Branch gets {formatCurrency(selected.receivingAmount)}
                  </p>
                ) : null}
              </div>
              <div className="txn-detail__badges">
                <Tag
                  bordered={false}
                  color={paymentStatusColor(selected)}
                  className="txn__tag"
                >
                  {paymentStatusLabel(selected)}
                </Tag>
                {!isCashPayment(selected) ? (
                  <Tag
                    bordered={false}
                    color={settlementColor(selected)}
                    className="txn__tag"
                  >
                    {settlementLabel(selected)}
                  </Tag>
                ) : null}
              </div>
            </div>

            <section className="txn-detail__section">
              <h4>Payment</h4>
              <dl>
                <DetailField label="Customer" value={selected.userName} />
                <DetailField label="Mobile" value={selected.userMobile} />
                <DetailField
                  label="Branch"
                  value={
                    selected.branchName
                      ? shortBranch(selected.branchName)
                      : undefined
                  }
                />
                <DetailField
                  label="Item"
                  value={selected.itemName || typeLabel(selected.type)}
                />
                <DetailField label="Type" value={typeLabel(selected.type)} />
                <DetailField label="Quantity" value={selected.qty} />
                <DetailField label="Method" value={selected.paymentMethod} />
                <DetailField label="Receipt" value={selected.receipt} />
                <DetailField
                  label="Paid at"
                  value={
                    selected.paidAt
                      ? formatDateTime(selected.paidAt)
                      : undefined
                  }
                />
              </dl>
            </section>

            <section className="txn-detail__section">
              <h4>People</h4>
              <dl>
                <DetailField label="Trainer" value={selected.trainerName} />
                <DetailField
                  label="Trainer mobile"
                  value={selected.trainerMobile}
                />
                <DetailField label="Raised by" value={selected.raisedByName} />
                <DetailField
                  label="Approved by"
                  value={selected.approvedByName}
                />
                <DetailField
                  label="Approver mobile"
                  value={selected.approvedByMobile}
                />
                <DetailField
                  label="Approved at"
                  value={
                    selected.approvedAt
                      ? formatDateTime(selected.approvedAt)
                      : undefined
                  }
                />
              </dl>
            </section>

            <section className="txn-detail__section">
              <h4>Amount</h4>
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
              </dl>
            </section>

            <RouteSettlementSection transaction={selected} />
          </div>
        ) : null}
      </Drawer>
    </div>
  );
};
