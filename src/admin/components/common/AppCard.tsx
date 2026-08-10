import { Card as AntCard, type CardProps } from 'antd';
import { memo } from 'react';

export const AppCard = memo(({ children, ...props }: CardProps) => (
  <AntCard variant="borderless" {...props}>
    {children}
  </AntCard>
));

AppCard.displayName = 'AppCard';
