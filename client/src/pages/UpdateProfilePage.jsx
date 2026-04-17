import React, { useEffect, useState } from 'react'
import imageValidator from '../FormValidators/imageValidator'
import formValidator from '../FormValidators/formValidator'
import { useNavigate } from 'react-router-dom'

export default function UpdateProfilePage() {
    let [data, setData] = useState({
        name: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        pin: "",
        pic: ""
    })
    let [errorMessage, setErrorMessage] = useState({
        name: "",
        phone: "",
        pic: ""
    })
    let [show, setShow] = useState(false)
    let [previewUrl, setPreviewUrl] = useState(null)
    let [isSaving, setIsSaving] = useState(false)
    let navigate = useNavigate()

    function getInputData(e) {
        let name = e.target.name
        let value = e.target.files ? e.target.files[0] : e.target.value

        if (e.target.files && e.target.files[0]) {
            setPreviewUrl(URL.createObjectURL(e.target.files[0]))
        }

        if (name !== "active") {
            setErrorMessage((old) => ({
                ...old,
                [name]: e.target.files ? imageValidator(e) : formValidator(e)
            }))
        }
        setData((old) => ({ ...old, [name]: value }))
    }

    async function postData(e) {
        e.preventDefault()
        let error = Object.values(errorMessage).find((x) => x !== "")
        if (error) {
            setShow(true)
        } else {
            setIsSaving(true)
            try {
                let formData = new FormData()
                formData.append("_id", data._id)
                formData.append("name", data.name)
                formData.append("phone", data.phone)
                formData.append("address", data.address)
                formData.append("pin", data.pin)
                formData.append("city", data.city)
                formData.append("state", data.state)
                formData.append("pic", data.pic)
                let response = await fetch(`${process.env.REACT_APP_BACKEND_SERVER}/api/user/${localStorage.getItem("userid")}`, {
                    method: "PUT",
                    headers: { "authorization": localStorage.getItem("token") },
                    body: formData
                })
                response = await response.json()
                if (response.result === "Done") navigate("/profile")
                else alert("Something Went Wrong")
            } catch (error) {
                alert("Internal Server Error")
            } finally {
                setIsSaving(false)
            }
        }
    }

    useEffect(() => {
        (async () => {
            try {
                let response = await fetch(`${process.env.REACT_APP_BACKEND_SERVER}/api/user/${localStorage.getItem("userid")}`, {
                    method: "GET",
                    headers: {
                        'content-type': 'application/json',
                        "authorization": localStorage.getItem("token")
                    },
                })
                response = await response.json()
                if (response.result === "Done") {
                    setData(response.data)
                    if (response.data.pic) {
                        setPreviewUrl(`${process.env.REACT_APP_BACKEND_SERVER}/${response.data.pic}`)
                    }
                }
            } catch (error) {
                alert("Internal Server Error")
            }
        })()
    }, [])

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=DM+Sans:wght@300;400;500&display=swap');

                :root {
                    --cream: #faf7f2;
                    --warm-white: #f5f0e8;
                    --sand: #e8ddd0;
                    --caramel: #c9a87c;
                    --espresso: #3d2b1f;
                    --charcoal: #2c2c2c;
                    --muted: #8a7a70;
                    --error: #c0392b;
                    --success: #2d6a4f;
                }

                .up-page {
                    min-height: 100vh;
                    background: var(--cream);
                    font-family: 'DM Sans', sans-serif;
                    padding: 60px 20px;
                }

                .up-hero {
                    text-align: center;
                    margin-bottom: 48px;
                }

                .up-hero h1 {
                    font-family: 'Cormorant Garamond', serif;
                    font-size: clamp(2.2rem, 5vw, 3.5rem);
                    font-weight: 300;
                    color: var(--espresso);
                    letter-spacing: 0.04em;
                    margin: 0 0 8px;
                }

                .up-hero-line {
                    width: 60px;
                    height: 2px;
                    background: var(--caramel);
                    margin: 0 auto;
                }

                .up-card {
                    max-width: 820px;
                    margin: 0 auto;
                    background: #fff;
                    border-radius: 4px;
                    border: 1px solid var(--sand);
                    overflow: hidden;
                    box-shadow: 0 12px 60px rgba(61,43,31,0.08);
                }

                .up-card-header {
                    background: var(--espresso);
                    padding: 28px 40px;
                    display: flex;
                    align-items: center;
                    gap: 20px;
                }

                .up-avatar-wrap {
                    position: relative;
                    flex-shrink: 0;
                }

                .up-avatar {
                    width: 72px;
                    height: 72px;
                    border-radius: 50%;
                    object-fit: cover;
                    border: 3px solid var(--caramel);
                    display: block;
                }

                .up-avatar-placeholder {
                    width: 72px;
                    height: 72px;
                    border-radius: 50%;
                    background: rgba(201,168,124,0.2);
                    border: 2px dashed var(--caramel);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 28px;
                    color: var(--caramel);
                }

                .up-card-header-text h2 {
                    font-family: 'Cormorant Garamond', serif;
                    font-size: 1.6rem;
                    font-weight: 400;
                    color: #fff;
                    margin: 0 0 4px;
                    letter-spacing: 0.03em;
                }

                .up-card-header-text p {
                    color: var(--caramel);
                    font-size: 0.82rem;
                    letter-spacing: 0.08em;
                    text-transform: uppercase;
                    margin: 0;
                }

                .up-form-body {
                    padding: 40px;
                }

                .up-section-label {
                    font-size: 0.7rem;
                    letter-spacing: 0.14em;
                    text-transform: uppercase;
                    color: var(--caramel);
                    font-weight: 500;
                    margin-bottom: 20px;
                    padding-bottom: 10px;
                    border-bottom: 1px solid var(--sand);
                }

                .up-grid-2 {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 20px;
                }

                @media (max-width: 600px) {
                    .up-grid-2 { grid-template-columns: 1fr; }
                    .up-card-header { padding: 24px; }
                    .up-form-body { padding: 24px; }
                }

                .up-field {
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                    margin-bottom: 20px;
                }

                .up-field label {
                    font-size: 0.78rem;
                    letter-spacing: 0.06em;
                    text-transform: uppercase;
                    color: var(--muted);
                    font-weight: 500;
                }

                .up-input {
                    padding: 12px 16px;
                    border: 1px solid var(--sand);
                    border-radius: 2px;
                    background: var(--warm-white);
                    font-family: 'DM Sans', sans-serif;
                    font-size: 0.95rem;
                    color: var(--charcoal);
                    transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
                    outline: none;
                    width: 100%;
                    box-sizing: border-box;
                }

                .up-input:focus {
                    border-color: var(--caramel);
                    background: #fff;
                    box-shadow: 0 0 0 3px rgba(201,168,124,0.15);
                }

                .up-input.error {
                    border-color: var(--error);
                    background: #fff5f5;
                }

                .up-input-error {
                    font-size: 0.78rem;
                    color: var(--error);
                    margin-top: 2px;
                }

                .up-textarea {
                    resize: vertical;
                    min-height: 96px;
                }

                .up-file-label {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 12px 16px;
                    border: 1px dashed var(--caramel);
                    border-radius: 2px;
                    background: rgba(201,168,124,0.05);
                    cursor: pointer;
                    transition: background 0.2s;
                    font-size: 0.88rem;
                    color: var(--muted);
                }

                .up-file-label:hover {
                    background: rgba(201,168,124,0.12);
                }

                .up-file-input {
                    display: none;
                }

                .up-divider {
                    height: 1px;
                    background: var(--sand);
                    margin: 32px 0;
                }

                .up-btn {
                    width: 100%;
                    padding: 15px;
                    background: var(--espresso);
                    color: #fff;
                    border: none;
                    border-radius: 2px;
                    font-family: 'DM Sans', sans-serif;
                    font-size: 0.85rem;
                    letter-spacing: 0.12em;
                    text-transform: uppercase;
                    font-weight: 500;
                    cursor: pointer;
                    transition: background 0.25s, transform 0.15s;
                    margin-top: 8px;
                }

                .up-btn:hover:not(:disabled) {
                    background: #5a3d2b;
                    transform: translateY(-1px);
                }

                .up-btn:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }

                .up-btn-inner {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                }

                .up-spinner {
                    width: 16px;
                    height: 16px;
                    border: 2px solid rgba(255,255,255,0.3);
                    border-top-color: #fff;
                    border-radius: 50%;
                    animation: spin 0.7s linear infinite;
                }

                @keyframes spin { to { transform: rotate(360deg); } }
            `}</style>

            <div className="up-page">
                <div className="up-hero">
                    <h1>My Profile</h1>
                    <div className="up-hero-line"></div>
                </div>

                <div className="up-card">
                    <div className="up-card-header">
                        <div className="up-avatar-wrap">
                            {previewUrl
                                ? <img src={previewUrl} alt="avatar" className="up-avatar" />
                                : <div className="up-avatar-placeholder">&#9998;</div>
                            }
                        </div>
                        <div className="up-card-header-text">
                            <h2>{data.name || "Your Name"}</h2>
                            <p>Account Details</p>
                        </div>
                    </div>

                    <div className="up-form-body">
                        <form onSubmit={postData}>

                            {/* Personal Info */}
                            <p className="up-section-label">Personal Information</p>
                            <div className="up-grid-2">
                                <div className="up-field">
                                    <label>Full Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={data.name}
                                        onChange={getInputData}
                                        placeholder="Your full name"
                                        className={`up-input ${show && errorMessage.name ? 'error' : ''}`}
                                    />
                                    {show && errorMessage.name && <span className="up-input-error">{errorMessage.name}</span>}
                                </div>
                                <div className="up-field">
                                    <label>Contact Number</label>
                                    <input
                                        type="number"
                                        name="phone"
                                        value={data.phone}
                                        onChange={getInputData}
                                        placeholder="10-digit mobile number"
                                        className={`up-input ${show && errorMessage.phone ? 'error' : ''}`}
                                    />
                                    {show && errorMessage.phone && <span className="up-input-error">{errorMessage.phone}</span>}
                                </div>
                            </div>

                            {/* Address */}
                            <div className="up-divider"></div>
                            <p className="up-section-label">Delivery Address</p>

                            <div className="up-field">
                                <label>Street Address</label>
                                <textarea
                                    name="address"
                                    value={data.address}
                                    onChange={getInputData}
                                    placeholder="House / flat / area / street..."
                                    className="up-input up-textarea"
                                />
                            </div>

                            <div className="up-grid-2">
                                <div className="up-field">
                                    <label>State</label>
                                    <input type="text" name="state" value={data.state} onChange={getInputData} placeholder="State" className="up-input" />
                                </div>
                                <div className="up-field">
                                    <label>City</label>
                                    <input type="text" name="city" value={data.city} onChange={getInputData} placeholder="City" className="up-input" />
                                </div>
                            </div>

                            <div style={{ maxWidth: '50%' }}>
                                <div className="up-field">
                                    <label>PIN Code</label>
                                    <input type="number" name="pin" value={data.pin} onChange={getInputData} placeholder="6-digit PIN" className="up-input" />
                                </div>
                            </div>

                            {/* Photo */}
                            <div className="up-divider"></div>
                            <p className="up-section-label">Profile Photo</p>

                            <div className="up-field">
                                <label
                                    className="up-file-label"
                                    style={show && errorMessage.pic ? { borderColor: 'var(--error)' } : {}}
                                >
                                    <span>📷</span>
                                    <span>{data.pic?.name || "Click to upload a photo"}</span>
                                    <input type="file" name="pic" onChange={getInputData} className="up-file-input" accept="image/*" />
                                </label>
                                {show && errorMessage.pic && <span className="up-input-error">{errorMessage.pic}</span>}
                            </div>

                            <button type="submit" className="up-btn" disabled={isSaving}>
                                <span className="up-btn-inner">
                                    {isSaving && <span className="up-spinner"></span>}
                                    {isSaving ? "Saving Changes..." : "Save Changes"}
                                </span>
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}