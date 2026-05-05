import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

export default function Footer() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);

  async function postData(e) {
    e.preventDefault();
    if (!email.trim()) {
      setMessage({ text: "Please enter a valid email address.", type: "error" });
      return;
    }
    setLoading(true);
    try {
      let response = await fetch(`${process.env.REACT_APP_BACKEND_SERVER}/api/newsletter`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email })
      });
      response = await response.json();
      if (response.result === "Done") {
        setMessage({ text: "🎉 You're subscribed! Welcome aboard.", type: "success" });
        setEmail("");
      } else {
        setMessage({ text: response.reason?.email || "Something went wrong.", type: "error" });
      }
    } catch {
      setMessage({ text: "Could not connect. Please try again.", type: "error" });
    } finally {
      setLoading(false);
    }
  }

  const quickLinks = [
    { to: '/about',     label: 'About Us' },
    { to: '/contactus', label: 'Contact Us' },
    { to: '/product',   label: 'Our Products' },
    { to: '/feature',   label: 'Features' },
    { to: '/resturent', label: 'Restaurants' },
  ];

  const socials = [
    { icon: 'twitter',     href: '#' },
    { icon: 'facebook-f',  href: '#' },
    { icon: 'instagram',   href: '#' },
    { icon: 'linkedin-in', href: '#' },
  ];

  return (
    <footer style={{ background: 'linear-gradient(180deg, #16162A 0%, #1A1A2E 100%)', color: 'rgba(255,255,255,0.6)', fontFamily: 'DM Sans, sans-serif', marginTop: '5rem' }}>

      {/* Newsletter strip */}
      <div style={{ background: 'linear-gradient(135deg, var(--primary) 0%, #E86834 100%)', padding: '40px 0' }}>
        <div className="container">
          <div className="row align-items-center gy-3">
            <div className="col-lg-6">
              <p style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.75)', marginBottom: 6 }}>Stay Updated</p>
              <h3 style={{ fontFamily: 'Playfair Display, serif', fontWeight: 900, color: 'white', fontSize: 'clamp(1.3rem,2.5vw,1.7rem)', margin: 0 }}>
                Subscribe to our Newsletter
              </h3>
            </div>
            <div className="col-lg-6">
              {message.text ? (
                <div style={{ padding: '12px 20px', borderRadius: 50, background: message.type === 'success' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)', color: 'white', fontSize: '0.88rem', fontWeight: 600, textAlign: 'center' }}>
                  {message.text}
                </div>
              ) : (
                <form onSubmit={postData} style={{ display: 'flex', gap: 0, background: 'white', borderRadius: 50, overflow: 'hidden', boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }}>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Your email address"
                    style={{ flex: 1, border: 'none', outline: 'none', padding: '13px 22px', fontSize: '0.88rem', fontFamily: 'DM Sans, sans-serif', color: 'var(--dark)', background: 'transparent' }}
                  />
                  <button type="submit" disabled={loading}
                    style={{ padding: '13px 26px', background: 'var(--accent)', color: 'white', border: 'none', fontWeight: 700, fontSize: '0.85rem', cursor: loading ? 'not-allowed' : 'pointer', borderRadius: '0 50px 50px 0', whiteSpace: 'nowrap', transition: 'background 0.2s' }}
                    onMouseEnter={e => !loading && (e.currentTarget.style.background = '#0f0f22')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'var(--accent)')}
                  >
                    {loading ? <i className="fa fa-spinner fa-spin" /> : 'Subscribe'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main footer body */}
      <div style={{ padding: '64px 0 40px' }}>
        <div className="container">
          <div className="row gy-5">

            {/* Brand column */}
            <div className="col-lg-4 col-md-6">
              <h2 style={{ fontFamily: 'Playfair Display, serif', fontWeight: 900, fontSize: '1.8rem', marginBottom: 16 }}>
                <span style={{ color: 'var(--primary)' }}>Eazy</span>
                <span style={{ color: 'var(--secondary)' }}>Dine</span>
              </h2>
              <p style={{ fontSize: '0.88rem', lineHeight: 1.85, marginBottom: 24, maxWidth: 320 }}>
                We proudly offer a wide variety of delicious and flavorful dishes, carefully crafted to satisfy every palate and delight every taste.
              </p>
              <div style={{ display: 'flex', gap: 10 }}>
                {socials.map(({ icon, href }) => (
                  <a key={icon} href={href}
                    style={{ width: 38, height: 38, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.6)', textDecoration: 'none', transition: 'all 0.25s', fontSize: '0.82rem' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--primary)'; e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.color = 'white'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; e.currentTarget.style.transform = 'none'; }}
                  >
                    <i className={`fab fa-${icon}`}></i>
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="col-lg-2 col-md-6 col-6">
              <h6 style={{ fontFamily: 'Playfair Display, serif', fontWeight: 700, color: 'white', fontSize: '1rem', marginBottom: 20, paddingBottom: 12, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>Quick Links</h6>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {quickLinks.map(({ to, label }) => (
                  <li key={to} style={{ marginBottom: 10 }}>
                    <NavLink to={to} style={{ color: 'rgba(255,255,255,0.55)', textDecoration: 'none', fontSize: '0.87rem', display: 'flex', alignItems: 'center', gap: 8, transition: 'all 0.2s' }}
                      onMouseEnter={e => { e.currentTarget.style.color = 'var(--secondary)'; e.currentTarget.style.paddingLeft = '4px'; }}
                      onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.55)'; e.currentTarget.style.paddingLeft = '0'; }}
                    >
                      <i className="fa fa-angle-right" style={{ fontSize: '0.75rem', color: 'var(--secondary)' }} />
                      {label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div className="col-lg-3 col-md-6 col-6">
              <h6 style={{ fontFamily: 'Playfair Display, serif', fontWeight: 700, color: 'white', fontSize: '1rem', marginBottom: 20, paddingBottom: 12, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>Contact Us</h6>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {[
                  { icon: 'map-marker-alt', text: '123 Street, New York, USA', href: '#' },
                  { icon: 'phone-alt',      text: '+91-856935475',             href: 'tel:+91-856935475' },
                  { icon: 'envelope',       text: 'info@example.com',          href: 'mailto:info@example.com' },
                  { icon: 'clock',          text: 'Mon–Sat: 9am – 9pm',        href: '#' },
                ].map(({ icon, text, href }) => (
                  <li key={icon} style={{ marginBottom: 14 }}>
                    <a href={href} style={{ color: 'rgba(255,255,255,0.55)', textDecoration: 'none', fontSize: '0.87rem', display: 'flex', alignItems: 'flex-start', gap: 10, transition: 'color 0.2s' }}
                      onMouseEnter={e => e.currentTarget.style.color = 'white'}
                      onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.55)'}
                    >
                      <i className={`fa fa-${icon}`} style={{ color: 'var(--secondary)', marginTop: 2, width: 16, flexShrink: 0 }} />
                      {text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Hours / App */}
            <div className="col-lg-3 col-md-6">
              <h6 style={{ fontFamily: 'Playfair Display, serif', fontWeight: 700, color: 'white', fontSize: '1rem', marginBottom: 20, paddingBottom: 12, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>We Deliver</h6>
              <p style={{ fontSize: '0.85rem', lineHeight: 1.8, marginBottom: 20 }}>
                Fast, fresh, and flavourful — right to your doorstep. Order now and experience the difference.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { icon: 'fa-apple', label: 'App Store',    sub: 'Download on the' },
                  { icon: 'fa-google-play', label: 'Google Play', sub: 'Get it on' },
                ].map(({ icon, label, sub }) => (
                  <a key={label} href="#"
                    style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 12, textDecoration: 'none', transition: 'all 0.25s', color: 'white' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.background = 'rgba(200,64,10,0.12)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.background = 'transparent'; }}
                  >
                    <i className={`fab ${icon}`} style={{ fontSize: '1.4rem', color: 'white' }} />
                    <div>
                      <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1 }}>{sub}</div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 700, lineHeight: 1.3 }}>{label}</div>
                    </div>
                  </a>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', padding: '20px 0' }}>
        <div className="container">
          <div className="row align-items-center gy-2">
            <div className="col-md-6 text-center text-md-start" style={{ fontSize: '0.82rem' }}>
              © {new Date().getFullYear()} <span style={{ color: 'var(--secondary)', fontWeight: 600 }}>EazyDine</span>. All rights reserved.
            </div>
            <div className="col-md-6 text-center text-md-end" style={{ fontSize: '0.82rem' }}>
              Designed with <i className="fa fa-heart" style={{ color: 'var(--primary)', margin: '0 3px' }} /> by{' '}
              <a href="https://ishu-ig.github.io/My-Portfolio-Website/" target="_blank" rel="noreferrer"
                style={{ color: 'var(--secondary)', textDecoration: 'none', fontWeight: 600 }}
                onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
                onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
              >Ishaan</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}