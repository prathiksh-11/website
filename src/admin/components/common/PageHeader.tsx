import { Breadcrumb, Space } from 'antd';
import { memo, type ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface Crumb {
  title: string;
  path?: string;
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: Crumb[];
  extra?: ReactNode;
}

export const PageHeader = memo(
  ({ title, subtitle, breadcrumbs, extra }: PageHeaderProps) => (
    <div
      className="admin-page-head"
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        gap: 16,
        flexWrap: 'wrap',
        alignItems: 'flex-start',
      }}
    >
      <div>
        {breadcrumbs?.length ? (
          <Breadcrumb
            items={breadcrumbs.map((c) => ({
              title: c.path ? <Link to={c.path}>{c.title}</Link> : c.title,
            }))}
            style={{ marginBottom: 4 }}
          />
        ) : null}
        <h1>{title}</h1>
        {subtitle ? <p>{subtitle}</p> : null}
      </div>
      {extra ? <Space wrap>{extra}</Space> : null}
    </div>
  ),
);

PageHeader.displayName = 'PageHeader';
