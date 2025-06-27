import React from 'react'

export default function About({title}) {
    return (
        <>
            {/* <!-- About Start --> */}
            <div class="container-xxl py-5">
                <div class="container">
                    <div class="row g-5 align-items-center">
                        <div class="col-lg-6 wow fadeIn" data-wow-delay="0.1s">
                            <div class="about-img position-relative overflow-hidden p-5 pe-0">
                                <img class="img-fluid w-100" src="img/a1.jpg" />
                            </div>
                        </div>
                        <div class="col-lg-6 wow fadeIn" data-wow-delay="0.5s">
                            <h1 class="display-5 mb-4">We Provide Best Fresh Food To Your Door Steps</h1>
                            <p class="mb-4">Tempor erat elitr rebum at clita. Diam dolor diam ipsum sit. Aliqu diam amet diam et eos. Clita erat ipsum et lorem et sit, sed stet lorem sit clita duo justo magna dolore erat amet</p>
                            <p><i class="fa fa-check text-primary me-3"></i>Best Food</p>
                            <p><i class="fa fa-check text-primary me-3"></i>On Time Delivery</p>
                            <p><i class="fa fa-check text-primary me-3"></i>Costomer Support</p>
                            {
                                title !== "About Us" ?
                                <a class="btn btn-primary rounded-pill py-3 px-5 mt-3" href="">Read More</a>:""
                            }
                        </div>
                    </div>
                </div>
            </div>
            {/* <!-- About End --> */}
        </>
    )
}
