import { memo, type ReactNode } from 'react';

interface ChartWrapperProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  height?: number | 'auto';
}

export const ChartWrapper = memo(
  ({ title, subtitle, children, height = 280 }: ChartWrapperProps) => (
    <section className="admin-panel">
      <div className="admin-panel__head">
        <h3>{title}</h3>
        {subtitle ? <span>{subtitle}</span> : null}
      </div>
      <div style={{ width: '100%', height: height === 'auto' ? undefined : height }}>
        {children}
      </div>
    </section>
  ),
);

ChartWrapper.displayName = 'ChartWrapper';
