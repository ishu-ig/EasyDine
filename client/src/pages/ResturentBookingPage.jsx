import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getBooking } from '../Redux/ActionCreators/BookingActionCreators';
import HeroSection from '../Components/HeroSection';

export default function ResturentBookingPage() {
  const { _id } = useParams(); // Get booking ID from URL
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [data, setData] = useState(null); // State for single booking data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const BookingStateData = useSelector(state => state.BookingStateData);

  useEffect(() => {
    // Fetch the specific booking by _id
    const fetchBooking = async () => {
      try {
        setLoading(true);
        await dispatch(getBooking(_id)); // Pass _id to fetch a single booking
      } catch (err) {
        setError("Failed to fetch booking data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [dispatch, _id]);

  useEffect(() => {
    // Find the booking with the matching _id
    if (BookingStateData.length > 0) {
      const booking = BookingStateData.find(x => x._id === _id);
      if (booking) {
        setData(booking); // Set the booking data
      } else {
        navigate(0)
        setError("Booking not found.");
        
      }
    }
  }, [BookingStateData, _id]);

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>; // Show loading indicator
  }

  if (error) {
    return <div className="text-center mt-5 text-danger">{error}</div>; // Show error message
  }

  if (!data) {
    return <div className="text-center mt-5">No booking found.</div>; // Handle case where booking is not found
  }

  return (
    <>
      <HeroSection title="Booking Detail" />
      <div className="container mt-4">
        <h3 className="text-center text-light py-2 bg-primary">
          Thank You for Booking with Us!
        </h3>

        <div className="col-md-8 col-sm-10 col-11 m-auto mt-4">
          <div className="card shadow-lg p-3 mb-5 bg-white rounded">
            <div className="card-header text-center text-white bg-success">
              <strong>Booking Details</strong>
            </div>
            <div className="card-body">
              <table className="table table-hover table-striped table-bordered">
                <tbody>
                  <tr>
                    <th>Restaurant Name</th>
                    <td>{data.resturent?.name || "N/A"}</td> {/* Access nested property */}
                  </tr>
                  <tr>
                    <th>Contact No</th>
                    <td>{data.resturent?.phone || "N/A"}</td> {/* Access nested property */}
                  </tr>
                  <tr>
                    <th>Address</th>
                    <td>{data.resturent?.address || "N/A"}</td> {/* Access nested property */}
                  </tr>
                  <tr>
                    <th>Reservation Date</th>
                    <td>{data.date}</td> {/* Use date from booking */}
                  </tr>
                  <tr>
                    <th>Timing</th>
                    <td>{data.time}</td> {/* Use time from booking */}
                  </tr>
                  <tr>
                    <th>Reservation Price</th>
                    <td>₹ {data.resturent?.finalPrice}</td> {/* Use finalReservationPrice */}
                  </tr>
                  <tr>
                    <th>Seats</th>
                    <td>{data.seats}</td>
                  </tr>
                  <tr>
                    <th>Total Cost</th>
                    <td><strong>₹ {data.total}</strong></td>
                  </tr>
                  <tr>
                    <th>Booking Status</th>
                    <td className={`${data.bookingStatus ? "text-success" : "text-warning"} fw-bold`}>
                      {data.bookingStatus ? "Confirmed" : "Canceled"}
                    </td>
                  </tr>
                  <tr>
                    <th>Payment Status</th>
                    <td className={`fw-bold ${data.paymentStatus === "Paid" ? "text-success" : "text-danger"}`}>
                      {data.paymentStatus}
                    </td>
                  </tr>
                  <tr>
                    <th>Payment Mode</th>
                    <td>{data.paymentMode}</td>
                  </tr>
                  <tr>
                    <td colSpan={2} className="text-center">
                      <Link
                        onClick={() => navigate("/", { replace: true })}
                        className="btn btn-lg btn-primary w-100 mt-2"
                        to="/"
                      >
                        <i className="fas fa-arrow-left"></i> Continue to Home
                      </Link>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}