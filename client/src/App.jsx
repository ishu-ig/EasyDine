import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Navbar from './Components/Navbar'
import Footer from './Components/Footer'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import FeaturesPage from './pages/FeaturesPage'
import ProductPage from './pages/ProductPage'
import TestimonialPage from './pages/TestimonialPage'
import ContactUsPage from './pages/ContactUsPage'
import ErrorPage from './pages/ErrorPage'
import ResturentPage from './pages/ResturentPage'
import ProductDetailPage from './pages/ProductDetailPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import ResturentDetailPage from './pages/ResturentDetailPage'
import ProfilePage from './pages/ProfilePage'
import UpdateProfilePage from './pages/UpdateProfilePage'
import CartPage from './pages/CartPage'
import WishlistPage from './pages/WishlistPage'
import CheckoutPage from './pages/CheckoutPage'
import ConfirmationPage from './pages/ConfirmationPage'
import OrderPage from './pages/OrderPage'
import OrderDetailPage from './pages/OrderDetailPage'
import ResturentBookingPage from './pages/ResturentBookingPage'
import BookingPage from './pages/BookingPage'
import ForgetPasswordPage1 from './pages/ForgetPasswordPage1'
import ForgetPasswordPage2 from './pages/ForgetPasswordPage2'
import ForgetPasswordPage3 from './pages/ForgetPasswordPage3'
import Payment from './pages/Payment'




export default function App() {
  return (
    <BrowserRouter>
        <Navbar />
            <Routes>
                <Route path='/' element={<HomePage />}/>
                <Route path='/about' element={<AboutPage />}/>
                <Route path='/product' element={<ProductPage />}/>
                <Route path='/product/:_id' element={<ProductDetailPage />}/>
                <Route path='/resturent' element={<ResturentPage/>}/>
                <Route path='/resturent/:_id' element={<ResturentDetailPage/>}/>
                <Route path='/confirmationBooking/:_id' element={<ResturentBookingPage/>}/>
                <Route path='/booking' element={<BookingPage/>}/>
                <Route path='/testimonial' element={<TestimonialPage />}/>
                <Route path='/feature' element={<FeaturesPage />}/>
                <Route path='/contactus' element={<ContactUsPage />}/>
                <Route path='/*' element={<ErrorPage />}/>

                <Route path='/login' element={<LoginPage />}/>
                <Route path='/signup' element={<SignupPage />}/>
                <Route path='/profile' element={<ProfilePage />}/>
                <Route path='/update-profile' element={<UpdateProfilePage />}/>
                <Route path='/forgetPassword-1' element={<ForgetPasswordPage1/>}/>
                <Route path='/forgetPassword-2' element={<ForgetPasswordPage2/>}/>
                <Route path='/forgetPassword-3' element={<ForgetPasswordPage3/>}/>
                <Route path='/payment/:type/:_id' element={<Payment/>}/>


                <Route path='/cart' element={<CartPage />}/>
                <Route path='/checkout' element={<CheckoutPage />}/>
                <Route path='/confirmation/:type' element={<ConfirmationPage />}/>
                <Route path='/order' element={<OrderPage />}/>
                <Route path='/order-detail/:_id' element={<OrderDetailPage />}/>
                <Route path='/wishlist' element={<WishlistPage />}/>
                
            </Routes>
        <Footer />
    </BrowserRouter>
    
    
  )
}
