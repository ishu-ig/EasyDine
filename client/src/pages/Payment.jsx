import React, { useEffect, useState } from "react";
import { useRazorpay } from "react-razorpay";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { getCheckout } from "../Redux/ActionCreators/CheckoutActionCreators";
import { getBooking } from "../Redux/ActionCreators/BookingActionCreators";
import { deleteCart } from "../Redux/ActionCreators/CartActionCreators";
import HeroSection from "../Components/HeroSection";

export default function Payment() {
    const [data, setData]         = useState({});
    const [loading, setLoading]   = useState(false);
    const [payError, setPayError] = useState("");

    const { Razorpay } = useRazorpay();
    const navigate     = useNavigate();
    const { type, _id } = useParams();
    const dispatch     = useDispatch();

    const CheckoutStateData = useSelector((s) => s.CheckoutStateData);
    const BookingStateData  = useSelector((s) => s.BookingStateData);
    const CartStateData     = useSelector((s) => s.CartStateData);

    // ── Load the right record from Redux ──────────────────────────
    async function getData() {
        if (type === "checkout") {
            dispatch(getCheckout());
            if (CheckoutStateData.length) {
                setData(_id === "-1"
                    ? CheckoutStateData[0]
                    : CheckoutStateData.find(i => i._id === _id) || {});
            }
        } else if (type === "booking") {
            dispatch(getBooking());
            if (BookingStateData.length) {
                setData(_id === "-1"
                    ? BookingStateData[0]
                    : BookingStateData.find(i => i._id === _id) || {});
            }
        }
    }

    useEffect(() => { getData(); }, [CheckoutStateData.length, BookingStateData.length]);

    // ── Clear cart (checkout only) ────────────────────────────────
    function clearCart() {
        if (type === "checkout" && CartStateData?.length) {
            CartStateData.forEach((item) => dispatch(deleteCart({ _id: item._id })));
        }
    }

    // ── Reduce seats after successful booking payment ─────────────
    async function reduceSeats() {
        if (type !== "booking" || !data?.resturent?._id) return;
        try {
            await fetch(
                `${process.env.REACT_APP_BACKEND_SERVER}/api/resturent/user/${data.resturent._id}`,
                {
                    method: "PUT",
                    headers: {
                        "content-type": "application/json",
                        authorization: localStorage.getItem("token"),
                    },
                    body: JSON.stringify({
                        seatAvailable: data.resturent.seatAvailable - data.seats,
                    }),
                }
            );
        } catch (e) {
            console.log("Seat update error:", e);
        }
    }

    // ── Open Razorpay modal ───────────────────────────────────────
    const initPayment = (paymentData) => {
        const options = {
            key:      "rzp_test_hPWsSLPsp2DADQ",
            amount:   paymentData.amount,
            currency: "INR",
            order_id: paymentData.id,           // ← Razorpay field is .id not ._id
            prefill: {
                name:    data?.user?.name,
                email:   data?.user?.email,
                contact: data?.user?.phone,
            },

            // ✅ Payment success
            handler: async (response) => {
                try {
                    setLoading(true);
                    setPayError("");

                    const verifyURL = type === "checkout"
                        ? "/api/checkout/verify"
                        : "/api/booking/verify";

                    let res = await fetch(
                        `${process.env.REACT_APP_BACKEND_SERVER}${verifyURL}`,
                        {
                            method: "POST",
                            headers: {
                                "content-type": "application/json",
                                authorization: localStorage.getItem("token"),
                            },
                            body: JSON.stringify({
                                razorpay_order_id:   response.razorpay_order_id,   // ← for signature check
                                razorpay_payment_id: response.razorpay_payment_id, // ← for signature check
                                razorpay_signature:  response.razorpay_signature,  // ← for signature check
                                checkid: data._id,
                            }),
                        }
                    );
                    res = await res.json();

                    if (res.result === "Done") {
                        if (type === "checkout") {
                            clearCart();                  // ✅ clear cart after verified
                            dispatch(getCheckout());
                            navigate("/confirmation/checkout");
                        } else {
                            await reduceSeats();          // ✅ reduce seats after verified
                            dispatch(getBooking());
                            navigate("/confirmation/booking");
                        }
                    } else {
                        // Backend verification failed → record was deleted
                        setPayError("Payment verification failed. Your booking was not placed. Please try again.");
                    }
                } catch (e) {
                    console.log(e);
                    setPayError("Something went wrong during verification. Please contact support.");
                } finally {
                    setLoading(false);
                }
            },

            // ❌ User closed the modal
            "modal.ondismiss": () => {
                setLoading(false);
                setPayError("Payment was cancelled. Your booking has not been placed.");
            },

            theme: { color: "#C8400A" },
        };

        const rzp = new Razorpay(options);

        // ❌ Card declined / payment failed inside modal
        rzp.on("payment.failed", (response) => {
            setLoading(false);
            setPayError(`Payment failed: ${response.error.description}. Your booking was not placed.`);
        });

        rzp.open();
    };

    // ── Create Razorpay order then open modal ─────────────────────
    const handlePayment = async () => {
        setLoading(true);
        setPayError("");
        try {
            const url = type === "checkout"
                ? "/api/checkout/order"
                : "/api/booking/order";

            let res = await fetch(`${process.env.REACT_APP_BACKEND_SERVER}${url}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    authorization: localStorage.getItem("token"),
                },
                body: JSON.stringify({ amount: data?.total }),
            });
            res = await res.json();
            initPayment(res.data);   // loading stays true until handler/dismiss fires
        } catch (e) {
            console.log(e);
            setLoading(false);
            setPayError("Could not initiate payment. Please try again.");
        }
    };

    const isBooking = type === "booking";

    return (
        <>
            <HeroSection title="Secure Payment" />
            <div style={{ background: 'linear-gradient(135deg,#FDF6EE 0%,#FFF8F3 100%)', minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 16px' }}>
                <div style={{ width: '100%', maxWidth: 460 }}>

                    {/* Header */}
                    <div style={{ textAlign: 'center', marginBottom: 32 }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 64, height: 64, background: '#C8400A', borderRadius: 18, marginBottom: 16, boxShadow: '0 8px 24px rgba(200,64,10,0.28)' }}>
                            <i className="fa fa-lock" style={{ color: '#fff', fontSize: 24 }} />
                        </div>
                        <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.75rem', fontWeight: 700, color: '#1C1009', margin: '0 0 6px' }}>
                            {isBooking ? 'Complete Booking Payment' : 'Complete Your Order'}
                        </h2>
                        <p style={{ color: '#7A6E65', fontSize: '0.9rem', margin: 0 }}>
                            Your payment is secured with industry-standard encryption
                        </p>
                    </div>

                    {/* Card */}
                    <div style={{ background: '#FFFBF7', borderRadius: 20, border: '1px solid rgba(200,64,10,0.12)', padding: '32px', boxShadow: '0 8px 32px rgba(28,16,9,0.10)' }}>
                        {data?.total ? (
                            <>
                                {/* Amount */}
                                <div style={{ background: 'rgba(200,64,10,0.06)', borderRadius: 14, padding: '20px', textAlign: 'center', marginBottom: 24, border: '1px dashed rgba(200,64,10,0.2)' }}>
                                    <p style={{ margin: '0 0 4px', fontSize: '0.8rem', color: '#7A6E65', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Amount Due</p>
                                    <p style={{ margin: 0, fontSize: '2.4rem', fontWeight: 800, color: '#C8400A', fontFamily: "'Playfair Display',serif", lineHeight: 1 }}>
                                        ₹{data?.total}
                                    </p>
                                </div>

                                {/* Details */}
                                <div style={{ marginBottom: 24 }}>
                                    {[
                                        { icon: 'fa-user',    label: 'Name',  value: data?.user?.name },
                                        { icon: 'fa-envelope', label: 'Email', value: data?.user?.email },
                                        { icon: isBooking ? 'fa-calendar' : 'fa-box', label: isBooking ? 'Booking Type' : 'Order Type', value: isBooking ? 'Table Booking' : 'Food Order' },
                                    ].map(({ icon, label, value }) => (
                                        <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid rgba(200,64,10,0.07)' }}>
                                            <div style={{ width: 32, height: 32, background: 'rgba(200,64,10,0.08)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                <i className={`fa ${icon}`} style={{ color: '#C8400A', fontSize: 13 }} />
                                            </div>
                                            <div>
                                                <p style={{ margin: 0, fontSize: '0.75rem', color: '#7A6E65', fontWeight: 500 }}>{label}</p>
                                                <p style={{ margin: 0, fontSize: '0.88rem', fontWeight: 600, color: '#1C1009' }}>{value || '—'}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* ❌ Error Banner */}
                                {payError && (
                                    <div style={{ background: '#FCEBEB', border: '1px solid #E24B4A', borderRadius: 10, padding: '12px 16px', marginBottom: 20, display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                                        <i className="fa fa-exclamation-circle" style={{ color: '#A32D2D', marginTop: 2, flexShrink: 0 }} />
                                        <p style={{ margin: 0, fontSize: '0.84rem', color: '#A32D2D', fontWeight: 500 }}>{payError}</p>
                                    </div>
                                )}

                                {/* Payment methods */}
                                <div style={{ display: 'flex', gap: 8, marginBottom: 24, justifyContent: 'center', flexWrap: 'wrap' }}>
                                    {['UPI', 'Card', 'Net Banking', 'Wallet'].map(m => (
                                        <span key={m} style={{ padding: '4px 12px', background: '#fff', border: '1px solid rgba(200,64,10,0.18)', borderRadius: 50, fontSize: '0.72rem', fontWeight: 600, color: '#7A6E65' }}>{m}</span>
                                    ))}
                                </div>

                                {/* Pay button */}
                                <button
                                    onClick={handlePayment}
                                    disabled={loading}
                                    style={{ width: '100%', padding: '14px', background: loading ? '#B4B2A9' : '#C8400A', color: '#fff', border: 'none', borderRadius: 50, fontSize: '0.95rem', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: "'DM Sans',sans-serif", display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, transition: 'all 0.3s' }}
                                    onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#1A1A2E'; }}
                                    onMouseLeave={e => { if (!loading) e.currentTarget.style.background = '#C8400A'; }}
                                >
                                    {loading
                                        ? <><div style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /> Processing…</>
                                        : <><i className="fa fa-credit-card" /> Pay ₹{data?.total} Securely</>
                                    }
                                </button>

                                <p style={{ textAlign: 'center', fontSize: '0.75rem', color: '#7A6E65', marginTop: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
                                    <i className="fa fa-shield-alt" style={{ color: '#C8400A', fontSize: 12 }} />
                                    Powered by Razorpay · 256-bit SSL encrypted
                                </p>
                            </>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '32px 0' }}>
                                <div style={{ width: 48, height: 48, border: '3px solid #C8400A', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
                                <p style={{ color: '#7A6E65' }}>Loading payment details…</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        </>
    );
}