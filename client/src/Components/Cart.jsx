import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteCart, getCart, updateCart } from '../Redux/ActionCreators/CartActionCreators';
import { createCheckout } from '../Redux/ActionCreators/CheckoutActionCreators';
import { Link, useNavigate } from 'react-router-dom';

export default function Cart({ title, data }) {
  const [cart, setCart] = useState([]);
  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [total, setTotal] = useState(0);
  const [mode, setMode] = useState('COD');

  const CartStateData = useSelector((state) => state.CartStateData);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  async function placeOrder() {
    let response = await fetch(`${process.env.REACT_APP_BACKEND_SERVER}/api/user/${localStorage.getItem("userid")}`, {
      method: "GET",
      headers: {
        'content-type': 'application/json',
        "authorization": localStorage.getItem("token")
      },
    })
    response = await response.json()
    if (response.data.address === "" || response.data.state === "" || response.data.city === "" || response.data.pin === "") {
      navigate("/update-profile")
    }
    else {
      const order = {
        user: localStorage.getItem('userid'),
        orderStatus: 'Order is Placed',
        paymentMode: mode,
        paymentStatus: 'Pending',
        subtotal: subtotal,
        deliveryCharge: deliveryCharge,
        total: total,
        date: new Date(),
        products: [...cart],
      };
      dispatch(createCheckout(order));

      // Delete each item from the cart
      cart.forEach((item) => dispatch(deleteCart({ _id: item._id })));

      // Clear the local cart state
      setCart([]);

      if (mode === "COD") 
        // Navigate to the confirmation page
      navigate('/confirmation');
      else 
      navigate("/payment/checkout/-1")
      
    }
  }

  function deleteRecord(_id) {
    if (window.confirm('Are you sure you want to delete this item from the cart?')) {
      dispatch(deleteCart({ _id }));
    }
  }

  function updateRecord(_id, option) {
    const updatedCart = [...cart];
    const index = updatedCart.findIndex((item) => item._id === _id);
    if (index === -1) return;

    const item = { ...updatedCart[index] };
    if (option === 'DEC' && item.qty > 1) {
      item.qty -= 1;
      item.total -= item.product?.finalPrice;
    } else if (option === 'INC') {
      item.qty += 1;
      item.total += item.product?.finalPrice;
    }

    updatedCart[index] = item;
    setCart(updatedCart);
    dispatch(updateCart(item));
    calculate(updatedCart);
  }

  function calculate(data) {
    let subtotal = data.reduce((sum, item) => sum + item.total, 0);
    let charge = subtotal > 0 && subtotal < 200 ? 70 : 0;
    setSubtotal(subtotal);
    setDeliveryCharge(charge);
    setTotal(subtotal + charge);
  }

  function getAPIData() {
    dispatch(getCart());
    if (data) {
      setCart(data);
      calculate(data);
    } else if (CartStateData.length) {
      setCart(CartStateData);
      calculate(CartStateData);
    } else {
      setCart([]);
      calculate([]);
    }
  }

  useEffect(() => {
    getAPIData();
  }, [CartStateData, data]);

  return (
    <>
      <h5 className="text-light bg-primary text-center p-2">
        {title === 'Cart' ? 'Cart Section' : data ? 'Items In Order' : 'Item in Cart'}
      </h5>
      {cart.length ? (
        <>
          <div className="table-responsive">
            <table className="table table-bordered border-3 border-primary">
              <thead>
                <tr>
                  <th></th>
                  <th>Name</th>
                  <th>Maincategory</th>
                  <th>Restaurant</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                  {title !== 'Checkout' && <th></th>}
                </tr>
              </thead>
              <tbody>
                {cart.map((item) => (
                  <tr key={item._id}>
                    <td>
                      <Link to={`${process.env.REACT_APP_BACKEND_SERVER}/${item.product.pic}`} target="_blank" rel="noreferrer">
                        <img src={`${process.env.REACT_APP_BACKEND_SERVER}/${item.product.pic}`} height={50} width={80} alt="Product" />
                      </Link>
                    </td>
                    <td>{item.product?.name}</td>
                    <td>{item.product.maincategory?.name}</td>
                    <td>{item.product.resturent?.name}</td>
                    <td>&#8377;{item.product?.finalPrice}</td>
                    <td>
                      <div className="d-flex">
                        {title !== 'Checkout' && (
                          <button className="btn btn-primary me-" onClick={() => updateRecord(item._id, 'DEC')}>
                            <i className="fa fa-minus"></i>
                          </button>
                        )}
                        {title !== "Checkout" ? <h5 className="text-center mt-2 " style={{ width: '50%' }}>{item.qty}</h5> : <h5 className="text-center mt-2 ms-4" style={{ width: '50%' }}>{item.qty}</h5>}
                        {title !== 'Checkout' && (
                          <button className="btn btn-primary" onClick={() => updateRecord(item._id, 'INC')}>
                            <i className="fa fa-plus"></i>
                          </button>
                        )}
                      </div>
                    </td>
                    <td>&#8377;{item.total}</td>
                    {title !== 'Checkout' && (
                      <td>
                        <button className="btn btn-danger" onClick={() => deleteRecord(item._id)}>
                          <i className="fa fa-trash"></i>
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!data && (
            <div className="row mb-3">
              <div className={`${title !== 'Checkout' ? 'col-md-6' : 'col-md-12'}`}>
                <table className="table table-bordered border-3 border-primary">
                  <tbody>
                    <tr><th>Subtotal</th><td>&#8377;{subtotal}</td></tr>
                    <tr><th>Delivery Charge</th><td>&#8377;{deliveryCharge}</td></tr>
                    <tr><th>Total</th><td>&#8377;{total}</td></tr>
                    {title === 'Checkout' && (
                      <tr>
                        <th>Payment Mode</th>
                        <td>
                          <select className="form-select border-3 border-primary" onChange={(e) => setMode(e.target.value)}>
                            <option value="COD">Cash On Delivery</option>
                            <option value="Net Banking">Net Banking/UPI/Card</option>
                          </select>
                        </td>
                      </tr>
                    )}
                    <tr>
                      <td colSpan={2}>
                        {title !== 'Checkout' ? (
                          <Link to="/checkout" className="btn btn-primary w-100">Proceed To Checkout</Link>
                        ) : (
                          <button className="btn btn-primary w-100" onClick={placeOrder}>Place Order</button>
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="py-5 text-center">
          <h3>No Item In Cart</h3>
          <Link to="/product" className="btn btn-primary">Shop Now</Link>
        </div>
      )}
    </>
  );
}