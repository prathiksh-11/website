import {
  EyeOutlined,
  FileExcelOutlined,
  PhoneOutlined,
  SearchOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Button, DatePicker, Drawer, Empty, Input, message, Modal, Progress, Select, Skeleton, Table, Tag } from 'antd';
import dayjs from 'dayjs';
import { useMemo, useState } from 'react';
import {
  Activity,
  AlertCircle,
  Calendar,
  Clock,
  CreditCard,
  DollarSign,
  Download,
  Dumbbell,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  UserCheck,
  Users,
} from 'lucide-react';
import { PageSkeleton, StatusBadge } from '@/components/common';
import { PAGE_SIZE_OPTIONS } from '@/constants';
import { useBranches } from '@/hooks/useBranches';
import { useCustomerDetails, useCustomers, useCustomersAll } from '@/hooks/useCustomers';
import { customerService } from '@/services/customer.service';
import { useAuthStore } from '@/store/auth.store';
import { useTableParams } from '@/hooks/useTableParams';
import type { Customer } from '@/types';
import { formatCurrency, formatDate } from '@/utils/format';

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

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const {
    data: customerDetails,
    isLoading: loadingDetails,
    isError: detailsError,
  } = useCustomerDetails(selectedId);

  // Export Modal state
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [exportType, setExportType] = useState<'summary' | 'detailed'>('summary');
  const [exportCustomer, setExportCustomer] = useState<Customer | null>(null);
  const [exportDates, setExportDates] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null] | null>(null);
  const [exportBranchId, setExportBranchId] = useState<string | undefined>(undefined);
  const [branchError, setBranchError] = useState(false);
  const [dateError, setDateError] = useState(false);
  const [exporting, setExporting] = useState(false);

  const openSummaryExport = () => {
    setExportType('summary');
    setExportCustomer(null);
    setExportDates(null);
    setExportBranchId(params.branchId);
    setBranchError(false);
    setDateError(false);
    setExportModalOpen(true);
  };

  const openDetailedExport = (customer: Customer) => {
    setExportType('detailed');
    setExportCustomer(customer);
    setExportDates(null);
    setExportBranchId(customer.branchId || params.branchId);
    setBranchError(false);
    setDateError(false);
    setExportModalOpen(true);
  };

  const handleExportDownload = async () => {
    const targetBranch = exportBranchId || (exportType === 'summary' ? params.branchId : exportCustomer?.branchId || params.branchId);

    if (!targetBranch) {
      setBranchError(true);
      message.error('Branch selection is required to export the report');
      return;
    }
    setBranchError(false);

    if (exportDates) {
      if (!exportDates[0] || !exportDates[1]) {
        setDateError(true);
        message.error('Incomplete date range. Please select both From Date and To Date.');
        return;
      }
      if (exportDates[0].isAfter(exportDates[1], 'day')) {
        setDateError(true);
        message.error('From Date cannot be after To Date');
        return;
      }
    }
    setDateError(false);

    const fromDate = exportDates?.[0] ? exportDates[0].format('YYYY-MM-DD') : undefined;
    const toDate = exportDates?.[1] ? exportDates[1].format('YYYY-MM-DD') : undefined;

    setExporting(true);
    const hideMsg = message.loading('Generating Excel report...', 0);

    try {
      if (exportType === 'summary') {
        await customerService.downloadSummaryReport({
          branchId: targetBranch,
          fromDate,
          toDate,
        });
        message.success('Customer Summary Excel report downloaded successfully');
      } else if (exportCustomer) {
        await customerService.downloadDetailedReport({
          customerId: exportCustomer.id,
          branchId: targetBranch,
          fromDate,
          toDate,
        });
        message.success(`Detailed Excel report for ${exportCustomer.name} downloaded successfully`);
      }
      setExportModalOpen(false);
    } catch (err: unknown) {
      const errMsg =
        typeof err === 'object' && err !== null && 'message' in err
          ? String((err as { message?: string }).message)
          : 'Failed to download report';
      message.error(errMsg);
    } finally {
      hideMsg();
      setExporting(false);
    }
  };

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

  if (loadingAll && (!allCustomers || allCustomers === 0)) {
    return <PageSkeleton variant="list" />;
  }

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
          <Button
            icon={<FileExcelOutlined style={{ color: '#ff5000' }} />}
            onClick={openSummaryExport}
            size="large"
            style={{
              borderRadius: 10,
              fontWeight: 600,
              borderColor: 'rgba(22, 24, 31, 0.12)',
              color: '#16181f',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
            }}
          >
            Export Summary
          </Button>
        </div>

        <Table<Customer>
          rowKey="id"
          loading={isLoading}
          dataSource={data?.data}
          className="cust__table"
          onRow={(record) => ({
            onClick: () => setSelectedId(record.id),
            style: { cursor: 'pointer' },
          })}
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
                      · ID #{record.id}
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
                  <a
                    className="cust-phone"
                    href={`tel:${phone}`}
                    onClick={(e) => e.stopPropagation()}
                  >
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
              width: 100,
              render: (_, record) => (
                <div style={{ display: 'flex', gap: '0.2rem', justifyContent: 'flex-end' }}>
                  <Button
                    type="text"
                    icon={<FileExcelOutlined style={{ color: '#ff5000' }} />}
                    onClick={(e) => {
                      e.stopPropagation();
                      openDetailedExport(record);
                    }}
                    title="Export Excel Report"
                    aria-label={`Export Excel Report for ${record.name}`}
                  />
                  <Button
                    type="text"
                    icon={<EyeOutlined />}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedId(record.id);
                    }}
                    aria-label={`View ${record.name}`}
                  />
                </div>
              ),
            },
          ]}
        />
      </section>

      <Drawer
        title={
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', paddingRight: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <UserOutlined style={{ color: '#ff5000' }} />
              <span style={{ fontWeight: 700, fontSize: '1.05rem' }}>Member Profile</span>
            </div>
            {customerDetails && (
              <Button
                icon={<FileExcelOutlined style={{ color: '#ff5000' }} />}
                onClick={() => {
                  const found = (allCustomers ?? []).find((c) => c.id === customerDetails.id) || {
                    id: customerDetails.id,
                    name: customerDetails.name,
                    branchId: params.branchId,
                    branchName: customerDetails.branch_name,
                  };
                  openDetailedExport(found as Customer);
                }}
                style={{
                  borderRadius: 8,
                  fontWeight: 600,
                  borderColor: 'rgba(22, 24, 31, 0.12)',
                  color: '#16181f',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                }}
              >
                Export Excel
              </Button>
            )}
          </div>
        }
        open={Boolean(selectedId)}
        onClose={() => setSelectedId(null)}
        width={560}
        destroyOnClose
        className="cust-drawer"
      >
        {loadingDetails && !customerDetails ? (
          <Skeleton active paragraph={{ rows: 12 }} />
        ) : detailsError && !customerDetails ? (
          <Empty description="Failed to load member details" />
        ) : customerDetails ? (
          <div className="cust-detail">
            {/* Payment Due Alert Banner */}
            {(Number(customerDetails.payment_due) > 0 || customerDetails.payment_due_note) && (
              <div className="cust-detail__due-banner">
                <AlertCircle size={20} style={{ flexShrink: 0 }} />
                <div>
                  <strong style={{ fontSize: '0.92rem' }}>
                    Payment Due: {formatCurrency(Number(customerDetails.payment_due) || 0)}
                  </strong>
                  {customerDetails.payment_due_note && (
                    <p style={{ margin: '0.2rem 0 0', fontSize: '0.8rem', opacity: 0.9 }}>
                      {customerDetails.payment_due_note}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Profile Hero Card */}
            <div className="cust-detail__hero">
              {customerDetails.profile_image_url ? (
                <img
                  src={customerDetails.profile_image_url}
                  alt={customerDetails.name}
                  className="cust-detail__avatar"
                />
              ) : (
                <span className="cust-detail__avatar cust-detail__avatar--fallback">
                  {initials(customerDetails.name) || <UserOutlined />}
                </span>
              )}
              <div className="cust-detail__hero-info">
                <h3 className="cust-detail__name">{customerDetails.name}</h3>
                <div className="cust-detail__hero-tags">
                  <StatusBadge status={customerDetails.status || 'active'} />
                  {customerDetails.membership_type && (
                    <Tag color="orange" style={{ borderRadius: 8, fontWeight: 600 }}>
                      {customerDetails.membership_type.trim()}
                    </Tag>
                  )}
                  <Tag style={{ borderRadius: 8, fontWeight: 600 }}>ID #{customerDetails.id}</Tag>
                </div>
              </div>
            </div>

            {/* Key KPI Stats Grid */}
            <div className="cust-detail__kpi-grid">
              <div className="cust-detail__kpi-card">
                <div className="cust-detail__kpi-header">
                  <span>Sessions Left</span>
                  <Dumbbell size={14} style={{ color: '#ff5000' }} />
                </div>
                <div className="cust-detail__kpi-value">
                  {customerDetails.remaining_sessions ?? '—'}
                </div>
                <div className="cust-detail__kpi-sub">
                  Total {customerDetails.session_plan?.total_sessions ?? 0} sessions
                </div>
              </div>

              <div className="cust-detail__kpi-card">
                <div className="cust-detail__kpi-header">
                  <span>Payment Due</span>
                  <DollarSign
                    size={14}
                    style={{
                      color: Number(customerDetails.payment_due) > 0 ? '#ef4444' : '#10b981',
                    }}
                  />
                </div>
                <div
                  className="cust-detail__kpi-value"
                  style={{
                    color: Number(customerDetails.payment_due) > 0 ? '#ef4444' : '#10b981',
                  }}
                >
                  {Number(customerDetails.payment_due) > 0
                    ? formatCurrency(Number(customerDetails.payment_due))
                    : '₹0'}
                </div>
                <div className="cust-detail__kpi-sub">
                  {Number(customerDetails.payment_due) > 0 ? 'Action required' : 'Fully Settled'}
                </div>
              </div>

              <div className="cust-detail__kpi-card">
                <div className="cust-detail__kpi-header">
                  <span>Status</span>
                  <Activity size={14} style={{ color: '#ff5000' }} />
                </div>
                <div
                  className="cust-detail__kpi-value"
                  style={{ textTransform: 'capitalize', fontSize: '1.1rem' }}
                >
                  {customerDetails.status || 'Active'}
                </div>
                <div className="cust-detail__kpi-sub">
                  Since {formatDate(customerDetails.joined_on)}
                </div>
              </div>
            </div>

            {/* Contact & Branch Info Grid */}
            <div className="cust-detail__info-grid">
              <div className="cust-detail__info-item">
                <div className="cust-detail__info-icon">
                  <Phone size={15} />
                </div>
                <div>
                  <span className="cust-detail__info-label">Mobile</span>
                  {customerDetails.phone ? (
                    <a
                      href={`tel:${customerDetails.phone}`}
                      className="cust-detail__info-value"
                      style={{ color: '#ff5000' }}
                    >
                      {customerDetails.phone}
                    </a>
                  ) : (
                    <span className="cust-detail__info-value">—</span>
                  )}
                </div>
              </div>

              <div className="cust-detail__info-item">
                <div className="cust-detail__info-icon">
                  <Mail size={15} />
                </div>
                <div>
                  <span className="cust-detail__info-label">Email</span>
                  <span className="cust-detail__info-value">{customerDetails.email || '—'}</span>
                </div>
              </div>

              <div className="cust-detail__info-item">
                <div className="cust-detail__info-icon">
                  <MapPin size={15} />
                </div>
                <div>
                  <span className="cust-detail__info-label">Branch</span>
                  <span className="cust-detail__info-value">
                    {shortBranch(customerDetails.branch_name || 'Unassigned')}
                  </span>
                </div>
              </div>

              <div className="cust-detail__info-item">
                <div className="cust-detail__info-icon">
                  <Calendar size={15} />
                </div>
                <div>
                  <span className="cust-detail__info-label">Joined On</span>
                  <span className="cust-detail__info-value">{formatDate(customerDetails.joined_on)}</span>
                </div>
              </div>

              <div className="cust-detail__info-item">
                <div className="cust-detail__info-icon">
                  <Clock size={15} />
                </div>
                <div>
                  <span className="cust-detail__info-label">Last Visit</span>
                  <span className="cust-detail__info-value">{formatDate(customerDetails.last_visit)}</span>
                </div>
              </div>

              <div className="cust-detail__info-item">
                <div className="cust-detail__info-icon">
                  <ShieldCheck size={15} />
                </div>
                <div>
                  <span className="cust-detail__info-label">Plan Type</span>
                  <span className="cust-detail__info-value">{customerDetails.membership_type || 'General'}</span>
                </div>
              </div>
            </div>

            {/* Active Subscription Card */}
            {customerDetails.subscription && (
              <div className="cust-detail__card">
                <div className="cust-detail__card-title">
                  <div className="cust-detail__card-title-left">
                    <CreditCard size={18} />
                    <span>Membership Subscription</span>
                  </div>
                  <StatusBadge status={customerDetails.subscription.status} />
                </div>

                <div className="cust-detail__plan-hero">
                  <div>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        textTransform: 'uppercase',
                        color: '#9a3412',
                        fontWeight: 600,
                        display: 'block',
                      }}
                    >
                      Active Plan
                    </span>
                    <span className="cust-detail__plan-name">
                      {customerDetails.subscription.plan_name}
                    </span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span className="cust-detail__plan-price">
                      {formatCurrency(Number(customerDetails.subscription.amount) || 0)}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: '#9a3412', display: 'block' }}>
                      {customerDetails.subscription.billing_cycle || 'Monthly'}
                    </span>
                  </div>
                </div>

                <div className="cust-detail__keyvals">
                  <div className="cust-detail__keyval">
                    <div className="cust-detail__keyval-label">Start Date</div>
                    <div className="cust-detail__keyval-value">
                      {formatDate(customerDetails.subscription.start_date)}
                    </div>
                  </div>
                  <div className="cust-detail__keyval">
                    <div className="cust-detail__keyval-label">End Date</div>
                    <div className="cust-detail__keyval-value">
                      {formatDate(customerDetails.subscription.end_date)}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Session Plans / PT Packages */}
            {((customerDetails.session_plans && customerDetails.session_plans.length > 0) ||
              customerDetails.session_plan) && (
                <div className="cust-detail__card">
                  <div className="cust-detail__card-title">
                    <div className="cust-detail__card-title-left">
                      <Dumbbell size={18} />
                      <span>PT Session Packages</span>
                    </div>
                    <Tag color="orange" style={{ borderRadius: 8, fontWeight: 600 }}>
                      {(customerDetails.session_plans?.length || 1)}{' '}
                      {(customerDetails.session_plans?.length || 1) === 1
                        ? 'Active Package'
                        : 'Active Packages'}
                    </Tag>
                  </div>

                  <div className="cust-detail__packages-list">
                    {(
                      customerDetails.session_plans ||
                      (customerDetails.session_plan ? [customerDetails.session_plan] : [])
                    ).map((sp, idx) => {
                      const used = sp.used_sessions || 0;
                      const total = sp.total_sessions || 1;
                      const left = Math.max(0, total - used);
                      const percent = Math.min(100, Math.round((used / total) * 100));
                      const isPartial =
                        Boolean(sp.is_partial) ||
                        Number(sp.amount_pending ?? 0) > 0;

                      return (
                        <div key={idx} className="cust-detail__package-card">
                          <div className="cust-detail__package-head">
                            <div className="cust-detail__package-title-wrap">
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                <span className="cust-detail__package-num">
                                  Package #{idx + 1}
                                </span>
                                {isPartial && Number(sp.amount_pending) > 0 ? (
                                  <Tag
                                    color="warning"
                                    style={{
                                      borderRadius: 6,
                                      fontWeight: 600,
                                      margin: 0,
                                      fontSize: '0.68rem',
                                      lineHeight: '18px',
                                    }}
                                  >
                                    Partial Paid
                                  </Tag>
                                ) : null}
                              </div>
                              <strong className="cust-detail__package-name">
                                {sp.plan_name}
                              </strong>
                              <span className="cust-detail__package-date">
                                <Calendar size={12} />
                                Purchased on {formatDate(sp.purchased_on)}
                              </span>
                            </div>
                            <StatusBadge status={sp.status} />
                          </div>

                          <div className="cust-detail__progress-box">
                            <div className="cust-detail__progress-top">
                              <span className="cust-detail__progress-label">Session Progress</span>
                              <span className="cust-detail__progress-val">
                                <strong>{used}</strong> of {total} used (
                                <span style={{ color: left > 0 ? '#ff5000' : '#16a34a' }}>
                                  {left} left
                                </span>
                                )
                              </span>
                            </div>
                            <Progress
                              percent={percent}
                              strokeColor={{ '0%': '#ff5000', '100%': '#e04800' }}
                              status="active"
                            />
                          </div>

                          <div className="cust-detail__keyvals">
                            <div className="cust-detail__keyval">
                              <div className="cust-detail__keyval-label">Price</div>
                              <div className="cust-detail__keyval-value">
                                {formatCurrency(Number(sp.price) || 0)}
                              </div>
                            </div>
                            <div className="cust-detail__keyval">
                              <div className="cust-detail__keyval-label">
                                {isPartial && Number(sp.amount_pending) > 0
                                  ? 'Payment Status'
                                  : 'Purchased On'}
                              </div>
                              <div className="cust-detail__keyval-value">
                                {isPartial && Number(sp.amount_pending) > 0 ? (
                                  <span style={{ color: '#ea580c' }}>
                                    {formatCurrency(Number(sp.amount_paid) || 0)} paid · {formatCurrency(Number(sp.amount_pending) || 0)} due
                                  </span>
                                ) : (
                                  formatDate(sp.purchased_on)
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

            {/* Attendance History */}
            <div className="cust-detail__card">
              <div className="cust-detail__card-title">
                <div className="cust-detail__card-title-left">
                  <UserCheck size={18} />
                  <span>Attendance History</span>
                </div>
                <Tag style={{ borderRadius: 8, fontWeight: 600 }}>
                  {customerDetails.attendance_history?.length || 0} Sessions
                </Tag>
              </div>

              {customerDetails.attendance_history &&
                customerDetails.attendance_history.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {customerDetails.attendance_history.map((att) => (
                    <div key={att.id} className="cust-detail__timeline-item">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: 10,
                            background: '#fff0e8',
                            display: 'grid',
                            placeItems: 'center',
                            color: '#ff5000',
                            fontWeight: 700,
                          }}
                        >
                          <Calendar size={16} />
                        </div>
                        <div>
                          <strong style={{ fontSize: '0.88rem', display: 'block', color: '#16181f' }}>
                            {att.session_name}
                          </strong>
                          <span style={{ fontSize: '0.75rem', color: '#6f7685' }}>
                            Trainer: {att.trainer || 'Unassigned'} · {formatDate(att.date)} at {att.time}
                          </span>
                        </div>
                      </div>
                      <Tag
                        color={att.status === 'attended' ? 'success' : 'default'}
                        style={{ borderRadius: 6, textTransform: 'capitalize', fontWeight: 600 }}
                      >
                        {att.status}
                      </Tag>
                    </div>
                  ))}
                </div>
              ) : (
                <Empty description="No attendance record found" image={Empty.PRESENTED_IMAGE_SIMPLE} />
              )}
            </div>
          </div>
        ) : (
          <Empty description="Select a customer to view details" />
        )}
      </Drawer>

      {/* Export Date & Branch Selection Modal */}
      <Modal
        open={exportModalOpen}
        onCancel={() => setExportModalOpen(false)}
        footer={null}
        width={480}
        destroyOnClose
        centered
        styles={{
          body: {
            borderRadius: 20,
            padding: '1.75rem',
          },
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: '#fff0e8',
              display: 'grid',
              placeItems: 'center',
              color: '#ff5000',
              fontWeight: 700,
            }}>
              <FileExcelOutlined style={{ fontSize: 22 }} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700, color: '#16181f' }}>
                {exportType === 'summary' ? 'Export Customer Summary' : 'Export Customer Report'}
              </h3>
              <p style={{ margin: 0, fontSize: '0.82rem', color: '#6f7685' }}>
                {exportType === 'summary'
                  ? 'Generate an Excel report for all customers in branch'
                  : `Export performance & attendance details for ${exportCustomer?.name ?? 'member'}`}
              </p>
            </div>
          </div>

          {/* Context Info / Target Branch */}
          {exportType === 'detailed' && exportCustomer ? (
            <div style={{
              padding: '0.85rem 1rem',
              borderRadius: 14,
              background: '#f8fafc',
              border: '1px solid rgba(22, 24, 31, 0.08)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
            }}>
              {exportCustomer.avatar ? (
                <img src={exportCustomer.avatar} alt="" style={{ width: 38, height: 38, borderRadius: '50%', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: 38, height: 38, borderRadius: '50%', background: '#fff0e8', color: '#ff5000', display: 'grid', placeItems: 'center', fontWeight: 700 }}>
                  {initials(exportCustomer.name) || <UserOutlined />}
                </div>
              )}
              <div>
                <strong style={{ fontSize: '0.95rem', color: '#16181f', display: 'block' }}>
                  {exportCustomer.name}
                </strong>
                <span style={{ fontSize: '0.78rem', color: '#6f7685' }}>
                  Member ID #{exportCustomer.id} · {shortBranch(exportCustomer.branchName || 'Unassigned')}
                </span>
              </div>
            </div>
          ) : (
            <div style={{
              padding: '0.85rem 1rem',
              borderRadius: 14,
              background: '#f8fafc',
              border: branchError ? '1px solid #ff4d4f' : '1px solid rgba(22, 24, 31, 0.08)',
              transition: 'border-color 0.2s ease',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#6f7685', fontWeight: 600 }}>
                  Target Branch <span style={{ color: '#ff4d4f' }}>*</span>
                </span>
                {branchError && (
                  <span style={{ fontSize: '0.75rem', color: '#ff4d4f', fontWeight: 600 }}>
                    Selection Required
                  </span>
                )}
              </div>
              <Select
                allowClear
                showSearch
                optionFilterProp="label"
                style={{ width: '100%' }}
                placeholder="Select Branch (Required)"
                status={branchError ? 'error' : ''}
                value={exportBranchId}
                onChange={(val) => {
                  setExportBranchId(val);
                  if (val) setBranchError(false);
                }}
                options={[
                  { value: 'all', label: 'All Branches' },
                  ...(branchesData?.data.map((b) => ({
                    value: String(b.id),
                    label: shortBranch(b.name),
                  })) ?? []),
                ]}
              />
              {branchError && (
                <small style={{ color: '#ff4d4f', fontSize: '0.75rem', marginTop: 4, display: 'block' }}>
                  Please select a branch to generate the customer summary report.
                </small>
              )}
            </div>
          )}

          {/* Quick Presets */}
          <div>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#16181f', display: 'block', marginBottom: '0.5rem' }}>
              Quick Date Presets
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {[
                { label: 'This Month', range: [dayjs().startOf('month'), dayjs()] },
                { label: 'Last 30 Days', range: [dayjs().subtract(30, 'day'), dayjs()] },
                { label: 'This Year', range: [dayjs().startOf('year'), dayjs().endOf('year')] },
                { label: 'All Time', range: null },
              ].map((preset) => (
                <Tag
                  key={preset.label}
                  onClick={() => {
                    setExportDates(preset.range as [dayjs.Dayjs, dayjs.Dayjs] | null);
                    setDateError(false);
                  }}
                  style={{
                    padding: '0.35rem 0.7rem',
                    borderRadius: 8,
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: '0.78rem',
                    background:
                      (preset.range === null && !exportDates) ||
                        (exportDates &&
                          preset.range &&
                          exportDates[0]?.isSame(preset.range[0], 'day') &&
                          exportDates[1]?.isSame(preset.range[1], 'day'))
                        ? '#ff5000'
                        : '#f1f3f6',
                    color:
                      (preset.range === null && !exportDates) ||
                        (exportDates &&
                          preset.range &&
                          exportDates[0]?.isSame(preset.range[0], 'day') &&
                          exportDates[1]?.isSame(preset.range[1], 'day'))
                        ? '#ffffff'
                        : '#4b5563',
                    border: 'none',
                  }}
                >
                  {preset.label}
                </Tag>
              ))}
            </div>
          </div>

          {/* Custom Date Range Picker */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#16181f' }}>
                Custom Date Range (YYYY-MM-DD)
              </span>
              {dateError && (
                <span style={{ fontSize: '0.75rem', color: '#ff4d4f', fontWeight: 600 }}>
                  Selection Invalid
                </span>
              )}
            </div>
            <DatePicker.RangePicker
              style={{ width: '100%', borderRadius: 10 }}
              format="YYYY-MM-DD"
              status={dateError ? 'error' : ''}
              value={exportDates}
              onChange={(dates) => {
                setExportDates(dates);
                if (!dates || (dates[0] && dates[1])) setDateError(false);
              }}
            />
            {dateError && (
              <small style={{ color: '#ff4d4f', fontSize: '0.75rem', marginTop: 4, display: 'block' }}>
                Incomplete date range. Please select both From Date and To Date.
              </small>
            )}
          </div>

          {/* Download Action CTA Button */}
          <Button
            type="primary"
            size="large"
            icon={<Download size={18} />}
            loading={exporting}
            onClick={handleExportDownload}
            style={{
              width: '100%',
              borderRadius: 12,
              height: 46,
              fontWeight: 700,
              fontSize: '0.95rem',
              background: '#ff5000',
              borderColor: '#ff5000',
              boxShadow: '0 3px 10px rgba(255, 80, 0, 0.22)',
              marginTop: '0.5rem',
            }}
          >
            {exporting ? 'Generating Report...' : 'Download Excel (.xlsx)'}
          </Button>
        </div>
      </Modal>
    </div>
  );
};
