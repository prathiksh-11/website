import dayjs from 'dayjs';
import {
  CalendarOutlined,
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
  EyeOutlined,
  FileExcelOutlined,
  PhoneOutlined,
  PlusOutlined,
  SearchOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  Button,
  DatePicker,
  Drawer,
  Empty,
  Form,
  Input,
  Modal,
  Progress,
  Select,
  Skeleton,
  Space,
  Table,
  Tag,
  Tooltip,
  message,
} from 'antd';
import {
  BarChart3,
  Calendar,
  Clock,
  Dumbbell,
  Mail,
  MapPin,
  Phone,
  PlayCircle,
  ShieldCheck,
  TrendingUp,
  UserCheck,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { StatusBadge, PageSkeleton, confirmDelete } from '@/components/common';
import { PAGE_SIZE_OPTIONS, TRAINER_TYPE_OPTIONS, resolveTrainerType, trainerTypeLabel, trainerTypeTagColor } from '@/constants';
import { useBranches } from '@/hooks/useBranches';
import {
  useTrainerDetails,
  useTrainerMutations,
  useTrainers,
  useTrainersAll,
  filterTrainers,
} from '@/hooks/useTrainers';
import { trainerService } from '@/services/trainer.service';
import { useAuthStore } from '@/store/auth.store';
import { useTableParams } from '@/hooks/useTableParams';
import type { Trainer, TrainerType } from '@/types';
import { formatCurrency, formatDate, formatDateTime } from '@/utils/format';

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

export const TrainerList = () => {
  const user = useAuthStore((s) => s.user);
  const { params, setSearch, setBranchId, setTrainerType, setPage } = useTableParams({
    pageSize: 12,
  });
  const { data: branchesData } = useBranches({ page: 1, pageSize: 200 });
  const branchNameById = useMemo(() => {
    const map: Record<string, string> = {};
    for (const b of branchesData?.data ?? []) map[b.id] = b.name;
    return map;
  }, [branchesData?.data]);

  const { data: allTrainers, isLoading: loadingAll } = useTrainersAll();
  const { data, isLoading } = useTrainers(params, branchNameById);
  const { create, update, remove } = useTrainerMutations();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { data: details, isLoading: loadingDetails } = useTrainerDetails(selectedId);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Trainer | null>(null);
  const [form] = Form.useForm();

  // Export Modal state
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [exportType, setExportType] = useState<'summary' | 'detailed'>('summary');
  const [exportTrainer, setExportTrainer] = useState<Trainer | null>(null);
  const [exportDates, setExportDates] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null] | null>(null);
  const [exportBranchId, setExportBranchId] = useState<string | undefined>(undefined);
  const [branchError, setBranchError] = useState(false);
  const [dateError, setDateError] = useState(false);
  const [exporting, setExporting] = useState(false);

  const openSummaryExport = () => {
    setExportType('summary');
    setExportTrainer(null);
    setExportDates(null);
    setExportBranchId(params.branchId);
    setBranchError(false);
    setDateError(false);
    setExportModalOpen(true);
  };

  const openDetailedExport = (trainer: Trainer) => {
    setExportType('detailed');
    setExportTrainer(trainer);
    setExportDates(null);
    setExportBranchId(trainer.branchId || params.branchId);
    setBranchError(false);
    setDateError(false);
    setExportModalOpen(true);
  };

  const handleExportDownload = async () => {
    const targetBranch = exportBranchId || (exportType === 'summary' ? params.branchId : exportTrainer?.branchId || params.branchId);

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
        await trainerService.downloadSummaryReport({
          branchId: targetBranch,
          fromDate,
          toDate,
        });
        message.success('Trainer Summary Excel report downloaded successfully');
      } else if (exportTrainer) {
        await trainerService.downloadDetailedReport({
          trainerId: exportTrainer.id,
          branchId: targetBranch,
          fromDate,
          toDate,
        });
        message.success(`Detailed Excel report for ${exportTrainer.name} downloaded successfully`);
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
    const list = filterTrainers(allTrainers ?? [], params, branchNameById);
    const branches = new Set(
      list.flatMap((t) => t.branchNames).filter(Boolean),
    ).size;
    return { total: list.length, branches };
  }, [allTrainers, params, branchNameById]);

  const selectedListItem = useMemo(
    () => (allTrainers ?? []).find((t) => t.id === selectedId) ?? null,
    [allTrainers, selectedId],
  );

  const roleHint =
    user?.role === 'Super Admin'
      ? 'Trainers & staff across all branches'
      : 'Employees for your assigned branches';

  const openCreate = () => {
    setEditing(null);
    form.resetFields();
    form.setFieldsValue({ gender: 'Male', trainerType: 'general_trainer' });
    setFormOpen(true);
  };

  const openEdit = (record: Trainer) => {
    setEditing(record);
    const matchedBranchId =
      record.branchId ||
      branchesData?.data.find((b) =>
        record.branchNames.some(
          (n) => n.toLowerCase() === b.name.toLowerCase(),
        ),
      )?.id;

    form.setFieldsValue({
      name: record.name,
      phone: record.phone,
      trainerType: record.trainerType ?? 'general_trainer',
      gender: record.gender ?? 'Male',
      branchId: matchedBranchId ? String(matchedBranchId) : undefined,
      specialization: record.description ?? record.specialization ?? '',
    });
    setFormOpen(true);
  };

  const onSubmit = async () => {
    const values = await form.validateFields();
    const branchObj = branchesData?.data.find(
      (b) => String(b.id) === String(values.branchId),
    );
    const branchName = branchObj ? shortBranch(branchObj.name) : undefined;
    const branchNames = branchName ? [branchName] : [];

    const payload: Omit<Trainer, 'id'> = {
      name: values.name as string,
      phone: values.phone as string,
      email: editing?.email ?? '',
      specialization:
        (values.description || values.specialization || 'Trainer') as string,
      branchId: values.branchId ? String(values.branchId) : '',
      branchName: branchName ?? editing?.branchName ?? 'Unassigned',
      branchNames: branchNames.length ? branchNames : editing?.branchNames ?? [],
      status: editing?.status ?? 'active',
      experienceYears: editing?.experienceYears ?? 0,
      avatar: editing?.avatar,
      gender: values.gender as string | undefined,
      trainerType: values.trainerType as TrainerType,
      description: (values.description || values.specialization) as string | undefined,
      roleId: 4,
      roleName: 'employee',
    };

    if (editing) await update.mutateAsync({ id: editing.id, payload });
    else await create.mutateAsync(payload);
    setFormOpen(false);
  };

  const allTrainerCount = Array.isArray(allTrainers) ? allTrainers.length : 0;
  if (loadingAll && allTrainerCount === 0) {
    return <PageSkeleton variant="list" />;
  }

  return (
    <div className="emp">
      <header className="emp__hero">
        <div>
          <p className="emp__kicker">Staff</p>
          <h1>Trainers</h1>
          <p className="emp__sub">{roleHint}</p>
        </div>
        <div className="emp__hero-actions">
          <div className="emp__hero-meta">
            <Dumbbell size={18} />
            <div>
              <strong>{stats.total}</strong>
              <span>trainers</span>
            </div>
          </div>
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
            Add Employee
          </Button>
        </div>
      </header>

      <section className="emp__stats" aria-label="Trainer stats">
        <article className="emp-stat">
          <span>Total staff</span>
          <strong>{isLoading ? '—' : stats.total}</strong>
        </article>
        <article className="emp-stat">
          <span>Branches covered</span>
          <strong>{isLoading ? '—' : stats.branches}</strong>
        </article>
      </section>

      <section className="emp__panel">
        <div className="emp__toolbar" style={{ flexWrap: 'wrap', gap: '0.75rem' }}>
          <Input
            allowClear
            size="large"
            prefix={<SearchOutlined />}
            placeholder="Search trainer, mobile, specialization…"
            value={params.search}
            onChange={(e) => setSearch(e.target.value)}
            className="emp__search"
            style={{ minWidth: 240 }}
          />
          <Select
            allowClear
            showSearch
            optionFilterProp="label"
            size="large"
            placeholder="Branch"
            className="emp__filter"
            value={params.branchId}
            onChange={setBranchId}
            options={branchesData?.data.map((b) => ({
              value: b.id,
              label: shortBranch(b.name),
            }))}
            style={{ width: 170 }}
          />
          <Select
            allowClear
            showSearch
            optionFilterProp="label"
            size="large"
            placeholder="Type"
            className="emp__filter"
            value={params.trainerType}
            onChange={setTrainerType}
            options={TRAINER_TYPE_OPTIONS}
            style={{ width: 200 }}
          />
          <Button
            size="large"
            icon={<FileExcelOutlined style={{ color: '#ff5000' }} />}
            onClick={openSummaryExport}
            style={{
              borderRadius: 10,
              fontWeight: 600,
              borderColor: 'rgba(22, 24, 31, 0.12)',
              color: '#16181f',
              background: '#ffffff',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
            }}
          >
            Export Summary
          </Button>
        </div>

        <Table<Trainer>
          rowKey="id"
          loading={isLoading}
          dataSource={data?.data}
          className="emp__table"
          onRow={(record) => ({
            onClick: () => setSelectedId(record.id),
            style: { cursor: 'pointer' },
          })}
          locale={{
            emptyText: <Empty description="No trainers match your filters" />,
          }}
          pagination={{
            current: data?.page,
            pageSize: data?.pageSize,
            total: data?.total,
            showSizeChanger: true,
            pageSizeOptions: PAGE_SIZE_OPTIONS.map(String),
            showTotal: (total) => `${total} trainers`,
            onChange: setPage,
          }}
          columns={[
            {
              title: 'Trainer',
              dataIndex: 'name',
              render: (_, record) => (
                <div className="emp-member">
                  {record.avatar ? (
                    <img src={record.avatar} alt="" className="emp-member__avatar" />
                  ) : (
                    <span className="emp-member__avatar emp-member__avatar--fallback">
                      {initials(record.name) || <UserOutlined />}
                    </span>
                  )}
                  <div>
                    <strong>{record.name}</strong>
                    <small>
                      {trainerTypeLabel(resolveTrainerType(record))}
                      {record.gender ? ` · ${record.gender}` : ''}
                    </small>
                  </div>
                </div>
              ),
            },
            {
              title: 'Type',
              dataIndex: 'trainerType',
              width: 150,
              render: (_, record) => {
                const type = resolveTrainerType(record);
                return (
                  <Tag
                    color={trainerTypeTagColor(type)}
                    style={{ borderRadius: 8, fontWeight: 600 }}
                  >
                    {trainerTypeLabel(type)}
                  </Tag>
                );
              },
            },
            {
              title: 'Mobile',
              dataIndex: 'phone',
              render: (phone: string) =>
                phone ? (
                  <a
                    className="emp-phone"
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
              title: 'Branches',
              dataIndex: 'branchNames',
              render: (names: string[], record) => (
                <span className="emp-branch">
                  <MapPin size={14} />
                  {(names?.length ? names : [record.branchName])
                    .filter(Boolean)
                    .map(shortBranch)
                    .join(', ') || 'Unassigned'}
                </span>
              ),
            },
            {
              title: 'Specialization',
              dataIndex: 'specialization',
              ellipsis: true,
              render: (v: string) => v || '—',
            },
            {
              title: 'Actions',
              key: 'actions',
              width: 150,
              render: (_, record) => (
                <div onClick={(e) => e.stopPropagation()} style={{ display: 'flex', gap: '0.2rem', alignItems: 'center' }}>
                  <Tooltip title="Export Trainer Report">
                    <Button
                      type="text"
                      icon={<FileExcelOutlined style={{ color: '#ff5000' }} />}
                      onClick={() => openDetailedExport(record)}
                      aria-label={`Export report for ${record.name}`}
                    />
                  </Tooltip>
                  <Tooltip title="View Session Details & Analytics">
                    <Button
                      type="text"
                      icon={<EyeOutlined style={{ color: '#ff5000' }} />}
                      onClick={() => setSelectedId(record.id)}
                      aria-label={`View ${record.name}`}
                    />
                  </Tooltip>
                  <Tooltip title="Edit Employee">
                    <Button
                      type="text"
                      icon={<EditOutlined />}
                      onClick={() => openEdit(record)}
                      aria-label={`Edit ${record.name}`}
                    />
                  </Tooltip>
                  <Tooltip title="Delete Employee">
                    <Button
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() =>
                        confirmDelete({
                          title: 'Delete employee?',
                          onOk: () => remove.mutateAsync(record.id),
                        })
                      }
                      aria-label={`Delete ${record.name}`}
                    />
                  </Tooltip>
                </div>
              ),
            },
          ]}
        />
      </section>

      {/* Trainer Analytics Sidebar Drawer */}
      <Drawer
        open={Boolean(selectedId)}
        onClose={() => setSelectedId(null)}
        width={580}
        destroyOnClose
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BarChart3 size={18} style={{ color: '#ff5000' }} />
            <span style={{ fontWeight: 700, fontSize: '1.05rem' }}>Employee Performance & Session Analytics</span>
          </div>
        }
        className="emp-drawer"
      >
        {loadingDetails && !details ? (
          <Skeleton active paragraph={{ rows: 12 }} />
        ) : (
          (() => {
            const trainer = details?.trainer ?? selectedListItem;
            if (!trainer) return <Empty description="Employee details not found" />;

            const summary = details?.summary ?? {
              totalSessionsTaken: 0,
              totalSessionsCompleted: 0,
              totalAmount: 0,
              totalCustomers: 0,
            };

            const customers = details?.customers ?? [];
            const completionRate = summary.totalSessionsTaken > 0
              ? Math.min(100, Math.round((summary.totalSessionsCompleted / summary.totalSessionsTaken) * 100))
              : 0;

            const maxCustomerAmount = Math.max(...customers.map((c) => c.totalAmount), 1);

            return (
              <div className="emp-detail">
                {/* Hero Header Card */}
                <div className="emp-detail__hero" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    {trainer.avatar ? (
                      <img src={trainer.avatar} alt={trainer.name} className="emp-detail__avatar" />
                    ) : (
                      <span className="emp-detail__avatar emp-detail__avatar--fallback">
                        {initials(trainer.name) || <UserOutlined />}
                      </span>
                    )}
                    <div className="emp-detail__hero-info">
                      <h3 className="emp-detail__name" style={{ margin: 0 }}>{trainer.name}</h3>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', alignItems: 'center', marginTop: 4 }}>
                        <StatusBadge status={trainer.status} />
                        <Tag color={trainerTypeTagColor(trainer.trainerType)} style={{ borderRadius: 8, fontWeight: 600 }}>
                          {trainerTypeLabel(trainer.trainerType)}
                        </Tag>
                        <Tag style={{ borderRadius: 8, fontWeight: 600 }}>ID #{trainer.id}</Tag>
                        {details?.isCheckin !== undefined && (
                          <Tag
                            color={details.isCheckin ? 'success' : 'default'}
                            style={{ borderRadius: 8, fontWeight: 600 }}
                          >
                            {details.isCheckin ? 'Checked In' : 'Checked Out'}
                          </Tag>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button
                    type="primary"
                    icon={<FileExcelOutlined />}
                    onClick={() => openDetailedExport(trainer)}
                    style={{
                      background: '#ff5000',
                      borderColor: '#ff5000',
                      borderRadius: 10,
                      fontWeight: 600,
                      boxShadow: '0 2px 8px rgba(255, 80, 0, 0.22)',
                    }}
                  >
                    Download Excel Report
                  </Button>
                </div>

                {/* Dark Analytics Graph Card */}
                <div className="emp-detail__graph-card">
                  <div className="emp-detail__graph-header">
                    <div className="emp-detail__graph-title">
                      <TrendingUp size={18} style={{ color: '#ff5000' }} />
                      <span>Session Completion & Performance Graph</span>
                    </div>
                    <Tag color="volcano" style={{ borderRadius: 8, fontWeight: 600 }}>
                      {summary.totalCustomers} Active Clients
                    </Tag>
                  </div>

                  <div className="emp-detail__graph-body">
                    {/* Circle Completion Graph */}
                    <div className="emp-detail__circle-wrapper">
                      <Progress
                        type="circle"
                        percent={completionRate}
                        width={76}
                        strokeColor={{ '0%': '#ff5000', '100%': '#f59e0b' }}
                        format={(percent) => (
                          <span style={{ color: '#ffffff', fontWeight: 800, fontSize: '0.9rem' }}>
                            {percent}%
                          </span>
                        )}
                      />
                      <span className="emp-detail__circle-label">Completion</span>
                    </div>

                    {/* Stats Grid */}
                    <div className="emp-detail__graph-stats" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                      <div className="emp-detail__graph-stat-item">
                        <span className="emp-detail__graph-stat-label">Total Revenue</span>
                        <span className="emp-detail__graph-stat-value" style={{ color: '#34d399' }}>
                          {formatCurrency(details?.totalPurchasedSessionAmount ?? summary.totalAmount)}
                        </span>
                      </div>
                      <div className="emp-detail__graph-stat-item">
                        <span className="emp-detail__graph-stat-label">My Earnings</span>
                        <span className="emp-detail__graph-stat-value" style={{ color: '#f59e0b' }}>
                          {details?.myEarnings != null ? formatCurrency(details.myEarnings) : '—'}
                        </span>
                      </div>
                      <div className="emp-detail__graph-stat-item">
                        <span className="emp-detail__graph-stat-label">Purchased Sessions</span>
                        <span className="emp-detail__graph-stat-value">
                          {details?.totalSessionsPurchasedQty ?? summary.totalSessionsTaken}
                        </span>
                      </div>
                      <div className="emp-detail__graph-stat-item">
                        <span className="emp-detail__graph-stat-label">Completed</span>
                        <span className="emp-detail__graph-stat-value" style={{ color: '#60a5fa' }}>
                          {summary.totalSessionsCompleted}
                        </span>
                      </div>
                      <div className="emp-detail__graph-stat-item">
                        <span className="emp-detail__graph-stat-label">Today's Sessions</span>
                        <span className="emp-detail__graph-stat-value" style={{ color: '#e879f9' }}>
                          {details?.todaySessionsTotal ?? 0}
                        </span>
                      </div>
                      <div className="emp-detail__graph-stat-item">
                        <span className="emp-detail__graph-stat-label">Total Clients</span>
                        <span className="emp-detail__graph-stat-value">{summary.totalCustomers}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Active / Started Sessions Section */}
                {details?.startedSession && details.startedSession.length > 0 && (
                  <div className="emp-detail__card" style={{ borderColor: 'rgba(255, 80, 0, 0.3)', background: '#fffcfb' }}>
                    <div className="emp-detail__card-title">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <PlayCircle size={18} style={{ color: '#ff5000' }} />
                        <span>Active Started Sessions</span>
                      </div>
                      <Tag color="processing" style={{ borderRadius: 8, fontWeight: 600 }}>
                        {details.startedSession.length} Active
                      </Tag>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                      {details.startedSession.map((s) => (
                        <div
                          key={s.checkinId}
                          style={{
                            padding: '0.75rem 0.85rem',
                            borderRadius: '14px',
                            background: '#ffffff',
                            border: '1px solid rgba(255, 80, 0, 0.15)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                            {s.customerImage ? (
                              <img src={s.customerImage} alt={s.customerName} className="emp-detail__chart-avatar" />
                            ) : (
                              <span className="emp-detail__chart-avatar emp-detail__chart-avatar--fallback">
                                {initials(s.customerName) || <UserOutlined />}
                              </span>
                            )}
                            <div>
                              <strong style={{ fontSize: '0.9rem', color: '#16181f', display: 'block' }}>
                                {s.customerName}
                              </strong>
                              <small style={{ color: '#6f7685', fontSize: '0.75rem' }}>
                                {s.sessionName} {s.branchName ? `· ${shortBranch(s.branchName)}` : ''}
                              </small>
                            </div>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <Tag color="green" style={{ borderRadius: 6, fontWeight: 600 }}>
                              Started
                            </Tag>
                            {s.slotStart && (
                              <div style={{ fontSize: '0.72rem', color: '#6f7685', marginTop: 2 }}>
                                <Clock size={11} style={{ display: 'inline', marginRight: 3, verticalAlign: 'middle' }} />
                                {formatDateTime(s.slotStart)}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Today's Booked Sessions Section */}
                {details?.todayBookings && details.todayBookings.length > 0 && (
                  <div className="emp-detail__card">
                    <div className="emp-detail__card-title">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Calendar size={18} style={{ color: '#3b82f6' }} />
                        <span>Today's Booked Sessions</span>
                      </div>
                      <Tag color="blue" style={{ borderRadius: 8, fontWeight: 600 }}>
                        {details.todayBookings.length} Booked
                      </Tag>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                      {details.todayBookings.map((b) => (
                        <div
                          key={b.bookingId}
                          style={{
                            padding: '0.75rem 0.85rem',
                            borderRadius: '14px',
                            background: '#f8fafc',
                            border: '1px solid rgba(22, 24, 31, 0.05)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                            {b.customerImage ? (
                              <img src={b.customerImage} alt={b.customerName} className="emp-detail__chart-avatar" />
                            ) : (
                              <span className="emp-detail__chart-avatar emp-detail__chart-avatar--fallback">
                                {initials(b.customerName) || <UserOutlined />}
                              </span>
                            )}
                            <div>
                              <strong style={{ fontSize: '0.9rem', color: '#16181f', display: 'block' }}>
                                {b.customerName}
                              </strong>
                              <small style={{ color: '#6f7685', fontSize: '0.75rem' }}>
                                {b.sessionName}
                              </small>
                            </div>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <Tag color="orange" style={{ borderRadius: 6, fontWeight: 600, textTransform: 'capitalize' }}>
                              {b.status}
                            </Tag>
                            {b.slotStart && (
                              <div style={{ fontSize: '0.72rem', color: '#6f7685', marginTop: 2 }}>
                                <Clock size={11} style={{ display: 'inline', marginRight: 3, verticalAlign: 'middle' }} />
                                {formatDate(b.slotStart, 'hh:mm A')}
                                {b.slotEnd ? ` - ${formatDate(b.slotEnd, 'hh:mm A')}` : ''}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Client Sessions & Revenue Breakdown Charts */}
                <div className="emp-detail__card">
                  <div className="emp-detail__card-title">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <UserCheck size={18} style={{ color: '#ff5000' }} />
                      <span>Client Breakdown & Usage Distribution Graph</span>
                    </div>
                    <Tag style={{ borderRadius: 8, fontWeight: 600 }}>
                      {customers.length} Client Records
                    </Tag>
                  </div>

                  {customers.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {customers.map((c) => {
                        const used = c.totalUsedSessions || 0;
                        const purchased = c.totalPurchasedSessions || 1;
                        const sessionPercent = Math.min(100, Math.round((used / purchased) * 100));
                        const revenuePercent = Math.min(100, Math.round((c.totalAmount / maxCustomerAmount) * 100));

                        return (
                          <div key={c.customerId} className="emp-detail__chart-item">
                            <div className="emp-detail__chart-head">
                              <div className="emp-detail__chart-user">
                                {c.image ? (
                                  <img src={c.image} alt={c.customerName} className="emp-detail__chart-avatar" />
                                ) : (
                                  <span className="emp-detail__chart-avatar emp-detail__chart-avatar--fallback">
                                    {initials(c.customerName) || <UserOutlined />}
                                  </span>
                                )}
                                <div>
                                  <strong style={{ fontSize: '0.92rem', color: '#16181f', display: 'block' }}>
                                    {c.customerName}
                                  </strong>
                                  {c.mobile && (
                                    <a
                                      href={`tel:${c.mobile}`}
                                      style={{ fontSize: '0.75rem', color: '#ff5000', textDecoration: 'none' }}
                                    >
                                      {c.mobile}
                                    </a>
                                  )}
                                </div>
                              </div>
                              <div style={{ textAlign: 'right' }}>
                                <strong style={{ fontSize: '0.95rem', color: '#16181f', display: 'block' }}>
                                  {formatCurrency(c.totalAmount)}
                                </strong>
                                <span style={{ fontSize: '0.72rem', color: '#6f7685' }}>
                                  {used}/{purchased} sessions used
                                </span>
                              </div>
                            </div>

                            {/* Session Progress Graph */}
                            <div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#6f7685', marginBottom: 2 }}>
                                <span>Session Completion Graph</span>
                                <span>{sessionPercent}%</span>
                              </div>
                              <Progress
                                percent={sessionPercent}
                                size="small"
                                strokeColor={{ '0%': '#ff5000', '100%': '#e04800' }}
                              />
                            </div>

                            {/* Revenue Share Visual Graph Bar */}
                            <div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#6f7685', marginBottom: 3 }}>
                                <span>Revenue Share Bar</span>
                                <span>{revenuePercent}% of top client</span>
                              </div>
                              <div className="emp-detail__revenue-bar-bg">
                                <div
                                  className="emp-detail__revenue-bar-fill"
                                  style={{ width: `${revenuePercent}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <Empty description="No client session totals recorded" image={Empty.PRESENTED_IMAGE_SIMPLE} />
                  )}
                </div>

                {/* Trainer Contact, Branch & Attendance Info Grid */}
                <div className="emp-detail__info-grid">
                  <div className="emp-detail__info-item">
                    <div className="emp-detail__info-icon"><Phone size={15} /></div>
                    <div>
                      <span style={{ fontSize: '0.68rem', textTransform: 'uppercase', color: '#6f7685', fontWeight: 600, display: 'block' }}>Mobile</span>
                      {trainer.phone ? (
                        <a href={`tel:${trainer.phone}`} style={{ color: '#ff5000', fontWeight: 600, fontSize: '0.88rem' }}>
                          {trainer.phone}
                        </a>
                      ) : (
                        <span style={{ fontWeight: 600 }}>—</span>
                      )}
                    </div>
                  </div>

                  <div className="emp-detail__info-item">
                    <div className="emp-detail__info-icon"><Mail size={15} /></div>
                    <div>
                      <span style={{ fontSize: '0.68rem', textTransform: 'uppercase', color: '#6f7685', fontWeight: 600, display: 'block' }}>Email</span>
                      <span style={{ fontWeight: 600, fontSize: '0.88rem' }}>{trainer.email || '—'}</span>
                    </div>
                  </div>

                  <div className="emp-detail__info-item">
                    <div className="emp-detail__info-icon"><MapPin size={15} /></div>
                    <div>
                      <span style={{ fontSize: '0.68rem', textTransform: 'uppercase', color: '#6f7685', fontWeight: 600, display: 'block' }}>Branches</span>
                      <span style={{ fontWeight: 600, fontSize: '0.88rem' }}>
                        {(trainer.branchNames.length ? trainer.branchNames : [trainer.branchName])
                          .filter(Boolean)
                          .map(shortBranch)
                          .join(', ') || 'Unassigned'}
                      </span>
                    </div>
                  </div>

                  <div className="emp-detail__info-item">
                    <div className="emp-detail__info-icon"><ShieldCheck size={15} /></div>
                    <div>
                      <span style={{ fontSize: '0.68rem', textTransform: 'uppercase', color: '#6f7685', fontWeight: 600, display: 'block' }}>Specialization</span>
                      <span style={{ fontWeight: 600, fontSize: '0.88rem' }}>
                        {trainer.description || trainer.specialization || 'Trainer'}
                      </span>
                    </div>
                  </div>

                  {details?.lastAttendance?.checkInTime && (
                    <div className="emp-detail__info-item" style={{ gridColumn: 'span 2' }}>
                      <div className="emp-detail__info-icon"><Clock size={15} /></div>
                      <div>
                        <span style={{ fontSize: '0.68rem', textTransform: 'uppercase', color: '#6f7685', fontWeight: 600, display: 'block' }}>Last Attendance Check-in</span>
                        <span style={{ fontWeight: 600, fontSize: '0.88rem' }}>
                          {formatDateTime(details.lastAttendance.checkInTime)}
                          {details.lastAttendance.checkOutTime
                            ? ` (Out: ${formatDateTime(details.lastAttendance.checkOutTime)})`
                            : ' (Active)'}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })()
        )}
      </Drawer>

      {/* Add / Edit Employee Form Modal */}
      <Drawer
        title={editing ? 'Edit employee' : 'Add employee'}
        open={formOpen}
        onClose={() => setFormOpen(false)}
        width={420}
        destroyOnClose
        extra={
          <Button
            type="primary"
            onClick={() => void onSubmit()}
            loading={create.isPending || update.isPending}
          >
            Save
          </Button>
        }
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="phone" label="Mobile" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="trainerType" label="Type" rules={[{ required: true }]}>
            <Select options={TRAINER_TYPE_OPTIONS} />
          </Form.Item>
          <Form.Item name="gender" label="Gender">
            <Select
              options={[
                { value: 'Male', label: 'Male' },
                { value: 'Female', label: 'Female' },
                { value: 'Other', label: 'Other' },
              ]}
            />
          </Form.Item>
          <Form.Item name="branchId" label="Branch">
            <Select
              allowClear
              options={branchesData?.data.map((b) => ({
                value: String(b.id),
                label: shortBranch(b.name),
              }))}
            />
          </Form.Item>
          <Form.Item name="specialization" label="Specialization">
            <Input />
          </Form.Item>
        </Form>
      </Drawer>

      {/* Export Report Date Selection Modal */}
      <Modal
        open={exportModalOpen}
        onCancel={() => !exporting && setExportModalOpen(false)}
        destroyOnClose
        centered
        width={500}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: '#fff0e8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ff5000',
            }}>
              <FileExcelOutlined style={{ fontSize: 20 }} />
            </div>
            <div>
              <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: '#16181f' }}>
                {exportType === 'summary' ? 'Export Trainer Summary Report' : `Export Report: ${exportTrainer?.name}`}
              </h4>
              <small style={{ color: '#6f7685', fontSize: '0.78rem' }}>
                {exportType === 'summary'
                  ? 'Download PT Trainers overview report as an Excel (.xlsx) file'
                  : 'Download 2-sheet performance & customer details report'}
              </small>
            </div>
          </div>
        }
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', paddingTop: '0.5rem' }}>
            <Button disabled={exporting} onClick={() => setExportModalOpen(false)}>
              Cancel
            </Button>
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              loading={exporting}
              onClick={handleExportDownload}
              style={{
                background: '#ff5000',
                borderColor: '#ff5000',
                fontWeight: 600,
                borderRadius: 10,
                boxShadow: '0 3px 10px rgba(255, 80, 0, 0.22)',
              }}
            >
              Download Excel (.xlsx)
            </Button>
          </div>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', paddingTop: '0.75rem' }}>
          {/* Context Card */}
          {exportType === 'detailed' && exportTrainer ? (
            <div style={{
              padding: '0.85rem 1rem',
              borderRadius: 14,
              background: '#f8fafc',
              border: '1px solid rgba(22, 24, 31, 0.08)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.85rem',
            }}>
              {exportTrainer.avatar ? (
                <img src={exportTrainer.avatar} alt="" style={{ width: 44, height: 44, borderRadius: 12, objectFit: 'cover' }} />
              ) : (
                <span style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: '#fff0e8',
                  color: '#ff5000',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                }}>
                  {initials(exportTrainer.name) || <UserOutlined />}
                </span>
              )}
              <div>
                <strong style={{ fontSize: '0.95rem', color: '#16181f', display: 'block' }}>
                  {exportTrainer.name}
                </strong>
                <div style={{ display: 'flex', gap: '0.4rem', marginTop: 2, alignItems: 'center' }}>
                  <Tag color={trainerTypeTagColor(exportTrainer.trainerType)} style={{ borderRadius: 6, fontWeight: 600, fontSize: '0.72rem' }}>
                    {trainerTypeLabel(exportTrainer.trainerType)}
                  </Tag>
                  {exportTrainer.phone && (
                    <span style={{ fontSize: '0.78rem', color: '#6f7685' }}>
                      <PhoneOutlined /> {exportTrainer.phone}
                    </span>
                  )}
                </div>
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
                  Please select a branch to generate the trainer summary report.
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
        </div>
      </Modal>
    </div>
  );
};
