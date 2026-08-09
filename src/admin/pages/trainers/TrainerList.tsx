import {
  DeleteOutlined,
  EditOutlined,
  PhoneOutlined,
  PlusOutlined,
  SearchOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  Button,
  Drawer,
  Empty,
  Form,
  Input,
  Select,
  Skeleton,
  Table,
} from 'antd';
import { Dumbbell, MapPin, Users } from 'lucide-react';
import { useMemo, useState } from 'react';
import { StatusBadge, PageSkeleton, confirmDelete } from '@/components/common';
import { PAGE_SIZE_OPTIONS, TRAINER_TYPE_OPTIONS, trainerTypeLabel } from '@/constants';
import { useBranches } from '@/hooks/useBranches';
import {
  useTrainerDetails,
  useTrainerMutations,
  useTrainers,
  useTrainersAll,
} from '@/hooks/useTrainers';
import { useAuthStore } from '@/store/auth.store';
import { useTableParams } from '@/hooks/useTableParams';
import type { Trainer, TrainerType } from '@/types';
import { formatCurrency } from '@/utils/format';

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
  const { params, setSearch, setBranchId, setPage } = useTableParams({
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
  const { data: details, isLoading: loadingDetails } =
    useTrainerDetails(selectedId);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Trainer | null>(null);
  const [form] = Form.useForm();

  const stats = useMemo(() => {
    const list = allTrainers ?? [];
    const branches = new Set(
      list.flatMap((t) => t.branchNames).filter(Boolean),
    ).size;
    return { total: list.length, branches };
  }, [allTrainers]);

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
      branchesData?.data.find(
        (b) =>
          record.branchNames?.includes(b.name) || b.name === record.branchName,
      )?.id;
    form.setFieldsValue({
      name: record.name,
      phone: record.phone,
      gender: record.gender,
      trainerType: record.trainerType,
      specialization: record.description || record.specialization,
      branchId: matchedBranchId || undefined,
    });
    setFormOpen(true);
  };

  const onSubmit = async () => {
    const values = await form.validateFields();
    const branch = branchesData?.data.find((b) => b.id === values.branchId);
    const payload = {
      name: values.name as string,
      email: '',
      phone: values.phone as string,
      specialization: (values.specialization || values.description || 'Trainer') as string,
      branchId: (values.branchId as string) || '',
      branchName: branch?.name ?? '',
      branchNames: branch?.name ? [branch.name] : [],
      status: 'active' as const,
      experienceYears: 0,
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

  if (loadingAll && !allTrainers?.length) {
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
              <span>employees</span>
            </div>
          </div>
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
            Add employee
          </Button>
        </div>
      </header>

      <section className="emp__stats" aria-label="Employee stats">
        <article className="emp-stat">
          <span>Total staff</span>
          <strong>{loadingAll ? '—' : stats.total}</strong>
        </article>
        <article className="emp-stat">
          <span>Branches covered</span>
          <strong>{loadingAll ? '—' : stats.branches}</strong>
        </article>
        <article className="emp-stat">
          <span>Showing</span>
          <strong>{data?.total ?? 0}</strong>
        </article>
      </section>

      <section className="emp__panel">
        <div className="emp__toolbar">
          <Input
            allowClear
            size="large"
            prefix={<SearchOutlined />}
            placeholder="Search name, mobile, role, branch…"
            value={params.search}
            onChange={(e) => setSearch(e.target.value)}
            className="emp__search"
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
          />
        </div>

        {isLoading && !data?.data?.length ? (
          <PageSkeleton variant="list" />
        ) : (
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
              emptyText: <Empty description="No employees match your filters" />,
            }}
            pagination={{
              current: data?.page,
              pageSize: data?.pageSize,
              total: data?.total,
              showSizeChanger: true,
              pageSizeOptions: PAGE_SIZE_OPTIONS.map(String),
              showTotal: (total) => `${total} employees`,
              onChange: setPage,
            }}
            columns={[
              {
                title: 'Employee',
                dataIndex: 'name',
                render: (_, record) => (
                  <div className="emp-member">
                    {record.avatar ? (
                      <img
                        src={record.avatar}
                        alt=""
                        className="emp-member__avatar"
                      />
                    ) : (
                      <span className="emp-member__avatar emp-member__avatar--fallback">
                        {initials(record.name) || <UserOutlined />}
                      </span>
                    )}
                    <div>
                      <strong>{record.name}</strong>
                      <small>
                        {trainerTypeLabel(record.trainerType)}
                        {record.gender ? ` · ${record.gender}` : ''}
                      </small>
                    </div>
                  </div>
                ),
              },
              {
                title: 'Type',
                dataIndex: 'trainerType',
                width: 140,
                render: (type: Trainer['trainerType']) =>
                  trainerTypeLabel(type),
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
                title: 'About',
                dataIndex: 'specialization',
                ellipsis: true,
                render: (v: string) => v || '—',
              },
              {
                title: '',
                key: 'actions',
                width: 96,
                render: (_, record) => (
                  <div onClick={(e) => e.stopPropagation()}>
                    <Button
                      type="text"
                      icon={<EditOutlined />}
                      onClick={() => openEdit(record)}
                    />
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
                    />
                  </div>
                ),
              },
            ]}
          />
        )}
      </section>

      <Drawer
        open={Boolean(selectedId)}
        onClose={() => setSelectedId(null)}
        width={480}
        destroyOnHidden
        title="Employee details"
        className="emp-drawer"
      >
        {loadingDetails && !details ? (
          <Skeleton active paragraph={{ rows: 10 }} />
        ) : (
          (() => {
            const trainer = details?.trainer ?? selectedListItem;
            if (!trainer) return <Empty description="Employee not found" />;

            return (
              <div className="emp-detail">
                <div className="emp-detail__head">
                  {trainer.avatar ? (
                    <img src={trainer.avatar} alt="" />
                  ) : (
                    <span className="emp-detail__fallback" aria-hidden>
                      <Users size={28} strokeWidth={1.5} />
                    </span>
                  )}
                  <div>
                    <h3>{trainer.name}</h3>
                    <StatusBadge status={trainer.status} />
                    <p>{trainerTypeLabel(trainer.trainerType)}</p>
                  </div>
                </div>

                <dl className="emp-detail__grid">
                  <div>
                    <dt>Type</dt>
                    <dd>{trainerTypeLabel(trainer.trainerType)}</dd>
                  </div>
                  <div>
                    <dt>Mobile</dt>
                    <dd>{trainer.phone || '—'}</dd>
                  </div>
                  <div>
                    <dt>Gender</dt>
                    <dd>{trainer.gender || '—'}</dd>
                  </div>
                  <div className="emp-detail__full">
                    <dt>Branches</dt>
                    <dd>
                      {(trainer.branchNames.length
                        ? trainer.branchNames
                        : [trainer.branchName]
                      )
                        .filter(Boolean)
                        .map(shortBranch)
                        .join(', ') || '—'}
                    </dd>
                  </div>
                  <div className="emp-detail__full">
                    <dt>Description</dt>
                    <dd>{trainer.description || trainer.specialization || '—'}</dd>
                  </div>
                </dl>

                {details?.summary && (
                  <div className="emp-detail__counts">
                    <article>
                      <strong>{details.summary.totalCustomers}</strong>
                      <span>Clients</span>
                    </article>
                    <article>
                      <strong>{details.summary.totalSessionsTaken}</strong>
                      <span>Sessions</span>
                    </article>
                    <article>
                      <strong>{details.summary.totalSessionsCompleted}</strong>
                      <span>Completed</span>
                    </article>
                    <article>
                      <strong>
                        {formatCurrency(details.summary.totalAmount)}
                      </strong>
                      <span>Revenue</span>
                    </article>
                  </div>
                )}

                {details?.customers?.length ? (
                  <div className="emp-detail__clients">
                    <h4>Client totals</h4>
                    <ul>
                      {details.customers.map((c) => (
                        <li key={c.customerId}>
                          <div className="emp-member">
                            {c.image ? (
                              <img
                                src={c.image}
                                alt=""
                                className="emp-member__avatar"
                              />
                            ) : (
                              <span className="emp-member__avatar emp-member__avatar--fallback">
                                {initials(c.customerName)}
                              </span>
                            )}
                            <div>
                              <strong>{c.customerName}</strong>
                              <small>
                                {c.totalUsedSessions}/{c.totalPurchasedSessions}{' '}
                                sessions · {formatCurrency(c.totalAmount)}
                              </small>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            );
          })()
        )}
      </Drawer>

      <Drawer
        title={editing ? 'Edit employee' : 'Add employee'}
        open={formOpen}
        onClose={() => setFormOpen(false)}
        width={420}
        destroyOnHidden
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
          <Form.Item
            name="trainerType"
            label="Trainer type"
            rules={[{ required: true, message: 'Select trainer type' }]}
          >
            <Select
              placeholder="Select type"
              options={TRAINER_TYPE_OPTIONS}
            />
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
                value: b.id,
                label: shortBranch(b.name),
              }))}
            />
          </Form.Item>
          <Form.Item name="specialization" label="Description / specialization">
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
};
