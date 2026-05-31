import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Profile({ title }) {
    const [data, setData] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            let response = await fetch(`${process.env.REACT_APP_BACKEND_SERVER}/api/user/${localStorage.getItem("userid")}`, {
                method: "GET",
                headers: {
                    "content-type": "application/json",
                    "authorization": localStorage.getItem("token")
                }
            });
            response = await response.json();
            if (response.data) setData(response.data);
            else navigate("/login");
        })();
    }, [navigate]);

    const isCheckout = title === "Checkout";

    const rowStyle = {
        display: 'flex',
        borderBottom: '1px solid rgba(200,64,10,0.08)',
        padding: '13px 0',
        alignItems: 'flex-start',
        gap: '12px'
    };

    const fields = [
        { label: 'Full Name', value: data.name, icon: 'fa-user' },
        ...(!isCheckout ? [{ label: 'Username', value: data.username, icon: 'fa-at' }] : []),
        { label: 'Email Address', value: data.email, icon: 'fa-envelope' },
        { label: 'Phone', value: data.phone, icon: 'fa-phone' },
        { label: 'Address', value: data.address, icon: 'fa-map-marker-alt' },
        { label: 'State', value: data.state, icon: 'fa-flag' },
        { label: 'City', value: data.city, icon: 'fa-city' },
        { label: 'PIN Code', value: data.pin, icon: 'fa-hashtag' },
    ];

    return (
        <>
            <style>{`
                .profile-layout {
                    display: flex;
                    gap: 28px;
                    flex-wrap: wrap;
                    align-items: flex-start;
                }

                /* ── Avatar card — Desktop ── */
                .profile-avatar-card {
                    flex: 0 0 240px;
                    background: #FFFBF7;
                    border-radius: 20px;
                    border: 1px solid rgba(200,64,10,0.12);
                    padding: 28px 20px;
                    box-shadow: 0 4px 20px rgba(28,16,9,0.07);
                    text-align: center;
                }
                .profile-avatar-img {
                    width: 140px;
                    height: 140px;
                    border-radius: 50%;
                    object-fit: cover;
                    border: 4px solid #fff;
                    box-shadow: 0 6px 20px rgba(200,64,10,0.18);
                }

                /* ── Avatar card — Tablet (≤991px) ── */
                @media (max-width: 991px) {
                    .profile-avatar-card {
                        flex: 0 0 100%;
                        display: flex;
                        align-items: center;
                        gap: 20px;
                        padding: 18px 20px;
                        text-align: left;
                    }
                    .profile-avatar-img-wrap {
                        flex-shrink: 0;
                    }
                    .profile-avatar-img {
                        width: 80px;
                        height: 80px;
                    }
                    .profile-avatar-badge {
                        width: 22px !important;
                        height: 22px !important;
                        bottom: 0px !important;
                        right: 0px !important;
                    }
                    .profile-avatar-badge i {
                        font-size: 8px !important;
                    }
                    .profile-avatar-info {
                        flex: 1;
                        min-width: 0;
                    }
                    .profile-avatar-name {
                        font-size: 1rem !important;
                        margin-bottom: 2px !important;
                    }
                    .profile-avatar-username {
                        margin-bottom: 10px !important;
                    }
                    .profile-avatar-location {
                        justify-content: flex-start !important;
                    }
                }

                /* ── Avatar card — Mobile (≤576px) ── */
                @media (max-width: 576px) {
                    .profile-avatar-card {
                        gap: 14px;
                        padding: 14px 16px;
                    }
                    .profile-avatar-img {
                        width: 64px;
                        height: 64px;
                    }
                    .profile-avatar-name {
                        font-size: 0.95rem !important;
                    }
                }

                /* ── Details card ── */
                .profile-details-card {
                    flex: 1;
                    min-width: 280px;
                    background: #FFFBF7;
                    border-radius: 20px;
                    border: 1px solid rgba(200,64,10,0.12);
                    padding: 28px;
                    box-shadow: 0 4px 20px rgba(28,16,9,0.07);
                }

                @media (max-width: 576px) {
                    .profile-details-card {
                        padding: 18px 16px;
                        min-width: 0;
                    }
                }
            `}</style>

            <div style={{ background: 'linear-gradient(135deg, #FDF6EE 0%, #FFF8F3 100%)', minHeight: '80vh', padding: '48px 16px' }}>
                <div style={{ maxWidth: isCheckout ? '600px' : '900px', margin: '0 auto' }}>

                    {/* Page Header */}
                    <div style={{ textAlign: 'center', marginBottom: '36px' }}>
                        <span style={{
                            display: 'inline-block',
                            background: 'rgba(200,64,10,0.1)',
                            color: '#C8400A',
                            fontSize: '0.78rem',
                            fontWeight: '700',
                            letterSpacing: '0.08em',
                            textTransform: 'uppercase',
                            padding: '5px 16px',
                            borderRadius: '50px',
                            marginBottom: '12px'
                        }}>
                            {isCheckout ? 'Checkout' : 'Account'}
                        </span>
                        <h2 style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: '2rem', fontWeight: '700',
                            color: '#1C1009', margin: '0 0 8px'
                        }}>
                            {isCheckout ? 'Billing Address' : 'My Profile'}
                        </h2>
                        <p style={{ color: '#7A6E65', fontSize: '0.9rem', margin: 0 }}>
                            {isCheckout ? 'Review your delivery details before placing the order' : 'Manage your personal information and preferences'}
                        </p>
                    </div>

                    <div className="profile-layout">

                        {/* ── Avatar Card ── */}
                        {!isCheckout && (
                            <div className="profile-avatar-card">
                                {/* Image wrap */}
                                <div className="profile-avatar-img-wrap" style={{ position: 'relative', display: 'inline-block' }}>
                                    <img
                                        src={data.pic || "/img/noimage.jpg"}
                                        alt="Profile"
                                        className="profile-avatar-img"
                                    />
                                    <div
                                        className="profile-avatar-badge"
                                        style={{
                                            position: 'absolute', bottom: '4px', right: '4px',
                                            width: '28px', height: '28px',
                                            background: '#C8400A', borderRadius: '50%',
                                            border: '3px solid #fff',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                                        }}
                                    >
                                        <i className="fa fa-check" style={{ color: '#fff', fontSize: '10px' }}></i>
                                    </div>
                                </div>

                                {/* Info */}
                                <div className="profile-avatar-info">
                                    <h5
                                        className="profile-avatar-name"
                                        style={{
                                            fontFamily: "'Playfair Display', serif",
                                            color: '#1C1009', fontWeight: '700',
                                            fontSize: '1.1rem', margin: '0 0 4px'
                                        }}
                                    >
                                        {data.name || '—'}
                                    </h5>
                                    <p
                                        className="profile-avatar-username"
                                        style={{ color: '#7A6E65', fontSize: '0.82rem', margin: '0 0 16px' }}
                                    >
                                        @{data.username || '—'}
                                    </p>
                                    <div
                                        className="profile-avatar-location"
                                        style={{
                                            background: 'rgba(200,64,10,0.08)',
                                            borderRadius: '10px',
                                            padding: '8px 12px',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '6px',
                                            color: '#C8400A',
                                            fontSize: '0.78rem',
                                            fontWeight: '600'
                                        }}
                                    >
                                        <i className="fa fa-map-marker-alt" style={{ fontSize: '11px' }}></i>
                                        {data.city || 'No city'}{data.state ? `, ${data.state}` : ''}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ── Details Card ── */}
                        <div className="profile-details-card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                <h6 style={{ margin: 0, fontWeight: '700', fontSize: '0.95rem', color: '#1C1009' }}>
                                    {isCheckout ? 'Delivery Details' : 'Personal Information'}
                                </h6>
                                <Link
                                    to="/update-profile"
                                    style={{
                                        display: 'inline-flex', alignItems: 'center', gap: '6px',
                                        background: 'rgba(200,64,10,0.08)', color: '#C8400A',
                                        padding: '7px 14px', borderRadius: '50px',
                                        fontSize: '0.8rem', fontWeight: '600',
                                        textDecoration: 'none', transition: 'all 0.2s'
                                    }}
                                    onMouseEnter={e => { e.currentTarget.style.background = '#C8400A'; e.currentTarget.style.color = '#fff'; }}
                                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(200,64,10,0.08)'; e.currentTarget.style.color = '#C8400A'; }}
                                >
                                    <i className="fa fa-pen" style={{ fontSize: '11px' }}></i>
                                    {isCheckout ? 'Update Address' : 'Edit Profile'}
                                </Link>
                            </div>

                            {fields.map(({ label, value, icon }) => (
                                <div key={label} style={rowStyle}>
                                    <div style={{
                                        width: '32px', height: '32px', flexShrink: 0,
                                        background: 'rgba(200,64,10,0.08)',
                                        borderRadius: '8px',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                                    }}>
                                        <i className={`fa ${icon}`} style={{ color: '#C8400A', fontSize: '12px' }}></i>
                                    </div>
                                    <div>
                                        <p style={{ margin: '0 0 2px', fontSize: '0.75rem', color: '#7A6E65', fontWeight: '500' }}>{label}</p>
                                        <p style={{ margin: 0, fontSize: '0.9rem', color: value ? '#1C1009' : '#B4B2A9', fontWeight: value ? '500' : '400' }}>
                                            {value || 'Not provided'}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}