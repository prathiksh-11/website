import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '@/services/dashboard.service';

export const useDashboard = (branchId?: string) =>
  useQuery({
    queryKey: ['dashboard', branchId || 'all'],
    queryFn: () => dashboardService.fetchDashboard(branchId),
    placeholderData: (prev) => prev,
  });
