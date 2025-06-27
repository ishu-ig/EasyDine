import React from 'react';
import HeroSection from '../Components/HeroSection';
import Testimonials from '../Components/Testimonials';

export default function TestimonialPage() {
    return (
        <>
            <HeroSection title="Testimonials" />
            <Testimonials />

            {/* Additional Information Section */}
            <div className="container my-5">
                <h2 className="text-center mb-4">Why Our Customers Love Us</h2>
                <p className="text-center mx-auto mb-5" style={{ maxWidth: "700px" }}>
                    We take pride in delivering top-quality service and an outstanding food experience.
                    Hear from our happy customers about how our platform has made their lives easier and meals more delicious.
                </p>

                <div className="row g-4">
                    {/* Reason 1 - High Customer Satisfaction */}
                    <div className="col-lg-4 col-md-6">
                        <div className="bg-white text-center p-4 p-xl-5 shadow-sm rounded">
                            <i className='fa fa-star text-primary mb-4' style={{ fontSize: "70px" }}></i>
                            <h4 className="mb-3">High Customer Satisfaction</h4>
                            <p>90%+ of our customers rate us 5 stars for quality, speed, and service.</p>
                        </div>
                    </div>

                    {/* Reason 2 - Fast and Reliable Delivery */}
                    <div className="col-lg-4 col-md-6">
                        <div className="bg-white text-center p-4 p-xl-5 shadow-sm rounded">
                            <i className='fa fa-shipping-fast text-primary mb-4' style={{ fontSize: "70px" }}></i>
                            <h4 className="mb-3">Fast and Reliable Delivery</h4>
                            <p>Customers love our timely deliveries, ensuring fresh and hot meals.</p>
                        </div>
                    </div>

                    {/* Reason 3 - Easy Ordering Process */}
                    <div className="col-lg-4 col-md-6">
                        <div className="bg-white text-center p-4 p-xl-5 shadow-sm rounded">
                            <i className='fa fa-mobile-alt text-primary mb-4' style={{ fontSize: "70px" }}></i>
                            <h4 className="mb-3">Easy Ordering Process</h4>
                            <p>Our intuitive interface allows seamless food ordering in just a few clicks.</p>
                        </div>
                    </div>
                </div>

                {/* Additional Benefits Section */}
                <div className="row g-4 mt-4">
                    {/* Reason 4 - Affordable Prices */}
                    <div className="col-lg-4 col-md-6">
                        <div className="bg-white text-center p-4 p-xl-5 shadow-sm rounded">
                            <i className='fa fa-tag text-primary mb-4' style={{ fontSize: "70px" }}></i>
                            <h4 className="mb-3">Affordable Prices</h4>
                            <p>Customers enjoy great meals at budget-friendly prices.</p>
                        </div>
                    </div>

                    {/* Reason 5 - Excellent Customer Support */}
                    <div className="col-lg-4 col-md-6">
                        <div className="bg-white text-center p-4 p-xl-5 shadow-sm rounded">
                            <i className='fa fa-headset text-primary mb-4' style={{ fontSize: "70px" }}></i>
                            <h4 className="mb-3">Excellent Customer Support</h4>
                            <p>Our 24/7 support ensures customers get help whenever needed.</p>
                        </div>
                    </div>

                    {/* Reason 6 - Customizable Orders */}
                    <div className="col-lg-4 col-md-6">
                        <div className="bg-white text-center p-4 p-xl-5 shadow-sm rounded">
                            <i className='fa fa-edit text-primary mb-4' style={{ fontSize: "70px" }}></i>
                            <h4 className="mb-3">Customizable Orders</h4>
                            <p>Customers can modify meals to suit their dietary preferences.</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
