import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import {
  Button,
  Checkbox,
  Drawer,
  Empty,
  Form,
  Input,
  InputNumber,
  Select,
} from 'antd';
import { Dumbbell, Layers, Percent, Tag } from 'lucide-react';
import { useMemo, useState } from 'react';
import { StatusBadge, PageSkeleton, confirmDelete } from '@/components/common';
import { useBranches } from '@/hooks/useBranches';
import {
  useSessionMutations,
  useSessions,
  useSessionsAll,
} from '@/hooks/useSessions';
import { useAuthStore } from '@/store/auth.store';
import { useTableParams } from '@/hooks/useTableParams';
import type { PtSession } from '@/types';
import { formatCurrency } from '@/utils/format';

const shortBranch = (name: string) =>
  name
    .replace(/^Game On Fitness\s*/i, '')
    .replace(/^(Premium Club|Luxury Club)\s*-?\s*/i, '')
    .trim() || name;

const featureChips = (features: string) =>
  features
    .split(/[,|•]/)
    .map((f) => f.trim())
    .filter(Boolean)
    .slice(0, 4);

export const SessionList = () => {
  const user = useAuthStore((s) => s.user);
  const { params, setSearch, setStatus, setBranchId, setPage } = useTableParams({
    pageSize: 12,
  });
  const { data: branchesData } = useBranches({ page: 1, pageSize: 200 });
  const { data: allSessions, isLoading: loadingAll } = useSessionsAll();
  const { data, isLoading } = useSessions(params);
  const { create, update, remove } = useSessionMutations();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<PtSession | null>(null);
  const [form] = Form.useForm();
  const partiallyAllow = Form.useWatch('partiallyAllow', form);

  const stats = useMemo(() => {
    const list = allSessions ?? [];
    const active = list.filter((s) => s.status === 'active').length;
    const partial = list.filter((s) => s.partiallyAllow).length;
    return { total: list.length, active, partial };
  }, [allSessions]);

  const roleHint =
    user?.role === 'Super Admin'
      ? 'PT packages across every club'
      : 'PT packages for your assigned branches';

  const openCreate = () => {
    setEditing(null);
    form.resetFields();
    form.setFieldsValue({
      status: 'active',
      qty: 1,
      price: 0,
      partiallyAllow: false,
      installmentAmount: undefined,
    });
    setOpen(true);
  };

  const openEdit = (record: PtSession) => {
    setEditing(record);
    form.setFieldsValue({
      name: record.name,
      branchId: record.branchId,
      sessionFeature: record.sessionFeature,
      qty: record.qty,
      price: record.price,
      partiallyAllow: record.partiallyAllow,
      installmentAmount: record.installmentAmount ?? undefined,
      status: record.status,
    });
    setOpen(true);
  };

  const onSubmit = async () => {
    const values = await form.validateFields();
    const branch = branchesData?.data.find((b) => b.id === values.branchId);
    const payload: Omit<PtSession, 'id'> = {
      name: values.name,
      branchId: values.branchId,
      branchName: branch?.name ?? editing?.branchName ?? '',
      sessionFeature: values.sessionFeature ?? '',
      qty: Number(values.qty),
      price: Number(values.price),
      partiallyAllow: Boolean(values.partiallyAllow),
      installmentAmount: values.partiallyAllow
        ? Number(values.installmentAmount)
        : null,
      status: values.status,
    };

    if (editing) await update.mutateAsync({ id: editing.id, payload });
    else await create.mutateAsync(payload);
    setOpen(false);
  };

  if (loadingAll && !allSessions?.length) {
    return <PageSkeleton variant="cards" />;
  }

  return (
    <div className="sess">
      <header className="sess__hero">
        <div>
          <p className="sess__kicker">Training</p>
          <h1>PT Packages</h1>
          <p className="sess__sub">{roleHint}</p>
        </div>
        <div className="sess__hero-actions">
          <div className="sess__hero-meta">
            <Dumbbell size={18} />
            <div>
              <strong>{stats.total}</strong>
              <span>packages</span>
            </div>
          </div>
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
            Add session
          </Button>
        </div>
      </header>

      <section className="sess__stats" aria-label="Session package stats">
        <article className="sess-stat">
          <span>Total packages</span>
          <strong>{loadingAll ? '—' : stats.total}</strong>
        </article>
        <article className="sess-stat">
          <span>Active</span>
          <strong>{loadingAll ? '—' : stats.active}</strong>
        </article>
        <article className="sess-stat">
          <span>Installment plans</span>
          <strong>{loadingAll ? '—' : stats.partial}</strong>
        </article>
      </section>

      <section className="sess__panel">
        <div className="sess__toolbar">
          <Input
            allowClear
            size="large"
            prefix={<SearchOutlined />}
            placeholder="Search package, features, branch…"
            value={params.search}
            onChange={(e) => setSearch(e.target.value)}
            className="sess__search"
          />
          <Select
            allowClear
            size="large"
            placeholder="Status"
            className="sess__filter"
            value={params.status}
            onChange={setStatus}
            options={[
              { value: 'active', label: 'Active' },
              { value: 'inactive', label: 'Inactive' },
            ]}
          />
          <Select
            allowClear
            showSearch
            optionFilterProp="label"
            size="large"
            placeholder="Branch"
            className="sess__filter sess__filter--wide"
            value={params.branchId}
            onChange={setBranchId}
            options={branchesData?.data.map((b) => ({
              value: b.id,
              label: shortBranch(b.name),
            }))}
          />
        </div>

        {isLoading && !data?.data?.length ? (
          <PageSkeleton variant="cards" />
        ) : !data?.data?.length ? (
          <Empty description="No session packages found" />
        ) : (
          <div className="sess__grid">
            {data.data.map((session) => {
              const chips = featureChips(session.sessionFeature);

              return (
                <article
                  key={session.id}
                  className={`sess-card${session.status === 'inactive' ? ' sess-card--inactive' : ''}`}
                >
                  <div
                    className={`sess-card__media${session.image ? '' : ' sess-card__media--empty'}`}
                    style={
                      session.image
                        ? { backgroundImage: `url(${session.image})` }
                        : undefined
                    }
                  >
                    {!session.image && (
                      <span className="sess-card__fallback" aria-hidden>
                        <Dumbbell size={34} strokeWidth={1.5} />
                      </span>
                    )}
                    <StatusBadge status={session.status} />
                    <div className="sess-card__price">
                      <strong>{formatCurrency(session.price)}</strong>
                    </div>
                  </div>

                  <div className="sess-card__body">
                    <div className="sess-card__title-row">
                      <h3>{session.name}</h3>
                      <em>{shortBranch(session.branchName)}</em>
                    </div>

                    {chips.length > 0 ? (
                      <div className="sess-card__features">
                        {chips.map((chip) => (
                          <span key={chip}>{chip}</span>
                        ))}
                      </div>
                    ) : (
                      <p className="sess-card__desc">No features listed</p>
                    )}

                    <div className="sess-card__metrics">
                      <div>
                        <Layers size={14} />
                        <span>
                          <strong>{session.qty}</strong> sessions
                        </span>
                      </div>
                      {session.partiallyAllow &&
                      session.installmentAmount != null ? (
                        <div className="sess-card__discount">
                          <Percent size={14} />
                          <span>
                            EMI{' '}
                            <strong>
                              {formatCurrency(session.installmentAmount)}
                            </strong>
                          </span>
                        </div>
                      ) : (
                        <div>
                          <Tag size={14} />
                          <span>Full price</span>
                        </div>
                      )}
                    </div>

                    <div className="sess-card__actions">
                      <Button
                        type="text"
                        icon={<EditOutlined />}
                        onClick={() => openEdit(session)}
                      >
                        Edit
                      </Button>
                      <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() =>
                          confirmDelete({
                            title: 'Delete session package?',
                            onOk: () => remove.mutateAsync(session.id),
                          })
                        }
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {data && data.total > (data.pageSize ?? 12) && (
          <div className="sess__pager">
            <button
              type="button"
              disabled={(data.page ?? 1) <= 1}
              onClick={() => setPage((data.page ?? 1) - 1)}
            >
              Previous
            </button>
            <span>
              Page {data.page} · {data.total} packages
            </span>
            <button
              type="button"
              disabled={
                (data.page ?? 1) * (data.pageSize ?? 12) >= (data.total ?? 0)
              }
              onClick={() => setPage((data.page ?? 1) + 1)}
            >
              Next
            </button>
          </div>
        )}
      </section>

      <Drawer
        title={editing ? 'Edit session package' : 'Add session package'}
        open={open}
        onClose={() => setOpen(false)}
        width={480}
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
          <Form.Item
            name="name"
            label="Session name"
            rules={[{ required: true, message: 'Enter session name' }]}
          >
            <Input placeholder="High Intensity Power" />
          </Form.Item>

          <Form.Item
            name="branchId"
            label="Branch"
            rules={[{ required: true, message: 'Select a branch' }]}
          >
            <Select
              showSearch
              optionFilterProp="label"
              placeholder="Select branch"
              options={branchesData?.data.map((b) => ({
                value: b.id,
                label: shortBranch(b.name),
              }))}
            />
          </Form.Item>

          <Form.Item
            name="sessionFeature"
            label="Session features"
            rules={[{ required: true, message: 'Enter session features' }]}
          >
            <Input.TextArea
              rows={3}
              placeholder="e.g. HIIT, Cardio, Strength"
            />
          </Form.Item>

          <Form.Item name="partiallyAllow" valuePropName="checked">
            <Checkbox
              onChange={(e) => {
                if (!e.target.checked) {
                  form.setFieldValue('installmentAmount', undefined);
                }
              }}
            >
              Partially allow
            </Checkbox>
          </Form.Item>

          <div className="sess-form-row">
            <Form.Item
              name="qty"
              label="Qty"
              rules={[{ required: true, message: 'Enter qty' }]}
              style={{ flex: 1, marginBottom: 0 }}
            >
              <InputNumber min={1} step={1} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item
              name="price"
              label="Price"
              rules={[{ required: true, message: 'Enter price' }]}
              style={{ flex: 1, marginBottom: 0 }}
            >
              <InputNumber min={0} precision={2} style={{ width: '100%' }} />
            </Form.Item>
          </div>

          {partiallyAllow ? (
            <Form.Item
              name="installmentAmount"
              label="Installment amount"
              rules={[
                { required: true, message: 'Enter installment amount' },
                {
                  type: 'number',
                  min: 0,
                  message: 'Installment amount must be zero or greater',
                },
              ]}
              style={{ marginTop: 24 }}
            >
              <InputNumber
                min={0}
                precision={2}
                style={{ width: '100%' }}
                placeholder="e.g. 500"
              />
            </Form.Item>
          ) : null}

          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true }]}
            style={{ marginTop: 24 }}
          >
            <Select
              options={[
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' },
              ]}
            />
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
};
