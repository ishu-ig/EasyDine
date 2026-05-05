import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { updateBooking } from '../Redux/ActionCreators/BookingActionCreators';
import { getResturent, updateResturent } from '../Redux/ActionCreators/ResturentActionCreators';
import { updateCheckout } from '../Redux/ActionCreators/CheckoutActionCreators';

const C = {
  primary:       'var(--primary)',
  primaryLight:  'rgba(200,64,10,0.07)',
  primaryBorder: 'rgba(200,64,10,0.16)',
  secondary:     'var(--secondary)',
  accent:        'var(--accent)',
  dark:          'var(--dark)',
  gray:          'var(--gray)',
  light:         'var(--light)',
  border:        'var(--border)',
  cardBg:        'var(--card-bg)',
  radius:        'var(--radius)',
  radiusSm:      'var(--radius-sm)',
  shadowSm:      'var(--shadow-sm)',
  shadowMd:      'var(--shadow-md)',
  transition:    'var(--transition)',
};

const S = {
  page: { background: C.light, minHeight: '100vh', padding: '48px 0 80px' },
  pageTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '2rem', fontWeight: 900,
    color: C.dark, marginBottom: 6,
  },
  pageSub: { fontSize: '0.88rem', color: C.gray, marginBottom: 36 },
  card: {
    background: '#fff',
    borderRadius: C.radius,
    boxShadow: C.shadowSm,
    border: `1px solid ${C.border}`,
    overflow: 'hidden',
    marginBottom: 24,
    transition: 'box-shadow 0.3s ease, transform 0.3s ease',
  },
  cardHeader: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'flex-start', flexWrap: 'wrap', gap: 12,
    padding: '18px 24px',
    borderBottom: `1px solid ${C.border}`,
    background: C.cardBg,
  },
  idLabel: {
    fontSize: '0.7rem', fontWeight: 700,
    color: C.gray, letterSpacing: '0.07em',
    textTransform: 'uppercase', marginBottom: 4,
  },
  idValue: {
    fontFamily: 'monospace',
    fontSize: '0.82rem', fontWeight: 600,
    color: C.dark,
    background: C.primaryLight,
    border: `1px solid ${C.primaryBorder}`,
    padding: '3px 10px', borderRadius: 6,
    display: 'inline-block',
  },
  createdAt: { fontSize: '0.78rem', color: C.gray, marginTop: 6, display: 'flex', alignItems: 'center', gap: 6 },
  statusPill: (ok) => ({
    display: 'inline-flex', alignItems: 'center', gap: 6,
    padding: '5px 14px', borderRadius: 50,
    fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.04em',
    background: ok ? 'rgba(22,163,74,0.1)' : 'rgba(239,68,68,0.1)',
    color: ok ? '#16a34a' : '#ef4444',
    border: ok ? '1px solid rgba(22,163,74,0.25)' : '1px solid rgba(239,68,68,0.25)',
  }),
  statusDot: (ok) => ({
    width: 7, height: 7, borderRadius: '50%',
    background: ok ? '#16a34a' : '#ef4444',
    animation: ok ? 'pulse 2s infinite' : 'none',
    flexShrink: 0,
  }),
  cardBody: { padding: '0 24px' },
  itemRow: {
    display: 'flex', alignItems: 'center',
    justifyContent: 'space-between', flexWrap: 'wrap',
    gap: 12, padding: '16px 0',
    borderBottom: `1px solid ${C.border}`,
  },
  itemName: {
    fontFamily: "'Playfair Display', serif",
    fontWeight: 700, fontSize: '0.95rem', color: C.dark,
    flex: '1 1 160px',
  },
  itemMeta: { fontSize: '0.78rem', color: C.gray, marginTop: 3 },
  itemBadge: (color) => ({
    display: 'inline-flex', alignItems: 'center', gap: 5,
    padding: '4px 12px', borderRadius: 50,
    fontSize: '0.75rem', fontWeight: 600,
    background: color === 'orange' ? C.primaryLight : 'rgba(100,116,139,0.08)',
    color: color === 'orange' ? C.primary : C.gray,
    border: `1px solid ${color === 'orange' ? C.primaryBorder : C.border}`,
  }),
  itemTotal: {
    fontFamily: "'Playfair Display', serif",
    fontWeight: 900, fontSize: '1rem', color: C.primary,
    textAlign: 'right', flexShrink: 0,
  },
  bookingRow: {
    display: 'flex', flexWrap: 'wrap', gap: 12,
    padding: '16px 0', borderBottom: `1px solid ${C.border}`,
  },
  bookingChip: {
    display: 'flex', alignItems: 'center', gap: 8,
    padding: '10px 16px', borderRadius: C.radiusSm,
    background: C.light, border: `1px solid ${C.border}`,
    flex: '1 1 140px',
  },
  bookingChipIcon: { color: C.primary, fontSize: '0.88rem', flexShrink: 0 },
  bookingChipLabel: { fontSize: '0.68rem', color: C.gray, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' },
  bookingChipVal: { fontSize: '0.85rem', fontWeight: 700, color: C.dark },
  cardFooter: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', flexWrap: 'wrap', gap: 12,
    padding: '16px 24px',
    background: C.cardBg,
    borderTop: `1px solid ${C.border}`,
  },
  paymentInfo: { display: 'flex', flexWrap: 'wrap', gap: 16 },
  payLabel: { fontSize: '0.7rem', color: C.gray, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 },
  payValue: { fontSize: '0.88rem', fontWeight: 600, color: C.dark },
  payStatus: (pending) => ({
    fontSize: '0.82rem', fontWeight: 700,
    color: pending ? '#ef4444' : '#16a34a',
    display: 'flex', alignItems: 'center', gap: 5,
  }),
  totalAmt: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '1.3rem', fontWeight: 900, color: C.primary,
  },
  totalLabel: { fontSize: '0.7rem', color: C.gray, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 },
  btnRow: { display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' },
  cancelBtn: {
    padding: '8px 20px', borderRadius: 50,
    border: '1.5px solid rgba(239,68,68,0.5)',
    background: 'rgba(239,68,68,0.06)',
    color: '#ef4444', fontWeight: 700,
    fontSize: '0.82rem', cursor: 'pointer',
    transition: C.transition,
    display: 'flex', alignItems: 'center', gap: 6,
  },
  disabledBtn: {
    padding: '8px 20px', borderRadius: 50,
    border: `1.5px solid ${C.border}`,
    background: C.light, color: C.gray,
    fontWeight: 600, fontSize: '0.82rem',
    cursor: 'not-allowed', opacity: 0.6,
    display: 'flex', alignItems: 'center', gap: 6,
  },
  viewBtn: {
    padding: '8px 20px', borderRadius: 50,
    border: `1.5px solid ${C.primaryBorder}`,
    background: C.primaryLight, color: C.primary,
    fontWeight: 700, fontSize: '0.82rem',
    textDecoration: 'none',
    display: 'inline-flex', alignItems: 'center', gap: 6,
    transition: C.transition,
  },
  empty: {
    padding: '64px 24px', textAlign: 'center',
    background: '#fff', borderRadius: C.radius,
    border: `1px dashed ${C.primaryBorder}`,
    boxShadow: C.shadowSm,
  },
  emptyIcon: { fontSize: '3.5rem', color: C.border, display: 'block', marginBottom: 16 },
  emptyTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '1.4rem', fontWeight: 900,
    color: C.dark, marginBottom: 8,
  },
  emptyText: { fontSize: '0.88rem', color: C.gray, marginBottom: 24 },
  shopBtn: {
    display: 'inline-flex', alignItems: 'center', gap: 8,
    padding: '12px 28px', borderRadius: 50,
    background: C.primary, color: '#fff',
    fontWeight: 700, fontSize: '0.92rem',
    textDecoration: 'none',
    boxShadow: '0 4px 20px rgba(200,64,10,0.3)',
    transition: C.transition,
  },
};

// ─── Cancellation eligibility helpers ─────────────────────────────────────────

/**
 * ORDER cancel rules:
 *   Show cancel button when:
 *     - COD  + paymentStatus === 'Pending'   (hasn't paid yet, can back out)
 *     - Net Banking + paymentStatus === 'Done'  (paid online, refund path)
 *   Hide cancel button when:
 *     - COD  + paymentStatus === 'Done'      (paid cash on delivery, no cancel)
 *     - Order is already Cancelled / terminal statuses
 */
function canCancelOrder(item) {
  if (!item) return false;

  // Already cancelled or in a terminal delivery state — never show cancel
  const terminalStatuses = ['Cancelled', 'Delivered'];
  if (terminalStatuses.includes(item.orderStatus)) return false;

  const mode    = (item.paymentMode   || '').trim().toUpperCase();
  const status  = (item.paymentStatus || '').trim().toLowerCase();
  const isPaid  = status === 'done';
  const isPending = status === 'pending';

  if (mode === 'COD') {
    // COD + Pending → allow cancel; COD + Done → disallow
    return isPending;
  }

  // Net Banking (or any online mode) + Done → allow cancel (refund path)
  return isPaid;
}

/**
 * BOOKING cancel rules (same payment logic, plus time-window):
 *   Show active cancel button when:
 *     - Booking is still active (bookingStatus === 'true')
 *     - AND payment conditions pass (same as order rules above)
 *     - AND within the 5-hour cancellation window
 *   Show disabled "Window Expired" when:
 *     - Conditions above pass but time window has lapsed
 *   Show nothing (or "Cancelled" badge) when:
 *     - bookingStatus === 'false'  (already cancelled)
 *     - OR payment conditions don't allow cancel
 */
function canCancelBooking(item, cancelStatus) {
  if (!item) return { eligible: false, windowOpen: false };
  if (item.bookingStatus !== 'true') return { eligible: false, windowOpen: false };

  const mode    = (item.paymentMode   || '').trim().toUpperCase();
  const status  = (item.paymentStatus || '').trim().toLowerCase();
  const isPaid  = status === 'done';
  const isPending = status === 'pending';

  let paymentAllows = false;
  if (mode === 'COD') {
    paymentAllows = isPending;       // COD + Pending
  } else {
    paymentAllows = isPaid;          // Net Banking + Done
  }

  if (!paymentAllows) return { eligible: false, windowOpen: false };

  // Payment allows — now check time window
  const windowOpen = !!cancelStatus[item._id];
  return { eligible: true, windowOpen };
}

// ──────────────────────────────────────────────────────────────────────────────

export default function Order({ title, data = [] }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [cancelStatus, setCancelStatus] = useState({});
  const ResturentStateData = useSelector(state => state.ResturentStateData);
  const isOrder = title === 'Order';

  useEffect(() => {
    const updated = {};
    data.forEach(item => {
      const diff = (Date.now() - new Date(item.createdAt).getTime()) / 3_600_000;
      updated[item._id] = diff <= 5;
    });
    setCancelStatus(updated);
  }, [data]);

  useEffect(() => { dispatch(getResturent()); });

  function updateStatus(_id) {
    const item = data.find(x => x._id === _id);
    const { eligible, windowOpen } = canCancelBooking(item, cancelStatus);
    if (!eligible || !windowOpen) {
      alert('Cancellation is only allowed within 5 hours of booking.');
      return;
    }
    if (!window.confirm('Are you sure you want to cancel your booking?')) return;
    if (item) {
      dispatch(updateBooking({ ...item, bookingStatus: false }));
      setCancelStatus(p => ({ ...p, [_id]: false }));
      const rest = ResturentStateData.find(x => x._id === item.resturent._id);
      if (rest) dispatch(updateResturent({ ...rest, seatAvailable: rest.seatAvailable + item.seats }));
    }
    navigate(0);
  }

  function updateOrder(_id) {
    if (!window.confirm('Are you sure you want to cancel your Order?')) return;
    const item = data.find(x => x._id === _id);
    if (item) dispatch(updateCheckout({ ...item, orderStatus: 'Cancelled' }));
  }

  const isActive = (item) => isOrder
    ? item?.orderStatus !== 'Cancelled'
    : item?.bookingStatus === 'true';

  return (
    <>
      <style>{`
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(1.35)} }
        .ord-card:hover  { box-shadow: var(--shadow-md) !important; transform: translateY(-2px); }
        .ord-cancel:hover{ background: rgba(239,68,68,0.12) !important; border-color: #ef4444 !important; }
        .ord-view:hover  { background: rgba(200,64,10,0.13) !important; }
        .ord-shop:hover  { background: var(--accent) !important; transform: translateY(-2px); box-shadow: 0 8px 28px rgba(28,16,9,0.2) !important; }
      `}</style>

      <div style={S.page}>
        <div className="container-xxl">

          {/* Page heading */}
          <div className="mb-4">
            <h1 style={S.pageTitle}>
              <i className={`fa ${isOrder ? 'fa-shopping-bag' : 'fa-calendar-check'} me-3`}
                 style={{ color: 'var(--primary)', fontSize: '1.6rem' }}></i>
              {isOrder ? 'Your Orders' : 'Your Bookings'}
            </h1>
            <p style={S.pageSub}>
              {isOrder
                ? `${data.length} order${data.length !== 1 ? 's' : ''} placed`
                : `${data.length} booking${data.length !== 1 ? 's' : ''} made`}
            </p>
          </div>

          {Array.isArray(data) && data.length ? data.map(item => (
            <div key={item?._id} style={S.card} className="ord-card">

              {/* ── Card Header ── */}
              <div style={S.cardHeader}>
                <div>
                  <div style={S.idLabel}>{isOrder ? 'Order ID' : 'Booking ID'}</div>
                  <div style={S.idValue}>{item?._id}</div>
                  <div style={S.createdAt}>
                    <i className="fa fa-clock" style={{ color: 'var(--primary)', fontSize: '0.75rem' }}></i>
                    {new Date(item?.createdAt).toLocaleString('en-IN', {
                      dateStyle: 'medium', timeStyle: 'short',
                    })}
                  </div>
                </div>
                <span style={S.statusPill(isActive(item))}>
                  <span style={S.statusDot(isActive(item))} />
                  {isOrder
                    ? (item?.orderStatus || 'Placed')
                    : (item?.bookingStatus === 'true' ? 'Confirmed' : 'Cancelled')}
                </span>
              </div>

              {/* ── Card Body ── */}
              <div style={S.cardBody}>
                {isOrder ? (
                  item?.products?.map(prod => (
                    <div key={prod._id} style={S.itemRow}>
                      <div style={{ flex: '1 1 180px' }}>
                        <div style={S.itemName}>{prod.product.name}</div>
                        <div style={S.itemMeta}>
                          <span style={S.itemBadge('orange')}>
                            <i className="fa fa-times" style={{ fontSize: '0.65rem' }}></i>
                            {prod.qty} qty
                          </span>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.78rem', color: 'var(--gray)', marginBottom: 3 }}>
                          ₹{prod.product.finalPrice} × {prod.qty}
                        </div>
                        <div style={S.itemTotal}>₹{prod.total}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={S.bookingRow}>
                    <div style={S.bookingChip}>
                      <i className="fa fa-store" style={S.bookingChipIcon}></i>
                      <div>
                        <div style={S.bookingChipLabel}>Restaurant</div>
                        <div style={S.bookingChipVal}>{item?.resturent?.name || '—'}</div>
                      </div>
                    </div>
                    <div style={S.bookingChip}>
                      <i className="fa fa-calendar" style={S.bookingChipIcon}></i>
                      <div>
                        <div style={S.bookingChipLabel}>Date</div>
                        <div style={S.bookingChipVal}>{item?.date || '—'}</div>
                      </div>
                    </div>
                    <div style={S.bookingChip}>
                      <i className="fa fa-clock" style={S.bookingChipIcon}></i>
                      <div>
                        <div style={S.bookingChipLabel}>Time Slot</div>
                        <div style={S.bookingChipVal}>{item?.time || '—'}</div>
                      </div>
                    </div>
                    <div style={S.bookingChip}>
                      <i className="fa fa-chair" style={S.bookingChipIcon}></i>
                      <div>
                        <div style={S.bookingChipLabel}>Seats</div>
                        <div style={S.bookingChipVal}>{item?.seats}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* ── Card Footer ── */}
              <div style={S.cardFooter}>
                {/* Payment info */}
                <div style={S.paymentInfo}>
                  <div>
                    <div style={S.payLabel}>Payment Mode</div>
                    <div style={S.payValue}>
                      <i className={`fa ${item?.paymentMode === 'COD' ? 'fa-money-bill-wave' : 'fa-university'} me-1`}
                         style={{ color: 'var(--primary)', fontSize: '0.8rem' }}></i>
                      {item?.paymentMode || 'N/A'}
                    </div>
                  </div>
                  <div>
                    <div style={S.payLabel}>Payment Status</div>
                    <div style={S.payStatus(item?.paymentStatus === 'Pending')}>
                      <i className={`fa ${item?.paymentStatus === 'Pending' ? 'fa-hourglass-half' : 'fa-check-circle'}`}
                         style={{ fontSize: '0.8rem' }}></i>
                      {item?.paymentStatus || 'N/A'}
                    </div>
                  </div>
                </div>

                {/* Total + Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={S.totalLabel}>Total Amount</div>
                    <div style={S.totalAmt}>₹{item?.total}</div>
                  </div>

                  <div style={S.btnRow}>

                    {/* ── ORDER cancel logic ── */}
                    {isOrder ? (
                      <>
                        {canCancelOrder(item) && (
                          <button
                            onClick={() => updateOrder(item?._id)}
                            style={S.cancelBtn}
                            className="ord-cancel"
                          >
                            <i className="fa fa-times-circle" style={{ fontSize: '0.8rem' }}></i>
                            Cancel
                          </button>
                        )}
                        <Link to={`/order-detail/${item?._id}`} style={S.viewBtn} className="ord-view">
                          <i className="fa fa-eye" style={{ fontSize: '0.8rem' }}></i>
                          View Details
                        </Link>
                      </>
                    ) : (
                      /* ── BOOKING cancel logic ── */
                      (() => {
                        const { eligible, windowOpen } = canCancelBooking(item, cancelStatus);

                        return (
                          <>
                            {item.bookingStatus === 'false' ? (
                              // Already cancelled — show static badge
                              <span style={S.disabledBtn}>
                                <i className="fa fa-ban" style={{ fontSize: '0.8rem' }}></i>
                                Cancelled
                              </span>
                            ) : eligible && windowOpen ? (
                              // Payment allows + within window → active cancel button
                              <button
                                onClick={() => updateStatus(item?._id)}
                                style={S.cancelBtn}
                                className="ord-cancel"
                              >
                                <i className="fa fa-times-circle" style={{ fontSize: '0.8rem' }}></i>
                                Cancel Booking
                              </button>
                            ) : eligible && !windowOpen ? (
                              // Payment allows but window expired → disabled button
                              <span style={{
                                ...S.disabledBtn,
                                border: '1.5px solid rgba(200,64,10,0.2)',
                                background: 'rgba(200,64,10,0.04)',
                                color: 'var(--gray)',
                              }}>
                                <i className="fa fa-clock" style={{ fontSize: '0.78rem', color: 'var(--primary)', opacity: 0.6 }}></i>
                                Window Expired
                              </span>
                            ) : null
                            /* COD+Done or Net Banking+Pending → render nothing (no cancel option) */
                            }

                            <Link
                              to={`/booking-detail/${item?._id}`}
                              style={S.viewBtn}
                              className="ord-view"
                            >
                              <i className="fa fa-eye" style={{ fontSize: '0.8rem' }}></i>
                              View Details
                            </Link>
                          </>
                        );
                      })()
                    )}

                  </div>
                </div>
              </div>

            </div>
          )) : (
            <div style={S.empty}>
              <i className={`fa ${isOrder ? 'fa-shopping-bag' : 'fa-calendar-times'}`} style={S.emptyIcon}></i>
              <div style={S.emptyTitle}>No {isOrder ? 'Orders' : 'Bookings'} Yet</div>
              <p style={S.emptyText}>
                {isOrder
                  ? "You haven't placed any orders. Explore our menu and find something delicious!"
                  : "You haven't made any restaurant bookings. Reserve your table today!"}
              </p>
              <Link to={isOrder ? '/product' : '/resturent'} style={S.shopBtn} className="ord-shop">
                <i className={`fa ${isOrder ? 'fa-utensils' : 'fa-store'}`}></i>
                {isOrder ? 'Browse Menu' : 'Find Restaurants'}
              </Link>
            </div>
          )}

        </div>
      </div>
    </>
  );
}