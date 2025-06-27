import React, { useEffect } from 'react'
import About from '../Components/About'
import Features from '../Components/Features'
import Products from '../Components/Products'
import Deals from '../Components/Deals'
import Testimonials from '../Components/Testimonials'
import CategorySlider from '../Components/CategorySlider'
import { useDispatch, useSelector } from 'react-redux'
import { getMaincategory } from '../Redux/ActionCreators/MaincategoryActionCreators'
import { getSubcategory } from '../Redux/ActionCreators/SubcategoryActionCreators'
import { getProduct } from '../Redux/ActionCreators/ProductActionCreators'
import { getResturent } from '../Redux/ActionCreators/ResturentActionCreators'
import ResturentSlider from '../Components/ResturentSlider'


export default function HomePage() {
  let MaincategoryStateData = useSelector((state)=>state.MaincategoryStateData)
  let SubcategoryStateData = useSelector((state)=>state.SubcategoryStateData)
  let ProductStateData = useSelector((state)=>state.ProductStateData)
  let ResturentStateData = useSelector((state)=>state.ResturentStateData)
  let dispatch = useDispatch()

  useEffect(()=>{
    (()=>{
      dispatch(getMaincategory())
    })()
  },[MaincategoryStateData.length])
  useEffect(()=>{
    (()=>{
      dispatch(getSubcategory())
    })()
  },[SubcategoryStateData.length])

  useEffect(()=>{
    (()=>{
      dispatch(getProduct())
    })()
  },[ProductStateData.length])

  useEffect(()=>{
    (()=>{
      dispatch(getResturent())
    })()
  },[ResturentStateData.length])
  return (
    <>
      {/* <!-- Carousel Start --> */}

      <div className="container-fluid p-0 mb-5 wow fadeIn" data-wow-delay="0.1s">
        <div id="header-carousel" className="carousel slide" data-bs-ride="carousel">
          <div className="carousel-inner">
            <div className="carousel-item active">
              <img className="w-100" src="img/b1.jpg" alt="Image" height={550} />
                <div className="carousel-caption">
                  <div className="container">
                    <div className="row justify-content-start">
                      <div className="col-lg-7">
                        <h1 className="display-2 mb-5 animated slideInDown">Organic Food Is Good For Health</h1>
                        <a href="" className="btn btn-primary rounded-pill py-sm-3 px-sm-5">Products</a>
                        <a href="" className="btn btn-secondary rounded-pill py-sm-3 px-sm-5 ms-3">Services</a>
                      </div>
                    </div>
                  </div>
                </div>
            </div>
            <div className="carousel-item">
              <img className="w-100" src="img/b3.jpeg" alt="Image" height={550}/>
                <div className="carousel-caption">
                  <div className="container">
                    <div className="row justify-content-start">
                      <div className="col-lg-7">
                        <h1 className="display-2 mb-5 animated slideInDown">Natural Food Is Always Healthy</h1>
                        <a href="" className="btn btn-primary rounded-pill py-sm-3 px-sm-5">Products</a>
                        <a href="" className="btn btn-secondary rounded-pill py-sm-3 px-sm-5 ms-3">Services</a>
                      </div>
                    </div>
                  </div>
                </div>
            </div>
          </div>
          <button className="carousel-control-prev" type="button" data-bs-target="#header-carousel"
            data-bs-slide="prev">
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button className="carousel-control-next" type="button" data-bs-target="#header-carousel"
            data-bs-slide="next">
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </div>
      {/* <!-- Carousel End --> */}
      <CategorySlider title="Maincategory" data={MaincategoryStateData.filter(x=>x.active)} />
      <About />
      <Features />
      <CategorySlider title="Subcategory" data={SubcategoryStateData.filter(x=>x.active)} />
      <Products data={ProductStateData.filter(x=>x.active).slice(0,12)} />
      <Deals />
      <ResturentSlider title="Resturent" data={ResturentStateData.filter(x=>x.active)} />
      <Testimonials />

    </>
  )
}
