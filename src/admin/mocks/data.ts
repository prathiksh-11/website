import type {
  BookedPtSession,
  Branch,
  Customer,
  DashboardData,
  GymEvent,
  PtSession,
  Subscription,
  Trainer,
  User,
} from '@/types';

export const MOCK_USERS: Array<User & { password: string }> = [];

export const MOCK_BRANCHES: Branch[] = [];

export const MOCK_CUSTOMERS: Customer[] = [];

export const MOCK_TRAINERS: Trainer[] = [];

export const MOCK_SUBSCRIPTIONS: Subscription[] = [];

export const MOCK_SESSIONS: PtSession[] = [];

export const MOCK_BOOKED_SESSIONS: BookedPtSession[] = [];

export const MOCK_EVENTS: GymEvent[] = [];

export const MOCK_DASHBOARD: DashboardData = {
  summary: {
    totalCustomers: 0,
    totalTrainers: 0,
    totalBranches: 0,
    activeSubscriptions: 0,
    ptSessions: 0,
    todaySessions: 0,
    events: 0,
    revenue: 0,
    subscribers: 0,
    ptPurchaseAmount: 0,
    nonPtClients: 0,
    ptCustomerRevenue: 0,
  },
  monthlyRevenue: [],
  subscriptionGrowth: [],
  customerGrowth: [],
  branchPerformance: [],
  recentCustomers: [],
  todaySessions: [],
  upcomingEvents: [],
};

export const delay = (ms = 450): Promise<void> =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
