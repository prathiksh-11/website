import { dashboardApi } from '@/api/dashboard.api';

export const dashboardService = {
  fetchDashboard: () => dashboardApi.getDashboard(),
};
