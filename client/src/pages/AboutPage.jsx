import React from 'react'
import HeroSection from '../Components/HeroSection'
import About from '../Components/About'
import { Link} from "react-router-dom"

export default function AboutPage() {
  return (
    <>
      <HeroSection title="About Us" />
      <About title="About Us" />

      {/* Why Choose Us Section */}
      <section className="container my-5 py-5">
        <div className="text-center mb-4">
          <h2 className="fw-bold text-primary">Why Choose Us?</h2>
          <p className="text-muted fs-5">Experience seamless food delivery & hassle-free restaurant seat booking with us.</p>
        </div>

        <div className="row align-items-center">
          {/* Left Side - Image Section */}
          <div className="col-lg-6 mb-4">
            <div className="position-relative">
              <img src="/img/fr1.jpg" className="img-fluid rounded shadow-lg" alt="Food Delivery" />
            </div>
          </div>

          {/* Right Side - Features */}
          <div className="col-lg-6">
            <div className="row g-3">
              <div className="col-md-6">
                <div className="p-3 border rounded shadow-sm d-flex align-items-center">
                  <i className="fa fa-utensils text-primary fs-3 me-3"></i>
                  <div>
                    <h5 className="fw-bold">Diverse Cuisine</h5>
                    <p className="m-0 text-muted">Choose from a wide range of top restaurants.</p>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="p-3 border rounded shadow-sm d-flex align-items-center">
                  <i className="fa fa-motorcycle text-success fs-3 me-3"></i>
                  <div>
                    <h5 className="fw-bold">Super Fast Delivery</h5>
                    <p className="m-0 text-muted">Enjoy hot & fresh meals delivered on time.</p>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="p-3 border rounded shadow-sm d-flex align-items-center">
                  <i className="fa fa-calendar-check text-warning fs-3 me-3"></i>
                  <div>
                    <h5 className="fw-bold">Easy Seat Booking</h5>
                    <p className="m-0 text-muted">Reserve your favorite spot with just a click.</p>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="p-3 border rounded shadow-sm d-flex align-items-center">
                  <i className="fa fa-percent text-danger fs-3 me-3"></i>
                  <div>
                    <h5 className="fw-bold">Exclusive Discounts</h5>
                    <p className="m-0 text-muted">Get the best deals and save more on orders.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="text-center mt-4">
              <Link to="/shop" className="btn btn-primary px-4 py-2 rounded-pill fw-bold shadow-sm">
                Explore Now <i className="fa fa-arrow-right ms-2"></i>
              </Link>
            </div>
          </div>
        </div>
      </section>
      {/* Statistics Section */}
      <section className="bg-light py-5">
        <div className="container text-center">
          <h2 className="fw-bold text-primary mb-4">Our Achievements</h2>
          <div className="row">
            <div className="col-md-4">
              <h3 className="fw-bold">🍕 50,000+</h3>
              <p>Orders Delivered</p>
            </div>
            <div className="col-md-4">
              <h3 className="fw-bold">😊 25,000+</h3>
              <p>Satisfied Customers</p>
            </div>
            <div className="col-md-4">
              <h3 className="fw-bold">🏨 10,000+</h3>
              <p>Restaurant Bookings</p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
