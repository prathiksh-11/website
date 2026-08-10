import {
  CheckOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import {
  Button,
  Drawer,
  Empty,
  Form,
  Input,
  InputNumber,
  Select,
} from 'antd';
import { useMemo, useState } from 'react';
import { PageSkeleton, confirmDelete } from '@/components/common';
import { useBranches } from '@/hooks/useBranches';
import {
  useSubscriptionMutations,
  useSubscriptions,
  useSubscriptionsAll,
} from '@/hooks/useSubscriptions';
import { useAuthStore } from '@/store/auth.store';
import { useTableParams } from '@/hooks/useTableParams';
import type { Subscription } from '@/types';
import { formatCurrency } from '@/utils/format';

const shortBranch = (name: string) =>
  name
    .replace(/^Game On Fitness\s*/i, '')
    .replace(/^(Premium Club|Luxury Club)\s*-?\s*/i, '')
    .trim() || name;

const GST_TYPE_OPTIONS = [
  { value: 'exclusive', label: 'GST Exclusive' },
  { value: 'inclusive', label: 'GST Inclusive' },
];

const GST_PERCENTAGE_OPTIONS = [
  { value: 0, label: '0%' },
  { value: 5, label: '5%' },
  { value: 12, label: '12%' },
  { value: 18, label: '18%' },
];

const CYCLE_OPTIONS = [
  { value: 'Monthly', label: 'Monthly' },
  { value: 'Quarterly', label: 'Quarterly' },
  { value: 'Yearly', label: 'Yearly' },
];

const gstLabel = (type: string, percentage: number) => {
  const pct = Number.isFinite(percentage) ? percentage : 0;
  if (type === 'inclusive') return `${pct}% GST included`;
  return `${pct}% GST extra`;
};

const cycleSuffix = (cycle: string) => {
  const raw = cycle.toLowerCase();
  if (raw.includes('year')) return 'Year';
  if (raw.includes('quarter')) return 'Quarter';
  return 'Month';
};

export const SubscriptionList = () => {
  const user = useAuthStore((s) => s.user);
  const { params, setSearch, setStatus, setBranchId, setPage } = useTableParams({
    pageSize: 12,
  });
  const { data: branchesData } = useBranches({ page: 1, pageSize: 200 });
  const { data: allPlans, isLoading: loadingAll } = useSubscriptionsAll();
  const { data, isLoading } = useSubscriptions(params);
  const { create, update, remove } = useSubscriptionMutations();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Subscription | null>(null);
  const [form] = Form.useForm();

  const roleHint =
    user?.role === 'Super Admin'
      ? 'Membership plans for every club and member stage.'
      : 'Membership plans for your assigned branches.';

  const durationTabs = useMemo(
    () => [
      { value: undefined as string | undefined, label: 'All' },
      ...CYCLE_OPTIONS,
    ],
    [],
  );

  const openCreate = () => {
    setEditing(null);
    form.resetFields();
    form.setFieldsValue({
      price: 0,
      gstType: 'exclusive',
      gstPercentage: 5,
      cycle: 'Monthly',
      features: [],
    });
    setOpen(true);
  };

  const openEdit = (record: Subscription) => {
    setEditing(record);
    form.setFieldsValue({
      planName: record.planName,
      price: record.price,
      gstType: record.gstType,
      gstPercentage: record.gstPercentage,
      cycle: record.cycle,
      branchId: record.branchId,
      features: record.features,
    });
    setOpen(true);
  };

  const onSubmit = async () => {
    const values = await form.validateFields();
    const branch = branchesData?.data.find((b) => b.id === values.branchId);
    const payload: Omit<Subscription, 'id'> = {
      planName: values.planName,
      price: Number(values.price),
      gstType: values.gstType,
      gstPercentage: Number(values.gstPercentage),
      cycle: values.cycle,
      branchId: values.branchId,
      branchName: branch?.name ?? editing?.branchName ?? '',
      features: Array.isArray(values.features)
        ? values.features.map((f: string) => String(f).trim()).filter(Boolean)
        : [],
    };

    if (editing) await update.mutateAsync({ id: editing.id, payload });
    else await create.mutateAsync(payload);
    setOpen(false);
  };

  if (loadingAll && !allPlans?.length) {
    return <PageSkeleton variant="cards" />;
  }

  return (
    <div className="plan">
      <header className="plan__hero">
        <div className="plan__hero-copy">
          <h1>Plans for every stage of your member journey</h1>
          <p>{roleHint}</p>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
          Add subscription
        </Button>
      </header>

      <div className="plan__controls">
        <Input
          allowClear
          size="large"
          prefix={<SearchOutlined />}
          placeholder="Search plan, branch…"
          value={params.search}
          onChange={(e) => setSearch(e.target.value)}
          className="plan__search"
        />
        <Select
          allowClear
          showSearch
          optionFilterProp="label"
          size="large"
          placeholder="Branch"
          className="plan__branch"
          value={params.branchId}
          onChange={setBranchId}
          options={branchesData?.data.map((b) => ({
            value: b.id,
            label: shortBranch(b.name),
          }))}
        />
        <div className="plan__toggle" role="tablist" aria-label="Plan duration">
          {durationTabs.map((tab) => {
            const active = (params.status ?? undefined) === tab.value;
            return (
              <button
                key={tab.label}
                type="button"
                role="tab"
                aria-selected={active}
                className={`plan__toggle-btn${active ? ' is-active' : ''}`}
                onClick={() => setStatus(tab.value)}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {isLoading && !data?.data?.length ? (
        <PageSkeleton variant="cards" />
      ) : !data?.data?.length ? (
        <Empty
          description={
            loadingAll ? 'Loading plans…' : 'No subscription plans found'
          }
        />
      ) : (
        <div className="plan__grid">
          {data.data.map((plan, index) => (
            <article
              key={plan.id}
              className={`plan-card${index === 0 ? ' plan-card--featured' : ''}`}
            >
              <div className="plan-card__top">
                <h3>{plan.planName}</h3>
                <p className="plan-card__label">
                  {plan.cycle} plan · {shortBranch(plan.branchName)}
                </p>
              </div>

              <div className="plan-card__price">
                <strong>{formatCurrency(plan.price)}</strong>
                <span>/ {cycleSuffix(plan.cycle)}</span>
              </div>

              <p className="plan-card__gst">
                {gstLabel(plan.gstType, plan.gstPercentage)}
              </p>

              <div className="plan-card__features">
                <p>Plan features:</p>
                <ul>
                  {(plan.features.length
                    ? plan.features
                    : ['No features listed']
                  ).map((feature) => (
                    <li key={feature}>
                      <i aria-hidden>
                        <CheckOutlined />
                      </i>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="plan-card__actions">
                <Button
                  type={index === 0 ? 'primary' : 'default'}
                  block
                  icon={<EditOutlined />}
                  onClick={() => openEdit(plan)}
                >
                  Edit plan
                </Button>
                <Button
                  type="text"
                  danger
                  block
                  icon={<DeleteOutlined />}
                  onClick={() =>
                    confirmDelete({
                      title: 'Delete subscription plan?',
                      onOk: () => remove.mutateAsync(plan.id),
                    })
                  }
                >
                  Delete
                </Button>
              </div>
            </article>
          ))}
        </div>
      )}

      {data && data.total > (data.pageSize ?? 12) && (
        <div className="plan__pager">
          <button
            type="button"
            disabled={(data.page ?? 1) <= 1}
            onClick={() => setPage((data.page ?? 1) - 1)}
          >
            Previous
          </button>
          <span>
            Page {data.page} · {data.total} plans
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

      <Drawer
        title={editing ? 'Edit subscription plan' : 'Add subscription plan'}
        open={open}
        onClose={() => setOpen(false)}
        width={500}
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
            name="planName"
            label="Plan name"
            rules={[{ required: true, message: 'Enter plan name' }]}
          >
            <Input placeholder="Elite Performance" />
          </Form.Item>

          <Form.Item
            name="price"
            label="Price"
            rules={[{ required: true, message: 'Enter price' }]}
          >
            <InputNumber min={0} precision={2} style={{ width: '100%' }} />
          </Form.Item>

          <div className="sess-form-row">
            <Form.Item
              name="gstType"
              label="GST type"
              rules={[{ required: true, message: 'Select GST type' }]}
              style={{ flex: 1, marginBottom: 0 }}
            >
              <Select options={GST_TYPE_OPTIONS} />
            </Form.Item>
            <Form.Item
              name="gstPercentage"
              label="GST percentage"
              rules={[{ required: true, message: 'Select GST percentage' }]}
              style={{ flex: 1, marginBottom: 0 }}
            >
              <Select options={GST_PERCENTAGE_OPTIONS} />
            </Form.Item>
          </div>

          <Form.Item
            name="cycle"
            label="Plan duration"
            rules={[{ required: true, message: 'Select plan duration' }]}
            style={{ marginTop: 24 }}
          >
            <Select options={CYCLE_OPTIONS} />
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
            name="features"
            label="Plan features"
            rules={[
              {
                validator: async (_, value) => {
                  if (!Array.isArray(value) || value.length === 0) {
                    throw new Error('Add at least one feature');
                  }
                },
              },
            ]}
            extra="Type a feature and press Enter"
          >
            <Select
              mode="tags"
              tokenSeparators={[',']}
              placeholder="Gym access, Locker, ..."
              open={false}
            />
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
};
