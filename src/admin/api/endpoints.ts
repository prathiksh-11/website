export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    ME: '/auth/get-profile',
    REFRESH: '/auth/refresh',
    FCM_TOKEN: '/auth/fcm-token',
  },
  NOTIFICATIONS: {
    ROOT: '/notifications',
    UNREAD_COUNT: '/notification/unread-count',
    READ: '/notification/read',
    DELETE: '/notification/delete',
    SEND: '/admin/notifications/send',
  },
  TRANSACTIONS: {
    ROOT: '/transactions',
    SETTLEMENT: (id: string) => `/transactions/${id}/settlement`,
  },
  CASH_PAYMENTS: {
    PENDING: '/payment/cash-orders/pending',
    APPROVE: (id: string) => `/payment/cash-order/${id}/approve`,
    REJECT: (id: string) => `/payment/cash-order/${id}/reject`,
  },
  COUPONS: {
    ROOT: '/getcoupons',
    CREATE: '/addcoupon',
  },
  DASHBOARD: {
    ROOT: '/dashboard',
  },
  CUSTOMERS: {
    ROOT: '/get-customers',
    BY_ID: (id: string) => `/get-customers/${id}`,
    DETAILS: (id: string) => `/get-customer-details/${id}`,
  },
  TRAINERS: {
    ROOT: '/getemployeesbybranch',
    DETAILS: '/employee-details/',
    CREATE: '/addemployees',
    UPDATE: '/updateemployee',
    DELETE: '/deleteemployee',
    BY_BRANCH: '/get-employee-by-branch_id',
    BY_BRANCH_IDS: '/get-employees-by-branch-ids',
  },
  BRANCHES: {
    ROOT: '/getbranches',
    BY_ID: (id: string) => `/getbranchdetails/${id}`,
    CREATE: '/addbranches',
    UPDATE: '/updatebranches',
    DELETE: '/deletebranches',
  },
  SUBSCRIPTIONS: {
    ROOT: '/getallsubscriptions',
    CREATE: '/addsubscription',
    UPDATE: '/updatesubscription',
    DELETE: '/deletesubscription',
  },
  SESSIONS: {
    ROOT: '/get-sessions',
    CREATE: '/create-sessions',
    UPDATE: (id: string) => `/update-session/${id}`,
    BY_ID: (id: string) => `/sessions/${id}`,
    DELETE: (id: string) => `/delete-sessions/${id}`,
  },
  EVENTS: {
    ROOT: '/getevents',
    CREATE: '/addevent',
    UPDATE: '/updateevent',
    DELETE: '/deleteevent',
  },
  REPORTS: {
    ROOT: '/reports',
    DOWNLOAD: '/report/download',
    DOWNLOAD_PDF: '/report/download-pdf',
  },
  PROFILE: {
    ROOT: '/profile',
    PASSWORD: '/profile/password',
  },
  SETTINGS: {
    ROOT: '/settings',
  },
} as const;
