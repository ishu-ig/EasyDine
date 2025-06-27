import React, { useEffect, useState } from 'react'
import imageValidator from '../FormValidators/imageValidator'
import formValidator from '../FormValidators/formValidator'
import { useNavigate } from 'react-router-dom'
import HeroSection from '../Components/HeroSection'

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
    let navigate = useNavigate()

    function getInputData(e) {
        let name = e.target.name
        // let value = e.target.files ? "profile/" + e.target.files[0].name : e.target.value
        let value = e.target.files ? e.target.files[0] : e.target.value

        if (name !== "active") {
            setErrorMessage((old) => {
                return {
                    ...old,
                    [name]: e.target.files ? imageValidator(e) : formValidator(e)
                }
            })
        }
        setData((old) => {
            return {
                ...old,
                [name]: value
            }
        })
    }

    async function postData(e) {
        e.preventDefault()
        let error = Object.values(errorMessage).find((x) => x !== "")
        if (error)
            setShow(true)
        else {
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
                console.log(formData.name)
                let response = await fetch(`${process.env.REACT_APP_BACKEND_SERVER}/api/user/${localStorage.getItem("userid")}`, {
                    method: "PUT",
                    headers: {
                        "authorization": localStorage.getItem("token")
                    },
                    body: formData
                })
                response = await response.json()
                if (response.result === "Done") {
                    navigate("/profile")
                }
                else
                    alert("Sonthing Went Wrong")

            } catch (error) {
                alert("Internal Server Error")
            }
        }
    }
    useEffect(() => {
        (async () => {
            try {
                let response = await fetch(`${process.env.REACT_APP_BACKEND_SERVER}/api/user/${localStorage.getItem("userid")}`, {
                    method: "GET",
                    headers: {
                        'content-type': 'application-json',
                        "authorization": localStorage.getItem("token")
                    },
                })
                response = await response.json()
                if (response.result === "Done") {
                    setData(response.data)
                }
            } catch (error) {
                alert("Internal Server Error")
            }
        })()
    }, [])

    return (
        <>
            <HeroSection title="Update Profile" />
            <div className="container">
                <div className="card py-5 shadow-lg row m-auto" style={{ maxWidth: "800px", width: "100%" }} >
                    <div className="col-md-10 col-sm-11 col-12 md-3 m-auto">
                        <h5 className='text-light bg-primary text-center p-2'>Update Profile</h5>
                        <form onSubmit={postData}>
                            <div className='row'>
                                <div className="col-md-6 mb-3">
                                    <label>Name</label>
                                    <input type="text" name="name" value={data.name} onChange={getInputData} placeholder='Name' className={`form-control border-3 ${show && errorMessage.name ? "border-danger" : "border-primary"}`} />
                                    {show && errorMessage.name ? <p className='text-danger text-capitalize'>{errorMessage.name}</p> : null}
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label>Contact Number</label>
                                    <input type="number" name="phone" value={data.phone} onChange={getInputData} placeholder='Phone Number' className={`form-control border-3 ${show && errorMessage.phone ? "border-danger" : "border-primary"}`} />
                                    {show && errorMessage.phone ? <p className='text-danger text-capitalize'>{errorMessage.phone}</p> : null}
                                </div>
                            </div>
                            <div className='mb-3'>
                                <label>Address</label>
                                <textarea name="address" value={data.address} onChange={getInputData} placeholder='Address......' className='form-control border-3 border-primary' rows={4}></textarea>
                            </div>
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label>State</label>
                                    <input type="text" name="state" value={data.state} onChange={getInputData} placeholder='State' className='form-control border-3 border-primary' />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label>City</label>
                                    <input type="text" name="city" value={data.city} onChange={getInputData} placeholder='City' className='form-control border-3 border-primary' />
                                </div>
                            </div>
                            <div className='row'>
                                <div className="col-md-6 mb-3">
                                    <label>Pin</label>
                                    <input type="number" name="pin" value={data.pin} onChange={getInputData} placeholder='Pin' className='form-control border-3 border-primary' />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label>Profile Pic</label>
                                    <input type="file" name="pic" onChange={getInputData} className={`form-control border-3 ${show && errorMessage.pic ? "border-danger" : "border-primary"}`} />
                                    {show && errorMessage.pic ? <p className='text-danger text-capitalize'>{errorMessage.pic}</p> : null}
                                </div>
                            </div>
                            <div className='mb-3 mt-2'>
                                <button type='submit' className='btn btn-primary w-100'>Update</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}
