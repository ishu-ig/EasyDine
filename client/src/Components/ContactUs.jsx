import React, { useState } from 'react'
import HeroSection from '../Components/HeroSection'

const C = {
    primary: '#C8400A', primaryLight: 'rgba(200,64,10,0.08)',
    primaryBorder: 'rgba(200,64,10,0.18)', dark: '#1C1009', gray: '#7A6E65',
};

const infoCards = [
    { icon: 'fa-map-marker-alt', title: 'Visit Us', lines: ['123 Food Street', 'Mumbai, Maharashtra 400001'], link: null },
    { icon: 'fa-phone', title: 'Call Us', lines: ['+91 98765 43210', '+91 80123 45678'], link: 'tel:+919876543210' },
    { icon: 'fa-envelope', title: 'Email Us', lines: ['hello@eazydine.com', 'support@eazydine.com'], link: 'mailto:hello@eazydine.com' },
    { icon: 'fa-clock', title: 'Working Hours', lines: ['Mon – Sat: 9am – 10pm', 'Sunday: 10am – 8pm'], link: null },
];

export default function ContactUsPage() {
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
    const [submitted, setSubmitted] = useState(false);
    const [errors, setErrors] = useState({});

    function handleChange(e) {
        setFormData(old => ({ ...old, [e.target.name]: e.target.value }));
        setErrors(old => ({ ...old, [e.target.name]: '' }));
    }

    function handleSubmit(e) {
        e.preventDefault();
        const errs = {};
        if (!formData.name.trim()) errs.name = 'Name is required';
        if (!formData.email.trim()) errs.email = 'Email is required';
        if (!formData.message.trim()) errs.message = 'Message is required';
        if (Object.keys(errs).length) { setErrors(errs); return; }
        setSubmitted(true);
    }

    const inputStyle = (hasError) => ({
        width: '100%', padding: '12px 14px 12px 40px',
        border: `1.5px solid ${hasError ? '#E24B4A' : 'rgba(200,64,10,0.22)'}`,
        borderRadius: 10, fontSize: '0.9rem', background: '#fff', color: C.dark,
        outline: 'none', boxSizing: 'border-box', fontFamily: "'DM Sans',sans-serif",
        transition: 'border-color 0.2s'
    });

    return (
        <>
            {/* <HeroSection title="Contact Us" /> */}
            <div style={{ background: 'linear-gradient(135deg,#FDF6EE 0%,#FFF8F3 100%)', padding: '72px 16px' }}>
                <div style={{ maxWidth: 1080, margin: '0 auto' }}>

                    {/* Section Header */}
                    <div style={{ textAlign: 'center', marginBottom: 56 }}>
                        <span style={{ display: 'inline-block', background: C.primaryLight, color: C.primary, fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '5px 16px', borderRadius: 50, marginBottom: 14 }}>
                            Get In Touch
                        </span>
                        <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(1.75rem,4vw,2.5rem)', fontWeight: 700, color: C.dark, margin: '0 0 12px' }}>
                            We'd Love to Hear From You
                        </h2>
                        <p style={{ color: C.gray, fontSize: '0.95rem', maxWidth: 480, margin: '0 auto', lineHeight: 1.7 }}>
                            Have a question, feedback, or just want to say hi? Drop us a message and we'll get back to you within 24 hours.
                        </p>
                    </div>

                    {/* Info Cards */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 20, marginBottom: 48 }}>
                        {infoCards.map(({ icon, title, lines, link }) => (
                            <div key={title} style={{ background: '#FFFBF7', borderRadius: 16, border: '1px solid rgba(200,64,10,0.1)', padding: '24px 20px', textAlign: 'center', transition: 'all 0.3s', cursor: link ? 'pointer' : 'default' }}
                                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(200,64,10,0.12)'; }}
                                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
                                onClick={() => link && window.open(link)}>
                                <div style={{ width: 52, height: 52, background: C.primaryLight, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
                                    <i className={`fa ${icon}`} style={{ color: C.primary, fontSize: 20 }}></i>
                                </div>
                                <h6 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, color: C.dark, marginBottom: 8, fontSize: '0.95rem' }}>{title}</h6>
                                {lines.map(l => <p key={l} style={{ margin: '0 0 3px', color: C.gray, fontSize: '0.83rem' }}>{l}</p>)}
                            </div>
                        ))}
                    </div>

                    {/* Contact Form + Map */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28 }} className="contact-grid">

                        {/* Form */}
                        <div style={{ background: '#FFFBF7', borderRadius: 20, border: '1px solid rgba(200,64,10,0.12)', padding: '36px 32px', boxShadow: '0 8px 32px rgba(28,16,9,0.08)' }}>
                            {submitted ? (
                                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                                    <div style={{ width: 72, height: 72, background: '#C8400A', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', boxShadow: '0 8px 24px rgba(200,64,10,0.3)' }}>
                                        <i className="fa fa-check" style={{ color: '#fff', fontSize: 28 }}></i>
                                    </div>
                                    <h4 style={{ fontFamily: "'Playfair Display',serif", color: C.dark, marginBottom: 8 }}>Message Sent!</h4>
                                    <p style={{ color: C.gray, fontSize: '0.9rem', marginBottom: 20 }}>Thank you for reaching out. We'll get back to you soon.</p>
                                    <button onClick={() => { setSubmitted(false); setFormData({ name: '', email: '', subject: '', message: '' }); }}
                                        style={{ padding: '10px 24px', background: C.primaryLight, color: C.primary, border: 'none', borderRadius: 50, fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", fontSize: '0.85rem' }}>
                                        Send Another Message
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <h5 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, color: C.dark, marginBottom: 24, fontSize: '1.2rem' }}>Send a Message</h5>
                                    <form onSubmit={handleSubmit}>
                                        {/* Name */}
                                        <div style={{ marginBottom: 18 }}>
                                            <label style={{ display: 'block', fontWeight: 600, fontSize: '0.82rem', color: C.dark, marginBottom: 7, letterSpacing: '0.02em' }}>Full Name</label>
                                            <div style={{ position: 'relative' }}>
                                                <span style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: C.primary, fontSize: 13, pointerEvents: 'none' }}><i className="fa fa-user"></i></span>
                                                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Your full name" style={inputStyle(errors.name)}
                                                    onFocus={e => e.target.style.borderColor = C.primary}
                                                    onBlur={e => e.target.style.borderColor = errors.name ? '#E24B4A' : 'rgba(200,64,10,0.22)'}
                                                />
                                            </div>
                                            {errors.name && <p style={{ color: '#A32D2D', fontSize: '0.78rem', margin: '5px 0 0' }}>{errors.name}</p>}
                                        </div>

                                        {/* Email */}
                                        <div style={{ marginBottom: 18 }}>
                                            <label style={{ display: 'block', fontWeight: 600, fontSize: '0.82rem', color: C.dark, marginBottom: 7, letterSpacing: '0.02em' }}>Email Address</label>
                                            <div style={{ position: 'relative' }}>
                                                <span style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: C.primary, fontSize: 13, pointerEvents: 'none' }}><i className="fa fa-envelope"></i></span>
                                                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="your@email.com" style={inputStyle(errors.email)}
                                                    onFocus={e => e.target.style.borderColor = C.primary}
                                                    onBlur={e => e.target.style.borderColor = errors.email ? '#E24B4A' : 'rgba(200,64,10,0.22)'}
                                                />
                                            </div>
                                            {errors.email && <p style={{ color: '#A32D2D', fontSize: '0.78rem', margin: '5px 0 0' }}>{errors.email}</p>}
                                        </div>

                                        {/* Subject */}
                                        <div style={{ marginBottom: 18 }}>
                                            <label style={{ display: 'block', fontWeight: 600, fontSize: '0.82rem', color: C.dark, marginBottom: 7, letterSpacing: '0.02em' }}>Subject</label>
                                            <div style={{ position: 'relative' }}>
                                                <span style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: C.primary, fontSize: 13, pointerEvents: 'none' }}><i className="fa fa-tag"></i></span>
                                                <input type="text" name="subject" value={formData.subject} onChange={handleChange} placeholder="What is this about?" style={inputStyle(false)}
                                                    onFocus={e => e.target.style.borderColor = C.primary}
                                                    onBlur={e => e.target.style.borderColor = 'rgba(200,64,10,0.22)'}
                                                />
                                            </div>
                                        </div>

                                        {/* Message */}
                                        <div style={{ marginBottom: 24 }}>
                                            <label style={{ display: 'block', fontWeight: 600, fontSize: '0.82rem', color: C.dark, marginBottom: 7, letterSpacing: '0.02em' }}>Message</label>
                                            <div style={{ position: 'relative' }}>
                                                <span style={{ position: 'absolute', left: 13, top: 14, color: C.primary, fontSize: 13, pointerEvents: 'none' }}><i className="fa fa-comment"></i></span>
                                                <textarea name="message" value={formData.message} onChange={handleChange} placeholder="Tell us how we can help you…" rows={5}
                                                    style={{ ...inputStyle(errors.message), padding: '12px 14px 12px 40px', resize: 'none', lineHeight: 1.6 }}
                                                    onFocus={e => e.target.style.borderColor = C.primary}
                                                    onBlur={e => e.target.style.borderColor = errors.message ? '#E24B4A' : 'rgba(200,64,10,0.22)'}
                                                />
                                            </div>
                                            {errors.message && <p style={{ color: '#A32D2D', fontSize: '0.78rem', margin: '5px 0 0' }}>{errors.message}</p>}
                                        </div>

                                        <button type="submit" style={{ width: '100%', padding: 13, background: C.primary, color: '#fff', border: 'none', borderRadius: 50, fontSize: '0.95rem', fontWeight: 700, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'all 0.3s' }}
                                            onMouseEnter={e => { e.currentTarget.style.background = '#1A1A2E'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                                            onMouseLeave={e => { e.currentTarget.style.background = C.primary; e.currentTarget.style.transform = 'none'; }}>
                                            <i className="fa fa-paper-plane" style={{ fontSize: 14 }}></i>
                                            Send Message
                                        </button>
                                    </form>
                                </>
                            )}
                        </div>

                        {/* Map + Social */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                            {/* Map */}
                            <div style={{ background: '#FFFBF7', borderRadius: 20, border: '1px solid rgba(200,64,10,0.12)', overflow: 'hidden', flex: 1, boxShadow: '0 8px 32px rgba(28,16,9,0.08)', minHeight: 240 }}>
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3771.4!2d72.8!3d19.07!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTnCsDA0JzEyLjAiTiA3MsKwNDgnMDAuMCJF!5e0!3m2!1sen!2sin!4v1617000000000!5m2!1sen!2sin"
                                    width="100%" height="100%" style={{ border: 0, minHeight: 260, display: 'block' }}
                                    allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="EazyDine Location"
                                ></iframe>
                            </div>

                            {/* Social Links */}
                            <div style={{ background: '#FFFBF7', borderRadius: 20, border: '1px solid rgba(200,64,10,0.12)', padding: '24px 28px', boxShadow: '0 8px 32px rgba(28,16,9,0.08)' }}>
                                <h6 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, color: C.dark, marginBottom: 16, fontSize: '1rem' }}>Follow Us</h6>
                                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                                    {[
                                        { icon: 'fab fa-facebook-f', label: 'Facebook', url: '#' },
                                        { icon: 'fab fa-instagram', label: 'Instagram', url: '#' },
                                        { icon: 'fab fa-twitter', label: 'Twitter', url: '#' },
                                        { icon: 'fab fa-youtube', label: 'YouTube', url: '#' },
                                    ].map(({ icon, label, url }) => (
                                        <a key={label} href={url} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '9px 16px', background: C.primaryLight, color: C.primary, borderRadius: 50, textDecoration: 'none', fontSize: '0.82rem', fontWeight: 600, transition: 'all 0.2s', border: '1px solid rgba(200,64,10,0.12)' }}
                                            onMouseEnter={e => { e.currentTarget.style.background = C.primary; e.currentTarget.style.color = '#fff'; }}
                                            onMouseLeave={e => { e.currentTarget.style.background = C.primaryLight; e.currentTarget.style.color = C.primary; }}>
                                            <i className={icon} style={{ fontSize: 13 }}></i> {label}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <style>{`@media(max-width:680px){.contact-grid{grid-template-columns:1fr!important}}`}</style>
        </>
    )
}