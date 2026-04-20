import React, { useEffect, useState } from "react";
import HeroSection from "../Components/HeroSection";
import Products from "../Components/Products";
import { getProduct } from "../Redux/ActionCreators/ProductActionCreators";
import { getMaincategory } from "../Redux/ActionCreators/MaincategoryActionCreators";
import { getSubcategory } from "../Redux/ActionCreators/SubcategoryActionCreators";
import { getResturent } from "../Redux/ActionCreators/ResturentActionCreators";
import { useDispatch, useSelector } from "react-redux";
import { Link, useSearchParams } from "react-router-dom";

/* ─── Shared style tokens ─────────────────────────────────── */
const C = {
  primary:       'var(--primary)',
  primaryLight:  'rgba(200,64,10,0.07)',
  primaryBorder: 'rgba(200,64,10,0.18)',
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

/* ─── Filter section heading ──────────────────────────────── */
function FilterHeader({ icon, label }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      padding: '10px 14px',
      borderRadius: 'var(--radius-sm) var(--radius-sm) 0 0',
      background: `linear-gradient(135deg, var(--accent) 0%, #2d2d4e 100%)`,
      marginBottom: 0,
    }}>
      <i className={`fa ${icon}`} style={{ color: 'var(--secondary)', fontSize: '0.82rem' }}></i>
      <span style={{
        fontFamily: "'Playfair Display', serif",
        fontWeight: 700, fontSize: '0.82rem',
        color: '#fff', letterSpacing: '0.03em',
      }}>{label}</span>
    </div>
  );
}

/* ─── Single filter pill link ─────────────────────────────── */
function FilterPill({ to, active, label }) {
  return (
    <Link
      to={to}
      style={{
        display: 'block',
        padding: '8px 14px',
        fontSize: '0.82rem',
        fontWeight: active ? 700 : 500,
        color: active ? 'var(--primary)' : 'var(--dark)',
        background: active ? 'rgba(200,64,10,0.08)' : 'transparent',
        borderLeft: active ? '3px solid var(--primary)' : '3px solid transparent',
        textDecoration: 'none',
        transition: 'var(--transition)',
        borderRadius: '0 var(--radius-sm) var(--radius-sm) 0',
      }}
      className="pp-pill"
    >
      {label}
    </Link>
  );
}

export default function ProductPage({ show }) {
  const [data, setData]     = useState([]);
  const [mc, setMc]         = useState("All");
  const [sc, setSc]         = useState("All");
  const [rn, setRn]         = useState("All");
  const [search, setSearch] = useState("");
  const [min, setMin]       = useState(0);
  const [max, setMax]       = useState(1000);
  const [mobileOpen, setMobileOpen] = useState(false);

  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();

  const ProductStateData      = useSelector(s => s.ProductStateData);
  const MaincategoryStateData = useSelector(s => s.MaincategoryStateData);
  const SubcategoryStateData  = useSelector(s => s.SubcategoryStateData);
  const ResturentStateData    = useSelector(s => s.ResturentStateData);

  useEffect(() => {
    dispatch(getMaincategory());
    dispatch(getSubcategory());
    dispatch(getResturent());
    dispatch(getProduct());
  }, [dispatch]);

  useEffect(() => {
    const mcP = searchParams.get("mc") ?? "All";
    const scP = searchParams.get("sc") ?? "All";
    const rnP = searchParams.get("rn") ?? "All";
    setMc(mcP); setSc(scP); setRn(rnP);
    if (ProductStateData.length)
      applyFilters(mcP, scP, rnP, Number(min), Number(max), search);
  }, [ProductStateData.length, searchParams, min, max, search]);

  function applyFilters(mc, sc, rn, minP, maxP, kw = "") {
    const ch = kw.toLowerCase();
    setData(ProductStateData.filter(p =>
      p.active &&
      (mc === "All" || p.maincategory?.name === mc) &&
      (sc === "All" || p.subcategory?.name === sc) &&
      (rn === "All" || p.resturent?.name === rn) &&
      (minP === -1 || p.finalPrice >= minP) &&
      (maxP === -1 || p.finalPrice <= maxP) &&
      (!ch ||
        p.maincategory?.name?.toLowerCase().includes(ch) ||
        p.subcategory?.name?.toLowerCase().includes(ch) ||
        p.resturent?.name?.toLowerCase().includes(ch) ||
        p.description?.toLowerCase().includes(ch))
    ));
  }

  function sortFilter(option) {
    const s = [...data];
    if (option === "latest")        s.sort((a, b) => b._id.localeCompare(a._id));
    if (option === "price_high")    s.sort((a, b) => b.finalPrice - a.finalPrice);
    if (option === "price_low")     s.sort((a, b) => a.finalPrice - b.finalPrice);
    if (option === "discount_high") s.sort((a, b) => b.discount - a.discount);
    if (option === "discount_low")  s.sort((a, b) => a.discount - b.discount);
    setData(s);
  }

  /* Clear all filters */
  function clearAll() {
    setMin(0); setMax(1000); setSearch("");
  }

  const activeCount = [mc !== "All", sc !== "All", rn !== "All"].filter(Boolean).length;

  /* ── Reusable filter group ── */
  const FilterGroup = ({ title, icon, current, items, paramKey }) => (
    <div style={{ marginBottom: 4 }}>
      <FilterHeader icon={icon} label={title} />
      <div style={{
        background: '#fff',
        border: `1px solid var(--border)`,
        borderTop: 'none',
        borderRadius: `0 0 var(--radius-sm) var(--radius-sm)`,
        overflow: 'hidden',
        marginBottom: 12,
      }}>
        <FilterPill
          to={`/product?mc=${paramKey === "mc" ? "All" : mc}&sc=${paramKey === "sc" ? "All" : sc}&rn=${paramKey === "rn" ? "All" : rn}`}
          active={current === "All"}
          label="All"
        />
        {items.filter(x => x.active).map(item => (
          <FilterPill
            key={item._id}
            to={`/product?mc=${paramKey === "mc" ? item.name : mc}&sc=${paramKey === "sc" ? item.name : sc}&rn=${paramKey === "rn" ? item.name : rn}`}
            active={current === item.name}
            label={item.name}
          />
        ))}
      </div>
    </div>
  );

  /* ── Price filter ── */
  const PriceFilter = () => (
    <div style={{ marginBottom: 4 }}>
      <FilterHeader icon="fa-tag" label="Price Range" />
      <div style={{
        background: '#fff', border: `1px solid var(--border)`,
        borderTop: 'none', borderRadius: `0 0 var(--radius-sm) var(--radius-sm)`,
        padding: '16px 14px', marginBottom: 12,
      }}>
        {/* Range visual */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: '0.72rem', color: C.gray }}>₹{min}</span>
          <span style={{ fontSize: '0.72rem', color: C.gray }}>₹{max}</span>
        </div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: '0.68rem', color: C.gray, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 4 }}>Min ₹</label>
            <input
              type="number" value={min}
              onChange={e => setMin(e.target.value)}
              style={{
                width: '100%', padding: '8px 10px',
                border: `1.5px solid var(--border)`,
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.85rem', color: C.dark,
                background: C.light, outline: 'none',
                fontFamily: 'DM Sans, sans-serif',
              }}
              className="pp-input"
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: '0.68rem', color: C.gray, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 4 }}>Max ₹</label>
            <input
              type="number" value={max}
              onChange={e => setMax(e.target.value)}
              style={{
                width: '100%', padding: '8px 10px',
                border: `1.5px solid var(--border)`,
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.85rem', color: C.dark,
                background: C.light, outline: 'none',
                fontFamily: 'DM Sans, sans-serif',
              }}
              className="pp-input"
            />
          </div>
        </div>
        <button
          onClick={() => applyFilters(mc, sc, rn, Number(min), Number(max), search)}
          style={{
            width: '100%', padding: '9px',
            borderRadius: 50, border: 'none',
            background: 'var(--primary)', color: '#fff',
            fontWeight: 700, fontSize: '0.82rem',
            cursor: 'pointer', transition: C.transition,
          }}
          className="pp-apply-btn"
        >
          <i className="fa fa-check me-1" style={{ fontSize: '0.75rem' }}></i>
          Apply
        </button>
      </div>
    </div>
  );

  const Filters = () => (
    <div>
      <FilterGroup title="Category"    icon="fa-layer-group"  current={mc} items={MaincategoryStateData} paramKey="mc" />
      <FilterGroup title="Subcategory" icon="fa-list"         current={sc} items={[...new Map(SubcategoryStateData.map(s => [s.name, s]))].map(x => x[1])} paramKey="sc" />
      <FilterGroup title="Restaurant"  icon="fa-store"        current={rn} items={ResturentStateData}    paramKey="rn" />
      <PriceFilter />

      {/* Clear all */}
      {activeCount > 0 && (
        <Link
          to="/product"
          onClick={clearAll}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            padding: '9px', borderRadius: 50,
            border: `1.5px solid rgba(239,68,68,0.35)`,
            background: 'rgba(239,68,68,0.06)',
            color: '#ef4444', fontWeight: 700,
            fontSize: '0.8rem', textDecoration: 'none',
            transition: C.transition,
          }}
          className="pp-clear-btn"
        >
          <i className="fa fa-times-circle" style={{ fontSize: '0.78rem' }}></i>
          Clear All Filters
        </Link>
      )}
    </div>
  );

  return (
    <>
      <style>{`
        .pp-pill:hover   { background: rgba(200,64,10,0.06) !important; color: var(--primary) !important; border-left-color: rgba(200,64,10,0.4) !important; }
        .pp-apply-btn:hover { background: var(--accent) !important; }
        .pp-clear-btn:hover { background: rgba(239,68,68,0.12) !important; }
        .pp-input:focus  { border-color: var(--primary) !important; box-shadow: 0 0 0 3px rgba(200,64,10,0.12); }
        .pp-search:focus { border-color: var(--primary) !important; box-shadow: 0 0 0 3px rgba(200,64,10,0.1); outline:none; }
        .pp-sort:focus   { border-color: var(--primary) !important; outline:none; }
        .pp-mobile-toggle:hover { background: var(--accent) !important; }

        /* ── Mobile / Tablet drawer ── */
        .pp-drawer-backdrop {
          display: none;
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.45);
          z-index: 1040;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .pp-drawer-backdrop.open {
          display: block;
          opacity: 1;
        }
        .pp-drawer {
          position: fixed;
          top: 0; left: 0;
          height: 100%;
          width: min(320px, 85vw);
          background: #fff;
          z-index: 1050;
          transform: translateX(-100%);
          transition: transform 0.32s cubic-bezier(0.4,0,0.2,1);
          overflow-y: auto;
          padding: 0 0 32px;
          box-shadow: 4px 0 24px rgba(0,0,0,0.18);
        }
        .pp-drawer.open {
          transform: translateX(0);
        }
        .pp-drawer-header {
          position: sticky; top: 0; z-index: 2;
          display: flex; align-items: center; justify-content: space-between;
          padding: 16px 18px;
          background: linear-gradient(135deg, var(--accent) 0%, #2d2d4e 100%);
        }
        .pp-drawer-close {
          background: rgba(255,255,255,0.15);
          border: none; cursor: pointer;
          color: #fff; border-radius: 50%;
          width: 32px; height: 32px;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.9rem;
          transition: background 0.2s;
        }
        .pp-drawer-close:hover { background: rgba(255,255,255,0.3); }
        .pp-drawer-body { padding: 18px 16px 0; }
      `}</style>

      <HeroSection title="Products" />

      <div style={{ background: 'var(--light)', minHeight: '100vh', padding: '32px 0 80px' }}>
        <div className="container-xxl">
          <div className="row g-4">

            {/* ── Desktop Sidebar ── */}
            <div className="col-md-3 col-lg-2 d-none d-md-block">
              <div style={{ position: 'sticky', top: 90 }}>
                {/* Sidebar header */}
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  marginBottom: 14,
                }}>
                  <div style={{
                    fontFamily: "'Playfair Display', serif",
                    fontWeight: 800, fontSize: '1rem', color: C.dark,
                    display: 'flex', alignItems: 'center', gap: 7,
                  }}>
                    <i className="fa fa-sliders-h" style={{ color: C.primary, fontSize: '0.9rem' }}></i>
                    Filters
                  </div>
                  {activeCount > 0 && (
                    <span style={{
                      background: C.primary, color: '#fff',
                      borderRadius: 50, fontSize: '0.68rem',
                      fontWeight: 800, padding: '2px 8px',
                    }}>{activeCount}</span>
                  )}
                </div>
                <Filters />
              </div>
            </div>

            {/* ── Main Content ── */}
            <div className="col-md-9 col-lg-10">

              {/* ── Toolbar ── */}
              <div style={{
                display: 'flex', gap: 10, flexWrap: 'wrap',
                alignItems: 'center', marginBottom: 20,
              }}>
                {/* Mobile filter toggle */}
                <button
                  className="d-md-none pp-mobile-toggle"
                  onClick={() => setMobileOpen(o => !o)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 7,
                    padding: '10px 18px', borderRadius: 50,
                    border: 'none', background: C.primary,
                    color: '#fff', fontWeight: 700, fontSize: '0.85rem',
                    cursor: 'pointer', transition: C.transition,
                    position: 'relative',
                  }}
                >
                  <i className="fa fa-sliders-h" style={{ fontSize: '0.82rem' }}></i>
                  Filters
                  {activeCount > 0 && (
                    <span style={{
                      background: '#fff', color: C.primary,
                      borderRadius: 50, fontSize: '0.65rem',
                      fontWeight: 900, padding: '1px 6px',
                    }}>{activeCount}</span>
                  )}
                </button>

                {/* Search */}
                <div style={{
                  display: 'flex', flex: '1 1 220px',
                  border: `1.5px solid var(--border)`,
                  borderRadius: 50, overflow: 'hidden',
                  background: '#fff',
                  boxShadow: 'var(--shadow-sm)',
                }}>
                  <input
                    type="search"
                    placeholder="Search dishes, categories, restaurants…"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && applyFilters(mc, sc, rn, min, max, search)}
                    className="pp-search"
                    style={{
                      flex: 1, padding: '10px 18px',
                      border: 'none', background: 'transparent',
                      fontSize: '0.88rem', color: C.dark,
                      fontFamily: 'DM Sans, sans-serif',
                    }}
                  />
                  <button
                    onClick={() => applyFilters(mc, sc, rn, min, max, search)}
                    style={{
                      padding: '10px 18px', border: 'none',
                      background: C.primary, color: '#fff',
                      cursor: 'pointer', transition: C.transition,
                      display: 'flex', alignItems: 'center',
                      fontSize: '0.85rem',
                    }}
                  >
                    <i className="fa fa-search"></i>
                  </button>
                </div>

                {/* Sort */}
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <i className="fa fa-sort-amount-down" style={{
                    position: 'absolute', left: 14, top: '50%',
                    transform: 'translateY(-50%)',
                    color: C.primary, fontSize: '0.8rem', pointerEvents: 'none', zIndex: 1,
                  }}></i>
                  <select
                    onChange={e => sortFilter(e.target.value)}
                    className="pp-sort"
                    style={{
                      padding: '10px 14px 10px 36px',
                      borderRadius: 50,
                      border: `1.5px solid var(--border)`,
                      background: '#fff',
                      fontSize: '0.85rem', color: C.dark,
                      fontFamily: 'DM Sans, sans-serif',
                      cursor: 'pointer',
                      boxShadow: 'var(--shadow-sm)',
                      appearance: 'none',
                      minWidth: 180,
                    }}
                  >
                    <option value="latest">Latest</option>
                    <option value="price_high">Price: High → Low</option>
                    <option value="price_low">Price: Low → High</option>
                    <option value="discount_high">Discount: High → Low</option>
                    <option value="discount_low">Discount: Low → High</option>
                  </select>
                </div>
              </div>

              {/* Active filter chips row */}
              {(mc !== "All" || sc !== "All" || rn !== "All") && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
                  {mc !== "All" && (
                    <Link to={`/product?mc=All&sc=${sc}&rn=${rn}`} style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      padding: '5px 12px', borderRadius: 50,
                      background: 'rgba(200,64,10,0.09)',
                      border: '1px solid rgba(200,64,10,0.2)',
                      color: C.primary, fontSize: '0.78rem',
                      fontWeight: 600, textDecoration: 'none',
                    }}>
                      <i className="fa fa-layer-group" style={{ fontSize: '0.7rem' }}></i>
                      {mc}
                      <i className="fa fa-times" style={{ fontSize: '0.65rem', opacity: 0.7 }}></i>
                    </Link>
                  )}
                  {sc !== "All" && (
                    <Link to={`/product?mc=${mc}&sc=All&rn=${rn}`} style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      padding: '5px 12px', borderRadius: 50,
                      background: 'rgba(200,64,10,0.09)',
                      border: '1px solid rgba(200,64,10,0.2)',
                      color: C.primary, fontSize: '0.78rem',
                      fontWeight: 600, textDecoration: 'none',
                    }}>
                      <i className="fa fa-list" style={{ fontSize: '0.7rem' }}></i>
                      {sc}
                      <i className="fa fa-times" style={{ fontSize: '0.65rem', opacity: 0.7 }}></i>
                    </Link>
                  )}
                  {rn !== "All" && (
                    <Link to={`/product?mc=${mc}&sc=${sc}&rn=All`} style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      padding: '5px 12px', borderRadius: 50,
                      background: 'rgba(200,64,10,0.09)',
                      border: '1px solid rgba(200,64,10,0.2)',
                      color: C.primary, fontSize: '0.78rem',
                      fontWeight: 600, textDecoration: 'none',
                    }}>
                      <i className="fa fa-store" style={{ fontSize: '0.7rem' }}></i>
                      {rn}
                      <i className="fa fa-times" style={{ fontSize: '0.65rem', opacity: 0.7 }}></i>
                    </Link>
                  )}
                </div>
              )}

              {/* Result count */}
              <div style={{
                fontSize: '0.82rem', color: C.gray,
                marginBottom: 16, fontWeight: 500,
              }}>
                <i className="fa fa-fire me-1" style={{ color: C.primary, fontSize: '0.78rem' }}></i>
                Showing <strong style={{ color: C.dark }}>{data.length}</strong> dish{data.length !== 1 ? 'es' : ''}
                {mc !== "All" ? ` in "${mc}"` : ''}
              </div>

              {/* Mobile / Tablet — Drawer + Backdrop */}
              <div
                className={`pp-drawer-backdrop d-md-none${mobileOpen ? ' open' : ''}`}
                onClick={() => setMobileOpen(false)}
              />
              <div className={`pp-drawer d-md-none${mobileOpen ? ' open' : ''}`}>
                <div className="pp-drawer-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <i className="fa fa-sliders-h" style={{ color: 'var(--secondary)', fontSize: '0.9rem' }}></i>
                    <span style={{ fontFamily: "'Playfair Display',serif", fontWeight: 800, fontSize: '1rem', color: '#fff' }}>
                      Filters
                    </span>
                    {activeCount > 0 && (
                      <span style={{
                        background: 'var(--primary)', color: '#fff',
                        borderRadius: 50, fontSize: '0.65rem',
                        fontWeight: 900, padding: '2px 7px',
                      }}>{activeCount}</span>
                    )}
                  </div>
                  <button className="pp-drawer-close" onClick={() => setMobileOpen(false)}>
                    <i className="fa fa-times"></i>
                  </button>
                </div>
                <div className="pp-drawer-body">
                  <Filters />
                </div>
              </div>

              {/* Products grid */}
              <Products data={data} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}