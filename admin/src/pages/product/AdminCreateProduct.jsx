import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import formValidator from "../../FormValidators/formValidator"
import imageValidator from "../../FormValidators/imageValidator"
import { createProduct } from '../../Redux/ActionCreators/ProductActionCreators'
import { getMaincategory } from "../../Redux/ActionCreators/MaincategoryActionCreators"
import { getSubcategory } from '../../Redux/ActionCreators/SubcategoryActionCreators'
import { getResturent } from '../../Redux/ActionCreators/ResturentActionCreators'

var rte
export default function AdminCreateProduct() {
    var refdiv = useRef(null);

    let [data, setData] = useState({
        name: "",
        pic: "",
        maincategory: "",
        subcategory: "",
        resturent: "",
        basePrice: "",
        discount: "",
        finalPrice: "",
        description: "",
        rating: "",
        availability: true,
        active: true
    })
    let [error, setError] = useState({
        name: "Name Field is Mendatory",
        pic: "Pic Field is Mendatory",
        basePrice: "Base Price Field is Mendatory",
        discount: "Discount Field is Mendatory",
        rating: "Rating Feild is Mendatory"
    })
    let [show, setShow] = useState(false)
    let navigate = useNavigate()


    let MaincategoryStateData = useSelector(state => state.MaincategoryStateData)
    let SubcategoryStateData = useSelector(state => state.SubcategoryStateData)
    let ResturentStateData = useSelector(state => state.ResturentStateData)
    let dispatch = useDispatch()

    function getInputData(e) {
        let name = e.target.name
        let value = e.target.files ? e.target.files[0] : e.target.value  //in case of real backend
        // let value = e.target.files ? "Food_Product/" + e.target.files[0].name : e.target.value

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
                [name]: name === "active" || name === "availability" ? (value === "1" ? true : false) : value
            }
        })
    }
    function postSubmit(e) {
        e.preventDefault()
        let errorItem = Object.values(error).find(x => x !== "")
        if (errorItem)
            setShow(true)
        else {
            let errorItem = Object.values(error).find(x => x !== "")
            if (errorItem)
                setShow(true)
            else {
                let bp = parseInt(data.basePrice)
                let d = parseInt(data.discount)
                let fp = parseInt(bp - bp * d / 100)
                // dispatch(createProduct({ 
                //     ...data ,
                //     'maincategory': data.maincategory ? data.maincategory : MaincategoryStateData[0].name,
                // }))

                //in case of real backend and form has a file field
                let formData = new FormData()
                formData.append("name", data.name)
                formData.append("maincategory", data.maincategory ? data.maincategory : MaincategoryStateData[0]._id)
                formData.append("subcategory", data.subcategory ? data.subcategory : SubcategoryStateData[0]._id)
                formData.append("resturent", data.resturent ? data.resturent : ResturentStateData[0]._id)
                formData.append("basePrice", bp)
                formData.append("discount", d)
                formData.append("finalPrice", fp)
                formData.append("description", rte.getHTMLCode())
                formData.append("pic", data.pic)
                formData.append("rating", data.rating)
                formData.append("availability", data.availability)
                formData.append("active", data.active)
                dispatch(createProduct(formData))

                navigate("/product")
            }
        }
    }

    useEffect(() => {
        rte = new window.RichTextEditor(refdiv.current);
        rte.setHTMLCode("");
    }, [])
    useEffect(() => {
        (() => {
            dispatch(getMaincategory())
        })()
    }, [MaincategoryStateData.length])
    useEffect(() => {
        (() => {
            dispatch(getSubcategory())
        })()
    }, [SubcategoryStateData.length])
    useEffect(() => {
        (() => {
            dispatch(getResturent())
        })()
    }, [ResturentStateData.length])
    return (
        <>
            <div className="container">
                <h5 className="text-center text-light bg-primary p-2">Create Product <Link to="/product"><i className="fa fa-arrow-left text-light float-end pt-1"></i></Link></h5>
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
                                placeholder="Enter Product Name"
                                className={`form-control ${show && error.name ? 'border-danger' : 'border-primary'}`}
                            />
                            {show && error.name && <p className="text-danger mt-1">{error.name}</p>}
                        </div>
                        <div className='mb-3'>
                            <label className="fw-bold">Resturent*</label>
                            <select name="resturent" onChange={getInputData} className='form-select border-primary'>
                                <option value="">Select Resturent</option>
                                {ResturentStateData && ResturentStateData.filter((x) => x.active).map((item) => {
                                    // return <option key={item.id}>{item.name}</option>
                                    return <option key={item._id} value={item._id}>{item.name}</option>
                                })}
                            </select>
                        </div>
                        <div className="row">
                            <div className='col-md-6 mb-3'>
                                <label className="fw-bold">Maincategory*</label>
                                <select name="maincategory" onChange={getInputData} className='form-select border-primary'>
                                    <option value="">Select Main Category</option>
                                    {MaincategoryStateData && MaincategoryStateData.filter((x) => x.active).map((item) => {
                                        // return <option key={item.id}>{item.name}</option>
                                        return <option key={item._id} value={item._id}>{item.name}</option>
                                    })}
                                </select>
                            </div>
                            <div className='col-md-6 mb-3'>
                                <label className="fw-bold">Subcategory*</label>
                                <select
                                    name="subcategory"
                                    onChange={getInputData}
                                    className='form-select border-primary'
                                    disabled={!data.maincategory}
                                >
                                    <option value="">{data.maincategory ? "Select Subcategory" : "Select Maincategory First"}</option>
                                    {SubcategoryStateData && SubcategoryStateData.filter((x) => x.active && x.maincategory._id === data.maincategory).map((item) => {
                                        return <option key={item._id} value={item._id}>{item.name}</option>
                                    })}
                                </select>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="fw-bold">Base Price*</label>
                                <input
                                    type="number"
                                    name="basePrice"
                                    onChange={getInputData}
                                    placeholder="Enter Base Price"
                                    className={`form-control ${show && error.basePrice ? 'border-danger' : 'border-primary'}`}
                                />
                                {show && error.basePrice && <p className="text-danger mt-1">{error.basePrice}</p>}
                            </div>
                            <div className=" col-md-6 mb-3">
                                <label className="fw-bold">Discount*</label>
                                <input
                                    type="number"
                                    name="discount"
                                    onChange={getInputData}
                                    placeholder="Enter Product Name"
                                    className={`form-control ${show && error.discount ? 'border-danger' : 'border-primary'}`}
                                />
                                {show && error.discount && <p className="text-danger mt-1">{error.discount}</p>}
                            </div>
                        </div>
                        <div className="mb-3">
                            <label>Description*</label>
                            <div ref={refdiv} className='border-primary'></div>
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
                                <label className="fw-bold">Rating*</label>
                                <input
                                    type="number"
                                    name="rating"
                                    onChange={getInputData}
                                    placeholder="Enter Rating"
                                    className={`form-control ${show && error.rating ? 'border-danger' : 'border-primary'}`}
                                />
                                {show && error.rating && <p className="text-danger mt-1">{error.rating}</p>}
                            </div>
                        </div>
                        {/* File Upload & Active Status */}
                        <div className="row">
                            {/* File Upload */}
                            <div className="col-md-6 mb-3">
                                <label className="fw-bold">Availability</label>
                                <select
                                    name="availability"
                                    onChange={getInputData}
                                    className="form-select border-primary"
                                >
                                    <option value="1">Yes</option>
                                    <option value="0">No</option>
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
                                <i className="fa fa-save"></i> Create Product
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}
