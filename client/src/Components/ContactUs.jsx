import React, { useState } from 'react'
import formValidator from '../FormValidators/formValidator'
import { useDispatch } from 'react-redux'
import { createContactUs } from '../Redux/ActionCreators/ContactUsActionCreators'

export default function ContactUs() {
    let [data, setData] = useState({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
    })

    let [errorMessage, setErrorMessage] = useState({
        name: "Name Feild is Mendatory",
        email: "Email Feild Is Meendatory",
        phone: "Phone Feild Is Mendatory",
        subject: "SubjectFeild Is Mendatory",
        message: "Message Feild Is Mendaory"
    })
    let [showMessage, setShowMessage] = useState("")

    let [show, setShow] = useState(false)
    let dispatch = useDispatch()

    function getInputData(e) {
        let { name, value } = e.target
        setErrorMessage((old) => {
            return {
                ...old,
                [name]: formValidator(e)
            }
        })

        setData((old) => {
            return {
                ...old,
                [name]: value
            }
        })
    }

    function postData(e) {
        e.preventDefault()
        let error = Object.values(errorMessage).find(x => x !== "")
        console.log(error)
        if (error) {
            setShow(true)
        }
        else {
            dispatch(createContactUs({ ...data, active: true, createdAt: new Date() }))
            setShowMessage("Thank to share Query With Us. Our Team contact You Soon")
            setData({
                name: "",
                email: "",
                phone: "",
                subject: "",
                message: ""
            })
        }
    }
    return (
        <>

            {/* <!-- Contact Start --> */}
            <div class="container-xxl py-6">
                <div class="container">
                    <div class="section-header text-center mx-auto mb-5 wow fadeInUp" data-wow-delay="0.1s" style={{ maxWidth: 500 }}>
                        <h1 class="display-5 mb-3">Contact Us</h1>
                        {showMessage ? <p className='h4 text-dark text-center'>{showMessage}</p> : <p className='h4 text-primary'>Feel Free To Contact Us For Your Queries</p>}
                    </div>
                    <div class="row g-5 justify-content-center">
                        <div class="col-lg-5 col-md-12 wow fadeInUp" data-wow-delay="0.1s">
                            <div class="bg-primary text-white d-flex flex-column justify-content-center h-100 p-5">
                                <h5 class="text-white">Call Us</h5>
                                <p class="mb-5"><i class="fa fa-phone-alt me-3"></i>+012 345 67890</p>
                                <h5 class="text-white">Email Us</h5>
                                <p class="mb-5"><i class="fa fa-envelope me-3"></i>info@example.com</p>
                                <h5 class="text-white">Whatsapp</h5>
                                <p class="mb-5"><i class="bi bi-whatsapp me-3 fs-5"></i>123 Street, New York, USA</p>
                                <h5 class="text-white">Follow Us</h5>
                                <div class="d-flex pt-2">
                                    <a class="btn btn-square btn-outline-light rounded-circle me-1" href=""><i class="fab fa-twitter"></i></a>
                                    <a class="btn btn-square btn-outline-light rounded-circle me-1" href=""><i class="fab fa-facebook-f"></i></a>
                                    <a class="btn btn-square btn-outline-light rounded-circle me-1" href=""><i class="fab fa-youtube"></i></a>
                                    <a class="btn btn-square btn-outline-light rounded-circle me-0" href=""><i class="fab fa-linkedin-in"></i></a>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-7 col-md-12 wow fadeInUp" data-wow-delay="0.5s">

                            <form onSubmit={postData}>
                                <div class="row card g-3 mt-2">
                                    <div class="col-md-12">
                                        <div class="form-floating">
                                            <input type="text" name='name' value={data.name} onChange={getInputData} class={`form-control border-3 ${show && errorMessage.name ? "border-danger" : "border-primary"}`} placeholder="Your Name" />
                                            <label for="name">Your Name</label>
                                            {show && errorMessage.name ? <p className='text-danger text-capitalize'>{errorMessage.name}</p> : null}
                                        </div>
                                    </div>
                                    <div class="col-md-12">
                                        <div class="form-floating">
                                            <input type="email" name='email' value={data.email} onChange={getInputData} class={`form-control border-3 ${show && errorMessage.email ? "border-danger" : "border-primary"}`} placeholder="Your Email" />
                                            <label for="email">Your Email</label>
                                            {show && errorMessage.email ? <p className='text-danger text-capitalize'>{errorMessage.email}</p> : null}
                                        </div>
                                    </div>
                                    <div class="col-12">
                                        <div class="form-floating">
                                            <input type="number" name='phone' value={data.phone} onChange={getInputData} class={`form-control border-3 ${show && errorMessage.phone ? "border-danger" : "border-primary"}`} placeholder="Your Phone Number" />
                                            <label for="subject">Phone</label>
                                            {show && errorMessage.phone ? <p className='text-danger text-capitalize'>{errorMessage.phone}</p> : null}
                                        </div>
                                    </div>
                                    <div class="col-12">
                                        <div class="form-floating">
                                            <input type="text" name='subject' value={data.subject} onChange={getInputData} class={`form-control border-3 ${show && errorMessage.subject ? "border-danger" : "border-primary"}`} placeholder="Subject" />
                                            <label for="subject">Subject</label>
                                            {show && errorMessage.subject ? <p className='text-danger text-capitalize'>{errorMessage.subject}</p> : null}
                                        </div>
                                    </div>
                                    <div class="col-12">
                                        <div class="form-floating">
                                            <textarea
                                                onChange={getInputData}
                                                value={data.message}
                                                className={`form-control border-3 ${show && errorMessage.message ? "border-danger" : "border-primary"}`}
                                                name="message"
                                                placeholder="Leave a message here..."
                                                style={{ height: 150 }}
                                            ></textarea>
                                            <label for="message">Message</label>
                                            {show && errorMessage.message ? <p className='text-danger text-capitalize'>{errorMessage.message}</p> : null}
                                        </div>
                                    </div>
                                    <div class="col-12">
                                        <button class="btn btn-primary rounded-pill py-3 px-5" type="submit">Send Message</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            {/* <!-- Contact End --> */}
        </>
    )
}
