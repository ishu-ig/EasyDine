import React, { useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/effect-cards";
import "swiper/css/pagination";

import { EffectCoverflow, Pagination } from "swiper/modules";
import { useDispatch, useSelector } from 'react-redux';

import { getTestimonial } from "../Redux/ActionCreators/TestimonialActionCreators"

export default function Testimonials() {
    let TestimonialStateData = useSelector(state=>state.TestimonialStateData)
    let dispatch = useDispatch()

    let [slidePerViews, setSlidePerViews] = useState(
        window.innerWidth < 1000 ? 1 : 3
    )
    let options = {
        effect: 'coverflow',
        grabCursor: true,
        centeredSlides: true,
        slidesPerView: slidePerViews,
        coverflowEffect: {
            rotate: 50,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: true,
        },
        pagination: true,
        loop: true,
        modules: [EffectCoverflow, Pagination],
        classNameName: "mySwiper"
    }

    function handleWindowRwsize() {
        setSlidePerViews(window.innerWidth < 1000 ? 1 : 3)
    }
    window.addEventListener('resize', handleWindowRwsize)

    useEffect(()=>{
        (()=>{
            dispatch(getTestimonial())
        })()
    },[TestimonialStateData.length])

    return (
        <>
            {/* <!-- Testimonial Start --> */}
            <div className="container-fluid bg-light bg-icon py-6 mb-5">
                <div className="container">
                    <div className="section-header text-center mx-auto mb-5 wow fadeInUp" data-wow-delay="0.1s" style={{ maxWidth: 500 }}>
                        <h1 className="display-5 mb-3">Customer Review</h1>
                        <p>Tempor ut dolore lorem kasd vero ipsum sit eirmod sit. Ipsum diam justo sed rebum vero dolor duo.</p>
                    </div>
                    <div className="testimonial-carousel wow fadeInUp" data-wow-delay="0.1s">
                        <Swiper {...options}>
                            {TestimonialStateData.map((item=>{
                                return <SwiperSlide key={item._id}>
                                <div className="testimonial-item position-relative bg-white p-5 mt-4">
                                    <i className="fa fa-quote-left fa-3x text-primary position-absolute top-0 start-0 mt-n4 ms-5"></i>
                                    <p className="mb-4 testimonial-message" >{item.message}</p>
                                    <div className="d-flex align-items-center">
                                        <img className="flex-shrink-0 rounded-circle" src={`${process.env.REACT_APP_BACKEND_SERVER}/${item.pic}`} height={100} width={100} alt="" />
                                        <div className="ms-3">
                                            <h5 className="mb-1">{item.name}</h5>
                                            <span>{item.profession}</span>
                                        </div>
                                    </div>
                                </div>
                            </SwiperSlide>
                            }))}
                            
                        </Swiper>
                    </div>
                </div>
            </div >
            {/* <!-- Testimonial End --> */}

        </>
    )
}
