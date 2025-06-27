import React, { useEffect, useState } from "react";
import { useRazorpay } from "react-razorpay";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";

import { getCheckout } from "../Redux/ActionCreators/CheckoutActionCreators"
import { getBooking } from "../Redux/ActionCreators/BookingActionCreators"
import HeroSection from "../Components/HeroSection"

export default function Payment() {
    var [data, setData] = useState({})

    const { Razorpay } = useRazorpay();

    var navigate = useNavigate()

    var {type, _id } = useParams()

    var dispatch = useDispatch()
    var CheckoutStateData = useSelector((state) => state.CheckoutStateData)
    var BookingStateData = useSelector((state) => state.BookingStateData)


    async function getData() {
        if(type === "checkout"){
            dispatch(getCheckout())
        if (CheckoutStateData.length) {
            var result
            if (_id === "-1")
                result = CheckoutStateData[0]
            else
                result = CheckoutStateData.find((item) => item._id === _id)

            setData(result)
        }
        }
        else if (type === "booking") {
            dispatch(getBooking())
        if (BookingStateData.length) {
            var result
            if (_id === "-1")
                result = BookingStateData[0]
            else
                result = BookingStateData.find((item) => item._id === _id)

            setData(result)
        }
        }
    }
    useEffect(() => {
        getData()
    }, [CheckoutStateData.length,BookingStateData.length])

    const initPayment = (paymentData) => {
        const options = {
            key: "rzp_test_hPWsSLPsp2DADQ",
            amount: paymentData.amount,
            currency: "INR",
            order_id: paymentData._id,
            "prefill": {
                "name": data?.user?.name,
                "email": data?.user?.email,
                "contact": data?.user?.phone,
            },
            handler: async (response) => {
                try {
                    var item = {
                        razorpay_payment_id: response.razorpay_payment_id,
                        checkid: data._id
                    }
                    let verifyURL = type === "checkout" ? "/api/checkout/verify" : "/api/booking/verify"
                    response = await fetch(`${process.env.REACT_APP_BACKEND_SERVER}${verifyURL}`, {
                        method: "POST",
                        headers: {
                            "content-type": "application/json",
                            "authorization": localStorage.getItem("token")
                        },
                        body: JSON.stringify(item)
                    });
                    response = await response.json()
                    if (response.result === "Done") {
                        if (type === "checkout") {
                            dispatch(getCheckout());
                            navigate("/confirmation/checkout");
                        } else {
                            dispatch(getBooking());
                            navigate(`/confirmation/booking`);
                        }
                        
                    }
                } catch (error) {
                    console.log(error);
                }
            },
            theme: {
                color: "#3399cc",
            },
        };
        const rzp1 = new Razorpay(options);
        rzp1.open();
    };

    const handlePayment = async () => {
        try {
            let orderURL = type === "checkout" ? "/api/checkout/order" : "/api/booking/order";
            var response = await fetch(`${process.env.REACT_APP_BACKEND_SERVER}${orderURL}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    authorization: localStorage.getItem("token")
                },
                body: JSON.stringify({ amount: data?.total })
            });
            response = await response.json()
            initPayment(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <HeroSection title="Online Payment" />

            <div className="container my-5 d-flex justify-content-center align-items-center">
                <div className="card shadow-lg p-4 text-center" style={{ maxWidth: "400px", width: "100%", borderRadius: "10px" }}>
                    <h4 className="fw-bold text-primary mb-3">Complete Your Payment</h4>

                    {data ? (
                        <>
                            <p className="text-muted">Amount Due: <span className="fw-bold text-dark">₹{data?.total}</span></p>
                            <button onClick={handlePayment} className="btn btn-success w-100 py-2 fw-bold">
                                <i className="fas fa-credit-card"></i> Pay Now
                            </button>
                        </>
                    ) : (
                        <div className="d-flex justify-content-center">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div style={{ height: "100px" }}></div>

        </>
    );
}
