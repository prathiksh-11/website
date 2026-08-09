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
import { useCallback, useEffect, useState } from 'react';
import {
  cashPaymentApi,
  type CashPaymentPending,
} from '@/api/cashPayment.api';
import { getNotificationSocket } from '@/lib/socket';
import { useAuthStore } from '@/store/auth.store';

export const CASH_PAYMENT_EVENT = 'gym:cash-payment-pending';
export const CASH_PAYMENT_REOPEN_EVENT = 'gym:cash-payment-reopen';

const formatInr = (amount: number) =>
  `₹${Number(amount || 0).toLocaleString('en-IN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;

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
  const id = String(payload.transaction_id ?? payload.id ?? '');
  return {
    id,
    transactionId: id,
    branchId:
      payload.branch_id != null ? String(payload.branch_id) : undefined,
    branchName: payload.branch_name
      ? String(payload.branch_name)
      : undefined,
    customerId:
      payload.customer_id != null ? String(payload.customer_id) : undefined,
    customerName: String(payload.customer_name || 'Customer'),
    customerMobile: payload.customer_mobile
      ? String(payload.customer_mobile)
      : undefined,
    trainerId:
      payload.trainer_id != null ? String(payload.trainer_id) : undefined,
    trainerName: String(payload.trainer_name || 'Trainer'),
    sessionId:
      payload.session_id != null ? String(payload.session_id) : undefined,
    sessionName: String(payload.session_name || 'Session'),
    amount: Number(payload.amount ?? 0),
    qty: Number(payload.qty ?? 1),
    paymentMethod: 'cash',
    paymentStatus: String(payload.payment_status || 'pending'),
    isPartial:
      payload.is_partial === true ||
      payload.is_partial === 'true' ||
      payload.is_partial === 1,
    packageAmount:
      payload.package_amount != null
        ? Number(payload.package_amount)
        : undefined,
    purchaseId:
      payload.purchase_id != null ? String(payload.purchase_id) : undefined,
    createdAt: payload.created_at ? String(payload.created_at) : undefined,
  };
};

export const CashPaymentApprovalHost = () => {
  const { message, modal } = App.useApp();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const userId = useAuthStore((s) => s.user?.id);
  const [queue, setQueue] = useState<CashPaymentPending[]>([]);
  const [busy, setBusy] = useState(false);
  const [open, setOpen] = useState(true);

  const current = queue[0] ?? null;
  const remaining = Math.max(queue.length - 1, 0);
  const showModal = open && Boolean(current);
  const showLauncher = !open && queue.length > 0;

  const removeFromQueue = useCallback((id: string) => {
    setQueue((prev) => prev.filter((item) => item.id !== id));
  }, []);

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
      const id = String(payload?.transaction_id ?? payload?.id ?? '');
      if (!id) return;
      removeFromQueue(id);
    };

    if (!socket.connected) socket.connect();
    pendingEvents.forEach((event) => socket.on(event, onPending));
    resolvedEvents.forEach((event) => socket.on(event, onResolved));

    return () => {
      pendingEvents.forEach((event) => socket.off(event, onPending));
      resolvedEvents.forEach((event) => socket.off(event, onResolved));
    };
  }, [isAuthenticated, userId, removeFromQueue]);

  useEffect(() => {
    const onFcm = (event: Event) => {
      const custom = event as CustomEvent<Record<string, unknown>>;
      const item = mapCashPaymentPayload(custom.detail || {});
      if (!item.id) return;
      setQueue((prev) => upsertQueue(prev, item));
      setOpen(true);
    };
    const onReopen = () => {
      setOpen(true);
      void loadPending();
    };
    window.addEventListener(CASH_PAYMENT_EVENT, onFcm);
    window.addEventListener(CASH_PAYMENT_REOPEN_EVENT, onReopen);
    return () => {
      window.removeEventListener(CASH_PAYMENT_EVENT, onFcm);
      window.removeEventListener(CASH_PAYMENT_REOPEN_EVENT, onReopen);
    };
  }, [loadPending]);

  const handleApprove = () => {
    if (!current || busy) return;
    modal.confirm({
      title: 'Confirm cash received?',
      content: `Approve cash payment of ${formatInr(current.amount)} from ${current.customerName}?`,
      okText: 'Approve',
      cancelText: 'Cancel',
      okButtonProps: { type: 'primary' },
      onOk: async () => {
        setBusy(true);
        try {
          await cashPaymentApi.approve(current.id);
          message.success('Cash payment approved');
          removeFromQueue(current.id);
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
    modal.confirm({
      title: 'Reject cash payment?',
      content: `Reject cash request from ${current.customerName} for ${current.sessionName}?`,
      okText: 'Reject',
      okButtonProps: { danger: true },
      cancelText: 'Cancel',
      onOk: async () => {
        setBusy(true);
        try {
          await cashPaymentApi.reject(current.id);
          message.success('Cash payment rejected');
          removeFromQueue(current.id);
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
