import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from "swiper/react";
import 'swiper/css';
import 'swiper/css/pagination';
import { useDispatch, useSelector } from 'react-redux';
import { getMaincategory } from "../Redux/ActionCreators/MaincategoryActionCreators";
import { getSubcategory } from "../Redux/ActionCreators/SubcategoryActionCreators";

export default function CategorySlider({ title, data }) {
    let dispatch = useDispatch();
    let MaincategoryStateData = useSelector(state => state.MaincategoryStateData);
    let SubcategoryStateData = useSelector(state => state.SubcategoryStateData);

    useEffect(() => {
        dispatch(getMaincategory());
    }, [MaincategoryStateData.length, dispatch]);

    useEffect(() => {
        dispatch(getSubcategory());
    }, [SubcategoryStateData.length, dispatch]);

    return (
        <div className="category-slider container-fluid py-5" style={{ backgroundColor: "transparent" }}>
            <div className="container">
                <div className="section-header text-center mx-auto mb-4" data-wow-delay="0.1s" style={{ maxWidth: 500 }}>
                    <h1 className="display-6 mb-3" style={{ fontSize: "1.5rem" }}>{title}</h1>
                </div>
                <Swiper
                    slidesPerView={2}
                    spaceBetween={15}
                    breakpoints={{
                        480: { slidesPerView: 2 },
                        768: { slidesPerView: 3 },
                        1024: { slidesPerView: 4 }
                    }}
                    loop={true}
                    className="mySwiper"
                >
                    {data?.map((item) => (
                        <SwiperSlide key={item._id} className="slider-card">
                            <div className="card border-0 shadow-sm p-3 text-center" style={{ backgroundColor: "transparent" }}>
                                <img src={`${process.env.REACT_APP_BACKEND_SERVER}/${item.pic}`} className="slider-image" style={{ height: "250px", display: "block", margin: "0 auto" }} alt={item.name} />
                                <div className='slider-card-element'>
                                    <h4 className="mt-2" style={{ fontSize: "1rem" }}>{item.name}</h4>
                                    <Link to={title === "Maincategory" ? `/product?mc=${item.name}` : `/product?sc=${item.name}`} className="btn btn-primary text-light mt-2">More Dishes</Link>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    );
}
