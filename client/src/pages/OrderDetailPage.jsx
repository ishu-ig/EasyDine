import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getCheckout } from '../Redux/ActionCreators/CheckoutActionCreators';

const C = {
  primary: '#C8400A', primaryLight: 'rgba(200,64,10,0.08)', primaryBorder: 'rgba(200,64,10,0.14)',
  dark: '#1C1009', gray: '#7A6E65', warm: '#FFFBF7',
  card: { background: '#FFFBF7', borderRadius: 20, border: '1px solid rgba(200,64,10,0.12)', boxShadow: '0 4px 20px rgba(28,16,9,0.07)', padding: '24px 28px', marginBottom: 20 },
};

function InfoRow({ icon, label, value }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '12px 0', borderBottom: '1px solid rgba(200,64,10,0.07)' }}>
      <div style={{ width: 32, height: 32, flexShrink: 0, background: C.primaryLight, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <i className={`fa ${icon}`} style={{ color: C.primary, fontSize: 13 }}></i>
      </div>
      <div>
        <p style={{ margin: '0 0 1px', fontSize: '0.75rem', color: C.gray, fontWeight: 500 }}>{label}</p>
        <p style={{ margin: 0, fontSize: '0.9rem', color: value ? C.dark : C.gray, fontWeight: value ? 600 : 400 }}>{value || 'N/A'}</p>
      </div>
    </div>
  );
}

export default function OrderDetailPage() {
  const { _id } = useParams();
  const CheckoutStateData = useSelector(state => state.CheckoutStateData);
  const [order, setOrder] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => { dispatch(getCheckout()); }, [dispatch]);
  useEffect(() => {
    if (CheckoutStateData.length) setOrder(CheckoutStateData.find(x => x._id === _id) || {});
  }, [CheckoutStateData, _id]);

  if (!order) return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg,#FDF6EE,#FFF8F3)' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 48, height: 48, border: `3px solid ${C.primary}`, borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }}></div>
        <p style={{ color: C.gray, fontFamily: "'DM Sans',sans-serif" }}>Loading order details…</p>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  const isDelivered = order.orderStatus === 'Delivered';
  const isPaid = order.paymentStatus !== 'Pending';

  const statusSteps = ['Order is Placed', 'Preparing', 'Out for Delivery', 'Delivered'];
  const currentStep = statusSteps.indexOf(order.orderStatus);

  return (
    <div style={{ background: 'linear-gradient(135deg,#FDF6EE 0%,#FFF8F3 100%)', minHeight: '80vh', padding: '48px 16px' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <span style={{ display: 'inline-block', background: C.primaryLight, color: C.primary, fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '5px 16px', borderRadius: 50, marginBottom: 10 }}>Order Details</span>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: '2rem', fontWeight: 700, color: C.dark, margin: 0 }}>Track Your Order</h2>
          </div>
          <Link to="/order" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 20px', background: C.primaryLight, color: C.primary, borderRadius: 50, textDecoration: 'none', fontWeight: 600, fontSize: '0.85rem', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.background = C.primary; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={e => { e.currentTarget.style.background = C.primaryLight; e.currentTarget.style.color = C.primary; }}>
            <i className="fa fa-arrow-left" style={{ fontSize: 12 }}></i> Back to Orders
          </Link>
        </div>

        {/* Status Tracker */}
        <div style={{ ...C.card }}>
          <h6 style={{ fontWeight: 700, color: C.dark, marginBottom: 24, fontFamily: "'Playfair Display',serif", fontSize: '1rem' }}>Order Progress</h6>
          <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
            <div style={{ position: 'absolute', top: 18, left: '10%', right: '10%', height: 3, background: 'rgba(200,64,10,0.12)', borderRadius: 4 }}>
              <div style={{ height: '100%', width: `${Math.max(0, (currentStep / (statusSteps.length - 1)) * 100)}%`, background: C.primary, borderRadius: 4, transition: 'width 0.6s ease' }}></div>
            </div>
            {statusSteps.map((step, i) => {
              const done = i <= currentStep;
              return (
                <div key={step} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, position: 'relative' }}>
                  <div style={{ width: 38, height: 38, borderRadius: '50%', background: done ? C.primary : '#fff', border: `2.5px solid ${done ? C.primary : 'rgba(200,64,10,0.25)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10, transition: 'all 0.3s', zIndex: 1 }}>
                    <i className={`fa ${i === 0 ? 'fa-receipt' : i === 1 ? 'fa-fire' : i === 2 ? 'fa-bicycle' : 'fa-check'}`} style={{ fontSize: 14, color: done ? '#fff' : 'rgba(200,64,10,0.4)' }}></i>
                  </div>
                  <span style={{ fontSize: '0.7rem', fontWeight: done ? 700 : 400, color: done ? C.primary : C.gray, textAlign: 'center', maxWidth: 72, lineHeight: 1.3 }}>{step}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Two-column layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }} className="order-detail-grid">
          {/* Order Info */}
          <div style={{ ...C.card, marginBottom: 0 }}>
            <h6 style={{ fontWeight: 700, color: C.dark, marginBottom: 16, fontFamily: "'Playfair Display',serif", fontSize: '1rem' }}>Order Info</h6>
            <div style={{ background: C.primaryLight, borderRadius: 10, padding: '10px 14px', marginBottom: 16 }}>
              <p style={{ margin: '0 0 2px', fontSize: '0.72rem', color: C.gray, fontWeight: 500 }}>Order ID</p>
              <p style={{ margin: 0, fontSize: '0.78rem', fontWeight: 700, color: C.dark, wordBreak: 'break-all' }}>{order._id || 'N/A'}</p>
            </div>
            <InfoRow icon="fa-calendar" label="Order Date" value={order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : null} />
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '12px 0', borderBottom: '1px solid rgba(200,64,10,0.07)' }}>
              <div style={{ width: 32, height: 32, flexShrink: 0, background: C.primaryLight, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="fa fa-box" style={{ color: C.primary, fontSize: 13 }}></i>
              </div>
              <div>
                <p style={{ margin: '0 0 1px', fontSize: '0.75rem', color: C.gray, fontWeight: 500 }}>Order Status</p>
                <span style={{ display: 'inline-block', padding: '3px 12px', borderRadius: 50, fontSize: '0.78rem', fontWeight: 700, background: isDelivered ? 'rgba(39,80,10,0.1)' : C.primaryLight, color: isDelivered ? '#27500A' : C.primary }}>{order.orderStatus || 'N/A'}</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '12px 0', borderBottom: '1px solid rgba(200,64,10,0.07)' }}>
              <div style={{ width: 32, height: 32, flexShrink: 0, background: C.primaryLight, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="fa fa-credit-card" style={{ color: C.primary, fontSize: 13 }}></i>
              </div>
              <div>
                <p style={{ margin: '0 0 1px', fontSize: '0.75rem', color: C.gray, fontWeight: 500 }}>Payment</p>
                <p style={{ margin: '0 0 3px', fontSize: '0.88rem', color: C.dark, fontWeight: 600 }}>{order.paymentMode || 'N/A'}</p>
                <span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: 50, fontSize: '0.72rem', fontWeight: 700, background: isPaid ? 'rgba(39,80,10,0.1)' : '#FCEBEB', color: isPaid ? '#27500A' : '#A32D2D' }}>{order.paymentStatus || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Address */}
          <div style={{ ...C.card, marginBottom: 0 }}>
            <h6 style={{ fontWeight: 700, color: C.dark, marginBottom: 16, fontFamily: "'Playfair Display',serif", fontSize: '1rem' }}>Delivery Address</h6>
            {[
              { icon: 'fa-user', label: 'Name', value: order.user?.name },
              { icon: 'fa-envelope', label: 'Email', value: order.user?.email },
              { icon: 'fa-phone', label: 'Phone', value: order.user?.phone },
              { icon: 'fa-map-marker-alt', label: 'Street', value: order.user?.address },
              { icon: 'fa-city', label: 'City', value: order.user?.city },
              { icon: 'fa-flag', label: 'State', value: order.user?.state },
              { icon: 'fa-hashtag', label: 'Pincode', value: order.user?.pin },
            ].map(f => <InfoRow key={f.label} {...f} />)}
          </div>
        </div>

        {/* Products */}
        <div style={{ ...C.card }}>
          <h6 style={{ fontWeight: 700, color: C.dark, marginBottom: 20, fontFamily: "'Playfair Display',serif", fontSize: '1rem' }}>Ordered Items</h6>
          {order?.products?.length > 0 ? (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px 80px 100px', gap: 8, padding: '8px 12px', background: C.primaryLight, borderRadius: 10, marginBottom: 8 }}>
                {['Product', 'Price', 'Qty', 'Total'].map(h => <span key={h} style={{ fontSize: '0.72rem', fontWeight: 700, color: C.primary, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</span>)}
              </div>
              {order.products.map((prod, i) => (
                <div key={prod._id} style={{ display: 'grid', gridTemplateColumns: '1fr 100px 80px 100px', gap: 8, padding: '12px', borderBottom: i < order.products.length - 1 ? '1px solid rgba(200,64,10,0.07)' : 'none', alignItems: 'center' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.9rem', color: C.dark }}>{prod.product?.name || 'Unknown'}</span>
                  <span style={{ color: C.gray, fontSize: '0.88rem' }}>₹{prod.product?.finalPrice || 0}</span>
                  <span style={{ color: C.gray, fontSize: '0.88rem' }}>×{prod.qty || 1}</span>
                  <span style={{ fontWeight: 700, color: C.dark }}>₹{prod.total || 0}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '16px 12px 0', borderTop: '1px solid rgba(200,64,10,0.12)', marginTop: 8 }}>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ margin: '0 0 4px', fontSize: '0.85rem', color: C.gray }}>Total Amount</p>
                  <p style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800, color: C.primary, fontFamily: "'Playfair Display',serif" }}>₹{order.total || 'N/A'}</p>
                </div>
              </div>
            </>
          ) : (
            <p style={{ textAlign: 'center', color: C.gray, padding: '24px 0' }}>No products found for this order.</p>
          )}
        </div>

        <style>{`@media(max-width:640px){.order-detail-grid{grid-template-columns:1fr!important}}`}</style>
      </div>
    </div>
  );
}