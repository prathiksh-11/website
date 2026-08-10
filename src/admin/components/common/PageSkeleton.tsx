import { Skeleton } from 'antd';
import { memo } from 'react';

type PageSkeletonVariant =
  | 'dashboard'
  | 'list'
  | 'cards'
  | 'report'
  | 'inbox'
  | 'detail';

interface PageSkeletonProps {
  variant?: PageSkeletonVariant;
}

const StatRow = ({ count = 4 }: { count?: number }) => (
  <div className="sk-stats">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="sk-stat">
        <Skeleton.Input active size="small" style={{ width: 72, height: 12 }} />
        <Skeleton.Input active size="large" style={{ width: 96, height: 28 }} />
      </div>
    ))}
  </div>
);

const Hero = () => (
  <div className="sk-hero">
    <div>
      <Skeleton.Input active size="small" style={{ width: 100, height: 12 }} />
      <Skeleton.Input
        active
        size="large"
        style={{ width: 260, height: 34, marginTop: 10 }}
      />
      <Skeleton.Input
        active
        size="small"
        style={{ width: 320, height: 14, marginTop: 10 }}
      />
    </div>
    <Skeleton.Node active style={{ width: 88, height: 64, borderRadius: 14 }} />
  </div>
);

const Toolbar = () => (
  <div className="sk-toolbar">
    <Skeleton.Input active style={{ width: '100%', maxWidth: 280, height: 40 }} />
    <Skeleton.Button active style={{ width: 120, height: 40 }} />
    <Skeleton.Button active style={{ width: 120, height: 40 }} />
    <Skeleton.Button active style={{ width: 160, height: 40 }} />
  </div>
);

const TableBlock = ({ rows = 8 }: { rows?: number }) => (
  <div className="sk-table">
    <Skeleton active paragraph={{ rows }} title={false} />
  </div>
);

const CardGrid = ({ count = 6 }: { count?: number }) => (
  <div className="sk-cards">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="sk-card">
        <Skeleton.Node active style={{ width: '100%', height: 140 }} />
        <div style={{ padding: '0.85rem 0.2rem 0.2rem' }}>
          <Skeleton active paragraph={{ rows: 2 }} title={{ width: '60%' }} />
        </div>
      </div>
    ))}
  </div>
);

const DashboardSkeleton = () => (
  <div className="sk-page sk-page--dashboard" aria-busy="true" aria-label="Loading dashboard">
    <Hero />
    <StatRow count={4} />
    <div className="sk-bento">
      <div className="sk-bento__wide">
        <Skeleton active paragraph={{ rows: 6 }} />
      </div>
      <div className="sk-bento__side">
        <Skeleton active paragraph={{ rows: 4 }} />
      </div>
      <div className="sk-bento__side">
        <Skeleton active paragraph={{ rows: 4 }} />
      </div>
      <div className="sk-bento__wide">
        <Skeleton active paragraph={{ rows: 5 }} />
      </div>
    </div>
  </div>
);

const ListSkeleton = () => (
  <div className="sk-page" aria-busy="true" aria-label="Loading">
    <Hero />
    <StatRow count={4} />
    <div className="sk-panel">
      <Toolbar />
      <TableBlock rows={9} />
    </div>
  </div>
);

const CardsSkeleton = () => (
  <div className="sk-page" aria-busy="true" aria-label="Loading">
    <Hero />
    <StatRow count={4} />
    <div className="sk-panel">
      <Toolbar />
      <CardGrid count={6} />
    </div>
  </div>
);

const ReportSkeleton = () => (
  <div className="sk-page" aria-busy="true" aria-label="Loading report">
    <Hero />
    <StatRow count={4} />
    <div className="sk-panel">
      <Toolbar />
      <div className="sk-bento" style={{ marginTop: 12 }}>
        <div className="sk-bento__wide">
          <Skeleton active paragraph={{ rows: 8 }} />
        </div>
        <div className="sk-bento__side">
          <Skeleton active paragraph={{ rows: 6 }} />
        </div>
      </div>
    </div>
  </div>
);

const InboxSkeleton = () => (
  <div className="sk-page" aria-busy="true" aria-label="Loading notifications">
    <Hero />
    <div className="sk-inbox">
      <div className="sk-panel">
        <Skeleton active paragraph={{ rows: 8 }} />
      </div>
      <div className="sk-panel">
        <Skeleton active paragraph={{ rows: 10 }} />
      </div>
    </div>
  </div>
);

const DetailSkeleton = () => (
  <div className="sk-page" aria-busy="true" aria-label="Loading">
    <Hero />
    <div className="sk-panel">
      <Skeleton active avatar paragraph={{ rows: 8 }} />
    </div>
  </div>
);

export const PageSkeleton = memo(
  ({ variant = 'list' }: PageSkeletonProps) => {
    if (variant === 'dashboard') return <DashboardSkeleton />;
    if (variant === 'cards') return <CardsSkeleton />;
    if (variant === 'report') return <ReportSkeleton />;
    if (variant === 'inbox') return <InboxSkeleton />;
    if (variant === 'detail') return <DetailSkeleton />;
    return <ListSkeleton />;
  },
);

PageSkeleton.displayName = 'PageSkeleton';
