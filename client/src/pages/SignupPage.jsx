import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import HeroSection from '../Components/HeroSection'
import formValidator from '../FormValidators/formValidator'

export default function SignupPage() {
    let navigate = useNavigate()
    let [data, setData] = useState({ name: "", username: "", email: "", phone: "", password: "", cpassword: "" })
    let [errorMessage, setErrorMessage] = useState({
        name: "Name field is mandatory",
        email: "Email field is mandatory",
        username: "Username field is mandatory",
        phone: "Phone field is mandatory",
        password: "Password field is mandatory"
    })
    let [show, setShow] = useState(false)
    let [showPassword, setShowPassword] = useState(false)
    let [showConfirmPassword, setShowConfirmPassword] = useState(false)

    function getInputData(e) {
        let { name, value } = e.target
        setErrorMessage(old => ({ ...old, [name]: formValidator(e) }))
        setData(old => ({ ...old, [name]: value }))
    }

    async function postData(e) {
        e.preventDefault()
        if (data.password === data.cpassword) {
            let error = Object.values(errorMessage).find(x => x !== "")
            if (error) setShow(true)
            else {
                try {
                    let response = await fetch(`${process.env.REACT_APP_BACKEND_SERVER}/api/user`, {
                        method: "POST",
                        headers: { "content-type": "application/json" },
                        body: JSON.stringify({ name: data.name, username: data.username, email: data.email, phone: data.phone, password: data.password, role: "Buyer", active: true })
                    })
                    response = await response.json()
                    if (response.result === "Done") navigate("/login")
                    else {
                        setShow(true)
                        setErrorMessage(old => ({ ...old, "username": response.reason?.username ?? "", "email": response.reason?.email ?? "" }))
                    }
                } catch (error) {
                    alert("Internal Server Error")
                }
            }
        } else {
            setShow(true)
            setErrorMessage(old => ({ ...old, "password": "Password and confirm password do not match" }))
        }
    }

    const inputStyle = (hasError) => ({
        width: '100%',
        padding: '11px 14px 11px 40px',
        border: `1.5px solid ${show && hasError ? '#E24B4A' : 'rgba(200,64,10,0.22)'}`,
        borderRadius: '10px',
        fontSize: '0.88rem',
        background: '#fff',
        color: '#1C1009',
        outline: 'none',
        boxSizing: 'border-box',
        fontFamily: "'DM Sans', sans-serif"
    })

    const labelStyle = {
        display: 'block',
        fontWeight: '600',
        fontSize: '0.82rem',
        color: '#1C1009',
        marginBottom: '7px',
        letterSpacing: '0.02em'
    }

    const fieldWrap = { marginBottom: '18px' }

    const iconWrap = {
        position: 'absolute', left: '13px', top: '50%',
        transform: 'translateY(-50%)', color: '#C8400A', fontSize: '13px', pointerEvents: 'none'
    }

    return (
        <>
            {/* <HeroSection title="Sign Up" /> */}

            <div style={{
                minHeight: '80vh',
                background: 'linear-gradient(135deg, #FDF6EE 0%, #FFF8F3 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '60px 16px'
            }}>
                <div style={{ width: '100%', maxWidth: '600px' }}>

                    {/* Header */}
                    <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                        <div style={{
                            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                            width: '56px', height: '56px', background: '#C8400A',
                            borderRadius: '16px', marginBottom: '16px',
                            boxShadow: '0 8px 24px rgba(200,64,10,0.25)'
                        }}>
                            <i className="fa fa-utensils" style={{ color: '#fff', fontSize: '22px' }}></i>
                        </div>
                        <h2 style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: '1.75rem', fontWeight: '700',
                            color: '#1C1009', margin: '0 0 6px'
                        }}>Create your account</h2>
                        <p style={{ color: '#7A6E65', fontSize: '0.9rem', margin: 0 }}>
                            Join EazyDine and get fresh food delivered to your door
                        </p>
                    </div>

                    {/* Card */}
                    <div style={{
                        background: '#FFFBF7',
                        borderRadius: '20px',
                        border: '1px solid rgba(200,64,10,0.12)',
                        padding: '36px 32px',
                        boxShadow: '0 8px 32px rgba(28,16,9,0.10)'
                    }}>
                        <form onSubmit={postData}>

                            {/* Row 1: Name + Username */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div style={fieldWrap}>
                                    <label style={labelStyle}>Full Name</label>
                                    <div style={{ position: 'relative' }}>
                                        <span style={iconWrap}><i className="fa fa-user"></i></span>
                                        <input type="text" name="name" placeholder="Your name" onChange={getInputData}
                                            style={inputStyle(errorMessage.name)}
                                            onFocus={e => e.target.style.borderColor = '#C8400A'}
                                            onBlur={e => e.target.style.borderColor = show && errorMessage.name ? '#E24B4A' : 'rgba(200,64,10,0.22)'}
                                        />
                                    </div>
                                    {show && errorMessage.name && <p style={{ color: '#A32D2D', fontSize: '0.78rem', marginTop: '5px', margin: '5px 0 0' }}>{errorMessage.name}</p>}
                                </div>
                                <div style={fieldWrap}>
                                    <label style={labelStyle}>Username</label>
                                    <div style={{ position: 'relative' }}>
                                        <span style={iconWrap}><i className="fa fa-at"></i></span>
                                        <input type="text" name="username" placeholder="Username" onChange={getInputData}
                                            style={inputStyle(errorMessage.username)}
                                            onFocus={e => e.target.style.borderColor = '#C8400A'}
                                            onBlur={e => e.target.style.borderColor = show && errorMessage.username ? '#E24B4A' : 'rgba(200,64,10,0.22)'}
                                        />
                                    </div>
                                    {show && errorMessage.username && <p style={{ color: '#A32D2D', fontSize: '0.78rem', margin: '5px 0 0' }}>{errorMessage.username}</p>}
                                </div>
                            </div>

                            {/* Row 2: Email + Phone */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div style={fieldWrap}>
                                    <label style={labelStyle}>Email Address</label>
                                    <div style={{ position: 'relative' }}>
                                        <span style={iconWrap}><i className="fa fa-envelope"></i></span>
                                        <input type="email" name="email" placeholder="you@example.com" onChange={getInputData}
                                            style={inputStyle(errorMessage.email)}
                                            onFocus={e => e.target.style.borderColor = '#C8400A'}
                                            onBlur={e => e.target.style.borderColor = show && errorMessage.email ? '#E24B4A' : 'rgba(200,64,10,0.22)'}
                                        />
                                    </div>
                                    {show && errorMessage.email && <p style={{ color: '#A32D2D', fontSize: '0.78rem', margin: '5px 0 0' }}>{errorMessage.email}</p>}
                                </div>
                                <div style={fieldWrap}>
                                    <label style={labelStyle}>Contact Number</label>
                                    <div style={{ position: 'relative' }}>
                                        <span style={iconWrap}><i className="fa fa-phone"></i></span>
                                        <input type="number" name="phone" placeholder="Phone number" onChange={getInputData}
                                            style={inputStyle(errorMessage.phone)}
                                            onFocus={e => e.target.style.borderColor = '#C8400A'}
                                            onBlur={e => e.target.style.borderColor = show && errorMessage.phone ? '#E24B4A' : 'rgba(200,64,10,0.22)'}
                                        />
                                    </div>
                                    {show && errorMessage.phone && <p style={{ color: '#A32D2D', fontSize: '0.78rem', margin: '5px 0 0' }}>{errorMessage.phone}</p>}
                                </div>
                            </div>

                            {/* Row 3: Password + Confirm */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div style={fieldWrap}>
                                    <label style={labelStyle}>Password</label>
                                    <div style={{ position: 'relative' }}>
                                        <span style={iconWrap}><i className="fa fa-lock"></i></span>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="password" placeholder="Create password" onChange={getInputData}
                                            style={{ ...inputStyle(errorMessage.password), paddingRight: '40px' }}
                                            onFocus={e => e.target.style.borderColor = '#C8400A'}
                                            onBlur={e => e.target.style.borderColor = show && errorMessage.password ? '#E24B4A' : 'rgba(200,64,10,0.22)'}
                                        />
                                        <span onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '13px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: '#7A6E65', fontSize: '13px' }}>
                                            <i className={`fa ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                                        </span>
                                    </div>
                                    {show && errorMessage.password && <p style={{ color: '#A32D2D', fontSize: '0.78rem', margin: '5px 0 0' }}>{errorMessage.password}</p>}
                                </div>
                                <div style={fieldWrap}>
                                    <label style={labelStyle}>Confirm Password</label>
                                    <div style={{ position: 'relative' }}>
                                        <span style={iconWrap}><i className="fa fa-lock"></i></span>
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            name="cpassword" placeholder="Repeat password" onChange={getInputData}
                                            style={{ ...inputStyle(false), paddingRight: '40px' }}
                                            onFocus={e => e.target.style.borderColor = '#C8400A'}
                                            onBlur={e => e.target.style.borderColor = 'rgba(200,64,10,0.22)'}
                                        />
                                        <span onClick={() => setShowConfirmPassword(!showConfirmPassword)} style={{ position: 'absolute', right: '13px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: '#7A6E65', fontSize: '13px' }}>
                                            <i className={`fa ${showConfirmPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Remember me */}
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.85rem', color: '#7A6E65', marginBottom: '24px' }}>
                                <input type="checkbox" style={{ accentColor: '#C8400A', width: '15px', height: '15px' }} />
                                I agree to the <Link to="#" style={{ color: '#C8400A', fontWeight: '600', textDecoration: 'none' }}>Terms of Service</Link>
                            </label>

                            {/* Submit */}
                            <button type="submit" style={{
                                width: '100%', padding: '13px',
                                background: '#C8400A', color: '#fff',
                                border: 'none', borderRadius: '50px',
                                fontSize: '0.95rem', fontWeight: '700',
                                fontFamily: "'DM Sans', sans-serif",
                                cursor: 'pointer', marginBottom: '20px',
                                letterSpacing: '0.02em'
                            }}
                                onMouseEnter={e => { e.target.style.background = '#1A1A2E'; e.target.style.transform = 'translateY(-2px)' }}
                                onMouseLeave={e => { e.target.style.background = '#C8400A'; e.target.style.transform = 'translateY(0)' }}
                            >
                                Create Account
                            </button>

                            {/* Divider */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                                <div style={{ flex: 1, height: '1px', background: 'rgba(200,64,10,0.15)' }}></div>
                                <span style={{ color: '#7A6E65', fontSize: '0.8rem' }}>or sign up with</span>
                                <div style={{ flex: 1, height: '1px', background: 'rgba(200,64,10,0.15)' }}></div>
                            </div>

                            {/* Social */}
                            <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
                                {[{ icon: 'fab fa-google', label: 'Google' }, { icon: 'fab fa-facebook-f', label: 'Facebook' }].map(({ icon, label }) => (
                                    <button key={label} type="button" style={{
                                        flex: 1, padding: '11px',
                                        background: '#fff', border: '1.5px solid rgba(200,64,10,0.2)',
                                        borderRadius: '10px', fontSize: '0.85rem', fontWeight: '600',
                                        color: '#1C1009', cursor: 'pointer',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                        fontFamily: "'DM Sans', sans-serif"
                                    }}
                                        onMouseEnter={e => { e.currentTarget.style.borderColor = '#C8400A'; e.currentTarget.style.background = '#FDF6EE' }}
                                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(200,64,10,0.2)'; e.currentTarget.style.background = '#fff' }}
                                    >
                                        <i className={icon} style={{ color: '#C8400A', fontSize: '14px' }}></i>
                                        {label}
                                    </button>
                                ))}
                            </div>

                            <p style={{ textAlign: 'center', margin: 0, fontSize: '0.87rem', color: '#7A6E65' }}>
                                Already have an account?{' '}
                                <Link to="/login" style={{ color: '#C8400A', fontWeight: '600', textDecoration: 'none' }}>Sign in</Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}