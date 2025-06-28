import React, { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const [data, setData] = useState([]);
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

  function logout() {
    localStorage.clear();
    navigate("/login");
  }

  return (
    <>
      {/* Navbar Start */}
      <div className="container-fluid sticky-top px-0 wow fadeIn bg-light" data-wow-delay="0.1s">
        {/* Top Bar */}
        <div className="top-bar row gx-0 align-items-center d-none d-lg-flex">
          <div className="col-lg-6 px-5 text-start">
            <Link to="mailto:ishaangupta124@gmail.com" className='text-muted'>
              <i className="fa fa-map-marker-alt me-2"></i>info@example.com
            </Link>
            <Link to="tel:+91-856935475" className='ms-4 text-muted'>
              <i className="fa fa-phone me-2"></i>+91-856935475
            </Link>
            <Link to="https://wa.me/856935475" className='ms-4 text-muted'>
              <i className="bi bi-whatsapp me-2 fs-5"></i>+91-856935475
            </Link>
          </div>
          <div className="col-lg-6 px-5 text-end">
            <small>Follow us:</small>
            <Link className="text-body ms-3" to=""><i className="fab fa-facebook-f"></i></Link>
            <Link className="text-body ms-3" to=""><i className="fab fa-twitter"></i></Link>
            <Link className="text-body ms-3" to=""><i className="fab fa-linkedin-in"></i></Link>
            <Link className="text-body ms-3" to=""><i className="fab fa-instagram"></i></Link>
          </div>
        </div>

        {/* Main Navbar */}
        <nav className="navbar navbar-expand-lg navbar-light py-lg-0 px-lg-5 wow fadeIn" data-wow-delay="0.1s">
          <Link to="/" className="navbar-brand ms-4 ms-lg-0">
            <h1 className="fw-bold text-primary m-0">Eazy<span className="text-secondary">Dine</span></h1>
          </Link>
          <button type="button" className="navbar-toggler me-4" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarCollapse">
            <div className="navbar-nav ms-auto p-4 p-lg-0">
              <NavLink to="/" className="nav-item nav-link">Home</NavLink>
              <NavLink to="/about" className="nav-item nav-link">About Us</NavLink>
              <NavLink to="/product" className="nav-item nav-link">Products</NavLink>
              <NavLink to="/resturent" className="nav-item nav-link">Restaurants</NavLink>
              <NavLink to="/feature" className="nav-item nav-link">Features</NavLink>
              <NavLink to="/testimonial" className="nav-item nav-link">Testimonial</NavLink>
              <NavLink to="/contactus" className="nav-item nav-link">Contact Us</NavLink>
              <div className="nav-item dropdown">
                <span className="nav-link dropdown-toggle" data-bs-toggle="dropdown">Pages</span>
                <div className="dropdown-menu m-0">
                  <NavLink to="/blog" className="dropdown-item">Blog Grid</NavLink>
                  <NavLink to="/feature" className="dropdown-item">Our Features</NavLink>
                  <NavLink to="/testimonial" className="dropdown-item">Testimonial</NavLink>
                  <NavLink to="/404" className="dropdown-item">404 Page</NavLink>
                </div>
              </div>
            </div>

            {/* Desktop Profile + Cart */}
            <div className="d-none d-lg-flex ms-2">
              <Link className="btn-sm-square bg-white rounded-circle ms-3" to="">
                <small className="fa fa-search text-body"></small>
              </Link>
              <div className="nav-item dropdown">
                <span className="nav-link btn-sm-square bg-white rounded-circle ms-3 shadow-sm" data-bs-toggle="dropdown">
                  <i className="fa fa-user text-body"></i>
                </span>
                <div className="dropdown-menu dropdown-menu-end p-3 rounded shadow-lg border-0 animate-dropdown">
                  <Link to="/profile">
                    <div className="dropdown-header text-center">
                      {data?.pic && localStorage.getItem("login") ? (
                        <img
                          src={`${process.env.REACT_APP_BACKEND_SERVER}/${data.pic}`}
                          alt="User"
                          className="rounded-circle mb-2 border shadow"
                          height={50}
                          width={50}
                        />
                      ) : (
                        <img
                          src="/img/noimage.jpg"
                          alt="User"
                          className="rounded-circle mb-2 border shadow"
                          height={50}
                          width={50}
                        />
                      )}
                      <h6 className="fw-bold">{localStorage.getItem("name") || "User"}</h6>
                    </div>
                  </Link>
                  {!localStorage.getItem("login") && (
                    <NavLink to="/login" className="dropdown-item">
                      <i className="fa fa-newspaper me-2"></i> Login
                    </NavLink>
                  )}
                  <NavLink to="/order" className="dropdown-item">
                    <i className="fa fa-shopping-bag me-2"></i> Orders
                  </NavLink>
                  <NavLink to="/booking" className="dropdown-item">
                    <i className="fa fa-hotel me-2"></i> Bookings
                  </NavLink>
                  <NavLink to="/wishlist" className="dropdown-item">
                    <i className="fa fa-heart me-2"></i> Wishlist
                  </NavLink>
                  <NavLink to="/testimonial" className="dropdown-item">
                    <i className="fa fa-comment-alt me-2"></i> Testimonial
                  </NavLink>
                  {localStorage.getItem("login") && (
                    <button onClick={logout} className="dropdown-item text-danger">
                      <i className="fa fa-exclamation-circle me-2"></i> Logout
                    </button>
                  )}
                </div>
              </div>
              <Link to="/cart" className="btn-sm-square bg-white rounded-circle ms-3">
                <small className="fa fa-shopping-cart text-body"></small>
              </Link>
            </div>

            {/* Mobile Profile + Cart */}
            <div className="d-lg-none d-flex flex-column mt-3 border-top pt-3">
              <div className="nav-item dropdown">
                <span className="nav-link dropdown-toggle" data-bs-toggle="dropdown">
                  <i className="fa fa-user me-2"></i> Account
                </span>
                <div className="dropdown-menu">
                  <NavLink to="/profile" className="dropdown-item">Profile</NavLink>
                  <NavLink to="/order" className="dropdown-item">Orders</NavLink>
                  <NavLink to="/booking" className="dropdown-item">Bookings</NavLink>
                  <NavLink to="/wishlist" className="dropdown-item">Wishlist</NavLink>
                  {!localStorage.getItem("login") ? (
                    <NavLink to="/login" className="dropdown-item">Login</NavLink>
                  ) : (
                    <button onClick={logout} className="dropdown-item text-danger">Logout</button>
                  )}
                </div>
              </div>
              <NavLink to="/cart" className="nav-link mt-2">
                <i className="fa fa-shopping-cart me-2"></i> Cart
              </NavLink>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
}
