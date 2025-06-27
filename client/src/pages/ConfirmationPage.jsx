import React from "react";
import HeroSection from "../Components/HeroSection";
import { Link, useParams } from "react-router-dom";

export default function ConfirmationPage() {
  let { type } = useParams();

  return (
    <>
      <HeroSection title={type === "checkout" ? "Order Placed Successfully" : "Booking Confirmed"} />

      <div className="container d-flex flex-column align-items-center text-center py-5">
        <div className="card shadow-lg p-4 rounded-4 text-center" style={{ maxWidth: "600px", width: "100%" }}>
          <div className="mb-3">
            <i className="fas fa-check-circle text-success display-3"></i>
          </div>
          <h1 className="fw-bold text-primary">Thank You!</h1>
          <h3 className="text-secondary">
            {type === "checkout" ? "Your order has been placed successfully!" : "Your booking is confirmed!"}
          </h3>
          <p className="text-muted">
            {type === "checkout"
              ? "You can track your shipment in the order section."
              : "You can check your booking details in the bookings section."}
          </p>

          <div className="d-flex gap-3 justify-content-center mt-4 btn-group">
            <Link to={type === "checkout" ? "/order" : "/booking"} className="btn btn-primary px-4 fw-bold rounded-0">
              <i className="fas fa-box"></i> {type === "checkout" ? "Check Orders" : "Check Booking"}
            </Link>
            <Link to={type === "checkout" ? "/shop" : "/resturent"} className="btn btn-primary px-4 fw-bold rounded-0">
              <i className="fas fa-shopping-cart"></i> {type === "checkout" ? "Shop More" : "Book More"}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
