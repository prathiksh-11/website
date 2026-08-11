import { dashboardApi } from '@/api/dashboard.api';

export const dashboardService = {
  fetchDashboard: (branchId?: string) => dashboardApi.getDashboard(branchId),
};
