import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteCart, getCart, updateCart } from '../Redux/ActionCreators/CartActionCreators';
import { createCheckout } from '../Redux/ActionCreators/CheckoutActionCreators';
import { Link, useNavigate } from 'react-router-dom';

const C = {
  primary: '#C8400A',
  primaryLight: 'rgba(200,64,10,0.08)',
  primaryBorder: 'rgba(200,64,10,0.18)',
  dark: '#1C1009',
  gray: '#7A6E65',
  bg: 'linear-gradient(135deg,#FDF6EE 0%,#FFF8F3 100%)',
  card: {
    background: '#FFFBF7',
    borderRadius: 20,
    border: '1px solid rgba(200,64,10,0.12)',
    boxShadow: '0 4px 20px rgba(28,16,9,0.07)',
  },
};

// Same grid template used for BOTH header and every data row — this guarantees alignment
const COL_NORMAL   = '76px 1.8fr 1.2fr 1.4fr 80px 120px 80px 52px';
const COL_CHECKOUT = '76px 1.8fr 1.2fr 1.4fr 80px  60px 80px';

export default function Cart({ title, data }) {
  const [cart, setCart]                     = useState([]);
  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const [subtotal, setSubtotal]             = useState(0);
  const [total, setTotal]                   = useState(0);
  const [mode, setMode]                     = useState('COD');

  const CartStateData = useSelector((s) => s.CartStateData);
  const dispatch      = useDispatch();
  const navigate      = useNavigate();

  async function placeOrder() {
    let res = await fetch(
      `${process.env.REACT_APP_BACKEND_SERVER}/api/user/${localStorage.getItem('userid')}`,
      { method: 'GET', headers: { 'content-type': 'application/json', authorization: localStorage.getItem('token') } }
    );
    res = await res.json();
    if (!res.data.address || !res.data.state || !res.data.city || !res.data.pin) {
      navigate('/update-profile');
    } else {
      const order = {
        user: localStorage.getItem('userid'),
        orderStatus: 'Order is Placed', paymentMode: mode,
        paymentStatus: 'Pending', subtotal, deliveryCharge, total,
        date: new Date(), products: [...cart],
      };
      dispatch(createCheckout(order));
      cart.forEach((item) => dispatch(deleteCart({ _id: item._id })));
      setCart([]);
      mode === 'COD' ? navigate('/confirmation') : navigate('/payment/checkout/-1');
    }
  }

  function deleteRecord(_id) {
    if (window.confirm('Remove this item from cart?')) dispatch(deleteCart({ _id }));
  }

  function updateRecord(_id, option) {
    const updated = [...cart];
    const idx     = updated.findIndex((i) => i._id === _id);
    if (idx === -1) return;
    const item = { ...updated[idx] };
    if (option === 'DEC' && item.qty > 1) { item.qty--; item.total -= item.product?.finalPrice; }
    else if (option === 'INC')            { item.qty++; item.total += item.product?.finalPrice; }
    updated[idx] = item;
    setCart(updated);
    dispatch(updateCart(item));
    recalculate(updated);
  }

  function recalculate(items) {
    const sub    = items.reduce((s, i) => s + i.total, 0);
    const charge = sub > 0 && sub < 200 ? 70 : 0;
    setSubtotal(sub); setDeliveryCharge(charge); setTotal(sub + charge);
  }

  useEffect(() => {
    dispatch(getCart());
    const src = data || CartStateData || [];
    setCart(src); recalculate(src);
  }, [CartStateData, data]);

  const isCheckout  = title === 'Checkout';
  const isOrderView = !!data;
  const cols        = isCheckout ? COL_CHECKOUT : COL_NORMAL;

  const headCell = (align = 'left') => ({
    fontSize: '0.7rem', fontWeight: 700, color: C.primary,
    textTransform: 'uppercase', letterSpacing: '0.07em',
    display: 'flex', alignItems: 'center',
    justifyContent: align === 'center' ? 'center' : align === 'right' ? 'flex-end' : 'flex-start',
  });

  const qtyBtn = (variant) => ({
    width: 30, height: 30, borderRadius: '50%', border: 'none', cursor: 'pointer', flexShrink: 0,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: 700, fontSize: 17, lineHeight: 1, transition: 'all 0.18s',
    background: variant === 'plus' ? C.primary : C.primaryLight,
    color:      variant === 'plus' ? '#fff'    : C.primary,
  });

  return (
    <div style={{ background: C.bg, minHeight: '60vh', padding: '40px 16px' }}>
      <div style={{ maxWidth: 1040, margin: '0 auto' }}>

        {/* Page Header */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <span style={{
            display: 'inline-block', background: C.primaryLight, color: C.primary,
            fontSize: '0.74rem', fontWeight: 700, letterSpacing: '0.09em',
            textTransform: 'uppercase', padding: '5px 18px', borderRadius: 50, marginBottom: 10,
          }}>
            {isOrderView ? 'Order Items' : isCheckout ? 'Checkout' : 'My Cart'}
          </span>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: '2rem', fontWeight: 700, color: C.dark, margin: 0 }}>
            {isOrderView ? 'Items In Order' : isCheckout ? 'Review Your Order' : 'Your Cart'}
          </h2>
        </div>

        {cart.length ? (
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'flex-start' }}>

            {/* ── Items Card ── */}
            <div style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
              <div style={{ ...C.card, overflow: 'hidden' }}>

                {/* Desktop Header — identical grid to data rows */}
                <div
                  className="d-none d-lg-grid"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: cols,
                    columnGap: 16,
                    padding: '13px 22px',
                    background: C.primaryLight,
                    borderBottom: '1px solid rgba(200,64,10,0.10)',
                    alignItems: 'center',
                  }}
                >
                  <div />                                          {/* image */}
                  <div style={headCell()}>Item</div>
                  <div style={headCell()}>Category</div>
                  <div style={headCell()}>Restaurant</div>
                  <div style={headCell('right')}>Price</div>
                  <div style={headCell('center')}>Quantity</div>
                  <div style={headCell('right')}>Total</div>
                  {!isCheckout && <div />}                        {/* delete */}
                </div>

                {/* Desktop Data Rows */}
                {cart.map((item, idx) => (
                  <div
                    key={item._id}
                    style={{ borderBottom: idx < cart.length - 1 ? '1px solid rgba(200,64,10,0.07)' : 'none' }}
                  >
                    {/* Desktop row — same grid template as header */}
                    <div
                      className="d-none d-lg-grid"
                      style={{
                        display: 'grid',
                        gridTemplateColumns: cols,
                        columnGap: 16,
                        padding: '14px 22px',
                        alignItems: 'center',
                      }}
                    >
                      {/* Image */}
                      <Link to={`${process.env.REACT_APP_BACKEND_SERVER}/${item.product.pic}`} target="_blank">
                        <img
                          src={`${process.env.REACT_APP_BACKEND_SERVER}/${item.product.pic}`}
                          style={{ width: 68, height: 52, objectFit: 'cover', borderRadius: 10, border: `1.5px solid ${C.primaryBorder}`, display: 'block' }}
                          alt="Product"
                        />
                      </Link>

                      {/* Name */}
                      <span style={{ fontWeight: 600, fontSize: '0.88rem', color: C.dark, lineHeight: 1.35 }}>
                        {item.product?.name}
                      </span>

                      {/* Category */}
                      <span style={{ fontSize: '0.82rem', color: C.gray }}>
                        {item.product.maincategory?.name}
                      </span>

                      {/* Restaurant */}
                      <span style={{ fontSize: '0.82rem', color: C.gray }}>
                        {item.product.resturent?.name}
                      </span>

                      {/* Price */}
                      <span style={{ fontWeight: 600, color: C.primary, fontSize: '0.88rem', textAlign: 'right' }}>
                        ₹{item.product?.finalPrice}
                      </span>

                      {/* Quantity */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                        {!isCheckout && (
                          <button style={qtyBtn('minus')} onClick={() => updateRecord(item._id, 'DEC')}>−</button>
                        )}
                        <span style={{ minWidth: 22, textAlign: 'center', fontWeight: 700, fontSize: '0.92rem', color: C.dark }}>
                          {item.qty}
                        </span>
                        {!isCheckout && (
                          <button style={qtyBtn('plus')} onClick={() => updateRecord(item._id, 'INC')}>+</button>
                        )}
                      </div>

                      {/* Total */}
                      <span style={{ fontWeight: 700, color: C.dark, fontSize: '0.9rem', textAlign: 'right' }}>
                        ₹{item.total}
                      </span>

                      {/* Delete */}
                      {!isCheckout && (
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                          <button
                            onClick={() => deleteRecord(item._id)}
                            style={{
                              width: 34, height: 34, borderRadius: '50%',
                              background: '#FCEBEB', border: 'none', cursor: 'pointer',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              color: '#A32D2D', transition: 'all 0.2s',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = '#E24B4A'; e.currentTarget.style.color = '#fff'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = '#FCEBEB'; e.currentTarget.style.color = '#A32D2D'; }}
                          >
                            <i className="fa fa-trash" style={{ fontSize: 12 }} />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Mobile Card */}
                    <div className="d-lg-none" style={{ padding: '14px 16px', display: 'flex', gap: 14 }}>
                      <img
                        src={`${process.env.REACT_APP_BACKEND_SERVER}/${item.product.pic}`}
                        style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 12, flexShrink: 0, border: `1.5px solid ${C.primaryBorder}` }}
                        alt="Product"
                      />
                      <div style={{ flex: 1 }}>
                        <p style={{ margin: '0 0 2px', fontWeight: 700, fontSize: '0.9rem', color: C.dark }}>
                          {item.product?.name}
                        </p>
                        <p style={{ margin: '0 0 2px', fontSize: '0.75rem', color: C.gray }}>
                          {item.product.maincategory?.name} · {item.product.resturent?.name}
                        </p>
                        <p style={{ margin: '0 0 10px', fontWeight: 600, color: C.primary, fontSize: '0.88rem' }}>
                          ₹{item.product?.finalPrice}{' '}
                          <span style={{ color: C.gray, fontWeight: 400, fontSize: '0.78rem' }}>× {item.qty} = </span>
                          <strong style={{ color: C.dark }}>₹{item.total}</strong>
                        </p>
                        {!isCheckout && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <button style={{ ...qtyBtn('minus'), width: 28, height: 28 }} onClick={() => updateRecord(item._id, 'DEC')}>−</button>
                            <span style={{ fontWeight: 700, color: C.dark }}>{item.qty}</span>
                            <button style={{ ...qtyBtn('plus'),  width: 28, height: 28 }} onClick={() => updateRecord(item._id, 'INC')}>+</button>
                            <button
                              onClick={() => deleteRecord(item._id)}
                              style={{ marginLeft: 'auto', width: 30, height: 30, borderRadius: '50%', background: '#FCEBEB', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#A32D2D', fontSize: 11 }}
                            >
                              <i className="fa fa-trash" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Order Summary Sidebar ── */}
            {!isOrderView && (
              <div style={{ width: 272, flexShrink: 0 }}>
                <div style={{ ...C.card, padding: '24px 22px' }}>
                  <h6 style={{
                    fontFamily: "'Playfair Display',serif", fontSize: '1.05rem',
                    fontWeight: 700, color: C.dark, margin: 0,
                    paddingBottom: 14, marginBottom: 16,
                    borderBottom: '1px solid rgba(200,64,10,0.10)',
                  }}>
                    Order Summary
                  </h6>

                  {[['Subtotal', subtotal], ['Delivery', deliveryCharge]].map(([label, val]) => (
                    <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 11, fontSize: '0.875rem' }}>
                      <span style={{ color: C.gray }}>{label}</span>
                      <span style={{ fontWeight: 600, color: C.dark }}>
                        {val === 0 && label === 'Delivery'
                          ? <span style={{ color: '#3A7A10' }}>Free</span>
                          : `₹${val}`}
                      </span>
                    </div>
                  ))}

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(200,64,10,0.12)', paddingTop: 12, marginBottom: 20 }}>
                    <span style={{ fontWeight: 700, fontSize: '0.95rem', color: C.dark }}>Total</span>
                    <span style={{ fontWeight: 800, fontSize: '1.15rem', color: C.primary }}>₹{total}</span>
                  </div>

                  {isCheckout && (
                    <div style={{ marginBottom: 18 }}>
                      <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: C.dark, marginBottom: 8, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                        Payment Mode
                      </label>
                      <select onChange={(e) => setMode(e.target.value)} style={{ width: '100%', padding: '10px 12px', border: `1.5px solid ${C.primaryBorder}`, borderRadius: 10, fontSize: '0.875rem', color: C.dark, background: '#fff', outline: 'none', fontFamily: "'DM Sans',sans-serif" }}>
                        <option value="COD">Cash On Delivery</option>
                        <option value="Net Banking">Net Banking / UPI / Card</option>
                      </select>
                    </div>
                  )}

                  {!isCheckout ? (
                    <Link
                      to="/checkout"
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '12px 0', background: C.primary, color: '#fff', border: 'none', borderRadius: 50, fontSize: '0.9rem', fontWeight: 700, textDecoration: 'none', fontFamily: "'DM Sans',sans-serif", transition: 'all 0.25s' }}
                      onMouseEnter={e => { e.currentTarget.style.background = '#1A1A2E'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = C.primary;  e.currentTarget.style.transform = 'none'; }}
                    >
                      Proceed to Checkout <i className="fa fa-arrow-right" style={{ fontSize: 11 }} />
                    </Link>
                  ) : (
                    <button
                      onClick={placeOrder}
                      style={{ width: '100%', padding: '12px 0', background: C.primary, color: '#fff', border: 'none', borderRadius: 50, fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", transition: 'all 0.25s' }}
                      onMouseEnter={e => { e.currentTarget.style.background = '#1A1A2E'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = C.primary;  e.currentTarget.style.transform = 'none'; }}
                    >
                      Place Order
                    </button>
                  )}

                  {!isCheckout && (
                    <p style={{ textAlign: 'center', fontSize: '0.72rem', color: C.gray, marginTop: 10, marginBottom: 0 }}>
                      <i className="fa fa-lock" style={{ marginRight: 4, color: C.primary, fontSize: 10 }} />
                      Secure &amp; encrypted checkout
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

        ) : (
          <div style={{ ...C.card, padding: '72px 32px', textAlign: 'center' }}>
            <div style={{ width: 84, height: 84, background: C.primaryLight, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <i className="fa fa-shopping-cart" style={{ fontSize: 34, color: C.primary }} />
            </div>
            <h4 style={{ fontFamily: "'Playfair Display',serif", color: C.dark, marginBottom: 8 }}>Your cart is empty</h4>
            <p style={{ color: C.gray, marginBottom: 24, fontSize: '0.9rem' }}>Add some delicious items to get started!</p>
            <Link to="/product" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 28px', background: C.primary, color: '#fff', borderRadius: 50, fontWeight: 700, textDecoration: 'none', fontSize: '0.9rem' }}>
              <i className="fa fa-utensils" style={{ fontSize: 13 }} /> Browse Menu
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}