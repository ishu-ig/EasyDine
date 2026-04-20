import React from 'react';
import { Link } from 'react-router-dom';

export default function Error() {
  return (
    <>
      <style>{`
        @keyframes float {
          0%,100% { transform: translateY(0px); }
          50%      { transform: translateY(-18px); }
        }
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(30px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        .err-home:hover {
          background: var(--accent) !important;
          transform: translateY(-3px) !important;
          box-shadow: 0 12px 36px rgba(28,16,9,0.22) !important;
        }
        .err-back:hover {
          background: rgba(200,64,10,0.1) !important;
          border-color: var(--primary) !important;
          color: var(--primary) !important;
        }
        .err-plate { animation: float 3.5s ease-in-out infinite; }
        .err-group { animation: fadeUp 0.7s cubic-bezier(.4,0,.2,1) both; }
        .err-group:nth-child(2) { animation-delay: 0.12s; }
        .err-group:nth-child(3) { animation-delay: 0.22s; }
        .err-group:nth-child(4) { animation-delay: 0.32s; }
        .err-group:nth-child(5) { animation-delay: 0.40s; }
      `}</style>

      <div style={{
        minHeight: '100vh',
        background: 'var(--light)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
        position: 'relative',
        overflow: 'hidden',
      }}>

        {/* Decorative background blobs */}
        <div style={{
          position: 'absolute', top: '-80px', right: '-80px',
          width: 400, height: 400, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(200,64,10,0.07) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '-60px', left: '-60px',
          width: 320, height: 320, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(244,160,68,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: 520, width: '100%', textAlign: 'center', position: 'relative', zIndex: 1 }}>

          {/* Floating plate illustration */}
          <div className="err-plate err-group" style={{ marginBottom: 32 }}>
            <div style={{
              width: 140, height: 140,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--primary) 0%, #e05a20 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto',
              boxShadow: '0 24px 60px rgba(200,64,10,0.3), 0 0 0 16px rgba(200,64,10,0.07)',
            }}>
              {/* Fork + knife crossed */}
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="32" cy="32" r="30" fill="rgba(255,255,255,0.12)" />
                {/* Fork */}
                <path d="M22 10 L22 24 M19 10 L19 18 Q22 22 22 24 L22 54" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
                <path d="M25 10 L25 18 Q22 22 22 24" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
                {/* Knife */}
                <path d="M42 10 Q46 18 44 26 L44 54" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
                <path d="M42 10 L44 26" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
            </div>
          </div>

          {/* 404 number */}
          <div className="err-group" style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(6rem, 20vw, 9rem)',
            fontWeight: 900,
            lineHeight: 1,
            background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: 4,
            letterSpacing: '-0.04em',
          }}>
            404
          </div>

          {/* Divider with icon */}
          <div className="err-group" style={{
            display: 'flex', alignItems: 'center',
            gap: 12, margin: '16px auto 24px',
            maxWidth: 320,
          }}>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
            <i className="fa fa-exclamation-triangle" style={{
              color: 'var(--secondary)', fontSize: '1rem',
            }}></i>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          </div>

          {/* Heading */}
          <h1 className="err-group" style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(1.5rem, 5vw, 2rem)',
            fontWeight: 900,
            color: 'var(--dark)',
            marginBottom: 12,
            lineHeight: 1.2,
          }}>
            Page Not Found
          </h1>

          {/* Description */}
          <p className="err-group" style={{
            fontSize: '0.95rem',
            color: 'var(--gray)',
            lineHeight: 1.75,
            marginBottom: 36,
            maxWidth: 400,
            margin: '0 auto 36px',
          }}>
            Oops! It looks like this page wandered off the menu.
            Let us guide you back to something delicious.
          </p>

          {/* CTA buttons */}
          <div className="err-group" style={{
            display: 'flex', gap: 12,
            justifyContent: 'center', flexWrap: 'wrap',
          }}>
            <Link
              to="/"
              className="err-home"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '13px 32px', borderRadius: 50,
                background: 'var(--primary)',
                color: '#fff', fontWeight: 700,
                fontSize: '0.92rem', textDecoration: 'none',
                boxShadow: '0 6px 24px rgba(200,64,10,0.35)',
                transition: 'var(--transition)',
                letterSpacing: '0.02em',
              }}
            >
              <i className="fa fa-home" style={{ fontSize: '0.9rem' }}></i>
              Go Back Home
            </Link>
            <Link
              to="/product"
              className="err-back"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '13px 32px', borderRadius: 50,
                background: '#fff',
                color: 'var(--dark)', fontWeight: 700,
                fontSize: '0.92rem', textDecoration: 'none',
                border: '1.5px solid var(--border)',
                boxShadow: 'var(--shadow-sm)',
                transition: 'var(--transition)',
                letterSpacing: '0.02em',
              }}
            >
              <i className="fa fa-utensils" style={{ fontSize: '0.9rem' }}></i>
              Browse Menu
            </Link>
          </div>

          {/* Footer hint */}
          <div className="err-group" style={{
            marginTop: 40,
            fontSize: '0.78rem', color: 'var(--gray)',
            display: 'flex', alignItems: 'center',
            justifyContent: 'center', gap: 6,
          }}>
            <i className="fa fa-headset" style={{ color: 'var(--primary)', fontSize: '0.85rem' }}></i>
            Need help?&nbsp;
            <Link to="/contactus" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>
              Contact our support team
            </Link>
          </div>

        </div>
      </div>
    </>
  );
}