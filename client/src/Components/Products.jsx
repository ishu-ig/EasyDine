import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Products({ data, show }) {
  const [displayedData, setDisplayedData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [itemsToShow, setItemsToShow] = useState(16);

  useEffect(() => {
    setDisplayedData(data.slice(0, itemsToShow));
  }, [data, itemsToShow]);

  function loadMore() {
    setLoading(true);
    setTimeout(() => {
      setItemsToShow((prev) => prev + 16);
      setLoading(false);
    }, 800);
  }

  return (
    <div style={{ padding: '72px 0', background: '#FFFBF7' }}>
      <div className="container">

        {/* Section Header */}
        {show === "true" && (
          <div className="row align-items-end mb-5">
            <div className="col-lg-6">
              <p style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.14em', color: 'var(--primary)', textTransform: 'uppercase', marginBottom: 8 }}>
                Fresh Picks
              </p>
              <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', fontWeight: 900, color: 'var(--dark)', lineHeight: 1.2, margin: 0 }}>
                Our Products
              </h2>
              <p style={{ color: 'var(--gray)', marginTop: 12, marginBottom: 0, fontSize: '0.95rem' }}>
                Discover top dishes with great deals and discounts.
              </p>
            </div>
            <div className="col-lg-6 d-none d-lg-flex justify-content-end">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 40, height: 3, background: 'var(--primary)', borderRadius: 2, display: 'block' }} />
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--secondary)', display: 'block' }} />
                <span style={{ width: 60, height: 3, background: 'var(--secondary)', borderRadius: 2, display: 'block', opacity: 0.5 }} />
              </div>
            </div>
          </div>
        )}

        {/* Product Grid */}
        <div className="row g-4">
          {displayedData.length > 0 ? (
            displayedData.map((item, index) => (
              <div key={index} className="col-xl-3 col-lg-4 col-md-6">
                <div
                  style={{
                    background: 'white',
                    borderRadius: 20,
                    overflow: 'hidden',
                    boxShadow: '0 2px 12px rgba(28,16,9,0.07)',
                    border: '1px solid rgba(200,64,10,0.08)',
                    transition: 'transform 0.35s cubic-bezier(0.4,0,0.2,1), box-shadow 0.35s ease',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.boxShadow = '0 20px 50px rgba(28,16,9,0.15)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = '';
                    e.currentTarget.style.boxShadow = '0 2px 12px rgba(28,16,9,0.07)';
                  }}
                >
                  {/* Image area */}
                  <div style={{ position: 'relative', height: 240, overflow: 'hidden' }}>
                    <img
                      src={`${process.env.REACT_APP_BACKEND_SERVER}/${item.pic}`}
                      alt={item.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                      onMouseEnter={e => e.target.style.transform = 'scale(1.07)'}
                      onMouseLeave={e => e.target.style.transform = ''}
                    />
                    {/* Badge */}
                    <div style={{
                      position: 'absolute', top: 14, left: 14,
                      background: item.discount > 0
                        ? 'linear-gradient(135deg, var(--primary), #E86834)'
                        : 'linear-gradient(135deg, #10b981, #059669)',
                      color: 'white',
                      padding: '4px 12px',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      borderRadius: 50,
                      letterSpacing: '0.04em',
                    }}>
                      {item.discount > 0 ? `${item.discount}% OFF` : '✦ New'}
                    </div>
                  </div>

                  {/* Info */}
                  <div style={{ padding: '16px 18px 12px', flex: 1 }}>
                    <Link
                      to={`/product/${item._id}`}
                      style={{
                        fontFamily: 'Playfair Display, serif',
                        fontWeight: 700,
                        fontSize: '1rem',
                        color: 'var(--dark)',
                        textDecoration: 'none',
                        display: 'block',
                        marginBottom: 8,
                        transition: 'color 0.2s',
                      }}
                      onMouseEnter={e => e.target.style.color = 'var(--primary)'}
                      onMouseLeave={e => e.target.style.color = 'var(--dark)'}
                    >
                      {item.name}
                    </Link>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '1.1rem' }}>
                        ₹{item.finalPrice}
                      </span>
                      <span style={{ color: 'var(--gray)', textDecoration: 'line-through', fontSize: '0.88rem' }}>
                        ₹{item.basePrice}
                      </span>
                      {item.discount > 0 && (
                        <span style={{
                          marginLeft: 'auto',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          color: '#10b981',
                          background: 'rgba(16,185,129,0.1)',
                          padding: '2px 8px',
                          borderRadius: 50,
                        }}>
                          Save ₹{item.basePrice - item.finalPrice}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div style={{ display: 'flex', borderTop: '1px solid rgba(200,64,10,0.08)' }}>
                    <Link
                      to={`/product/${item._id}`}
                      style={{
                        flex: 1,
                        padding: '11px 0',
                        textAlign: 'center',
                        background: 'var(--primary)',
                        color: 'white',
                        fontWeight: 700,
                        fontSize: '0.82rem',
                        letterSpacing: '0.02em',
                        textDecoration: 'none',
                        transition: 'background 0.25s',
                        borderRadius: '0 0 0 18px',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--accent)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'var(--primary)'}
                    >
                      <i className="fa fa-shopping-bag me-2"></i>Add to Cart
                    </Link>
                    <Link
                      to=""
                      style={{
                        flex: 0,
                        padding: '11px 18px',
                        textAlign: 'center',
                        background: '#fff0f3',
                        color: '#f43f5e',
                        fontWeight: 700,
                        fontSize: '0.82rem',
                        textDecoration: 'none',
                        transition: 'background 0.25s, color 0.25s',
                        borderRadius: '0 0 18px 0',
                        borderLeft: '1px solid rgba(200,64,10,0.08)',
                        whiteSpace: 'nowrap',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = '#f43f5e';
                        e.currentTarget.style.color = 'white';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = '#fff0f3';
                        e.currentTarget.style.color = '#f43f5e';
                      }}
                    >
                      <i className="fa fa-heart"></i>
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12 text-center py-5">
              <div style={{ fontSize: '3rem', marginBottom: 16 }}>🍽️</div>
              <p style={{ color: 'var(--gray)', fontSize: '1rem' }}>No products found</p>
            </div>
          )}

          {/* Skeleton Loader */}
          {loading &&
            Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="col-xl-3 col-lg-4 col-md-6">
                <div style={{ background: 'white', borderRadius: 20, overflow: 'hidden', boxShadow: '0 2px 12px rgba(28,16,9,0.07)' }}>
                  <div style={{ height: 240 }} className="skeleton w-100"></div>
                  <div style={{ padding: '16px 18px 20px' }}>
                    <div className="skeleton" style={{ height: 18, borderRadius: 6, marginBottom: 10, width: '75%' }}></div>
                    <div className="skeleton" style={{ height: 14, borderRadius: 6, width: '50%' }}></div>
                  </div>
                </div>
              </div>
            ))}
        </div>

        {/* Load More */}
        {itemsToShow < data.length && (
          <div className="text-center mt-5">
            <button
              onClick={loadMore}
              disabled={loading}
              style={{
                background: loading ? 'var(--gray)' : 'var(--primary)',
                color: 'white',
                border: 'none',
                borderRadius: 50,
                padding: '14px 40px',
                fontWeight: 700,
                fontSize: '0.9rem',
                letterSpacing: '0.04em',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 8px 20px rgba(200,64,10,0.25)',
              }}
              onMouseEnter={e => !loading && (e.currentTarget.style.background = 'var(--accent)')}
              onMouseLeave={e => !loading && (e.currentTarget.style.background = 'var(--primary)')}
            >
              {loading ? (
                <><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Loading...</>
              ) : (
                'Browse More Products →'
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}