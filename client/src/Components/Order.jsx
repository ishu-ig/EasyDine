import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { updateBooking } from '../Redux/ActionCreators/BookingActionCreators';
import { getResturent, updateResturent } from '../Redux/ActionCreators/ResturentActionCreators';
import { updateCheckout } from '../Redux/ActionCreators/CheckoutActionCreators';

export default function Order({ title, data = [] }) {
    const dispatch = useDispatch();
    let navigate = useNavigate();
    const [cancelStatus, setCancelStatus] = useState({});
    let ResturentStateData = useSelector(state => state.ResturentStateData)

    useEffect(() => {
        // Check and update cancel status based on 5-hour limit
        const updatedStatus = {};
        data.forEach(item => {
            const bookingTime = new Date(item.createdAt).getTime();
            const currentTime = new Date().getTime();
            const timeDifference = (currentTime - bookingTime) / (1000 * 60 * 60); // Convert to hours
            updatedStatus[item._id] = timeDifference <= 5; // True if cancelation is available
        });
        setCancelStatus(updatedStatus);
    }, [data]);

    useEffect(() => {
        (() => {
            dispatch(getResturent())
        })()
    })

    const updateStatus = (_id) => {
        if (!cancelStatus[_id]) {
            alert("Cancellation is only allowed within 5 hours of booking.");
            return;
        }

        if (window.confirm("Are you sure you want to cancel your booking?")) {
            const item = data.find(x => x._id === _id);

            if (item) {
                const updatedItem = { ...item, bookingStatus: false }; // Mark as canceled
                dispatch(updateBooking(updatedItem));

                // Update cancel status for this item
                setCancelStatus(prevStatus => ({ ...prevStatus, [_id]: false }));

                // Find the corresponding restaurant and update seat availability
                let resturent = ResturentStateData.find(x => x._id === item.resturent._id);
                console.log(resturent)
                if (resturent) {
                    dispatch(updateResturent({
                        ...resturent,
                        seatAvailable: resturent.seatAvailable + item.seats
                    }));
                }
            }
            navigate(0)
        }
    };

    function updateOrder(_id) {
        if (window.confirm("Are you sure you want to cancel your Order?")) {
            const item = data.find(x => x._id === _id);

            if (item) {
                const updatedItem = { ...item, orderStatus: "Cancelled" }; // Mark as canceled
                dispatch(updateCheckout(updatedItem));
            }
        }
    }

    return (
        <div className="container my-4">
            <h5 className='bg-primary text-light text-center py-2 rounded'>{title === "Order" ? "Your Order" : "Your Bookings"}</h5>
            <div className="container">
                {Array.isArray(data) && data.length ? (
                    data.map((item) => (
                        <div key={item?._id} className="mb-4 p-3 card shadow-sm rounded" style={{ backgroundColor: '#F8F8F8' }}>
                            {/* Order Header */}
                            <div className="d-flex justify-content-between align-items-center bg-light p-3 rounded">
                                <div>
                                    <h6 className="mb-0">
                                        <strong>{title === "Order" ? "Order ID:" : "Booking ID:"}</strong> {item?._id}
                                    </h6>
                                    <p className="text-muted mb-0 mt-2"><strong>Created At:</strong> {new Date(item?.createdAt).toLocaleString()}</p>
                                </div>
                                <span className={`badge ${item?.orderStatus !== "Cancelled" || item.bookingStatus === "true" ? "bg-success" : "bg-danger"}`}>
                                    {title === "Order" ? item?.orderStatus : item?.bookingStatus === "true" ? "Confirmed" : "Cancelled"}
                                </span>
                            </div>

                            {/* Order Details Table */}
                            <div className="table-responsive">
                                <table className="table table-bordered mt-2 text-center">
                                    <thead className="table-primary">
                                        <tr>
                                            <th>{title === "Order" ? "Product" : "Restaurant"}</th>
                                            {title === "Booking" && <th>Date</th>}
                                            {title === "Booking" && <th>Time Slot</th>}
                                            <th>Price (₹)</th>
                                            <th>{title === "Order" ? "Quantity" : "Seats"}</th>
                                            <th>Total (₹)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {title === "Order" ? (
                                            item?.products?.map((prod) => (
                                                <tr key={prod._id}>
                                                    <td>{prod.product.name}</td>
                                                    <td>{prod.product.finalPrice}</td>
                                                    <td>{prod.qty}</td>
                                                    <td>{prod.total}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td>{item?.resturent?.name}</td>
                                                <td>{item?.date}</td>
                                                <td>{item?.time}</td>
                                                <td>{item?.resturent?.finalPrice}</td>
                                                <td>{item?.seats}</td>
                                                <td>{item?.total}</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Payment & Action Section */}
                            <div className="d-flex justify-content-between align-items-center p-3 border-top flex-wrap">
                                <div>
                                    <p className="mb-1"><strong>Payment Mode:</strong> {item?.paymentMode || "N/A"}</p>
                                    <p>
                                        <strong>Payment Status:</strong>
                                        <span className={`fw-bold ms-1 ${item?.paymentStatus === "Pending" ? "text-danger" : "text-success"}`}>
                                            {item?.paymentStatus || "N/A"}
                                        </span>
                                    </p>
                                </div>
                                <div className="text-end">
                                    {title === "Order" ? (
                                        <>
                                            <h5 className="fw-bold">Total Amount: ₹{item?.total}</h5>

                                            {/* Show "Cancel Order" Button only if the order is NOT Cancelled and NOT in restricted statuses */}
                                            {!["Order Is Under Process","Order Is Placed", "Out For Delivery", "Delivered", "Cancelled"].includes(item.orderStatus) && (
                                                <button onClick={() => updateOrder(item?._id)} className="btn btn-outline-danger mt-2">
                                                    Cancel Order
                                                </button>
                                            )}

                                            {/* View Details Button */}
                                            <Link to={`/order-detail/${item?._id}`} className="btn btn-outline-primary mt-2">
                                                View Details
                                            </Link>
                                        </>
                                    ) : (
                                        <>
                                            {item.bookingStatus === "true" && cancelStatus[item?._id] ? (
                                                <button onClick={() => updateStatus(item?._id, item?.createdAt)} className="btn btn-outline-danger mt-2">
                                                    Cancel Booking
                                                </button>
                                            ) : item.bookingStatus === "false" ? (
                                                <button disabled className="btn btn-outline-secondary mt-2">
                                                    Canceled
                                                </button>
                                            ) : (
                                                <>
                                                    <p className="text-muted">Cancellation is Only Available Till 5 Hours After Your Booking Time</p>
                                                    <button disabled className="btn btn-outline-secondary mt-2">
                                                        Cancellation Expired
                                                    </button>
                                                </>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="py-5 text-center">
                        <h3>No {title === "Order" ? "Orders" : "Bookings"} Placed</h3>
                        <Link to="/product" className="btn btn-primary mt-2">Shop Now</Link>
                    </div>
                )}
            </div>
        </div>
    );
}
