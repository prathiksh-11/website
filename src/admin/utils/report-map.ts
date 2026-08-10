import type {
  GymReport,
  ReportBranch,
  ReportBranchHighlights,
  ReportBranchSummary,
  ReportTrainer,
  ReportTrainerAttendance,
} from '@/types';

const asNumber = (value: unknown, fallback = 0) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
};

const asString = (value: unknown, fallback = '') =>
  value == null ? fallback : String(value);

const resolveImageUrl = (image: unknown) => {
  if (!image) return undefined;
  const path = asString(image);
  if (!path) return undefined;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  const apiBase = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? '';
  const origin = apiBase.replace(/\/api\/?$/, '');
  return `${origin}/${path.replace(/^\//, '')}`;
};

const mapSummary = (raw: Record<string, unknown> = {}): ReportBranchSummary => {
  const totalRevenue = asNumber(raw.total_revenue);
  return {
    totalCustomers: asNumber(raw.total_customers),
    subscriberClients: asNumber(raw.subscriber_clients),
    subscriberRevenue: asNumber(raw.subscriber_revenue),
    ptClients: asNumber(raw.pt_clients),
    ptRevenue: asNumber(raw.pt_revenue),
    eventClients: asNumber(raw.event_clients),
    eventRevenue: asNumber(raw.event_revenue),
    totalRevenue,
    paidAmount: asNumber(raw.paid_amount, totalRevenue),
    pendingAmount: asNumber(raw.pending_amount),
    pendingCount: asNumber(raw.pending_count),
    failedAmount: asNumber(raw.failed_amount),
    failedCount: asNumber(raw.failed_count),
    partialPaidAmount: asNumber(raw.partial_paid_amount),
    partialPaidCount: asNumber(raw.partial_paid_count),
    partialPackageAmount: asNumber(raw.partial_package_amount),
    amountDue: asNumber(raw.amount_due),
    partialOpenCount: asNumber(raw.partial_open_count),
    packageAmount: asNumber(raw.package_amount),
    amountPaidPurchases: asNumber(raw.amount_paid_purchases),
  };
};

const mapHighlights = (
  raw: Record<string, unknown> = {},
): ReportBranchHighlights => ({
  activeTrainers: asNumber(raw.active_trainers),
  sessionsPurchased: asNumber(raw.total_sessions_purchased),
  sessionsCompleted: asNumber(raw.total_sessions_completed),
  sessionsRemaining: asNumber(raw.total_sessions_remaining),
  sessionUtilization: asNumber(raw.session_utilization_percentage),
});

const mapAttendance = (
  raw: Record<string, unknown> = {},
): ReportTrainerAttendance => ({
  presentDays: asNumber(raw.present_days),
  totalDays: asNumber(raw.total_days),
  attendanceDisplay: asString(raw.attendance_display, '0'),
  attendancePercentage: asNumber(raw.attendance_percentage),
});

const mapTrainer = (
  raw: Record<string, unknown>,
  branchId: string,
  branchName: string,
): ReportTrainer => ({
  id: asString(raw.trainer_id),
  name: asString(raw.trainer_name, 'Trainer'),
  mobile: raw.trainer_mobile ? asString(raw.trainer_mobile) : undefined,
  image: resolveImageUrl(raw.trainer_image),
  ptClients: asNumber(raw.total_pt_clients),
  sessionsPurchased: asNumber(raw.sessions_purchased),
  sessionsCompleted: asNumber(raw.sessions_completed),
  sessionsDisplay: asString(raw.sessions_display, '0/0'),
  completionPercentage: asNumber(raw.session_completion_percentage),
  totalRevenue: asNumber(raw.total_revenue),
  utilizedRevenue: asNumber(raw.utilized_revenue),
  revenueUtilization: asNumber(raw.revenue_utilization_percentage),
  attendance: mapAttendance(
    (raw.attendance as Record<string, unknown> | undefined) ?? {},
  ),
  workingHours: asString(raw.total_working_hours, '00:00'),
  branchId,
  branchName,
});

export const emptySummary = (): ReportBranchSummary => ({
  totalCustomers: 0,
  subscriberClients: 0,
  subscriberRevenue: 0,
  ptClients: 0,
  ptRevenue: 0,
  eventClients: 0,
  eventRevenue: 0,
  totalRevenue: 0,
  paidAmount: 0,
  pendingAmount: 0,
  pendingCount: 0,
  failedAmount: 0,
  failedCount: 0,
  partialPaidAmount: 0,
  partialPaidCount: 0,
  partialPackageAmount: 0,
  amountDue: 0,
  partialOpenCount: 0,
  packageAmount: 0,
  amountPaidPurchases: 0,
});

const emptyHighlights = (): ReportBranchHighlights => ({
  activeTrainers: 0,
  sessionsPurchased: 0,
  sessionsCompleted: 0,
  sessionsRemaining: 0,
  sessionUtilization: 0,
});

export const mapBackendGymReport = (
  raw: Record<string, unknown>,
): GymReport => {
  const branchRows = Array.isArray(raw.branches) ? raw.branches : [];

  const branches: ReportBranch[] = branchRows.map((row) => {
    const b = row as Record<string, unknown>;
    const id = asString(b.branch_id);
    const name = asString(b.branch_name, 'Branch');
    const trainersRaw = Array.isArray(b.trainers) ? b.trainers : [];

    return {
      id,
      name,
      summary: mapSummary((b.summary as Record<string, unknown>) ?? {}),
      highlights: mapHighlights((b.highlights as Record<string, unknown>) ?? {}),
      trainers: trainersRaw.map((t) =>
        mapTrainer(t as Record<string, unknown>, id, name),
      ),
    };
  });

  const totals = branches.reduce(
    (acc, branch) => {
      acc.totalCustomers += branch.summary.totalCustomers;
      acc.subscriberClients += branch.summary.subscriberClients;
      acc.subscriberRevenue += branch.summary.subscriberRevenue;
      acc.ptClients += branch.summary.ptClients;
      acc.ptRevenue += branch.summary.ptRevenue;
      acc.eventClients += branch.summary.eventClients;
      acc.eventRevenue += branch.summary.eventRevenue;
      acc.totalRevenue += branch.summary.totalRevenue;
      acc.paidAmount += branch.summary.paidAmount;
      acc.pendingAmount += branch.summary.pendingAmount;
      acc.pendingCount += branch.summary.pendingCount;
      acc.failedAmount += branch.summary.failedAmount;
      acc.failedCount += branch.summary.failedCount;
      acc.partialPaidAmount += branch.summary.partialPaidAmount;
      acc.partialPaidCount += branch.summary.partialPaidCount;
      acc.partialPackageAmount += branch.summary.partialPackageAmount;
      acc.amountDue += branch.summary.amountDue;
      acc.partialOpenCount += branch.summary.partialOpenCount;
      acc.packageAmount += branch.summary.packageAmount;
      acc.amountPaidPurchases += branch.summary.amountPaidPurchases;
      acc.activeTrainers += branch.highlights.activeTrainers;
      acc.sessionsPurchased += branch.highlights.sessionsPurchased;
      acc.sessionsCompleted += branch.highlights.sessionsCompleted;
      acc.sessionsRemaining += branch.highlights.sessionsRemaining;
      acc.trainerCount += branch.trainers.length;
      return acc;
    },
    {
      ...emptySummary(),
      ...emptyHighlights(),
      branchCount: branches.length,
      trainerCount: 0,
    },
  );

  totals.sessionUtilization =
    totals.sessionsPurchased > 0
      ? Number(
          (
            (totals.sessionsCompleted / totals.sessionsPurchased) *
            100
          ).toFixed(2),
        )
      : 0;

  return {
    branchIds: branches.map((b) => b.id),
    branches,
    totals,
  };
};

export const emptyGymReport = (): GymReport => ({
  branchIds: [],
  branches: [],
  totals: {
    ...emptySummary(),
    ...emptyHighlights(),
    branchCount: 0,
    trainerCount: 0,
  },
});
