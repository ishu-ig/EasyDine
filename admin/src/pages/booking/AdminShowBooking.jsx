import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";

import {
    getBooking,
    updateBooking,
} from "../../Redux/ActionCreators/BookingActionCreators";

export default function AdminBookingShow() {
    let { _id } = useParams();
    let BookingStateData = useSelector((state) => state.BookingStateData);
    let dispatch = useDispatch();

    let [data, setData] = useState({});
    let [paymentStatus, setPaymentStatus] = useState("");
    let [flag, setFlag] = useState(false)

    // Fetch all bookings initially
    useEffect(() => {
            (async () => {
                dispatch(getBooking())
                if (BookingStateData.length) {
                    let item = BookingStateData.find(x => x._id === _id)
                    if (item) {
                        setData({ ...item })
                        setPaymentStatus(item.paymentStatus)
                        console.log(item)
                    }
                    else
                        alert("Invalid Checkout Id")
                }
            })()
        }, [BookingStateData.length])
    // Function to update booking record
    function updateRecord() {
        if (window.confirm("Are you sure you want to update the status?")) {
            data.paymentStatus = paymentStatus
            dispatch(updateBooking({ ...data }));
            setFlag(!flag)
        }

    }


    return (
        <>
            <div className="container-fluid">
                <div className="card shadow-lg border-primary">
                    <div className="card-header bg-primary text-light ">
                        <h5 className="mb-0 text-light text-center">
                            Booking Details
                            <Link to="/booking">
                                <i className="fa fa-arrow-left text-light float-end"></i>
                            </Link>
                        </h5>
                    </div>
                    <div className="card-body">
                        <div className="table-responsive">
                            <table className="table table-bordered">
                                <tbody>
                                    <tr><th>Booking ID</th><td>{data._id}</td></tr>
                                    <tr><th>Restaurant</th><td>{data.resturent?.name}</td></tr>
                                    <tr><th>Reservation Date</th><td>{new Date(data.date).toLocaleDateString()}</td></tr>
                                    <tr><th>Time Slot</th><td>{data.time}</td></tr>
                                    <tr>
                                        <th>Booking Status</th>
                                        <td className={`${data.bookingStatus === "true" ? "text-success" : "text-danger"} fw-bold`}>
                                            {data.bookingStatus ==="true" ? "Confirmed" : "Canceled"}
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>Payment Mode</th><td>{data.paymentMode}</td>
                                    </tr>
                                    <tr>
                                        <th>Payment Status</th>
                                        <td className={`${data.paymentStatus === "Pending" ? "text-danger" : "text-success"} fw-bold`}>
                                            {data.paymentStatus}
                                            {
                                                data.bookingStatus === "true" && data.paymentStatus != "Done" ?
                                                    <>
                                                        <select className="form-select mt-2" value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value)}>
                                                            <option>Pending</option>
                                                            <option >Done</option>
                                                        </select>
                                                    </> : null
                                            }
                                        </td>
                                    </tr>
                                    <tr><th>Seats Reserved</th><td>{data.seats}</td></tr>
                                    <tr><th>Subtotal</th><td>₹{data.resturent?.finalPrice}</td></tr>
                                    <tr><th>Final Price</th><td>₹{data.total}</td></tr>
                                    <tr><th>Created At</th><td>{new Date(data.createdAt).toLocaleString()}</td></tr>
                                    <tr>
                                        {
                                            data.bookingStatus === "true" && data.paymentStatus != "Done" ?
                                                <td colSpan={2}>

                                                    <button className="btn btn-primary w-100 text-light" onClick={updateRecord}>
                                                        Update Booking
                                                    </button>
                                                </td> : null
                                        }
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Customer Details */}
                <div className="card shadow-lg mt-4 border-secondary">
                    <div className="card-header bg-primary text-light">
                        <h5 className="text-center text-light">Customer Details</h5>
                    </div>
                    <div className="card-body">
                        <table className="table">
                            <tbody>
                                <tr><th>Name</th><td>{data.user?.username}</td></tr>
                                <tr><th>Contact No</th><td>{data.user?.phone}</td></tr>
                                <tr><th>Address</th><td>{data.user?.city} / {data.user?.state} / {data.user?.pin}</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </>
    );
}

