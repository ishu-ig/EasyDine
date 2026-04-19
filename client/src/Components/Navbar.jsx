import React, { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const [data, setData] = useState([]);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        let response = await fetch(`${process.env.REACT_APP_BACKEND_SERVER}/api/user/${localStorage.getItem("userid")}`, {
          method: "GET",
          headers: {
            'content-type': 'application/json',
            "authorization": localStorage.getItem("token")
          }
        });
        response = await response.json();
        setData(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    })();
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  function logout() {
    localStorage.clear();
    navigate("/login");
  }

  return (
    <>
      {/* Top Bar */}
      <div className="top-bar row gx-0 align-items-center d-none d-lg-flex px-5" style={{ background: 'var(--accent)' }}>
        <div className="col-lg-6 text-start">
          <Link to="mailto:info@example.com" className="text-white-50 text-decoration-none me-1" style={{ fontSize: '0.82rem' }}>
            <i className="fa fa-envelope me-2" style={{ color: 'var(--secondary)' }}></i>info@example.com
          </Link>
          <Link to="tel:+91-856935475" className="text-white-50 text-decoration-none ms-4" style={{ fontSize: '0.82rem' }}>
            <i className="fa fa-phone me-2" style={{ color: 'var(--secondary)' }}></i>+91-856935475
          </Link>
          <Link to="https://wa.me/856935475" className="text-white-50 text-decoration-none ms-4" style={{ fontSize: '0.82rem' }}>
            <i className="bi bi-whatsapp me-2" style={{ color: 'var(--secondary)' }}></i>+91-856935475
          </Link>
        </div>
        <div className="col-lg-6 text-end" style={{ fontSize: '0.82rem' }}>
          <span className="text-white-50 me-2">Follow us:</span>
          {['facebook-f', 'twitter', 'linkedin-in', 'instagram'].map((icon) => (
            <Link
              key={icon}
              className="ms-3 text-white-50"
              style={{ transition: 'color 0.2s' }}
              onMouseEnter={e => e.target.style.color = 'var(--secondary)'}
              onMouseLeave={e => e.target.style.color = ''}
              to=""
            >
              <i className={`fab fa-${icon}`}></i>
            </Link>
          ))}
        </div>
      </div>

      {/* Main Navbar */}
      <div
        className={`container-fluid sticky-top px-0`}
        style={{
          background: 'rgba(253, 246, 238, 0.97)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(200,64,10,0.1)',
          boxShadow: scrolled ? '0 4px 20px rgba(28,16,9,0.1)' : 'none',
          transition: 'box-shadow 0.35s ease',
          zIndex: 1030,
        }}
      >
        <nav className="navbar navbar-expand-lg py-2 px-4 px-lg-5">
          {/* Brand */}
          <Link to="/" className="navbar-brand me-lg-4">
            <h1 className="fw-bold m-0" style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.65rem', letterSpacing: '-0.01em' }}>
              <span style={{ color: 'var(--primary)' }}>Eazy</span>
              <span style={{ color: 'var(--accent)' }}>Dine</span>
            </h1>
          </Link>

          {/* ✅ FIXED: Removed border-0 and inline color — CSS now handles toggler icon color */}
          <button
            type="button"
            className="navbar-toggler me-3"
            data-bs-toggle="collapse"
            data-bs-target="#navbarCollapse"
            aria-controls="navbarCollapse"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarCollapse">
            <div className="navbar-nav ms-auto p-4 p-lg-0 gap-lg-1">
              {[
                { to: '/', label: 'Home' },
                { to: '/about', label: 'About Us' },
                { to: '/product', label: 'Products' },
                { to: '/resturent', label: 'Restaurants' },
                { to: '/feature', label: 'Features' },
                { to: '/testimonial', label: 'Testimonial' },
                { to: '/contactus', label: 'Contact Us' },
              ].map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  className="nav-item nav-link"
                  style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 500, fontSize: '0.9rem' }}
                >
                  {label}
                </NavLink>
              ))}
            </div>

            {/* Desktop Icons */}
            <div className="d-none d-lg-flex align-items-center ms-3 gap-2">
              <button
                className="btn-sm-square"
                style={{
                  background: 'white',
                  border: '1px solid rgba(200,64,10,0.12)',
                  borderRadius: '50%',
                  width: 36, height: 36,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', transition: 'all 0.25s',
                  color: 'var(--dark)',
                }}
              >
                <i className="fa fa-search" style={{ fontSize: '0.8rem' }}></i>
              </button>

              {/* Profile Dropdown */}
              <div className="nav-item dropdown">
                <span
                  className="nav-link"
                  data-bs-toggle="dropdown"
                  style={{
                    background: 'white',
                    border: '1px solid rgba(200,64,10,0.12)',
                    borderRadius: '50%',
                    width: 36, height: 36,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', transition: 'all 0.25s',
                  }}
                >
                  <i className="fa fa-user" style={{ fontSize: '0.8rem', color: 'var(--dark)' }}></i>
                </span>
                <div className="dropdown-menu dropdown-menu-end shadow-lg border-0 p-2" style={{ borderRadius: 'var(--radius)', minWidth: 220 }}>
                  <Link to="/profile" className="text-decoration-none">
                    <div className="d-flex align-items-center gap-3 px-3 py-2 mb-2" style={{ borderBottom: '1px solid rgba(200,64,10,0.1)' }}>
                      <img
                        src={data?.pic && localStorage.getItem("login")
                          ? `${process.env.REACT_APP_BACKEND_SERVER}/${data.pic}`
                          : "/img/noimage.jpg"}
                        alt="User"
                        className="rounded-circle"
                        style={{ width: 42, height: 42, objectFit: 'cover', border: '2px solid rgba(200,64,10,0.2)' }}
                      />
                      <div>
                        <div style={{ fontFamily: 'Playfair Display, serif', fontWeight: 700, fontSize: '0.9rem', color: 'var(--dark)' }}>
                          {localStorage.getItem("name") || "Guest"}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--gray)' }}>View profile</div>
                      </div>
                    </div>
                  </Link>

                  {!localStorage.getItem("login") && (
                    <NavLink to="/login" className="dropdown-item rounded-2">
                      <i className="fa fa-sign-in-alt me-2" style={{ color: 'var(--primary)' }}></i>Login
                    </NavLink>
                  )}
                  {[
                    { to: '/order', icon: 'shopping-bag', label: 'Orders' },
                    { to: '/booking', icon: 'hotel', label: 'Bookings' },
                    { to: '/wishlist', icon: 'heart', label: 'Wishlist' },
                    { to: '/testimonial', icon: 'comment-alt', label: 'Testimonial' },
                  ].map(({ to, icon, label }) => (
                    <NavLink key={to} to={to} className="dropdown-item rounded-2">
                      <i className={`fa fa-${icon} me-2`} style={{ color: 'var(--primary)' }}></i>{label}
                    </NavLink>
                  ))}

                  {localStorage.getItem("login") && (
                    <>
                      <hr className="my-2" style={{ borderColor: 'rgba(200,64,10,0.1)' }} />
                      <button onClick={logout} className="dropdown-item rounded-2 text-danger w-100 text-start border-0 bg-transparent">
                        <i className="fa fa-sign-out-alt me-2"></i>Logout
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Cart */}
              <Link
                to="/cart"
                style={{
                  background: 'var(--primary)',
                  border: 'none',
                  borderRadius: '50%',
                  width: 36, height: 36,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white',
                  textDecoration: 'none',
                  transition: 'all 0.25s',
                  flexShrink: 0,
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--accent)'}
                onMouseLeave={e => e.currentTarget.style.background = 'var(--primary)'}
              >
                <i className="fa fa-shopping-cart" style={{ fontSize: '0.8rem' }}></i>
              </Link>
            </div>

            {/* Mobile Account */}
            <div className="d-lg-none d-flex flex-column mt-3 border-top pt-3" style={{ borderColor: 'rgba(200,64,10,0.1)' }}>
              <div className="nav-item dropdown">
                <span className="nav-link dropdown-toggle" data-bs-toggle="dropdown" style={{ cursor: 'pointer' }}>
                  <i className="fa fa-user me-2" style={{ color: 'var(--primary)' }}></i>Account
                </span>
                <div className="dropdown-menu">
                  <NavLink to="/profile" className="dropdown-item">Profile</NavLink>
                  <NavLink to="/order" className="dropdown-item">Orders</NavLink>
                  <NavLink to="/booking" className="dropdown-item">Bookings</NavLink>
                  <NavLink to="/wishlist" className="dropdown-item">Wishlist</NavLink>
                  {!localStorage.getItem("login")
                    ? <NavLink to="/login" className="dropdown-item">Login</NavLink>
                    : <button onClick={logout} className="dropdown-item text-danger w-100 text-start border-0 bg-transparent">Logout</button>
                  }
                </div>
              </div>
              <NavLink to="/cart" className="nav-link">
                <i className="fa fa-shopping-cart me-2" style={{ color: 'var(--primary)' }}></i>Cart
              </NavLink>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
}