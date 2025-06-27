import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from "swiper/react";
import 'swiper/css';
import 'swiper/css/pagination';
import { useDispatch, useSelector } from 'react-redux';
import { getResturent } from "../Redux/ActionCreators/ResturentActionCreators";

export default function ResturentSlider({ title, data }) {
    let dispatch = useDispatch();
    let ResturentStateData = useSelector(state => state.ResturentStateData);

    useEffect(() => {
        dispatch(getResturent());
    }, [ResturentStateData.length, dispatch]);

    return (
        <div className="Resturent-slider container-fluid py-5" style={{ backgroundColor: "transparent" }}>
            <div className="container">
                <div className="section-header text-center mx-auto mb-4" data-wow-delay="0.1s" style={{ maxWidth: 500 }}>
                    <h1 className="display-6 mb-3" style={{ fontSize: "1.5rem" }}>{title}</h1>
                </div>
                <Swiper
                    slidesPerView={2}
                    spaceBetween={15}
                    breakpoints={{
                        480: { slidesPerView: 1 },
                        768: { slidesPerView: 4 },
                        1024: { slidesPerView: 3 }
                    }}
                    loop={true}
                    className="mySwiper"
                >
                    {data?.map((item) => (
                        <SwiperSlide key={item._id} className="slider-card">
                            <div className="card border-0 resturent-card shadow-sm p-3 text-center" style={{ backgroundColor: "transparent" }}>
                            <div className="img-container">
                                    <img 
                                        src={`${process.env.REACT_APP_BACKEND_SERVER}/${item.pic}`} 
                                        className="slider-image" 
                                        style={{ height: "250px", width: "100%", objectFit: "cover", borderRadius: "10px" }} 
                                        alt={item.name} 
                                    />
                                    {item.discount && (
                                        <div className="discount-badge">{item.discount}% OFF</div>
                                    )}
                                </div>
                                <div className='slider-card-element'>
                                    <h4 className="mt-2" style={{ fontSize: "1rem" }}>{item.name}</h4>
                                    <p className="text-muted" style={{ fontSize: "0.9rem" }}>{item.address}</p>
                                    <div className="btn-group">
                                    <Link to={`/resturent/${item._id}`} className="btn btn-primary text-light mt-2">View Details</Link>
                                    <Link to={`/resturent/${item._id}`} className="btn btn-primary text-light mt-2">Reservation</Link>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    );
}
