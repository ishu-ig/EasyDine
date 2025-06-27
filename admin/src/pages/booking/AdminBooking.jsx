import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import $ from 'jquery';
import 'datatables.net-dt/css/dataTables.dataTables.min.css';
import 'datatables.net';
import { getBooking } from '../../Redux/ActionCreators/BookingActionCreators';

export default function AdminBookings() {
    let BookingStateData = useSelector((state) => state.BookingStateData);
    let dispatch = useDispatch();

    function getAPIData() {
        dispatch(getBooking());

        setTimeout(() => {
            if (!$.fn.dataTable.isDataTable("#DataTable")) {
                $("#DataTable").DataTable();
            }
        }, 500);
        console.log(BookingStateData)
    }

    useEffect(() => {
        getAPIData();
        return () => {
            if ($.fn.dataTable.isDataTable("#DataTable")) {
                $("#DataTable").DataTable().destroy();
            }
        };
    }, [BookingStateData.length]);
    console.log(BookingStateData)

    return (
        <>
            <div className="container-fluid">
                <h5 className="bg-primary text-light text-center p-2">Booking</h5>
                <div className="table-responsive">
                    <table id="DataTable" className="table table-bordered">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Restaurant Name</th>
                                <th>User ID</th>
                                <th>Booking Date</th>
                                <th>Time Slot</th>
                                <th>Seats</th>
                                <th>Total</th>
                                <th>Booking Status</th>
                                <th>Payment Status</th>
                                <th>Payment Mode</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {BookingStateData?.map((item) => (
                                <tr key={item._id}>
                                    <td>{item._id}</td>
                                    <td>{item.resturent?.name}</td>
                                    <td>{item.user.username}</td>
                                    <td>{item.date}</td>
                                    <td>{item.time}</td>
                                    <td>{item.seats}</td>
                                    <td>₹{item.finalReservationPrice}</td>
                                    <td className={` ${item.bookingStatus === "true" ? "text-success" : "text-danger"}`}>
                                        {item.bookingStatus === "true" ? "Confirmed" : "Canceled"}
                                    </td>
                                    <td>
                                        <span className={`badge fs-6 ${item.paymentStatus === "Pending" ? "text-danger" : "text-success"}`}>
                                            {item.paymentStatus}
                                        </span>
                                    </td>
                                    <td>{item.paymentMode}</td>
                                    <td>
                                        <Link to={`/booking/view/${item._id}`} className="btn btn-primary text-light" style={{ borderRadius: 8 }}>
                                            <i className="fa fa-eye fs-5 pt-1"></i>
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}
