import type {
  Branch,
  BranchDetails,
  BranchPerson,
  Customer,
  GymEvent,
  PtSession,
  Status,
  Subscription,
  Trainer,
  TrainerAttendance,
  TrainerBooking,
  TrainerCustomerTotal,
  TrainerDetails,
  TrainerHistorySummary,
  TrainerStartedSession,
} from '@/types';
import { normalizeTrainerType } from '@/constants';

const asString = (value: unknown, fallback = '') =>
  value == null ? fallback : String(value);

const asNumber = (value: unknown, fallback = 0) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
};

const pickBranchId = (branchId: unknown) => {
  if (Array.isArray(branchId)) {
    return branchId[0] != null ? String(branchId[0]) : '';
  }
  return asString(branchId);
};

const normalizeStatus = (value: unknown): Status => {
  const status = asString(value, 'active').toLowerCase();
  if (
    status === 'active' ||
    status === 'inactive' ||
    status === 'pending' ||
    status === 'expired' ||
    status === 'cancelled'
  ) {
    return status;
  }
  return 'active';
};

const normalizeGender = (value: unknown): Customer['gender'] => {
  const gender = asString(value, 'other').toLowerCase();
  if (gender === 'male' || gender === 'female' || gender === 'other') {
    return gender;
  }
  if (gender === 'm') return 'male';
  if (gender === 'f') return 'female';
  return 'other';
};

const resolveImageUrl = (image: unknown) => {
  if (!image) return undefined;
  const path = asString(image);
  if (!path) return undefined;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  const apiBase = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? '';
  const origin = apiBase.replace(/\/api\/?$/, '');
  return `${origin}/${path.replace(/^\//, '')}`;
};

export const mapBackendCustomer = (raw: Record<string, unknown>): Customer => {
  const fullName = [raw.name, raw.last_name].filter(Boolean).join(' ').trim();
  const branchName = asString(raw.branch_name ?? raw.branchName);

  return {
    id: asString(raw.id),
    name: fullName || 'Customer',
    email: asString(raw.email),
    phone: asString(raw.mobile ?? raw.phone),
    gender: normalizeGender(raw.gender),
    branchId: pickBranchId(raw.branch_id),
    branchName: branchName || 'Unassigned',
    membershipStatus: normalizeStatus(
      raw.membership_status ?? raw.status ?? 'active',
    ),
    joinDate: asString(
      raw.created_at ?? raw.join_date ?? new Date().toISOString(),
    ).slice(0, 10),
    avatar: resolveImageUrl(raw.image),
    address: raw.location || raw.address ? asString(raw.location ?? raw.address) : undefined,
    dateOfBirth: raw.dob ? asString(raw.dob).slice(0, 10) : undefined,
  };
};

const formatClock = (value: unknown) => {
  const raw = asString(value);
  if (!raw) return undefined;
  // "05:00:00" -> "05:00"
  return raw.length >= 5 ? raw.slice(0, 5) : raw;
};

export const mapBackendBranch = (raw: Record<string, unknown>): Branch => ({
  id: asString(raw.id),
  name: asString(raw.name, 'Branch'),
  code: asString(
    raw.code ?? raw.branch_code ?? raw.branch_number ?? `B${raw.id ?? ''}`,
  ),
  address: asString(raw.address),
  city: asString(raw.city ?? raw.location),
  phone: asString(raw.phone ?? raw.mobile),
  email: raw.email ? asString(raw.email) : undefined,
  managerName: asString(raw.manager_name ?? raw.managerName, 'N/A'),
  status: normalizeStatus(raw.status ?? 'active'),
  capacity: asNumber(raw.capacity),
  customerCount: asNumber(raw.total_users ?? raw.customer_count),
  trainerCount: asNumber(
    (raw.counts as { employees?: number } | undefined)?.employees ??
      raw.trainer_count ??
      raw.employee_count,
  ),
  image: resolveImageUrl(raw.branch_image ?? raw.image),
  openingTime: formatClock(raw.opening_time),
  closingTime: formatClock(raw.closing_time),
  location: raw.location ? asString(raw.location) : undefined,
  accountId: raw.account_id ? asString(raw.account_id) : undefined,
});

const mapBackendPerson = (raw: Record<string, unknown>): BranchPerson => ({
  id: asString(raw.id),
  name: asString(raw.name, 'Unknown'),
  mobile: raw.mobile ? asString(raw.mobile) : undefined,
  image: resolveImageUrl(raw.image),
  roleId: raw.role_id != null ? asNumber(raw.role_id) : undefined,
  roleName: raw.role_name ? asString(raw.role_name) : undefined,
});

export const mapBackendBranchDetails = (
  raw: Record<string, unknown>,
): BranchDetails => {
  const counts = (raw.counts as Record<string, unknown> | undefined) ?? {};
  const customers = Array.isArray(raw.customers) ? raw.customers : [];
  const employees = Array.isArray(raw.employees) ? raw.employees : [];
  const managers = Array.isArray(raw.managers) ? raw.managers : [];
  const admins = Array.isArray(raw.admins) ? raw.admins : [];

  return {
    ...mapBackendBranch(raw),
    counts: {
      customers: asNumber(counts.customers ?? customers.length),
      employees: asNumber(counts.employees ?? employees.length),
      managers: asNumber(counts.managers ?? managers.length),
      admins: asNumber(counts.admins ?? admins.length),
    },
    customers: customers.map((p) => mapBackendPerson(p as Record<string, unknown>)),
    employees: employees.map((p) => mapBackendPerson(p as Record<string, unknown>)),
    managers: managers.map((p) => mapBackendPerson(p as Record<string, unknown>)),
    admins: admins.map((p) => mapBackendPerson(p as Record<string, unknown>)),
  };
};

export const mapBackendTrainer = (raw: Record<string, unknown>): Trainer => {
  const branchRows = Array.isArray(raw.branches) ? raw.branches : [];
  const branchNames = branchRows
    .map((b) => {
      if (typeof b === 'string') return b;
      if (b && typeof b === 'object' && 'name' in b) {
        return asString((b as { name: unknown }).name);
      }
      return '';
    })
    .filter(Boolean);

  const firstName = asString(raw.name);
  const lastName = asString(raw.last_name ?? raw.lastName);
  const fullName = [firstName, lastName].filter(Boolean).join(' ').trim() || 'Employee';

  const roleId = raw.role_id != null ? asNumber(raw.role_id) : undefined;
  const roleName = asString(raw.role_name ?? raw.roleName);
  const description = asString(raw.description);

  const trainerType = normalizeTrainerType(
    asString(raw.type ?? raw.trainerType),
    description,
  );

  const branchIdsFromRows = branchRows
    .map((b) => {
      if (b && typeof b === 'object' && 'id' in b) {
        return asString((b as { id: unknown }).id);
      }
      return '';
    })
    .filter(Boolean);

  const branchId =
    pickBranchId(raw.branch_id ?? raw.branchId) || branchIdsFromRows[0] || '';

  return {
    id: asString(raw.id),
    name: fullName,
    email: asString(raw.email),
    phone: asString(raw.mobile ?? raw.phone),
    specialization: description || roleName || 'Trainer',
    branchId,
    branchName: branchNames[0] || asString(raw.branch_name ?? raw.branchName, 'Unassigned'),
    branchNames,
    status: normalizeStatus(raw.status ?? 'active'),
    experienceYears: asNumber(raw.experience_years ?? raw.experienceYears),
    avatar: resolveImageUrl(raw.image),
    roleId,
    roleName: roleName || undefined,
    gender: raw.gender ? asString(raw.gender) : undefined,
    description: description || undefined,
    trainerType,
  };
};

export const mapBackendTrainerHistory = (
  trainer: Trainer,
  raw: Record<string, unknown>,
): TrainerDetails => {
  const summaryRaw = (raw.summary as Record<string, unknown> | undefined) ?? {};
  const customersRaw = Array.isArray(raw.customer_totals)
    ? raw.customer_totals
    : [];

  const employeeRaw = raw.employee && typeof raw.employee === 'object'
    ? (raw.employee as Record<string, unknown>)
    : undefined;
  const mappedTrainer = employeeRaw ? mapBackendTrainer(employeeRaw) : trainer;

  const totalPurchasedSessionAmount = asNumber(
    raw.total_purchased_session_amount ?? summaryRaw.total_amount
  );
  const myEarnings = raw.my_earnings != null ? asNumber(raw.my_earnings) : undefined;
  const totalSessionsPurchasedQty = asNumber(
    raw.total_sessions_purchased_qty ?? summaryRaw.total_sessions_purchased ?? summaryRaw.total_sessions_taken
  );
  const totalCustomers = asNumber(
    raw.total_customers ?? summaryRaw.total_customers
  );
  const todaySessionsTotal = raw.today_sessions_total != null ? asNumber(raw.today_sessions_total) : undefined;
  const isCheckin = raw.is_checkin != null ? Boolean(raw.is_checkin) : undefined;

  const summary: TrainerHistorySummary = {
    totalSessionsTaken: totalSessionsPurchasedQty || asNumber(summaryRaw.total_sessions_taken),
    totalSessionsCompleted: asNumber(summaryRaw.total_sessions_completed),
    totalAmount: totalPurchasedSessionAmount,
    totalCustomers,
  };

  const customers: TrainerCustomerTotal[] = customersRaw.map((row) => {
    const r = row as Record<string, unknown>;
    return {
      customerId: asString(r.customer_id),
      customerName: asString(r.customer_name, 'Customer'),
      mobile: r.mobile ? asString(r.mobile) : undefined,
      image: resolveImageUrl(r.image),
      totalPurchasedSessions: asNumber(r.total_purchased_sessions),
      totalUsedSessions: asNumber(r.total_used_sessions),
      totalAmount: asNumber(r.total_amount),
    };
  });

  const todayBookingsRaw = Array.isArray(raw.today_bookings) ? raw.today_bookings : [];
  const todayBookings: TrainerBooking[] = todayBookingsRaw.map((b) => {
    const r = b as Record<string, unknown>;
    return {
      bookingId: asString(r.booking_id),
      sessionId: asString(r.session_id),
      customerId: asString(r.customer_id),
      customerName: asString(r.customer_name, 'Customer'),
      customerMobile: r.customer_mobile ? asString(r.customer_mobile) : undefined,
      customerImage: resolveImageUrl(r.customer_image),
      sessionName: asString(r.session_name, 'Session'),
      branchName: r.branch_name ? asString(r.branch_name) : undefined,
      bookingDate: r.booking_date ? asString(r.booking_date) : undefined,
      slotStart: r.slot_start ? asString(r.slot_start) : undefined,
      slotEnd: r.slot_end ? asString(r.slot_end) : undefined,
      status: asString(r.status, 'booked'),
    };
  });

  const startedSessionRaw = Array.isArray(raw.started_session) ? raw.started_session : [];
  const startedSession: TrainerStartedSession[] = startedSessionRaw.map((s) => {
    const r = s as Record<string, unknown>;
    return {
      checkinId: asString(r.checkin_id),
      customerId: asString(r.customer_id),
      customerName: asString(r.customer_name, 'Customer'),
      customerMobile: r.customer_mobile ? asString(r.customer_mobile) : undefined,
      customerImage: resolveImageUrl(r.customer_image),
      sessionId: asString(r.session_id),
      sessionName: asString(r.session_name, 'Session'),
      branchId: r.branch_id != null ? asString(r.branch_id) : undefined,
      branchName: r.branch_name ? asString(r.branch_name) : undefined,
      slotStart: r.slot_start ? asString(r.slot_start) : undefined,
      slotEnd: r.slot_end ? asString(r.slot_end) : undefined,
      status: asString(r.status, 'started'),
      sessionDate: r.session_date ? asString(r.session_date) : undefined,
    };
  });

  const lastAttRaw = raw.last_attendance as Record<string, unknown> | undefined;
  const lastAttendance: TrainerAttendance | null = lastAttRaw ? {
    id: asString(lastAttRaw.id),
    checkInTime: lastAttRaw.check_in_time ? asString(lastAttRaw.check_in_time) : undefined,
    checkOutTime: lastAttRaw.check_out_time ? asString(lastAttRaw.check_out_time) : undefined,
    branchId: lastAttRaw.branch_id != null ? asString(lastAttRaw.branch_id) : undefined,
    workMinutes: lastAttRaw.work_minutes != null ? asNumber(lastAttRaw.work_minutes) : null,
  } : null;

  return {
    trainer: mappedTrainer,
    summary,
    customers,
    totalPurchasedSessionAmount,
    myEarnings,
    totalSessionsPurchasedQty,
    todaySessionsTotal,
    isCheckin,
    lastAttendance,
    todayBookings,
    startedSession,
  };
};

const formatTime = (value: unknown) => {
  const raw = asString(value);
  if (!raw) return undefined;
  return raw.length >= 5 ? raw.slice(0, 5) : raw;
};

const eventStatusFromDate = (startAt: string, rawStatus?: unknown): Status => {
  if (rawStatus != null && asString(rawStatus)) {
    return normalizeStatus(rawStatus);
  }
  if (!startAt) return 'pending';
  const start = new Date(startAt);
  if (Number.isNaN(start.getTime())) return 'active';
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return start < today ? 'expired' : 'active';
};

export const mapBackendEvent = (raw: Record<string, unknown>): GymEvent => {
  const branchIdRaw = raw.branch_id ?? raw.branchId;
  const branchIds = Array.isArray(branchIdRaw)
    ? branchIdRaw.map((id) => asString(id)).filter(Boolean)
    : branchIdRaw != null
      ? [asString(branchIdRaw)]
      : [];

  const branchRows = Array.isArray(raw.branches) ? raw.branches : [];
  const branchNames = branchRows
    .map((b) => {
      if (typeof b === 'string') return b;
      if (b && typeof b === 'object' && 'name' in b) {
        return asString((b as { name: unknown }).name);
      }
      return '';
    })
    .filter(Boolean);

  const startDate = asString(raw.start_date ?? raw.startAt);
  const endDate = asString(raw.end_date ?? raw.endAt ?? startDate);
  const startTime = formatTime(raw.start_time);
  const endTime = formatTime(raw.end_time);

  return {
    id: asString(raw.id),
    title: asString(raw.event_name ?? raw.title ?? raw.name, 'Event'),
    description: asString(raw.description),
    branchId: branchIds[0] ?? '',
    branchIds,
    branchName: branchNames[0] || asString(raw.branch_name, 'Unassigned'),
    branchNames,
    startAt: startDate,
    endAt: endDate || startDate,
    startTime,
    endTime,
    capacity: asNumber(raw.slot_limit ?? raw.capacity),
    registeredCount: asNumber(raw.used_slots ?? raw.registered_count),
    status: eventStatusFromDate(startDate, raw.status),
    type: asString(raw.event_type ?? raw.type, 'Event'),
    image: resolveImageUrl(raw.image),
    price: raw.price != null ? asNumber(raw.price) : undefined,
    offerPrice:
      raw.offer != null && raw.offer !== ''
        ? asNumber(raw.offer)
        : undefined,
    gstType:
      raw.gst_type != null
        ? asString(raw.gst_type)
        : raw.gstType != null
          ? asString(raw.gstType)
          : undefined,
    gstPercentage:
      raw.gst_percentage != null
        ? asNumber(raw.gst_percentage)
        : raw.gstPercentage != null
          ? asNumber(raw.gstPercentage)
          : undefined,
    location: raw.location ? asString(raw.location) : undefined,
  };
};

export const toBackendEventPayload = (payload: Partial<GymEvent>) => {
  const body: Record<string, unknown> = {};

  if (payload.title != null) body.event_name = payload.title;
  if (payload.description != null) body.description = payload.description;
  if (payload.location != null) body.location = payload.location;
  if (payload.price != null) body.price = payload.price;
  if (payload.offerPrice != null) body.offer = payload.offerPrice;
  if (payload.gstType != null) body.gst_type = payload.gstType;
  if (payload.gstPercentage != null) body.gst_percentage = payload.gstPercentage;
  if (payload.capacity != null) body.slot_limit = payload.capacity;
  if (payload.image != null) body.image = payload.image;
  if (payload.startTime != null) body.start_time = payload.startTime;
  if (payload.endTime != null) body.end_time = payload.endTime;

  if (payload.startAt != null) {
    body.start_date = asString(payload.startAt).slice(0, 10);
  }
  if (payload.endAt != null) {
    body.end_date = asString(payload.endAt).slice(0, 10);
  }

  const ids =
    payload.branchIds?.length
      ? payload.branchIds
      : payload.branchId
        ? [payload.branchId]
        : undefined;
  if (ids) body.branch_id = ids.map(Number);

  return body;
};

const sessionStatusFromBackend = (value: unknown): PtSession['status'] => {
  if (typeof value === 'boolean') return value ? 'active' : 'inactive';
  const raw = asString(value, 'active').toLowerCase();
  if (raw === '0' || raw === 'false' || raw === 'inactive') return 'inactive';
  return 'active';
};

export const mapBackendSession = (raw: Record<string, unknown>): PtSession => ({
  id: asString(raw.id),
  name: asString(raw.session_name ?? raw.name, 'Session'),
  sessionFeature: asString(raw.session_feature ?? raw.sessionFeature),
  branchId: asString(raw.branch_id ?? raw.branchId),
  branchName: asString(raw.branch_name ?? raw.branchName, 'Unassigned'),
  price: asNumber(raw.price),
  qty: Math.max(1, asNumber(raw.qty, 1)),
  partiallyAllow: Boolean(
    raw.partially_allow ?? raw.partiallyAllow ?? false,
  ),
  installmentAmount: (() => {
    const value = raw.installment_amount ?? raw.installmentAmount ?? raw.discount;
    if (value == null || value === '') return null;
    return asNumber(value);
  })(),
  status: sessionStatusFromBackend(raw.status),
  image: resolveImageUrl(raw.image),
  gstType: raw.gst_type != null ? asString(raw.gst_type) : undefined,
  gstPercentage:
    raw.gst_percentage != null ? asNumber(raw.gst_percentage) : undefined,
  employeeId:
    raw.employee_id != null ? asString(raw.employee_id) : undefined,
  employeeName:
    raw.employee_name != null ? asString(raw.employee_name) : undefined,
});

export const toBackendSessionPayload = (payload: Partial<PtSession>) => {
  const body: Record<string, unknown> = {};

  if (payload.name != null) body.session_name = payload.name;
  if (payload.sessionFeature != null) {
    body.session_feature = payload.sessionFeature;
  }
  if (payload.price != null) body.price = payload.price;
  if (payload.qty != null) body.qty = payload.qty;
  if (payload.partiallyAllow != null) {
    body.partially_allow = payload.partiallyAllow;
  }
  if (payload.partiallyAllow === true) {
    body.installment_amount = payload.installmentAmount ?? null;
  } else if (payload.partiallyAllow === false) {
    body.installment_amount = null;
  } else if (payload.installmentAmount !== undefined) {
    body.installment_amount = payload.installmentAmount;
  }
  if (payload.branchId != null) body.branch_id = Number(payload.branchId);
  if (payload.status != null) body.status = payload.status === 'active';
  if (payload.image != null) body.image = payload.image;
  if (payload.gstType != null) body.gst_type = payload.gstType;
  if (payload.gstPercentage != null) {
    body.gst_percentage = payload.gstPercentage;
  }
  if (payload.employeeId != null) {
    body.employee_id = Number(payload.employeeId);
  }

  return body;
};

const normalizeFeatures = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value.map((item) => asString(item).trim()).filter(Boolean);
  }
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return [];
    try {
      const parsed = JSON.parse(trimmed) as unknown;
      if (Array.isArray(parsed)) {
        return parsed.map((item) => asString(item).trim()).filter(Boolean);
      }
    } catch {
      // fall through to comma-split
    }
    return trimmed
      .split(/[,|•]/)
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
};

const normalizeGstType = (value: unknown): Subscription['gstType'] => {
  const raw = asString(value, 'exclusive').toLowerCase();
  if (raw.includes('inclusive')) return 'inclusive';
  return 'exclusive';
};

const normalizeCycle = (value: unknown): Subscription['cycle'] => {
  const raw = asString(value, 'Monthly').toLowerCase();
  if (raw === 'mo' || raw.includes('month')) return 'Monthly';
  if (raw === 'qu' || raw.includes('quarter')) return 'Quarterly';
  if (raw === 'yr' || raw.includes('year')) return 'Yearly';
  return asString(value, 'Monthly') || 'Monthly';
};

export const mapBackendSubscription = (
  raw: Record<string, unknown>,
): Subscription => ({
  id: asString(raw.id),
  planName: asString(raw.plan_name ?? raw.planName, 'Plan'),
  price: asNumber(raw.price),
  cycle: normalizeCycle(raw.cycle),
  branchId: asString(raw.branch_id ?? raw.branchId),
  branchName: asString(raw.branch_name ?? raw.branchName, 'Unassigned'),
  features: normalizeFeatures(raw.features),
  gstType: normalizeGstType(raw.gst_type ?? raw.gstType),
  gstPercentage: asNumber(raw.gst_percentage ?? raw.gstPercentage),
});

export const toBackendSubscriptionPayload = (
  payload: Partial<Subscription> & { id?: string },
) => {
  const body: Record<string, unknown> = {};

  if (payload.id != null) body.id = Number(payload.id);
  if (payload.planName != null) body.plan_name = payload.planName;
  if (payload.price != null) body.price = payload.price;
  if (payload.cycle != null) body.cycle = payload.cycle;
  if (payload.branchId != null) body.branch_id = Number(payload.branchId);
  if (payload.features != null) body.features = payload.features;
  if (payload.gstType != null) body.gst_type = payload.gstType;
  if (payload.gstPercentage != null) {
    body.gst_percentage = payload.gstPercentage;
  }

  return body;
};
