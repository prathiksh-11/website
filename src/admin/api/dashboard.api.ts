import { USE_MOCK } from '@/constants';
import { delay, MOCK_DASHBOARD } from '@/mocks/data';
import type {
  BookedPtSession,
  DashboardData,
  DashboardSummary,
  GymEvent,
} from '@/types';
import { apiClient } from './axios';
import { ENDPOINTS } from './endpoints';
import { transactionApi } from './transaction.api';

interface BackendDashboardPayload {
  total_clients?: number;
  total_trainers?: number;
  total_branches?: number;
  total_subscribers?: number;
  total_pt_customers?: number;
  total_revenue_pt?: number;
  total_revenue_subscriptions?: number;
  total_revenue_events?: number;
  total_pending_amount?: number;
  latest_session?: Record<string, unknown> | null;
  latest_event?: Record<string, unknown> | null;
  user?: {
    id?: number | string;
    name?: string;
    last_name?: string;
    phone?: string;
  };
}

interface BackendDashboardResponse {
  success?: boolean;
  data?: BackendDashboardPayload;
}

const emptyDashboard = (summary: DashboardSummary): DashboardData => ({
  summary,
  monthlyRevenue: [],
  subscriptionGrowth: [],
  customerGrowth: [],
  branchPerformance: [],
  recentCustomers: [],
  todaySessions: [],
  upcomingEvents: [],
});

const mapLatestSession = (
  raw: Record<string, unknown> | null | undefined,
): BookedPtSession[] => {
  if (!raw || raw.id == null) return [];
  return [
    {
      id: String(raw.id),
      customerId: String(raw.customer_id ?? ''),
      customerName: String(raw.customer_name ?? raw.session_name ?? 'PT Session'),
      trainerId: String(raw.trainer_id ?? ''),
      trainerName: String(raw.trainer_name ?? 'Trainer'),
      branchId: String(raw.branch_id ?? ''),
      branchName: String(raw.branch_name ?? 'Branch'),
      scheduledAt: String(
        raw.slot_start ?? raw.created_at ?? raw.updated_at ?? new Date().toISOString(),
      ),
      durationMinutes: Number(raw.duration_minutes ?? 60),
      status: 'scheduled',
    },
  ];
};

const mapLatestEvent = (
  raw: Record<string, unknown> | null | undefined,
): GymEvent[] => {
  if (!raw || raw.id == null) return [];
  const branchId = String(
    Array.isArray(raw.branch_id) ? raw.branch_id[0] ?? '' : raw.branch_id ?? '',
  );
  const branchName = String(raw.branch_name ?? 'Branch');
  return [
    {
      id: String(raw.id),
      title: String(raw.event_name ?? raw.title ?? raw.name ?? 'Upcoming event'),
      description: String(raw.description ?? ''),
      branchId,
      branchIds: branchId ? [branchId] : [],
      branchName,
      branchNames: [branchName],
      startAt: String(raw.start_date ?? raw.start_at ?? new Date().toISOString()),
      endAt: String(raw.end_date ?? raw.end_at ?? new Date().toISOString()),
      capacity: Number(raw.slot_limit ?? raw.capacity ?? 0),
      registeredCount: Number(
        raw.used_slots ?? raw.registered_count ?? raw.booked ?? 0,
      ),
      status: 'active',
      type: String(raw.event_type ?? raw.type ?? 'Event'),
      image: raw.image ? String(raw.image) : undefined,
      price: raw.price != null ? Number(raw.price) : undefined,
      location: raw.location ? String(raw.location) : undefined,
    },
  ];
};

export const mapBackendDashboard = (
  payload: BackendDashboardPayload | undefined | null,
): DashboardData => {
  const totalClients = Number(payload?.total_clients ?? 0);
  const totalTrainers = Number(payload?.total_trainers ?? 0);
  const totalBranches = Number(payload?.total_branches ?? 0);
  const subscribers = Number(
    payload?.total_subscribers ?? payload?.total_clients ?? 0,
  );
  const ptCustomers = Number(payload?.total_pt_customers ?? 0);
  const ptRevenue = Number(payload?.total_revenue_pt ?? 0);
  const subRevenue = Number(payload?.total_revenue_subscriptions ?? 0);
  const eventRevenue = Number(payload?.total_revenue_events ?? 0);
  const totalRevenue = ptRevenue + subRevenue + eventRevenue;

  const summary: DashboardSummary = {
    totalCustomers: totalClients,
    totalTrainers,
    totalBranches,
    activeSubscriptions: subscribers,
    ptSessions: ptCustomers,
    todaySessions: payload?.latest_session ? 1 : 0,
    events: payload?.latest_event ? 1 : 0,
    revenue: totalRevenue,
    subscribers,
    ptPurchaseAmount: ptRevenue,
    nonPtClients: Math.max(totalClients - ptCustomers, 0),
    ptCustomerRevenue: ptRevenue,
    totalPendingAmount: Number(payload?.total_pending_amount ?? 0),
  };

  const base = emptyDashboard(summary);
  return {
    ...base,
    todaySessions: mapLatestSession(payload?.latest_session ?? null),
    upcomingEvents: mapLatestEvent(payload?.latest_event ?? null),
  };
};

export const dashboardApi = {
  getDashboard: async (branchId?: string): Promise<DashboardData> => {
    if (USE_MOCK) {
      await delay();
      return structuredClone(MOCK_DASHBOARD);
    }

    const [dashRes, txRes] = await Promise.allSettled([
      apiClient.get<BackendDashboardResponse>(ENDPOINTS.DASHBOARD.ROOT, {
        params: branchId ? { branch_id: Number(branchId) } : undefined,
      }),
      transactionApi.list({ pageSize: 50, branchId }),
    ]);

    const payload =
      dashRes.status === 'fulfilled'
        ? dashRes.value.data?.data ??
          (dashRes.value.data as unknown as BackendDashboardPayload)
        : null;

    let computedPending = Number(payload?.total_pending_amount ?? 0);

    if (txRes.status === 'fulfilled' && txRes.value?.items) {
      const txPendingSum = txRes.value.items.reduce((sum, tx) => {
        if (tx.amountPending && tx.amountPending > 0) {
          return sum + Number(tx.amountPending);
        }
        return sum;
      }, 0);

      if (txPendingSum > 0 || computedPending === 0) {
        computedPending = Math.max(computedPending, txPendingSum);
      }
    }

    const mapped = mapBackendDashboard(payload);
    mapped.summary.totalPendingAmount = computedPending;
    return mapped;
  },
};
