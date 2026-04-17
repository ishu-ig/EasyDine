import React, { useEffect, useState } from "react";
import HeroSection from "../Components/HeroSection";
import { Link, useParams } from "react-router-dom";

export default function ConfirmationPage() {
    const { type } = useParams();
    const isCheckout = type === "checkout";
    const [show, setShow] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setShow(true), 100);
        return () => clearTimeout(t);
    }, []);

    return (
        <>
            <HeroSection title={isCheckout ? "Order Confirmed" : "Booking Confirmed"} />
            <div style={{ background: 'linear-gradient(135deg,#FDF6EE 0%,#FFF8F3 100%)', minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 16px' }}>
                <div style={{ width: '100%', maxWidth: 520, textAlign: 'center', opacity: show ? 1 : 0, transform: show ? 'translateY(0)' : 'translateY(24px)', transition: 'all 0.6s cubic-bezier(0.4,0,0.2,1)' }}>

                    {/* Success Icon */}
                    <div style={{ position: 'relative', display: 'inline-block', marginBottom: 32 }}>
                        <div style={{
                            width: 100, height: 100, borderRadius: '50%',
                            background: 'linear-gradient(135deg, #C8400A, #E86834)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 16px 48px rgba(200,64,10,0.35)',
                            margin: '0 auto'
                        }}>
                            <i className={`fa ${isCheckout ? 'fa-check' : 'fa-calendar-check'}`} style={{ color: '#fff', fontSize: 40 }}></i>
                        </div>
                        {/* Ripple rings */}
                        {[1, 2].map(r => (
                            <div key={r} style={{
                                position: 'absolute', top: '50%', left: '50%',
                                transform: 'translate(-50%,-50%)',
                                width: 100 + r * 40, height: 100 + r * 40,
                                borderRadius: '50%',
                                border: `2px solid rgba(200,64,10,${0.15 / r})`,
                                animation: `ripple ${0.8 + r * 0.4}s ease-out infinite`,
                                animationDelay: `${r * 0.2}s`
                            }}></div>
                        ))}
                    </div>

                    {/* Card */}
                    <div style={{ background: '#FFFBF7', borderRadius: 24, border: '1px solid rgba(200,64,10,0.12)', padding: '40px 36px', boxShadow: '0 12px 40px rgba(28,16,9,0.10)' }}>
                        <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: '2.2rem', fontWeight: 700, color: '#1C1009', margin: '0 0 12px' }}>
                            {isCheckout ? 'Order Placed!' : 'Booking Confirmed!'}
                        </h1>
                        <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.15rem', fontWeight: 400, color: '#7A6E65', margin: '0 0 16px' }}>
                            {isCheckout ? 'Your food is on its way to you 🎉' : 'Your table is all set! 🎉'}
                        </h3>
                        <p style={{ color: '#7A6E65', fontSize: '0.9rem', lineHeight: 1.7, margin: '0 0 32px' }}>
                            {isCheckout
                                ? 'We\'ve received your order and it\'s being prepared. You can track your delivery status from the orders section.'
                                : 'Your booking has been confirmed. You can view all booking details in the bookings section.'}
                        </p>

                        {/* Divider */}
                        <div style={{ height: 1, background: 'rgba(200,64,10,0.1)', marginBottom: 28 }}></div>

                        {/* Steps */}
                        <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginBottom: 32, flexWrap: 'wrap' }}>
                            {(isCheckout
                                ? [{ icon: 'fa-receipt', label: 'Order Placed' }, { icon: 'fa-fire', label: 'Preparing' }, { icon: 'fa-bicycle', label: 'On the Way' }, { icon: 'fa-home', label: 'Delivered' }]
                                : [{ icon: 'fa-calendar-check', label: 'Booked' }, { icon: 'fa-bell', label: 'Reminder Sent' }, { icon: 'fa-utensils', label: 'Enjoy Dining' }]
                            ).map(({ icon, label }, i) => (
                                <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: i === 0 ? '#C8400A' : 'rgba(200,64,10,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <i className={`fa ${icon}`} style={{ color: i === 0 ? '#fff' : '#C8400A', fontSize: 15 }}></i>
                                    </div>
                                    <span style={{ fontSize: '0.72rem', fontWeight: 600, color: i === 0 ? '#C8400A' : '#B4B2A9', whiteSpace: 'nowrap' }}>{label}</span>
                                </div>
                            ))}
                        </div>

                        {/* Action Buttons */}
                        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                            <Link to={isCheckout ? "/order" : "/booking"} style={{
                                display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 24px',
                                background: '#C8400A', color: '#fff', borderRadius: 50, textDecoration: 'none',
                                fontWeight: 700, fontSize: '0.88rem', fontFamily: "'DM Sans',sans-serif", transition: 'all 0.3s'
                            }}
                                onMouseEnter={e => { e.currentTarget.style.background = '#1A1A2E'; }}
                                onMouseLeave={e => { e.currentTarget.style.background = '#C8400A'; }}>
                                <i className={`fa ${isCheckout ? 'fa-box' : 'fa-calendar'}`} style={{ fontSize: 13 }}></i>
                                {isCheckout ? 'Track My Order' : 'My Bookings'}
                            </Link>
                            <Link to={isCheckout ? "/shop" : "/resturent"} style={{
                                display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 24px',
                                background: 'rgba(200,64,10,0.08)', color: '#C8400A', borderRadius: 50, textDecoration: 'none',
                                fontWeight: 700, fontSize: '0.88rem', fontFamily: "'DM Sans',sans-serif", border: '1.5px solid rgba(200,64,10,0.2)', transition: 'all 0.3s'
                            }}
                                onMouseEnter={e => { e.currentTarget.style.background = '#C8400A'; e.currentTarget.style.color = '#fff'; }}
                                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(200,64,10,0.08)'; e.currentTarget.style.color = '#C8400A'; }}>
                                <i className={`fa ${isCheckout ? 'fa-shopping-bag' : 'fa-utensils'}`} style={{ fontSize: 13 }}></i>
                                {isCheckout ? 'Shop More' : 'Book Again'}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            <style>{`@keyframes ripple{0%{opacity:1;transform:translate(-50%,-50%) scale(0.8)}100%{opacity:0;transform:translate(-50%,-50%) scale(1.6)}}`}</style>
        </>
    );
}