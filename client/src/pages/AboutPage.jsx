import React from 'react'
import HeroSection from '../Components/HeroSection'
import About from '../Components/About'
import { Link } from "react-router-dom"

const features = [
  { icon: 'fa-utensils',      color: 'var(--primary)',   title: 'Diverse Cuisine',     desc: 'Choose from a wide range of top restaurants.' },
  { icon: 'fa-motorcycle',    color: '#16a34a',           title: 'Super Fast Delivery', desc: 'Enjoy hot & fresh meals delivered on time.' },
  { icon: 'fa-calendar-check',color: 'var(--secondary)',  title: 'Easy Seat Booking',   desc: 'Reserve your favorite spot with just a click.' },
  { icon: 'fa-percent',       color: 'var(--primary)',   title: 'Exclusive Discounts', desc: 'Get the best deals and save more on orders.' },
]

const stats = [
  { emoji: '🍕', value: '50,000+', label: 'Orders Delivered' },
  { emoji: '😊', value: '25,000+', label: 'Satisfied Customers' },
  { emoji: '🏨', value: '10,000+', label: 'Restaurant Bookings' },
]

export default function AboutPage() {
  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(28px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes countUp {
          from { opacity:0; transform:scale(0.85); }
          to   { opacity:1; transform:scale(1); }
        }
        .ap-feat-card { transition: var(--transition); }
        .ap-feat-card:hover {
          transform: translateY(-6px);
          box-shadow: var(--shadow-md) !important;
          border-color: rgba(200,64,10,0.22) !important;
        }
        .ap-feat-card:hover .ap-feat-icon { background: var(--primary) !important; }
        .ap-feat-card:hover .ap-feat-icon i { color: #fff !important; }
        .ap-cta:hover { background: var(--accent) !important; transform:translateY(-2px); box-shadow:0 10px 32px rgba(28,16,9,0.2) !important; }
        .ap-stat-card { transition: var(--transition); }
        .ap-stat-card:hover { transform:translateY(-5px); box-shadow:var(--shadow-md) !important; }
      `}</style>

      <HeroSection title="About Us" />
      <About title="About Us" />

      {/* ── Why Choose Us ── */}
      <section style={{ padding: '80px 0', background: 'var(--light)' }}>
        <div className="container-xxl">

          {/* Section header */}
          <div className="text-center mb-5 section-header">
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(1.8rem,4vw,2.6rem)',
              fontWeight: 900, color: 'var(--dark)', marginBottom: 12,
            }}>
              Why Choose <span style={{ color: 'var(--primary)' }}>Us?</span>
            </h2>
            <p style={{ maxWidth: 560, margin: '0 auto', color: 'var(--gray)', fontSize: '0.95rem', lineHeight: 1.75 }}>
              Experience seamless food delivery & hassle-free restaurant seat booking — all in one place.
            </p>
          </div>

          <div className="row g-5 align-items-center">
            {/* Left — image */}
            <div className="col-lg-5">
              <div style={{ position: 'relative', borderRadius: 'var(--radius)', overflow: 'hidden', boxShadow: 'var(--shadow-lg)' }}>
                <img
                  src="/img/fr1.jpg"
                  alt="Food Delivery"
                  style={{ width: '100%', display: 'block', objectFit: 'cover', aspectRatio: '4/3' }}
                />
                {/* Floating badge */}
                <div style={{
                  position: 'absolute', bottom: 20, left: 20,
                  background: 'rgba(255,255,255,0.95)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '12px 18px',
                  boxShadow: 'var(--shadow-md)',
                  display: 'flex', alignItems: 'center', gap: 10,
                }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: '50%',
                    background: 'rgba(200,64,10,0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <i className="fa fa-star" style={{ color: 'var(--secondary)', fontSize: '1rem' }}></i>
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--dark)', fontFamily: "'Playfair Display',serif" }}>4.9 / 5 Rating</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--gray)' }}>Based on 25,000+ reviews</div>
                  </div>
                </div>
                {/* Corner accent */}
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                  background: 'linear-gradient(to top, rgba(28,16,9,0.15) 0%, transparent 50%)',
                  pointerEvents: 'none',
                }} />
              </div>
            </div>

            {/* Right — feature cards */}
            <div className="col-lg-7">
              <div className="row g-3">
                {features.map(({ icon, color, title, desc }) => (
                  <div key={title} className="col-sm-6">
                    <div
                      className="ap-feat-card"
                      style={{
                        background: '#fff',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border)',
                        padding: '20px',
                        boxShadow: 'var(--shadow-sm)',
                        display: 'flex', alignItems: 'flex-start', gap: 14,
                      }}
                    >
                      <div
                        className="ap-feat-icon"
                        style={{
                          width: 46, height: 46, borderRadius: 12, flexShrink: 0,
                          background: 'rgba(200,64,10,0.08)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          transition: 'var(--transition)',
                        }}
                      >
                        <i className={`fa ${icon}`} style={{ color, fontSize: '1.1rem', transition: 'color 0.3s' }}></i>
                      </div>
                      <div>
                        <div style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: '0.95rem', color: 'var(--dark)', marginBottom: 4 }}>{title}</div>
                        <div style={{ fontSize: '0.82rem', color: 'var(--gray)', lineHeight: 1.6 }}>{desc}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4">
                <Link
                  to="/product"
                  className="ap-cta"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    padding: '13px 32px', borderRadius: 50,
                    background: 'var(--primary)', color: '#fff',
                    fontWeight: 700, fontSize: '0.92rem', textDecoration: 'none',
                    boxShadow: '0 6px 24px rgba(200,64,10,0.3)',
                    transition: 'var(--transition)',
                  }}
                >
                  Explore Now <i className="fa fa-arrow-right" style={{ fontSize: '0.85rem' }}></i>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section style={{ padding: '80px 0', background: 'var(--accent)' }}>
        <div className="container-xxl">
          <div className="text-center mb-5">
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(1.8rem,4vw,2.4rem)',
              fontWeight: 900, color: '#fff', marginBottom: 10,
            }}>
              Our <span style={{ color: 'var(--secondary)' }}>Achievements</span>
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.9rem' }}>
              Numbers that speak for themselves
            </p>
          </div>

          <div className="row g-4 justify-content-center">
            {stats.map(({ emoji, value, label }) => (
              <div key={label} className="col-md-4 col-sm-6">
                <div
                  className="ap-stat-card"
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 'var(--radius)',
                    padding: '36px 24px',
                    textAlign: 'center',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                  }}
                >
                  <div style={{ fontSize: '2.8rem', marginBottom: 10, lineHeight: 1 }}>{emoji}</div>
                  <div style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: 'clamp(2rem,5vw,2.8rem)',
                    fontWeight: 900, color: '#fff', lineHeight: 1, marginBottom: 8,
                  }}>
                    {value}
                  </div>
                  <div style={{
                    fontSize: '0.85rem', color: 'rgba(255,255,255,0.55)',
                    fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase',
                  }}>
                    {label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}