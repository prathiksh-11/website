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
  User,
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
import { normalizeTrainerType, resolveTrainerType } from '@/constants';
import { useBranches } from '@/hooks/useBranches';
import { useCustomersAll } from '@/hooks/useCustomers';
import {
  useGymReport,
  useGymReportQueries,
  useReportExport,
} from '@/hooks/useReports';
import { useTrainers, useTrainersAll } from '@/hooks/useTrainers';
import type {
  Branch,
  Customer,
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

const MUTED = '#9aa0ab';
const PRIMARY_BAR = '#ff8a4c';
const COMPARE_BAR = '#c5cad3';
const PT_BAR = '#ff6b1a';
const SUB_BAR = '#ffb088';

type ReportTab = 'branch' | 'attendance' | 'revenue';

const TABS: Array<{ key: ReportTab; label: string; hint: string }> = [
  { key: 'branch', label: 'Branch summary', hint: '' },
  { key: 'attendance', label: 'Trainer attendance', hint: 'Presence & working hours' },
  { key: 'revenue', label: 'Revenue', hint: 'Week-wise monthly or month-wise yearly comparison' },
];

type RevenueCompareMode = 'today' | 'monthly' | 'yearly';

const REVENUE_MODES: Array<{ value: RevenueCompareMode; label: string }> = [
  { value: 'today', label: 'Today' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' },
];

const PERIODS: Array<{ value: ReportDateFilter; label: string }> = [
  { value: 'today', label: 'Today' },
  { value: 'weekly', label: '7 days' },
  { value: 'monthly', label: '30 days' },
  { value: 'yearly', label: '1 year' },
  { value: 'all', label: 'All time' },
  { value: 'custom', label: 'Custom' },
];

type RevenueSlice = {
  key: string;
  label: string;
  shortLabel: string;
  start: string;
  end: string;
};

type RevenueComparePoint = {
  label: string;
  shortLabel: string;
  primaryTotal: number;
  compareTotal: number;
  primaryPt: number;
  comparePt: number;
  primarySub: number;
  compareSub: number;
};

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

const getDefaultRevenueMonths = () => {
  const now = dayjs();
  return {
    primary: now.startOf('month'),
    compare: now.subtract(1, 'month').startOf('month'),
  };
};

const getDefaultRevenueYears = () => {
  const now = dayjs();
  return {
    primary: now.startOf('year'),
    compare: now.subtract(1, 'year').startOf('year'),
  };
};

/** Split a month into Week 1–5 buckets (days 1–7, 8–14, …). */
const getMonthWeekSlices = (month: Dayjs): RevenueSlice[] => {
  const monthStart = month.startOf('month');
  const now = dayjs();
  const monthEnd = month.isSame(now, 'month') ? now.endOf('day') : month.endOf('month');
  const weekCount = Math.ceil(month.daysInMonth() / 7);
  const slices: RevenueSlice[] = [];

  for (let w = 0; w < weekCount; w += 1) {
    const start = monthStart.add(w * 7, 'day');
    if (start.isAfter(monthEnd, 'day')) break;
    let end = monthStart.add(w * 7 + 6, 'day').endOf('day');
    if (end.isAfter(monthEnd)) end = monthEnd;
    slices.push({
      key: `w${w + 1}`,
      label: `Week ${w + 1}`,
      shortLabel: `W${w + 1}`,
      start: start.format('YYYY-MM-DD'),
      end: end.format('YYYY-MM-DD'),
    });
  }

  return slices;
};

/** Jan–Dec slices for a year (skips future months). */
const getYearMonthSlices = (year: Dayjs): RevenueSlice[] => {
  const now = dayjs();
  const slices: RevenueSlice[] = [];

  for (let i = 0; i < 12; i += 1) {
    const month = year.month(i).startOf('month');
    if (month.isAfter(now, 'month')) break;
    const end = month.isSame(now, 'month') ? now.endOf('day') : month.endOf('month');
    slices.push({
      key: `m${i}`,
      label: month.format('MMMM'),
      shortLabel: month.format('MMM'),
      start: month.format('YYYY-MM-DD'),
      end: end.format('YYYY-MM-DD'),
    });
  }

  return slices;
};

const calcRevenueChange = (current: number, previous: number) => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Number((((current - previous) / previous) * 100).toFixed(1));
};

const sumSliceTotals = (
  reports: Array<GymReport | undefined>,
  count: number,
  offset = 0,
) => {
  let totalRevenue = 0;
  let ptRevenue = 0;
  let subscriberRevenue = 0;
  for (let i = 0; i < count; i += 1) {
    const t = reports[offset + i]?.totals;
    if (!t) continue;
    totalRevenue += t.totalRevenue;
    ptRevenue += t.ptRevenue;
    subscriberRevenue += t.subscriberRevenue;
  }
  return { totalRevenue, ptRevenue, subscriberRevenue };
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
  staff,
  branchId,
  branchMeta = [],
  allTrainers = [],
  allCustomers = [],
}: {
  branches: ReportBranch[];
  totals: GymReport['totals'];
  staff?: GymReport['staff'];
  branchId?: string;
  branchMeta?: Branch[];
  allTrainers?: Trainer[];
  allCustomers?: Customer[];
}) => {
  const reportTotals = totals ?? EMPTY_REPORT_TOTALS;

  const calculatedStaff = useMemo(() => {
    if (staff && staff.total > 0) {
      return {
        ...staff,
        manager:
          staff.manager ||
          (staff.managerNames ? staff.managerNames.length : 0),
      };
    }

    const branchStaffSum = branches.reduce(
      (acc, b) => {
        if (b.staff) {
          acc.generalTrainer += b.staff.generalTrainer || 0;
          acc.ptTrainer += b.staff.ptTrainer || 0;
          acc.membershipCoordinator += b.staff.membershipCoordinator || 0;
          acc.receptionist += b.staff.receptionist || 0;
          acc.manager +=
            b.staff.manager ||
            (b.staff.managerNames ? b.staff.managerNames.length : 0) ||
            (b.managerName && b.managerName !== 'N/A' && b.managerName !== '—'
              ? 1
              : 0);
          acc.total += b.staff.total || 0;
          if (b.staff.managerNames) {
            acc.managerNames.push(...b.staff.managerNames);
          }
        } else if (
          b.managerName &&
          b.managerName !== 'N/A' &&
          b.managerName !== '—'
        ) {
          acc.manager += 1;
        }
        return acc;
      },
      {
        generalTrainer: 0,
        ptTrainer: 0,
        membershipCoordinator: 0,
        receptionist: 0,
        manager: 0,
        total: 0,
        managerNames: [] as string[],
      },
    );

    if (branchStaffSum.total > 0 || branchStaffSum.manager > 0) {
      return branchStaffSum;
    }

    if (allTrainers.length > 0) {
      const relevantBranches = branchId
        ? branches.filter((b) => b.id === branchId)
        : branches;

      let gen = 0;
      let pt = 0;
      let mc = 0;
      let reci = 0;
      let mgr = 0;
      let tot = 0;

      for (const b of relevantBranches) {
        const counts = countBranchStaff(allTrainers, b.id, b.name);
        gen += counts.general_trainer || 0;
        pt += counts.pt_trainer || 0;
        mc += counts.membership_coordinator || 0;
        reci += counts.receptionist || 0;
        mgr +=
          counts.manager ||
          (branchMeta.find((m) => m.id === b.id)?.managerName &&
            branchMeta.find((m) => m.id === b.id)?.managerName !== '—' &&
            branchMeta.find((m) => m.id === b.id)?.managerName !== 'N/A'
            ? 1
            : 0);
        tot += counts.total || 0;
      }

      return {
        generalTrainer: gen,
        ptTrainer: pt,
        membershipCoordinator: mc,
        receptionist: reci,
        manager: mgr,
        total: tot,
        managerNames: [],
      };
    }

    const metaManagerCount = branchMeta.filter(
      (m) =>
        (branchId ? m.id === branchId : true) &&
        m.managerName &&
        m.managerName !== '—' &&
        m.managerName !== 'N/A',
    ).length;

    return staff
      ? {
        ...staff,
        manager:
          staff.manager ||
          (staff.managerNames ? staff.managerNames.length : 0) ||
          metaManagerCount,
      }
      : {
        generalTrainer: 0,
        ptTrainer: 0,
        membershipCoordinator: 0,
        receptionist: 0,
        manager: metaManagerCount,
        total: 0,
        managerNames: [],
      };
  }, [allTrainers, branchId, branchMeta, branches, staff]);

  const aggregates = useMemo(() => {
    const metaManagerCount = branchMeta.filter(
      (m) =>
        (branchId ? m.id === branchId : true) &&
        m.managerName &&
        m.managerName !== '—' &&
        m.managerName !== 'N/A',
    ).length;

    const calculatedTotalClients = branchId
      ? Math.max(
          reportTotals.totalCustomers,
          allCustomers.filter(
            (c) =>
              c.branchId === branchId ||
              branches.some(
                (b) =>
                  b.id === branchId &&
                  b.name.toLowerCase() === (c.branchName || '').toLowerCase(),
              ),
          ).length,
        )
      : Math.max(reportTotals.totalCustomers, allCustomers.length);

    return {
      manager: calculatedStaff.manager || metaManagerCount || 0,
      generalTrainer: calculatedStaff.generalTrainer || 0,
      ptTrainer: calculatedStaff.ptTrainer || 0,
      mc: calculatedStaff.membershipCoordinator || 0,
      reci: calculatedStaff.receptionist || 0,
      totalEmployees: calculatedStaff.total || 0,
      totalClients: calculatedTotalClients,
      ptClients: reportTotals.ptClients,
      membershipClients: reportTotals.subscriberClients,
      subscriptionRevenue: reportTotals.subscriberRevenue,
      eventRevenue: reportTotals.eventRevenue,
      ptRevenue: reportTotals.ptRevenue,
      totalRevenueAll: reportTotals.totalRevenue,
    };
  }, [allCustomers, branchId, branchMeta, branches, calculatedStaff, reportTotals]);

  const branchNameLabel =
    branchId && branches.length === 1
      ? shortBranch(branches[0].name)
      : `${reportTotals.branchCount} branches`;

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
        value: String(aggregates.manager),
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
        label: 'Personal trainer',
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
              <Icon size={14} />
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
    if (trainer.roleId == null || trainer.roleId === 0) continue;
    if (trainer.roleId === 1) continue;
    if (!trainerBelongsToBranch(trainer, branchId, branchName)) continue;

    const type =
      resolveTrainerType(trainer) ??
      normalizeTrainerType(trainer.trainerType, trainer.description) ??
      (trainer.roleId === 3
        ? 'manager'
        : trainer.roleId === 2
          ? 'admin'
          : 'general_trainer');

    if (counts[type] != null) {
      counts[type] += 1;
    }
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
  allCustomers = [],
}: {
  branches: ReportBranch[];
  branchMeta: Branch[];
  allTrainers: Trainer[];
  allCustomers?: Customer[];
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
        const branchCustCount = allCustomers.filter(
          (c) =>
            c.branchId === branch.id ||
            (c.branchName &&
              c.branchName.toLowerCase() === branch.name.toLowerCase()),
        ).length;

        return {
          key: branch.id,
          branchName: branch.name,
          manager: managerByBranchId[branch.id] ?? '—',
          generalTrainer: staff.general_trainer,
          ptTrainer: staff.pt_trainer,
          mc: staff.membership_coordinator,
          reci: staff.receptionist,
          totalClients: Math.max(summary.totalCustomers, branchCustCount),
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
    [allCustomers, allTrainers, branches, managerByBranchId],
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
    { title: 'Personal trainer', dataIndex: 'ptTrainer', width: 120, align: 'center' },
    { title: 'Membership Coordinator', dataIndex: 'mc', width: 70, align: 'center' },
    { title: 'Receptionist', dataIndex: 'reci', width: 70, align: 'center' },
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
            const util = Math.round(Math.min(100, Math.max(0, b.highlights.sessionUtilization || 0)));
            const branchCustCount = allCustomers.filter(
              (c) =>
                c.branchId === b.id ||
                (c.branchName &&
                  c.branchName.toLowerCase() === b.name.toLowerCase()),
            ).length;
            const totalCustomers = Math.max(
              b.summary.totalCustomers || 0,
              branchCustCount,
            );
            const ptCustomers = b.summary.ptClients || 0;
            const staff = countBranchStaff(allTrainers, b.id, b.name);
            const manager = managerByBranchId[b.id] || b.managerName || '—';

            return (
              <article key={b.id} className="rpt-branch">
                {/* Header */}
                <div className="rpt-branch__header">
                  <div className="rpt-branch__title-wrap">
                    <div className="rpt-branch__badge">
                      <Building2 size={16} />
                    </div>
                    <h3 title={b.name}>{b.name}</h3>
                  </div>
                </div>

                {/* Total Revenue Below Branch */}
                <div className="rpt-branch__revenue-block">
                  <span className="rpt-branch__rev-label">Total Revenue</span>
                  <strong className="rpt-branch__amt">
                    {formatCurrency(b.summary.paidAmount)}
                  </strong>
                </div>

                {/* Revenue Streams Breakdown */}
                <div className="rpt-branch__streams">
                  <div className="rpt-branch__stream-item rpt-branch__stream-item--pt">
                    <span className="rpt-branch__stream-label">PT</span>
                    <strong className="rpt-branch__stream-val">
                      {formatCurrency(b.summary.ptRevenue)}
                    </strong>
                  </div>
                  <div className="rpt-branch__stream-item rpt-branch__stream-item--subs">
                    <span className="rpt-branch__stream-label">Subs</span>
                    <strong className="rpt-branch__stream-val">
                      {formatCurrency(b.summary.subscriberRevenue)}
                    </strong>
                  </div>
                  <div className="rpt-branch__stream-item rpt-branch__stream-item--event">
                    <span className="rpt-branch__stream-label">Events</span>
                    <strong className="rpt-branch__stream-val">
                      {formatCurrency(b.summary.eventRevenue)}
                    </strong>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="rpt-branch__stats-grid">
                  <div className="rpt-branch__stat-chip" title="Total Customers">
                    <div className="rpt-branch__stat-icon-wrap rpt-branch__stat-icon-wrap--members">
                      <Users size={13} />
                    </div>
                    <div className="rpt-branch__stat-text">
                      <span className="rpt-branch__stat-val">{totalCustomers}</span>
                      <span className="rpt-branch__stat-name">Total Customers</span>
                    </div>
                  </div>

                  <div className="rpt-branch__stat-chip" title="PT Customers">
                    <div className="rpt-branch__stat-icon-wrap rpt-branch__stat-icon-wrap--pt">
                      <UserCheck size={13} />
                    </div>
                    <div className="rpt-branch__stat-text">
                      <span className="rpt-branch__stat-val">{ptCustomers}</span>
                      <span className="rpt-branch__stat-name">PT Customers</span>
                    </div>
                  </div>

                  <div className="rpt-branch__stat-chip" title="Trainers">
                    <div className="rpt-branch__stat-icon-wrap rpt-branch__stat-icon-wrap--staff">
                      <Dumbbell size={13} />
                    </div>
                    <div className="rpt-branch__stat-text">
                      <span className="rpt-branch__stat-val">{b.highlights.activeTrainers || staff.pt_trainer + staff.general_trainer || staff.total || 0}</span>
                      <span className="rpt-branch__stat-name">Trainers</span>
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
  mode,
  points,
  primaryLabel,
  compareLabel,
  primaryTotals,
  compareTotals,
  loading,
}: {
  mode: RevenueCompareMode;
  points: RevenueComparePoint[];
  primaryLabel: string;
  compareLabel: string;
  primaryTotals: { totalRevenue: number; ptRevenue: number; subscriberRevenue: number };
  compareTotals: { totalRevenue: number; ptRevenue: number; subscriberRevenue: number };
  loading: boolean;
}) => {
  const totalChange = calcRevenueChange(
    primaryTotals.totalRevenue,
    compareTotals.totalRevenue,
  );
  const difference = primaryTotals.totalRevenue - compareTotals.totalRevenue;
  const ptChange = calcRevenueChange(primaryTotals.ptRevenue, compareTotals.ptRevenue);
  const subChange = calcRevenueChange(
    primaryTotals.subscriberRevenue,
    compareTotals.subscriberRevenue,
  );

  const hasData = points.some(
    (p) =>
      p.primaryTotal > 0 ||
      p.compareTotal > 0 ||
      p.primaryPt > 0 ||
      p.comparePt > 0 ||
      p.primarySub > 0 ||
      p.compareSub > 0,
  );

  const bucketLabel = mode === 'today' ? 'day' : mode === 'monthly' ? 'week' : 'month';
  let peakLabel = '—';
  let lowLabel = '—';
  if (points.length > 0) {
    const withPrimary = [...points].sort((a, b) => b.primaryTotal - a.primaryTotal);
    peakLabel = withPrimary[0]?.label ?? '—';
    const nonZero = withPrimary.filter((p) => p.primaryTotal > 0);
    lowLabel = (nonZero.length ? nonZero[nonZero.length - 1] : withPrimary[withPrimary.length - 1])
      ?.label ?? '—';
  }

  if (loading) {
    return <PageSkeleton variant="report" />;
  }

  return (
    <div className="rpt-tab rpt-tab--revenue">
      <header className="rpt-rev-dash__intro">
        <div>
          <h2>Revenue Overview</h2>
          <p>
            {primaryLabel} vs {compareLabel} ·{' '}
            {mode === 'today'
              ? 'Day-wise comparison'
              : mode === 'monthly'
                ? 'Week-wise breakdown'
                : 'Month-wise breakdown'}
          </p>
        </div>
      </header>

      <section className="rpt-rev-dash__summary" aria-label="Revenue summary">
        <article className="rpt-rev-dash__card rpt-rev-dash__card--hero">
          <span>Selected period</span>
          <strong>{formatCurrency(primaryTotals.totalRevenue)}</strong>
          <small>{primaryLabel}</small>
        </article>
        <article className="rpt-rev-dash__card">
          <span>Comparison period</span>
          <strong>{formatCurrency(compareTotals.totalRevenue)}</strong>
          <small>{compareLabel}</small>
        </article>
        <article className="rpt-rev-dash__card">
          <span>Revenue difference</span>
          <strong className={difference >= 0 ? 'rpt-rev-dash__pos' : 'rpt-rev-dash__neg'}>
            {difference >= 0 ? '+' : ''}
            {formatCurrency(difference)}
          </strong>
          <small>Selected − comparison</small>
        </article>
        <article className="rpt-rev-dash__card">
          <span>Growth</span>
          <strong>
            <ChangeBadge value={totalChange} />
          </strong>
          <small>
            {primaryLabel} vs {compareLabel}
          </small>
        </article>
      </section>

      {hasData ? (
        <>
          <section className="rpt-rev-dash__main" aria-label="Main revenue comparison">
            <article className="rpt-card rpt-rev-dash__chart-card">
              <header>
                <div>
                  <h2>Total Revenue</h2>
                  <p>
                    {mode === 'today'
                      ? 'Today vs Yesterday comparison'
                      : mode === 'monthly'
                        ? 'Week-wise comparison for both months'
                        : 'Month-wise comparison for both years'}
                  </p>
                </div>
                <div className="rpt-rev-dash__legend">
                  <span>
                    <i style={{ background: PRIMARY_BAR }} />
                    {primaryLabel}
                  </span>
                  <span>
                    <i style={{ background: COMPARE_BAR }} />
                    {compareLabel}
                  </span>
                </div>
              </header>
              <div className="rpt-card__chart rpt-rev-dash__chart-tall">
                <ResponsiveContainer width="100%" height={380}>
                  <BarChart data={points} barGap={6} barCategoryGap="25%">
                    <CartesianGrid
                      strokeDasharray="3 6"
                      vertical={false}
                      stroke="rgba(22,24,31,0.06)"
                    />
                    <XAxis
                      dataKey="shortLabel"
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
                      labelFormatter={(_, payload) =>
                        String(payload?.[0]?.payload?.label ?? _)
                      }
                      formatter={(value, name) => [
                        formatCurrency(Number(value)),
                        String(name),
                      ]}
                    />
                    <Legend
                      verticalAlign="top"
                      height={32}
                      iconType="circle"
                      formatter={(value) => (
                        <span style={{ color: MUTED, fontSize: 12 }}>{value}</span>
                      )}
                    />
                    {mode === 'today' ? (
                      <Bar
                        dataKey="primaryTotal"
                        name="Total Revenue"
                        radius={[8, 8, 0, 0]}
                        maxBarSize={56}
                      >
                        {points.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={entry.shortLabel === 'Today' ? PRIMARY_BAR : COMPARE_BAR}
                          />
                        ))}
                      </Bar>
                    ) : (
                      <>
                        <Bar
                          dataKey="compareTotal"
                          name={compareLabel}
                          fill={COMPARE_BAR}
                          radius={[8, 8, 0, 0]}
                          maxBarSize={42}
                        />
                        <Bar
                          dataKey="primaryTotal"
                          name={primaryLabel}
                          fill={PRIMARY_BAR}
                          radius={[8, 8, 0, 0]}
                          maxBarSize={42}
                        />
                      </>
                    )}
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="rpt-rev-dash__peak">
                <span>
                  Highest {bucketLabel}: <strong>{peakLabel}</strong>
                </span>
                <span>
                  Lowest {bucketLabel}: <strong>{lowLabel}</strong>
                </span>
              </div>
            </article>
          </section>

          <section className="rpt-rev-dash__breakdown" aria-label="Revenue breakdown">
            <header className="rpt-rev-dash__breakdown-head">
              <h2>Revenue Breakdown</h2>
              <p>PT and subscription revenue by {bucketLabel}</p>
            </header>

            <div className="rpt-rev-dash__stream-cards">
              <article className="rpt-rev-dash__stream">
                <header>
                  <div className="rpt-rev-dash__stream-icon" style={{ color: PT_BAR }}>
                    <Dumbbell size={18} />
                  </div>
                  <div>
                    <h3>PT Revenue</h3>
                    <p>
                      {formatCurrency(primaryTotals.ptRevenue)} vs{' '}
                      {formatCurrency(compareTotals.ptRevenue)}
                    </p>
                  </div>
                  <ChangeBadge value={ptChange} />
                </header>
              </article>
              <article className="rpt-rev-dash__stream">
                <header>
                  <div className="rpt-rev-dash__stream-icon" style={{ color: SUB_BAR }}>
                    <Users size={18} />
                  </div>
                  <div>
                    <h3>Subscription Revenue</h3>
                    <p>
                      {formatCurrency(primaryTotals.subscriberRevenue)} vs{' '}
                      {formatCurrency(compareTotals.subscriberRevenue)}
                    </p>
                  </div>
                  <ChangeBadge value={subChange} />
                </header>
              </article>
              <article className="rpt-rev-dash__stream">
                <header>
                  <div className="rpt-rev-dash__stream-icon" style={{ color: PRIMARY_BAR }}>
                    <CircleDollarSign size={18} />
                  </div>
                  <div>
                    <h3>Total Revenue</h3>
                    <p>
                      {formatCurrency(primaryTotals.totalRevenue)} vs{' '}
                      {formatCurrency(compareTotals.totalRevenue)}
                    </p>
                  </div>
                  <ChangeBadge value={totalChange} />
                </header>
              </article>
            </div>

            <div className="rpt-rev-dash__breakdown-charts">
              <article className="rpt-card">
                <header>
                  <h2>PT Revenue</h2>
                  <p>
                    {mode === 'today'
                      ? 'Today vs Yesterday PT comparison'
                      : `${mode === 'monthly' ? 'Week-wise' : 'Month-wise'} PT comparison`}
                  </p>
                </header>
                <div className="rpt-card__chart">
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={points} barGap={4} barCategoryGap="25%">
                      <CartesianGrid
                        strokeDasharray="3 6"
                        vertical={false}
                        stroke="rgba(22,24,31,0.06)"
                      />
                      <XAxis
                        dataKey="shortLabel"
                        tick={{ fill: MUTED, fontSize: 11 }}
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
                        labelFormatter={(_, payload) =>
                          String(payload?.[0]?.payload?.label ?? _)
                        }
                        formatter={(value, name) => [
                          formatCurrency(Number(value)),
                          String(name),
                        ]}
                      />
                      {mode === 'today' ? (
                        <Bar
                          dataKey="primaryPt"
                          name="PT Revenue"
                          radius={[6, 6, 0, 0]}
                          maxBarSize={48}
                        >
                          {points.map((entry, index) => (
                            <Cell
                              key={`pt-cell-${index}`}
                              fill={entry.shortLabel === 'Today' ? PT_BAR : COMPARE_BAR}
                            />
                          ))}
                        </Bar>
                      ) : (
                        <>
                          <Bar
                            dataKey="comparePt"
                            name={compareLabel}
                            fill={COMPARE_BAR}
                            radius={[6, 6, 0, 0]}
                            maxBarSize={36}
                          />
                          <Bar
                            dataKey="primaryPt"
                            name={primaryLabel}
                            fill={PT_BAR}
                            radius={[6, 6, 0, 0]}
                            maxBarSize={36}
                          />
                        </>
                      )}
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </article>

              <article className="rpt-card">
                <header>
                  <h2>Subscription Revenue</h2>
                  <p>
                    {mode === 'today'
                      ? 'Today vs Yesterday subscription comparison'
                      : `${mode === 'monthly' ? 'Week-wise' : 'Month-wise'} subscription comparison`}
                  </p>
                </header>
                <div className="rpt-card__chart">
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={points} barGap={4} barCategoryGap="25%">
                      <CartesianGrid
                        strokeDasharray="3 6"
                        vertical={false}
                        stroke="rgba(22,24,31,0.06)"
                      />
                      <XAxis
                        dataKey="shortLabel"
                        tick={{ fill: MUTED, fontSize: 11 }}
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
                        labelFormatter={(_, payload) =>
                          String(payload?.[0]?.payload?.label ?? _)
                        }
                        formatter={(value, name) => [
                          formatCurrency(Number(value)),
                          String(name),
                        ]}
                      />
                      {mode === 'today' ? (
                        <Bar
                          dataKey="primarySub"
                          name="Subscription Revenue"
                          radius={[6, 6, 0, 0]}
                          maxBarSize={48}
                        >
                          {points.map((entry, index) => (
                            <Cell
                              key={`sub-cell-${index}`}
                              fill={entry.shortLabel === 'Today' ? SUB_BAR : COMPARE_BAR}
                            />
                          ))}
                        </Bar>
                      ) : (
                        <>
                          <Bar
                            dataKey="compareSub"
                            name={compareLabel}
                            fill={COMPARE_BAR}
                            radius={[6, 6, 0, 0]}
                            maxBarSize={36}
                          />
                          <Bar
                            dataKey="primarySub"
                            name={primaryLabel}
                            fill={SUB_BAR}
                            radius={[6, 6, 0, 0]}
                            maxBarSize={36}
                          />
                        </>
                      )}
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </article>
            </div>

            <div className="rpt-rev-dash__table-wrap">
              <table className="rpt-rev-dash__table">
                {mode === 'today' ? (
                  <>
                    <thead>
                      <tr>
                        <th>Period</th>
                        <th>Total Revenue</th>
                        <th>PT Revenue</th>
                        <th>Subscription Revenue</th>
                      </tr>
                    </thead>
                    <tbody>
                      {points.map((row) => (
                        <tr key={row.label}>
                          <td>{row.label}</td>
                          <td>{formatCurrency(row.primaryTotal)}</td>
                          <td>{formatCurrency(row.primaryPt)}</td>
                          <td>{formatCurrency(row.primarySub)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td>Difference</td>
                        <td className={difference >= 0 ? 'rpt-rev-dash__pos' : 'rpt-rev-dash__neg'}>
                          {difference >= 0 ? '+' : ''}
                          {formatCurrency(difference)}
                        </td>
                        <td>{formatCurrency(primaryTotals.ptRevenue - compareTotals.ptRevenue)}</td>
                        <td>{formatCurrency(primaryTotals.subscriberRevenue - compareTotals.subscriberRevenue)}</td>
                      </tr>
                    </tfoot>
                  </>
                ) : (
                  <>
                    <thead>
                      <tr>
                        <th>{mode === 'monthly' ? 'Week' : 'Month'}</th>
                        <th>{primaryLabel} Total</th>
                        <th>{compareLabel} Total</th>
                        <th>{primaryLabel} PT</th>
                        <th>{compareLabel} PT</th>
                        <th>{primaryLabel} Sub</th>
                        <th>{compareLabel} Sub</th>
                      </tr>
                    </thead>
                    <tbody>
                      {points.map((row) => (
                        <tr key={row.label}>
                          <td>{row.label}</td>
                          <td>{formatCurrency(row.primaryTotal)}</td>
                          <td>{formatCurrency(row.compareTotal)}</td>
                          <td>{formatCurrency(row.primaryPt)}</td>
                          <td>{formatCurrency(row.comparePt)}</td>
                          <td>{formatCurrency(row.primarySub)}</td>
                          <td>{formatCurrency(row.compareSub)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td>Total</td>
                        <td>{formatCurrency(primaryTotals.totalRevenue)}</td>
                        <td>{formatCurrency(compareTotals.totalRevenue)}</td>
                        <td>{formatCurrency(primaryTotals.ptRevenue)}</td>
                        <td>{formatCurrency(compareTotals.ptRevenue)}</td>
                        <td>{formatCurrency(primaryTotals.subscriberRevenue)}</td>
                        <td>{formatCurrency(compareTotals.subscriberRevenue)}</td>
                      </tr>
                    </tfoot>
                  </>
                )}
              </table>
            </div>
          </section>
        </>
      ) : (
        <Empty description="No revenue data for this period" />
      )}
    </div>
  );
};

export const ReportsHome = () => {
  const [tab, setTab] = useState<ReportTab>('branch');
  const [filter, setFilter] = useState<ReportDateFilter>('all');
  const [range, setRange] = useState<[Dayjs, Dayjs] | null>(null);
  const [branchId, setBranchId] = useState<string | undefined>();
  const [trainerId, setTrainerId] = useState<string | undefined>();
  const [trainerSearch, setTrainerSearch] = useState('');
  const defaultRevenueMonths = useMemo(() => getDefaultRevenueMonths(), []);
  const defaultRevenueYears = useMemo(() => getDefaultRevenueYears(), []);
  const [revenueMode, setRevenueMode] = useState<RevenueCompareMode>('monthly');
  const [revenuePrimaryMonth, setRevenuePrimaryMonth] = useState(
    defaultRevenueMonths.primary,
  );
  const [revenueCompareMonth, setRevenueCompareMonth] = useState(
    defaultRevenueMonths.compare,
  );
  const [revenuePrimaryYear, setRevenuePrimaryYear] = useState(
    defaultRevenueYears.primary,
  );
  const [revenueCompareYear, setRevenueCompareYear] = useState(
    defaultRevenueYears.compare,
  );
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
  const { data: allCustomers = [] } = useCustomersAll();

  const primarySlices = useMemo(() => {
    if (revenueMode === 'today') {
      const todayStr = dayjs().format('YYYY-MM-DD');
      return [
        {
          key: 'today',
          label: 'Today',
          shortLabel: 'Today',
          start: todayStr,
          end: todayStr,
        },
      ];
    }
    if (revenueMode === 'yearly') {
      return getYearMonthSlices(revenuePrimaryYear);
    }
    return getMonthWeekSlices(revenuePrimaryMonth);
  }, [revenueMode, revenuePrimaryMonth, revenuePrimaryYear]);

  const compareSlices = useMemo(() => {
    if (revenueMode === 'today') {
      const yesterdayStr = dayjs().subtract(1, 'day').format('YYYY-MM-DD');
      return [
        {
          key: 'yesterday',
          label: 'Yesterday',
          shortLabel: 'Yesterday',
          start: yesterdayStr,
          end: yesterdayStr,
        },
      ];
    }
    if (revenueMode === 'yearly') {
      return getYearMonthSlices(revenueCompareYear);
    }
    return getMonthWeekSlices(revenueCompareMonth);
  }, [revenueMode, revenueCompareMonth, revenueCompareYear]);

  const primaryLabel =
    revenueMode === 'today'
      ? `Today (${dayjs().format('DD MMM YYYY')})`
      : revenueMode === 'yearly'
        ? revenuePrimaryYear.format('YYYY')
        : revenuePrimaryMonth.format('MMMM YYYY');

  const compareLabel =
    revenueMode === 'today'
      ? `Yesterday (${dayjs().subtract(1, 'day').format('DD MMM YYYY')})`
      : revenueMode === 'monthly'
        ? revenueCompareMonth.format('MMMM YYYY')
        : revenueCompareYear.format('YYYY');

  const revenueSliceQueries = useMemo<ReportQuery[]>(() => {
    const toQuery = (slice: RevenueSlice): ReportQuery => ({
      filter: 'custom',
      startDate: slice.start,
      endDate: slice.end,
      branchId: undefined,
      trainerId: undefined,
    });
    return [...primarySlices.map(toQuery), ...compareSlices.map(toQuery)];
  }, [primarySlices, compareSlices]);

  const revenueReady =
    primarySlices.length > 0 && compareSlices.length > 0;
  const revenueTabActive = tab === 'revenue' && revenueReady;

  const { data, isLoading, isFetching } = useGymReport(query, enabled && tab !== 'revenue');
  const revenueSliceResults = useGymReportQueries(revenueSliceQueries, revenueTabActive);
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

  const revenueLoading = revenueSliceResults.some((r) => r.isLoading || r.isFetching);
  const revenueReports = useMemo(
    () => revenueSliceResults.map((r) => r.data),
    [revenueSliceResults],
  );

  const revenuePoints = useMemo<RevenueComparePoint[]>(() => {
    if (revenueMode === 'today') {
      const todayReport = revenueReports[0];
      const yesterdayReport = revenueReports[1];
      return [
        {
          label: compareLabel,
          shortLabel: 'Yesterday',
          primaryTotal: yesterdayReport?.totals.totalRevenue ?? 0,
          compareTotal: 0,
          primaryPt: yesterdayReport?.totals.ptRevenue ?? 0,
          comparePt: 0,
          primarySub: yesterdayReport?.totals.subscriberRevenue ?? 0,
          compareSub: 0,
        },
        {
          label: primaryLabel,
          shortLabel: 'Today',
          primaryTotal: todayReport?.totals.totalRevenue ?? 0,
          compareTotal: 0,
          primaryPt: todayReport?.totals.ptRevenue ?? 0,
          comparePt: 0,
          primarySub: todayReport?.totals.subscriberRevenue ?? 0,
          compareSub: 0,
        },
      ];
    }

    const len = Math.max(primarySlices.length, compareSlices.length);
    const points: RevenueComparePoint[] = [];

    for (let i = 0; i < len; i += 1) {
      const primary = primarySlices[i];
      const compare = compareSlices[i];
      const primaryReport = primary ? revenueReports[i] : undefined;
      const compareReport =
        compare ? revenueReports[primarySlices.length + i] : undefined;
      const label =
        primary?.label ??
        compare?.label ??
        (revenueMode === 'yearly' ? `Month ${i + 1}` : `Week ${i + 1}`);
      const shortLabel =
        primary?.shortLabel ??
        compare?.shortLabel ??
        (revenueMode === 'yearly' ? `M${i + 1}` : `W${i + 1}`);

      points.push({
        label,
        shortLabel,
        primaryTotal: primaryReport?.totals.totalRevenue ?? 0,
        compareTotal: compareReport?.totals.totalRevenue ?? 0,
        primaryPt: primaryReport?.totals.ptRevenue ?? 0,
        comparePt: compareReport?.totals.ptRevenue ?? 0,
        primarySub: primaryReport?.totals.subscriberRevenue ?? 0,
        compareSub: compareReport?.totals.subscriberRevenue ?? 0,
      });
    }

    return points;
  }, [primarySlices, compareSlices, revenueReports, revenueMode, primaryLabel, compareLabel]);

  const primaryRevenueTotals = useMemo(
    () => sumSliceTotals(revenueReports, primarySlices.length, 0),
    [revenueReports, primarySlices.length],
  );
  const compareRevenueTotals = useMemo(
    () =>
      sumSliceTotals(
        revenueReports,
        compareSlices.length,
        primarySlices.length,
      ),
    [revenueReports, compareSlices.length, primarySlices.length],
  );

  const pageLoading =
    tab === 'revenue' ? false : isLoading || !data;
  const showReports =
    tab === 'revenue' ? revenueReady : enabled;
  const isRefreshing =
    tab === 'revenue' ? revenueLoading : isFetching;

  const activeTab = TABS.find((t) => t.key === tab)!;

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
            ) : revenueMode === 'yearly' ? (
              <div className="rpt__revenue-months">
                <label className="rpt__revenue-month">
                  <span>Compare year</span>
                  <DatePicker
                    picker="year"
                    size="large"
                    allowClear={false}
                    value={revenuePrimaryYear}
                    onChange={(value) =>
                      value && setRevenuePrimaryYear(value.startOf('year'))
                    }
                    disabledDate={(date) => date.isAfter(dayjs(), 'year')}
                    format="YYYY"
                  />
                </label>
                <span className="rpt__revenue-vs">vs</span>
                <label className="rpt__revenue-month">
                  <span>With year</span>
                  <DatePicker
                    picker="year"
                    size="large"
                    allowClear={false}
                    value={revenueCompareYear}
                    onChange={(value) =>
                      value && setRevenueCompareYear(value.startOf('year'))
                    }
                    disabledDate={(date) => date.isAfter(dayjs(), 'year')}
                    format="YYYY"
                  />
                </label>
              </div>
            ) : null}
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
          {tab !== 'revenue' && (
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
              options={[
                { value: '', label: 'All Branches' },
                ...(branchesData?.data.map((b) => ({
                  value: b.id,
                  label: shortBranch(b.name),
                })) || []),
              ]}
            />
          )}
          {tab !== 'branch' && tab !== 'revenue' && (
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
              ? 'Select periods to compare revenue'
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
              staff={data?.staff}
              branchId={branchId}
              branchMeta={branchesData?.data ?? []}
              allTrainers={allTrainers}
              allCustomers={allCustomers}
            />
          ) : null}
          {tab === 'branch' ? (
            <BranchSummaryTab
              branches={branches}
              branchMeta={branchesData?.data ?? []}
              allTrainers={allTrainers}
              allCustomers={allCustomers}
            />
          ) : tab === 'attendance' ? (
            <AttendanceTab
              trainers={trainerRows}
              search={trainerSearch}
              onSearch={setTrainerSearch}
            />
          ) : (
            <RevenueTab
              mode={revenueMode}
              points={revenuePoints}
              primaryLabel={primaryLabel}
              compareLabel={compareLabel}
              primaryTotals={primaryRevenueTotals}
              compareTotals={compareRevenueTotals}
              loading={revenueLoading}
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
