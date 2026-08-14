import { useQuery } from '@tanstack/react-query';
import { activityApi } from '@/api/activity.api';
import type { UserActivityListParams } from '@/types';

export const useMyActivity = (params: UserActivityListParams) =>
  useQuery({
    queryKey: ['my-activity', params],
    queryFn: () => activityApi.list(params),
    placeholderData: (previous) => previous,
  });
