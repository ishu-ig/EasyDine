import React, { useEffect, useState } from 'react';
import HeroSection from '../Components/HeroSection';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getProduct } from "../Redux/ActionCreators/ProductActionCreators";
import { getResturent, updateResturent } from '../Redux/ActionCreators/ResturentActionCreators';
import Products from '../Components/Products';
import { FaStar, FaRegStar, FaTimes } from 'react-icons/fa';

export default function ResturentDetailPage() {
    const { _id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const ProductStateData = useSelector(state => state.ProductStateData);
    const ResturentStateData = useSelector(state => state.ResturentStateData);

    const [data, setData] = useState({
        name: "",
        pic: "",
        phone: "",
        status: true,
        discount: "",
        seatAvailable: "",
        reservationPrice: "",
        finalPrice: "",
        address: "",
        rating: 0,
        active: true,
        openTime: "",
        closeTime: "",
        timeSlots: [],
        reservationDate: ""
    });

    const [errorMessage, setErrorMessage] = useState({
        reservationDate: "Date field is mandatory",
        timeSlots: "Time Slot field is mandatory"
    });
    const [relatedProduct, setRelatedProduct] = useState([]);
    const [qty, setQty] = useState(1);
    const [mode, setMode] = useState("COD");
    const [show, setShow] = useState(false);
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        dispatch(getResturent());
        if (ResturentStateData.length > 0) {
            const item = ResturentStateData.find(x => x._id === _id);
            if (item) setData({ ...item });
        }
    }, [ResturentStateData.length]);

    useEffect(() => {
        dispatch(getProduct());
    }, [dispatch]);

    useEffect(() => {
        if (ProductStateData.length > 0) {
            setRelatedProduct(ProductStateData.filter(x => x.resturent === data.name));
        }
    }, [ProductStateData, data.name]);

    function generateTimeSlots(openTime, closeTime) {
        if (!openTime || !closeTime) return [];
        const slots = [];
        let start = new Date(`1970-01-01T${openTime}:00`);
        const end = new Date(`1970-01-01T${closeTime}:00`);
        const formatTime = t => t.toString().padStart(2, '0');

        while (start < end) {
            const next = new Date(start);
            next.setMinutes(start.getMinutes() + 60);
            slots.push(`${formatTime(start.getHours())}:${formatTime(start.getMinutes())} - ${formatTime(next.getHours())}:${formatTime(next.getMinutes())}`);
            start = next;
        }
        return slots;
    }

    function addTimeSlot() {
        const selectedTime = document.getElementById("timeSlot").value;
        if (!selectedTime) return;

        setData(prev => {
            const updatedTimeSlots = prev.timeSlots || [];
            if (updatedTimeSlots.length >= 2) {
                alert("You can only select up to 2 time slots.");
                return prev;
            }
            if (updatedTimeSlots.includes(selectedTime)) return prev;
            return { ...prev, timeSlots: [...updatedTimeSlots, selectedTime] };
        });
    }

    function removeTimeSlot(index) {
        setData(prev => ({ ...prev, timeSlots: prev.timeSlots.filter((_, i) => i !== index) }));
    }

    function getInputData(e) {
        const { name, value } = e.target;
        setData(prev => ({ ...prev, [name]: value }));
        setErrorMessage(prev => ({ ...prev, [name]: "" }));
    }

    async function postData(e) {
        e.preventDefault();
        setShow(true);

        if (!data.reservationDate) {
            setErrorMessage(prev => ({ ...prev, reservationDate: "Date field is mandatory" }));
            return;
        }
        const selectedDate = new Date(data.reservationDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (selectedDate < today) {
            setErrorMessage(prev => ({ ...prev, reservationDate: "Backdate not allowed" }));
            return;
        }
        if (!Array.isArray(data.timeSlots) || data.timeSlots.length === 0) {
            setErrorMessage(prev => ({ ...prev, timeSlots: "Selecting at least one time slot is mandatory" }));
            return;
        }

        if (data.seatAvailable > 0) {
            if (localStorage.getItem("login")) {
                if (window.confirm("Are you sure you want to make a booking?")) {
                    let bookingResponse = await fetch(`${process.env.REACT_APP_BACKEND_SERVER}/api/booking`, {
                        method: "POST",
                        headers: { "content-type": "application/json" },
                        body: JSON.stringify({
                            user: localStorage.getItem("userid"),
                            bookingStatus: true,
                            paymentStatus: "Pending",
                            paymentMode: mode,
                            seats: qty,
                            total: data.finalPrice * qty,
                            resturent: _id,
                            date: data.reservationDate,
                            time: data.timeSlots.join(", "),
                        })
                    });

                    bookingResponse = await bookingResponse.json();

                    if (bookingResponse.result === "Done") {
                        let updateResponse = await fetch(`${process.env.REACT_APP_BACKEND_SERVER}/api/resturent/user/${_id}`, {
                            method: "PUT",
                            headers: {
                                "content-type": "application/json",
                                "authorization": localStorage.getItem("token")
                            },
                            body: JSON.stringify({ ...data, seatAvailable: data.seatAvailable - qty })
                        });

                        updateResponse = await updateResponse.json();
                        if (mode === "COD")
                            navigate(`/confirmationBooking/${bookingResponse.data._id}`);
                        else
                            navigate("/payment/booking/-1");
                    }
                }
            } else {
                alert("To book a seat, you need to log in.");
                navigate("/login");
            }
        } else {
            alert("No Seats Are Available");
            setQty(0);
        }
    }

    function renderStars(rating) {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(i <= rating ? <FaStar key={i} color="gold" /> : <FaRegStar key={i} color="gold" />);
        }
        return stars;
    }

    return (
        <>
            <div className="d-none d-lg-block">
                <HeroSection title={`Restaurant - ${data.name}`} />
            </div>
            <div className="container-xxl py-5">
                <div className="section-header text-center mb-5" style={{ maxWidth: 500, margin: "auto" }}>
                    <h1 className="display-4 fw-bold">{data.name}</h1>
                </div>
                <div className="row g-4">
                    <div className="col-lg-5 col-md-12 col-12">
                        <img
                            src={`${process.env.REACT_APP_BACKEND_SERVER}/${data.pic}`}
                            className="img-fluid rounded shadow-sm mb-3"
                            alt={data.name}
                        />
                        {/* <div>
                            <h5>Rating: {renderStars(data.rating)}</h5>
                        </div> */}
                    </div>
                    <div className="col-lg-7 col-md-12 col-12">
                        <div className="card shadow-sm p-4 h-100">
                            <table className="table table-bordered">
                                <tbody>
                                    <tr>
                                        <th>Name</th>
                                        <td>{data.name}</td>
                                    </tr>
                                    <tr>
                                        <th>Contact</th>
                                        <td>{data.phone}</td>
                                    </tr>
                                    <tr>
                                        <th>Address</th>
                                        <td>{data.address}</td>
                                    </tr>
                                    <tr>
                                        <th>Price</th>
                                        <td>
                                            <del className="text-danger">&#8377;{data.reservationPrice}</del>
                                            <span className="ms-2 text-success">&#8377;{data.finalPrice}</span>
                                            <sup className="text-success"> {data.discount}%</sup>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>Seats Available</th>
                                        <td>{data.seatAvailable > 0 ? data.seatAvailable : "No Seats"}</td>
                                    </tr>
                                    <tr>
                                        <th>Status</th>
                                        <td><span className={`badge ${data.status ? 'bg-success' : 'bg-danger'}`}>{data.status ? "OPEN" : "CLOSED"}</span></td>
                                    </tr>
                                    <tr>
                                        <th>Timing</th>
                                        <td>{data.openTime} - {data.closeTime}</td>
                                    </tr>
                                    <tr>
                                        <th>Select Time Slot</th>
                                        <td>
                                            <div className="d-flex gap-2 align-items-center">
                                                <select className="form-select flex-grow-1" id="timeSlot">
                                                    {generateTimeSlots(data.openTime, data.closeTime).map((slot, index) => (
                                                        <option key={index} value={slot}>{slot}</option>
                                                    ))}
                                                </select>
                                                <button type="button" className={`btn ${show && errorMessage.timeSlots ? 'btn-danger' : 'btn-success'}`} onClick={addTimeSlot}>Add</button>
                                            </div>
                                            <div className="mt-2 d-flex flex-wrap gap-2">
                                                {(data.timeSlots || []).map((slot, i) => (
                                                    <span key={i} className="badge bg-light text-dark p-2 d-flex align-items-center gap-1">
                                                        {slot} <FaTimes style={{ cursor: 'pointer' }} onClick={() => removeTimeSlot(i)} />
                                                    </span>
                                                ))}
                                            </div>
                                            {show && errorMessage.timeSlots && <small className="text-danger">{errorMessage.timeSlots}</small>}
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>Date</th>
                                        <td>
                                            <input
                                                type="date"
                                                name="reservationDate"
                                                min={new Date().toISOString().split("T")[0]}
                                                className={`form-control ${show && errorMessage.reservationDate ? 'border-danger' : ''}`}
                                                onChange={getInputData}
                                            />
                                            {show && errorMessage.reservationDate && <small className="text-danger">{errorMessage.reservationDate}</small>}
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>Number of Seats</th>
                                        <td>
                                            <div className="d-flex gap-2 align-items-center">
                                                <button className="btn btn-outline-primary" type="button" onClick={() => setQty(prev => Math.max(1, prev - 1))}>-</button>
                                                <span className="fs-5">{qty}</span>
                                                <button className="btn btn-outline-primary" type="button" onClick={() => setQty(prev => Math.min(data.seatAvailable, prev + 1))}>+</button>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>Payment Mode</th>
                                        <td>
                                            <select className="form-select" onChange={(e) => setMode(e.target.value)}>
                                                <option value="COD">Cash On Delivery</option>
                                                <option value="Net Banking">Net Banking / UPI / Card</option>
                                            </select>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <button type="submit" className="btn btn-primary w-100 mt-3" onClick={postData}>Book Now</button>
                        </div>
                    </div>
                </div>

                {/* Reviews Section */}
                <div className="mt-5">
                    <h4>Reviews</h4>
                    {reviews.length === 0 ? <p>No reviews yet.</p> :
                        reviews.map((r, i) => (
                            <div key={i} className="card p-3 mb-2 shadow-sm">
                                <div className="d-flex justify-content-between align-items-center">
                                    <strong>{r.user}</strong>
                                    <div>{renderStars(r.rating)}</div>
                                </div>
                                <p className="mb-0">{r.comment}</p>
                            </div>
                        ))
                    }
                    <div className="mt-3">
                        <h5>Add a Review</h5>
                        <form onSubmit={e => e.preventDefault()} className="d-flex flex-column gap-2">
                            <input type="text" placeholder="Your Name" className="form-control" />
                            <textarea placeholder="Your Review" className="form-control" rows={3}></textarea>
                            <select className="form-select">
                                <option value={5}>5 Stars</option>
                                <option value={4}>4 Stars</option>
                                <option value={3}>3 Stars</option>
                                <option value={2}>2 Stars</option>
                                <option value={1}>1 Star</option>
                            </select>
                            <button className="btn btn-success mt-2">Submit Review</button>
                        </form>
                    </div>
                </div>
            </div>

            {relatedProduct.length > 0 && <Products title="Other Related Dishes" data={relatedProduct} />}
        </>
    );
}
