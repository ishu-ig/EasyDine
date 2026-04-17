import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import HeroSection from '../Components/HeroSection'

export default function LoginPage() {
    let navigate = useNavigate()
    const [showPassword, setShowPassword] = useState(false);
    let [data, setData] = useState({ username: "", password: "" })
    let [errorMessage, setErrorMessage] = useState()

    function getInputData(e) {
        let { name, value } = e.target
        setErrorMessage("")
        setData((old) => ({ ...old, [name]: value }))
    }

    async function postData(e) {
        e.preventDefault()
        try {
            let response = await fetch(`${process.env.REACT_APP_BACKEND_SERVER}/api/user/login`, {
                method: "POST",
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ username: data.username, password: data.password })
            })
            response = await response.json()
            if (response.result === "Done" && response.data.active === false) {
                setErrorMessage("Your account is not active. Please contact us for more details.")
            } else if (response.result === "Done" && response.data.role === "Buyer") {
                localStorage.setItem("login", true)
                localStorage.setItem("name", response.data.name)
                localStorage.setItem("userid", response.data._id)
                localStorage.setItem("role", response.data.role)
                localStorage.setItem("token", response.token)
                if (response.data.address === "" || response.data.state === "" || response.data.pin === "" || response.data.phone === "" || response.data.name === "" || response.data.city === "")
                    navigate("/profile")
                else navigate("/")
            } else {
                setErrorMessage("Invalid username/email or password")
            }
        } catch (error) {
            alert("Internal Server Error")
        }
    }

    return (
        <>
            {/* <HeroSection title="Login" /> */}

            <div style={{
                minHeight: '80vh',
                background: 'linear-gradient(135deg, #FDF6EE 0%, #FFF8F3 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '60px 16px'
            }}>
                <div style={{ width: '100%', maxWidth: '440px' }}>

                    {/* Logo / Brand Mark */}
                    <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                        <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '56px', height: '56px',
                            background: '#C8400A',
                            borderRadius: '16px',
                            marginBottom: '16px',
                            boxShadow: '0 8px 24px rgba(200,64,10,0.25)'
                        }}>
                            <i className="fa fa-utensils" style={{ color: '#fff', fontSize: '22px' }}></i>
                        </div>
                        <h2 style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: '1.75rem',
                            fontWeight: '700',
                            color: '#1C1009',
                            margin: '0 0 6px'
                        }}>Welcome back</h2>
                        <p style={{ color: '#7A6E65', fontSize: '0.9rem', margin: 0 }}>
                            Sign in to continue your food journey
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
                            {/* Username */}
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', fontWeight: '600', fontSize: '0.85rem', color: '#1C1009', marginBottom: '8px', letterSpacing: '0.02em' }}>
                                    Username or Email
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#C8400A', fontSize: '14px' }}>
                                        <i className="fa fa-user"></i>
                                    </span>
                                    <input
                                        type="text"
                                        name="username"
                                        onChange={getInputData}
                                        placeholder="Enter your username or email"
                                        style={{
                                            width: '100%',
                                            padding: '12px 14px 12px 40px',
                                            border: `1.5px solid ${errorMessage ? '#E24B4A' : 'rgba(200,64,10,0.25)'}`,
                                            borderRadius: '10px',
                                            fontSize: '0.9rem',
                                            background: '#fff',
                                            color: '#1C1009',
                                            outline: 'none',
                                            transition: 'border-color 0.2s',
                                            boxSizing: 'border-box'
                                        }}
                                        onFocus={e => e.target.style.borderColor = '#C8400A'}
                                        onBlur={e => e.target.style.borderColor = errorMessage ? '#E24B4A' : 'rgba(200,64,10,0.25)'}
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', fontWeight: '600', fontSize: '0.85rem', color: '#1C1009', marginBottom: '8px', letterSpacing: '0.02em' }}>
                                    Password
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#C8400A', fontSize: '14px' }}>
                                        <i className="fa fa-lock"></i>
                                    </span>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        onChange={getInputData}
                                        placeholder="Enter your password"
                                        style={{
                                            width: '100%',
                                            padding: '12px 44px 12px 40px',
                                            border: `1.5px solid ${errorMessage ? '#E24B4A' : 'rgba(200,64,10,0.25)'}`,
                                            borderRadius: '10px',
                                            fontSize: '0.9rem',
                                            background: '#fff',
                                            color: '#1C1009',
                                            outline: 'none',
                                            transition: 'border-color 0.2s',
                                            boxSizing: 'border-box'
                                        }}
                                        onFocus={e => e.target.style.borderColor = '#C8400A'}
                                        onBlur={e => e.target.style.borderColor = errorMessage ? '#E24B4A' : 'rgba(200,64,10,0.25)'}
                                    />
                                    <span
                                        onClick={() => setShowPassword(!showPassword)}
                                        style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: '#7A6E65', fontSize: '14px' }}
                                    >
                                        <i className={`fa ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                                    </span>
                                </div>
                            </div>

                            {/* Error */}
                            {errorMessage && (
                                <div style={{
                                    background: '#FCEBEB',
                                    border: '1px solid rgba(226,75,74,0.3)',
                                    borderRadius: '10px',
                                    padding: '12px 14px',
                                    marginBottom: '16px',
                                    color: '#A32D2D',
                                    fontSize: '0.85rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                }}>
                                    <i className="fa fa-exclamation-circle"></i>
                                    {errorMessage}
                                </div>
                            )}

                            {/* Remember + Forgot */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.85rem', color: '#7A6E65' }}>
                                    <input type="checkbox" style={{ accentColor: '#C8400A', width: '15px', height: '15px' }} />
                                    Remember me
                                </label>
                                <Link to="/forgetPassword-1" style={{ color: '#C8400A', fontSize: '0.85rem', textDecoration: 'none', fontWeight: '500' }}>
                                    Forgot password?
                                </Link>
                            </div>

                            {/* Login Button */}
                            <button type="submit" style={{
                                width: '100%',
                                padding: '13px',
                                background: '#C8400A',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '50px',
                                fontSize: '0.95rem',
                                fontWeight: '700',
                                fontFamily: "'DM Sans', sans-serif",
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                letterSpacing: '0.02em',
                                marginBottom: '20px'
                            }}
                                onMouseEnter={e => { e.target.style.background = '#1A1A2E'; e.target.style.transform = 'translateY(-2px)' }}
                                onMouseLeave={e => { e.target.style.background = '#C8400A'; e.target.style.transform = 'translateY(0)' }}
                            >
                                Sign In
                            </button>

                            {/* Divider */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                                <div style={{ flex: 1, height: '1px', background: 'rgba(200,64,10,0.15)' }}></div>
                                <span style={{ color: '#7A6E65', fontSize: '0.8rem' }}>or continue with</span>
                                <div style={{ flex: 1, height: '1px', background: 'rgba(200,64,10,0.15)' }}></div>
                            </div>

                            {/* Social Buttons */}
                            <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
                                {[
                                    { icon: 'fab fa-google', label: 'Google' },
                                    { icon: 'fab fa-facebook-f', label: 'Facebook' }
                                ].map(({ icon, label }) => (
                                    <button key={label} type="button" style={{
                                        flex: 1,
                                        padding: '11px',
                                        background: '#fff',
                                        border: '1.5px solid rgba(200,64,10,0.2)',
                                        borderRadius: '10px',
                                        fontSize: '0.85rem',
                                        fontWeight: '600',
                                        color: '#1C1009',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '8px',
                                        transition: 'all 0.2s',
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

                            {/* Sign up link */}
                            <p style={{ textAlign: 'center', margin: 0, fontSize: '0.87rem', color: '#7A6E65' }}>
                                Don't have an account?{' '}
                                <Link to="/signup" style={{ color: '#C8400A', fontWeight: '600', textDecoration: 'none' }}>
                                    Sign up free
                                </Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}