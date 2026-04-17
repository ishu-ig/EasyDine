import React, { useEffect, useState } from "react";
import { useRazorpay } from "react-razorpay";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { getCheckout } from "../Redux/ActionCreators/CheckoutActionCreators";
import { getBooking } from "../Redux/ActionCreators/BookingActionCreators";
import HeroSection from "../Components/HeroSection";

export default function Payment() {
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(false);
    const { Razorpay } = useRazorpay();
    const navigate = useNavigate();
    const { type, _id } = useParams();
    const dispatch = useDispatch();
    const CheckoutStateData = useSelector((state) => state.CheckoutStateData);
    const BookingStateData = useSelector((state) => state.BookingStateData);

    async function getData() {
        if (type === "checkout") {
            dispatch(getCheckout());
            if (CheckoutStateData.length) {
                setData(_id === "-1" ? CheckoutStateData[0] : CheckoutStateData.find(i => i._id === _id));
            }
        } else if (type === "booking") {
            dispatch(getBooking());
            if (BookingStateData.length) {
                setData(_id === "-1" ? BookingStateData[0] : BookingStateData.find(i => i._id === _id));
            }
        }
    }

    useEffect(() => { getData(); }, [CheckoutStateData.length, BookingStateData.length]);

    const initPayment = (paymentData) => {
        const options = {
            key: "rzp_test_hPWsSLPsp2DADQ",
            amount: paymentData.amount,
            currency: "INR",
            order_id: paymentData._id,
            prefill: { name: data?.user?.name, email: data?.user?.email, contact: data?.user?.phone },
            handler: async (response) => {
                try {
                    let verifyURL = type === "checkout" ? "/api/checkout/verify" : "/api/booking/verify";
                    let res = await fetch(`${process.env.REACT_APP_BACKEND_SERVER}${verifyURL}`, {
                        method: "POST",
                        headers: { "content-type": "application/json", "authorization": localStorage.getItem("token") },
                        body: JSON.stringify({ razorpay_payment_id: response.razorpay_payment_id, checkid: data._id })
                    });
                    res = await res.json();
                    if (res.result === "Done") {
                        if (type === "checkout") { dispatch(getCheckout()); navigate("/confirmation/checkout"); }
                        else { dispatch(getBooking()); navigate("/confirmation/booking"); }
                    }
                } catch (e) { console.log(e); }
                finally { setLoading(false); }
            },
            theme: { color: "#C8400A" },
        };
        new Razorpay(options).open();
    };

    const handlePayment = async () => {
        setLoading(true);
        try {
            let url = type === "checkout" ? "/api/checkout/order" : "/api/booking/order";
            let res = await fetch(`${process.env.REACT_APP_BACKEND_SERVER}${url}`, {
                method: "POST",
                headers: { "Content-Type": "application/json", authorization: localStorage.getItem("token") },
                body: JSON.stringify({ amount: data?.total })
            });
            res = await res.json();
            initPayment(res.data);
        } catch (e) { console.log(e); setLoading(false); }
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
                            <i className="fa fa-lock" style={{ color: '#fff', fontSize: 24 }}></i>
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
                                {/* Amount Display */}
                                <div style={{ background: 'rgba(200,64,10,0.06)', borderRadius: 14, padding: '20px', textAlign: 'center', marginBottom: 24, border: '1px dashed rgba(200,64,10,0.2)' }}>
                                    <p style={{ margin: '0 0 4px', fontSize: '0.8rem', color: '#7A6E65', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Amount Due</p>
                                    <p style={{ margin: 0, fontSize: '2.4rem', fontWeight: 800, color: '#C8400A', fontFamily: "'Playfair Display',serif", lineHeight: 1 }}>
                                        ₹{data?.total}
                                    </p>
                                </div>

                                {/* Order Details */}
                                <div style={{ marginBottom: 24 }}>
                                    {[
                                        { icon: 'fa-user', label: 'Name', value: data?.user?.name },
                                        { icon: 'fa-envelope', label: 'Email', value: data?.user?.email },
                                        { icon: type === 'checkout' ? 'fa-box' : 'fa-calendar', label: type === 'checkout' ? 'Order Type' : 'Booking Type', value: isBooking ? 'Table Booking' : 'Food Order' },
                                    ].map(({ icon, label, value }) => (
                                        <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid rgba(200,64,10,0.07)' }}>
                                            <div style={{ width: 32, height: 32, background: 'rgba(200,64,10,0.08)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                <i className={`fa ${icon}`} style={{ color: '#C8400A', fontSize: 13 }}></i>
                                            </div>
                                            <div>
                                                <p style={{ margin: 0, fontSize: '0.75rem', color: '#7A6E65', fontWeight: 500 }}>{label}</p>
                                                <p style={{ margin: 0, fontSize: '0.88rem', fontWeight: 600, color: '#1C1009' }}>{value || '—'}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Accepted Methods */}
                                <div style={{ display: 'flex', gap: 8, marginBottom: 24, justifyContent: 'center', flexWrap: 'wrap' }}>
                                    {['UPI', 'Card', 'Net Banking', 'Wallet'].map(m => (
                                        <span key={m} style={{ padding: '4px 12px', background: '#fff', border: '1px solid rgba(200,64,10,0.18)', borderRadius: 50, fontSize: '0.72rem', fontWeight: 600, color: '#7A6E65' }}>{m}</span>
                                    ))}
                                </div>

                                {/* Pay Button */}
                                <button onClick={handlePayment} disabled={loading} style={{
                                    width: '100%', padding: '14px', background: loading ? '#B4B2A9' : '#C8400A', color: '#fff',
                                    border: 'none', borderRadius: 50, fontSize: '0.95rem', fontWeight: 700,
                                    cursor: loading ? 'not-allowed' : 'pointer', fontFamily: "'DM Sans',sans-serif",
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, transition: 'all 0.3s'
                                }}
                                    onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#1A1A2E'; }}
                                    onMouseLeave={e => { if (!loading) e.currentTarget.style.background = '#C8400A'; }}>
                                    {loading ? (
                                        <><div style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></div> Processing…</>
                                    ) : (
                                        <><i className="fa fa-credit-card"></i> Pay ₹{data?.total} Securely</>
                                    )}
                                </button>

                                <p style={{ textAlign: 'center', fontSize: '0.75rem', color: '#7A6E65', marginTop: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
                                    <i className="fa fa-shield-alt" style={{ color: '#C8400A', fontSize: 12 }}></i>
                                    Powered by Razorpay · 256-bit SSL encrypted
                                </p>
                            </>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '32px 0' }}>
                                <div style={{ width: 48, height: 48, border: '3px solid #C8400A', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }}></div>
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