import React from 'react'

export default function Features() {
    return (
        <>
            {/* <!-- Feature Start --> */}
            <div class="container-fluid bg-light bg-icon my-5 py-6">
                <div class="container">
                    <div class="section-header text-center mx-auto mb-5 wow fadeInUp" data-wow-delay="0.1s" style={{ maxWidth: 500 }}>
                        <h1 class="display-5 mb-3">Our Features</h1>
                        <p>Tempor ut dolore lorem kasd vero ipsum sit eirmod sit. Ipsum diam justo sed rebum vero dolor duo.</p>
                    </div>
                    <div class="row g-4">
                        <div class="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.1s">
                            <div class="bg-white text-center h-100 p-4 p-xl-5">
                                <span><i className='fa fa-truck text-primary mb-4' style={{fontSize:"80px"}}></i></span>
                                <h4 class="mb-3">Free Delivery</h4>
                                <p class="mb-4">Enjoy free delivery on select restaurants and orders above a certain amount.</p>
                                <a class="btn btn-outline-primary border-2 py-2 px-4 rounded-pill" href="">Read More</a>
                            </div>
                        </div>
                        <div class="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.3s">
                            <div class="bg-white text-center h-100 p-4 p-xl-5">
                            <i className='fa fa-bicycle text-primary mb-4 mt-2' style={{fontSize:70}}></i>
                                <h4 class="mb-3">Express & Fast Delivery</h4>
                                <p class="mb-4">Get your food delivered quickly with express delivery options.	</p>
                                <a class="btn btn-outline-primary border-2 py-2 px-4 rounded-pill" href="">Read More</a>
                            </div>
                        </div>
                        <div class="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.5s">
                            <div class="bg-white text-center h-100 p-4 p-xl-5">
                            <i className='fa fa-clock text-primary mb-4 mt-2' style={{fontSize:70}}></i>
                                <h4 class="mb-3">24/7 Food Availability</h4>
                                <p class="mb-4">Order anytime, day or night, from 24/7 open restaurants.</p>
                                <a class="btn btn-outline-primary border-2 py-2 px-4 rounded-pill" href="">Read More</a>
                            </div>
                        </div>
                    </div>
                    <div class="row g-4 mt-3">
                        <div class="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.1s">
                            <div class="bg-white text-center h-100 p-4 p-xl-5">
                            <i className='fa fa-leaf text-primary mb-4 mt-2' style={{fontSize:70}}></i>
                                <h4 class="mb-3">Eco-Friendly Packaging</h4>
                                <p class="mb-4">Restaurants use biodegradable and sustainable packaging for deliveries.</p>
                                <a class="btn btn-outline-primary border-2 py-2 px-4 rounded-pill" href="">Read More</a>
                            </div>
                        </div>
                        <div class="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.3s">
                            <div class="bg-white text-center h-100 p-4 p-xl-5">
                                <i className='fa fa-map-marker-alt text-primary mb-4 mt-2' style={{fontSize:70}}></i>
                                <h4 class="mb-3">Multiple Address Support</h4>
                                <p class="mb-4">Save and manage multiple delivery addresses for easy ordering.</p>
                                <a class="btn btn-outline-primary border-2 py-2 px-4 rounded-pill" href="">Read More</a>
                            </div>
                        </div>
                        <div class="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.5s">
                            <div class="bg-white text-center h-100 p-4 p-xl-5">
                            <i className='fa fa-edit text-primary mb-4 mt-2' style={{fontSize:70}}></i>
                                <h4 class="mb-3">Customizable Orders</h4>
                                <p class="mb-4">Modify ingredients, spice levels, or portion sizes as per your preference.</p>
                                <a class="btn btn-outline-primary border-2 py-2 px-4 rounded-pill" href="">Read More</a>
                            </div>
                        </div>
                    </div>
                    
                </div>
            </div>
            {/* <!-- Feature End --> */}

        </>
    )
}
