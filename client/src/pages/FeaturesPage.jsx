import React from 'react';
import HeroSection from '../Components/HeroSection';
import Features from '../Components/Features';

export default function FeaturesPage() {
    return (
        <>
            <HeroSection title="Features" />
            <Features />

            {/* Additional Information About Features */}
            <div className="container my-5">
                <h2 className="text-center mb-4">Why Choose Our Service?</h2>
                <p className="text-center mx-auto mb-5" style={{ maxWidth: "700px" }}>
                    Our platform ensures a seamless food ordering experience with a variety of features designed to enhance convenience, speed, and customization.
                    From eco-friendly packaging to express delivery, we prioritize quality and efficiency.
                </p>

                <div className="row g-4">
                    {/* Feature 1 - Real-time Order Tracking */}
                    <div className="col-lg-4 col-md-6">
                        <div className=" text-center p-4 p-xl-5 shadow-sm rounded" style={{ minHeight: 325, backgroundColor: "	#F8F8F8" }}>
                            <i className='fa fa-map text-primary mb-4' style={{ fontSize: "70px" }}></i>
                            <h4 className="mb-3">Real-time Order Tracking</h4>
                            <p>Track your order from preparation to doorstep with live updates.</p>
                        </div>
                    </div>

                    {/* Feature 2 - AI-Powered Recommendations */}
                    <div className="col-lg-4 col-md-6">
                        <div className=" text-center p-4 p-xl-5 shadow-sm rounded" style={{ minHeight: 325, backgroundColor: "	#F8F8F8" }}>
                            <i className='fa fa-robot text-primary mb-4' style={{ fontSize: "70px" }}></i>
                            <h4 className="mb-3">AI-Powered Recommendations</h4>
                            <p>Discover dishes based on your past orders and dietary preferences.</p>
                        </div>
                    </div>

                    {/* Feature 3 - Secure Online Payments */}
                    <div className="col-lg-4 col-md-6">
                        <div className=" text-center p-4 p-xl-5 shadow-sm rounded" style={{ minHeight: 325, backgroundColor: "	#F8F8F8" }}>
                            <i className='fa fa-credit-card text-primary mb-4' style={{ fontSize: "70px" }}></i>
                            <h4 className="mb-3">Secure Online Payments</h4>
                            <p>Pay safely using credit/debit cards, UPI, or digital wallets.</p>
                        </div>
                    </div>
                </div>

                {/* Additional Benefits Section */}
                <div className="row g-4 mt-4">
                    {/* Feature 4 - Group Ordering */}
                    <div className="col-lg-4 col-md-6">
                        <div className=" text-center p-4 p-xl-5 shadow-sm rounded" style={{ minHeight: 325, backgroundColor: "	#F8F8F8" }}>
                            <i className='fa fa-users text-primary mb-4' style={{ fontSize: "70px" }}></i>
                            <h4 className="mb-3">Group Ordering</h4>
                            <p>Order together with friends and split payments easily.</p>
                        </div>
                    </div>

                    {/* Feature 5 - Scheduled Deliveries */}
                    <div className="col-lg-4 col-md-6">
                        <div className=" text-center p-4 p-xl-5 shadow-sm rounded" style={{ minHeight: 325, backgroundColor: "	#F8F8F8" }}>
                            <i className='fa fa-calendar-alt text-primary mb-4' style={{ fontSize: "70px" }}></i>
                            <h4 className="mb-3">Scheduled Deliveries</h4>
                            <p>Plan your meals by pre-ordering at your preferred time.</p>
                        </div>
                    </div>

                    {/* Feature 6 - Exclusive Discounts */}
                    <div className="col-lg-4 col-md-6">
                        <div className="text-center p-4 p-xl-5 shadow-sm rounded" style={{ minHeight: 325, backgroundColor: "	#F8F8F8" }}>
                            <i className='fa fa-tags text-primary mb-4' style={{ fontSize: "70px" }}></i>
                            <h4 className="mb-3">Exclusive Discounts</h4>
                            <p>Enjoy special deals, coupons, and seasonal offers.</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
