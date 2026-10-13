import { dashboardApi, type DashboardDateParams } from '@/api/dashboard.api';

export const dashboardService = {
  fetchDashboard: (branchId?: string, dateParams?: DashboardDateParams) =>
    dashboardApi.getDashboard(branchId, dateParams),
};
