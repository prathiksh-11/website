import { Spin } from 'antd';
import { memo } from 'react';

export const AppLoader = memo(({ tip = 'Loading...' }: { tip?: string }) => (
  <div
    style={{
      minHeight: 240,
      display: 'grid',
      placeItems: 'center',
    }}
  >
    <Spin size="large" tip={tip} />
  </div>
));

AppLoader.displayName = 'AppLoader';
