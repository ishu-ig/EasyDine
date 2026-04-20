import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getBooking } from '../Redux/ActionCreators/BookingActionCreators';
import HeroSection from '../Components/HeroSection';

/* ── Detail row used in the confirmation card ── */
function DetailRow({ icon, label, value, valueStyle }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start',
      justifyContent: 'space-between', gap: 16,
      padding: '14px 0',
      borderBottom: '1px solid var(--border)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--gray)', fontSize: '0.85rem', fontWeight: 600 }}>
        <i className={`fa ${icon}`} style={{ color: 'var(--primary)', fontSize: '0.88rem', width: 18, textAlign: 'center' }}></i>
        {label}
      </div>
      <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--dark)', textAlign: 'right', maxWidth: '58%', ...valueStyle }}>
        {value}
      </div>
    </div>
  );
}

export default function ResturentBookingPage() {
  const { _id }    = useParams();
  const dispatch   = useDispatch();
  const navigate   = useNavigate();
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const BookingStateData = useSelector(state => state.BookingStateData);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        await dispatch(getBooking(_id));
      } catch (err) {
        setError('Failed to fetch booking data.');
      } finally {
        setLoading(false);
      }
    })();
  }, [dispatch, _id]);

  useEffect(() => {
    if (BookingStateData.length > 0) {
      const booking = BookingStateData.find(x => x._id === _id);
      if (booking) setData(booking);
      else { setError('Booking not found.'); navigate(0); }
    }
  }, [BookingStateData, _id]);

  /* ── Loading ── */
  if (loading) return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16, background: 'var(--light)' }}>
      <div style={{
        width: 52, height: 52, borderRadius: '50%',
        border: '3px solid var(--border)',
        borderTopColor: 'var(--primary)',
        animation: 'rbp-spin 0.8s linear infinite',
      }} />
      <div style={{ color: 'var(--gray)', fontSize: '0.9rem', fontWeight: 500 }}>Loading booking details…</div>
    </div>
  );

  /* ── Error ── */
  if (error) return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--light)' }}>
      <div style={{ textAlign: 'center', padding: 40 }}>
        <i className="fa fa-exclamation-circle" style={{ fontSize: '3rem', color: '#ef4444', display: 'block', marginBottom: 16 }}></i>
        <div style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.2rem', fontWeight: 700, color: 'var(--dark)', marginBottom: 8 }}>Something went wrong</div>
        <div style={{ color: 'var(--gray)', fontSize: '0.88rem' }}>{error}</div>
      </div>
    </div>
  );

  if (!data) return null;

  const isConfirmed     = data.bookingStatus === true || data.bookingStatus === 'true';
  const isPaid          = data.paymentStatus === 'Paid';

  return (
    <>
      <style>{`
        @keyframes rbp-spin { to { transform:rotate(360deg); } }
        @keyframes rbp-pop {
          from { opacity:0; transform:scale(0.88) translateY(24px); }
          to   { opacity:1; transform:scale(1) translateY(0); }
        }
        @keyframes rbp-checkIn {
          0%   { transform:scale(0) rotate(-20deg); opacity:0; }
          70%  { transform:scale(1.15) rotate(4deg); }
          100% { transform:scale(1) rotate(0); opacity:1; }
        }
        .rbp-card  { animation: rbp-pop 0.5s cubic-bezier(.4,0,.2,1) both; }
        .rbp-check { animation: rbp-checkIn 0.6s cubic-bezier(.4,0,.2,1) 0.2s both; }
        .rbp-home:hover { background: var(--accent) !important; transform:translateY(-2px); box-shadow:0 10px 32px rgba(28,16,9,0.22) !important; }
        .rbp-back:hover { background: rgba(200,64,10,0.1) !important; border-color:var(--primary) !important; }
      `}</style>

      <HeroSection title="Booking Confirmation" />

      <div style={{ background: 'var(--light)', padding: '60px 0 80px' }}>
        <div className="container">
          <div style={{ maxWidth: 620, margin: '0 auto' }}>

            {/* ── Success banner ── */}
            <div
              className="rbp-card"
              style={{
                background: '#fff',
                borderRadius: 'var(--radius)',
                boxShadow: 'var(--shadow-lg)',
                overflow: 'hidden',
                border: '1px solid var(--border)',
              }}
            >
              {/* Coloured top strip */}
              <div style={{
                background: isConfirmed
                  ? 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)'
                  : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                padding: '36px 32px',
                textAlign: 'center',
              }}>
                {/* Animated check / cross icon */}
                <div className="rbp-check" style={{
                  width: 72, height: 72, borderRadius: '50%',
                  background: 'rgba(255,255,255,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 16px',
                  border: '2.5px solid rgba(255,255,255,0.4)',
                }}>
                  <i
                    className={`fa ${isConfirmed ? 'fa-check' : 'fa-times'}`}
                    style={{ fontSize: '1.8rem', color: '#fff' }}
                  ></i>
                </div>
                <div style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: '1.5rem', fontWeight: 900,
                  color: '#fff', marginBottom: 6,
                }}>
                  {isConfirmed ? 'Booking Confirmed!' : 'Booking Cancelled'}
                </div>
                <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)' }}>
                  {isConfirmed
                    ? 'Your table has been reserved. We look forward to seeing you!'
                    : 'This booking has been cancelled. You can make a new one anytime.'}
                </div>
              </div>

              {/* ── Details body ── */}
              <div style={{ padding: '28px 32px' }}>

                {/* Booking ID chip */}
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '12px 16px', borderRadius: 'var(--radius-sm)',
                  background: 'rgba(200,64,10,0.06)',
                  border: '1px solid rgba(200,64,10,0.14)',
                  marginBottom: 20,
                }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--gray)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                    Booking ID
                  </div>
                  <div style={{ fontFamily: 'monospace', fontSize: '0.82rem', fontWeight: 600, color: 'var(--dark)' }}>
                    {data._id}
                  </div>
                </div>

                {/* Restaurant info */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '16px', borderRadius: 'var(--radius-sm)',
                  background: 'var(--card-bg)', border: '1px solid var(--border)',
                  marginBottom: 20,
                }}>
                  <div style={{
                    width: 46, height: 46, borderRadius: '50%',
                    background: 'rgba(200,64,10,0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <i className="fa fa-store" style={{ color: 'var(--primary)', fontSize: '1.1rem' }}></i>
                  </div>
                  <div>
                    <div style={{ fontFamily: "'Playfair Display',serif", fontWeight: 800, fontSize: '1rem', color: 'var(--dark)' }}>
                      {data.resturent?.name || 'N/A'}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--gray)', marginTop: 2 }}>
                      <i className="fa fa-map-marker-alt me-1" style={{ color: 'var(--primary)', fontSize: '0.72rem' }}></i>
                      {data.resturent?.address || 'N/A'}
                    </div>
                  </div>
                </div>

                {/* Detail rows */}
                <DetailRow icon="fa-phone"          label="Contact"           value={data.resturent?.phone || 'N/A'} />
                <DetailRow icon="fa-calendar"       label="Reservation Date"  value={data.date} />
                <DetailRow icon="fa-clock"          label="Time Slot"         value={data.time} />
                <DetailRow icon="fa-chair"          label="Seats"             value={data.seats} />
                <DetailRow icon="fa-tag"            label="Price / Seat"      value={`₹ ${data.resturent?.finalPrice}`} />

                {/* Total cost highlight */}
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '16px 0', borderBottom: '1px solid var(--border)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--gray)', fontSize: '0.85rem', fontWeight: 600 }}>
                    <i className="fa fa-receipt" style={{ color: 'var(--primary)', fontSize: '0.88rem', width: 18, textAlign: 'center' }}></i>
                    Total Cost
                  </div>
                  <div style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.3rem', fontWeight: 900, color: 'var(--primary)' }}>
                    ₹ {data.total}
                  </div>
                </div>

                {/* Payment row */}
                <div style={{ display: 'flex', gap: 16, marginTop: 16, flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, padding: '12px 16px', borderRadius: 'var(--radius-sm)', background: 'var(--light)', border: '1px solid var(--border)' }}>
                    <div style={{ fontSize: '0.68rem', color: 'var(--gray)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Payment Mode</div>
                    <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--dark)', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <i className={`fa ${data.paymentMode === 'COD' ? 'fa-money-bill-wave' : 'fa-university'}`} style={{ color: 'var(--primary)', fontSize: '0.82rem' }}></i>
                      {data.paymentMode}
                    </div>
                  </div>
                  <div style={{ flex: 1, padding: '12px 16px', borderRadius: 'var(--radius-sm)', background: isPaid ? 'rgba(22,163,74,0.07)' : 'rgba(239,68,68,0.07)', border: `1px solid ${isPaid ? 'rgba(22,163,74,0.2)' : 'rgba(239,68,68,0.2)'}` }}>
                    <div style={{ fontSize: '0.68rem', color: 'var(--gray)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Payment Status</div>
                    <div style={{ fontWeight: 700, fontSize: '0.88rem', color: isPaid ? '#16a34a' : '#ef4444', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <i className={`fa ${isPaid ? 'fa-check-circle' : 'fa-hourglass-half'}`} style={{ fontSize: '0.82rem' }}></i>
                      {data.paymentStatus}
                    </div>
                  </div>
                </div>

              </div>

              {/* ── Footer actions ── */}
              <div style={{
                padding: '20px 32px',
                borderTop: '1px solid var(--border)',
                background: 'var(--card-bg)',
                display: 'flex', gap: 10, flexWrap: 'wrap',
              }}>
                <Link
                  to="/"
                  className="rbp-home"
                  style={{
                    flex: 1, minWidth: 140,
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    padding: '12px 20px', borderRadius: 50,
                    background: 'var(--primary)', color: '#fff',
                    fontWeight: 700, fontSize: '0.88rem', textDecoration: 'none',
                    boxShadow: '0 4px 20px rgba(200,64,10,0.3)',
                    transition: 'var(--transition)',
                  }}
                >
                  <i className="fa fa-home" style={{ fontSize: '0.85rem' }}></i>
                  Go to Home
                </Link>
                <Link
                  to="/booking"
                  className="rbp-back"
                  style={{
                    flex: 1, minWidth: 140,
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    padding: '12px 20px', borderRadius: 50,
                    background: '#fff', color: 'var(--dark)',
                    fontWeight: 700, fontSize: '0.88rem', textDecoration: 'none',
                    border: '1.5px solid var(--border)',
                    boxShadow: 'var(--shadow-sm)',
                    transition: 'var(--transition)',
                  }}
                >
                  <i className="fa fa-list" style={{ fontSize: '0.85rem' }}></i>
                  My Bookings
                </Link>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}