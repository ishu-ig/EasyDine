import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import HeroSection from '../Components/HeroSection'

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600&family=JetBrains+Mono:wght@500&display=swap');

  .fp-page {
    min-height: 100vh;
    background: #f7f8f4;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px 16px;
    font-family: 'Sora', sans-serif;
  }

  .fp-card {
    background: #ffffff;
    border: 1px solid #e8e8e2;
    border-radius: 20px;
    padding: 40px 36px;
    width: 100%;
    max-width: 420px;
    box-shadow: 0 2px 24px rgba(0,0,0,0.06);
    animation: fpSlideUp 0.3s ease-out;
  }

  @keyframes fpSlideUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .fp-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: #eaf3de;
    color: #3b6d11;
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.07em;
    padding: 5px 10px;
    border-radius: 100px;
    margin-bottom: 20px;
  }

  .fp-badge-dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: #3b6d11;
    animation: fpPulse 2s infinite;
  }

  @keyframes fpPulse {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.3; }
  }

  .fp-title {
    font-size: 22px;
    font-weight: 600;
    color: #111;
    margin: 0 0 6px;
  }

  .fp-sub {
    font-size: 14px;
    color: #6b7280;
    margin: 0 0 24px;
    line-height: 1.6;
  }

  .fp-progress {
    display: flex;
    gap: 5px;
    margin-bottom: 28px;
  }

  .fp-seg {
    height: 3px;
    flex: 1;
    border-radius: 100px;
    background: #e8e8e2;
  }

  .fp-seg.on { background: #3b6d11; }

  .fp-label {
    display: block;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: #9ca3af;
    margin-bottom: 8px;
  }

  .fp-input-otp {
    width: 100%;
    padding: 14px;
    border: 1.5px solid #e2e2da;
    border-radius: 10px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 22px;
    font-weight: 500;
    letter-spacing: 0.3em;
    text-align: center;
    color: #111;
    background: #fafaf8;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
    box-sizing: border-box;
  }

  .fp-input-otp::placeholder {
    color: #c4c4bc;
    letter-spacing: 0.15em;
    font-size: 16px;
  }

  .fp-input-otp:focus {
    border-color: #639922;
    background: #fff;
    box-shadow: 0 0 0 3px rgba(99,153,34,0.12);
  }

  .fp-input-otp.fp-err { border-color: #d32f2f; background: #fff8f8; }

  .fp-error-msg {
    display: flex;
    align-items: center;
    gap: 5px;
    color: #d32f2f;
    font-size: 12px;
    margin-top: 7px;
  }

  .fp-hint {
    display: flex;
    gap: 8px;
    align-items: flex-start;
    background: #f7f8f4;
    border: 1px solid #e8e8e2;
    border-radius: 10px;
    padding: 12px 14px;
    margin-top: 16px;
  }

  .fp-hint-text {
    font-size: 12px;
    color: #6b7280;
    line-height: 1.55;
    margin: 0;
  }

  .fp-btn {
    width: 100%;
    padding: 13px;
    background: #3b6d11;
    border: none;
    border-radius: 10px;
    font-family: 'Sora', sans-serif;
    font-size: 14px;
    font-weight: 600;
    color: #fff;
    cursor: pointer;
    margin-top: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    transition: background 0.2s, transform 0.12s, box-shadow 0.2s;
  }

  .fp-btn:hover:not(:disabled) {
    background: #2f5a0d;
    box-shadow: 0 4px 16px rgba(59,109,17,0.25);
    transform: translateY(-1px);
  }

  .fp-btn:active:not(:disabled) { transform: translateY(0); }
  .fp-btn:disabled { opacity: 0.55; cursor: not-allowed; }

  .fp-spinner {
    width: 14px;
    height: 14px;
    border: 2px solid rgba(255,255,255,0.35);
    border-top-color: #fff;
    border-radius: 50%;
    animation: fpSpin 0.7s linear infinite;
  }

  @keyframes fpSpin { to { transform: rotate(360deg); } }
`

export default function ForgetPasswordPage2() {
  const navigate = useNavigate()
  const [otp, setOtp] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [loading, setLoading] = useState(false)

  function handleInput(e) {
    setOtp(e.target.value)
    setErrorMessage('')
  }

  async function postData(e) {
    e.preventDefault()
    setLoading(true)
    try {
      let res = await fetch(`${process.env.REACT_APP_BACKEND_SERVER}/api/user/forgetPassword-2`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ username: localStorage.getItem('reset-password-username'), otp }),
      })
      res = await res.json()
      if (res.result === 'Done') {
        navigate('/forgetPassword-3')
      } else {
        setErrorMessage(res.reason || 'Invalid or expired OTP.')
      }
    } catch {
      alert('Internal Server Error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <style>{styles}</style>
      <HeroSection title="Reset Password" />
      <div className="fp-page">
        <div className="fp-card">
          <div className="fp-badge">
            <div className="fp-badge-dot" />
            STEP 2 OF 3
          </div>
          <h2 className="fp-title">Enter the OTP</h2>
          <p className="fp-sub">We sent a one-time password to your registered email address.</p>

          <div className="fp-progress">
            <div className="fp-seg on" />
            <div className="fp-seg on" />
            <div className="fp-seg" />
          </div>

          <form onSubmit={postData}>
            <div>
              <label className="fp-label">One-time password</label>
              <input
                type="text"
                onChange={handleInput}
                placeholder="— — — — — —"
                maxLength={6}
                className={`fp-input-otp${errorMessage ? ' fp-err' : ''}`}
              />
              {errorMessage && (
                <p className="fp-error-msg">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <circle cx="6" cy="6" r="5.5" stroke="#d32f2f" />
                    <path d="M6 3.5v3M6 8.5v.3" stroke="#d32f2f" strokeWidth="1.2" strokeLinecap="round" />
                  </svg>
                  {errorMessage}
                </p>
              )}
            </div>

            <div className="fp-hint">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
                <circle cx="7" cy="7" r="6.5" stroke="#9ca3af" />
                <path d="M7 6.5v4M7 4.5v.5" stroke="#9ca3af" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
              <p className="fp-hint-text">
                Didn't receive it? Check your spam folder or go back to request a new code.
              </p>
            </div>

            <button type="submit" className="fp-btn" disabled={loading}>
              {loading ? (
                <><div className="fp-spinner" /> Verifying…</>
              ) : (
                <>
                  Verify OTP
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M3 7h8M8 4l3 3-3 3" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </>
  )
}