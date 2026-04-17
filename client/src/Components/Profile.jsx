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

                <div style={{ display: 'flex', gap: '28px', flexWrap: 'wrap' }}>

                    {/* Profile Picture Card */}
                    {!isCheckout && (
                        <div style={{ flex: '0 0 240px' }}>
                            <div style={{
                                background: '#FFFBF7',
                                borderRadius: '20px',
                                border: '1px solid rgba(200,64,10,0.12)',
                                padding: '28px 20px',
                                boxShadow: '0 4px 20px rgba(28,16,9,0.07)',
                                textAlign: 'center'
                            }}>
                                <div style={{ position: 'relative', display: 'inline-block', marginBottom: '16px' }}>
                                    <img
                                        src={data?.pic ? `${process.env.REACT_APP_BACKEND_SERVER}/${data.pic}` : "/img/noimage.jpg"}
                                        alt="Profile"
                                        style={{
                                            width: '140px', height: '140px',
                                            borderRadius: '50%', objectFit: 'cover',
                                            border: '4px solid #fff',
                                            boxShadow: '0 6px 20px rgba(200,64,10,0.18)'
                                        }}
                                    />
                                    <div style={{
                                        position: 'absolute', bottom: '4px', right: '4px',
                                        width: '28px', height: '28px',
                                        background: '#C8400A', borderRadius: '50%',
                                        border: '3px solid #fff',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                                    }}>
                                        <i className="fa fa-check" style={{ color: '#fff', fontSize: '10px' }}></i>
                                    </div>
                                </div>
                                <h5 style={{
                                    fontFamily: "'Playfair Display', serif",
                                    color: '#1C1009', fontWeight: '700',
                                    fontSize: '1.1rem', margin: '0 0 4px'
                                }}>{data.name || '—'}</h5>
                                <p style={{ color: '#7A6E65', fontSize: '0.82rem', margin: '0 0 20px' }}>
                                    @{data.username || '—'}
                                </p>
                                <div style={{
                                    background: 'rgba(200,64,10,0.08)',
                                    borderRadius: '10px',
                                    padding: '10px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '6px',
                                    color: '#C8400A',
                                    fontSize: '0.8rem',
                                    fontWeight: '600'
                                }}>
                                    <i className="fa fa-map-marker-alt" style={{ fontSize: '12px' }}></i>
                                    {data.city || 'No city set'}{data.state ? `, ${data.state}` : ''}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Details Card */}
                    <div style={{ flex: 1, minWidth: '280px' }}>
                        <div style={{
                            background: '#FFFBF7',
                            borderRadius: '20px',
                            border: '1px solid rgba(200,64,10,0.12)',
                            padding: '28px',
                            boxShadow: '0 4px 20px rgba(28,16,9,0.07)'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                <h6 style={{ margin: 0, fontWeight: '700', fontSize: '0.95rem', color: '#1C1009' }}>
                                    {isCheckout ? 'Delivery Details' : 'Personal Information'}
                                </h6>
                                <Link to="/update-profile" style={{
                                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                                    background: 'rgba(200,64,10,0.08)', color: '#C8400A',
                                    padding: '7px 14px', borderRadius: '50px',
                                    fontSize: '0.8rem', fontWeight: '600',
                                    textDecoration: 'none', transition: 'all 0.2s'
                                }}
                                    onMouseEnter={e => { e.currentTarget.style.background = '#C8400A'; e.currentTarget.style.color = '#fff' }}
                                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(200,64,10,0.08)'; e.currentTarget.style.color = '#C8400A' }}
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
        </div>
    );
}