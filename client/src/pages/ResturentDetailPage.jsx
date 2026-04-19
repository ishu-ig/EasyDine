import React, { useEffect, useState } from 'react';
import HeroSection from '../Components/HeroSection';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getProduct } from "../Redux/ActionCreators/ProductActionCreators";
import { getResturent } from '../Redux/ActionCreators/ResturentActionCreators';
import Products from '../Components/Products';
import { FaStar, FaRegStar, FaTimes } from 'react-icons/fa';

/* ─── Design tokens (mirrors your style.css vars) ─────────── */
const C = {
  primary:      'var(--primary)',
  primaryLight: 'rgba(200,64,10,0.08)',
  primaryBorder:'rgba(200,64,10,0.18)',
  secondary:    'var(--secondary)',
  accent:       'var(--accent)',
  dark:         'var(--dark)',
  gray:         'var(--gray)',
  light:        'var(--light)',
  border:       'var(--border)',
  cardBg:       'var(--card-bg)',
  shadowSm:     'var(--shadow-sm)',
  shadowMd:     'var(--shadow-md)',
  shadowLg:     'var(--shadow-lg)',
  radius:       'var(--radius)',
  radiusSm:     'var(--radius-sm)',
  transition:   'var(--transition)',
};

/* ─── Shared micro-styles ─────────────────────────────────── */
const S = {
  /* Section wrapper */
  page: { background: C.light, minHeight: '100vh', paddingBottom: 80 },

  /* ── Hero image panel ── */
  heroPanel: {
    position: 'relative',
    borderRadius: C.radius,
    overflow: 'hidden',
    boxShadow: C.shadowLg,
    aspectRatio: '4/3',
    background: '#111',
  },
  heroImg: {
    width: '100%', height: '100%',
    objectFit: 'cover',
    display: 'block',
    transition: 'transform 0.5s ease',
  },
  heroGradient: {
    position: 'absolute', inset: 0,
    background: 'linear-gradient(to top, rgba(10,5,3,0.72) 0%, rgba(10,5,3,0.1) 55%, transparent 100%)',
    pointerEvents: 'none',
  },
  heroMeta: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    padding: '24px 28px',
    zIndex: 2,
  },
  heroName: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '2rem', fontWeight: 900,
    color: '#fff', marginBottom: 8,
    lineHeight: 1.15,
    textShadow: '0 2px 12px rgba(0,0,0,0.4)',
  },
  heroBadgeRow: {
    display: 'flex', flexWrap: 'wrap', gap: 8,
  },

  /* Status / info badges on the image */
  statusBadge: (open) => ({
    display: 'inline-flex', alignItems: 'center', gap: 6,
    padding: '5px 14px', borderRadius: 50,
    fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.04em',
    backdropFilter: 'blur(10px)',
    background: open ? 'rgba(22,163,74,0.85)' : 'rgba(239,68,68,0.85)',
    color: '#fff',
    boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
  }),
  heroPill: {
    display: 'inline-flex', alignItems: 'center', gap: 6,
    padding: '5px 14px', borderRadius: 50,
    fontSize: '0.75rem', fontWeight: 600,
    backdropFilter: 'blur(10px)',
    background: 'rgba(255,255,255,0.18)',
    color: '#fff',
    border: '1px solid rgba(255,255,255,0.25)',
  },

  /* Quick-info chips row below image */
  chipRow: {
    display: 'flex', flexWrap: 'wrap', gap: 10,
    marginTop: 14,
  },
  chip: {
    display: 'flex', alignItems: 'center', gap: 8,
    padding: '10px 16px', borderRadius: C.radiusSm,
    background: '#fff', border: `1px solid ${C.border}`,
    boxShadow: C.shadowSm, flex: '1 1 140px',
  },
  chipIcon: { color: C.primary, fontSize: '0.9rem', flexShrink: 0 },
  chipLabel: { fontSize: '0.7rem', color: C.gray, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' },
  chipValue: { fontSize: '0.85rem', fontWeight: 700, color: C.dark },

  /* Price banner */
  priceBanner: {
    display: 'flex', alignItems: 'center', gap: 12,
    padding: '16px 20px', borderRadius: C.radiusSm,
    background: C.primaryLight,
    border: `1px solid ${C.primaryBorder}`,
    marginTop: 14,
    flexWrap: 'wrap',
  },
  finalPrice: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '1.9rem', fontWeight: 900,
    color: C.primary, lineHeight: 1,
  },
  basePrice: {
    fontSize: '1rem', color: C.gray,
    textDecoration: 'line-through',
  },
  discountPill: {
    padding: '4px 12px', borderRadius: 50,
    background: `linear-gradient(135deg, ${C.primary}, ${C.secondary})`,
    color: '#fff', fontSize: '0.75rem', fontWeight: 800,
    letterSpacing: '0.04em',
  },
  perSeat: {
    fontSize: '0.78rem', color: C.gray, marginLeft: 'auto',
  },

  /* ── Right column: booking card ── */
  bookingCard: {
    background: '#fff',
    borderRadius: C.radius,
    boxShadow: C.shadowMd,
    overflow: 'hidden',
  },
  bookingHeader: {
    padding: '20px 28px',
    background: `linear-gradient(135deg, ${C.accent} 0%, #2d2d4e 100%)`,
    borderBottom: `1px solid ${C.border}`,
  },
  bookingTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '1.2rem', fontWeight: 700,
    color: '#fff', margin: 0,
  },
  bookingSubtitle: {
    fontSize: '0.78rem', color: 'rgba(255,255,255,0.55)',
    marginTop: 2,
  },
  bookingBody: { padding: '28px' },

  /* Form field group */
  fieldGroup: { marginBottom: 20 },
  fieldLabel: {
    display: 'flex', alignItems: 'center', gap: 7,
    fontSize: '0.75rem', fontWeight: 700,
    color: C.gray, letterSpacing: '0.06em',
    textTransform: 'uppercase', marginBottom: 8,
  },
  fieldLabelIcon: { color: C.primary, fontSize: '0.8rem' },

  /* Styled select */
  select: {
    width: '100%', padding: '10px 14px',
    borderRadius: C.radiusSm,
    border: `1.5px solid ${C.border}`,
    background: C.light, fontSize: '0.88rem',
    color: C.dark, outline: 'none',
    fontFamily: 'DM Sans, sans-serif',
    appearance: 'none',
    cursor: 'pointer',
    transition: 'border 0.2s',
  },

  /* Date input */
  dateInput: {
    width: '100%', padding: '10px 14px',
    borderRadius: C.radiusSm,
    border: `1.5px solid ${C.border}`,
    background: C.light, fontSize: '0.88rem',
    color: C.dark, outline: 'none',
    fontFamily: 'DM Sans, sans-serif',
  },

  /* Add slot button row */
  addSlotRow: {
    display: 'flex', gap: 8, alignItems: 'center',
  },
  addSlotBtn: {
    padding: '10px 18px', borderRadius: C.radiusSm,
    border: 'none', background: C.primary,
    color: '#fff', fontWeight: 700,
    fontSize: '0.82rem', cursor: 'pointer',
    whiteSpace: 'nowrap', flexShrink: 0,
    transition: C.transition,
    display: 'flex', alignItems: 'center', gap: 6,
  },

  /* Selected time slot chips */
  slotChip: {
    display: 'inline-flex', alignItems: 'center', gap: 6,
    padding: '5px 12px', borderRadius: 50,
    background: C.primaryLight,
    border: `1px solid ${C.primaryBorder}`,
    color: C.primary, fontSize: '0.78rem', fontWeight: 600,
  },
  slotRemove: {
    cursor: 'pointer', fontSize: '0.7rem',
    color: C.primary, opacity: 0.7,
  },

  /* Qty stepper */
  qtyRow: {
    display: 'inline-flex', alignItems: 'center',
    border: `2px solid ${C.border}`,
    borderRadius: 50, overflow: 'hidden',
    background: C.light,
  },
  qtyBtn: {
    width: 38, height: 42,
    border: 'none', background: 'transparent',
    cursor: 'pointer', color: C.primary,
    fontWeight: 700, fontSize: '1rem',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: 'background 0.2s',
  },
  qtyVal: {
    minWidth: 40, textAlign: 'center',
    fontWeight: 700, fontSize: '0.95rem', color: C.dark,
  },

  /* Payment mode chips */
  payChips: { display: 'flex', gap: 8, flexWrap: 'wrap' },
  payChip: (active) => ({
    flex: '1 1 120px', padding: '10px 14px',
    borderRadius: C.radiusSm, cursor: 'pointer',
    border: active ? `2px solid ${C.primary}` : `2px solid ${C.border}`,
    background: active ? C.primaryLight : '#fff',
    color: active ? C.primary : C.gray,
    fontWeight: active ? 700 : 500,
    fontSize: '0.82rem', textAlign: 'center',
    transition: 'all 0.2s',
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
  }),

  /* Divider */
  divider: { height: 1, background: C.border, margin: '20px 0' },

  /* Summary row above book btn */
  summaryRow: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 16,
    padding: '14px 16px', borderRadius: C.radiusSm,
    background: C.light, border: `1px solid ${C.border}`,
  },
  summaryLabel: { fontSize: '0.82rem', color: C.gray, fontWeight: 500 },
  summaryVal: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '1.2rem', fontWeight: 900, color: C.primary,
  },

  /* Book Now btn */
  bookBtn: {
    width: '100%', padding: '14px',
    borderRadius: 50, border: 'none',
    background: `linear-gradient(135deg, ${C.primary} 0%, #e05a20 100%)`,
    color: '#fff', fontWeight: 700,
    fontSize: '1rem', letterSpacing: '0.03em',
    cursor: 'pointer', boxShadow: '0 6px 24px rgba(200,64,10,0.35)',
    display: 'flex', alignItems: 'center',
    justifyContent: 'center', gap: 10,
    transition: C.transition,
  },

  /* Error text */
  err: { fontSize: '0.75rem', color: '#ef4444', marginTop: 4 },

  /* ── Reviews section ── */
  reviewsSection: { padding: '60px 0 0' },
  reviewsTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '1.6rem', fontWeight: 900,
    color: C.dark, marginBottom: 24,
  },
  reviewCard: {
    background: '#fff', borderRadius: C.radiusSm,
    border: `1px solid ${C.border}`,
    boxShadow: C.shadowSm,
    padding: '18px 22px', marginBottom: 14,
    transition: C.transition,
  },
  reviewUser: {
    fontFamily: "'Playfair Display', serif",
    fontWeight: 700, fontSize: '0.95rem', color: C.dark,
  },
  reviewComment: { fontSize: '0.88rem', color: C.gray, lineHeight: 1.7, marginTop: 6 },

  /* Add review form */
  reviewFormCard: {
    background: '#fff', borderRadius: C.radius,
    border: `1px solid ${C.border}`,
    boxShadow: C.shadowSm, padding: '28px',
    marginTop: 28,
  },
  reviewFormTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '1.1rem', fontWeight: 700,
    color: C.dark, marginBottom: 18,
  },
  input: {
    width: '100%', padding: '10px 14px',
    borderRadius: C.radiusSm,
    border: `1.5px solid ${C.border}`,
    fontSize: '0.88rem', color: C.dark,
    background: C.light, outline: 'none',
    fontFamily: 'DM Sans, sans-serif',
    marginBottom: 12, boxSizing: 'border-box',
  },
  textarea: {
    width: '100%', padding: '10px 14px',
    borderRadius: C.radiusSm,
    border: `1.5px solid ${C.border}`,
    fontSize: '0.88rem', color: C.dark,
    background: C.light, outline: 'none',
    fontFamily: 'DM Sans, sans-serif',
    resize: 'vertical', minHeight: 90,
    marginBottom: 12, boxSizing: 'border-box',
  },
  submitReviewBtn: {
    padding: '10px 28px', borderRadius: 50,
    border: 'none', background: C.accent,
    color: '#fff', fontWeight: 700,
    fontSize: '0.88rem', cursor: 'pointer',
    transition: C.transition,
  },
};

export default function ResturentDetailPage() {
  const { _id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const ProductStateData  = useSelector(state => state.ProductStateData);
  const ResturentStateData = useSelector(state => state.ResturentStateData);

  const [data, setData] = useState({
    name: '', pic: '', phone: '', status: true,
    discount: '', seatAvailable: '', reservationPrice: '',
    finalPrice: '', address: '', rating: 0, active: true,
    openTime: '', closeTime: '', timeSlots: [], reservationDate: '',
  });
  const [errorMessage, setErrorMessage] = useState({
    reservationDate: 'Date field is mandatory',
    timeSlots: 'Time Slot field is mandatory',
  });
  const [relatedProduct, setRelatedProduct] = useState([]);
  const [qty, setQty]   = useState(1);
  const [mode, setMode] = useState('COD');
  const [show, setShow] = useState(false);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    dispatch(getResturent());
    if (ResturentStateData.length > 0) {
      const item = ResturentStateData.find(x => x._id === _id);
      if (item) setData({ ...item });
    }
  }, [ResturentStateData.length]);

  useEffect(() => { dispatch(getProduct()); }, [dispatch]);

  useEffect(() => {
    if (ProductStateData.length > 0)
      setRelatedProduct(ProductStateData.filter(x => x.resturent === data.name));
  }, [ProductStateData, data.name]);

  function generateTimeSlots(openTime, closeTime) {
    if (!openTime || !closeTime) return [];
    const slots = [];
    let start = new Date(`1970-01-01T${openTime}:00`);
    const end   = new Date(`1970-01-01T${closeTime}:00`);
    const fmt   = t => t.toString().padStart(2, '0');
    while (start < end) {
      const next = new Date(start);
      next.setMinutes(start.getMinutes() + 60);
      slots.push(`${fmt(start.getHours())}:${fmt(start.getMinutes())} - ${fmt(next.getHours())}:${fmt(next.getMinutes())}`);
      start = next;
    }
    return slots;
  }

  function addTimeSlot() {
    const selectedTime = document.getElementById('timeSlot').value;
    if (!selectedTime) return;
    setData(prev => {
      const updated = prev.timeSlots || [];
      if (updated.length >= 2) { alert('You can only select up to 2 time slots.'); return prev; }
      if (updated.includes(selectedTime)) return prev;
      return { ...prev, timeSlots: [...updated, selectedTime] };
    });
    setErrorMessage(prev => ({ ...prev, timeSlots: '' }));
  }

  function removeTimeSlot(index) {
    setData(prev => ({ ...prev, timeSlots: prev.timeSlots.filter((_, i) => i !== index) }));
  }

  function getInputData(e) {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
    setErrorMessage(prev => ({ ...prev, [name]: '' }));
  }

  async function postData(e) {
    e.preventDefault();
    setShow(true);
    if (!data.reservationDate) {
      setErrorMessage(prev => ({ ...prev, reservationDate: 'Date field is mandatory' }));
      return;
    }
    const selDate = new Date(data.reservationDate);
    const today   = new Date(); today.setHours(0, 0, 0, 0);
    if (selDate < today) {
      setErrorMessage(prev => ({ ...prev, reservationDate: 'Backdate not allowed' }));
      return;
    }
    if (!Array.isArray(data.timeSlots) || data.timeSlots.length === 0) {
      setErrorMessage(prev => ({ ...prev, timeSlots: 'Selecting at least one time slot is mandatory' }));
      return;
    }
    if (data.seatAvailable > 0) {
      if (localStorage.getItem('login')) {
        if (window.confirm('Are you sure you want to make a booking?')) {
          let bookingRes = await fetch(`${process.env.REACT_APP_BACKEND_SERVER}/api/booking`, {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({
              user: localStorage.getItem('userid'),
              bookingStatus: true, paymentStatus: 'Pending',
              paymentMode: mode, seats: qty,
              total: data.finalPrice * qty,
              resturent: _id, date: data.reservationDate,
              time: data.timeSlots.join(', '),
            }),
          });
          bookingRes = await bookingRes.json();
          if (bookingRes.result === 'Done') {
            let updRes = await fetch(`${process.env.REACT_APP_BACKEND_SERVER}/api/resturent/user/${_id}`, {
              method: 'PUT',
              headers: { 'content-type': 'application/json', authorization: localStorage.getItem('token') },
              body: JSON.stringify({ ...data, seatAvailable: data.seatAvailable - qty }),
            });
            updRes = await updRes.json();
            if (mode === 'COD') navigate(`/confirmationBooking/${bookingRes.data._id}`);
            else navigate('/payment/booking/-1');
          }
        }
      } else {
        alert('To book a seat, you need to log in.');
        navigate('/login');
      }
    } else {
      alert('No Seats Are Available');
      setQty(0);
    }
  }

  function renderStars(rating) {
    return Array.from({ length: 5 }, (_, i) =>
      i < rating
        ? <FaStar key={i} color="#F4A044" style={{ marginRight: 2 }} />
        : <FaRegStar key={i} color="#F4A044" style={{ marginRight: 2 }} />
    );
  }

  const slots     = generateTimeSlots(data.openTime, data.closeTime);
  const totalCost = data.finalPrice * qty;

  return (
    <>
      <style>{`
        @keyframes pulse {
          0%,100% { opacity:1; transform:scale(1); }
          50%      { opacity:0.5; transform:scale(1.35); }
        }
        .rdp-book-btn:hover   { transform:translateY(-2px); box-shadow:0 10px 32px rgba(200,64,10,0.45) !important; }
        .rdp-add-slot:hover   { background: var(--accent) !important; }
        .rdp-qty-btn:hover    { background: rgba(200,64,10,0.1) !important; }
        .rdp-review-card:hover{ transform:translateY(-3px); box-shadow:var(--shadow-md) !important; }
        .rdp-submit-btn:hover { background: var(--primary) !important; transform:translateY(-1px); }
        .rdp-hero-img:hover   { transform:scale(1.03); }
        select:focus, input:focus, textarea:focus { border-color: var(--primary) !important; box-shadow: 0 0 0 3px rgba(200,64,10,0.12); }
      `}</style>

      <div className="d-none d-lg-block">
        <HeroSection title={`Restaurant — ${data.name}`} />
      </div>

      <div style={S.page}>
        <div className="container-xxl py-5">
          <div className="row g-4 align-items-start">

            {/* ── LEFT: Image + Info chips ── */}
            <div className="col-lg-5">

              {/* Hero image */}
              <div style={S.heroPanel}>
                <img
                  src={`${process.env.REACT_APP_BACKEND_SERVER}/${data.pic}`}
                  alt={data.name}
                  style={S.heroImg}
                  className="rdp-hero-img"
                />
                <div style={S.heroGradient} />
                <div style={S.heroMeta}>
                  <div style={S.heroName}>{data.name}</div>
                  <div style={S.heroBadgeRow}>
                    {/* Status */}
                    <span style={S.statusBadge(data.status)}>
                      <span style={{
                        width: 7, height: 7, borderRadius: '50%',
                        background: '#fff', flexShrink: 0,
                        animation: data.status ? 'pulse 2s infinite' : 'none',
                      }} />
                      {data.status ? 'Open Now' : 'Closed'}
                    </span>
                    {/* Timing */}
                    {data.openTime && (
                      <span style={S.heroPill}>
                        <i className="fa fa-clock" style={{ fontSize: '0.75rem' }}></i>
                        {data.openTime} – {data.closeTime}
                      </span>
                    )}
                    {/* Discount */}
                    {data.discount > 0 && (
                      <span style={{ ...S.heroPill, background: 'rgba(200,64,10,0.75)', border: 'none' }}>
                        <i className="fa fa-tag" style={{ fontSize: '0.72rem' }}></i>
                        {data.discount}% OFF
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Quick-info chips */}
              <div style={S.chipRow}>
                <div style={S.chip}>
                  <i className="fa fa-phone" style={S.chipIcon}></i>
                  <div>
                    <div style={S.chipLabel}>Contact</div>
                    <div style={S.chipValue}>{data.phone || '—'}</div>
                  </div>
                </div>
                <div style={S.chip}>
                  <i className="fa fa-chair" style={S.chipIcon}></i>
                  <div>
                    <div style={S.chipLabel}>Seats Available</div>
                    <div style={{ ...S.chipValue, color: data.seatAvailable > 0 ? '#16a34a' : '#ef4444' }}>
                      {data.seatAvailable > 0 ? data.seatAvailable : 'Full'}
                    </div>
                  </div>
                </div>
                <div style={{ ...S.chip, flex: '1 1 100%' }}>
                  <i className="fa fa-map-marker-alt" style={S.chipIcon}></i>
                  <div>
                    <div style={S.chipLabel}>Address</div>
                    <div style={S.chipValue}>{data.address || '—'}</div>
                  </div>
                </div>
              </div>

              {/* Price banner */}
              <div style={S.priceBanner}>
                <div>
                  <div style={{ fontSize: '0.7rem', color: C.gray, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
                    Reservation Price / Seat
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                    <span style={S.finalPrice}>&#8377;{data.finalPrice}</span>
                    {data.reservationPrice !== data.finalPrice && (
                      <span style={S.basePrice}>&#8377;{data.reservationPrice}</span>
                    )}
                  </div>
                </div>
                {data.discount > 0 && (
                  <span style={S.discountPill}>{data.discount}% OFF</span>
                )}
              </div>

              {/* Star rating display */}
              {data.rating > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 14 }}>
                  <div>{renderStars(data.rating)}</div>
                  <span style={{ fontSize: '0.82rem', color: C.gray }}>({data.rating}/5)</span>
                </div>
              )}
            </div>

            {/* ── RIGHT: Booking card ── */}
            <div className="col-lg-7">
              <div style={S.bookingCard}>

                {/* Card header */}
                <div style={S.bookingHeader}>
                  <div style={S.bookingTitle}>
                    <i className="fa fa-calendar-check me-2" style={{ color: C.secondary }}></i>
                    Reserve Your Table
                  </div>
                  <div style={S.bookingSubtitle}>Fill in the details below to complete your booking</div>
                </div>

                <div style={S.bookingBody}>

                  {/* Time slot */}
                  <div style={S.fieldGroup}>
                    <div style={S.fieldLabel}>
                      <i className="fa fa-clock" style={S.fieldLabelIcon}></i>
                      Select Time Slot <span style={{ color: '#ef4444' }}>*</span>
                    </div>
                    <div style={S.addSlotRow}>
                      <select style={S.select} id="timeSlot">
                        {slots.length > 0
                          ? slots.map((slot, i) => <option key={i} value={slot}>{slot}</option>)
                          : <option>No slots available</option>
                        }
                      </select>
                      <button
                        type="button"
                        style={S.addSlotBtn}
                        className="rdp-add-slot"
                        onClick={addTimeSlot}
                      >
                        <i className="fa fa-plus" style={{ fontSize: '0.75rem' }}></i>
                        Add
                      </button>
                    </div>
                    {/* Selected slots */}
                    {(data.timeSlots || []).length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 10 }}>
                        {data.timeSlots.map((slot, i) => (
                          <span key={i} style={S.slotChip}>
                            <i className="fa fa-clock" style={{ fontSize: '0.7rem' }}></i>
                            {slot}
                            <FaTimes
                              style={S.slotRemove}
                              onClick={() => removeTimeSlot(i)}
                            />
                          </span>
                        ))}
                      </div>
                    )}
                    {show && errorMessage.timeSlots && (
                      <div style={S.err}>
                        <i className="fa fa-exclamation-circle me-1"></i>
                        {errorMessage.timeSlots}
                      </div>
                    )}
                  </div>

                  {/* Reservation date */}
                  <div style={S.fieldGroup}>
                    <div style={S.fieldLabel}>
                      <i className="fa fa-calendar" style={S.fieldLabelIcon}></i>
                      Reservation Date <span style={{ color: '#ef4444' }}>*</span>
                    </div>
                    <input
                      type="date"
                      name="reservationDate"
                      min={new Date().toISOString().split('T')[0]}
                      style={{
                        ...S.dateInput,
                        borderColor: show && errorMessage.reservationDate ? '#ef4444' : 'var(--border)',
                      }}
                      onChange={getInputData}
                    />
                    {show && errorMessage.reservationDate && (
                      <div style={S.err}>
                        <i className="fa fa-exclamation-circle me-1"></i>
                        {errorMessage.reservationDate}
                      </div>
                    )}
                  </div>

                  {/* Number of seats */}
                  <div style={S.fieldGroup}>
                    <div style={S.fieldLabel}>
                      <i className="fa fa-users" style={S.fieldLabelIcon}></i>
                      Number of Seats
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                      <div style={S.qtyRow}>
                        <button
                          className="rdp-qty-btn"
                          style={S.qtyBtn}
                          onClick={() => setQty(p => Math.max(1, p - 1))}
                          type="button"
                        >
                          <i className="fa fa-minus" style={{ fontSize: '0.75rem' }}></i>
                        </button>
                        <span style={S.qtyVal}>{qty}</span>
                        <button
                          className="rdp-qty-btn"
                          style={S.qtyBtn}
                          onClick={() => setQty(p => Math.min(data.seatAvailable || 1, p + 1))}
                          type="button"
                        >
                          <i className="fa fa-plus" style={{ fontSize: '0.75rem' }}></i>
                        </button>
                      </div>
                      <span style={{ fontSize: '0.82rem', color: C.gray }}>
                        Max: {data.seatAvailable > 0 ? data.seatAvailable : 0} seats
                      </span>
                    </div>
                  </div>

                  {/* Payment mode */}
                  <div style={S.fieldGroup}>
                    <div style={S.fieldLabel}>
                      <i className="fa fa-credit-card" style={S.fieldLabelIcon}></i>
                      Payment Mode
                    </div>
                    <div style={S.payChips}>
                      <div
                        style={S.payChip(mode === 'COD')}
                        onClick={() => setMode('COD')}
                      >
                        <i className="fa fa-money-bill-wave" style={{ fontSize: '0.85rem' }}></i>
                        Cash on Delivery
                      </div>
                      <div
                        style={S.payChip(mode === 'Net Banking')}
                        onClick={() => setMode('Net Banking')}
                      >
                        <i className="fa fa-university" style={{ fontSize: '0.85rem' }}></i>
                        UPI / Net Banking
                      </div>
                    </div>
                  </div>

                  <div style={S.divider} />

                  {/* Cost summary */}
                  <div style={S.summaryRow}>
                    <div>
                      <div style={S.summaryLabel}>Total Payable</div>
                      <div style={{ fontSize: '0.75rem', color: C.gray, marginTop: 2 }}>
                        &#8377;{data.finalPrice} × {qty} seat{qty > 1 ? 's' : ''}
                      </div>
                    </div>
                    <div style={S.summaryVal}>&#8377;{totalCost || 0}</div>
                  </div>

                  {/* Book now */}
                  <button
                    type="button"
                    style={S.bookBtn}
                    className="rdp-book-btn"
                    onClick={postData}
                  >
                    <i className="fa fa-calendar-check"></i>
                    Confirm Booking
                    {totalCost > 0 && (
                      <span style={{
                        background: 'rgba(255,255,255,0.2)',
                        borderRadius: 50, padding: '2px 12px',
                        fontSize: '0.85rem',
                      }}>
                        &#8377;{totalCost}
                      </span>
                    )}
                  </button>

                </div>
              </div>
            </div>
          </div>

          {/* ── Reviews ── */}
          <div style={S.reviewsSection}>
            <div style={S.divider} />

            <div className="row g-4">
              {/* Existing reviews */}
              <div className="col-lg-7">
                <div style={S.reviewsTitle}>
                  <i className="fa fa-comments me-2" style={{ color: C.primary, fontSize: '1.4rem' }}></i>
                  Guest Reviews
                </div>
                {reviews.length === 0 ? (
                  <div style={{
                    padding: '32px', textAlign: 'center',
                    borderRadius: C.radius,
                    border: `1px dashed ${C.primaryBorder}`,
                    color: C.gray,
                  }}>
                    <i className="fa fa-star" style={{ fontSize: '2rem', color: C.border, display: 'block', marginBottom: 10 }}></i>
                    No reviews yet — be the first!
                  </div>
                ) : reviews.map((r, i) => (
                  <div key={i} style={S.reviewCard} className="rdp-review-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                      <div style={S.reviewUser}>{r.user}</div>
                      <div style={{ display: 'flex' }}>{renderStars(r.rating)}</div>
                    </div>
                    <div style={S.reviewComment}>{r.comment}</div>
                  </div>
                ))}
              </div>

              {/* Add review form */}
              <div className="col-lg-5">
                <div style={S.reviewFormCard}>
                  <div style={S.reviewFormTitle}>
                    <i className="fa fa-pen me-2" style={{ color: C.primary }}></i>
                    Write a Review
                  </div>
                  <form onSubmit={e => e.preventDefault()}>
                    <input
                      type="text"
                      placeholder="Your name"
                      style={S.input}
                    />
                    <textarea
                      placeholder="Share your experience…"
                      style={S.textarea}
                    />
                    {/* Star picker */}
                    <div style={{ marginBottom: 14 }}>
                      <div style={{ ...S.fieldLabel, marginBottom: 8 }}>
                        <i className="fa fa-star" style={S.fieldLabelIcon}></i>
                        Rating
                      </div>
                      <select style={S.select}>
                        {[5,4,3,2,1].map(n => (
                          <option key={n} value={n}>{n} Star{n > 1 ? 's' : ''}</option>
                        ))}
                      </select>
                    </div>
                    <button
                      type="submit"
                      style={S.submitReviewBtn}
                      className="rdp-submit-btn"
                    >
                      <i className="fa fa-paper-plane me-2"></i>
                      Submit Review
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {relatedProduct.length > 0 && (
        <Products title="Dishes From This Restaurant" data={relatedProduct} />
      )}
    </>
  );
}