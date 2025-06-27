import React, { useEffect, useState } from 'react'
import HeroSection from '../Components/HeroSection'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { getProduct } from "../Redux/ActionCreators/ProductActionCreators"
import { getResturent, updateResturent } from '../Redux/ActionCreators/ResturentActionCreators';
import Products from '../Components/Products';

export default function ResturentDetailPage() {
    let { _id } = useParams();
    let dispatch = useDispatch();
    let navigate = useNavigate();

    let ProductStateData = useSelector(state => state.ProductStateData);
    let ResturentStateData = useSelector(state => state.ResturentStateData);

    let [data, setData] = useState({
        name: "",
        pic: "",
        phone: "",
        status: true,
        discount: "",
        seatAvailable: "",
        reservationPrice: "",
        finalPrice: "",
        address: "",
        rating: "",
        active: true,
        openTime: "",
        closeTime: "",
        timeSlots: [],
        reservationDate: ""
    });

    let [errorMessage, setErrorMessage] = useState({
        reservationDate: "Date field is mandatory",
        timeSlots: "Time Slot field is mandatory"
    });

    let [relatedProduct, setRelatedProduct] = useState([]);
    let [qty, setQty] = useState(1);
    let [mode, setMode] = useState("COD");
    let [show ,setShow] = useState(false)


    useEffect(() => {
        dispatch(getResturent());

        if (ResturentStateData.length > 0) {
            let item = ResturentStateData.find((x) => x._id === _id);
            console.log(item)
            if (item) setData({ ...item });
        }
    }, [ResturentStateData.length]);

    function generateTimeSlots(openTime, closeTime) {
        if (!openTime || !closeTime) return [];
        let slots = [];
        let start = new Date(`1970-01-01T${openTime}:00`);
        let end = new Date(`1970-01-01T${closeTime}:00`);

        while (start < end) {
            let next = new Date(start);
            next.setMinutes(start.getMinutes() + 60);

            let formatTime = time => time.toString().padStart(2, '0');
            slots.push(`${formatTime(start.getHours())}:${formatTime(start.getMinutes())} - ${formatTime(next.getHours())}:${formatTime(next.getMinutes())}`);
            start = next;
        }
        return slots;
    }

    function addTimeSlot() {
        let selectedTime = document.getElementById("timeSlot").value;
        if (!selectedTime) return;

        setData(prev => {
            let updatedTimeSlots = prev.timeSlots || [];
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
        let { name, value } = e.target;
        setData(prev => ({ ...prev, [name]: value }));
        setErrorMessage(prev => ({ ...prev, [name]: "" }));
    }

    async function postData(e) {
        e.preventDefault();

        // Validate required fields
        if (!data.reservationDate) {
            setShow(true)
            setErrorMessage(prev => ({ ...prev, reservationDate: "Date field is mandatory" }));
            return;
        }
        if (!Array.isArray(data.timeSlots) || data.timeSlots.length === 0) {
            setShow(true)
            setErrorMessage(prev => ({ ...prev, timeSlots: "Selecting at least one time slot is mandatory" }));
            return;
        }

        if (localStorage.getItem("login")) {
            if (window.confirm("Are you sure you want to make a booking?")) {
                let bookingResponse = await fetch(`${process.env.REACT_APP_BACKEND_SERVER}/api/booking`, {
                    method: "POST",
                    headers: {
                        "content-type": "application/json"
                    },
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
                })
                bookingResponse = await bookingResponse.json()
                console.log(bookingResponse.data)
                if (bookingResponse.result === "Done") {
                    let updateResponse = await fetch(`${process.env.REACT_APP_BACKEND_SERVER}/api/resturent/user/${_id}`, {
                        method: "PUT",
                        headers: {
                            "content-type": "application/json",
                            "authorization": localStorage.getItem("token")

                        },
                        body: JSON.stringify({
                            ...data,seatAvailable : data.seatAvailable - qty 
                        })
                    })
                    updateResponse : await updateResponse.json()
                    console.log(updateResponse)
                    if(mode === "COD")
                        navigate(`/confirmationBooking/${bookingResponse.data._id}`)
                    else 
                    navigate("/payment/booking/-1")
                }
            }
        } else {
            alert("To book a seat, you need to log in.");
            navigate("/login");
        }
    }

    useEffect(() => {
        dispatch(getProduct());
    }, [dispatch]);

    useEffect(() => {
        if (ProductStateData.length > 0) {
            setRelatedProduct(ProductStateData.filter(x => x.resturent === data.name));
        }
    }, [ProductStateData, data.name]);


    return (
        <>
            <HeroSection title={`Resturent - ${data.name}`} />
            <div className="container-xxl py-5">
                <div className="container-fluid text-center">
                    <div className="section-header text-center mb-5" style={{ maxWidth: 500, margin: "auto" }}>
                        <h1 className="display-4 fw-bold">{data.name}</h1>
                    </div>
                    <form onSubmit={postData}>
                        <div className="row">
                            <div className="col-md-5 d-flex align-items-center justify-content-center">
                                <img
                                    src={`${process.env.REACT_APP_BACKEND_SERVER}/${data.pic}`}
                                    style={{ height: 550, width: '100%', borderRadius: '10px' }}
                                    alt="Dish"
                                />
                            </div>
                            <div className="col-md-7">
                                <div className="card shadow-lg p-4">
                                    <table className="table table-bordered">
                                        <tbody>
                                            <tr>
                                                <th>Dish Name</th>
                                                <td>{data.name || "N/A"}</td>
                                            </tr>
                                            <tr>
                                                <th>Contact Number</th>
                                                <td>{data.phone || "N/A"}</td>
                                            </tr>
                                            <tr>
                                                <th>Address</th>
                                                <td>{data.address || "N/A"}</td>
                                            </tr>
                                            <tr>
                                                <th>Price</th>
                                                <td>
                                                    <del className='text-danger'>&#8377;{data.reservationPrice}</del>
                                                    <strong className="ms-2 text-success">&#8377;{data.finalPrice}</strong>
                                                    <sup className='text-success'> {data.discount}%</sup>
                                                </td>
                                            </tr>
                                            <tr>
                                                <th>Seats Available</th>
                                                <td>{data.seatAvailable || "N/A"}</td>
                                            </tr>
                                            <tr>
                                                <th>Status</th>
                                                <td>
                                                    <span className={`badge ${data.status ? 'bg-success' : 'bg-danger'}`}>
                                                        {data.status ? "OPEN" : "CLOSE"}
                                                    </span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <th>Timing</th>
                                                <td>{data.openTime} - {data.closeTime}</td>
                                            </tr>
                                            <tr>
                                                <th>Select Time Slot</th>
                                                <td>
                                                    <select className='form-control' id="timeSlot">
                                                        {generateTimeSlots(data.openTime, data.closeTime).map((slot, index) => (
                                                            <option key={index} value={slot}>{slot}</option>
                                                        ))}
                                                    </select>
                                                    <button type="button" className={`btn  ${show && errorMessage.timeSlots ? 'btn-danger' : 'btn-success'} mt-2`} onClick={addTimeSlot}>
                                                        Add Slot
                                                    </button>
                                                    {show && errorMessage.timeSlots ? <p>{errorMessage.timeSlots}</p> : null}
                                                </td>

                                            </tr>
                                            <tr>
                                                <th>Selected Time Slots</th>
                                                <td>
                                                    {(data.timeSlots || []).map((slot, index) => (
                                                        <span key={index} className="badge text-muted text-center m-1" style={{ fontSize: "1.1rem" }}>
                                                            {slot} <i className="fa fa-times ms-1 text-muted" onClick={() => removeTimeSlot(index)} style={{ cursor: 'pointer' }}></i>
                                                        </span>
                                                    ))}
                                                </td>
                                            </tr>
                                            <tr>
                                                <th>Date</th>
                                                <td>
                                                    <input type="date" name="reservationDate" className={`form-control border1 ${show && errorMessage.reservationDate ? 'border-danger' : 'border-primary'}`} onChange={getInputData} />
                                                    {show && errorMessage.reservationDate ? <p>{errorMessage.reservationDate}</p> : null}
                                                </td>
                                            </tr>
                                            <tr>
                                                <th>No. Of Seats</th>
                                                <td>
                                                    <div className="btn-group w-50 ">
                                                        <button className="btn btn-primary" type='button' style={{ borderRadius: "5px" }} onClick={() => setQty((prev) => Math.max(1, prev - 1))} >
                                                            <i className="fa fa-minus"></i>
                                                        </button>
                                                        <h3 className="w-50 text-center">{qty}</h3>
                                                        <button className="btn btn-primary" type='button' style={{ borderRadius: "5px" }} onClick={() => setQty((prev) => Math.min(data.seatAvailable, prev + 1))} >
                                                            <i className="fa fa-plus"></i>
                                                        </button>
                                                    </div>
                                                </td>

                                            </tr>
                                            <tr>
                                                <th>Payment Mode</th>
                                                <td>
                                                    <select name="paymentMode" className='form-select border-1 border-primary' onChange={(e) => setMode(e.target.value)} >
                                                        <option value="COD">Cash On Delivery</option>
                                                        <option value="Net Banking">Net Banking/UPI/Card</option>
                                                    </select>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td colSpan={2}>
                                                    <button className="btn btn-primary w-100" type="submit">
                                                        Book Now
                                                    </button>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            {relatedProduct.length > 0 && <Products title="Other Related Dishes" data={relatedProduct} />}
        </>
    )
}
