import {
  FileExcelOutlined,
  FilePdfOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { Button, DatePicker, Empty, Progress, Select } from 'antd';
import dayjs, { type Dayjs } from 'dayjs';
import {
  Activity,
  Building2,
  CircleDollarSign,
  Clock3,
  Dumbbell,
  TrendingUp,
  UserCheck,
  Users,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
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
import { useGymReport, useReportExport } from '@/hooks/useReports';
import { useTrainers } from '@/hooks/useTrainers';
import type {
  GymReport,
  ReportBranch,
  ReportDateFilter,
  ReportQuery,
  ReportTrainer,
} from '@/types';
import { formatCurrency } from '@/utils/format';

const { RangePicker } = DatePicker;

const ACCENT = THEME_TOKENS.colorPrimary;
const MUTED = '#9aa0ab';
const PIE_COLORS = ['#ff8a4c', '#ffb088', '#c4b5a5', '#e8ecf2'];

type ReportTab = 'branch' | 'attendance' | 'revenue';

const TABS: Array<{ key: ReportTab; label: string; hint: string }> = [
  { key: 'branch', label: 'Branch summary', hint: 'Sessions & location health' },
  { key: 'attendance', label: 'Trainer attendance', hint: 'Presence & working hours' },
  { key: 'revenue', label: 'Revenue', hint: 'Money by stream & trainer' },
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
    .replace(/^Game On Fitness\s*/i, '')
    .replace(/^(Premium Club|Luxury Club)\s*-?\s*/i, '')
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

const OverviewCards = ({ totals }: { totals: GymReport['totals'] }) => (
  <section className="rpt__overview" aria-label="Report overview">
    <article className="rpt-stat rpt-stat--hero">
      <div className="rpt-stat__icon">
        <CircleDollarSign size={18} />
      </div>
      <div>
        <span>Total revenue</span>
        <strong>{formatCurrency(totals.totalRevenue)}</strong>
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
);

const BranchSummaryTab = ({
  branches,
  totals,
}: {
  branches: ReportBranch[];
  totals: GymReport['totals'];
}) => {
  const sessionBars = branches.map((b) => ({
    name: shortBranch(b.name),
    purchased: b.highlights.sessionsPurchased,
    completed: b.highlights.sessionsCompleted,
    remaining: b.highlights.sessionsRemaining,
  }));

  const utilBars = branches
    .map((b) => ({
      name: shortBranch(b.name),
      value: b.highlights.sessionUtilization,
      fill: ACCENT,
    }))
    .sort((a, b) => b.value - a.value);

  return (
    <div className="rpt-tab">
      <section className="rpt__kpis rpt__kpis--4">
        <article className="rpt-kpi">
          <span>
            <Building2 size={16} /> Branches
          </span>
          <strong>{totals.branchCount}</strong>
        </article>
        <article className="rpt-kpi">
          <span>
            <Dumbbell size={16} /> Active trainers
          </span>
          <strong>{totals.activeTrainers}</strong>
        </article>
        <article className="rpt-kpi">
          <span>
            <Activity size={16} /> Sessions
          </span>
          <strong>
            {totals.sessionsCompleted}
            <em>/{totals.sessionsPurchased}</em>
          </strong>
          <small>{totals.sessionsRemaining} remaining</small>
        </article>
        <article className="rpt-kpi">
          <span>
            <TrendingUp size={16} /> Utilization
          </span>
          <strong>{totals.sessionUtilization}%</strong>
        </article>
      </section>

      <section className="rpt__charts rpt__charts--2">
        <article className="rpt-card">
          <header>
            <h2>Sessions by branch</h2>
            <p>Purchased vs completed</p>
          </header>
          {sessionBars.length ? (
            <div className="rpt-card__chart">
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={sessionBars}>
                  <CartesianGrid
                    strokeDasharray="3 6"
                    vertical={false}
                    stroke="rgba(28,25,23,0.08)"
                  />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: MUTED, fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: MUTED, fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="purchased" fill="#c4b5a5" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="completed" fill={ACCENT} radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          )}
        </article>

        <article className="rpt-card">
          <header>
            <h2>Utilization rank</h2>
            <p>Completion % by location</p>
          </header>
          {utilBars.length ? (
            <div className="rpt-card__chart">
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={utilBars} layout="vertical" margin={{ left: 4 }}>
                  <XAxis type="number" domain={[0, 100]} hide />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={90}
                    tick={{ fill: MUTED, fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    formatter={(v) => [`${v}%`, 'Utilization']}
                  />
                  <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                    {utilBars.map((entry, i) => (
                      <Cell
                        key={entry.name}
                        fill={i === 0 ? ACCENT : i < 3 ? '#ff8a4c' : '#d6cfc6'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          )}
        </article>
      </section>

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
            return (
              <article key={b.id} className="rpt-branch">
                <header className="rpt-branch__head">
                  <div>
                    <h3>{shortBranch(b.name)}</h3>
                    <p className="rpt-branch__full">{b.name}</p>
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
                  <span>Total revenue</span>
                  <strong>{formatCurrency(b.summary.totalRevenue)}</strong>
                </div>

                <ul className="rpt-branch__streams">
                  <li>
                    <span>PT</span>
                    <strong>{formatCurrency(b.summary.ptRevenue)}</strong>
                  </li>
                  <li>
                    <span>Subs</span>
                    <strong>{formatCurrency(b.summary.subscriberRevenue)}</strong>
                  </li>
                  <li>
                    <span>Events</span>
                    <strong>{formatCurrency(b.summary.eventRevenue)}</strong>
                  </li>
                </ul>

                <div className="rpt-branch__people">
                  <div>
                    <UserCheck size={14} />
                    <div>
                      <strong>{b.summary.totalCustomers}</strong>
                      <span>Customers</span>
                    </div>
                  </div>
                  <div>
                    <Dumbbell size={14} />
                    <div>
                      <strong>{b.highlights.activeTrainers}</strong>
                      <span>Trainers</span>
                    </div>
                  </div>
                </div>

                <footer className="rpt-branch__foot">
                  <div>
                    <span>Sessions</span>
                    <strong>
                      {b.highlights.sessionsCompleted}/
                      {b.highlights.sessionsPurchased}
                    </strong>
                  </div>
                  <div>
                    <span>Remaining</span>
                    <strong>{b.highlights.sessionsRemaining}</strong>
                  </div>
                  <Progress
                    percent={util}
                    showInfo={false}
                    strokeColor="#ff8a4c"
                    trailColor="#f1f3f7"
                    size={5}
                  />
                </footer>
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

  const avgAttendance = trainers.length
    ? Number(
        (
          trainers.reduce((s, t) => s + t.attendance.attendancePercentage, 0) /
          trainers.length
        ).toFixed(1),
      )
    : 0;

  const presentTrainers = trainers.filter(
    (t) => t.attendance.attendancePercentage >= 75,
  ).length;

  const attendanceChart = [...trainers]
    .sort(
      (a, b) =>
        b.attendance.attendancePercentage - a.attendance.attendancePercentage,
    )
    .slice(0, 10)
    .map((t) => ({
      name: t.name.split(' ')[0] || t.name,
      value: t.attendance.attendancePercentage,
      present: t.attendance.presentDays,
      total: t.attendance.totalDays,
    }));

  const radial = [
    {
      name: 'Attendance',
      value: avgAttendance,
      fill: '#ff8a4c',
    },
  ];

  const pageItems = trainers.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="rpt-tab">
      <section className="rpt__overview rpt__overview--4" aria-label="Attendance overview">
        <article className="rpt-stat">
          <div className="rpt-stat__icon">
            <Users size={18} />
          </div>
          <div>
            <span>Trainers</span>
            <strong>{trainers.length}</strong>
          </div>
        </article>
        <article className="rpt-stat rpt-stat--hero">
          <div className="rpt-stat__icon">
            <UserCheck size={18} />
          </div>
          <div>
            <span>Avg attendance</span>
            <strong>{avgAttendance}%</strong>
          </div>
        </article>
        <article className="rpt-stat">
          <div className="rpt-stat__icon">
            <TrendingUp size={18} />
          </div>
          <div>
            <span>Strong (≥75%)</span>
            <strong>{presentTrainers}</strong>
          </div>
        </article>
        <article className="rpt-stat">
          <div className="rpt-stat__icon">
            <Clock3 size={18} />
          </div>
          <div>
            <span>Needs attention</span>
            <strong>{Math.max(trainers.length - presentTrainers, 0)}</strong>
          </div>
        </article>
      </section>

      <section className="rpt__charts rpt__charts--2">
        <article className="rpt-card">
          <header>
            <h2>Average attendance</h2>
            <p>Across trainers in this filter</p>
          </header>
          <div className="rpt-radial">
            <ResponsiveContainer width="100%" height={220}>
              <RadialBarChart
                innerRadius="68%"
                outerRadius="100%"
                data={radial}
                startAngle={90}
                endAngle={-270}
              >
                <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                <RadialBar dataKey="value" cornerRadius={12} background />
                <Tooltip contentStyle={tooltipStyle} formatter={(v) => `${v}%`} />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="rpt-radial__label">
              <strong>{avgAttendance}%</strong>
              <span>average</span>
            </div>
          </div>
        </article>

        <article className="rpt-card">
          <header>
            <h2>Attendance leaders</h2>
            <p>Top 10 presence rates</p>
          </header>
          {attendanceChart.length ? (
            <div className="rpt-card__chart">
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={attendanceChart}>
                  <defs>
                    <linearGradient id="rptAtt" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ff8a4c" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="#ff8a4c" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 6"
                    vertical={false}
                    stroke="rgba(255,80,0,0.08)"
                  />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: MUTED, fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fill: MUTED, fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    formatter={(v, _n, item) => [
                      `${v}%`,
                      `${item.payload.present}/${item.payload.total} days`,
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#ff8a4c"
                    fill="url(#rptAtt)"
                    strokeWidth={2.5}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          )}
        </article>
      </section>

      <section className="rpt__panel">
        <div className="rpt__panel-head">
          <div>
            <h2>Trainer attendance</h2>
            <p>Presence, hours, sessions, and completion at a glance</p>
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

                    <div className="rpt-att-card__hero">
                      <span>Present days</span>
                      <strong>{t.attendance.attendanceDisplay}</strong>
                    </div>

                    <ul className="rpt-att-card__stats">
                      <li>
                        <span>Hours</span>
                        <strong>{t.workingHours || '00:00'}</strong>
                      </li>
                      <li>
                        <span>Sessions</span>
                        <strong>{t.sessionsDisplay}</strong>
                      </li>
                      <li>
                        <span>Done</span>
                        <strong>{t.completionPercentage}%</strong>
                      </li>
                    </ul>

                    <div className="rpt-att-card__meta">
                      <div>
                        <span>PT clients</span>
                        <strong>{t.ptClients}</strong>
                      </div>
                      <div>
                        <span>PT revenue</span>
                        <strong>{formatCurrency(t.totalRevenue)}</strong>
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
  branches,
  totals,
  trainers,
}: {
  branches: ReportBranch[];
  totals: GymReport['totals'];
  trainers: ReportTrainer[];
}) => {
  const revenueMix = [
    { name: 'Subscriptions', value: totals.subscriberRevenue },
    { name: 'PT', value: totals.ptRevenue },
    { name: 'Events', value: totals.eventRevenue },
  ];

  const branchRevenue = branches.map((b) => ({
    id: b.id,
    name: shortBranch(b.name),
    fullName: b.name,
    subscriptions: b.summary.subscriberRevenue,
    pt: b.summary.ptRevenue,
    events: b.summary.eventRevenue,
    total: b.summary.totalRevenue,
    customers: b.summary.totalCustomers,
    trainers: b.highlights.activeTrainers,
  }));

  const maxTotal = Math.max(...branchRevenue.map((b) => b.total), 1);

  const topTrainers = [...trainers]
    .sort((a, b) => b.totalRevenue - a.totalRevenue)
    .slice(0, 8)
    .map((t) => ({
      name: t.name.split(' ')[0] || t.name,
      revenue: t.totalRevenue,
      utilized: t.utilizedRevenue,
      completion: t.completionPercentage,
    }));

  return (
    <div className="rpt-tab">
      <section className="rpt__overview rpt__overview--4" aria-label="Revenue overview">
        <article className="rpt-stat rpt-stat--hero">
          <div className="rpt-stat__icon">
            <CircleDollarSign size={18} />
          </div>
          <div>
            <span>Total revenue</span>
            <strong>{formatCurrency(totals.totalRevenue)}</strong>
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
            <TrendingUp size={18} />
          </div>
          <div>
            <span>Events</span>
            <strong>{formatCurrency(totals.eventRevenue)}</strong>
            <small>{totals.eventClients} clients</small>
          </div>
        </article>
      </section>

      <section className="rpt__charts">
        <article className="rpt-card rpt-card--wide">
          <header>
            <h2>Revenue by branch</h2>
            <p>Subscriptions, PT, and events stacked</p>
          </header>
          {branchRevenue.length ? (
            <div className="rpt-card__chart">
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={branchRevenue}>
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
                  <Bar dataKey="subscriptions" stackId="r" fill="#ffb088" />
                  <Bar dataKey="pt" stackId="r" fill="#ff8a4c" />
                  <Bar
                    dataKey="events"
                    stackId="r"
                    fill="#c4b5a5"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          )}
        </article>

        <article className="rpt-card">
          <header>
            <h2>Revenue mix</h2>
            <p>Share of each stream</p>
          </header>
          <div className="rpt-card__chart rpt-card__chart--pie">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={revenueMix}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={58}
                  outerRadius={84}
                  paddingAngle={3}
                >
                  {revenueMix.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(value) => formatCurrency(Number(value))}
                />
              </PieChart>
            </ResponsiveContainer>
            <ul className="rpt-legend">
              {revenueMix.map((item, i) => (
                <li key={item.name}>
                  <i style={{ background: PIE_COLORS[i] }} />
                  <span>{item.name}</span>
                  <strong>{formatCurrency(item.value)}</strong>
                </li>
              ))}
            </ul>
          </div>
        </article>

        <article className="rpt-card">
          <header>
            <h2>Top trainers</h2>
            <p>Highest PT revenue</p>
          </header>
          {topTrainers.length ? (
            <div className="rpt-card__chart">
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={topTrainers} layout="vertical">
                  <XAxis type="number" hide />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={72}
                    tick={{ fill: MUTED, fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    formatter={(value) => formatCurrency(Number(value))}
                  />
                  <Bar dataKey="revenue" fill="#ff8a4c" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          )}
        </article>
      </section>

      <section className="rpt__panel">
        <div className="rpt__panel-head">
          <div>
            <h2>Branch revenue</h2>
            <p>Full money breakdown by location</p>
          </div>
        </div>

        {branchRevenue.length ? (
          <div className="rpt__rev-list">
            <div className="rpt__rev-head" aria-hidden>
              <span>Branch</span>
              <span>Subs</span>
              <span>PT</span>
              <span>Events</span>
              <span>Total</span>
            </div>
            {branchRevenue.map((row) => {
              const share = Math.round((row.total / maxTotal) * 100);
              return (
                <article key={row.id} className="rpt-rev-row">
                  <div className="rpt-rev-row__branch">
                    <div className="rpt-rev-row__icon">
                      <Building2 size={16} />
                    </div>
                    <div>
                      <strong>{row.name}</strong>
                      <small>
                        {row.customers} customers · {row.trainers} trainers
                      </small>
                    </div>
                  </div>
                  <div className="rpt-rev-row__cell">
                    <span>Subs</span>
                    <strong>{formatCurrency(row.subscriptions)}</strong>
                  </div>
                  <div className="rpt-rev-row__cell">
                    <span>PT</span>
                    <strong>{formatCurrency(row.pt)}</strong>
                  </div>
                  <div className="rpt-rev-row__cell">
                    <span>Events</span>
                    <strong>{formatCurrency(row.events)}</strong>
                  </div>
                  <div className="rpt-rev-row__total">
                    <span>Total</span>
                    <strong>{formatCurrency(row.total)}</strong>
                    <i style={{ width: `${share}%` }} />
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <Empty description="No revenue data" />
        )}
      </section>
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

  const { data, isLoading, isFetching } = useGymReport(query, enabled);
  const { excel, pdf } = useReportExport(query);

  const totals = data?.totals;
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

  const activeTab = TABS.find((t) => t.key === tab)!;

  return (
    <div className="rpt">
      <header className="rpt__hero">
        <div>
          <p className="rpt__kicker">Analytics</p>
          <h1>Reports</h1>
          <p className="rpt__sub">{activeTab.hint}</p>
        </div>
        <div className="rpt__hero-actions">
          {isFetching ? <span className="rpt__live">Updating…</span> : null}
          <Button
            icon={<FileExcelOutlined />}
            loading={excel.isPending}
            disabled={!enabled}
            onClick={() => excel.mutate()}
          >
            Excel
          </Button>
          <Button
            type="primary"
            icon={<FilePdfOutlined />}
            loading={pdf.isPending}
            disabled={!enabled}
            onClick={() => pdf.mutate()}
          >
            PDF
          </Button>
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

        <div className="rpt__controls">
          {filter === 'custom' && (
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

      {!enabled ? (
        <Empty description="Pick a custom date range to load reports" />
      ) : isLoading || !totals ? (
        <PageSkeleton variant="report" />
      ) : (
        <>
          <OverviewCards totals={totals} />
          {tab === 'branch' ? (
            <BranchSummaryTab branches={branches} totals={totals} />
          ) : tab === 'attendance' ? (
            <AttendanceTab
              trainers={trainerRows}
              search={trainerSearch}
              onSearch={setTrainerSearch}
            />
          ) : (
            <RevenueTab
              branches={branches}
              totals={totals}
              trainers={trainerRows}
            />
          )}
        </>
      )}
    </div>
  );
};
