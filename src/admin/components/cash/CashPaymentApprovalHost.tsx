import { App, Button, Modal } from 'antd';
import {
  Banknote,
  Building2,
  Phone,
  UserRound,
  Dumbbell,
  Layers,
  X,
} from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  cashPaymentApi,
  type CashPaymentPending,
} from '@/api/cashPayment.api';
import { getNotificationSocket } from '@/lib/socket';
import { useAuthStore } from '@/store/auth.store';

export const CASH_PAYMENT_EVENT = 'gym:cash-payment-pending';
export const CASH_PAYMENT_RESOLVED_EVENT = 'gym:cash-payment-resolved';
export const CASH_PAYMENT_REOPEN_EVENT = 'gym:cash-payment-reopen';

const formatInr = (amount: number) =>
  `₹${Number(amount || 0).toLocaleString('en-IN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;

const asRecord = (value: unknown): Record<string, unknown> =>
  value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};

/** Normalize socket/FCM payloads that may nest fields under `data`. */
export const unwrapCashPayload = (
  payload: Record<string, unknown> | null | undefined,
): Record<string, unknown> => {
  const root = asRecord(payload);
  const nested = asRecord(root.data);
  return { ...nested, ...root };
};

const upsertQueue = (
  prev: CashPaymentPending[],
  next: CashPaymentPending,
): CashPaymentPending[] => {
  const exists = prev.some((item) => item.id === next.id);
  if (exists) {
    return prev.map((item) => (item.id === next.id ? { ...item, ...next } : item));
  }
  return [...prev, next];
};

export const mapCashPaymentPayload = (
  payload: Record<string, unknown>,
): CashPaymentPending => {
  const data = unwrapCashPayload(payload);
  const id = String(data.transaction_id ?? data.id ?? '');
  return {
    id,
    transactionId: id,
    branchId: data.branch_id != null ? String(data.branch_id) : undefined,
    branchName: data.branch_name ? String(data.branch_name) : undefined,
    customerId:
      data.customer_id != null ? String(data.customer_id) : undefined,
    customerName: String(data.customer_name || 'Customer'),
    customerMobile: data.customer_mobile
      ? String(data.customer_mobile)
      : undefined,
    trainerId: data.trainer_id != null ? String(data.trainer_id) : undefined,
    trainerName: String(data.trainer_name || 'Trainer'),
    sessionId: data.session_id != null ? String(data.session_id) : undefined,
    sessionName: String(data.session_name || 'Session'),
    amount: Number(data.amount ?? 0),
    qty: Number(data.qty ?? 1),
    paymentMethod: 'cash',
    paymentStatus: String(data.payment_status || 'pending'),
    isPartial:
      data.is_partial === true ||
      data.is_partial === 'true' ||
      data.is_partial === 1,
    packageAmount:
      data.package_amount != null ? Number(data.package_amount) : undefined,
    purchaseId:
      data.purchase_id != null ? String(data.purchase_id) : undefined,
    createdAt: data.created_at ? String(data.created_at) : undefined,
  };
};

const resolveCashAction = (
  payload: Record<string, unknown>,
): 'approved' | 'rejected' | null => {
  const action = String(payload.action || '').toLowerCase();
  if (action === 'approved' || action === 'approve') return 'approved';
  if (action === 'rejected' || action === 'reject') return 'rejected';

  const status = String(payload.payment_status || '').toLowerCase();
  if (status === 'paid' || status === 'approved') return 'approved';
  if (status === 'failed' || status === 'rejected') return 'rejected';
  return null;
};

export const CashPaymentApprovalHost = () => {
  const { message, modal } = App.useApp();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const userId = useAuthStore((s) => s.user?.id);
  const [queue, setQueue] = useState<CashPaymentPending[]>([]);
  const [busy, setBusy] = useState(false);
  const [open, setOpen] = useState(true);
  const queueRef = useRef(queue);
  queueRef.current = queue;

  const current = queue[0] ?? null;
  const remaining = Math.max(queue.length - 1, 0);
  const showModal = open && Boolean(current);
  const showLauncher = !open && queue.length > 0;

  const removeFromQueue = useCallback((id: string) => {
    setQueue((prev) => {
      const next = prev.filter((item) => item.id !== id);
      return next.length === prev.length ? prev : next;
    });
  }, []);

  /** Close matching popup when this (or another) device resolves the cash order. */
  const closeCashApprovalPopup = useCallback(
    (
      payload: Record<string, unknown>,
      options?: { notify?: boolean },
    ): boolean => {
      const data = unwrapCashPayload(payload);
      const id = String(data.transaction_id ?? data.id ?? '');
      if (!id) return false;

      // Backend may send close_popup: true; treat missing as true for resolved events.
      const closeFlag = data.close_popup;
      const shouldClose =
        closeFlag === undefined ||
        closeFlag === null ||
        closeFlag === true ||
        closeFlag === 'true' ||
        closeFlag === 1 ||
        closeFlag === '1';
      if (!shouldClose) return false;

      const wasQueued = queueRef.current.some((item) => item.id === id);
      removeFromQueue(id);

      if (options?.notify !== false) {
        const action = resolveCashAction(data);
        const approvedBy =
          data.approved_by != null ? String(data.approved_by) : '';
        const resolvedBySelf =
          Boolean(userId) && approvedBy !== '' && approvedBy === String(userId);

        // Toast only when another device/user closed a popup still open here.
        if (wasQueued && !resolvedBySelf && action) {
          const customer = data.customer_name
            ? String(data.customer_name)
            : 'Customer';
          if (action === 'approved') {
            message.info(`Cash payment for ${customer} was approved`);
          } else {
            message.info(`Cash payment for ${customer} was rejected`);
          }
        }
      }

      return true;
    },
    [message, removeFromQueue, userId],
  );

  const loadPending = useCallback(async () => {
    try {
      const pending = await cashPaymentApi.listPending();
      setQueue(pending);
      if (pending.length > 0) setOpen(true);
    } catch (error) {
      console.error('[cash] Failed to load pending cash payments', error);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated || !userId) {
      setQueue([]);
      return;
    }
    void loadPending();
  }, [isAuthenticated, userId, loadPending]);

  useEffect(() => {
    if (!isAuthenticated || !userId) return;

    const socket = getNotificationSocket();
    if (!socket) return;

    const pendingEvents = Array.from(
      new Set([
        `cash_payment_pending_${userId}`,
        `cash_payment_pending_${Number(userId)}`,
        `cash_payment_pending_${String(userId)}`,
      ]),
    );
    const resolvedEvents = Array.from(
      new Set([
        `cash_payment_resolved_${userId}`,
        `cash_payment_resolved_${Number(userId)}`,
        `cash_payment_resolved_${String(userId)}`,
      ]),
    );

    const onPending = (payload: Record<string, unknown>) => {
      const item = mapCashPaymentPayload(payload || {});
      if (!item.id) return;
      setQueue((prev) => upsertQueue(prev, item));
      setOpen(true);
    };

    const onResolved = (payload: Record<string, unknown>) => {
      closeCashApprovalPopup(payload || {});
    };

    if (!socket.connected) socket.connect();
    pendingEvents.forEach((event) => socket.on(event, onPending));
    resolvedEvents.forEach((event) => socket.on(event, onResolved));

    return () => {
      pendingEvents.forEach((event) => socket.off(event, onPending));
      resolvedEvents.forEach((event) => socket.off(event, onResolved));
    };
  }, [isAuthenticated, userId, closeCashApprovalPopup]);

  useEffect(() => {
    const onFcmPending = (event: Event) => {
      const custom = event as CustomEvent<Record<string, unknown>>;
      const item = mapCashPaymentPayload(custom.detail || {});
      if (!item.id) return;
      setQueue((prev) => upsertQueue(prev, item));
      setOpen(true);
    };
    const onFcmResolved = (event: Event) => {
      const custom = event as CustomEvent<Record<string, unknown>>;
      closeCashApprovalPopup(custom.detail || {});
    };
    const onReopen = () => {
      setOpen(true);
      void loadPending();
    };
    window.addEventListener(CASH_PAYMENT_EVENT, onFcmPending);
    window.addEventListener(CASH_PAYMENT_RESOLVED_EVENT, onFcmResolved);
    window.addEventListener(CASH_PAYMENT_REOPEN_EVENT, onReopen);
    return () => {
      window.removeEventListener(CASH_PAYMENT_EVENT, onFcmPending);
      window.removeEventListener(CASH_PAYMENT_RESOLVED_EVENT, onFcmResolved);
      window.removeEventListener(CASH_PAYMENT_REOPEN_EVENT, onReopen);
    };
  }, [closeCashApprovalPopup, loadPending]);

  const handleApprove = () => {
    if (!current || busy) return;
    const transactionId = current.id;
    modal.confirm({
      title: 'Confirm cash received?',
      content: `Approve cash payment of ${formatInr(current.amount)} from ${current.customerName}?`,
      okText: 'Approve',
      cancelText: 'Cancel',
      okButtonProps: { type: 'primary' },
      onOk: async () => {
        setBusy(true);
        try {
          await cashPaymentApi.approve(transactionId);
          message.success('Cash payment approved');
          // Close locally; socket notifies other devices via cash_payment_resolved_*
          removeFromQueue(transactionId);
        } catch (error: unknown) {
          const err = error as { response?: { data?: { message?: string } } };
          message.error(
            err?.response?.data?.message || 'Failed to approve cash payment',
          );
          throw error;
        } finally {
          setBusy(false);
        }
      },
    });
  };

  const handleReject = () => {
    if (!current || busy) return;
    const transactionId = current.id;
    modal.confirm({
      title: 'Reject cash payment?',
      content: `Reject cash request from ${current.customerName} for ${current.sessionName}?`,
      okText: 'Reject',
      okButtonProps: { danger: true },
      cancelText: 'Cancel',
      onOk: async () => {
        setBusy(true);
        try {
          await cashPaymentApi.reject(transactionId);
          message.success('Cash payment rejected');
          // Close locally; socket notifies other devices via cash_payment_resolved_*
          removeFromQueue(transactionId);
        } catch (error: unknown) {
          const err = error as { response?: { data?: { message?: string } } };
          message.error(
            err?.response?.data?.message || 'Failed to reject cash payment',
          );
          throw error;
        } finally {
          setBusy(false);
        }
      },
    });
  };

  return (
    <>
      <Modal
        open={showModal}
        onCancel={() => setOpen(false)}
        footer={null}
        closable={false}
        maskClosable
        keyboard
        width={440}
        className="cash-approve-modal"
        centered
        destroyOnHidden
      >
        {current ? (
          <div className="cash-approve">
            <header className="cash-approve__head">
              <div className="cash-approve__badge" aria-hidden>
                <Banknote size={22} strokeWidth={1.75} />
              </div>
              <div className="cash-approve__head-copy">
                <p className="cash-approve__kicker">Cash payment</p>
                <h2>Confirm receipt</h2>
                <p className="cash-approve__sub">
                  Customer paid in cash — verify before approving
                </p>
              </div>
              <button
                type="button"
                className="cash-approve__close"
                aria-label="Close for now"
                onClick={() => setOpen(false)}
              >
                <X size={18} />
              </button>
            </header>

            <div className="cash-approve__amount">
              <div className="cash-approve__amount-top">
                <span>
                  {current.isPartial ? 'Partial amount due' : 'Amount due'}
                </span>
                {current.isPartial ? (
                  <span className="cash-approve__partial-chip">Partial</span>
                ) : null}
              </div>
              <strong>{formatInr(current.amount)}</strong>
              {current.isPartial && current.packageAmount ? (
                <div className="cash-approve__partial-meta">
                  <span>Full package {formatInr(current.packageAmount)}</span>
                  <span>
                    Remaining{' '}
                    {formatInr(
                      Math.max(
                        0,
                        Number(current.packageAmount) - Number(current.amount),
                      ),
                    )}
                  </span>
                  {current.purchaseId ? (
                    <span>Balance payment</span>
                  ) : (
                    <span>First installment</span>
                  )}
                </div>
              ) : null}
            </div>

            <dl className="cash-approve__grid">
              <div>
                <dt>
                  <UserRound size={14} />
                  Customer
                </dt>
                <dd>{current.customerName}</dd>
              </div>
              <div>
                <dt>
                  <Phone size={14} />
                  Mobile
                </dt>
                <dd>{current.customerMobile || '—'}</dd>
              </div>
              <div className="cash-approve__grid-span">
                <dt>
                  <Dumbbell size={14} />
                  Session
                </dt>
                <dd>{current.sessionName}</dd>
              </div>
              <div>
                <dt>
                  <UserRound size={14} />
                  Trainer
                </dt>
                <dd>{current.trainerName}</dd>
              </div>
              <div>
                <dt>
                  <Layers size={14} />
                  Sessions qty
                </dt>
                <dd>{current.qty}</dd>
              </div>
              <div className="cash-approve__grid-span">
                <dt>
                  <Building2 size={14} />
                  Branch
                </dt>
                <dd>{current.branchName || '—'}</dd>
              </div>
            </dl>

            {remaining > 0 ? (
              <p className="cash-approve__queue">
                {remaining} more pending after this
              </p>
            ) : null}

            <footer className="cash-approve__actions">
              <Button
                size="large"
                className="cash-approve__reject"
                disabled={busy}
                onClick={handleReject}
              >
                Reject
              </Button>
              <Button
                type="primary"
                size="large"
                className="cash-approve__approve"
                loading={busy}
                onClick={handleApprove}
              >
                Approve
              </Button>
            </footer>
          </div>
        ) : null}
      </Modal>

      {showLauncher ? (
        <button
          type="button"
          className="cash-approve-launcher"
          onClick={() => setOpen(true)}
        >
          <Banknote size={18} strokeWidth={2} />
          <span>
            {queue.length} cash pending
            <em>Review</em>
          </span>
        </button>
      ) : null}
    </>
  );
};
