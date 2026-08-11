export type UserRole =
  | 'Super Admin'
  | 'Admin'
  | 'Branch Manager'
  | 'Trainer'
  | 'Receptionist';

export type Status = 'active' | 'inactive' | 'pending' | 'expired' | 'cancelled';

/** Stored in users.type */
export type TrainerType = 'general_trainer' | 'pt_trainer';

export interface User {
  id: string;
  name: string;
  email?: string;
  role: UserRole;
  roleId?: number;
  avatar?: string;
  branchId?: string;
  phone?: string;
}

export interface AuthResponse {
  token: string;
  refreshToken?: string;
  user: User;
}

export interface LoginPayload {
  mobile: string;
  password: string;
  fcmToken?: string;
}

export interface AdminNotification {
  id: string;
  title: string;
  message: string;
  type?: string;
  isRead: boolean;
  createdAt: string;
  referenceId?: string;
  branchId?: string;
}

export type NotificationSendTarget = 'all_admins' | 'branch' | 'user_ids';

export interface SendNotificationPayload {
  title: string;
  message: string;
  type?: string;
  target: NotificationSendTarget;
  branchId?: string;
  userIds?: string[];
}

export interface SendNotificationResult {
  sent: number;
  failed: number;
  recipientIds: string[];
}

export interface PaginatedRequest {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  status?: string;
  branchId?: string;
  startDate?: string;
  endDate?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  gender: 'male' | 'female' | 'other';
  branchId: string;
  branchName: string;
  membershipStatus: Status;
  joinDate: string;
  avatar?: string;
  address?: string;
  dateOfBirth?: string;
}

export interface CustomerSubscriptionDetail {
  plan_name: string;
  start_date: string;
  end_date: string;
  amount: string | number;
  status: string;
  billing_cycle: string;
}

export interface CustomerSessionPlanDetail {
  plan_name: string;
  total_sessions: number;
  used_sessions: number;
  price: string | number;
  purchased_on: string;
  status: string;
}

export interface CustomerAttendanceHistoryItem {
  id: string;
  session_name: string;
  date: string;
  time: string;
  trainer: string;
  status: string;
}

export interface CustomerFullDetails {
  id: string;
  name: string;
  phone: string;
  email?: string | null;
  membership_type?: string | null;
  status: string;
  last_visit?: string | null;
  joined_on?: string | null;
  branch_name?: string | null;
  profile_image_url?: string | null;
  subscription?: CustomerSubscriptionDetail | null;
  session_plan?: CustomerSessionPlanDetail | null;
  session_plans?: CustomerSessionPlanDetail[] | null;
  remaining_sessions?: number;
  payment_due?: number | string;
  payment_due_note?: string | null;
  attendance_history?: CustomerAttendanceHistoryItem[] | null;
}

export interface CustomerDetailsApiResponse {
  success: boolean;
  CustomerDetails: CustomerFullDetails;
  message?: string;
}


export interface Trainer {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialization: string;
  branchId: string;
  branchName: string;
  branchNames: string[];
  status: Status;
  experienceYears: number;
  avatar?: string;
  certifications?: string[];
  roleId?: number;
  roleName?: string;
  gender?: string;
  description?: string;
  /** general_trainer | pt_trainer — stored as users.type */
  trainerType?: TrainerType;
}

export interface TrainerHistorySummary {
  totalSessionsTaken: number;
  totalSessionsCompleted: number;
  totalAmount: number;
  totalCustomers: number;
}

export interface TrainerCustomerTotal {
  customerId: string;
  customerName: string;
  mobile?: string;
  image?: string;
  totalPurchasedSessions: number;
  totalUsedSessions: number;
  totalAmount: number;
}

export interface TrainerBooking {
  bookingId: string;
  sessionId: string;
  customerId: string;
  customerName: string;
  customerMobile?: string;
  customerImage?: string;
  sessionName: string;
  branchName?: string;
  bookingDate?: string;
  slotStart?: string;
  slotEnd?: string;
  status: string;
}

export interface TrainerStartedSession {
  checkinId: string;
  customerId: string;
  customerName: string;
  customerMobile?: string;
  customerImage?: string;
  sessionId: string;
  sessionName: string;
  branchId?: string;
  branchName?: string;
  slotStart?: string;
  slotEnd?: string | null;
  status: string;
  sessionDate?: string;
}

export interface TrainerAttendance {
  id: string;
  checkInTime?: string;
  checkOutTime?: string | null;
  branchId?: string;
  workMinutes?: number | null;
}

export interface TrainerDetails {
  trainer: Trainer;
  summary: TrainerHistorySummary;
  customers: TrainerCustomerTotal[];
  totalPurchasedSessionAmount?: number;
  myEarnings?: number;
  totalSessionsPurchasedQty?: number;
  todaySessionsTotal?: number;
  isCheckin?: boolean;
  lastAttendance?: TrainerAttendance | null;
  todayBookings?: TrainerBooking[];
  startedSession?: TrainerStartedSession[];
}

export interface Branch {
  id: string;
  name: string;
  code: string;
  address: string;
  city: string;
  phone: string;
  email?: string;
  managerName: string;
  status: Status;
  capacity: number;
  customerCount: number;
  trainerCount: number;
  image?: string;
  openingTime?: string;
  closingTime?: string;
  location?: string;
  accountId?: string;
}

export interface BranchPerson {
  id: string;
  name: string;
  mobile?: string;
  image?: string;
  roleId?: number;
  roleName?: string;
}

export interface BranchDetails extends Branch {
  counts: {
    customers: number;
    employees: number;
    managers: number;
    admins: number;
  };
  customers: BranchPerson[];
  employees: BranchPerson[];
  managers: BranchPerson[];
  admins: BranchPerson[];
}

/** Sellable membership plan (owner addsubscription). */
export interface Subscription {
  id: string;
  planName: string;
  price: number;
  cycle: 'Monthly' | 'Quarterly' | 'Yearly' | string;
  branchId: string;
  branchName: string;
  features: string[];
  gstType: 'inclusive' | 'exclusive' | string;
  gstPercentage: number;
}

/** Sellable PT session package (owner create-sessions). */
export interface PtSession {
  id: string;
  name: string;
  sessionFeature: string;
  branchId: string;
  branchName: string;
  price: number;
  qty: number;
  partiallyAllow: boolean;
  installmentAmount?: number | null;
  status: 'active' | 'inactive';
  image?: string;
  gstType?: string;
  gstPercentage?: number;
  employeeId?: string;
  employeeName?: string;
}

/** Booked / scheduled PT slot shown on dashboard. */
export interface BookedPtSession {
  id: string;
  customerId: string;
  customerName: string;
  trainerId: string;
  trainerName: string;
  branchId: string;
  branchName: string;
  scheduledAt: string;
  durationMinutes: number;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no_show';
  notes?: string;
}

export interface GymEvent {
  id: string;
  title: string;
  description: string;
  branchId: string;
  branchIds: string[];
  branchName: string;
  branchNames: string[];
  startAt: string;
  endAt: string;
  startTime?: string;
  endTime?: string;
  capacity: number;
  registeredCount: number;
  status: Status;
  type: string;
  image?: string;
  price?: number;
  offerPrice?: number;
  gstType?: string;
  gstPercentage?: number;
  location?: string;
}

export interface DashboardSummary {
  totalCustomers: number;
  totalTrainers: number;
  totalBranches: number;
  activeSubscriptions: number;
  ptSessions: number;
  todaySessions: number;
  events: number;
  revenue: number;
  /** Active subscription count (subscribers) */
  subscribers: number;
  /** Total PT package purchase amount */
  ptPurchaseAmount: number;
  /** Clients without PT */
  nonPtClients: number;
  /** Revenue attributed to PT customers */
  ptCustomerRevenue: number;
}

export interface ChartPoint {
  label: string;
  value: number;
}

export interface BranchPerformance {
  branchName: string;
  revenue: number;
  customers: number;
  sessions: number;
}

export interface DashboardData {
  summary: DashboardSummary;
  monthlyRevenue: ChartPoint[];
  subscriptionGrowth: ChartPoint[];
  customerGrowth: ChartPoint[];
  branchPerformance: BranchPerformance[];
  recentCustomers: Customer[];
  todaySessions: BookedPtSession[];
  upcomingEvents: GymEvent[];
}

export type TransactionType = 'subscription' | 'sessions' | 'events';
export type TransactionPaymentStatus =
  | 'paid'
  | 'failed'
  | 'pending'
  | 'created';

export interface PaymentTransaction {
  id: string;
  branchId?: string;
  branchName?: string;
  userId?: string;
  userName?: string;
  userMobile?: string;
  type: TransactionType | string;
  amount: number;
  currency: string;
  paymentStatus: string;
  paymentMethod?: string;
  receipt?: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  itemName?: string;
  qty?: number;
  subscriptionId?: string;
  sessionId?: string;
  eventId?: string;
  trainerId?: string;
  trainerName?: string;
  trainerMobile?: string;
  raisedBy?: string;
  raisedByName?: string;
  failureReason?: string;
  paidAt?: string;
  approvedBy?: string;
  approvedByName?: string;
  approvedByMobile?: string;
  approvedAt?: string;
  isPartial?: boolean;
  packageAmount?: number;
  amountPending?: number;
  lastPaidAmount?: number;
  payments?: TransactionPaymentHistory[];
  purchaseId?: string;
  couponId?: string;
  couponCode?: string;
  couponDiscount?: number;
  originalAmount?: number;
  razorpayTransferId?: string;
  linkedAccountId?: string;
  merchantBranchName?: string;
  transferAmount?: number;
  transferStatus?: string;
  settlementStatus?: string;
  settlementId?: string;
  onHold?: boolean;
  onHoldUntil?: string;
  settledAt?: string;
  settlesAt?: string;
  settlementUtr?: string;
  settlementHint?: string;
  transferError?: TransactionTransferError;
  razorpayFee?: number;
  razorpayTax?: number;
  transferFees?: number;
  transferTax?: number;
  receivingAmount?: number;
  createdAt: string;
  updatedAt?: string;
}

export interface TransactionPaymentHistory {
  id: string;
  transactionId?: string;
  amount: number;
  amountPaid?: number;
  amountPending?: number;
  paymentMethod?: string;
  paymentStatus?: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  receipt?: string;
  paidAt?: string;
  createdAt?: string;
}

export interface TransactionTransferError {
  code?: string;
  reason?: string;
  description?: string;
}

export interface TransactionSettlement {
  routed: boolean;
  from?: string | null;
  linkedAccountId?: string | null;
  transferId?: string | null;
  transferAmount?: number | null;
  transferStatus?: string | null;
  settlementStatus?: string | null;
  settlementId?: string | null;
  onHold?: boolean;
  onHoldUntil?: string | null;
  settledAt?: string | null;
  settlesAt?: string | null;
  settlementUtr?: string | null;
  settlementHint?: string | null;
  transferError?: TransactionTransferError | null;
  razorpayFee?: number | null;
  razorpayTax?: number | null;
  transferFees?: number | null;
  transferTax?: number | null;
  receivingAmount?: number | null;
  paymentId?: string | null;
  orderId?: string | null;
  paidAmount?: number | null;
  branchId?: string | null;
  branchName?: string | null;
  merchantBranchName?: string | null;
  paymentMethod?: string | null;
}

export interface TransactionListParams extends PaginatedRequest {
  type?: string;
  paymentStatus?: string;
}

export interface TransactionListResult {
  items: PaymentTransaction[];
  total: number;
  page: number;
  pageSize: number;
  summary: {
    paidAmount: number;
    paidCount: number;
    failedCount: number;
    pendingCount: number;
  };
}

export type CouponStatus = 'active' | 'used' | 'expired' | 'inactive' | string;

export interface Coupon {
  id: string;
  couponName: string;
  couponCode: string;
  price: number;
  branchId: string;
  branchName: string;
  createdBy: string;
  createdByName: string;
  usedBy?: string;
  usedByName?: string;
  usedAt?: string;
  transactionId?: string;
  status: CouponStatus;
  createdAt: string;
  /** ISO timestamp — unused coupons expire 1 hour after create */
  expiresAt?: string;
}

export interface CouponListParams extends PaginatedRequest {
  status?: string;
}

export interface CouponListResult {
  items: Coupon[];
  total: number;
  page: number;
  pageSize: number;
  summary: {
    total: number;
    active: number;
    used: number;
    expired: number;
    totalValue: number;
  };
}

export interface CreateCouponPayload {
  couponName: string;
  price: number;
  branchId: string;
}

export interface ReportRow {
  id: string;
  [key: string]: string | number | boolean | null | undefined;
}

export type ReportType =
  | 'booked-sessions'
  | 'revenue'
  | 'subscriptions'
  | 'trainer-attendance'
  | 'customer-attendance'
  | 'branch-performance';

export type ReportDateFilter =
  | 'all'
  | 'today'
  | 'weekly'
  | 'monthly'
  | 'yearly'
  | 'custom';

export type ReportExportType = 'branch' | 'attendance' | 'revenue' | 'all';

export interface ReportQuery {
  filter: ReportDateFilter;
  startDate?: string;
  endDate?: string;
  branchId?: string | string[];
  trainerId?: string | string[];
  /** Which Excel/PDF section to download (separate files, not one combined report) */
  reportType?: ReportExportType;
}

export interface ReportBranchSummary {
  totalCustomers: number;
  subscriberClients: number;
  subscriberRevenue: number;
  ptClients: number;
  ptRevenue: number;
  eventClients: number;
  eventRevenue: number;
  totalRevenue: number;
  /** Collected paid amount (same as totalRevenue) */
  paidAmount: number;
  /** Cash/online payments awaiting approval */
  pendingAmount: number;
  pendingCount: number;
  failedAmount: number;
  failedCount: number;
  /** Amount collected via partial installments */
  partialPaidAmount: number;
  partialPaidCount: number;
  /** Full package value for those partial payments */
  partialPackageAmount: number;
  /** Outstanding installment balance still owed */
  amountDue: number;
  partialOpenCount: number;
  /** Booked package value for purchases in period */
  packageAmount: number;
  amountPaidPurchases: number;
}

export interface ReportBranchHighlights {
  activeTrainers: number;
  sessionsPurchased: number;
  sessionsCompleted: number;
  sessionsRemaining: number;
  sessionUtilization: number;
}

export interface ReportTrainerAttendance {
  presentDays: number;
  totalDays: number;
  attendanceDisplay: string;
  attendancePercentage: number;
}

export interface ReportTrainer {
  id: string;
  name: string;
  mobile?: string;
  image?: string;
  ptClients: number;
  sessionsPurchased: number;
  sessionsCompleted: number;
  sessionsDisplay: string;
  completionPercentage: number;
  totalRevenue: number;
  utilizedRevenue: number;
  revenueUtilization: number;
  attendance: ReportTrainerAttendance;
  workingHours: string;
  branchId: string;
  branchName: string;
}

export interface ReportBranch {
  id: string;
  name: string;
  summary: ReportBranchSummary;
  highlights: ReportBranchHighlights;
  trainers: ReportTrainer[];
}

export interface GymReport {
  branchIds: string[];
  branches: ReportBranch[];
  totals: ReportBranchSummary &
    ReportBranchHighlights & {
      branchCount: number;
      trainerCount: number;
    };
}

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}
