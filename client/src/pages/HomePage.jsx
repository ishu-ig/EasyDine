import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import About from '../Components/About'
import Features from '../Components/Features'
import Products from '../Components/Products'
import Deals from '../Components/Deals'
import Testimonials from '../Components/Testimonials'
import CategorySlider from '../Components/CategorySlider'
import ResturentSlider from '../Components/ResturentSlider'

import { getBanner } from '../Redux/ActionCreators/BannerActionCreators'
import { getMaincategory } from '../Redux/ActionCreators/MaincategoryActionCreators'
import { getSubcategory } from '../Redux/ActionCreators/SubcategoryActionCreators'
import { getProduct } from '../Redux/ActionCreators/ProductActionCreators'
import { getResturent } from '../Redux/ActionCreators/ResturentActionCreators'

export default function HomePage() {
  const BannerStateData = useSelector((state) => state.BannerStateData)
  const MaincategoryStateData = useSelector((state) => state.MaincategoryStateData)
  const SubcategoryStateData = useSelector((state) => state.SubcategoryStateData)
  const ProductStateData = useSelector((state) => state.ProductStateData)
  const ResturentStateData = useSelector((state) => state.ResturentStateData)

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getBanner())
    dispatch(getMaincategory())
    dispatch(getSubcategory())
    dispatch(getProduct())
    dispatch(getResturent())
  }, [dispatch])

  return (
    <>
      {/* Carousel Start */}
      <div
        className="container-fluid p-0 mb-5 wow fadeIn"
        data-wow-delay="0.1s"
      >
        <div
          id="header-carousel"
          className="carousel slide"
          data-bs-ride="carousel"
        >
          <div className="carousel-inner">
            {BannerStateData &&
              BannerStateData.filter((item) => item.active).map(
                (item, index) => (
                  <div
                    key={item._id}
                    className={`carousel-item ${
                      index === 0 ? "active" : ""
                    }`}
                  >
                    <img
                      className="w-100"
                      src={item.pic}
                      alt={item.title}
                      style={{
                        height: "550px",
                        objectFit: "cover",
                      }}
                    />

                    <div className="carousel-caption">
                      <div className="container">
                        <div className="row justify-content-start">
                          <div className="col-lg-7">
                            <h1 className="display-2 mb-5 animated slideInDown">
                              {item.title}
                            </h1>

                            {item.link && (
                              <a
                                href={item.link}
                                className="btn btn-primary rounded-pill py-sm-3 px-sm-5"
                              >
                                Explore Now
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              )}
          </div>

          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#header-carousel"
            data-bs-slide="prev"
          >
            <span
              className="carousel-control-prev-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Previous</span>
          </button>

          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#header-carousel"
            data-bs-slide="next"
          >
            <span
              className="carousel-control-next-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </div>
      {/* Carousel End */}

      <CategorySlider
        title="Main Categories"
        type="mc"
        data={MaincategoryStateData.filter((x) => x.active)}
      />

      <About />

      <Features />

      <CategorySlider
        title="Sub Categories"
        type="sc"
        data={SubcategoryStateData.filter((x) => x.active)}
      />

      <Products
        data={ProductStateData.filter((x) => x.active).slice(0, 12)}
        show={true}
      />

      <Deals />

      <ResturentSlider
        title="Restaurants"
        data={ResturentStateData.filter((x) => x.active)}
      />

      <Testimonials />
    </>
  )
}