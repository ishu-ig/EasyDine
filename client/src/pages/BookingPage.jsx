import React, { useEffect, useState } from 'react'
import HeroSection from '../Components/HeroSection'
import Order from '../Components/Order'
import { useDispatch, useSelector } from 'react-redux'
import { getBooking } from '../Redux/ActionCreators/BookingActionCreators'

export default function BookingPage() {
    let BookingStateData = useSelector(state => state.BookingStateData)
    let [booking, setBooking] = useState([])

    let dispatch = useDispatch()

    useEffect(() => {
        dispatch(getBooking());
    }, [BookingStateData.length]);

  return (
    <>
        <HeroSection title="Bookings" />
        <Order title="Booking" data={BookingStateData} />
    </>
  )
}
