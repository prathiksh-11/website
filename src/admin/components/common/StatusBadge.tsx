import { Tag } from 'antd';
import { memo } from 'react';
import { STATUS_COLORS } from '@/constants';

interface StatusBadgeProps {
  status: string;
}

export const StatusBadge = memo(({ status }: StatusBadgeProps) => (
  <Tag color={STATUS_COLORS[status] ?? 'default'}>
    {status.replace(/_/g, ' ').toUpperCase()}
  </Tag>
));

StatusBadge.displayName = 'StatusBadge';
