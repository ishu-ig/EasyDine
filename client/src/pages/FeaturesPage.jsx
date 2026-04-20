import React from 'react';
import HeroSection from '../Components/HeroSection';
import Features from '../Components/Features';

const featureCards = [
  { icon: 'fa-map-marked-alt', title: 'Real-time Order Tracking',      desc: 'Track your order from preparation to doorstep with live updates.',           color: 'var(--primary)' },
  { icon: 'fa-robot',          title: 'AI-Powered Recommendations',     desc: 'Discover dishes based on your past orders and dietary preferences.',         color: '#7c3aed' },
  { icon: 'fa-credit-card',    title: 'Secure Online Payments',         desc: 'Pay safely using credit/debit cards, UPI, or digital wallets.',               color: '#16a34a' },
  { icon: 'fa-users',          title: 'Group Ordering',                 desc: 'Order together with friends and split payments easily.',                      color: 'var(--secondary)' },
  { icon: 'fa-calendar-alt',   title: 'Scheduled Deliveries',           desc: 'Plan your meals by pre-ordering at your preferred time.',                     color: '#0891b2' },
  { icon: 'fa-tags',           title: 'Exclusive Discounts',            desc: 'Enjoy special deals, coupons, and seasonal offers just for you.',             color: 'var(--primary)' },
]

export default function FeaturesPage() {
  return (
    <>
      <style>{`
        .fp-card { transition: var(--transition); position: relative; overflow: hidden; }
        .fp-card::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0;
          height: 3px;
          background: linear-gradient(90deg, var(--primary), var(--secondary));
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.35s ease;
        }
        .fp-card:hover::before { transform: scaleX(1); }
        .fp-card:hover {
          transform: translateY(-8px);
          box-shadow: var(--shadow-lg) !important;
          border-color: rgba(200,64,10,0.2) !important;
        }
        .fp-card:hover .fp-icon-wrap { transform: scale(1.1) rotate(-4deg); }
        .fp-icon-wrap { transition: transform 0.35s cubic-bezier(.4,0,.2,1); }
      `}</style>

      <HeroSection title="Features" />
      <Features />

      {/* ── Why Choose Our Service ── */}
      <section style={{ padding: '80px 0', background: 'var(--light)' }}>
        <div className="container-xxl">

          {/* Header */}
          <div className="text-center mb-5 section-header">
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(1.8rem,4vw,2.6rem)',
              fontWeight: 900, color: 'var(--dark)', marginBottom: 14,
            }}>
              Why Choose Our <span style={{ color: 'var(--primary)' }}>Service?</span>
            </h2>
            <p style={{
              maxWidth: 640, margin: '0 auto',
              color: 'var(--gray)', fontSize: '0.95rem', lineHeight: 1.8,
            }}>
              Our platform ensures a seamless food ordering experience with features designed
              to enhance convenience, speed, and customization — from eco-friendly packaging to express delivery.
            </p>
          </div>

          {/* Feature grid */}
          <div className="row g-4">
            {featureCards.map(({ icon, title, desc, color }) => (
              <div key={title} className="col-lg-4 col-md-6">
                <div
                  className="fp-card"
                  style={{
                    background: '#fff',
                    borderRadius: 'var(--radius)',
                    border: '1px solid var(--border)',
                    boxShadow: 'var(--shadow-sm)',
                    padding: '36px 28px',
                    height: '100%',
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    textAlign: 'center', gap: 0,
                  }}
                >
                  {/* Icon */}
                  <div
                    className="fp-icon-wrap"
                    style={{
                      width: 76, height: 76, borderRadius: '50%',
                      background: `${color}18`,
                      border: `1.5px solid ${color}30`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      marginBottom: 22, flexShrink: 0,
                    }}
                  >
                    <i className={`fa ${icon}`} style={{ fontSize: '1.8rem', color }}></i>
                  </div>

                  {/* Title */}
                  <div style={{
                    fontFamily: "'Playfair Display', serif",
                    fontWeight: 800, fontSize: '1.05rem',
                    color: 'var(--dark)', marginBottom: 10,
                  }}>
                    {title}
                  </div>

                  {/* Desc */}
                  <div style={{ fontSize: '0.88rem', color: 'var(--gray)', lineHeight: 1.75, flex: 1 }}>
                    {desc}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom CTA banner */}
          <div style={{
            marginTop: 56,
            borderRadius: 'var(--radius)',
            background: `linear-gradient(135deg, var(--accent) 0%, #2d2d4e 100%)`,
            padding: '48px 40px',
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', flexWrap: 'wrap', gap: 24,
            boxShadow: 'var(--shadow-lg)',
          }}>
            <div>
              <div style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 'clamp(1.3rem,3vw,1.8rem)',
                fontWeight: 900, color: '#fff', marginBottom: 8,
              }}>
                Ready to experience the difference?
              </div>
              <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.55)' }}>
                Join 25,000+ happy customers who order with EazyDine every day.
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <a
                href="/product"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '13px 28px', borderRadius: 50,
                  background: 'var(--primary)', color: '#fff',
                  fontWeight: 700, fontSize: '0.92rem', textDecoration: 'none',
                  boxShadow: '0 6px 20px rgba(200,64,10,0.4)',
                  transition: 'var(--transition)',
                }}
              >
                <i className="fa fa-utensils"></i> Order Now
              </a>
              <a
                href="/resturent"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '13px 28px', borderRadius: 50,
                  background: 'rgba(255,255,255,0.1)',
                  border: '1.5px solid rgba(255,255,255,0.2)',
                  color: '#fff', fontWeight: 700,
                  fontSize: '0.92rem', textDecoration: 'none',
                  transition: 'var(--transition)',
                }}
              >
                <i className="fa fa-store"></i> Book a Table
              </a>
            </div>
          </div>

        </div>
      </section>
    </>
  );
}