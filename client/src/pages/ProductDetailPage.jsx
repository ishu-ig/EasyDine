import React, { useEffect, useState } from 'react'
import HeroSection from '../Components/HeroSection'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-cube';
import 'swiper/css/pagination';

import { EffectCube, Pagination } from 'swiper/modules';

import { getProduct } from "../Redux/ActionCreators/ProductActionCreators"
import { createCart, getCart } from "../Redux/ActionCreators/CartActionCreators"
import { createWishlist, getWishlist } from "../Redux/ActionCreators/WishlistActionCreators"
import CategorySlider from '../Components/CategorySlider';

export default function ProductDetailPage() {
    let { _id } = useParams()
    let [data, setData] = useState({})
    let [relatedProduct, setRelatedProduct] = useState([])
    let [qty, setQty] = useState(1)


    let ProductStateData = useSelector((state) => state.ProductStateData)
    let CartStateData = useSelector((state) => state.CartStateData)
    let WishlistStateData = useSelector((state) => state.WishlistStateData)

    let dispatch = useDispatch()
    let navigate = useNavigate()

    useEffect(() => {
        (() => {
            dispatch(getProduct())
            console.log(getProduct().maincategory)
            if (ProductStateData.length) {
                let item = ProductStateData.find((x) => x._id === _id)
                setData(item)
                setRelatedProduct(ProductStateData.filter((x) => x.active && x.maincategory?.name === item.maincategory?.name && x._id !== _id))
            }
        })()
    }, [ProductStateData.length])

    useEffect(() => {
        (() => {
            dispatch(getCart())
        })()
    }, [CartStateData.length])
    useEffect(() => {
        (() => {
            dispatch(getWishlist())
        })()
    }, [WishlistStateData.length])


    function addToCart() {
        if (localStorage.getItem("login")) {
            let item = CartStateData.find(x => x.product._id === _id && x.user?._id === localStorage.getItem("userid"))
            if (!item) {
                dispatch(createCart({
                    user: localStorage.getItem("userid"),
                    product: data._id,
                    qty: qty,
                    total: data.finalPrice * qty,
                }))
            }
            navigate("/cart")
        }
        else {
            alert("Login To Add Item In Cart And For Placing Order")
            navigate("/login")
        }
    }

    function addToWishlist() {
        if (localStorage.getItem("login")) {
            let item = WishlistStateData.find(x => x.product?._id === _id && x.user?._id === localStorage.getItem("userid"))
            if (!item) {
                dispatch(createWishlist({
                    user: localStorage.getItem("userid"),
                    product: data?._id,
                }))
            }
            navigate("/wishlist")
        }
        else {
            alert("Login To Add Item In Wishlist And For Placing Order")
            navigate("/login")
        }
    }

    let options = {
        effect: 'cube',
        grabCursor: true,
        cubeEffect: {
            shadow: true,
            slideShadows: true,
            shadowOffset: 20,
            shadowScale: 0.94,
        },
        pagination: true,
        modules: [EffectCube, Pagination],
        loop: true,
        className: "mySwiper"
    }
    return (
        <>
            <HeroSection title={`Dish - ${data.name}`} />
            <div className="container-xxl py-5">
                <div className="container-fluid text-center">
                    <div className="section-header text-center mb-5" style={{ maxWidth: 500, margin: "auto" }}>
                        <h1 className="display-4 fw-bold">{data.name}</h1>
                    </div>
                    <div className="row">
                        {/* Product Image Swiper */}
                        <div className="col-md-5 d-flex align-items-center justify-content-center">
                            <Swiper {...options} className="rounded shadow-lg">
                                <SwiperSlide>
                                    <img
                                        src={`${process.env.REACT_APP_BACKEND_SERVER}/${data.pic}`}
                                        style={{ height: 400, width: '100%', borderRadius: '10px' }}
                                        alt="Dish"
                                    />
                                </SwiperSlide>
                            </Swiper>
                        </div>

                        {/* Product Details */}
                        <div className="col-md-7">
                            <div className="card shadow-lg p-4">
                                <table className="table table-bordered table-striped border-3 border-primary">
                                    <tbody>
                                        <tr>
                                            <th>Dish Name</th>
                                            <td>{data?.name || "N/A"}</td>
                                        </tr>
                                        <tr>
                                            <th>Maincategory / Subcategory</th>
                                            <td>{data?.maincategory?.name || "N/A"} / {data?.subcategory?.name || "N/A"}</td>
                                        </tr>
                                        <tr>
                                            <th>Restaurant</th>
                                            <td>{data?.resturent?.name || "N/A"}</td>
                                        </tr>
                                        <tr>
                                            <th>Price</th>
                                            <td>
                                                <del className='text-danger'>&#8377;{data?.basePrice}</del>
                                                <strong className="ms-2 text-success">&#8377;{data?.finalPrice}</strong>
                                                <sup className='text-success'> {data?.discount}%</sup>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>Availability</th>
                                            <td>
                                                <span className={`badge ${data?.availability ? 'bg-success' : 'bg-danger'}`}>
                                                    {data?.availability ? "Available" : "Not Available"}
                                                </span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td colSpan={2}>
                                                <div className="row">
                                                    <div className="col-md-4 mb-3">
                                                        <div className="btn-group w-100">
                                                            <button className="btn btn-primary" style={{ borderRadius: "5px" }} onClick={() => setQty((prev) => Math.max(1, prev - 1))} >
                                                                <i className="fa fa-minus"></i>
                                                            </button>
                                                            <h3 className="w-50 text-center">{qty}</h3>
                                                            <button className="btn btn-primary" style={{ borderRadius: "5px" }} onClick={() => setQty((prev) => prev + 1)} >
                                                                <i className="fa fa-plus"></i>
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-8 mb-3">
                                                        <div className="btn-group w-100">
                                                            <button className="btn btn-primary" onClick={addToCart} style={{ borderRadius: "5px" }}>
                                                                <i className="fa fa-shopping-cart me-2" ></i>Add To Cart
                                                            </button>
                                                            <button className="btn btn-secondary" onClick={addToWishlist} style={{ borderRadius: "5px" }}>
                                                                <i className="fa fa-heart me-2"></i>Add To Wishlist
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>Description</th>
                                            <td><div dangerouslySetInnerHTML={{ __html: data?.description || "No description available" }} /></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Related Products */}
            {relatedProduct.length > 0 ? (
                <CategorySlider title="Other Related Dishes" data={relatedProduct} />
            ) : (
                <p className="text-center text-muted">No related products found</p>
            )}
        </>
    )
}
