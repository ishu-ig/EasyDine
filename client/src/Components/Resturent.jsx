import React, { useEffect, useState } from 'react';
import { getResturent } from '../Redux/ActionCreators/ResturentActionCreators';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');

  :root {
    --primary: #C8400A;
    --primary-light: #E86834;
    --secondary: #F4A044;
    --accent: #1A1A2E;
    --light: #FDF6EE;
    --dark: #1C1009;
    --gray: #7A6E65;
    --border: rgba(200, 64, 10, 0.12);
    --card-bg: #FFFBF7;
    --shadow-sm: 0 2px 12px rgba(28,16,9,0.07);
    --shadow-md: 0 8px 32px rgba(28,16,9,0.12);
    --shadow-lg: 0 20px 60px rgba(28,16,9,0.18);
    --radius: 16px;
    --radius-sm: 8px;
    --transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  }

  /* ===== PAGE WRAPPER ===== */
  .rp-wrapper {
    min-height: 100vh;
    background: linear-gradient(160deg, #FDF6EE 0%, #FFF8F2 60%, #F9EFE4 100%);
    font-family: 'DM Sans', sans-serif;
    padding: 72px 0 96px;
    position: relative;
    overflow: hidden;
  }

  /* Decorative blobs */
  .rp-wrapper::before {
    content: '';
    position: absolute;
    top: -120px; right: -120px;
    width: 480px; height: 480px;
    background: radial-gradient(circle, rgba(200,64,10,0.07) 0%, transparent 70%);
    pointer-events: none;
    border-radius: 50%;
  }
  .rp-wrapper::after {
    content: '';
    position: absolute;
    bottom: -80px; left: -80px;
    width: 320px; height: 320px;
    background: radial-gradient(circle, rgba(244,160,68,0.09) 0%, transparent 70%);
    pointer-events: none;
    border-radius: 50%;
  }

  /* ===== HEADER SECTION ===== */
  .rp-header {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px 56px;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 32px;
    flex-wrap: wrap;
  }

  .rp-title-block {
    position: relative;
    padding-top: 20px;
  }
  .rp-title-block::before {
    content: '';
    position: absolute;
    top: 0; left: 0;
    width: 40px; height: 3px;
    background: var(--primary);
    border-radius: 2px;
  }
  .rp-title-block::after {
    content: '';
    position: absolute;
    top: 10px; left: 0;
    width: 70px; height: 3px;
    background: var(--secondary);
    border-radius: 2px;
    opacity: 0.6;
  }

  .rp-eyebrow {
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--primary);
    margin-bottom: 10px;
    display: block;
  }

  .rp-headline {
    font-family: 'Playfair Display', serif;
    font-size: clamp(2rem, 4vw, 3rem);
    font-weight: 900;
    color: var(--dark);
    line-height: 1.1;
    margin: 0 0 14px;
    letter-spacing: -0.02em;
  }
  .rp-headline em {
    font-style: italic;
    color: var(--primary);
  }

  .rp-subtext {
    font-size: 0.92rem;
    color: var(--gray);
    max-width: 380px;
    line-height: 1.7;
    margin: 0;
  }

  /* ===== CONTROLS ===== */
  .rp-controls {
    display: flex;
    gap: 12px;
    align-items: center;
    flex-wrap: wrap;
  }

  .rp-search-form {
    display: flex;
    background: white;
    border-radius: 50px;
    box-shadow: var(--shadow-sm);
    border: 1.5px solid var(--border);
    overflow: hidden;
    transition: var(--transition);
  }
  .rp-search-form:focus-within {
    border-color: var(--primary);
    box-shadow: 0 0 0 4px rgba(200,64,10,0.1);
  }

  .rp-search-input {
    border: none;
    outline: none;
    background: transparent;
    padding: 11px 20px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.88rem;
    color: var(--dark);
    width: 220px;
  }
  .rp-search-input::placeholder { color: var(--gray); }

  .rp-search-btn {
    background: var(--primary);
    color: white;
    border: none;
    padding: 11px 20px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.85rem;
    font-weight: 600;
    cursor: pointer;
    transition: var(--transition);
    display: flex;
    align-items: center;
    gap: 6px;
    letter-spacing: 0.02em;
  }
  .rp-search-btn:hover { background: var(--accent); }

  .rp-sort-select {
    appearance: none;
    background: white url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23C8400A' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E") no-repeat right 14px center;
    border: 1.5px solid var(--border);
    border-radius: 50px;
    padding: 11px 38px 11px 18px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.88rem;
    font-weight: 500;
    color: var(--dark);
    cursor: pointer;
    outline: none;
    box-shadow: var(--shadow-sm);
    transition: var(--transition);
  }
  .rp-sort-select:focus {
    border-color: var(--primary);
    box-shadow: 0 0 0 4px rgba(200,64,10,0.1);
  }

  /* ===== COUNT BADGE ===== */
  .rp-count {
    font-size: 0.78rem;
    font-weight: 600;
    color: var(--gray);
    letter-spacing: 0.04em;
    padding-bottom: 4px;
  }
  .rp-count span {
    color: var(--primary);
    font-size: 1.05rem;
    font-family: 'Playfair Display', serif;
    font-weight: 700;
  }

  /* ===== GRID ===== */
  .rp-grid {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
    gap: 28px;
  }

  /* ===== CARD ===== */
  .rp-card {
    background: var(--card-bg);
    border-radius: var(--radius);
    border: 1px solid var(--border);
    box-shadow: var(--shadow-sm);
    overflow: hidden;
    transition: var(--transition);
    display: flex;
    flex-direction: column;
    position: relative;
    animation: rpFadeUp 0.5s cubic-bezier(0.4,0,0.2,1) both;
  }
  .rp-card:hover {
    transform: translateY(-8px);
    box-shadow: var(--shadow-lg);
    border-color: rgba(200,64,10,0.2);
  }

  @keyframes rpFadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* Staggered animation */
  .rp-card:nth-child(1) { animation-delay: 0.05s; }
  .rp-card:nth-child(2) { animation-delay: 0.10s; }
  .rp-card:nth-child(3) { animation-delay: 0.15s; }
  .rp-card:nth-child(4) { animation-delay: 0.20s; }
  .rp-card:nth-child(5) { animation-delay: 0.25s; }
  .rp-card:nth-child(6) { animation-delay: 0.30s; }

  /* Top gradient bar on hover */
  .rp-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    background: linear-gradient(90deg, var(--primary), var(--secondary));
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: 2;
  }
  .rp-card:hover::before { opacity: 1; }

  /* ===== CARD IMAGE ===== */
  .rp-img-wrap {
    position: relative;
    overflow: hidden;
    aspect-ratio: 16/9;
    background: #f0e8df;
  }

  .rp-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.55s ease;
  }
  .rp-card:hover .rp-img { transform: scale(1.06); }

  /* overlay scrim */
  .rp-img-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(28,16,9,0.55) 0%, transparent 55%);
    transition: opacity 0.3s ease;
  }

  .rp-badge {
    position: absolute;
    top: 14px; left: 14px;
    background: linear-gradient(135deg, var(--primary), var(--secondary));
    color: white;
    font-size: 0.72rem;
    font-weight: 800;
    letter-spacing: 0.06em;
    padding: 5px 12px;
    border-radius: 50px;
    text-transform: uppercase;
    box-shadow: 0 2px 8px rgba(200,64,10,0.4);
    z-index: 2;
  }

  /* rating pill on image */
  .rp-rating-pill {
    position: absolute;
    bottom: 14px; right: 14px;
    background: rgba(255,255,255,0.95);
    backdrop-filter: blur(6px);
    color: var(--dark);
    font-size: 0.8rem;
    font-weight: 700;
    padding: 5px 12px;
    border-radius: 50px;
    display: flex;
    align-items: center;
    gap: 4px;
    box-shadow: var(--shadow-sm);
    z-index: 2;
  }
  .rp-rating-pill .star { color: #f59e0b; font-size: 0.85rem; }

  /* ===== CARD BODY ===== */
  .rp-body {
    padding: 22px 22px 18px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    flex: 1;
  }

  .rp-name {
    font-family: 'Playfair Display', serif;
    font-size: 1.2rem;
    font-weight: 700;
    color: var(--dark);
    margin: 0;
    line-height: 1.3;
  }

  .rp-address {
    font-size: 0.83rem;
    color: var(--gray);
    margin: 0;
    display: flex;
    align-items: flex-start;
    gap: 6px;
    line-height: 1.5;
  }
  .rp-address svg { flex-shrink: 0; margin-top: 2px; opacity: 0.6; }

  /* divider */
  .rp-divider {
    height: 1px;
    background: var(--border);
    border: none;
    margin: 0;
  }

  /* ===== AVAILABILITY ROW ===== */
  .rp-avail {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
  }

  .rp-avail-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 0.78rem;
    font-weight: 700;
    letter-spacing: 0.04em;
    padding: 5px 12px;
    border-radius: 50px;
  }
  .rp-avail-badge.available {
    background: rgba(16,185,129,0.1);
    color: #059669;
  }
  .rp-avail-badge.unavailable {
    background: rgba(239,68,68,0.09);
    color: #dc2626;
  }
  .rp-avail-badge .dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    flex-shrink: 0;
  }
  .available .dot { background: #10b981; box-shadow: 0 0 0 2px rgba(16,185,129,0.25); }
  .unavailable .dot { background: #ef4444; }

  .rp-seats {
    font-size: 0.8rem;
    color: var(--gray);
    font-weight: 500;
  }
  .rp-seats strong { color: var(--dark); }

  /* ===== PRICE ROW ===== */
  .rp-price-row {
    display: flex;
    align-items: baseline;
    gap: 8px;
  }
  .rp-final-price {
    font-family: 'Playfair Display', serif;
    font-size: 1.4rem;
    font-weight: 700;
    color: var(--primary);
  }
  .rp-original-price {
    font-size: 0.88rem;
    color: var(--gray);
    text-decoration: line-through;
  }
  .rp-discount-tag {
    font-size: 0.72rem;
    font-weight: 800;
    color: var(--primary);
    background: rgba(200,64,10,0.09);
    padding: 3px 8px;
    border-radius: 50px;
    letter-spacing: 0.04em;
  }

  /* ===== CARD ACTIONS ===== */
  .rp-actions {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    margin-top: auto;
    padding-top: 4px;
  }

  .rp-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    padding: 11px 16px;
    border-radius: 50px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.83rem;
    font-weight: 600;
    letter-spacing: 0.02em;
    text-decoration: none;
    transition: var(--transition);
    cursor: pointer;
    border: none;
    white-space: nowrap;
  }

  .rp-btn-primary {
    background: var(--primary);
    color: white;
    box-shadow: 0 4px 14px rgba(200,64,10,0.3);
  }
  .rp-btn-primary:hover {
    background: var(--accent);
    color: white;
    transform: translateY(-1px);
    box-shadow: 0 6px 18px rgba(26,26,46,0.25);
  }

  .rp-btn-outline {
    background: transparent;
    color: var(--primary);
    border: 1.5px solid var(--primary);
  }
  .rp-btn-outline:hover {
    background: var(--primary);
    color: white;
    transform: translateY(-1px);
  }

  /* ===== EMPTY STATE ===== */
  .rp-empty {
    max-width: 1200px;
    margin: 0 auto;
    padding: 64px 24px;
    text-align: center;
  }
  .rp-empty-icon {
    font-size: 3rem;
    margin-bottom: 16px;
    opacity: 0.4;
  }
  .rp-empty h3 {
    font-family: 'Playfair Display', serif;
    color: var(--dark);
    margin-bottom: 8px;
  }
  .rp-empty p { color: var(--gray); font-size: 0.9rem; }

  /* ===== RESPONSIVE ===== */
  @media (max-width: 768px) {
    .rp-header { flex-direction: column; align-items: flex-start; padding-bottom: 40px; }
    .rp-controls { width: 100%; }
    .rp-search-form { flex: 1; }
    .rp-search-input { width: 100%; min-width: 0; }
    .rp-grid { grid-template-columns: 1fr; gap: 20px; }
  }
  @media (max-width: 480px) {
    .rp-wrapper { padding: 48px 0 64px; }
    .rp-controls { flex-direction: column; }
    .rp-sort-select { width: 100%; }
  }
`;

export default function Resturent({ title }) {
    const [data, setData] = useState([]);
    const [search, setSearch] = useState("");
    const ResturentStateData = useSelector(state => state.ResturentStateData);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getResturent());
    }, [dispatch]);

    useEffect(() => {
        setData(ResturentStateData);
    }, [ResturentStateData.length]);

    function sortFilter(option) {
        const sortedData = [...data];
        if (option === "1") {
            sortedData.sort((x, y) => y.finalPrice - x.finalPrice);
        } else if (option === "2") {
            sortedData.sort((x, y) => x.finalPrice - y.finalPrice);
        }
        setData(sortedData);
    }

    function postSearch(e) {
        e.preventDefault();
        const ch = search.toLowerCase();
        setData(ResturentStateData.filter(x => x.active && x.name?.toLowerCase().includes(ch)));
    }

    return (
        <>
            <style>{styles}</style>
            <section className="rp-wrapper">
                {/* Header */}
                <div className="rp-header">
                    <div className="rp-title-block">
                        <span className="rp-eyebrow">Curated Dining</span>
                        <h1 className="rp-headline">
                            Find Your <em>Perfect</em><br />Restaurant
                        </h1>
                        <p className="rp-subtext">
                            Discover the finest dining spots nearby — exceptional food,
                            ambiance, and reservations at your fingertips.
                        </p>
                        {data.length > 0 && (
                            <p className="rp-count" style={{ marginTop: 14 }}>
                                <span>{data.length}</span> restaurants available
                            </p>
                        )}
                    </div>

                    <div className="rp-controls">
                        <form className="rp-search-form" onSubmit={postSearch}>
                            <input
                                type="search"
                                className="rp-search-input"
                                placeholder="Search by name…"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                            <button type="submit" className="rp-search-btn">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                                </svg>
                                Search
                            </button>
                        </form>

                        <select
                            className="rp-sort-select"
                            onChange={e => sortFilter(e.target.value)}
                            defaultValue=""
                        >
                            <option value="" disabled>Sort by price</option>
                            <option value="1">High → Low</option>
                            <option value="2">Low → High</option>
                        </select>
                    </div>
                </div>

                {/* Grid */}
                {data && data.length > 0 ? (
                    <div className="rp-grid">
                        {data.map(item => (
                            <article key={item._id} className="rp-card">
                                {/* Image */}
                                <div className="rp-img-wrap">
                                    <img
                                        src={`${process.env.REACT_APP_BACKEND_SERVER}/${item.pic}`}
                                        className="rp-img"
                                        alt={item.name}
                                    />
                                    <div className="rp-img-overlay" />

                                    {item.discount > 0 && (
                                        <span className="rp-badge">{item.discount}% OFF</span>
                                    )}

                                    <div className="rp-rating-pill">
                                        <span className="star">★</span>
                                        {item.rating} <span style={{ color: 'var(--gray)', fontWeight: 400 }}>/ 5</span>
                                    </div>
                                </div>

                                {/* Body */}
                                <div className="rp-body">
                                    <h2 className="rp-name">{item.name}</h2>

                                    <p className="rp-address">
                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                                        </svg>
                                        {item.address}
                                    </p>

                                    <hr className="rp-divider" />

                                    {item.seatAvailable > 0 ? (
                                        <>
                                            <div className="rp-avail">
                                                <span className="rp-avail-badge available">
                                                    <span className="dot" />
                                                    Booking Open
                                                </span>
                                                <span className="rp-seats">
                                                    <strong>{item.seatAvailable}</strong> seats left
                                                </span>
                                            </div>

                                            <div className="rp-price-row">
                                                <span className="rp-final-price">₹{item.finalPrice}</span>
                                                {item.reservationPrice && (
                                                    <span className="rp-original-price">₹{item.reservationPrice}</span>
                                                )}
                                                {item.discount > 0 && (
                                                    <span className="rp-discount-tag">{item.discount}% OFF</span>
                                                )}
                                            </div>
                                        </>
                                    ) : (
                                        <div className="rp-avail">
                                            <span className="rp-avail-badge unavailable">
                                                <span className="dot" />
                                                Fully Booked
                                            </span>
                                        </div>
                                    )}

                                    <div className="rp-actions">
                                        <Link to={`/resturent/${item._id}`} className="rp-btn rp-btn-outline">
                                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                                            </svg>
                                            Details
                                        </Link>
                                        <Link to={`/resturent/${item._id}/reservation`} className="rp-btn rp-btn-primary">
                                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                                            </svg>
                                            Reserve
                                        </Link>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                ) : (
                    <div className="rp-empty">
                        <div className="rp-empty-icon">🍽️</div>
                        <h3>No Restaurants Found</h3>
                        <p>Try adjusting your search or check back later.</p>
                    </div>
                )}
            </section>
        </>
    );
}