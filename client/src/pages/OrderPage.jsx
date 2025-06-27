import React, { useEffect, useState } from 'react'
import HeroSection from '../Components/HeroSection'
import { useDispatch, useSelector } from 'react-redux'
import { getCheckout } from '../Redux/ActionCreators/CheckoutActionCreators'
import { Link } from 'react-router-dom'
import Order from '../Components/Order'

export default function OrderPage({ title, data }) {
    let CheckoutStateData = useSelector(state => state.CheckoutStateData)
    let [order, setOrder] = useState([])

    let dispatch = useDispatch()

    useEffect(() => {
        dispatch(getCheckout())
    }, [CheckoutStateData.length]);

    return (
        <>
            <HeroSection title="Orders" />
            <Order title="Order" data={CheckoutStateData} />
        </>
    )
}
