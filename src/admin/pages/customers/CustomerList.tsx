import {
  EyeOutlined,
  PhoneOutlined,
  SearchOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Button, Drawer, Empty, Input, Select, Skeleton, Table } from 'antd';
import { useMemo, useState } from 'react';
import { MapPin, Users } from 'lucide-react';
import { StatusBadge } from '@/components/common';
import { PAGE_SIZE_OPTIONS } from '@/constants';
import { useBranches } from '@/hooks/useBranches';
import { useCustomers, useCustomersAll } from '@/hooks/useCustomers';
import { useAuthStore } from '@/store/auth.store';
import { useTableParams } from '@/hooks/useTableParams';
import type { Customer } from '@/types';
import { formatDate } from '@/utils/format';

const shortBranch = (name: string) =>
  name
    .replace(/^Game On Fitness\s*/i, '')
    .replace(/^(Premium Club|Luxury Club)\s*-?\s*/i, '')
    .trim() || name;

const initials = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');

export const CustomerList = () => {
  const user = useAuthStore((s) => s.user);
  const { params, setSearch, setStatus, setBranchId, setPage } = useTableParams({
    pageSize: 12,
  });
  const { data: allCustomers, isLoading: loadingAll } = useCustomersAll();
  const { data, isLoading } = useCustomers(params);
  const { data: branchesData } = useBranches({ page: 1, pageSize: 200 });
  const [selected, setSelected] = useState<Customer | null>(null);

  const stats = useMemo(() => {
    const list = allCustomers ?? [];
    const active = list.filter((c) => c.membershipStatus === 'active').length;
    const unassigned = list.filter(
      (c) => !c.branchId || c.branchName === 'Unassigned',
    ).length;
    const branches = new Set(list.map((c) => c.branchId).filter(Boolean)).size;
    return {
      total: list.length,
      active,
      unassigned,
      branches,
    };
  }, [allCustomers]);

  const roleHint =
    user?.role === 'Super Admin'
      ? 'Showing every member across all branches'
      : 'Showing members for your assigned branches';

  return (
    <div className="cust">
      <header className="cust__hero">
        <div>
          <p className="cust__kicker">Members</p>
          <h1>Customers</h1>
          <p className="cust__sub">{roleHint}</p>
        </div>
        <div className="cust__hero-meta">
          <Users size={18} />
          <div>
            <strong>{stats.total}</strong>
            <span>total loaded</span>
          </div>
        </div>
      </header>

      <section className="cust__stats" aria-label="Customer stats">
        <article className="cust-stat">
          <span>Total members</span>
          <strong>{loadingAll ? '—' : stats.total}</strong>
        </article>
        <article className="cust-stat">
          <span>Active</span>
          <strong>{loadingAll ? '—' : stats.active}</strong>
        </article>
        <article className="cust-stat">
          <span>Branches</span>
          <strong>{loadingAll ? '—' : stats.branches}</strong>
        </article>
        <article className="cust-stat">
          <span>Unassigned</span>
          <strong>{loadingAll ? '—' : stats.unassigned}</strong>
        </article>
      </section>

      <section className="cust__panel">
        <div className="cust__toolbar">
          <Input
            allowClear
            size="large"
            prefix={<SearchOutlined />}
            placeholder="Search name, mobile, branch…"
            value={params.search}
            onChange={(e) => setSearch(e.target.value)}
            className="cust__search"
          />
          <Select
            allowClear
            size="large"
            placeholder="Status"
            className="cust__filter"
            value={params.status}
            onChange={setStatus}
            options={[
              { value: 'active', label: 'Active' },
              { value: 'inactive', label: 'Inactive' },
              { value: 'pending', label: 'Pending' },
              { value: 'expired', label: 'Expired' },
            ]}
          />
          <Select
            allowClear
            showSearch
            optionFilterProp="label"
            size="large"
            placeholder="Branch"
            className="cust__filter cust__filter--wide"
            value={params.branchId}
            onChange={setBranchId}
            options={branchesData?.data.map((b) => ({
              value: b.id,
              label: shortBranch(b.name),
            }))}
          />
        </div>

        {isLoading && !data?.data?.length ? (
          <Skeleton active paragraph={{ rows: 8 }} />
        ) : (
          <Table<Customer>
            rowKey="id"
            loading={isLoading}
            dataSource={data?.data}
            className="cust__table"
            locale={{
              emptyText: (
                <Empty description="No customers match your filters" />
              ),
            }}
            pagination={{
              current: data?.page,
              pageSize: data?.pageSize,
              total: data?.total,
              showSizeChanger: true,
              pageSizeOptions: PAGE_SIZE_OPTIONS.map(String),
              showTotal: (total) => `${total} members`,
              onChange: setPage,
            }}
            columns={[
              {
                title: 'Member',
                dataIndex: 'name',
                render: (_, record) => (
                  <div className="cust-member">
                    {record.avatar ? (
                      <img src={record.avatar} alt="" className="cust-member__avatar" />
                    ) : (
                      <span className="cust-member__avatar cust-member__avatar--fallback">
                        {initials(record.name) || <UserOutlined />}
                      </span>
                    )}
                    <div>
                      <strong>{record.name}</strong>
                      <small>
                        {record.gender !== 'other'
                          ? record.gender
                          : 'Member'}{' '}
                        · ID {record.id}
                      </small>
                    </div>
                  </div>
                ),
              },
              {
                title: 'Mobile',
                dataIndex: 'phone',
                render: (phone: string) =>
                  phone ? (
                    <a className="cust-phone" href={`tel:${phone}`}>
                      <PhoneOutlined /> {phone}
                    </a>
                  ) : (
                    '—'
                  ),
              },
              {
                title: 'Branch',
                dataIndex: 'branchName',
                render: (name: string) => (
                  <span className="cust-branch">
                    <MapPin size={14} />
                    {shortBranch(name)}
                  </span>
                ),
              },
              {
                title: 'Status',
                dataIndex: 'membershipStatus',
                width: 120,
                render: (v: string) => <StatusBadge status={v} />,
              },
              {
                title: 'Joined',
                dataIndex: 'joinDate',
                width: 130,
                render: (v: string) => formatDate(v),
              },
              {
                title: '',
                key: 'view',
                width: 72,
                render: (_, record) => (
                  <Button
                    type="text"
                    icon={<EyeOutlined />}
                    onClick={() => setSelected(record)}
                    aria-label={`View ${record.name}`}
                  />
                ),
              },
            ]}
          />
        )}
      </section>

      <Drawer
        title="Member profile"
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        width={400}
        destroyOnHidden
        className="cust-drawer"
      >
        {selected ? (
          <div className="cust-detail">
            <div className="cust-detail__head">
              {selected.avatar ? (
                <img src={selected.avatar} alt="" />
              ) : (
                <span>{initials(selected.name)}</span>
              )}
              <div>
                <h3>{selected.name}</h3>
                <StatusBadge status={selected.membershipStatus} />
              </div>
            </div>
            <dl>
              <div>
                <dt>Mobile</dt>
                <dd>{selected.phone || '—'}</dd>
              </div>
              <div>
                <dt>Email</dt>
                <dd>{selected.email || '—'}</dd>
              </div>
              <div>
                <dt>Branch</dt>
                <dd>{selected.branchName}</dd>
              </div>
              <div>
                <dt>Gender</dt>
                <dd>{selected.gender}</dd>
              </div>
              <div>
                <dt>Joined</dt>
                <dd>{formatDate(selected.joinDate)}</dd>
              </div>
              <div>
                <dt>Member ID</dt>
                <dd>{selected.id}</dd>
              </div>
            </dl>
          </div>
        ) : null}
      </Drawer>
    </div>
  );
};
