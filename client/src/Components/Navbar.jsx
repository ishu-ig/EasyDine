import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

export default function Navbar() {
  const [data, setData] = useState([]);
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        let response = await fetch(
          `${process.env.REACT_APP_BACKEND_SERVER}/api/user/${localStorage.getItem("userid")}`,
          {
            method: "GET",
            headers: {
              "content-type": "application/json",
              authorization: localStorage.getItem("token"),
            },
          },
        );
        response = await response.json();
        setData(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    })();
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  function logout() {
    localStorage.clear();
    navigate("/login");
    setDrawerOpen(false);
  }

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About Us" },
    { to: "/product", label: "Products" },
    { to: "/resturent", label: "Restaurants" },
    { to: "/feature", label: "Features" },
    { to: "/testimonial", label: "Testimonial" },
    { to: "/contactus", label: "Contact Us" },
  ];

  const accountLinks = [
    { to: "/profile", icon: "user", label: "Profile" },
    { to: "/order", icon: "shopping-bag", label: "Orders" },
    { to: "/booking", icon: "hotel", label: "Bookings" },
    { to: "/wishlist", icon: "heart", label: "Wishlist" },
    { to: "/testimonial", icon: "comment-alt", label: "Testimonial" },
  ];

  return (
    <>
      <style>{`
        /* ── Drawer ── */
        .sk-drawer-overlay {
          position: fixed;
          inset: 0;
          background: rgba(13, 27, 42, 0.55);
          backdrop-filter: blur(3px);
          z-index: 1055;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.3s ease;
        }
        .sk-drawer-overlay.open {
          opacity: 1;
          pointer-events: all;
        }
        .sk-drawer {
          position: fixed;
          top: 0; right: 0;
          width: 82%; max-width: 320px;
          height: 100%;
          background: #fff;
          z-index: 1060;
          display: flex;
          flex-direction: column;
          transform: translateX(100%);
          transition: transform 0.35s cubic-bezier(0.25, 0.8, 0.25, 1);
          box-shadow: -8px 0 40px rgba(13,27,42,0.18);
          overflow-y: auto;
        }
        .sk-drawer.open {
          transform: translateX(0);
        }

        /* ── Drawer Header ── */
        .sk-drawer-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px 20px;
          border-bottom: 1px solid rgba(200,64,10,0.1);
          background: #fdf6ee;
          flex-shrink: 0;
        }
        .sk-drawer-brand {
          font-family: 'Playfair Display', serif;
          font-size: 1.4rem;
          font-weight: 700;
          text-decoration: none;
          line-height: 1;
        }
        .sk-drawer-close {
          background: rgba(200,64,10,0.08);
          border: none;
          border-radius: 50%;
          width: 36px; height: 36px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          font-size: 18px;
          color: var(--dark);
          transition: background 0.2s;
          flex-shrink: 0;
        }
        .sk-drawer-close:hover { background: rgba(200,64,10,0.18); }

        /* ── Drawer User Card ── */
        .sk-drawer-user {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 20px;
          background: var(--primary, #c84010);
          color: #fff;
          flex-shrink: 0;
        }
        .sk-drawer-user img {
          width: 46px; height: 46px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid rgba(255,255,255,0.3);
          flex-shrink: 0;
        }
        .sk-drawer-user-name {
          font-family: 'Playfair Display', serif;
          font-weight: 700;
          font-size: 0.95rem;
          line-height: 1.2;
        }
        .sk-drawer-user-sub {
          font-size: 0.73rem;
          opacity: 0.75;
          margin-top: 2px;
        }

        /* ── Drawer Nav Links ── */
        .sk-drawer-section-title {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #aaa;
          padding: 16px 20px 6px;
        }
        .sk-drawer-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 20px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--dark, #1c1009);
          text-decoration: none;
          border-left: 3px solid transparent;
          transition: all 0.2s;
        }
        .sk-drawer-link:hover,
        .sk-drawer-link.active {
          color: var(--primary, #c84010);
          background: rgba(200,64,10,0.05);
          border-left-color: var(--primary, #c84010);
        }
        .sk-drawer-link i {
          width: 18px;
          text-align: center;
          color: var(--primary, #c84010);
          font-size: 0.85rem;
          flex-shrink: 0;
        }

        /* ── Drawer Footer ── */
        .sk-drawer-footer {
          margin-top: auto;
          padding: 16px 20px;
          border-top: 1px solid rgba(200,64,10,0.08);
          flex-shrink: 0;
        }
        .sk-drawer-logout {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          padding: 11px 16px;
          background: rgba(220,53,69,0.08);
          border: 1px solid rgba(220,53,69,0.2);
          border-radius: 10px;
          color: #dc3545;
          font-size: 0.88rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          text-align: left;
        }
        .sk-drawer-logout:hover {
          background: rgba(220,53,69,0.15);
        }
        .sk-drawer-login {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          padding: 11px 16px;
          background: var(--primary, #c84010);
          border: none;
          border-radius: 10px;
          color: #fff;
          font-size: 0.88rem;
          font-weight: 600;
          cursor: pointer;
          text-decoration: none;
          transition: all 0.2s;
        }
        .sk-drawer-login:hover { opacity: 0.9; color: #fff; }

        /* ── Divider ── */
        .sk-drawer-divider {
          height: 1px;
          background: rgba(200,64,10,0.08);
          margin: 4px 20px;
        }

        /* ── Hamburger button ── */
        .sk-toggler {
          background: none;
          border: 1.5px solid rgba(200,64,10,0.2);
          border-radius: 10px;
          width: 40px; height: 40px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 5px;
          cursor: pointer;
          padding: 0;
          transition: border-color 0.2s;
        }
        .sk-toggler:hover { border-color: var(--primary, #c84010); }
        .sk-toggler span {
          display: block;
          width: 20px; height: 2px;
          background: var(--dark, #1c1009);
          border-radius: 2px;
          transition: background 0.2s;
        }
          .sticky-top {
  position: sticky;
  top: 0;
  z-index: 9999;
}
        .sk-toggler:hover span { background: var(--primary, #c84010); }
      `}</style>

      {/* ── Top Bar ── */}
      <div
        className="top-bar row gx-0 align-items-center d-none d-lg-flex px-5"
        style={{ background: "var(--accent)" }}
      >
        <div className="col-lg-6 text-start">
          <Link
            to="mailto:info@example.com"
            className="text-white-50 text-decoration-none me-1"
            style={{ fontSize: "0.82rem" }}
          >
            <i
              className="fa fa-envelope me-2"
              style={{ color: "var(--secondary)" }}
            ></i>
            info@example.com
          </Link>
          <Link
            to="tel:+91-856935475"
            className="text-white-50 text-decoration-none ms-4"
            style={{ fontSize: "0.82rem" }}
          >
            <i
              className="fa fa-phone me-2"
              style={{ color: "var(--secondary)" }}
            ></i>
            +91-856935475
          </Link>
          <Link
            to="https://wa.me/856935475"
            className="text-white-50 text-decoration-none ms-4"
            style={{ fontSize: "0.82rem" }}
          >
            <i
              className="bi bi-whatsapp me-2"
              style={{ color: "var(--secondary)" }}
            ></i>
            +91-856935475
          </Link>
        </div>
        <div className="col-lg-6 text-end" style={{ fontSize: "0.82rem" }}>
          <span className="text-white-50 me-2">Follow us:</span>
          {["facebook-f", "twitter", "linkedin-in", "instagram"].map((icon) => (
            <Link
              key={icon}
              className="ms-3 text-white-50"
              style={{ transition: "color 0.2s" }}
              onMouseEnter={(e) => (e.target.style.color = "var(--secondary)")}
              onMouseLeave={(e) => (e.target.style.color = "")}
              to=""
            >
              <i className={`fab fa-${icon}`}></i>
            </Link>
          ))}
        </div>
      </div>

      {/* ── Main Navbar ── */}
      <div
  className="container-fluid sticky-top px-0"
  style={{
    background: "rgba(253,246,238,0.97)",
    backdropFilter: "blur(12px)",
    borderBottom: "1px solid rgba(200,64,10,0.1)",
    boxShadow: scrolled ? "0 4px 20px rgba(28,16,9,0.1)" : "none",
    transition: "box-shadow 0.35s ease",
  }}
>
        <nav className="navbar navbar-expand-lg py-2 px-4 px-lg-5">
          {/* Brand */}
          <Link to="/" className="navbar-brand me-lg-4">
            <h1
              className="fw-bold m-0"
              style={{
                fontFamily: "Playfair Display, serif",
                fontSize: "1.65rem",
                letterSpacing: "-0.01em",
              }}
            >
              <span style={{ color: "var(--primary)" }}>Eazy</span>
              <span style={{ color: "var(--accent)" }}>Dine</span>
            </h1>
          </Link>

          {/* Mobile right: cart + hamburger */}
          <div className="d-flex d-lg-none align-items-center gap-2 ms-auto">
            <Link
              to="/cart"
              style={{
                background: "var(--primary)",
                border: "none",
                borderRadius: "50%",
                width: 38,
                height: 38,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                textDecoration: "none",
              }}
            >
              <i
                className="fa fa-shopping-cart"
                style={{ fontSize: "0.82rem" }}
              ></i>
            </Link>
            <button
              className="sk-toggler"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open menu"
            >
              <span />
              <span />
              <span />
            </button>
          </div>

          {/* Desktop nav links */}
          <div className="collapse navbar-collapse" id="navbarCollapse">
            <div className="navbar-nav ms-auto p-4 p-lg-0 gap-lg-1">
              {navLinks.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  className="nav-item nav-link"
                  style={{
                    fontFamily: "DM Sans, sans-serif",
                    fontWeight: 500,
                    fontSize: "0.9rem",
                  }}
                >
                  {label}
                </NavLink>
              ))}
            </div>

            {/* Desktop icons */}
            <div className="d-none d-lg-flex align-items-center ms-3 gap-2">
              <button
                className="btn-sm-square"
                style={{
                  background: "white",
                  border: "1px solid rgba(200,64,10,0.12)",
                  borderRadius: "50%",
                  width: 36,
                  height: 36,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  transition: "all 0.25s",
                  color: "var(--dark)",
                }}
              >
                <i className="fa fa-search" style={{ fontSize: "0.8rem" }}></i>
              </button>

              <Link
                to="/cart"
                style={{
                  background: "var(--primary)",
                  border: "none",
                  borderRadius: "50%",
                  width: 36,
                  height: 36,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  textDecoration: "none",
                  transition: "all 0.25s",
                  flexShrink: 0,
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "var(--accent)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "var(--primary)")
                }
              >
                <i
                  className="fa fa-shopping-cart"
                  style={{ fontSize: "0.8rem" }}
                ></i>
              </Link>

              {/* Desktop Profile Dropdown */}
              <div className="nav-item dropdown">
                <span
                  className="nav-link"
                  data-bs-toggle="dropdown"
                  style={{
                    background: "white",
                    border: "1px solid rgba(200,64,10,0.12)",
                    borderRadius: "50%",
                    width: 36,
                    height: 36,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    transition: "all 0.25s",
                  }}
                >
                  <i
                    className="fa fa-user"
                    style={{ fontSize: "0.8rem", color: "var(--dark)" }}
                  ></i>
                </span>
                <div
                  className="dropdown-menu shadow-lg border-0 p-2"
                  style={{
                    borderRadius: "var(--radius)",
                    minWidth: 220,
                    left: "auto",
                    right: "0",
                  }}
                >
                  <Link to="/profile" className="text-decoration-none">
                    <div
                      className="d-flex align-items-center gap-3 px-3 py-2 mb-2"
                      style={{ borderBottom: "1px solid rgba(200,64,10,0.1)" }}
                    >
                      <img
                        src={
                          data?.pic && localStorage.getItem("login")
                            ? data.pic
                            : "/img/noimage.jpg"
                        }
                        alt="User"
                        className="rounded-circle"
                        style={{
                          width: 42,
                          height: 42,
                          objectFit: "cover",
                          border: "2px solid rgba(200,64,10,0.2)",
                        }}
                      />
                      <div>
                        <div
                          style={{
                            fontFamily: "Playfair Display, serif",
                            fontWeight: 700,
                            fontSize: "0.9rem",
                            color: "var(--dark)",
                          }}
                        >
                          {localStorage.getItem("name") || "Guest"}
                        </div>
                        <div
                          style={{ fontSize: "0.75rem", color: "var(--gray)" }}
                        >
                          View profile
                        </div>
                      </div>
                    </div>
                  </Link>

                  {!localStorage.getItem("login") && (
                    <NavLink to="/login" className="dropdown-item rounded-2">
                      <i
                        className="fa fa-sign-in-alt me-2"
                        style={{ color: "var(--primary)" }}
                      ></i>
                      Login
                    </NavLink>
                  )}
                  {accountLinks.map(({ to, icon, label }) => (
                    <NavLink
                      key={to}
                      to={to}
                      className="dropdown-item rounded-2"
                    >
                      <i
                        className={`fa fa-${icon} me-2`}
                        style={{ color: "var(--primary)" }}
                      ></i>
                      {label}
                    </NavLink>
                  ))}
                  {localStorage.getItem("login") && (
                    <>
                      <hr
                        className="my-2"
                        style={{ borderColor: "rgba(200,64,10,0.1)" }}
                      />
                      <button
                        onClick={logout}
                        className="dropdown-item rounded-2 text-danger w-100 text-start border-0 bg-transparent"
                      >
                        <i className="fa fa-sign-out-alt me-2"></i>Logout
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </nav>
      </div>

      {/* ── Mobile Drawer Overlay ── */}
      <div
        className={`sk-drawer-overlay ${drawerOpen ? "open" : ""}`}
        onClick={() => setDrawerOpen(false)}
      />

      {/* ── Mobile Drawer ── */}
      <div className={`sk-drawer ${drawerOpen ? "open" : ""}`}>
        {/* Drawer Header */}
        <div className="sk-drawer-head">
          <Link
            to="/"
            className="sk-drawer-brand"
            onClick={() => setDrawerOpen(false)}
          >
            <span style={{ color: "var(--primary)" }}>Eazy</span>
            <span style={{ color: "var(--accent)" }}>Dine</span>
          </Link>
          <button
            className="sk-drawer-close"
            onClick={() => setDrawerOpen(false)}
            aria-label="Close menu"
          >
            &times;
          </button>
        </div>

        {/* User card */}
        <div className="sk-drawer-user">
          <img
            src={
              data?.pic && localStorage.getItem("login")
                ? data.pic
                : "/img/noimage.jpg"
            }
            alt="User"
          />
          <div>
            <div className="sk-drawer-user-name">
              {localStorage.getItem("name") || "Guest User"}
            </div>
            <div className="sk-drawer-user-sub">
              {localStorage.getItem("login") ? "Logged in" : "Not logged in"}
            </div>
          </div>
        </div>

        {/* Nav links */}
        <div className="sk-drawer-section-title">Navigation</div>
        {navLinks.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            className="sk-drawer-link"
            onClick={() => setDrawerOpen(false)}
          >
            <i className="fa fa-chevron-right" style={{ fontSize: 9 }} />
            {label}
          </NavLink>
        ))}

        <div className="sk-drawer-divider" />

        {/* Account links */}
        <div className="sk-drawer-section-title">Account</div>
        {accountLinks.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className="sk-drawer-link"
            onClick={() => setDrawerOpen(false)}
          >
            <i className={`fa fa-${icon}`} />
            {label}
          </NavLink>
        ))}

        {/* Footer */}
        <div className="sk-drawer-footer">
          {localStorage.getItem("login") ? (
            <button className="sk-drawer-logout" onClick={logout}>
              <i className="fa fa-sign-out-alt" /> Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="sk-drawer-login"
              onClick={() => setDrawerOpen(false)}
            >
              <i className="fa fa-sign-in-alt" /> Login to your account
            </Link>
          )}
        </div>
      </div>
    </>
  );
}
