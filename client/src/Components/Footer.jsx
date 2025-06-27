import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

export default function Footer() {
  let [email, setEmail] = useState("")
  let [message, setMessage] = useState("")


  async function postData(e) {
    e.preventDefault()
    if (email.length === 0) {
      setMessage("Please Enter a valid Email Address")
    }
    else {
      let response = await fetch(`${process.env.REACT_APP_BACKEND_SERVER}/api/newsletter`, {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({ email: email })
      })
      response = await response.json()
      if (response.result === "Done") {
        setMessage("Thanks to Subscribe Our Newsletter Service")
        setEmail("")
      }
      else
        setMessage(response.reason?.email)
    }
  }
  return (
    <>
      {/* <!-- Footer Start --> */}
      <div className="container-fluid bg-dark footer mt-5 pt-5 wow fadeIn" data-wow-delay="0.1s">
        <div className="container-fluid py-5 px-5">
          <div className="row g-4">
            <div className="col-lg-3 col-md-6">
              <h1 className="fw-bold text-primary mb-4">F<span className="text-secondary">oo</span>dy</h1>
              <p>We proudly offer a wide variety of delicious and flavorful dishes, carefully crafted to satisfy every palate and delight every taste</p>
              <div className="d-flex pt-2">
                <Link className="btn btn-square btn-outline-light rounded-circle me-1" href=""><i className="fab fa-twitter"></i></Link>
                <Link className="btn btn-square btn-outline-light rounded-circle me-1" href=""><i className="fab fa-facebook-f"></i></Link>
                <Link className="btn btn-square btn-outline-light rounded-circle me-1" href=""><i className="fab fa-youtube"></i></Link>
                <Link className="btn btn-square btn-outline-light rounded-circle me-0" href=""><i className="fab fa-linkedin-in"></i></Link>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <h4 className="text-light mb-4">Address</h4>
              <Link to="" className='text-muted' target='_blank' rel="noreferrer"><p><i className="fa fa-map-marker-alt me-3"></i>123 Street, New York, USA</p></Link>
              <Link to="tel:+91-85693547" className='text-muted' target='_blank' rel="noreferrer"><p><i className="fa fa-phone-alt me-3"></i>+91-85693547</p></Link>
              <Link to="mailto:ishaangupta@gmail.com" className='text-muted' target='_blank' rel="noreferrer"><p><i className="fa fa-envelope me-3"></i>info@example.com</p></Link>
              <Link to="https://wa.me/856935475" className='text-muted' target='_blank' rel="noreferrer"><p><i className="fa fa-envelope me-3"></i>info@example.com</p></Link>
            </div>
            <div className="col-lg-3 col-md-6">
              <h4 className="text-light mb-4">Quick Links</h4>
              <Link className="btn btn-link" href="">About Us</Link>
              <Link className="btn btn-link" href="">Contact Us</Link>
              <Link className="btn btn-link" href="">Our Services</Link>
              <Link className="btn btn-link" href="">Terms & Condition</Link>
              <Link className="btn btn-link" href="">Support</Link>
            </div>
            <div className="col-lg-3 col-md-6">
              <h4 className="text-light mb-4">Newsletter</h4>
              {message ? message : "Suncribe to our NewsLetter Service to Get Latest Update About Our New Product And Great Deals"}
              <div className="position-relative mx-auto mt-3" style={{ maxWidth: 400 }}>
                <form onSubmit={postData}>
                  <input name='email' className="form-control bg-transparent w-100 py-3 ps-4 pe-5" type="email" onChange={(e) => setEmail(e.target.value)} value={email} placeholder="Your email" />
                  <button type="submit" className="btn btn-primary py-2 position-absolute top-0 end-0 mt-2 me-2">SignUp</button>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div className="container-fluid copyright">
          <div className="container">
            <div className="row">
              <div className="col-md-6 text-center text-md-start mb-3 mb-md-0">
                &copy; <Link href="#">Your Site Name</Link>, All Right Reserved.
              </div>
              <div className="col-md-6 text-center text-md-end">
                Designed By <Link to="https://ishu-ig.github.io/My-Portfolio-Website/" target='_blank' rel="noreferrer">Ishaan</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <!-- Footer End --> */}

    </>
  )
}
