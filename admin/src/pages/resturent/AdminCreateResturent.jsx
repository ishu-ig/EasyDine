import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import formValidator from "../../FormValidators/formValidator"
import imageValidator from "../../FormValidators/imageValidator"
import { createResturent, getResturent } from '../../Redux/ActionCreators/ResturentActionCreators'

export default function AdminCreateResturent() {
    let [data, setData] = useState({
        name: "",
        pic: "",
        phone: "",
        reservationPrice: "",
        discount: "",
        finalPrice: "",
        address: "",
        seatAvailable: "",
        rating: "",
        openTime: "",
        closeTime: "",
        status: true,
        active: true
    })
    let [error, setError] = useState({
        name: "Name Field is Mendatory",
        pic: "Pic Field is Mendatory",
        phone: "Contact Number Field is Mendatory",
        address: "Address Field is Mendatory",
        reservationPrice: "Reservation Price Field is Mendatory",
        discount: "Discount Field is Mendatory",
        seatAvailable: "Seat Available Field is Mendatory",
        rating: "Rating Field is Mendatory",
        openTime: "Open Time Field is Mendatory",
        closeTime: "Close Time Time Field is Mendatory",
    })
    let [show, setShow] = useState(false)
    let navigate = useNavigate()


    let ResturentStateData = useSelector(state => state.ResturentStateData)
    let dispatch = useDispatch()

    function getInputData(e) {
        let name = e.target.name
        let value = e.target.files ? e.target.files[0] : e.target.value  //in case of real backend
        // let value = e.target.files ? "Food_Resturent/" + e.target.files[0].name : e.target.value

        if (name !== "active") {
            setError((old) => {
                return {
                    ...old,
                    [name]: e.target.files ? imageValidator(e) : formValidator(e)
                }
            })
        }
        setData((old) => {
            return {
                ...old,
                [name]: name === "active" ? (value === "1" ? true : false) : value
            }
        })
    }
    function postSubmit(e) {
        e.preventDefault()
        let errorItem = Object.values(error).find(x => x !== "")
        if (errorItem)
            setShow(true)
        else {
            let item = ResturentStateData.find(x => x.name.toLocaleLowerCase() === data.name.toLocaleLowerCase())
            console.log(item)
            if (item) {
                setShow(true)
                setError((old) => {
                    return {
                        ...old,
                        "name": "Resturent Already Exist"
                    }
                })
            }
            else {
                let rp = parseInt(data.reservationPrice);
                let d = parseInt(data.discount);
                let fp = parseInt(rp - rp * d / 100);

                // dispatch(createResturent({ ...data }))

                //in case of real backend and form has a file field
                let formData = new FormData()
                formData.append("name", data.name)
                formData.append("pic", data.pic)
                formData.append("phone", data.phone)
                formData.append("reservationPrice", rp)
                formData.append("discount", d)
                formData.append("finalPrice", fp)
                formData.append("address", data.address)
                formData.append("seatAvailable", data.seatAvailable);
                formData.append("rating", data.rating)
                formData.append("openTime", data.openTime)
                formData.append("closeTime", data.closeTime)
                formData.append("status", data.status)
                formData.append("active", data.active)
                dispatch(createResturent(formData))

                navigate("/resturent")
            }
        }
    }

    useEffect(() => {
        (() => {
            dispatch(getResturent())
        })()
    }, [ResturentStateData.length])
    return (
        <>
            <div className="container">
                <h5 className="text-center text-light bg-primary p-2">Create Resturent <Link to="/resturent"><i className="fa fa-arrow-left text-light float-end pt-1"></i></Link></h5>
                {/* Form */}
                <div className="card mt-3 shadow-sm p-4">
                    <form onSubmit={postSubmit}>
                        {/* Name Field */}
                        <div className="mb-3">
                            <label className="fw-bold">Name*</label>
                            <input
                                type="text"
                                name="name"
                                onChange={getInputData}
                                placeholder="Enter Resturent Name"
                                className={`form-control ${show && error.name ? 'border-danger' : 'border-primary'}`}
                            />
                            {show && error.name && <p className="text-danger mt-1">{error.name}</p>}
                        </div>
                        <div className="row">
                            {/* File Upload */}
                            <div className="col-md-6 mb-3">
                                <label className="fw-bold">Upload Picture*</label>
                                <input
                                    type="file"
                                    name="pic"
                                    onChange={getInputData}
                                    className={`form-control ${show && error.pic ? 'border-danger' : 'border-primary'}`}
                                />
                                {show && error.pic && <p className="text-danger mt-1">{error.pic}</p>}
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="fw-bold">Contact Number*</label>
                                <input
                                    type="number"
                                    name="phone"
                                    onChange={getInputData}
                                    className={`form-control ${show && error.phone ? 'border-danger' : 'border-primary'}`}
                                />
                                {show && error.phone && <p className="text-danger mt-1">{error.phone}</p>}
                            </div>
                        </div>
                        <div className="row">
                            {/* File Upload */}
                            <div className="col-md-6 mb-3">
                                <label className="fw-bold">Reservation Price*</label>
                                <input
                                    type="number"
                                    name="reservationPrice"
                                    onChange={getInputData}
                                    className={`form-control ${show && error.reservationPrice ? 'border-danger' : 'border-primary'}`}
                                />
                                {show && error.reservationPrice && <p className="text-danger mt-1">{error.reservationPrice}</p>}
                            </div>

                            <div className="col-md-6 mb-3">
                                <label className="fw-bold">Discount*</label>
                                <input
                                    type="number"
                                    name="discount"
                                    onChange={getInputData}
                                    className={`form-control ${show && error.discount ? 'border-danger' : 'border-primary'}`}
                                />
                                {show && error.discount && <p className="text-danger mt-1">{error.discount}</p>}
                            </div>
                        </div>
                        <div className="mb-3">
                            <label className="fw-bold">Address*</label>
                            <textarea name="address" onChange={getInputData} className={`form-control ${show && error.discount ? 'border-danger' : 'border-primary'}`} rows={4}></textarea>
                            {show && error.address && <p className="text-danger mt-1">{error.address}</p>}
                        </div>

                        {/* File Upload & Active Status */}
                        <div className="row">
                            {/* File Upload */}
                            <div className="col-md-6 mb-3">
                                <label className="fw-bold">Seat Avavilable*</label>
                                <input
                                    type="number"
                                    name="seatAvailable"
                                    onChange={getInputData}
                                    className={`form-control ${show && error.seatAvailable ? 'border-danger' : 'border-primary'}`}
                                />
                                {show && error.seatAvailable && <p className="text-danger mt-1">{error.seatAvailable}</p>}
                            </div>

                            {/* Active Status */}
                            <div className="col-md-6 mb-3">
                                <label className="fw-bold">Rating*</label>
                                <input
                                    type="number"
                                    name="rating"
                                    onChange={getInputData}
                                    className={`form-control ${show && error.rating ? 'border-danger' : 'border-primary'}`}
                                />
                                {show && error.rating && <p className="text-danger mt-1">{error.rating}</p>}
                            </div>
                        </div>
                        <div className="row">
                            {/* File Upload */}
                            <div className="col-md-6 mb-3">
                                <label className="fw-bold">Opening Time*</label>
                                <input
                                    type="time"
                                    name="openTime"
                                    onChange={getInputData}
                                    className={`form-control ${show && error.openTime ? 'border-danger' : 'border-primary'}`}
                                />
                                {show && error.openTime && <p className="text-danger mt-1">{error.openTime}</p>}
                            </div>

                            {/* Active Status */}
                            <div className="col-md-6 mb-3">
                                <label className="fw-bold">Closing Time*</label>
                                <input
                                    type="time"
                                    name="closeTime"
                                    onChange={getInputData}
                                    className={`form-control ${show && error.closeTime ? 'border-danger' : 'border-primary'}`}
                                />
                                {show && error.closeTime && <p className="text-danger mt-1">{error.closeTime}</p>}
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="fw-bold">Status</label>
                                <select
                                    name="status"
                                    onChange={getInputData}
                                    className="form-select border-primary"
                                >
                                    <option value="1">Open</option>
                                    <option value="0">Close</option>
                                </select>
                            </div>

                            {/* Active Status */}
                            <div className="col-md-6 mb-3">
                                <label className="fw-bold">Active</label>
                                <select
                                    name="active"
                                    onChange={getInputData}
                                    className="form-select border-primary"
                                >
                                    <option value="1">Yes</option>
                                    <option value="0">No</option>
                                </select>
                            </div>
                        </div>


                        {/* Submit Button */}
                        <div className="mb-3">
                            <button type="submit" className="btn btn-primary w-100 text-light">
                                <i className="fa fa-save"></i> Create Resturent
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}
