import React from 'react'

export default function About({ title }) {
    const isPage = title === "About Us";

    return (
        <>
            {/* About Section */}
            <div style={{ padding: '80px 0', background: isPage ? 'linear-gradient(135deg, #FDF6EE 0%, #FFF8F3 100%)' : '#fff' }}>
                <div className="container">
                    <div className="row g-5 align-items-center">

                        {/* Image Column */}
                        <div className="col-lg-6 wow fadeIn" data-wow-delay="0.1s">
                            <div style={{ position: 'relative', padding: '20px 20px 20px 0' }}>
                                {/* Decorative background block */}
                                <div style={{
                                    position: 'absolute',
                                    top: 0, left: 0,
                                    width: '75%', height: '85%',
                                    background: 'rgba(200,64,10,0.07)',
                                    borderRadius: '20px',
                                    zIndex: 0
                                }}></div>

                                <img
                                    className="img-fluid"
                                    src="img/a1.jpg"
                                    alt="Fresh food delivery"
                                    style={{
                                        borderRadius: '16px',
                                        position: 'relative',
                                        zIndex: 1,
                                        boxShadow: '0 20px 60px rgba(28,16,9,0.15)',
                                        width: '100%',
                                        objectFit: 'cover',
                                        maxHeight: '420px'
                                    }}
                                />

                                {/* Floating badge */}
                                <div style={{
                                    position: 'absolute',
                                    bottom: '30px',
                                    right: '0px',
                                    background: '#C8400A',
                                    color: '#fff',
                                    borderRadius: '16px',
                                    padding: '16px 20px',
                                    zIndex: 2,
                                    boxShadow: '0 8px 24px rgba(200,64,10,0.35)',
                                    textAlign: 'center',
                                    minWidth: '100px'
                                }}>
                                    <p style={{ margin: '0 0 2px', fontSize: '1.6rem', fontWeight: '800', fontFamily: "'Playfair Display', serif", lineHeight: 1 }}>10+</p>
                                    <p style={{ margin: 0, fontSize: '0.72rem', fontWeight: '600', opacity: 0.9, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Years of<br />Excellence</p>
                                </div>
                            </div>
                        </div>

                        {/* Text Column */}
                        <div className="col-lg-6 wow fadeIn" data-wow-delay="0.5s">
                            {/* Eyebrow label */}
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
                                marginBottom: '16px'
                            }}>
                                About EazyDine
                            </span>

                            <h2 style={{
                                fontFamily: "'Playfair Display', serif",
                                fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
                                fontWeight: '700',
                                color: '#1C1009',
                                lineHeight: '1.25',
                                marginBottom: '20px'
                            }}>
                                We Provide Best Fresh Food To Your Door Steps
                            </h2>

                            <p style={{ color: '#7A6E65', lineHeight: '1.8', marginBottom: '28px', fontSize: '0.95rem' }}>
                                Tempor erat elitr rebum at clita. Diam dolor diam ipsum sit. Aliqu diam amet diam et eos. Clita erat ipsum et lorem et sit, sed stet lorem sit clita duo justo magna dolore erat amet.
                            </p>

                            {/* Feature list */}
                            <div style={{ marginBottom: '32px' }}>
                                {[
                                    { icon: 'fa-seedling', label: 'Best Quality Food', desc: 'Farm-fresh ingredients, carefully sourced daily.' },
                                    { icon: 'fa-bolt', label: 'On Time Delivery', desc: 'Your order arrives hot and on schedule — always.' },
                                    { icon: 'fa-headset', label: 'Customer Support', desc: '24/7 dedicated support for every order.' }
                                ].map(({ icon, label, desc }) => (
                                    <div key={label} style={{
                                        display: 'flex',
                                        gap: '16px',
                                        alignItems: 'flex-start',
                                        marginBottom: '18px'
                                    }}>
                                        <div style={{
                                            width: '44px', height: '44px', flexShrink: 0,
                                            background: 'rgba(200,64,10,0.1)',
                                            borderRadius: '12px',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                                        }}>
                                            <i className={`fa ${icon}`} style={{ color: '#C8400A', fontSize: '16px' }}></i>
                                        </div>
                                        <div>
                                            <p style={{ margin: '0 0 2px', fontWeight: '600', fontSize: '0.95rem', color: '#1C1009' }}>{label}</p>
                                            <p style={{ margin: 0, fontSize: '0.85rem', color: '#7A6E65' }}>{desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {!isPage && (
                                <a
                                    href="/about"
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '10px',
                                        background: '#C8400A',
                                        color: '#fff',
                                        padding: '13px 28px',
                                        borderRadius: '50px',
                                        fontWeight: '700',
                                        fontSize: '0.9rem',
                                        textDecoration: 'none',
                                        fontFamily: "'DM Sans', sans-serif",
                                        boxShadow: '0 8px 20px rgba(200,64,10,0.28)',
                                        transition: 'all 0.3s ease'
                                    }}
                                    onMouseEnter={e => { e.currentTarget.style.background = '#1A1A2E'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                                    onMouseLeave={e => { e.currentTarget.style.background = '#C8400A'; e.currentTarget.style.transform = 'translateY(0)' }}
                                >
                                    Read More
                                    <i className="fa fa-arrow-right" style={{ fontSize: '13px' }}></i>
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}