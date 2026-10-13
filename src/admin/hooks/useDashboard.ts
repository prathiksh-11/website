import { useQuery } from '@tanstack/react-query';
import type { DashboardDateParams } from '@/api/dashboard.api';
import { dashboardService } from '@/services/dashboard.service';

export const useDashboard = (
  branchId?: string,
  dateParams?: DashboardDateParams,
) =>
  useQuery({
    queryKey: [
      'dashboard',
      branchId || 'all',
      dateParams?.allTime ? 'all-time' : '',
      dateParams?.date || '',
      dateParams?.startDate || '',
      dateParams?.endDate || '',
    ],
    queryFn: () => dashboardService.fetchDashboard(branchId, dateParams),
    placeholderData: (prev) => prev,
  });
