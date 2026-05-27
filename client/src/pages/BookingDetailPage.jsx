import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getBooking } from '../Redux/ActionCreators/BookingActionCreators';

const C = {
  primary: '#3B6D11',
  primaryLight: 'rgba(63,109,17,0.10)',
  primaryBorder: 'rgba(63,109,17,0.14)',
  dark: '#173404',
  gray: '#5F5E5A',
  warm: '#F6FBF0',
  card: {
    background: '#F6FBF0',
    borderRadius: 18,
    border: '1px solid rgba(63,109,17,0.13)',
    boxShadow: '0 4px 18px rgba(23,52,4,0.07)',
    padding: '22px 26px',
    marginBottom: 18,
  },
};

function InfoRow({ icon, label, value }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 13, padding: '11px 0', borderBottom: '1px solid rgba(63,109,17,0.07)' }}>
      <div style={{ width: 30, height: 30, flexShrink: 0, background: C.primaryLight, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <i className={`fa ${icon}`} style={{ color: C.primary, fontSize: 12 }}></i>
      </div>
      <div>
        <p style={{ margin: '0 0 2px', fontSize: '0.73rem', color: C.gray, fontWeight: 500 }}>{label}</p>
        <p style={{ margin: 0, fontSize: '0.88rem', color: value ? C.dark : C.gray, fontWeight: value ? 600 : 400 }}>{value || 'N/A'}</p>
      </div>
    </div>
  );
}

const STATUS_STEPS = ['Booking Placed', 'Confirmed', 'Seated', 'Completed'];
const stepIcons    = ['fa-calendar-check', 'fa-check-circle', 'fa-chair', 'fa-star'];

export default function BookingDetailPage() {
  const { _id } = useParams();
  const BookingStateData = useSelector(state => state.BookingStateData);
  const [booking, setBooking]               = useState(null);
  const [invoiceLoading, setInvoiceLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => { dispatch(getBooking()); }, [dispatch]);

  useEffect(() => {
    if (BookingStateData?.length) {
      setBooking(BookingStateData.find(x => x._id === _id) || {});
    }
  }, [BookingStateData, _id]);

  // ── Invoice generator ──────────────────────────────────────────────────────
  const generateInvoice = async () => {
    if (invoiceLoading) return;
    setInvoiceLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_SERVER}/api/bookinginvoice/generate`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            authorization: localStorage.getItem('token'),
          },
          body: JSON.stringify({ bookingId: _id }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        alert(data.reason || 'Invoice generation failed.');
        return;
      }

      const blob = await response.blob();
      const url  = window.URL.createObjectURL(blob);
      window.open(url, '_blank');
      setTimeout(() => window.URL.revokeObjectURL(url), 10000);
    } catch (err) {
      console.error('Invoice error:', err);
      alert('Could not connect to server. Please try again.');
    } finally {
      setInvoiceLoading(false);
    }
  };

  // ── Loading screen ─────────────────────────────────────────────────────────
  if (!booking) return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg,#EAF3DE,#F6FBF0)' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 46, height: 46, border: `3px solid ${C.primary}`, borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 14px' }}></div>
        <p style={{ color: C.gray, fontFamily: "'DM Sans',sans-serif" }}>Loading booking details…</p>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  const isCompleted     = booking.bookingStatus === 'Completed';
  const isPaid          = booking.paymentStatus === 'Done';
  const isCancelled     = booking.bookingStatus === 'Cancelled';
  const currentStep     = STATUS_STEPS.indexOf(booking.bookingStatus);
  const progressPct     = Math.max(0, (currentStep / (STATUS_STEPS.length - 1)) * 100);

  // Invoice is downloadable only when payment is done and booking isn't cancelled
  const invoiceEnabled  = isPaid && !isCancelled;

  return (
    <div style={{ background: 'linear-gradient(135deg,#EAF3DE 0%,#F6FBF0 100%)', minHeight: '80vh', padding: '48px 16px' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>

        {/* ── Header ── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <span style={{ display: 'inline-block', background: C.primaryLight, color: C.primary, fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '5px 16px', borderRadius: 50, marginBottom: 10 }}>
              Booking Details
            </span>
            <h2 style={{ fontFamily: "'Lora',serif", fontSize: '1.9rem', fontWeight: 700, color: C.dark, margin: 0 }}>
              Table Booking
            </h2>
          </div>
          <Link
            to="/booking"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '9px 18px', background: C.primaryLight, color: C.primary, borderRadius: 50, textDecoration: 'none', fontWeight: 600, fontSize: '0.84rem', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.background = C.primary; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={e => { e.currentTarget.style.background = C.primaryLight; e.currentTarget.style.color = C.primary; }}
          >
            <i className="fa fa-arrow-left" style={{ fontSize: 11 }}></i> Back to Bookings
          </Link>
        </div>

        {/* ── Status Tracker ── */}
        <div style={{ ...C.card }}>
          <h6 style={{ fontFamily: "'Lora',serif", fontSize: '1rem', fontWeight: 700, color: C.dark, marginBottom: 22 }}>Booking Progress</h6>
          <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
            <div style={{ position: 'absolute', top: 17, left: '10%', right: '10%', height: 3, background: 'rgba(63,109,17,0.15)', borderRadius: 4 }}>
              <div style={{ height: '100%', width: `${progressPct}%`, background: C.primary, borderRadius: 4, transition: 'width 0.6s ease' }}></div>
            </div>
            {STATUS_STEPS.map((step, i) => {
              const done = i <= currentStep;
              return (
                <div key={step} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, position: 'relative' }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: done ? C.primary : '#fff', border: `2.5px solid ${done ? C.primary : 'rgba(63,109,17,0.25)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8, transition: 'all 0.3s', zIndex: 1 }}>
                    <i className={`fa ${stepIcons[i]}`} style={{ fontSize: 13, color: done ? '#fff' : 'rgba(63,109,17,0.35)' }}></i>
                  </div>
                  <span style={{ fontSize: '0.68rem', fontWeight: done ? 700 : 400, color: done ? C.primary : C.gray, textAlign: 'center', maxWidth: 68, lineHeight: 1.3 }}>{step}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Two-column ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 18 }} className="booking-detail-grid">

          {/* Booking Info */}
          <div style={{ ...C.card, marginBottom: 0 }}>
            <h6 style={{ fontFamily: "'Lora',serif", fontSize: '1rem', fontWeight: 700, color: C.dark, marginBottom: 16 }}>Booking Info</h6>

            <div style={{ background: C.primaryLight, borderRadius: 10, padding: '10px 14px', marginBottom: 14 }}>
              <p style={{ margin: '0 0 2px', fontSize: '0.72rem', color: C.gray, fontWeight: 500 }}>Booking ID</p>
              <p style={{ margin: 0, fontSize: '0.76rem', fontWeight: 700, color: C.dark, wordBreak: 'break-all' }}>{booking._id || 'N/A'}</p>
            </div>

            <InfoRow icon="fa-calendar"   label="Date"  value={booking.date} />
            <InfoRow icon="fa-clock"      label="Time"  value={booking.time} />
            <InfoRow icon="fa-users"      label="Seats" value={booking.seats ? `${booking.seats} seat${booking.seats > 1 ? 's' : ''}` : null} />

            {/* Booking Status */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 13, padding: '11px 0', borderBottom: '1px solid rgba(63,109,17,0.07)' }}>
              <div style={{ width: 30, height: 30, flexShrink: 0, background: C.primaryLight, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="fa fa-check-circle" style={{ color: C.primary, fontSize: 12 }}></i>
              </div>
              <div>
                <p style={{ margin: '0 0 2px', fontSize: '0.73rem', color: C.gray, fontWeight: 500 }}>Booking Status</p>
                <span style={{ display: 'inline-block', padding: '3px 12px', borderRadius: 50, fontSize: '0.75rem', fontWeight: 700, background: isCompleted ? 'rgba(63,109,17,0.12)' : C.primaryLight, color: isCompleted ? '#27500A' : C.primary }}>
                  {booking.bookingStatus || 'N/A'}
                </span>
              </div>
            </div>

            {/* Payment */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 13, padding: '11px 0' }}>
              <div style={{ width: 30, height: 30, flexShrink: 0, background: C.primaryLight, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="fa fa-credit-card" style={{ color: C.primary, fontSize: 12 }}></i>
              </div>
              <div>
                <p style={{ margin: '0 0 2px', fontSize: '0.73rem', color: C.gray, fontWeight: 500 }}>Payment</p>
                <p style={{ margin: '0 0 4px', fontSize: '0.88rem', color: C.dark, fontWeight: 600 }}>{booking.paymentMode || 'COD'}</p>
                <span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: 50, fontSize: '0.72rem', fontWeight: 700, background: isPaid ? 'rgba(63,109,17,0.12)' : '#FCEBEB', color: isPaid ? '#27500A' : '#A32D2D' }}>
                  {booking.paymentStatus || 'Pending'}
                </span>
              </div>
            </div>
          </div>

          {/* Restaurant Info */}
          <div style={{ ...C.card, marginBottom: 0 }}>
            <h6 style={{ fontFamily: "'Lora',serif", fontSize: '1rem', fontWeight: 700, color: C.dark, marginBottom: 16 }}>Restaurant</h6>
            <InfoRow icon="fa-utensils"       label="Name"      value={booking.resturent?.name} />
            <InfoRow icon="fa-map-marker-alt" label="Address"   value={booking.resturent?.address} />
            <InfoRow icon="fa-phone"          label="Phone"     value={booking.resturent?.phone} />
            <InfoRow icon="fa-tag"            label="Cuisine"   value={booking.resturent?.cuisine} />
            <InfoRow icon="fa-star"           label="Rating"    value={booking.resturent?.rating ? `${booking.resturent.rating} / 5` : null} />
            <InfoRow icon="fa-clock"          label="Booked On" value={booking.createdAt ? new Date(booking.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : null} />
          </div>
        </div>

        {/* ── Pricing Summary ── */}
        <div style={{ ...C.card }}>
          <h6 style={{ fontFamily: "'Lora',serif", fontSize: '1rem', fontWeight: 700, color: C.dark, marginBottom: 18 }}>Pricing Summary</h6>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 90px 100px', gap: 8, padding: '8px 12px', background: C.primaryLight, borderRadius: 10, marginBottom: 8 }}>
            {['Description', 'Per Seat', 'Total'].map(h => (
              <span key={h} style={{ fontSize: '0.7rem', fontWeight: 700, color: C.primary, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</span>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 90px 100px', gap: 8, padding: '12px', borderBottom: '1px solid rgba(63,109,17,0.07)', alignItems: 'center' }}>
            <span style={{ fontWeight: 600, fontSize: '0.9rem', color: C.dark }}>
              Table Reservation ({booking.seats || 0} seat{booking.seats > 1 ? 's' : ''})
            </span>
            <span style={{ color: C.gray, fontSize: '0.87rem' }}>
              {booking.seats && booking.total ? `₹${Math.round(booking.total / booking.seats)}` : '—'}
            </span>
            <span style={{ fontWeight: 700, color: C.dark }}>₹{booking.total || 0}</span>
          </div>

          {/* Total + Invoice button row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 12px 0', borderTop: '1px solid rgba(63,109,17,0.12)', marginTop: 8, flexWrap: 'wrap', gap: 12 }}>

            {/* ── Invoice Button (single, unified) ── */}
            <button
              onClick={invoiceEnabled && !invoiceLoading ? generateInvoice : undefined}
              disabled={!invoiceEnabled || invoiceLoading}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 9,
                padding: '11px 22px',
                background: (!invoiceEnabled || invoiceLoading) ? 'rgba(63,109,17,0.45)' : C.primary,
                color: '#fff',
                border: 'none',
                borderRadius: 50,
                fontWeight: 700,
                fontSize: '0.84rem',
                fontFamily: "'DM Sans',sans-serif",
                cursor: (!invoiceEnabled || invoiceLoading) ? 'not-allowed' : 'pointer',
                transition: 'all 0.25s',
                boxShadow: (!invoiceEnabled || invoiceLoading) ? 'none' : '0 4px 14px rgba(63,109,17,0.30)',
              }}
              onMouseEnter={e => { if (invoiceEnabled && !invoiceLoading) e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              {invoiceLoading ? (
                <>
                  <div style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }}></div>
                  Generating…
                </>
              ) : (
                <>
                  <i className="fa fa-file-invoice" style={{ fontSize: 13 }}></i>
                  Download Invoice
                </>
              )}
            </button>

            {/* Total */}
            <div style={{ textAlign: 'right' }}>
              <p style={{ margin: '0 0 3px', fontSize: '0.82rem', color: C.gray }}>Total Amount</p>
              <p style={{ margin: 0, fontSize: '1.4rem', fontWeight: 700, color: C.primary, fontFamily: "'Lora',serif" }}>
                ₹{booking.total || 'N/A'}
              </p>
            </div>
          </div>
        </div>

      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg) } }
        @media(max-width:600px){
          .booking-detail-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}