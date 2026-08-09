import { Card, Statistic, type StatisticProps } from 'antd';
import { memo, type ReactNode } from 'react';
import { THEME_TOKENS } from '@/constants';

interface StatisticCardProps extends StatisticProps {
  icon?: ReactNode;
  accent?: string;
}

export const StatisticCard = memo(
  ({ icon, accent = THEME_TOKENS.colorPrimary, ...props }: StatisticCardProps) => (
    <Card
      variant="borderless"
      styles={{
        body: {
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          padding: 20,
        },
      }}
    >
      {icon ? (
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            display: 'grid',
            placeItems: 'center',
            background: THEME_TOKENS.colorBlush,
            color: accent,
            fontSize: 22,
            flexShrink: 0,
          }}
        >
          {icon}
        </div>
      ) : null}
      <Statistic {...props} />
    </Card>
  ),
);

StatisticCard.displayName = 'StatisticCard';
