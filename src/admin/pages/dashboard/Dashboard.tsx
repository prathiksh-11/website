import dayjs from 'dayjs';
import {
  ArrowUpRight,
  Building2,
  CalendarDays,
  Check,
  ChevronDown,
  Dumbbell,
  Users,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { PageSkeleton } from '@/components/common';
import { THEME_TOKENS } from '@/constants';
import { useBranches } from '@/hooks/useBranches';
import { useDashboard } from '@/hooks/useDashboard';
import { useAuthStore } from '@/store/auth.store';
import { getDefaultBranchFilter } from '@/store/settings.store';
import { formatCurrency, formatDate, formatDateTime } from '@/utils/format';

import sessionImg1 from '../../../assets/AKSHAYANAGAR/akshayanagar_img1.jpeg';
import sessionImg2 from '../../../assets/AREKERE/arekere_img1.jpeg';
import sessionImg3 from '../../../assets/btm1/btm1_img1.jpeg';
import eventImg1 from '../../../assets/SARJAPUR_ROAD/sarjapur-img1.jpg';
import eventImg2 from '../../../assets/VIJAYA_BANK_LAYOUT/vijaya_bank_layout_img5.jpeg';
import eventImg3 from '../../../assets/wilsongardon/wilson_garden_img1.jpeg';
import eventImg4 from '../../../assets/KASAVANAHALLI/kasavanahalli_img1.jpg';

const ACCENT = THEME_TOKENS.colorPrimary;
const ACCENT_SOFT = '#ff8a4c';
const ACCENT_PALE = '#ffd2bc';
const MUTED = '#9aa0ab';

const SESSION_IMAGES = [sessionImg1, sessionImg2, sessionImg3];
const EVENT_IMAGES = [eventImg1, eventImg2, eventImg3, eventImg4];
const DASHBOARD_BRANCH_KEY = 'dashboard-branch-id';

const shortBranch = (name?: string) => {
  if (!name) return 'Studio';
  return (
    name
      .replace(/^Game On Fitness\s*[-–—]?\s*/i, '')
      .replace(/^(Premium Club|Luxury Club)\s*[-–—]?\s*/i, '')
      .replace(/^[-–—]\s*/, '')
      .trim() || name
  );
};

const tooltipStyle = {
  borderRadius: 14,
  border: 'none',
  boxShadow: '0 18px 40px rgba(22,24,31,0.18)',
  background: '#16181f',
  color: '#fff',
  fontFamily: "'Outfit', system-ui, sans-serif",
  fontSize: 12,
  padding: '10px 14px',
};

const tickProps = {
  fill: MUTED,
  fontSize: 11,
  fontFamily: 'Outfit',
  fontWeight: 500,
};

const ChartDot = (props: {
  cx?: number;
  cy?: number;
  index?: number;
  payload?: { label?: string };
}) => {
  const { cx, cy } = props;
  if (cx == null || cy == null) return null;
  return (
    <g>
      <circle cx={cx} cy={cy} r={5} fill="#fff" />
      <circle cx={cx} cy={cy} r={3.25} fill={ACCENT} />
    </g>
  );
};

const BranchSwitcher = ({
  value,
  onChange,
  branches,
  allowAll,
}: {
  value?: string;
  onChange: (next?: string) => void;
  branches: Array<{ id: string; name: string }>;
  allowAll: boolean;
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDoc = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const selected = branches.find((b) => b.id === value);
  const label = selected ? shortBranch(selected.name) : allowAll ? 'All studios' : 'Select studio';
  const filtered = branches.filter((b) =>
    shortBranch(b.name).toLowerCase().includes(search.trim().toLowerCase()),
  );

  return (
    <div className="bento-branch" ref={rootRef}>
      <button
        type="button"
        className={open ? 'bento-branch__trigger bento-branch__trigger--open' : 'bento-branch__trigger'}
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <span className="bento-branch__icon">
          <Building2 size={16} />
        </span>
        <span className="bento-branch__copy">
          <small>Viewing</small>
          <strong>{label}</strong>
        </span>
        <ChevronDown size={16} className="bento-branch__chevron" />
      </button>

      {open ? (
        <div className="bento-branch__menu" role="listbox">
          <input
            className="bento-branch__search"
            placeholder="Search studio"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
          />
          {allowAll ? (
            <button
              type="button"
              className={!value ? 'bento-branch__option bento-branch__option--on' : 'bento-branch__option'}
              onClick={() => {
                onChange(undefined);
                setOpen(false);
                setSearch('');
              }}
            >
              <span>
                <strong>All studios</strong>
                <small>Combined dashboard</small>
              </span>
              {!value ? <Check size={15} /> : null}
            </button>
          ) : null}
          <div className="bento-branch__list">
            {filtered.map((branch) => {
              const active = value === branch.id;
              return (
                <button
                  key={branch.id}
                  type="button"
                  className={
                    active
                      ? 'bento-branch__option bento-branch__option--on'
                      : 'bento-branch__option'
                  }
                  onClick={() => {
                    onChange(branch.id);
                    setOpen(false);
                    setSearch('');
                  }}
                >
                  <span>
                    <strong>{shortBranch(branch.name)}</strong>
                    <small>{branch.name}</small>
                  </span>
                  {active ? <Check size={15} /> : null}
                </button>
              );
            })}
            {!filtered.length ? (
              <p className="bento-branch__empty">No studio matches</p>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export const Dashboard = () => {
  const user = useAuthStore((s) => s.user);
  const [branchId, setBranchId] = useState<string | undefined>(() => {
    try {
      return (
        sessionStorage.getItem(DASHBOARD_BRANCH_KEY) ||
        getDefaultBranchFilter()
      );
    } catch {
      return getDefaultBranchFilter();
    }
  });

  const { data: branchesData } = useBranches({ page: 1, pageSize: 200 });
  const branches = branchesData?.data ?? [];
  const { data, isLoading, isError, isFetching } = useDashboard(branchId);

  const selectedBranch = useMemo(
    () => branches.find((b) => b.id === branchId),
    [branches, branchId],
  );

  const onBranchChange = (next?: string) => {
    setBranchId(next);
    try {
      if (next) sessionStorage.setItem(DASHBOARD_BRANCH_KEY, next);
      else sessionStorage.removeItem(DASHBOARD_BRANCH_KEY);
    } catch {
      /* ignore */
    }
  };

  useEffect(() => {
    if (!branchId || !branches.length) return;
    if (!branches.some((b) => b.id === branchId)) {
      onBranchChange(undefined);
    }
  }, [branchId, branches]);

  if (isLoading) return <PageSkeleton variant="dashboard" />;
  if (isError || !data?.summary) {
    return (
      <div className="bento">
        <h1>Dashboard</h1>
        <p>Unable to load dashboard data right now.</p>
      </div>
    );
  }

  const summary = data.summary;
  const monthlyRevenue = data.monthlyRevenue ?? [];
  const subscriptionGrowth = data.subscriptionGrowth ?? [];
  const branchPerformance = data.branchPerformance ?? [];
  const recentCustomers = data.recentCustomers ?? [];
  const todaySessions = data.todaySessions ?? [];
  const upcomingEvents = data.upcomingEvents ?? [];

  const firstName = user?.name?.split(' ')[0] ?? 'Champion';
  const ptClients = Math.max(summary.totalCustomers - summary.nonPtClients, 0);
  const ptShare = Math.round(
    (ptClients / Math.max(summary.totalCustomers, 1)) * 100,
  );
  const sessionRate = Math.min(
    100,
    Math.round((summary.todaySessions / Math.max(summary.ptSessions, 1)) * 100),
  );

  const radialData = [{ name: 'live', value: sessionRate, fill: ACCENT }];

  const eventBars = upcomingEvents.map((event) => ({
    label: event.title.split(' ')[0],
    value: event.registeredCount,
  }));

  const spark =
    monthlyRevenue.length > 0
      ? monthlyRevenue.map((p) => ({ label: p.label, v: p.value }))
      : [
        { label: 'Now', v: summary.revenue },
        { label: 'PT', v: summary.ptPurchaseAmount },
        { label: 'Subs', v: Math.max(summary.revenue - summary.ptPurchaseAmount, 0) },
      ];

  const subSpark =
    subscriptionGrowth.length > 0
      ? subscriptionGrowth.map((p) => ({ label: p.label, v: p.value }))
      : [
        { label: 'A', v: Math.max(summary.subscribers - 2, 0) },
        { label: 'B', v: Math.max(summary.subscribers - 1, 0) },
        { label: 'C', v: summary.subscribers },
      ];

  const arcOuter = Math.PI * 78;
  const arcMid = Math.PI * 62;
  const arcInner = Math.PI * 46;

  const quickStats = [
    {
      label: 'Trainers',
      value: summary.totalTrainers,
      icon: <Users size={15} />,
      to: '/trainers',
    },
    {
      label: 'Branches',
      value: summary.totalBranches,
      icon: <Building2 size={15} />,
      to: '/branches',
    },
    {
      label: 'Today PT',
      value: summary.todaySessions,
      icon: <Dumbbell size={15} />,
      to: '/sessions',
    },
    {
      label: 'Events',
      value: summary.events,
      icon: <CalendarDays size={15} />,
      to: '/events',
    },
  ];

  return (
    <div className="bento">
      <header className="bento-top">
        <div className="bento-greet">
          <p className="bento-kicker">{dayjs().format('dddd, D MMMM YYYY')}</p>
          <h1>
            Hey {firstName},{' '}
            <em>
              here&apos;s{' '}
              {selectedBranch
                ? shortBranch(selectedBranch.name)
                : 'your studio'}{' '}
              today
            </em>
          </h1>
        </div>

        <div className="bento-top__actions">
          <BranchSwitcher
            value={branchId}
            onChange={onBranchChange}
            branches={branches}
            allowAll={user?.role === 'Super Admin' || branches.length > 1}
          />
          {isFetching && !isLoading ? (
            <span className="bento-branch__sync">Updating</span>
          ) : null}
        </div>
      </header>

      <section className="bento-quick" aria-label="Quick stats">
        {quickStats.map((item) => (
          <Link key={item.label} to={item.to} className="bento-quick__item">
            <span className="bento-quick__icon">{item.icon}</span>
            <div>
              <strong>{item.value}</strong>
              <small>{item.label}</small>
            </div>
            <ArrowUpRight size={14} className="bento-quick__go" />
          </Link>
        ))}
      </section>

      <div className="bento-grid">
        <article className="bento-card bento-card--metric bento-card--revenue">
          <div className="bento-card__row">
            <span className="bento-label">Total revenue</span>
            <span className="bento-chip">Monthly</span>
          </div>
          <strong className="bento-value">{formatCurrency(summary.revenue)}</strong>
          <div className="bento-chart bento-chart--spark">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={spark} margin={{ top: 10, right: 6, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="gRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={ACCENT} stopOpacity={0.5} />
                    <stop offset="40%" stopColor={ACCENT} stopOpacity={0.18} />
                    <stop offset="100%" stopColor={ACCENT} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(value) => [formatCurrency(Number(value)), 'Revenue']}
                  labelFormatter={(_, payload) =>
                    String(payload?.[0]?.payload?.label ?? '')
                  }
                />
                <Area
                  type="monotone"
                  dataKey="v"
                  stroke={ACCENT}
                  strokeWidth={3}
                  fill="url(#gRevenue)"
                  dot={<ChartDot />}
                  activeDot={{ r: 6, fill: ACCENT, stroke: '#fff', strokeWidth: 3 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <p className="bento-hint">
            <span className="up">+8.2%</span> vs last month
          </p>
        </article>

        <article className="bento-card bento-card--metric bento-card--sessions-live">
          <div className="bento-card__row">
            <span className="bento-label">Active sessions</span>
            <span className="bento-live">Live</span>
          </div>

          <div className="bento-live-body">
            <div className="bento-ring">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart
                  cx="50%"
                  cy="50%"
                  innerRadius="72%"
                  outerRadius="100%"
                  barSize={14}
                  data={radialData}
                  startAngle={90}
                  endAngle={-270}
                >
                  <PolarAngleAxis
                    type="number"
                    domain={[0, 100]}
                    tick={false}
                  />
                  <RadialBar
                    dataKey="value"
                    cornerRadius={20}
                    background={{ fill: 'rgba(255,80,0,0.1)' }}
                  />
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="bento-ring__center">
                <strong>{summary.todaySessions}</strong>
                <small>today</small>
              </div>
            </div>

            <div className="bento-live-meta">
              <div>
                <em>{sessionRate}%</em>
                <span>of PT booked</span>
              </div>
              <div>
                <em>{summary.ptSessions}</em>
                <span>total sessions</span>
              </div>
            </div>
          </div>
        </article>

        <article className="bento-card bento-card--metric bento-card--subscribers">
          <div className="bento-card__row">
            <span className="bento-label">Subscribers</span>
            <span className="bento-chip">Active</span>
          </div>
          <strong className="bento-value">{summary.subscribers}</strong>
          <div className="bento-chart bento-chart--spark">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={subSpark}
                margin={{ top: 10, right: 6, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="gSub" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={ACCENT} stopOpacity={0.28} />
                    <stop offset="100%" stopColor={ACCENT} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(value) => [Number(value), 'Subscribers']}
                  labelFormatter={(_, payload) =>
                    String(payload?.[0]?.payload?.label ?? '')
                  }
                />
                <Area
                  type="monotone"
                  dataKey="v"
                  fill="url(#gSub)"
                  stroke="none"
                />
                <Line
                  type="monotone"
                  dataKey="v"
                  stroke={ACCENT}
                  strokeWidth={3}
                  dot={<ChartDot />}
                  activeDot={{ r: 6, fill: ACCENT, stroke: '#fff', strokeWidth: 3 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <p className="bento-hint">
            <span className="up">+4</span> new this week
          </p>
        </article>

        <article className="bento-card bento-card--metric bento-card--ptbuy">
          <div className="bento-card__row">
            <span className="bento-label">PT purchase amount</span>
            <span className="bento-chip">Monthly</span>
          </div>
          <strong className="bento-value">
            {formatCurrency(summary.ptPurchaseAmount)}
          </strong>
          <div className="bento-chart bento-chart--spark">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={spark} margin={{ top: 10, right: 6, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="gPtBuy" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={ACCENT_SOFT} stopOpacity={0.5} />
                    <stop offset="100%" stopColor={ACCENT_SOFT} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(value) => [formatCurrency(Number(value)), 'Amount']}
                  labelFormatter={(_, payload) =>
                    String(payload?.[0]?.payload?.label ?? '')
                  }
                />
                <Area
                  type="monotone"
                  dataKey="v"
                  stroke={ACCENT_SOFT}
                  strokeWidth={3}
                  fill="url(#gPtBuy)"
                  dot={<ChartDot />}
                  activeDot={{
                    r: 6,
                    fill: ACCENT_SOFT,
                    stroke: '#fff',
                    strokeWidth: 3,
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <p className="bento-hint">Package sales this month</p>
        </article>

        <article className="bento-card bento-card--split">
          <div>
            <span className="bento-label">Non-PT clients</span>
            <strong className="bento-value">{summary.nonPtClients}</strong>
            <p className="bento-hint">Membership only</p>
          </div>
          <i className="bento-divider" />
          <div>
            <span className="bento-label">Total clients</span>
            <strong className="bento-value">{summary.totalCustomers}</strong>
            <p className="bento-hint">Across all branches</p>
          </div>
        </article>

        <article className="bento-card bento-card--mix">
          <div className="bento-mix__copy">
            <span className="bento-label">PT customer revenue</span>
            <strong className="bento-value">
              {formatCurrency(summary.ptCustomerRevenue)}
            </strong>
            <p className="bento-hint">
              <span className="up">+12%</span> · {ptShare}% of clients on PT
            </p>
            <ul className="bento-legend">
              <li>
                <i style={{ background: ACCENT }} /> PT · {ptClients}
              </li>
              <li>
                <i style={{ background: ACCENT_PALE }} /> Non-PT ·{' '}
                {summary.nonPtClients}
              </li>
            </ul>
          </div>
          <div className="bento-arcs" aria-hidden>
            <svg viewBox="0 0 200 120" className="bento-arcs__svg">
              <defs>
                <linearGradient id="arcGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor={ACCENT_SOFT} />
                  <stop offset="100%" stopColor={ACCENT} />
                </linearGradient>
              </defs>
              <path
                d="M22 108 A78 78 0 0 1 178 108"
                fill="none"
                stroke="#ffe8da"
                strokeWidth="13"
                strokeLinecap="round"
              />
              <path
                d="M38 108 A62 62 0 0 1 162 108"
                fill="none"
                stroke="#ffc4a8"
                strokeWidth="13"
                strokeLinecap="round"
                strokeDasharray={`${(ptShare / 100) * arcMid} ${arcMid}`}
              />
              <path
                d="M54 108 A46 46 0 0 1 146 108"
                fill="none"
                stroke="url(#arcGrad)"
                strokeWidth="13"
                strokeLinecap="round"
                strokeDasharray={`${(Math.min(ptShare + 10, 100) / 100) * arcInner} ${arcInner}`}
              />
              <path
                d="M22 108 A78 78 0 0 1 178 108"
                fill="none"
                stroke={ACCENT}
                strokeWidth="13"
                strokeLinecap="round"
                strokeDasharray={`${(ptShare / 100) * arcOuter * 0.55} ${arcOuter}`}
                opacity="0.4"
              />
            </svg>
            <div className="bento-arcs__center">
              <em>{ptShare}%</em>
              <span>PT mix</span>
            </div>
          </div>
        </article>

        <article className="bento-card bento-card--trend">
          <div className="bento-card__row">
            <div>
              <span className="bento-label">Revenue trend</span>
              <strong className="bento-value bento-value--inline">
                {formatCurrency(summary.revenue)}
              </strong>
            </div>
            <span className="bento-pill">+8.2%</span>
          </div>
          <div className="bento-chart bento-chart--trend">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={
                  monthlyRevenue.length > 0
                    ? monthlyRevenue
                    : spark.map((p) => ({ label: p.label, value: p.v }))
                }
                margin={{ top: 16, right: 10, left: -6, bottom: 4 }}
              >
                <defs>
                  <linearGradient id="gTrend" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={ACCENT} stopOpacity={0.42} />
                    <stop offset="55%" stopColor={ACCENT} stopOpacity={0.12} />
                    <stop offset="100%" stopColor={ACCENT} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 10"
                  vertical={false}
                  stroke="rgba(22,24,31,0.07)"
                />
                <XAxis
                  dataKey="label"
                  axisLine={false}
                  tickLine={false}
                  tick={tickProps}
                  dy={8}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={tickProps}
                  width={40}
                  tickFormatter={(v) => `₹${(Number(v) / 100000).toFixed(0)}L`}
                />
                <Tooltip
                  contentStyle={tooltipStyle}
                  cursor={{
                    stroke: ACCENT,
                    strokeWidth: 1.5,
                    strokeDasharray: '5 5',
                  }}
                  formatter={(value) => [
                    formatCurrency(Number(value)),
                    'Revenue',
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="none"
                  fill="url(#gTrend)"
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={ACCENT}
                  strokeWidth={3.5}
                  dot={<ChartDot />}
                  activeDot={{
                    r: 7,
                    fill: ACCENT,
                    stroke: '#fff',
                    strokeWidth: 3,
                  }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="bento-card bento-card--activity">
          <div className="bento-card__row">
            <div>
              <h2>Branch activity</h2>
              <p>Revenue by studio</p>
            </div>
            <div className="bento-filters">
              <span className="bento-chip bento-chip--active">Revenue</span>
              <span className="bento-chip">Members</span>
            </div>
          </div>
          <div className="bento-chart bento-chart--bars">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={branchPerformance}
                margin={{ top: 18, right: 8, left: -4, bottom: 4 }}
                barCategoryGap="32%"
              >
                <defs>
                  <linearGradient id="gBar0" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ff6a20" />
                    <stop offset="100%" stopColor={ACCENT} />
                  </linearGradient>
                  <linearGradient id="gBar1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ffb088" />
                    <stop offset="100%" stopColor={ACCENT_SOFT} />
                  </linearGradient>
                  <linearGradient id="gBar2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ffe0cc" />
                    <stop offset="100%" stopColor={ACCENT_PALE} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 10"
                  vertical={false}
                  stroke="rgba(22,24,31,0.07)"
                />
                <XAxis
                  dataKey="branchName"
                  axisLine={false}
                  tickLine={false}
                  tick={tickProps}
                  tickFormatter={(v) => String(v).split(' ')[0]}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={tickProps}
                  width={42}
                  tickFormatter={(v) => `₹${(Number(v) / 100000).toFixed(0)}L`}
                />
                <Tooltip
                  contentStyle={tooltipStyle}
                  cursor={{ fill: 'rgba(255,80,0,0.06)', radius: 14 }}
                  formatter={(value) => [
                    formatCurrency(Number(value)),
                    'Revenue',
                  ]}
                />
                <Bar dataKey="revenue" radius={[14, 14, 8, 8]} maxBarSize={42}>
                  {branchPerformance.map((branch, i) => (
                    <Cell
                      key={branch.branchName}
                      fill={`url(#gBar${Math.min(i, 2)})`}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="bento-card bento-card--events">
          <div className="bento-card__row">
            <div>
              <h2>
                <CalendarDays size={17} /> Events
              </h2>
              <p>{summary.events} upcoming</p>
            </div>
          </div>
          <div className="bento-chart bento-chart--mini-bars">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={eventBars}
                margin={{ top: 6, right: 0, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="gEventBar" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={ACCENT} />
                    <stop offset="100%" stopColor={ACCENT_SOFT} />
                  </linearGradient>
                </defs>
                <Bar
                  dataKey="value"
                  fill="url(#gEventBar)"
                  radius={[10, 10, 4, 4]}
                  maxBarSize={16}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="bento-shots">
            {upcomingEvents.slice(0, 3).map((event, index) => (
              <div
                key={event.id}
                className="bento-shot"
                style={{
                  backgroundImage: `url(${EVENT_IMAGES[index % EVENT_IMAGES.length]})`,
                }}
              >
                <div className="bento-shot__veil" />
                <div className="bento-shot__body">
                  <strong>{event.title}</strong>
                  <span>
                    {formatDate(event.startAt, 'DD MMM')} ·{' '}
                    {event.registeredCount}/{event.capacity}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="bento-card bento-card--people">
          <div className="bento-card__row">
            <div>
              <h2>Recent customers</h2>
              <p>Newest joins</p>
            </div>
          </div>
          <ul className="bento-people">
            {recentCustomers.map((customer) => (
              <li key={customer.id}>
                <span>
                  {customer.name
                    .split(' ')
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join('')}
                </span>
                <div>
                  <strong>{customer.name}</strong>
                  <small>{customer.branchName}</small>
                </div>
                <em>{formatDate(customer.joinDate, 'DD MMM')}</em>
              </li>
            ))}
          </ul>
        </article>

        <article className="bento-card bento-card--sessions">
          <div className="bento-card__row">
            <div>
              <h2>
                <Dumbbell size={17} /> Active sessions
              </h2>
              <p>{summary.todaySessions} live today</p>
            </div>
            <Link to="/sessions" className="bento-chip bento-chip--active">
              Open all <ChevronDown size={14} style={{ transform: 'rotate(-90deg)' }} />
            </Link>
          </div>
          <div className="bento-shots bento-shots--stack">
            {todaySessions.length === 0 ? (
              <div className="bento-empty">No sessions scheduled today</div>
            ) : (
              todaySessions.map((session, index) => (
                <div
                  key={session.id}
                  className="bento-shot bento-shot--wide"
                  style={{
                    backgroundImage: `url(${SESSION_IMAGES[index % SESSION_IMAGES.length]})`,
                  }}
                >
                  <div className="bento-shot__veil" />
                  <div className="bento-shot__body">
                    <em>PT</em>
                    <strong>{session.customerName}</strong>
                    <span>
                      {session.trainerName} ·{' '}
                      {formatDateTime(session.scheduledAt)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </article>
      </div>
    </div>
  );
};
