import {
  CalendarOutlined,
  DeleteOutlined,
  EditOutlined,
  EnvironmentOutlined,
  PlusOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import {
  Button,
  DatePicker,
  Drawer,
  Empty,
  Form,
  Input,
  InputNumber,
  Select,
  Skeleton,
  TimePicker,
  Upload,
} from 'antd';
import dayjs from 'dayjs';
import { CalendarDays, Ticket, Users } from 'lucide-react';
import { useMemo, useState } from 'react';
import { StatusBadge, confirmDelete } from '@/components/common';
import { useBranches } from '@/hooks/useBranches';
import {
  useEventMutations,
  useEvents,
  useEventsAll,
} from '@/hooks/useEvents';
import { useAuthStore } from '@/store/auth.store';
import { useTableParams } from '@/hooks/useTableParams';
import type { GymEvent } from '@/types';
import { formatCurrency, formatDate } from '@/utils/format';

const shortBranch = (name: string) =>
  name
    .replace(/^Game On Fitness\s*/i, '')
    .replace(/^(Premium Club|Luxury Club)\s*-?\s*/i, '')
    .trim() || name;

const readFileAsDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

export const EventList = () => {
  const user = useAuthStore((s) => s.user);
  const { params, setSearch, setStatus, setBranchId, setPage } = useTableParams({
    pageSize: 12,
  });
  const { data: branchesData } = useBranches({ page: 1, pageSize: 200 });
  const branchNameById = useMemo(() => {
    const map: Record<string, string> = {};
    for (const b of branchesData?.data ?? []) map[b.id] = b.name;
    return map;
  }, [branchesData?.data]);

  const { data: allEvents, isLoading: loadingAll } = useEventsAll();
  const { data, isLoading } = useEvents(params, branchNameById);
  const { create, update, remove } = useEventMutations();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<GymEvent | null>(null);
  const [imagePreview, setImagePreview] = useState<string | undefined>();
  const [form] = Form.useForm();

  const stats = useMemo(() => {
    const list = allEvents ?? [];
    const upcoming = list.filter((e) => e.status === 'active').length;
    const filled = list.reduce((s, e) => s + (e.registeredCount || 0), 0);
    return { total: list.length, upcoming, filled };
  }, [allEvents]);

  const roleHint =
    user?.role === 'Super Admin'
      ? 'Special events across every club'
      : 'Events for your assigned branches';

  const openCreate = () => {
    setEditing(null);
    setImagePreview(undefined);
    form.resetFields();
    const startDay = dayjs().add(1, 'day');
    form.setFieldsValue({
      startAt: startDay,
      endAt: startDay,
      startTime: dayjs().hour(7).minute(0),
      endTime: dayjs().hour(9).minute(0),
      capacity: 30,
      price: 0,
    });
    setOpen(true);
  };

  const openEdit = (record: GymEvent) => {
    setEditing(record);
    setImagePreview(record.image);
    form.setFieldsValue({
      title: record.title,
      description: record.description,
      location: record.location,
      branchIds: record.branchIds.length
        ? record.branchIds
        : record.branchId
          ? [record.branchId]
          : [],
      startAt: record.startAt ? dayjs(record.startAt) : undefined,
      endAt: record.endAt ? dayjs(record.endAt) : undefined,
      startTime: record.startTime
        ? dayjs(record.startTime, 'HH:mm')
        : undefined,
      endTime: record.endTime
        ? dayjs(record.endTime, 'HH:mm')
        : undefined,
      capacity: record.capacity,
      price: record.price ?? 0,
      offerPrice: record.offerPrice,
    });
    setOpen(true);
  };

  const onSubmit = async () => {
    const values = await form.validateFields();
    const branchIds = (values.branchIds as string[]) ?? [];
    const names = branchIds
      .map((id) => branchNameById[id])
      .filter(Boolean) as string[];

    const payload: Omit<GymEvent, 'id'> = {
      title: values.title,
      description: values.description ?? '',
      location: values.location,
      branchId: branchIds[0] ?? '',
      branchIds,
      branchName: names[0] ?? '',
      branchNames: names,
      startAt: values.startAt.format('YYYY-MM-DD'),
      endAt: values.endAt.format('YYYY-MM-DD'),
      startTime: values.startTime.format('HH:mm'),
      endTime: values.endTime.format('HH:mm'),
      capacity: Number(values.capacity ?? 0),
      registeredCount: editing?.registeredCount ?? 0,
      status: 'active',
      type: 'Event',
      price: Number(values.price ?? 0),
      offerPrice:
        values.offerPrice != null ? Number(values.offerPrice) : undefined,
      // Only send a new base64 upload; keep existing server path untouched on edit
      image: imagePreview?.startsWith('data:') ? imagePreview : undefined,
    };

    if (editing) await update.mutateAsync({ id: editing.id, payload });
    else await create.mutateAsync(payload);
    setOpen(false);
  };

  return (
    <div className="evt">
      <header className="evt__hero">
        <div>
          <p className="evt__kicker">Community</p>
          <h1>Events</h1>
          <p className="evt__sub">{roleHint}</p>
        </div>
        <div className="evt__hero-actions">
          <div className="evt__hero-meta">
            <CalendarDays size={18} />
            <div>
              <strong>{stats.total}</strong>
              <span>events</span>
            </div>
          </div>
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
            Add event
          </Button>
        </div>
      </header>

      <section className="evt__stats" aria-label="Event stats">
        <article className="evt-stat">
          <span>Total events</span>
          <strong>{loadingAll ? '—' : stats.total}</strong>
        </article>
        <article className="evt-stat">
          <span>Upcoming / active</span>
          <strong>{loadingAll ? '—' : stats.upcoming}</strong>
        </article>
        <article className="evt-stat">
          <span>Slots booked</span>
          <strong>{loadingAll ? '—' : stats.filled}</strong>
        </article>
      </section>

      <section className="evt__panel">
        <div className="evt__toolbar">
          <Input
            allowClear
            size="large"
            prefix={<SearchOutlined />}
            placeholder="Search title, branch, location…"
            value={params.search}
            onChange={(e) => setSearch(e.target.value)}
            className="evt__search"
          />
          <Select
            allowClear
            size="large"
            placeholder="Status"
            className="evt__filter"
            value={params.status}
            onChange={setStatus}
            options={[
              { value: 'active', label: 'Upcoming' },
              { value: 'expired', label: 'Past' },
              { value: 'pending', label: 'Pending' },
            ]}
          />
          <Select
            allowClear
            showSearch
            optionFilterProp="label"
            size="large"
            placeholder="Branch"
            className="evt__filter evt__filter--wide"
            value={params.branchId}
            onChange={setBranchId}
            options={branchesData?.data.map((b) => ({
              value: b.id,
              label: shortBranch(b.name),
            }))}
          />
        </div>

        {isLoading && !data?.data?.length ? (
          <div className="evt__grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton.Node
                key={i}
                active
                style={{ width: '100%', height: 300 }}
              />
            ))}
          </div>
        ) : !data?.data?.length ? (
          <Empty description="No events found" />
        ) : (
          <div className="evt__grid">
            {data.data.map((event) => {
              const remaining = Math.max(
                0,
                event.capacity - event.registeredCount,
              );
              const fill =
                event.capacity > 0
                  ? Math.min(
                      100,
                      Math.round(
                        (event.registeredCount / event.capacity) * 100,
                      ),
                    )
                  : 0;

              return (
                <article key={event.id} className="evt-card">
                  <div
                    className={`evt-card__media${event.image ? '' : ' evt-card__media--empty'}`}
                    style={
                      event.image
                        ? { backgroundImage: `url("${event.image}")` }
                        : undefined
                    }
                  >
                    {!event.image && (
                      <span className="evt-card__fallback" aria-hidden>
                        <Ticket size={34} strokeWidth={1.5} />
                      </span>
                    )}
                    <StatusBadge status={event.status} />
                    {(event.offerPrice != null || event.price != null) && (
                      <div className="evt-card__price">
                        {event.offerPrice != null &&
                        event.price != null &&
                        event.offerPrice < event.price ? (
                          <>
                            <s>{formatCurrency(event.price)}</s>
                            <strong>{formatCurrency(event.offerPrice)}</strong>
                          </>
                        ) : (
                          <strong>
                            {formatCurrency(event.offerPrice ?? event.price ?? 0)}
                          </strong>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="evt-card__body">
                    <h3>{event.title}</h3>
                    <p className="evt-card__desc">
                      {event.description || 'No description'}
                    </p>

                    <div className="evt-card__meta">
                      <span>
                        <CalendarOutlined />
                        {formatDate(event.startAt)}
                        {event.endAt && event.endAt !== event.startAt
                          ? ` – ${formatDate(event.endAt)}`
                          : ''}
                        {event.startTime
                          ? ` · ${event.startTime}${event.endTime ? `–${event.endTime}` : ''}`
                          : ''}
                      </span>
                      {event.location && (
                        <span>
                          <EnvironmentOutlined />
                          {event.location}
                        </span>
                      )}
                    </div>

                    <div className="evt-card__branches">
                      {(event.branchNames.length
                        ? event.branchNames
                        : [event.branchName]
                      )
                        .filter(Boolean)
                        .map((name) => (
                          <em key={name}>{shortBranch(name)}</em>
                        ))}
                    </div>

                    <div className="evt-card__slots">
                      <div>
                        <Users size={14} />
                        <span>
                          {event.registeredCount}/{event.capacity} booked
                        </span>
                      </div>
                      <strong>{remaining} left</strong>
                    </div>
                    <div className="evt-card__bar">
                      <i style={{ width: `${fill}%` }} />
                    </div>

                    <div className="evt-card__actions">
                      <Button
                        type="text"
                        icon={<EditOutlined />}
                        onClick={() => openEdit(event)}
                      >
                        Edit
                      </Button>
                      <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() =>
                          confirmDelete({
                            title: 'Delete event?',
                            onOk: () => remove.mutateAsync(event.id),
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
          <div className="evt__pager">
            <button
              type="button"
              disabled={(data.page ?? 1) <= 1}
              onClick={() => setPage((data.page ?? 1) - 1)}
            >
              Previous
            </button>
            <span>
              Page {data.page} · {data.total} events
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
        title={editing ? 'Edit event' : 'Add event'}
        open={open}
        onClose={() => setOpen(false)}
        width={460}
        destroyOnHidden
        className="evt-drawer"
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
          <Form.Item label="Cover image">
            <div className="evt-upload">
              {imagePreview ? (
                <img src={imagePreview} alt="" />
              ) : (
                <span className="evt-upload__empty">
                  <Ticket size={28} strokeWidth={1.5} />
                </span>
              )}
              <Upload
                accept="image/*"
                showUploadList={false}
                beforeUpload={async (file) => {
                  const dataUrl = await readFileAsDataUrl(file);
                  setImagePreview(dataUrl);
                  return false;
                }}
              >
                <Button>Upload image</Button>
              </Upload>
            </div>
          </Form.Item>

          <Form.Item
            name="title"
            label="Event name"
            rules={[{ required: true, message: 'Name is required' }]}
          >
            <Input placeholder="e.g. Summer Bootcamp" />
          </Form.Item>

          <Form.Item name="description" label="Description">
            <Input.TextArea rows={3} placeholder="What members should know…" />
          </Form.Item>

          <Form.Item
            name="branchIds"
            label="Branches"
            rules={[{ required: true, message: 'Select at least one branch' }]}
          >
            <Select
              mode="multiple"
              optionFilterProp="label"
              placeholder="Select branches"
              options={branchesData?.data.map((b) => ({
                value: b.id,
                label: shortBranch(b.name),
              }))}
            />
          </Form.Item>

          <Form.Item name="location" label="Location / venue">
            <Input placeholder="Studio floor, outdoor turf…" />
          </Form.Item>

          <div className="evt-form-row">
            <Form.Item
              name="startAt"
              label="Start date"
              rules={[{ required: true, message: 'Start date is required' }]}
              style={{ flex: 1 }}
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item
              name="endAt"
              label="End date"
              dependencies={['startAt']}
              rules={[
                { required: true, message: 'End date is required' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    const start = getFieldValue('startAt');
                    if (!value || !start || !value.isBefore(start, 'day')) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error('End date must be on or after start date'),
                    );
                  },
                }),
              ]}
              style={{ flex: 1 }}
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          </div>

          <div className="evt-form-row">
            <Form.Item
              name="startTime"
              label="Start time"
              rules={[{ required: true, message: 'Start time is required' }]}
              style={{ flex: 1 }}
            >
              <TimePicker format="HH:mm" style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item
              name="endTime"
              label="End time"
              dependencies={['startAt', 'endAt', 'startTime']}
              rules={[
                { required: true, message: 'End time is required' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    const startAt = getFieldValue('startAt');
                    const endAt = getFieldValue('endAt');
                    const startTime = getFieldValue('startTime');
                    if (
                      !value ||
                      !startTime ||
                      !startAt ||
                      !endAt ||
                      !endAt.isSame(startAt, 'day') ||
                      !value.isBefore(startTime)
                    ) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error('End time must be after start time'),
                    );
                  },
                }),
              ]}
              style={{ flex: 1 }}
            >
              <TimePicker format="HH:mm" style={{ width: '100%' }} />
            </Form.Item>
          </div>

          <div className="evt-form-row">
            <Form.Item
              name="capacity"
              label="Slot limit"
              rules={[{ required: true }]}
              style={{ flex: 1 }}
            >
              <InputNumber min={1} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="price" label="Price" style={{ flex: 1 }}>
              <InputNumber min={0} style={{ width: '100%' }} prefix="₹" />
            </Form.Item>
          </div>

          <Form.Item name="offerPrice" label="Offer price (optional)">
            <InputNumber min={0} style={{ width: '100%' }} prefix="₹" />
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
};
