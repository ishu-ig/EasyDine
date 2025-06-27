import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { deleteWishlist, getWishlist } from '../Redux/ActionCreators/WishlistActionCreators'
import { createCart, getCart } from "../Redux/ActionCreators/CartActionCreators"

import { Link, useNavigate } from 'react-router-dom'

export default function WishlistPage() {
  let [wishlist, setWislist] = useState([])
  let WishlistStateData = useSelector(state => state.WishlistStateData)
  let CartStateData = useSelector((state) => state.CartStateData)
  let dispatch = useDispatch()
  let [flag, setFlag] = useState(false)
  let navigate = useNavigate()

  useEffect(() => {
    (() => {
      dispatch(getWishlist())
    })()
  }, [])

  function deleteRecord(_id) {
    if (window.confirm("Are You Sure To Delete This Item From Cart")) {
      dispatch(deleteWishlist({ _id: _id }))
      setFlag(true)
    }
  }



  useEffect(() => {
    (() => {
      if (WishlistStateData.length) {
        setWislist(WishlistStateData.filter(x => x.user?._id === localStorage.getItem("userid")))
      }
    })()
  }, [WishlistStateData.length])

  function addToCart(item) {
    if (localStorage.getItem("login")) {
      // Check if the item already exists in the cart
      let existingItem = CartStateData.find(x => x.product._id === item.product._id && x.user?._id === localStorage.getItem("userid"));

      if (!existingItem) {
        // If the item is not in the cart, create a new entry with qty 1
        let newItem = {
          user: localStorage.getItem("userid"),
          product: item.product._id,
          qty: 1,  // Initialize quantity to 1
          total: item.product.finalPrice * 1,  // Total is price * qty
        };

        dispatch(createCart(newItem)); // Add to the cart
      }

      navigate("/cart");  // Navigate to the cart page
    } else {
      alert("Login To Add Item In Cart And For Placing Order");
      navigate("/login");
    }
  }
  useEffect(() => {
    (() => {
      dispatch(getCart())
    })()
  }, [CartStateData.length])

  return (
    <>
      <div className="container my-4">
        <h3 className="text-center mb-4">My Wishlist</h3>
        {
          wishlist.length ? (
            <div className="table-responsive">
              <table className="table table-bordered text-center">
                <thead className="table-primary text-center">
                  <tr>
                    <th>Image</th>
                    <th>Product Name</th>
                    <th>Price (₹)</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {wishlist.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <img
                          src={`${process.env.REACT_APP_BACKEND_SERVER}/${item.product.pic}`}
                          alt={item.product.name}
                          style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                        />
                      </td>
                      <td>{item.product.name}</td>
                      <td>
                        <del className='text-danger'>&#8377;{item.product?.basePrice}</del>
                        <strong className="ms-2 text-success">&#8377;{item.product?.finalPrice}</strong>
                        <sup className='text-success'> {item.product?.discount}%</sup>
                      </td>
                      <td>
                        <button onClick={() => addToCart(item)} className="btn btn-success btn-sm me-2 w-25">
                          Move to Cart
                        </button>
                        <button
                          className="btn btn-danger btn-sm w-25"
                          onClick={() => deleteRecord(item._id)}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center my-5">
              <h4>Your wishlist is empty</h4>
              <Link to="/product" className="btn btn-primary">Shop Now</Link>
            </div>
          )
        }
      </div>
    </>
  )
}
