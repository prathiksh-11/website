import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { couponApi } from '@/api/coupon.api';
import type { CouponListParams, CreateCouponPayload } from '@/types';

export const useCoupons = (params: CouponListParams = {}) =>
  useQuery({
    queryKey: ['coupons', params],
    queryFn: () => couponApi.list(params),
    placeholderData: (prev) => prev,
  });

export const useCouponMutations = () => {
  const queryClient = useQueryClient();

  const create = useMutation({
    mutationFn: (payload: CreateCouponPayload) => couponApi.create(payload),
    onSuccess: () => {
      message.success('Coupon created');
      void queryClient.invalidateQueries({ queryKey: ['coupons'] });
    },
    onError: (error: { message?: string }) => {
      message.error(error.message ?? 'Failed to create coupon');
    },
  });

  return { create };
};
