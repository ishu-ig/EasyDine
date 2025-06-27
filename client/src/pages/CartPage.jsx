import React from 'react'
import HeroSection from "../Components/HeroSection"
import Cart from '../Components/Cart'

export default function CartPage() {
  return (
    <>
      <HeroSection title="Cart" />
      <div className="container">
        <div className="container card p-5" style={{ backgroundColor: '#F8F8F8' }}>
          <Cart title="Cart" />
        </div>
      </div>
    </>
  )
}
