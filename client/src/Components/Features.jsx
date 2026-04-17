import React from 'react'

const features = [
    {
        icon: 'fa-truck',
        title: 'Free Delivery',
        desc: 'Enjoy free delivery on select restaurants and orders above a certain amount.',
        color: '#C8400A'
    },
    {
        icon: 'fa-bicycle',
        title: 'Express & Fast Delivery',
        desc: 'Get your food delivered quickly with express delivery options.',
        color: '#E86834'
    },
    {
        icon: 'fa-clock',
        title: '24/7 Food Availability',
        desc: 'Order anytime, day or night, from 24/7 open restaurants.',
        color: '#C8400A'
    },
    {
        icon: 'fa-leaf',
        title: 'Eco-Friendly Packaging',
        desc: 'Restaurants use biodegradable and sustainable packaging for deliveries.',
        color: '#E86834'
    },
    {
        icon: 'fa-map-marker-alt',
        title: 'Multiple Address Support',
        desc: 'Save and manage multiple delivery addresses for easy ordering.',
        color: '#C8400A'
    },
    {
        icon: 'fa-edit',
        title: 'Customizable Orders',
        desc: 'Modify ingredients, spice levels, or portion sizes as per your preference.',
        color: '#E86834'
    }
]

export default function Features() {
    return (
        <>
            {/* Features Section */}
            <div style={{
                padding: '80px 0',
                background: 'linear-gradient(135deg, #FDF6EE 0%, #FFF8F3 100%)'
            }} className="bg-icon">
                <div className="container">

                    {/* Section Header */}
                    <div style={{ textAlign: 'center', maxWidth: '520px', margin: '0 auto 56px' }} className="wow fadeInUp" data-wow-delay="0.1s">
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
                            marginBottom: '14px'
                        }}>
                            Why Choose Us
                        </span>
                        <h2 style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: 'clamp(1.75rem, 3vw, 2.4rem)',
                            fontWeight: '700',
                            color: '#1C1009',
                            marginBottom: '14px',
                            lineHeight: '1.25'
                        }}>
                            Our Features
                        </h2>
                        <p style={{ color: '#7A6E65', fontSize: '0.95rem', lineHeight: '1.7', margin: 0 }}>
                            Tempor ut dolore lorem kasd vero ipsum sit eirmod sit. Ipsum diam justo sed rebum vero dolor duo.
                        </p>
                    </div>

                    {/* Feature Cards Grid */}
                    <div className="row g-4">
                        {features.map(({ icon, title, desc }, idx) => (
                            <div key={title} className={`col-lg-4 col-md-6 wow fadeInUp`} data-wow-delay={`${0.1 + (idx % 3) * 0.2}s`}>
                                <div
                                    className="feature-card-custom"
                                    style={{
                                        background: '#FFFBF7',
                                        borderRadius: '20px',
                                        border: '1px solid rgba(200,64,10,0.10)',
                                        padding: '32px 28px',
                                        height: '100%',
                                        transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                                        cursor: 'default',
                                        position: 'relative',
                                        overflow: 'hidden'
                                    }}
                                    onMouseEnter={e => {
                                        const el = e.currentTarget;
                                        el.style.transform = 'translateY(-10px)';
                                        el.style.boxShadow = '0 20px 60px rgba(200,64,10,0.15)';
                                        el.style.background = '#C8400A';
                                        el.style.borderColor = 'transparent';
                                        el.querySelectorAll('.feat-icon').forEach(i => i.style.color = '#fff');
                                        el.querySelectorAll('.feat-icon-wrap').forEach(i => { i.style.background = 'rgba(255,255,255,0.18)' });
                                        el.querySelectorAll('.feat-title').forEach(i => i.style.color = '#fff');
                                        el.querySelectorAll('.feat-desc').forEach(i => i.style.color = 'rgba(255,255,255,0.82)');
                                        el.querySelectorAll('.feat-link').forEach(i => { i.style.color = '#fff'; i.style.borderColor = 'rgba(255,255,255,0.4)' });
                                    }}
                                    onMouseLeave={e => {
                                        const el = e.currentTarget;
                                        el.style.transform = 'translateY(0)';
                                        el.style.boxShadow = 'none';
                                        el.style.background = '#FFFBF7';
                                        el.style.borderColor = 'rgba(200,64,10,0.10)';
                                        el.querySelectorAll('.feat-icon').forEach(i => i.style.color = '#C8400A');
                                        el.querySelectorAll('.feat-icon-wrap').forEach(i => { i.style.background = 'rgba(200,64,10,0.10)' });
                                        el.querySelectorAll('.feat-title').forEach(i => i.style.color = '#1C1009');
                                        el.querySelectorAll('.feat-desc').forEach(i => i.style.color = '#7A6E65');
                                        el.querySelectorAll('.feat-link').forEach(i => { i.style.color = '#C8400A'; i.style.borderColor = 'rgba(200,64,10,0.25)' });
                                    }}
                                >
                                    {/* Icon */}
                                    <div className="feat-icon-wrap" style={{
                                        width: '64px', height: '64px',
                                        background: 'rgba(200,64,10,0.10)',
                                        borderRadius: '16px',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        marginBottom: '20px',
                                        transition: 'background 0.35s'
                                    }}>
                                        <i className={`fa ${icon} feat-icon`} style={{ fontSize: '26px', color: '#C8400A', transition: 'color 0.35s' }}></i>
                                    </div>

                                    {/* Title */}
                                    <h5 className="feat-title" style={{
                                        fontFamily: "'Playfair Display', serif",
                                        fontSize: '1.1rem', fontWeight: '700',
                                        color: '#1C1009', marginBottom: '10px',
                                        transition: 'color 0.35s'
                                    }}>
                                        {title}
                                    </h5>

                                    {/* Description */}
                                    <p className="feat-desc" style={{
                                        color: '#7A6E65', fontSize: '0.88rem',
                                        lineHeight: '1.7', marginBottom: '20px',
                                        transition: 'color 0.35s'
                                    }}>
                                        {desc}
                                    </p>

                                    {/* CTA Link */}
                                    <a
                                        href="#"
                                        className="feat-link"
                                        style={{
                                            display: 'inline-flex', alignItems: 'center', gap: '7px',
                                            color: '#C8400A', fontSize: '0.82rem', fontWeight: '700',
                                            textDecoration: 'none',
                                            border: '1.5px solid rgba(200,64,10,0.25)',
                                            padding: '7px 16px', borderRadius: '50px',
                                            transition: 'all 0.35s',
                                            fontFamily: "'DM Sans', sans-serif"
                                        }}
                                    >
                                        Read More
                                        <i className="fa fa-arrow-right" style={{ fontSize: '10px' }}></i>
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}