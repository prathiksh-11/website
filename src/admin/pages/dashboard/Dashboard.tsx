import dayjs from 'dayjs';
import {
  ArrowUpRight,
  Building2,
  Check,
  ChevronDown,
  CreditCard,
  DollarSign,
  Dumbbell,
  Sparkles,
  TrendingUp,
  Users,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
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
import { formatCompactCurrency, formatCurrency } from '@/utils/format';

const BRAND_ORANGE = THEME_TOKENS.colorPrimary || '#ff5000';
const INK = '#16181f';
const MUTED = '#6f7685';
const BORDER = 'rgba(22, 24, 31, 0.08)';
const SURFACE_SOFT = '#f8fafc';

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
  borderRadius: 12,
  border: '1px solid rgba(22,24,31,0.1)',
  boxShadow: '0 16px 36px rgba(22,24,31,0.12)',
  background: '#16181f',
  color: '#fff',
  fontFamily: "'Outfit', system-ui, sans-serif",
  fontSize: 13,
  padding: '10px 14px',
};

const tickProps = {
  fill: MUTED,
  fontSize: 12,
  fontFamily: 'Outfit',
  fontWeight: 500,
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
  const label = selected ? shortBranch(selected.name) : allowAll ? 'All branches' : 'Select studio';
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
        <span className="bento-branch__icon" style={{ background: BRAND_ORANGE }}>
          <Building2 size={16} />
        </span>
        <span className="bento-branch__copy">
          <small>Viewing Studio</small>
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
                <strong>All branches</strong>
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
  const firstName = user?.name?.split(' ')[0] ?? 'Admin';

  const yesterday = summary.yesterdayRevenue;
  const today = summary.todayRevenue;
  const maxRevenue = Math.max(yesterday, today);
  const yDomainMax = maxRevenue > 0 ? Math.ceil(maxRevenue * 1.25) : 1000;

  const revenueDiff = today - yesterday;
  const revenuePercentChange =
    yesterday > 0
      ? Math.round((revenueDiff / yesterday) * 100)
      : today > 0
        ? 100
        : 0;

  const totalOverallRevenue = summary.totalRevenue ?? (summary.totalSubscriptionRevenue + summary.totalPtRevenue);

  const topCards = [
    {
      label: 'Total Revenue',
      value: formatCurrency(totalOverallRevenue),
      badge: 'OVERALL',
      hint: 'PT + Subscription revenue',
      icon: <DollarSign size={18} />,
    },
    {
      label: 'Total Employees',
      value: summary.totalEmployees.toLocaleString(),
      badge: 'STAFF',
      hint: 'Assigned trainers & staff',
      icon: <Users size={18} />,
    },
    {
      label: 'Total Branches',
      value: summary.totalBranches.toLocaleString(),
      badge: 'LOCATIONS',
      hint: 'Active studio locations',
      icon: <Building2 size={18} />,
    },
    {
      label: 'Subscription Revenue',
      value: formatCurrency(summary.totalSubscriptionRevenue),
      badge: 'MEMBERSHIPS',
      hint: 'All-time plan sales',
      icon: <CreditCard size={18} />,
    },
    {
      label: 'PT Revenue',
      value: formatCurrency(summary.totalPtRevenue),
      badge: 'PACKAGES',
      hint: 'All-time session sales',
      icon: <Dumbbell size={18} />,
    },
  ];

  const yesterdayVsTodayData = [
    { name: 'Yesterday', revenue: summary.yesterdayRevenue },
    { name: 'Today', revenue: summary.todayRevenue },
  ];

  const todayTotal = summary.todaySubscriptionRevenue + summary.todayPtRevenue;
  const ptShare = todayTotal > 0 ? Math.round((summary.todayPtRevenue / todayTotal) * 100) : 0;
  const subShare = todayTotal > 0 ? 100 - ptShare : 0;

  const todayPieData = todayTotal > 0
    ? [
      { name: 'Subscription Revenue', value: summary.todaySubscriptionRevenue, color: '#3b82f6' },
      { name: 'PT Revenue', value: summary.todayPtRevenue, color: BRAND_ORANGE },
    ]
    : [
      { name: 'Subscription Revenue', value: 1, color: '#e2e8f0' },
      { name: 'PT Revenue', value: 1, color: '#cbd5e1' },
    ];

  return (
    <div className="bento" style={{ gap: '1.5rem' }}>
      {/* Header */}
      <header className="bento-top" style={{ alignItems: 'center' }}>
        <div className="bento-greet">
          <p className="bento-kicker">{dayjs().format('dddd, D MMM YYYY')}</p>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.02em', margin: 0, color: INK }}>
            Hey {firstName}
          </h1>
        </div>

        <div className="bento-top__actions">
          <BranchSwitcher
            value={branchId}
            onChange={onBranchChange}
            branches={branches}
            allowAll={true}
          />
          {isFetching && !isLoading ? (
            <span className="bento-branch__sync">Updating</span>
          ) : null}
        </div>
      </header>

      {/* Top Clean Minimal Cards */}
      <section
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
          gap: '1rem',
        }}
      >
        {topCards.map((card) => (
          <div
            key={card.label}
            style={{
              background: '#ffffff',
              border: `1px solid ${BORDER}`,
              borderRadius: '18px',
              padding: '1.25rem 1.35rem',
              boxShadow: '0 4px 16px rgba(22, 24, 31, 0.03)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 12,
                  background: '#fff4ee',
                  color: BRAND_ORANGE,
                  display: 'grid',
                  placeItems: 'center',
                }}
              >
                {card.icon}
              </div>
              <span
                style={{
                  fontSize: '0.65rem',
                  fontWeight: 600,
                  letterSpacing: '0.06em',
                  color: BRAND_ORANGE,
                  background: '#fff4ee',
                  padding: '0.2rem 0.55rem',
                  borderRadius: '999px',
                }}
              >
                {card.badge}
              </span>
            </div>

            <div>
              <span style={{ fontSize: '0.78rem', fontWeight: 500, color: MUTED, display: 'block', marginBottom: '0.15rem' }}>
                {card.label}
              </span>
              <strong style={{ fontSize: '1.75rem', fontWeight: 700, color: INK, letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                {card.value}
              </strong>
            </div>

            <p style={{ margin: '0.75rem 0 0', fontSize: '0.72rem', color: MUTED, fontWeight: 400 }}>
              {card.hint}
            </p>
          </div>
        ))}
      </section>

      {/* Main Bento Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(12, minmax(0, 1fr))',
          gap: '1.25rem',
        }}
      >
        {/* Card 1: Yesterday vs Today Revenue Comparison */}
        <article
          style={{
            gridColumn: 'span 7',
            background: '#ffffff',
            borderRadius: '20px',
            padding: '1.5rem',
            border: `1px solid ${BORDER}`,
            boxShadow: '0 6px 20px rgba(22, 24, 31, 0.03)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.15rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.15rem' }}>
                <TrendingUp size={18} color={BRAND_ORANGE} />
                <h2 style={{ fontSize: '1.1rem', fontWeight: 600, margin: 0, color: INK }}>
                  Yesterday vs Today Revenue
                </h2>
              </div>
              <p style={{ margin: 0, fontSize: '0.8rem', color: MUTED }}>
                Comparison of daily revenue generated across assigned branch
              </p>
            </div>

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                padding: '0.3rem 0.65rem',
                borderRadius: '999px',
                fontSize: '0.75rem',
                fontWeight: 600,
                background: '#f1f3f7',
                color: INK,
              }}
            >
              <ArrowUpRight size={14} style={{ transform: revenueDiff < 0 ? 'rotate(90deg)' : 'none' }} />
              {revenueDiff >= 0 ? `+${revenuePercentChange}% vs Yesterday` : `${revenuePercentChange}% vs Yesterday`}
            </div>
          </div>

          {/* Metric Highlights */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '0.85rem',
              marginBottom: '1.25rem',
            }}
          >
            <div
              style={{
                padding: '0.85rem 1rem',
                borderRadius: '14px',
                background: SURFACE_SOFT,
                border: `1px solid ${BORDER}`,
              }}
            >
              <span style={{ fontSize: '0.72rem', fontWeight: 600, color: MUTED, display: 'block', marginBottom: '0.2rem', textTransform: 'uppercase' }}>
                YESTERDAY&apos;S REVENUE
              </span>
              <strong style={{ fontSize: '1.45rem', fontWeight: 700, color: INK }}>
                {formatCurrency(summary.yesterdayRevenue)}
              </strong>
            </div>

            <div
              style={{
                padding: '0.85rem 1rem',
                borderRadius: '14px',
                background: SURFACE_SOFT,
                border: `1px solid ${BORDER}`,
              }}
            >
              <span style={{ fontSize: '0.72rem', fontWeight: 600, color: BRAND_ORANGE, display: 'block', marginBottom: '0.2rem', textTransform: 'uppercase' }}>
                TODAY&apos;S REVENUE
              </span>
              <strong style={{ fontSize: '1.45rem', fontWeight: 700, color: BRAND_ORANGE }}>
                {formatCurrency(summary.todayRevenue)}
              </strong>
            </div>
          </div>

          {/* Recharts Bar Graph */}
          <div style={{ width: '100%', height: 220, marginTop: 'auto' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={yesterdayVsTodayData} margin={{ top: 15, right: 15, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 6" vertical={false} stroke="rgba(22,24,31,0.06)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={tickProps} />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={tickProps}
                  domain={[0, yDomainMax]}
                  width={60}
                  tickFormatter={(v) => formatCompactCurrency(Number(v))}
                />
                <Tooltip
                  contentStyle={tooltipStyle}
                  cursor={{ fill: 'rgba(22,24,31,0.03)', radius: 10 }}
                  formatter={(value) => [formatCurrency(Number(value)), 'Revenue']}
                />
                <Bar dataKey="revenue" radius={[10, 10, 4, 4]} maxBarSize={56}>
                  {yesterdayVsTodayData.map((entry, index) => (
                    <Cell key={`bar-${index}`} fill={index === 0 ? '#94a3b8' : BRAND_ORANGE} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>

        {/* Card 2: Today's Revenue Mix */}
        <article
          style={{
            gridColumn: 'span 5',
            background: '#ffffff',
            borderRadius: '20px',
            padding: '1.5rem',
            border: `1px solid ${BORDER}`,
            boxShadow: '0 6px 20px rgba(22, 24, 31, 0.03)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.15rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.15rem' }}>
                <Sparkles size={18} color={BRAND_ORANGE} />
                <h2 style={{ fontSize: '1.1rem', fontWeight: 600, margin: 0, color: INK }}>
                  Today&apos;s Revenue Mix
                </h2>
              </div>
              <p style={{ margin: 0, fontSize: '0.8rem', color: MUTED }}>
                PT vs Subscription revenue generated today
              </p>
            </div>
            <span
              style={{
                fontSize: '0.68rem',
                fontWeight: 600,
                color: MUTED,
                background: '#f1f3f7',
                padding: '0.2rem 0.55rem',
                borderRadius: '999px',
              }}
            >
              TODAY ONLY
            </span>
          </div>

          {/* Donut Chart */}
          <div style={{ position: 'relative', width: '100%', height: 165, margin: '0.25rem 0 0.75rem' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(value) => [todayTotal > 0 ? formatCurrency(Number(value)) : '₹0', 'Revenue']}
                />
                <Pie
                  data={todayPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={58}
                  outerRadius={78}
                  paddingAngle={todayTotal > 0 ? 4 : 0}
                  dataKey="value"
                >
                  {todayPieData.map((entry, index) => (
                    <Cell key={`pie-cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            {/* Donut Ring Center Callout */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'none',
              }}
            >
              <strong style={{ fontSize: '1.35rem', fontWeight: 700, color: INK, lineHeight: 1 }}>
                {formatCurrency(todayTotal)}
              </strong>
              <span style={{ fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.05em', color: MUTED, marginTop: '0.25rem', textTransform: 'uppercase' }}>
                TODAY TOTAL
              </span>
            </div>
          </div>

          {/* Breakdown Items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginTop: 'auto' }}>
            {/* Subscription Revenue Item */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem 0.85rem',
                borderRadius: '14px',
                background: SURFACE_SOFT,
                border: `1px solid ${BORDER}`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#3b82f6' }} />
                <div>
                  <strong style={{ display: 'block', fontSize: '0.84rem', color: INK, fontWeight: 600 }}>
                    Subscription Revenue
                  </strong>
                  <span style={{ fontSize: '0.7rem', color: MUTED }}>
                    Memberships & Plans
                  </span>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <strong style={{ display: 'block', fontSize: '0.9rem', color: INK, fontWeight: 700 }}>
                  {formatCurrency(summary.todaySubscriptionRevenue)}
                </strong>
                <span style={{ fontSize: '0.68rem', fontWeight: 600, color: MUTED }}>
                  {subShare}
                </span>
              </div>
            </div>

            {/* PT Revenue Item */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem 0.85rem',
                borderRadius: '14px',
                background: SURFACE_SOFT,
                border: `1px solid ${BORDER}`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: BRAND_ORANGE }} />
                <div>
                  <strong style={{ display: 'block', fontSize: '0.84rem', color: INK, fontWeight: 600 }}>
                    PT Revenue
                  </strong>
                  <span style={{ fontSize: '0.7rem', color: MUTED }}>
                    Personal Training Packages
                  </span>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <strong style={{ display: 'block', fontSize: '0.9rem', color: BRAND_ORANGE, fontWeight: 700 }}>
                  {formatCurrency(summary.todayPtRevenue)}
                </strong>
                <span style={{ fontSize: '0.68rem', fontWeight: 600, color: MUTED }}>
                  {ptShare}
                </span>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};
