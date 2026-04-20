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

  .fp-field { margin-bottom: 18px; }

  .fp-label {
    display: block;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: #9ca3af;
    margin-bottom: 8px;
  }

  .fp-pw-wrap { position: relative; }

  .fp-input {
    width: 100%;
    padding: 12px 44px 12px 14px;
    border: 1.5px solid #e2e2da;
    border-radius: 10px;
    font-family: 'Sora', sans-serif;
    font-size: 14px;
    color: #111;
    background: #fafaf8;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
    box-sizing: border-box;
  }

  .fp-input::placeholder { color: #c4c4bc; }

  .fp-input:focus {
    border-color: #639922;
    background: #fff;
    box-shadow: 0 0 0 3px rgba(99,153,34,0.12);
  }

  .fp-input.fp-err { border-color: #d32f2f; background: #fff8f8; }

  .fp-eye {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
    color: #9ca3af;
    padding: 4px;
    display: flex;
    align-items: center;
    transition: color 0.15s;
  }

  .fp-eye:hover { color: #444; }

  .str-bar {
    display: flex;
    gap: 4px;
    margin-top: 8px;
  }

  .str-seg {
    height: 3px;
    flex: 1;
    border-radius: 100px;
    background: #e8e8e2;
    transition: background 0.3s;
  }

  .str-label {
    font-size: 11px;
    font-weight: 600;
    margin-top: 5px;
    min-height: 16px;
    letter-spacing: 0.04em;
  }

  .fp-error-msg {
    display: flex;
    align-items: center;
    gap: 5px;
    color: #d32f2f;
    font-size: 12px;
    margin-top: 7px;
  }

  .fp-divider {
    height: 1px;
    background: #f0f0ea;
    margin: 20px 0;
  }

  .fp-check-row {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
  }

  .fp-check-row input[type=checkbox] {
    width: 15px;
    height: 15px;
    accent-color: #3b6d11;
    cursor: pointer;
    flex-shrink: 0;
  }

  .fp-check-label {
    font-size: 13px;
    color: #6b7280;
    cursor: pointer;
    user-select: none;
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

const STR_COLORS = ['', '#d32f2f', '#e65100', '#f9a825', '#2e7d32']
const STR_LABELS = ['', 'Weak', 'Fair', 'Good', 'Strong']

function getStrength(p) {
  if (!p) return 0
  let s = 0
  if (p.length >= 8) s++
  if (/[A-Z]/.test(p)) s++
  if (/[0-9]/.test(p)) s++
  if (/[^A-Za-z0-9]/.test(p)) s++
  return s
}

export default function ForgetPasswordPage3() {
  const navigate = useNavigate()
  const [showPw, setShowPw] = useState(false)
  const [showCpw, setShowCpw] = useState(false)
  const [data, setData] = useState({ password: '', cpassword: '' })
  const [errorMessage, setErrorMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const strength = getStrength(data.password)

  function handleInput(e) {
    const { name, value } = e.target
    setErrorMessage('')
    setData(old => ({ ...old, [name]: value }))
  }

  async function postData(e) {
    e.preventDefault()
    if (data.password !== data.cpassword) {
      setErrorMessage("Passwords don't match. Please try again.")
      return
    }
    setLoading(true)
    try {
      let res = await fetch(`${process.env.REACT_APP_BACKEND_SERVER}/api/user/forgetPassword-3`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ username: localStorage.getItem('reset-password-username'), password: data.password }),
      })
      res = await res.json()
      if (res.result === 'Done') {
        localStorage.removeItem('reset-password-username')
        navigate('/login')
      } else {
        setErrorMessage(res.reason)
      }
    } catch {
      alert('Internal Server Error')
    } finally {
      setLoading(false)
    }
  }

  const EyeIcon = ({ visible }) => visible
    ? <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 2l12 12M6.5 6.7A2 2 0 0 0 9.3 9.5M4 4.7C2.5 5.8 1.5 7.5 1.5 8S4 13 8 13c1.2 0 2.3-.3 3.2-.8M7 3.1C7.3 3 7.7 3 8 3c4 0 6.5 4.5 6.5 5a8 8 0 0 1-1.5 2.2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></svg>
    : <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5Z" stroke="currentColor" strokeWidth="1.2" /><circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.2" /></svg>

  return (
    <>
      <style>{styles}</style>
      <HeroSection title="Reset Password" />
      <div className="fp-page">
        <div className="fp-card">
          <div className="fp-badge">
            <div className="fp-badge-dot" />
            STEP 3 OF 3
          </div>
          <h2 className="fp-title">Set new password</h2>
          <p className="fp-sub">Choose a strong password you haven't used before.</p>

          <div className="fp-progress">
            <div className="fp-seg on" />
            <div className="fp-seg on" />
            <div className="fp-seg on" />
          </div>

          <form onSubmit={postData}>
            <div className="fp-field">
              <label className="fp-label">New password</label>
              <div className="fp-pw-wrap">
                <input
                  type={showPw ? 'text' : 'password'}
                  name="password"
                  onChange={handleInput}
                  placeholder="Enter new password"
                  className="fp-input"
                  required
                />
                <button type="button" className="fp-eye" onClick={() => setShowPw(p => !p)}>
                  <EyeIcon visible={showPw} />
                </button>
              </div>
              {data.password && (
                <>
                  <div className="str-bar">
                    {[1, 2, 3, 4].map(i => (
                      <div
                        key={i}
                        className="str-seg"
                        style={{ background: i <= strength ? STR_COLORS[strength] : undefined }}
                      />
                    ))}
                  </div>
                  <p className="str-label" style={{ color: STR_COLORS[strength] }}>
                    {STR_LABELS[strength]}
                  </p>
                </>
              )}
            </div>

            <div className="fp-field">
              <label className="fp-label">Confirm password</label>
              <div className="fp-pw-wrap">
                <input
                  type={showCpw ? 'text' : 'password'}
                  name="cpassword"
                  onChange={handleInput}
                  placeholder="Repeat your password"
                  className={`fp-input${errorMessage ? ' fp-err' : ''}`}
                  required
                />
                <button type="button" className="fp-eye" onClick={() => setShowCpw(p => !p)}>
                  <EyeIcon visible={showCpw} />
                </button>
              </div>
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

            <div className="fp-divider" />

            <label className="fp-check-row">
              <input type="checkbox" id="rememberMe" />
              <span className="fp-check-label">Keep me signed in after reset</span>
            </label>

            <button type="submit" className="fp-btn" disabled={loading} style={{ marginTop: 24 }}>
              {loading ? (
                <><div className="fp-spinner" /> Resetting…</>
              ) : (
                <>
                  Reset password
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2.5 7.5l3 3 6-6" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
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