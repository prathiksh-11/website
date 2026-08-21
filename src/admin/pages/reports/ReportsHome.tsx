import {
  DownloadOutlined,
  FileExcelOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { Button, DatePicker, Empty, Modal, Progress, Select, Table, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs, { type Dayjs } from 'dayjs';
import {
  Activity,
  AlertCircle,
  ArrowDownRight,
  ArrowUpRight,
  Building2,
  CircleDollarSign,
  Dumbbell,
  Hourglass,
  TrendingUp,
  UserCheck,
  Users,
  Wallet,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import {
  Legend,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { PageSkeleton } from '@/components/common';
import { normalizeTrainerType, THEME_TOKENS } from '@/constants';
import { useBranches } from '@/hooks/useBranches';
import { useGymReport, useReportExport } from '@/hooks/useReports';
import { useTrainers, useTrainersAll } from '@/hooks/useTrainers';
import type {
  Branch,
  GymReport,
  ReportBranch,
  ReportDateFilter,
  ReportQuery,
  ReportTrainer,
  Trainer,
  TrainerType,
} from '@/types';
import { formatCurrency } from '@/utils/format';
import { emptyGymReport } from '@/utils/report-map';

const { RangePicker } = DatePicker;

const EMPTY_REPORT_TOTALS = emptyGymReport().totals;

const ACCENT = THEME_TOKENS.colorPrimary;
const MUTED = '#9aa0ab';

type ReportTab = 'branch' | 'attendance' | 'revenue';

const TABS: Array<{ key: ReportTab; label: string; hint: string }> = [
  { key: 'branch', label: 'Branch summary', hint: '' },
  { key: 'attendance', label: 'Trainer attendance', hint: 'Presence & working hours' },
  { key: 'revenue', label: 'Revenue', hint: 'Monthly or custom comparison' },
];

type RevenueCompareMode = 'monthly' | 'custom';

const REVENUE_MODES: Array<{ value: RevenueCompareMode; label: string }> = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'custom', label: 'Custom' },
];

const PERIODS: Array<{ value: ReportDateFilter; label: string }> = [
  { value: 'today', label: 'Today' },
  { value: 'weekly', label: '7 days' },
  { value: 'monthly', label: '30 days' },
  { value: 'yearly', label: '1 year' },
  { value: 'all', label: 'All time' },
  { value: 'custom', label: 'Custom' },
];

const shortBranch = (name: string) =>
  name
    .replace(/^Game On Fitness\s*[-–—]?\s*/i, '')
    .replace(/^(Premium Club|Luxury Club)\s*[-–—]?\s*/i, '')
    .replace(/^[-–—]\s*/, '')
    .trim() || name;

const tooltipStyle = {
  borderRadius: 14,
  border: '1px solid rgba(22,24,31,0.08)',
  boxShadow: '0 14px 32px rgba(22,24,31,0.1)',
  background: '#fff',
  color: '#16181f',
  fontFamily: "'Outfit', system-ui, sans-serif",
  fontSize: 12,
  padding: '10px 14px',
};

const moneyTick = (v: number) =>
  v >= 100000
    ? `${Math.round(v / 100000)}L`
    : v >= 1000
      ? `${Math.round(v / 1000)}k`
      : String(v);

const getMonthRange = (month: Dayjs) => {
  const start = month.startOf('month');
  const now = dayjs();
  const end = month.isSame(now, 'month') ? now : month.endOf('month');

  return {
    start: start.format('YYYY-MM-DD'),
    end: end.format('YYYY-MM-DD'),
    label: month.format('MMMM YYYY'),
  };
};

const getDefaultRevenueMonths = () => {
  const now = dayjs();
  return {
    primary: now.startOf('month'),
    compare: now.subtract(1, 'month').startOf('month'),
  };
};

const getDefaultRevenueCustomRanges = (): {
  primary: [Dayjs, Dayjs];
  compare: [Dayjs, Dayjs];
} => {
  const now = dayjs();
  const lastMonth = now.subtract(1, 'month');
  return {
    primary: [now.startOf('month'), now.endOf('day')],
    compare: [lastMonth.startOf('month'), lastMonth.endOf('month')],
  };
};

const getCustomRange = (range: [Dayjs, Dayjs]) => ({
  start: range[0].format('YYYY-MM-DD'),
  end: range[1].format('YYYY-MM-DD'),
  label: `${range[0].format('DD MMM YYYY')} – ${range[1].format('DD MMM YYYY')}`,
});

const calcRevenueChange = (current: number, previous: number) => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Number((((current - previous) / previous) * 100).toFixed(1));
};

const ChangeBadge = ({ value }: { value: number }) => {
  const up = value >= 0;
  const Icon = up ? ArrowUpRight : ArrowDownRight;

  return (
    <span className={`rpt-rev-change ${up ? 'rpt-rev-change--up' : 'rpt-rev-change--down'}`}>
      <Icon size={14} />
      {up ? '+' : ''}
      {value}%
    </span>
  );
};

const MoneyHealthCards = ({ totals }: { totals: GymReport['totals'] }) => (
  <section className="rpt__money" aria-label="Payment health">
    <article className="rpt-money rpt-money--paid">
      <div className="rpt-money__icon">
        <Wallet size={18} />
      </div>
      <div>
        <span>Paid amount</span>
        <strong>{formatCurrency(totals.paidAmount)}</strong>
        <small>Collected in this period</small>
      </div>
    </article>
    <article className="rpt-money rpt-money--pending">
      <div className="rpt-money__icon">
        <Hourglass size={18} />
      </div>
      <div>
        <span>Pending amount</span>
        <strong>{formatCurrency(totals.pendingAmount)}</strong>
        <small>{totals.pendingCount} awaiting approval</small>
      </div>
    </article>
    <article className="rpt-money rpt-money--partial">
      <div className="rpt-money__icon">
        <CircleDollarSign size={18} />
      </div>
      <div>
        <span>Partially paid</span>
        <strong>{formatCurrency(totals.partialPaidAmount)}</strong>
        <small>{totals.partialPaidCount} installment payments</small>
      </div>
    </article>
    <article className="rpt-money rpt-money--due">
      <div className="rpt-money__icon">
        <AlertCircle size={18} />
      </div>
      <div>
        <span>Amount due</span>
        <strong>{formatCurrency(totals.amountDue)}</strong>
        <small>
          {totals.partialOpenCount} open partial
          {totals.partialOpenCount === 1 ? '' : 's'}
        </small>
      </div>
    </article>
  </section>
);

const OverviewCards = ({ totals }: { totals: GymReport['totals'] }) => (
  <>
    <MoneyHealthCards totals={totals} />
    <section className="rpt__overview" aria-label="Report overview">
      <article className="rpt-stat rpt-stat--hero">
        <div className="rpt-stat__icon">
          <CircleDollarSign size={18} />
        </div>
        <div>
          <span>Total revenue</span>
          <strong>{formatCurrency(totals.totalRevenue)}</strong>
          <small>Paid streams only</small>
        </div>
      </article>
      <article className="rpt-stat">
        <div className="rpt-stat__icon">
          <Dumbbell size={18} />
        </div>
        <div>
          <span>PT revenue</span>
          <strong>{formatCurrency(totals.ptRevenue)}</strong>
          <small>{totals.ptClients} clients</small>
        </div>
      </article>
      <article className="rpt-stat">
        <div className="rpt-stat__icon">
          <Users size={18} />
        </div>
        <div>
          <span>Subscriptions</span>
          <strong>{formatCurrency(totals.subscriberRevenue)}</strong>
          <small>{totals.subscriberClients} clients</small>
        </div>
      </article>
      <article className="rpt-stat">
        <div className="rpt-stat__icon">
          <TrendingUp size={18} />
        </div>
        <div>
          <span>Events</span>
          <strong>{formatCurrency(totals.eventRevenue)}</strong>
          <small>{totals.eventClients} clients</small>
        </div>
      </article>
      <article className="rpt-stat">
        <div className="rpt-stat__icon">
          <UserCheck size={18} />
        </div>
        <div>
          <span>Customers</span>
          <strong>{totals.totalCustomers}</strong>
          <small>In selected range</small>
        </div>
      </article>
      <article className="rpt-stat">
        <div className="rpt-stat__icon">
          <Activity size={18} />
        </div>
        <div>
          <span>Trainers</span>
          <strong>{totals.trainerCount || totals.activeTrainers}</strong>
          <small>{totals.activeTrainers} active</small>
        </div>
      </article>
    </section>
  </>
);

const BranchOverviewCards = ({
  branches,
  totals,
  branchMeta,
  allTrainers,
  branchId,
}: {
  branches: ReportBranch[];
  totals: GymReport['totals'];
  branchMeta: Branch[];
  allTrainers: Trainer[];
  branchId?: string;
}) => {
  const reportTotals = totals ?? EMPTY_REPORT_TOTALS;

  const managerByBranchId = useMemo(() => {
    const map: Record<string, string> = {};
    for (const branch of branchMeta) {
      map[branch.id] = branch.managerName || '—';
    }
    return map;
  }, [branchMeta]);

  const aggregates = useMemo(() => {
    const staff = emptyStaffCounts();

    for (const branch of branches) {
      const counts = countBranchStaff(allTrainers, branch.id, branch.name);
      staff.general_trainer += counts.general_trainer;
      staff.pt_trainer += counts.pt_trainer;
      staff.membership_coordinator += counts.membership_coordinator;
      staff.receptionist += counts.receptionist;
      staff.total += counts.total;
    }

    return {
      generalTrainer: staff.general_trainer,
      ptTrainer: staff.pt_trainer,
      mc: staff.membership_coordinator,
      reci: staff.receptionist,
      totalEmployees: staff.total,
      totalClients: reportTotals.totalCustomers,
      ptClients: reportTotals.ptClients,
      membershipClients: reportTotals.subscriberClients,
      subscriptionRevenue: reportTotals.subscriberRevenue,
      eventRevenue: reportTotals.eventRevenue,
      ptRevenue: reportTotals.ptRevenue,
      ptCollected: reportTotals.paidAmount,
      pendingAmount: reportTotals.pendingAmount,
      totalRevenueAll:
        reportTotals.totalRevenue +
        reportTotals.pendingAmount +
        reportTotals.amountDue,
    };
  }, [allTrainers, branches, reportTotals]);

  const branchNameLabel =
    branchId && branches.length === 1
      ? shortBranch(branches[0].name)
      : `${reportTotals.branchCount} branches`;

  const managerLabel =
    branchId && branches.length === 1
      ? (managerByBranchId[branches[0].id] ?? '—')
      : '—';

  const cards: Array<{
    key: string;
    label: string;
    value: string;
    icon: typeof Building2;
    hero?: boolean;
    wide?: boolean;
  }> = [
    {
      key: 'branch',
      label: 'Total branches',
      value: branchNameLabel,
      icon: Building2,
      hero: true,
    },
    {
      key: 'manager',
      label: 'Manager',
      value: managerLabel,
      icon: UserCheck,
    },
    {
      key: 'general',
      label: 'General trainer',
      value: String(aggregates.generalTrainer),
      icon: Dumbbell,
    },
    {
      key: 'pt-trainer',
      label: 'PT trainer',
      value: String(aggregates.ptTrainer),
      icon: Dumbbell,
    },
    {
      key: 'mc',
      label: 'Membership Coordinator',
      value: String(aggregates.mc),
      icon: Users,
    },
    {
      key: 'reci',
      label: 'Receptionist',
      value: String(aggregates.reci),
      icon: Users,
    },
    {
      key: 'clients',
      label: 'Total clients',
      value: String(aggregates.totalClients),
      icon: Users,
    },
    {
      key: 'pt-clients',
      label: 'PT/clients',
      value: String(aggregates.ptClients),
      icon: UserCheck,
    },
    {
      key: 'pt-revenue',
      label: 'PT/revenue',
      value: formatCurrency(aggregates.ptRevenue),
      icon: Dumbbell,
    },
    {
      key: 'membership',
      label: 'Membership client',
      value: String(aggregates.membershipClients),
      icon: Users,
    },
    {
      key: 'sub-revenue',
      label: 'Membership Revenue',
      value: formatCurrency(aggregates.subscriptionRevenue),
      icon: CircleDollarSign,
    },
    {
      key: 'employees',
      label: 'Total employees',
      value: String(aggregates.totalEmployees),
      icon: Activity,
    },
    {
      key: 'total-revenue',
      label: 'Total revenue',
      value: formatCurrency(aggregates.totalRevenueAll),
      icon: CircleDollarSign,
      hero: true,
      wide: true,
    },
  ];

  return (
    <section className="rpt__overview rpt__overview--branch" aria-label="Branch summary">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <article
            key={card.key}
            className={[
              'rpt-stat',
              card.hero ? 'rpt-stat--hero' : '',
              card.wide ? 'rpt-stat--wide' : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <div className="rpt-stat__icon">
              <Icon size={18} />
            </div>
            <div className="rpt-stat__body">
              <span>{card.label}</span>
              <strong>{card.value}</strong>
            </div>
          </article>
        );
      })}
    </section>
  );
};

type BranchStaffCounts = Record<TrainerType, number> & { total: number };

const emptyStaffCounts = (): BranchStaffCounts => ({
  general_trainer: 0,
  pt_trainer: 0,
  membership_coordinator: 0,
  receptionist: 0,
  admin: 0,
  manager: 0,
  total: 0,
});

const trainerBelongsToBranch = (
  trainer: Trainer,
  branchId: string,
  branchName: string,
) => {
  if (trainer.branchId && trainer.branchId === branchId) return true;
  return trainer.branchNames.some(
    (name) => name.toLowerCase() === branchName.toLowerCase(),
  );
};

const countBranchStaff = (
  trainers: Trainer[],
  branchId: string,
  branchName: string,
): BranchStaffCounts => {
  const counts = emptyStaffCounts();

  for (const trainer of trainers) {
    if (!trainerBelongsToBranch(trainer, branchId, branchName)) continue;
    const type =
      normalizeTrainerType(trainer.trainerType, trainer.description) ??
      'general_trainer';
    counts[type] += 1;
    counts.total += 1;
  }

  return counts;
};

type BranchTableRow = {
  key: string;
  branchName: string;
  manager: string;
  generalTrainer: number;
  ptTrainer: number;
  mc: number;
  reci: number;
  totalClients: number;
  ptClients: number;
  membershipClients: number;
  subscriptionRevenue: number;
  eventRevenue: number;
  ptRevenue: number;
  ptCollected: number;
  pendingAmount: number;
  totalRevenueAll: number;
  totalEmployees: number;
};

const BranchSummaryTab = ({
  branches,
  branchMeta,
  allTrainers,
}: {
  branches: ReportBranch[];
  branchMeta: Branch[];
  allTrainers: Trainer[];
}) => {
  const managerByBranchId = useMemo(() => {
    const map: Record<string, string> = {};
    for (const branch of branchMeta) {
      map[branch.id] = branch.managerName || '—';
    }
    return map;
  }, [branchMeta]);

  const rows = useMemo<BranchTableRow[]>(
    () =>
      branches.map((branch) => {
        const staff = countBranchStaff(allTrainers, branch.id, branch.name);
        const { summary } = branch;

        return {
          key: branch.id,
          branchName: branch.name,
          manager: managerByBranchId[branch.id] ?? '—',
          generalTrainer: staff.general_trainer,
          ptTrainer: staff.pt_trainer,
          mc: staff.membership_coordinator,
          reci: staff.receptionist,
          totalClients: summary.totalCustomers,
          ptClients: summary.ptClients,
          membershipClients: summary.subscriberClients,
          subscriptionRevenue: summary.subscriberRevenue,
          eventRevenue: summary.eventRevenue,
          ptRevenue: summary.ptRevenue,
          ptCollected: summary.paidAmount,
          pendingAmount: summary.pendingAmount,
          totalRevenueAll:
            summary.totalRevenue +
            summary.pendingAmount +
            summary.amountDue,
          totalEmployees: staff.total,
        };
      }),
    [allTrainers, branches, managerByBranchId],
  );

  const columns: ColumnsType<BranchTableRow> = [
    {
      title: 'Branch name',
      dataIndex: 'branchName',
      fixed: 'left',
      width: 200,
      render: (name: string) => (
        <div className="rpt-branch-table__name">
          <strong title={name}>{shortBranch(name)}</strong>
          <small title={name}>{name}</small>
        </div>
      ),
    },
    { title: 'Manager', dataIndex: 'manager', width: 140 },
    { title: 'General trainer', dataIndex: 'generalTrainer', width: 120, align: 'center' },
    { title: 'PT trainer', dataIndex: 'ptTrainer', width: 100, align: 'center' },
    { title: 'Membership Coordinator', dataIndex: 'Membership Coordinator', width: 70, align: 'center' },
    { title: 'Receptionist', dataIndex: 'Receptionist', width: 70, align: 'center' },
    { title: 'Total clients', dataIndex: 'totalClients', width: 100, align: 'center' },
    { title: 'PT/clients', dataIndex: 'ptClients', width: 100, align: 'center' },
    {
      title: 'Membership client',
      dataIndex: 'membershipClients',
      width: 130,
      align: 'center',
    },
    {
      title: 'Membership Revenue',
      dataIndex: 'subscriptionRevenue',
      width: 140,
      align: 'right',
      render: (value: number) => formatCurrency(value),
    },
    {
      title: 'Total /event',
      dataIndex: 'eventRevenue',
      width: 120,
      align: 'right',
      render: (value: number) => formatCurrency(value),
    },
    {
      title: 'PT/revenue',
      dataIndex: 'ptRevenue',
      width: 120,
      align: 'right',
      render: (value: number) => formatCurrency(value),
    },
  
    {
      title: 'Pending',
      dataIndex: 'pendingAmount',
      width: 120,
      align: 'right',
      render: (value: number) => formatCurrency(value),
    },
    {
      title: 'Total revenue (all include)',
      dataIndex: 'totalRevenueAll',
      width: 170,
      align: 'right',
      render: (value: number) => formatCurrency(value),
    },
    {
      title: 'Total no of employees',
      dataIndex: 'totalEmployees',
      width: 150,
      align: 'center',
    },
  ];

  return (
    <div className="rpt-tab">
      <section className="rpt__panel">
        <div className="rpt__panel-head">
          <div>
            <h2>Branch cards</h2>
            <p>One glance per location</p>
          </div>
        </div>
        <div className="rpt__branch-grid">
          {branches.map((b) => {
            const util = Math.min(100, b.highlights.sessionUtilization);
            const totalCustomers = b.summary.totalCustomers;
            const ptCustomers = b.summary.ptClients;
            const pendingTotal =
              b.summary.pendingAmount + b.summary.partialPaidAmount;
            const pendingHint =
              b.summary.pendingCount > 0
                ? `${b.summary.pendingCount} awaiting approval`
                : b.summary.partialPaidCount > 0
                  ? `${b.summary.partialPaidCount} installment payments`
                  : 'No pending payments';
            return (
              <article key={b.id} className="rpt-branch">
                <header className="rpt-branch__head">
                  <div className="rpt-branch__title-group">
                    <span className="rpt-branch__badge">
                      <Building2 size={15} />
                    </span>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <h3>{shortBranch(b.name)}</h3>
                      <p className="rpt-branch__full" title={b.name}>{b.name}</p>
                    </div>
                  </div>
                  <div
                    className="rpt-branch__util-ring"
                    style={{ ['--util' as string]: `${util}%` }}
                    aria-label={`${util}% utilization`}
                  >
                    <strong>{util}%</strong>
                  </div>
                </header>

                <div className="rpt-branch__hero-metric">
                  <div>
                    <span className="rpt-branch__hero-label">Paid Amount</span>
                    <strong className="rpt-branch__hero-value">{formatCurrency(b.summary.paidAmount)}</strong>
                  </div>
                  <span className="rpt-branch__hero-tag">Collected</span>
                </div>

                <div className="rpt-branch__section-label">Revenue Streams</div>
                <ul className="rpt-branch__streams">
                  <li>
                    <span>PT</span>
                    <strong title={formatCurrency(b.summary.ptRevenue)}>{formatCurrency(b.summary.ptRevenue)}</strong>
                  </li>
                  <li>
                    <span>Subs</span>
                    <strong title={formatCurrency(b.summary.subscriberRevenue)}>{formatCurrency(b.summary.subscriberRevenue)}</strong>
                  </li>
                  <li>
                    <span>Events</span>
                    <strong title={formatCurrency(b.summary.eventRevenue)}>{formatCurrency(b.summary.eventRevenue)}</strong>
                  </li>
                </ul>

                <div className="rpt-branch__hero-metric rpt-branch__hero-metric--pending">
                  <div className="rpt-branch__hero-metric-icon">
                    <Hourglass size={18} />
                  </div>
                  <div className="rpt-branch__hero-metric-body">
                    <span className="rpt-branch__hero-label">Pending amount</span>
                    <strong className="rpt-branch__hero-value">
                      {formatCurrency(pendingTotal)}
                    </strong>
                    <small className="rpt-branch__hero-hint">{pendingHint}</small>
                  </div>
                  <span className="rpt-branch__hero-tag rpt-branch__hero-tag--pending">
                    Pending
                  </span>
                </div>

                <div className="rpt-branch__section-label">Customers & Staff</div>
                <div className="rpt-branch__people">
                  <div className="rpt-branch__person-box">
                    <Users size={16} />
                    <div>
                      <strong>{totalCustomers}</strong>
                      <span>Total Customers</span>
                    </div>
                  </div>
                  <div className="rpt-branch__person-box rpt-branch__person-box--pt">
                    <UserCheck size={16} />
                    <div>
                      <strong>{ptCustomers}</strong>
                      <span>PT Customers</span>
                    </div>
                  </div>
                  <div className="rpt-branch__person-box">
                    <Dumbbell size={16} />
                    <div>
                      <strong>{b.highlights.activeTrainers}</strong>
                      <span>Trainers</span>
                    </div>
                  </div>
                </div>

        
              </article>
            );
          })}
          {!branches.length && (
            <Empty description="No branch data for this filter" />
          )}
        </div>
      </section>

     
    </div>
  );
};

const AttendanceTab = ({
  trainers,
  search,
  onSearch,
}: {
  trainers: ReportTrainer[];
  search: string;
  onSearch: (v: string) => void;
}) => {
  const [page, setPage] = useState(1);
  const pageSize = 12;

  const pageItems = trainers.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="rpt-tab">
      <section className="rpt__panel">
        <div className="rpt__panel-head">
          <div>
            <h2>Trainer attendance</h2>
            <p>Presence and working hours at a glance</p>
          </div>
          <div className="rpt__search">
            <SearchOutlined />
            <input
              value={search}
              onChange={(e) => {
                onSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search trainers…"
            />
          </div>
        </div>

        {trainers.length ? (
          <>
            <div className="rpt__att-grid">
              {pageItems.map((t) => {
                const pct = Math.min(100, t.attendance.attendancePercentage);
                const tone =
                  pct >= 75 ? 'good' : pct >= 50 ? 'ok' : 'low';
                return (
                  <article
                    key={`${t.branchId}-${t.id}`}
                    className={`rpt-att-card rpt-att-card--${tone}`}
                  >
                    <header className="rpt-att-card__head">
                      <div className="rpt-att-card__who">
                        {t.image ? (
                          <img src={t.image} alt="" />
                        ) : (
                          <span>{t.name[0]}</span>
                        )}
                        <div>
                          <h3>{t.name}</h3>
                          <p>{shortBranch(t.branchName)}</p>
                        </div>
                      </div>
                      <div
                        className="rpt-att-card__ring"
                        style={{ ['--util' as string]: `${pct}%` }}
                        aria-label={`${pct}% attendance`}
                      >
                        <strong>{pct}%</strong>
                      </div>
                    </header>

                    <div className="rpt-att-card__body">
                      <div className="rpt-att-card__stat">
                        <span>Present days</span>
                        <strong>{t.attendance.attendanceDisplay}</strong>
                      </div>
                      <div className="rpt-att-card__stat">
                        <span>Hours</span>
                        <strong>{t.workingHours || '00:00'}</strong>
                      </div>
                    </div>

                    <Progress
                      percent={pct}
                      showInfo={false}
                      strokeColor="#ff8a4c"
                      trailColor="#f1f3f7"
                      size={5}
                    />
                  </article>
                );
              })}
            </div>
            {trainers.length > pageSize ? (
              <div className="rpt__att-pager">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  Prev
                </button>
                <span>
                  {page} / {Math.ceil(trainers.length / pageSize)}
                </span>
                <button
                  type="button"
                  disabled={page >= Math.ceil(trainers.length / pageSize)}
                  onClick={() =>
                    setPage((p) =>
                      Math.min(Math.ceil(trainers.length / pageSize), p + 1),
                    )
                  }
                >
                  Next
                </button>
              </div>
            ) : null}
          </>
        ) : (
          <Empty description="No attendance data" />
        )}
      </section>
    </div>
  );
};

const RevenueTab = ({
  primaryMonth,
  compareMonth,
  monthLabels,
}: {
  primaryMonth: GymReport['totals'];
  compareMonth: GymReport['totals'];
  monthLabels: { primary: string; compare: string };
}) => {
  const totalChange = calcRevenueChange(
    primaryMonth.totalRevenue,
    compareMonth.totalRevenue,
  );
  const ptChange = calcRevenueChange(
    primaryMonth.ptRevenue,
    compareMonth.ptRevenue,
  );
  const subChange = calcRevenueChange(
    primaryMonth.subscriberRevenue,
    compareMonth.subscriberRevenue,
  );

  const streamComparison = [
    {
      name: 'Subscriptions',
      compare: compareMonth.subscriberRevenue,
      primary: primaryMonth.subscriberRevenue,
      change: subChange,
      primaryClients: primaryMonth.subscriberClients,
      compareClients: compareMonth.subscriberClients,
      color: '#ffb088',
    },
    {
      name: 'PT',
      compare: compareMonth.ptRevenue,
      primary: primaryMonth.ptRevenue,
      change: ptChange,
      primaryClients: primaryMonth.ptClients,
      compareClients: compareMonth.ptClients,
      color: '#ff8a4c',
    },
  ];

  const totalComparison = [
    {
      name: monthLabels.compare,
      total: compareMonth.totalRevenue,
      fill: '#d5d9e0',
    },
    {
      name: monthLabels.primary,
      total: primaryMonth.totalRevenue,
      fill: '#ff8a4c',
    },
  ];

  const hasData =
    primaryMonth.totalRevenue > 0 ||
    compareMonth.totalRevenue > 0 ||
    primaryMonth.ptRevenue > 0 ||
    compareMonth.ptRevenue > 0 ||
    primaryMonth.subscriberRevenue > 0 ||
    compareMonth.subscriberRevenue > 0;

  return (
    <div className="rpt-tab rpt-tab--revenue">
      <section className="rpt-rev-compare__summary" aria-label="Monthly revenue summary">
        <article className="rpt-rev-compare__card rpt-rev-compare__card--hero">
          <div className="rpt-rev-compare__card-icon">
            <CircleDollarSign size={18} />
          </div>
          <div>
            <span>{monthLabels.primary}</span>
            <strong>{formatCurrency(primaryMonth.totalRevenue)}</strong>
            <small>Selected month total</small>
          </div>
        </article>
        <article className="rpt-rev-compare__card">
          <div className="rpt-rev-compare__card-icon">
            <Wallet size={18} />
          </div>
          <div>
            <span>{monthLabels.compare}</span>
            <strong>{formatCurrency(compareMonth.totalRevenue)}</strong>
            <small>Comparison month total</small>
          </div>
        </article>
        <article className="rpt-rev-compare__card">
          <div className="rpt-rev-compare__card-icon">
            <TrendingUp size={18} />
          </div>
          <div>
            <span>Change</span>
            <strong>
              <ChangeBadge value={totalChange} />
            </strong>
            <small>
              {monthLabels.primary} vs {monthLabels.compare}
            </small>
          </div>
        </article>
      </section>

      <section className="rpt-rev-compare__streams" aria-label="Revenue streams">
        {streamComparison.map((stream) => (
          <article key={stream.name} className="rpt-rev-compare__stream">
            <header>
              <div
                className="rpt-rev-compare__stream-icon"
                style={{ background: `${stream.color}22`, color: stream.color }}
              >
                {stream.name === 'PT' ? (
                  <Dumbbell size={18} />
                ) : (
                  <Users size={18} />
                )}
              </div>
              <div>
                <h3>{stream.name}</h3>
                <p>
                  {stream.primaryClients} clients in {monthLabels.primary} ·{' '}
                  {stream.compareClients} in {monthLabels.compare}
                </p>
              </div>
              <ChangeBadge value={stream.change} />
            </header>
            <div className="rpt-rev-compare__stream-values">
              <div>
                <span>{monthLabels.compare}</span>
                <strong>{formatCurrency(stream.compare)}</strong>
              </div>
              <div>
                <span>{monthLabels.primary}</span>
                <strong>{formatCurrency(stream.primary)}</strong>
              </div>
            </div>
          </article>
        ))}
      </section>

      {hasData ? (
        <section className="rpt__charts rpt-rev-compare__charts">
          <article className="rpt-card rpt-card--wide">
            <header>
              <h2>PT vs Subscriptions</h2>
              <p>
                {monthLabels.compare} compared with {monthLabels.primary}
              </p>
            </header>
            <div className="rpt-card__chart">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={streamComparison} barGap={8} barCategoryGap="24%">
                  <CartesianGrid
                    strokeDasharray="3 6"
                    vertical={false}
                    stroke="rgba(22,24,31,0.06)"
                  />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: MUTED, fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: MUTED, fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={moneyTick}
                  />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    formatter={(value) => formatCurrency(Number(value))}
                  />
                  <Legend
                    verticalAlign="top"
                    height={36}
                    iconType="circle"
                    formatter={(value) => (
                      <span style={{ color: MUTED, fontSize: 12 }}>{value}</span>
                    )}
                  />
                  <Bar
                    dataKey="compare"
                    name={monthLabels.compare}
                    fill="#d5d9e0"
                    radius={[8, 8, 0, 0]}
                    maxBarSize={56}
                  />
                  <Bar
                    dataKey="primary"
                    name={monthLabels.primary}
                    fill="#ff8a4c"
                    radius={[8, 8, 0, 0]}
                    maxBarSize={56}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </article>

          <article className="rpt-card">
            <header>
              <h2>Total revenue</h2>
              <p>Overall collection comparison</p>
            </header>
            <div className="rpt-card__chart">
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={totalComparison} barCategoryGap="30%">
                  <CartesianGrid
                    strokeDasharray="3 6"
                    vertical={false}
                    stroke="rgba(22,24,31,0.06)"
                  />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: MUTED, fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    interval={0}
                    angle={-12}
                    textAnchor="end"
                    height={56}
                  />
                  <YAxis
                    tick={{ fill: MUTED, fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={moneyTick}
                  />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    formatter={(value) => formatCurrency(Number(value))}
                  />
                  <Bar dataKey="total" radius={[8, 8, 0, 0]} maxBarSize={72}>
                    {totalComparison.map((entry) => (
                      <Cell key={entry.name} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="rpt-rev-compare__totals">
              <div>
                <span>{monthLabels.compare}</span>
                <strong>{formatCurrency(compareMonth.totalRevenue)}</strong>
              </div>
              <div>
                <span>{monthLabels.primary}</span>
                <strong>{formatCurrency(primaryMonth.totalRevenue)}</strong>
              </div>
            </div>
          </article>
        </section>
      ) : (
        <Empty description="No revenue data for these months" />
      )}
    </div>
  );
};

export const ReportsHome = () => {
  const [tab, setTab] = useState<ReportTab>('branch');
  const [filter, setFilter] = useState<ReportDateFilter>('monthly');
  const [range, setRange] = useState<[Dayjs, Dayjs] | null>(null);
  const [branchId, setBranchId] = useState<string | undefined>();
  const [trainerId, setTrainerId] = useState<string | undefined>();
  const [trainerSearch, setTrainerSearch] = useState('');
  const defaultRevenueMonths = useMemo(() => getDefaultRevenueMonths(), []);
  const defaultRevenueRanges = useMemo(() => getDefaultRevenueCustomRanges(), []);
  const [revenueMode, setRevenueMode] = useState<RevenueCompareMode>('monthly');
  const [revenuePrimaryMonth, setRevenuePrimaryMonth] = useState(
    defaultRevenueMonths.primary,
  );
  const [revenueCompareMonth, setRevenueCompareMonth] = useState(
    defaultRevenueMonths.compare,
  );
  const [revenuePrimaryRange, setRevenuePrimaryRange] = useState<
    [Dayjs, Dayjs] | null
  >(defaultRevenueRanges.primary);
  const [revenueCompareRange, setRevenueCompareRange] = useState<
    [Dayjs, Dayjs] | null
  >(defaultRevenueRanges.compare);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [exportType, setExportType] = useState<'branch' | 'attendance' | 'pending'>(
    'branch',
  );
  const [exportBranchId, setExportBranchId] = useState<string | undefined>();
  const [exportBranchError, setExportBranchError] = useState(false);
  const [exportFilter, setExportFilter] = useState<ReportDateFilter>('monthly');
  const [exportRange, setExportRange] = useState<[Dayjs, Dayjs] | null>(null);
  const [exportDateError, setExportDateError] = useState(false);

  const query: ReportQuery = useMemo(
    () => ({
      filter,
      startDate:
        filter === 'custom' && range?.[0]
          ? range[0].format('YYYY-MM-DD')
          : undefined,
      endDate:
        filter === 'custom' && range?.[1]
          ? range[1].format('YYYY-MM-DD')
          : undefined,
      branchId,
      trainerId,
    }),
    [filter, range, branchId, trainerId],
  );

  const enabled =
    filter !== 'custom' || Boolean(query.startDate && query.endDate);

  const { data: branchesData } = useBranches({ page: 1, pageSize: 200 });
  const branchNameById = useMemo(() => {
    const map: Record<string, string> = {};
    for (const b of branchesData?.data ?? []) map[b.id] = b.name;
    return map;
  }, [branchesData?.data]);

  const { data: trainersData } = useTrainers(
    { page: 1, pageSize: 200, branchId },
    branchNameById,
  );
  const { data: allTrainers = [] } = useTrainersAll();

  const primaryPeriodRange = useMemo(() => {
    if (revenueMode === 'monthly') {
      return getMonthRange(revenuePrimaryMonth);
    }
    if (!revenuePrimaryRange?.[0] || !revenuePrimaryRange?.[1]) return null;
    return getCustomRange(revenuePrimaryRange);
  }, [revenueMode, revenuePrimaryMonth, revenuePrimaryRange]);

  const comparePeriodRange = useMemo(() => {
    if (revenueMode === 'monthly') {
      return getMonthRange(revenueCompareMonth);
    }
    if (!revenueCompareRange?.[0] || !revenueCompareRange?.[1]) return null;
    return getCustomRange(revenueCompareRange);
  }, [revenueMode, revenueCompareMonth, revenueCompareRange]);

  const primaryMonthReportQuery = useMemo<ReportQuery | null>(() => {
    if (!primaryPeriodRange) return null;
    return {
      filter: 'custom',
      startDate: primaryPeriodRange.start,
      endDate: primaryPeriodRange.end,
      branchId,
      trainerId,
    };
  }, [primaryPeriodRange, branchId, trainerId]);

  const compareMonthReportQuery = useMemo<ReportQuery | null>(() => {
    if (!comparePeriodRange) return null;
    return {
      filter: 'custom',
      startDate: comparePeriodRange.start,
      endDate: comparePeriodRange.end,
      branchId,
      trainerId,
    };
  }, [comparePeriodRange, branchId, trainerId]);

  const revenueReady =
    revenueMode === 'monthly' ||
    Boolean(
      revenuePrimaryRange?.[0] &&
        revenuePrimaryRange?.[1] &&
        revenueCompareRange?.[0] &&
        revenueCompareRange?.[1],
    );

  const revenueTabActive =
    tab === 'revenue' && revenueReady && Boolean(primaryMonthReportQuery && compareMonthReportQuery);

  const { data, isLoading, isFetching } = useGymReport(query, enabled && tab !== 'revenue');
  const { data: primaryMonthReport, isLoading: loadingPrimaryMonth } = useGymReport(
    primaryMonthReportQuery ?? { filter: 'monthly' },
    revenueTabActive && Boolean(primaryMonthReportQuery),
  );
  const { data: compareMonthReport, isLoading: loadingCompareMonth } = useGymReport(
    compareMonthReportQuery ?? { filter: 'monthly' },
    revenueTabActive && Boolean(compareMonthReportQuery),
  );
  const { excel } = useReportExport(query);

  const totals = data?.totals ?? EMPTY_REPORT_TOTALS;
  const branches = data?.branches ?? [];

  const trainerRows = useMemo(() => {
    const all = branches.flatMap((b) => b.trainers);
    if (!trainerSearch.trim()) return all;
    const q = trainerSearch.toLowerCase();
    return all.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.branchName.toLowerCase().includes(q) ||
        (t.mobile ?? '').includes(q),
    );
  }, [branches, trainerSearch]);

  const revenueLoading = loadingPrimaryMonth || loadingCompareMonth;
  const pageLoading =
    tab === 'revenue' ? revenueLoading : isLoading || !data;
  const showReports =
    tab === 'revenue' ? revenueReady : enabled;
  const isRefreshing =
    tab === 'revenue' ? revenueLoading : isFetching;

  const activeTab = TABS.find((t) => t.key === tab)!;
  const primaryMonthTotals = primaryMonthReport?.totals ?? EMPTY_REPORT_TOTALS;
  const compareMonthTotals = compareMonthReport?.totals ?? EMPTY_REPORT_TOTALS;

  const excelLabel =
    tab === 'attendance' ? 'Trainer Attendance Excel' : 'Branch Summary Excel';

  const showExcelExport = tab === 'branch' || tab === 'attendance';

  const exportModalCopy = {
    branch: {
      title: 'Export Branch Summary',
      subtitle: 'Download branch summary report as Excel (.xlsx)',
      hint: 'Branch totals, revenue, and trainer highlights for the selected period.',
      error: 'Please select a branch to generate the branch summary report.',
    },
    attendance: {
      title: 'Export Trainer Attendance',
      subtitle: 'Download trainer attendance report as Excel (.xlsx)',
      hint: 'Trainer presence and working hours for the selected period.',
      error: 'Please select a branch to generate the attendance report.',
    },
    pending: {
      title: 'Export Pending Amount List',
      subtitle: 'Download pending amounts as Excel (.xlsx)',
      hint: 'Columns: Branch, Trainer, Client Name, Contact, Plan Value, Collected, Pending.',
      error: 'Please select a branch to generate the pending amount report.',
    },
  } as const;

  const openExportModal = (type: 'branch' | 'attendance' | 'pending') => {
    setExportType(type);
    setExportBranchId(branchId ?? 'all');
    setExportBranchError(false);
    setExportFilter(filter === 'custom' ? 'custom' : filter);
    setExportRange(
      filter === 'custom' && range?.[0] && range?.[1]
        ? [range[0], range[1]]
        : null,
    );
    setExportDateError(false);
    setExportModalOpen(true);
  };

  const handleExportDownload = () => {
    if (!exportBranchId) {
      setExportBranchError(true);
      message.error('Branch selection is required to export the report');
      return;
    }
    setExportBranchError(false);

    if (exportFilter === 'custom') {
      if (!exportRange?.[0] || !exportRange?.[1]) {
        setExportDateError(true);
        message.error('Please select a custom date range');
        return;
      }
      if (exportRange[0].isAfter(exportRange[1], 'day')) {
        setExportDateError(true);
        message.error('From date cannot be after To date');
        return;
      }
    }
    setExportDateError(false);

    excel.mutate(
      {
        reportType: exportType,
        branchId: exportBranchId,
        filter: exportFilter,
        startDate:
          exportFilter === 'custom' && exportRange?.[0]
            ? exportRange[0].format('YYYY-MM-DD')
            : undefined,
        endDate:
          exportFilter === 'custom' && exportRange?.[1]
            ? exportRange[1].format('YYYY-MM-DD')
            : undefined,
      },
      {
        onSuccess: () => setExportModalOpen(false),
      },
    );
  };

  return (
    <div className="rpt">
      <header className="rpt__hero">
        <div>
          <h1>Reports</h1>
          <p className="rpt__sub">{activeTab.hint}</p>
        </div>
        <div className="rpt__hero-actions">
          {isRefreshing ? <span className="rpt__live">Updating…</span> : null}
          {showExcelExport ? (
            <Button
              icon={<FileExcelOutlined />}
              disabled={!showReports}
              onClick={() => {
                if (tab === 'branch' || tab === 'attendance') {
                  openExportModal(tab);
                }
              }}
            >
              {excelLabel}
            </Button>
          ) : null}
          {tab === 'branch' ? (
            <Button
              icon={<FileExcelOutlined />}
              disabled={!showReports}
              onClick={() => openExportModal('pending')}
            >
              Pending Amount Excel
            </Button>
          ) : null}
        </div>
      </header>

      <nav className="rpt__tabs" aria-label="Report sections">
        {TABS.map((item) => (
          <button
            key={item.key}
            type="button"
            className={
              tab === item.key ? 'rpt__tab rpt__tab--on' : 'rpt__tab'
            }
            onClick={() => setTab(item.key)}
          >
            <strong>{item.label}</strong>
            <span>{item.hint}</span>
          </button>
        ))}
      </nav>

      <section className="rpt__filters">
        {tab !== 'revenue' ? (
          <div className="rpt__periods" role="tablist" aria-label="Date range">
            {PERIODS.map((p) => (
              <button
                key={p.value}
                type="button"
                className={
                  filter === p.value ? 'rpt__period rpt__period--on' : 'rpt__period'
                }
                onClick={() => setFilter(p.value)}
              >
                {p.label}
              </button>
            ))}
          </div>
        ) : (
          <div className="rpt__revenue-filters">
            <div className="rpt__periods" role="tablist" aria-label="Revenue compare mode">
              {REVENUE_MODES.map((mode) => (
                <button
                  key={mode.value}
                  type="button"
                  className={
                    revenueMode === mode.value
                      ? 'rpt__period rpt__period--on'
                      : 'rpt__period'
                  }
                  onClick={() => setRevenueMode(mode.value)}
                >
                  {mode.label}
                </button>
              ))}
            </div>

            {revenueMode === 'monthly' ? (
              <div className="rpt__revenue-months">
                <label className="rpt__revenue-month">
                  <span>Compare month</span>
                  <DatePicker
                    picker="month"
                    size="large"
                    allowClear={false}
                    value={revenuePrimaryMonth}
                    onChange={(value) =>
                      value && setRevenuePrimaryMonth(value.startOf('month'))
                    }
                    disabledDate={(date) => date.isAfter(dayjs(), 'month')}
                    format="MMMM YYYY"
                  />
                </label>
                <span className="rpt__revenue-vs">vs</span>
                <label className="rpt__revenue-month">
                  <span>With month</span>
                  <DatePicker
                    picker="month"
                    size="large"
                    allowClear={false}
                    value={revenueCompareMonth}
                    onChange={(value) =>
                      value && setRevenueCompareMonth(value.startOf('month'))
                    }
                    disabledDate={(date) => date.isAfter(dayjs(), 'month')}
                    format="MMMM YYYY"
                  />
                </label>
              </div>
            ) : (
              <div className="rpt__revenue-ranges">
                <label className="rpt__revenue-range">
                  <span>Compare period</span>
                  <RangePicker
                    size="large"
                    value={revenuePrimaryRange}
                    onChange={(value) =>
                      setRevenuePrimaryRange(
                        value && value[0] && value[1] ? [value[0], value[1]] : null,
                      )
                    }
                    disabledDate={(date) => date.isAfter(dayjs(), 'day')}
                    format="DD MMM YYYY"
                  />
                </label>
                <span className="rpt__revenue-vs">vs</span>
                <label className="rpt__revenue-range">
                  <span>With period</span>
                  <RangePicker
                    size="large"
                    value={revenueCompareRange}
                    onChange={(value) =>
                      setRevenueCompareRange(
                        value && value[0] && value[1] ? [value[0], value[1]] : null,
                      )
                    }
                    disabledDate={(date) => date.isAfter(dayjs(), 'day')}
                    format="DD MMM YYYY"
                  />
                </label>
              </div>
            )}
          </div>
        )}

        <div className="rpt__controls">
          {filter === 'custom' && tab !== 'revenue' && (
            <RangePicker
              size="large"
              value={range}
              onChange={(v) =>
                setRange(v && v[0] && v[1] ? [v[0], v[1]] : null)
              }
              disabledDate={(d) => d.isAfter(dayjs(), 'day')}
            />
          )}
          <Select
            allowClear
            showSearch
            optionFilterProp="label"
            size="large"
            placeholder="All branches"
            className="rpt__select"
            value={branchId}
            onChange={(v) => {
              setBranchId(v);
              setTrainerId(undefined);
            }}
            options={branchesData?.data.map((b) => ({
              value: b.id,
              label: shortBranch(b.name),
            }))}
          />
          {tab !== 'branch' && (
            <Select
              allowClear
              showSearch
              optionFilterProp="label"
              size="large"
              placeholder="All trainers"
              className="rpt__select"
              value={trainerId}
              onChange={setTrainerId}
              options={trainersData?.data.map((t) => ({
                value: t.id,
                label: t.name,
              }))}
            />
          )}
        </div>
      </section>

      {!showReports ? (
        <Empty
          description={
            tab === 'revenue'
              ? 'Pick compare and with date ranges'
              : 'Pick a custom date range to load reports'
          }
        />
      ) : pageLoading ? (
        <PageSkeleton variant="report" />
      ) : (
        <>
          {tab === 'branch' ? (
            <BranchOverviewCards
              branches={branches}
              totals={totals}
              branchMeta={branchesData?.data ?? []}
              allTrainers={allTrainers}
              branchId={branchId}
            />
          ) : null}
          {tab === 'branch' ? (
            <BranchSummaryTab
              branches={branches}
              branchMeta={branchesData?.data ?? []}
              allTrainers={allTrainers}
            />
          ) : tab === 'attendance' ? (
            <AttendanceTab
              trainers={trainerRows}
              search={trainerSearch}
              onSearch={setTrainerSearch}
            />
          ) : (
            <RevenueTab
              primaryMonth={primaryMonthTotals}
              compareMonth={compareMonthTotals}
              monthLabels={{
                primary: primaryPeriodRange?.label ?? 'Compare period',
                compare: comparePeriodRange?.label ?? 'With period',
              }}
            />
          )}
        </>
      )}

      <Modal
        open={exportModalOpen}
        onCancel={() => !excel.isPending && setExportModalOpen(false)}
        destroyOnClose
        centered
        width={500}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                background: '#fff0e8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ff5000',
              }}
            >
              <FileExcelOutlined style={{ fontSize: 20 }} />
            </div>
            <div>
              <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: '#16181f' }}>
                {exportModalCopy[exportType].title}
              </h4>
              <small style={{ color: '#6f7685', fontSize: '0.78rem' }}>
                {exportModalCopy[exportType].subtitle}
              </small>
            </div>
          </div>
        }
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', paddingTop: '0.5rem' }}>
            <Button disabled={excel.isPending} onClick={() => setExportModalOpen(false)}>
              Cancel
            </Button>
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              loading={excel.isPending}
              onClick={handleExportDownload}
              style={{
                background: '#ff5000',
                borderColor: '#ff5000',
                fontWeight: 600,
                borderRadius: 10,
              }}
            >
              Download Excel (.xlsx)
            </Button>
          </div>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', paddingTop: '0.75rem' }}>
          <div
            style={{
              padding: '0.85rem 1rem',
              borderRadius: 14,
              background: '#f8fafc',
              border: exportBranchError
                ? '1px solid #ff4d4f'
                : '1px solid rgba(22, 24, 31, 0.08)',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 4,
              }}
            >
              <span
                style={{
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  color: '#6f7685',
                  fontWeight: 600,
                }}
              >
                Target Branch <span style={{ color: '#ff4d4f' }}>*</span>
              </span>
              {exportBranchError ? (
                <span style={{ fontSize: '0.75rem', color: '#ff4d4f', fontWeight: 600 }}>
                  Selection Required
                </span>
              ) : null}
            </div>
            <Select
              showSearch
              optionFilterProp="label"
              style={{ width: '100%' }}
              placeholder="Select Branch (Required)"
              status={exportBranchError ? 'error' : ''}
              value={exportBranchId}
              onChange={(val) => {
                setExportBranchId(val);
                if (val) setExportBranchError(false);
              }}
              options={[
                { value: 'all', label: 'All Branches' },
                ...(branchesData?.data.map((b) => ({
                  value: String(b.id),
                  label: shortBranch(b.name),
                })) ?? []),
              ]}
            />
            {exportBranchError ? (
              <small
                style={{
                  color: '#ff4d4f',
                  fontSize: '0.75rem',
                  marginTop: 4,
                  display: 'block',
                }}
              >
                {exportModalCopy[exportType].error}
              </small>
            ) : null}
          </div>

          <div>
            <span
              style={{
                fontSize: '0.82rem',
                fontWeight: 600,
                color: '#16181f',
                display: 'block',
                marginBottom: '0.5rem',
              }}
            >
              Date Range
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {PERIODS.map((p) => (
                <button
                  key={p.value}
                  type="button"
                  className={
                    exportFilter === p.value
                      ? 'rpt__period rpt__period--on'
                      : 'rpt__period'
                  }
                  onClick={() => {
                    setExportFilter(p.value);
                    setExportDateError(false);
                    if (p.value !== 'custom') setExportRange(null);
                  }}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {exportFilter === 'custom' ? (
            <div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '0.5rem',
                }}
              >
                <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#16181f' }}>
                  Custom Date Range <span style={{ color: '#ff4d4f' }}>*</span>
                </span>
                {exportDateError ? (
                  <span style={{ fontSize: '0.75rem', color: '#ff4d4f', fontWeight: 600 }}>
                    Required
                  </span>
                ) : null}
              </div>
              <RangePicker
                style={{ width: '100%' }}
                value={exportRange}
                status={exportDateError ? 'error' : ''}
                format="DD MMM YYYY"
                onChange={(v) => {
                  setExportRange(v && v[0] && v[1] ? [v[0], v[1]] : null);
                  if (v?.[0] && v?.[1]) setExportDateError(false);
                }}
                disabledDate={(d) => d.isAfter(dayjs(), 'day')}
              />
              {exportDateError ? (
                <small
                  style={{
                    color: '#ff4d4f',
                    fontSize: '0.75rem',
                    marginTop: 4,
                    display: 'block',
                  }}
                >
                  Please select both From and To dates.
                </small>
              ) : null}
            </div>
          ) : null}

          <p style={{ margin: 0, fontSize: '0.8rem', color: '#6f7685' }}>
            {exportModalCopy[exportType].hint}
          </p>
        </div>
      </Modal>
    </div>
  );
};
