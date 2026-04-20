import React from 'react';
import HeroSection from '../Components/HeroSection';
import Testimonials from '../Components/Testimonials';

const reasons = [
  {
    icon: 'fa-star',
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.1)',
    title: 'High Customer Satisfaction',
    desc: '90%+ of our customers rate us 5 stars for quality, speed, and service.',
    stat: '90%+', statLabel: '5-star ratings',
  },
  {
    icon: 'fa-shipping-fast',
    color: 'var(--primary)',
    bg: 'rgba(200,64,10,0.08)',
    title: 'Fast & Reliable Delivery',
    desc: 'Customers love our timely deliveries, ensuring fresh and hot meals every time.',
    stat: '30 min', statLabel: 'avg. delivery',
  },
  {
    icon: 'fa-mobile-alt',
    color: '#7c3aed',
    bg: 'rgba(124,58,237,0.08)',
    title: 'Easy Ordering Process',
    desc: 'Our intuitive interface allows seamless food ordering in just a few taps.',
    stat: '3 taps', statLabel: 'to order',
  },
  {
    icon: 'fa-tag',
    color: '#16a34a',
    bg: 'rgba(22,163,74,0.08)',
    title: 'Affordable Prices',
    desc: 'Customers enjoy great meals at budget-friendly prices with exclusive deals.',
    stat: '40%', statLabel: 'avg. savings',
  },
  {
    icon: 'fa-headset',
    color: '#0891b2',
    bg: 'rgba(8,145,178,0.08)',
    title: 'Excellent Customer Support',
    desc: 'Our 24/7 support team ensures customers get help whenever they need it.',
    stat: '24/7', statLabel: 'support',
  },
  {
    icon: 'fa-edit',
    color: 'var(--secondary)',
    bg: 'rgba(244,160,68,0.1)',
    title: 'Customizable Orders',
    desc: 'Customers can modify meals to perfectly suit their dietary preferences.',
    stat: '100%', statLabel: 'flexible',
  },
];

const trustStats = [
  { value: '25,000+', label: 'Happy Customers', icon: 'fa-users' },
  { value: '4.9',     label: 'Average Rating',  icon: 'fa-star' },
  { value: '50,000+', label: 'Orders Delivered', icon: 'fa-shopping-bag' },
  { value: '98%',     label: 'Satisfaction Rate', icon: 'fa-heart' },
];

export default function TestimonialPage() {
  return (
    <>
      <style>{`
        @keyframes tp-fadeUp {
          from { opacity:0; transform:translateY(28px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .tp-reason-card { transition: var(--transition); position: relative; overflow: hidden; }
        .tp-reason-card::after {
          content: '';
          position: absolute; bottom: 0; left: 0; right: 0;
          height: 3px;
          background: linear-gradient(90deg, var(--primary), var(--secondary));
          transform: scaleX(0); transform-origin: left;
          transition: transform 0.35s ease;
        }
        .tp-reason-card:hover::after { transform: scaleX(1); }
        .tp-reason-card:hover {
          transform: translateY(-7px);
          box-shadow: var(--shadow-lg) !important;
          border-color: rgba(200,64,10,0.18) !important;
        }
        .tp-reason-card:hover .tp-icon-wrap { transform: scale(1.12) rotate(-5deg); }
        .tp-icon-wrap { transition: transform 0.35s cubic-bezier(.4,0,.2,1); }
        .tp-stat-card { transition: var(--transition); }
        .tp-stat-card:hover { transform: translateY(-5px); box-shadow: 0 12px 40px rgba(200,64,10,0.2) !important; }
      `}</style>

      <HeroSection title="Testimonials" />
      <Testimonials />

      {/* ── Trust bar ── */}
      <section style={{ background: 'var(--accent)', padding: '48px 0' }}>
        <div className="container-xxl">
          <div className="row g-3 justify-content-center">
            {trustStats.map(({ value, label, icon }) => (
              <div key={label} className="col-6 col-md-3">
                <div
                  className="tp-stat-card"
                  style={{
                    textAlign: 'center',
                    padding: '24px 16px',
                    borderRadius: 'var(--radius)',
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  <div style={{
                    width: 44, height: 44, borderRadius: '50%',
                    background: 'rgba(244,160,68,0.18)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 12px',
                  }}>
                    <i className={`fa ${icon}`} style={{ color: 'var(--secondary)', fontSize: '1rem' }}></i>
                  </div>
                  <div style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: 'clamp(1.5rem,4vw,2rem)',
                    fontWeight: 900, color: '#fff', lineHeight: 1,
                    marginBottom: 6,
                  }}>
                    {value}
                  </div>
                  <div style={{
                    fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)',
                    fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em',
                  }}>
                    {label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why customers love us ── */}
      <section style={{ padding: '80px 0', background: 'var(--light)' }}>
        <div className="container-xxl">

          {/* Section header */}
          <div className="text-center mb-5 section-header">
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(1.8rem,4vw,2.6rem)',
              fontWeight: 900, color: 'var(--dark)', marginBottom: 14,
            }}>
              Why Our Customers <span style={{ color: 'var(--primary)' }}>Love Us</span>
            </h2>
            <p style={{
              maxWidth: 620, margin: '0 auto',
              color: 'var(--gray)', fontSize: '0.95rem', lineHeight: 1.8,
            }}>
              We take pride in delivering top-quality service and an outstanding food
              experience. Here's what makes us stand out from the rest.
            </p>
          </div>

          {/* Reason cards */}
          <div className="row g-4">
            {reasons.map(({ icon, color, bg, title, desc, stat, statLabel }) => (
              <div key={title} className="col-lg-4 col-md-6">
                <div
                  className="tp-reason-card"
                  style={{
                    background: '#fff',
                    borderRadius: 'var(--radius)',
                    border: '1px solid var(--border)',
                    boxShadow: 'var(--shadow-sm)',
                    padding: '32px 28px',
                    height: '100%',
                    display: 'flex', flexDirection: 'column',
                  }}
                >
                  {/* Icon + stat row */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                    <div
                      className="tp-icon-wrap"
                      style={{
                        width: 60, height: 60, borderRadius: 16,
                        background: bg,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}
                    >
                      <i className={`fa ${icon}`} style={{ fontSize: '1.5rem', color }}></i>
                    </div>
                    {/* Floating stat */}
                    <div style={{ textAlign: 'right' }}>
                      <div style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: '1.4rem', fontWeight: 900,
                        color, lineHeight: 1,
                      }}>
                        {stat}
                      </div>
                      <div style={{
                        fontSize: '0.68rem', color: 'var(--gray)',
                        fontWeight: 700, textTransform: 'uppercase',
                        letterSpacing: '0.05em', marginTop: 2,
                      }}>
                        {statLabel}
                      </div>
                    </div>
                  </div>

                  {/* Title */}
                  <div style={{
                    fontFamily: "'Playfair Display', serif",
                    fontWeight: 800, fontSize: '1rem',
                    color: 'var(--dark)', marginBottom: 10,
                  }}>
                    {title}
                  </div>

                  {/* Desc */}
                  <div style={{
                    fontSize: '0.88rem', color: 'var(--gray)',
                    lineHeight: 1.75, flex: 1,
                  }}>
                    {desc}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div style={{
            marginTop: 56, textAlign: 'center',
            padding: '48px 32px',
            borderRadius: 'var(--radius)',
            background: 'linear-gradient(135deg, var(--primary) 0%, #e05a20 100%)',
            boxShadow: '0 12px 48px rgba(200,64,10,0.28)',
            position: 'relative', overflow: 'hidden',
          }}>
            {/* Decorative circle */}
            <div style={{
              position: 'absolute', top: -60, right: -60,
              width: 220, height: 220, borderRadius: '50%',
              background: 'rgba(255,255,255,0.06)',
              pointerEvents: 'none',
            }} />
            <div style={{
              position: 'absolute', bottom: -40, left: -40,
              width: 160, height: 160, borderRadius: '50%',
              background: 'rgba(255,255,255,0.05)',
              pointerEvents: 'none',
            }} />

            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 'clamp(1.3rem,3vw,1.8rem)',
                fontWeight: 900, color: '#fff', marginBottom: 10,
              }}>
                Ready to join our happy customers?
              </div>
              <div style={{
                fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)',
                marginBottom: 28, maxWidth: 460, margin: '0 auto 28px',
              }}>
                Experience the best food delivery and restaurant booking platform today.
              </div>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                <a
                  href="/product"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    padding: '13px 32px', borderRadius: 50,
                    background: '#fff', color: 'var(--primary)',
                    fontWeight: 800, fontSize: '0.92rem', textDecoration: 'none',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                    transition: 'var(--transition)',
                  }}
                >
                  <i className="fa fa-utensils"></i> Order Now
                </a>
                <a
                  href="/resturent"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    padding: '13px 32px', borderRadius: 50,
                    background: 'rgba(255,255,255,0.15)',
                    border: '1.5px solid rgba(255,255,255,0.3)',
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

        </div>
      </section>
    </>
  );
}