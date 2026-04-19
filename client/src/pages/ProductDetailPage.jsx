import React, { useEffect, useState } from 'react'
import HeroSection from '../Components/HeroSection'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { getProduct } from "../Redux/ActionCreators/ProductActionCreators"
import { createCart, getCart } from "../Redux/ActionCreators/CartActionCreators"
import { createWishlist, getWishlist } from "../Redux/ActionCreators/WishlistActionCreators"
import CategorySlider from '../Components/CategorySlider';

/* ─── inline styles ─────────────────────────────────────── */
const styles = {
  pageWrapper: {
    background: 'var(--light)',
    minHeight: '100vh',
  },
  section: {
    padding: '64px 0 80px',
  },

  /* ── LEFT COLUMN: Premium Image Gallery ── */
  galleryWrapper: {
    position: 'sticky',
    top: '100px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },

  /* Main image container */
  mainImageContainer: {
    position: 'relative',
    borderRadius: 'var(--radius)',
    overflow: 'hidden',
    background: '#fff',
    boxShadow: 'var(--shadow-lg)',
    cursor: 'zoom-in',
    aspectRatio: '4/3',
  },
  mainImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
    transition: 'transform 0.5s cubic-bezier(0.4,0,0.2,1)',
  },

  /* Floating top-left badge strip */
  badgeStrip: {
    position: 'absolute',
    top: '16px',
    left: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    zIndex: 3,
  },
  availBadge: (available) => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 14px',
    borderRadius: '50px',
    fontSize: '0.75rem',
    fontWeight: 700,
    letterSpacing: '0.04em',
    backdropFilter: 'blur(10px)',
    background: available ? 'rgba(22,163,74,0.85)' : 'rgba(239,68,68,0.85)',
    color: '#fff',
    boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
  }),
  dot: (available) => ({
    width: 7, height: 7, borderRadius: '50%',
    background: '#fff',
    animation: available ? 'pulse 2s infinite' : 'none',
    flexShrink: 0,
  }),
  discountFloatBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '6px 14px',
    borderRadius: '50px',
    background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
    color: '#fff',
    fontSize: '0.75rem',
    fontWeight: 800,
    letterSpacing: '0.05em',
    boxShadow: '0 2px 12px rgba(200,64,10,0.35)',
  },

  /* Zoom overlay icon */
  zoomOverlay: {
    position: 'absolute',
    bottom: '14px',
    right: '14px',
    width: '38px',
    height: '38px',
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.9)',
    backdropFilter: 'blur(8px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--primary)',
    fontSize: '0.85rem',
    boxShadow: '0 2px 12px rgba(0,0,0,0.12)',
    zIndex: 3,
    transition: 'transform 0.2s, background 0.2s',
    cursor: 'pointer',
  },

  /* Gradient overlay at bottom of main image */
  imageGradient: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    height: '80px',
    background: 'linear-gradient(to top, rgba(28,16,9,0.18), transparent)',
    pointerEvents: 'none',
    zIndex: 2,
  },

  /* Thumbnail row */
  thumbRow: {
    display: 'flex',
    gap: '10px',
  },
  thumb: (active) => ({
    flex: 1,
    aspectRatio: '1/1',
    borderRadius: '10px',
    overflow: 'hidden',
    cursor: 'pointer',
    border: active ? '2.5px solid var(--primary)' : '2.5px solid transparent',
    boxShadow: active ? '0 0 0 3px rgba(200,64,10,0.15)' : 'var(--shadow-sm)',
    transition: 'border 0.2s, box-shadow 0.2s, transform 0.2s',
    transform: active ? 'translateY(-2px)' : 'none',
    background: '#fff',
  }),
  thumbImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
    transition: 'transform 0.35s ease',
  },

  /* Info strip below thumbs */
  infoStrip: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '14px 18px',
    borderRadius: '12px',
    background: '#fff',
    border: '1px solid var(--border)',
    boxShadow: 'var(--shadow-sm)',
  },
  infoStripIcon: {
    color: 'var(--primary)',
    fontSize: '0.85rem',
    width: '18px',
    flexShrink: 0,
  },
  infoStripText: {
    fontSize: '0.82rem',
    color: 'var(--gray)',
    fontWeight: 500,
  },

  /* Lightbox overlay */
  lightbox: {
    position: 'fixed',
    inset: 0,
    zIndex: 9999,
    background: 'rgba(10,5,3,0.92)',
    backdropFilter: 'blur(16px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'zoom-out',
  },
  lightboxImg: {
    maxWidth: '88vw',
    maxHeight: '88vh',
    objectFit: 'contain',
    borderRadius: '12px',
    boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
  },
  lightboxClose: {
    position: 'fixed',
    top: '24px',
    right: '28px',
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.12)',
    border: '1px solid rgba(255,255,255,0.2)',
    color: '#fff',
    fontSize: '1.1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'background 0.2s',
  },

  /* ── RIGHT COLUMN ── */
  detailCard: {
    background: '#fff',
    borderRadius: 'var(--radius)',
    boxShadow: 'var(--shadow-md)',
    padding: '40px',
  },
  dishName: {
    fontFamily: "'Playfair Display', serif",
    fontWeight: 900,
    fontSize: '2.2rem',
    lineHeight: 1.15,
    color: 'var(--dark)',
    marginBottom: '6px',
  },
  restaurantLine: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: 'var(--gray)',
    fontSize: '0.88rem',
    marginBottom: '24px',
  },
  restaurantIcon: {
    color: 'var(--primary)',
    fontSize: '0.85rem',
  },
  divider: {
    height: 1,
    background: 'var(--border)',
    margin: '24px 0',
  },
  pillRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginBottom: '24px',
  },
  pill: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '5px',
    padding: '5px 14px',
    borderRadius: '50px',
    fontSize: '0.78rem',
    fontWeight: 600,
    background: 'rgba(200,64,10,0.07)',
    color: 'var(--primary)',
    border: '1px solid rgba(200,64,10,0.15)',
  },
  priceBlock: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '12px',
    marginBottom: '28px',
  },
  finalPrice: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '2.2rem',
    fontWeight: 900,
    color: 'var(--primary)',
    lineHeight: 1,
  },
  basePrice: {
    fontSize: '1rem',
    color: 'var(--gray)',
    textDecoration: 'line-through',
  },
  discountBadge: {
    padding: '4px 12px',
    borderRadius: '50px',
    background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
    color: '#fff',
    fontSize: '0.78rem',
    fontWeight: 800,
    letterSpacing: '0.04em',
  },
  actionRow: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: '28px',
  },
  qtyBox: {
    display: 'flex',
    alignItems: 'center',
    border: '2px solid var(--border)',
    borderRadius: '50px',
    overflow: 'hidden',
    background: 'var(--light)',
  },
  qtyBtn: {
    width: 40, height: 44,
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    fontSize: '1rem',
    color: 'var(--primary)',
    fontWeight: 700,
    transition: 'background 0.2s',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  qtyValue: {
    minWidth: 36,
    textAlign: 'center',
    fontWeight: 700,
    fontSize: '1rem',
    color: 'var(--dark)',
  },
  cartBtn: {
    flex: 1,
    minWidth: 160,
    padding: '12px 28px',
    borderRadius: '50px',
    border: 'none',
    background: 'var(--primary)',
    color: '#fff',
    fontWeight: 700,
    fontSize: '0.92rem',
    letterSpacing: '0.03em',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    transition: 'var(--transition)',
    boxShadow: '0 4px 20px rgba(200,64,10,0.3)',
  },
  wishBtn: {
    width: 48, height: 48,
    borderRadius: '50%',
    border: '2px solid var(--border)',
    background: '#fff',
    color: 'var(--primary)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1rem',
    transition: 'var(--transition)',
    flexShrink: 0,
  },
  descLabel: {
    fontWeight: 700,
    fontSize: '0.78rem',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: 'var(--gray)',
    marginBottom: '10px',
  },
  descText: {
    color: 'var(--gray)',
    lineHeight: 1.75,
    fontSize: '0.92rem',
  },
  infoRow: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
    marginTop: '24px',
    paddingTop: '24px',
    borderTop: '1px solid var(--border)',
  },
  infoChip: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '7px 14px',
    borderRadius: '50px',
    background: 'var(--light)',
    fontSize: '0.8rem',
    fontWeight: 600,
    color: 'var(--dark)',
    border: '1px solid var(--border)',
  },
  infoChipIcon: {
    color: 'var(--primary)',
    fontSize: '0.82rem',
  },
};

export default function ProductDetailPage() {
  const { _id } = useParams()
  const [data, setData] = useState({})
  const [relatedProduct, setRelatedProduct] = useState([])
  const [qty, setQty] = useState(1)
  const [activeThumb, setActiveThumb] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [imgHover, setImgHover] = useState(false)

  const ProductStateData = useSelector((s) => s.ProductStateData)
  const CartStateData = useSelector((s) => s.CartStateData)
  const WishlistStateData = useSelector((s) => s.WishlistStateData)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    dispatch(getProduct())
    if (ProductStateData.length) {
      const item = ProductStateData.find((x) => x._id === _id)
      setData(item)
      setRelatedProduct(
        ProductStateData.filter(
          (x) => x.active && x.maincategory?.name === item.maincategory?.name && x._id !== _id
        )
      )
    }
  }, [ProductStateData.length])

  useEffect(() => { dispatch(getCart()) }, [CartStateData.length])
  useEffect(() => { dispatch(getWishlist()) }, [WishlistStateData.length])

  function addToCart() {
    if (localStorage.getItem('login')) {
      const item = CartStateData.find(
        (x) => x.product._id === _id && x.user?._id === localStorage.getItem('userid')
      )
      if (!item) {
        dispatch(createCart({
          user: localStorage.getItem('userid'),
          product: data._id,
          qty,
          total: data.finalPrice * qty,
        }))
      }
      navigate('/cart')
    } else {
      alert('Login to add items to your cart')
      navigate('/login')
    }
  }

  function addToWishlist() {
    if (localStorage.getItem('login')) {
      const item = WishlistStateData.find(
        (x) => x.product?._id === _id && x.user?._id === localStorage.getItem('userid')
      )
      if (!item) {
        dispatch(createWishlist({ user: localStorage.getItem('userid'), product: data?._id }))
      }
      navigate('/wishlist')
    } else {
      alert('Login to add items to your wishlist')
      navigate('/login')
    }
  }

  /* Build image list from actual uploaded images only */
  const mainPicUrl = data?.pic
    ? `${process.env.REACT_APP_BACKEND_SERVER}/${data.pic}`
    : '/img/noimage.jpg'

  // Use data.images[] array if backend sends multiple images,
  // otherwise fall back to the single data.pic — never fake-repeat
  const images = (() => {
    if (Array.isArray(data?.images) && data.images.length > 0) {
      return data.images.map(i => `${process.env.REACT_APP_BACKEND_SERVER}/${i}`)
    }
    if (data?.pic) return [mainPicUrl]
    return []
  })()

  const activeImage = images[activeThumb] || mainPicUrl
  const hasMultiple = images.length > 1

  return (
    <>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.5; transform: scale(1.3); }
        }
        @keyframes lightboxIn {
          from { opacity: 0; transform: scale(0.94); }
          to   { opacity: 1; transform: scale(1); }
        }
        .pdp-cart-btn:hover  { background: var(--accent) !important; transform: translateY(-2px); box-shadow: 0 8px 28px rgba(28,16,9,0.22) !important; }
        .pdp-wish-btn:hover  { background: rgba(200,64,10,0.08) !important; border-color: var(--primary) !important; transform: scale(1.08); }
        .pdp-qty-btn:hover   { background: rgba(200,64,10,0.08) !important; }
        .pdp-thumb:hover img { transform: scale(1.08); }
        .pdp-zoom-btn:hover  { background: var(--primary) !important; color: #fff !important; transform: scale(1.1); }
        .pdp-main-img:hover  { transform: scale(1.04); }
        .pdp-lightbox-img    { animation: lightboxIn 0.3s cubic-bezier(0.4,0,0.2,1); }
        .pdp-close-btn:hover { background: rgba(255,255,255,0.22) !important; }

        /* Responsive tweaks */
        @media (max-width: 768px) {
          .pdp-detail-card { padding: 24px !important; }
          .pdp-dish-name   { font-size: 1.7rem !important; }
          .pdp-final-price { font-size: 1.7rem !important; }
        }
      `}</style>

      {/* Lightbox */}
      {lightboxOpen && (
        <div style={styles.lightbox} onClick={() => setLightboxOpen(false)}>
          <button
            style={styles.lightboxClose}
            className="pdp-close-btn"
            onClick={() => setLightboxOpen(false)}
            aria-label="Close lightbox"
          >
            <i className="fa fa-times"></i>
          </button>
          <img
            src={activeImage}
            alt={data?.name}
            style={styles.lightboxImg}
            className="pdp-lightbox-img"
            onClick={e => e.stopPropagation()}
          />
        </div>
      )}

      <HeroSection title={`Dish — ${data.name || '...'}`} />

      <div style={styles.pageWrapper}>
        <div style={styles.section}>
          <div className="container-xxl">
            <div className="row g-5 align-items-start">

              {/* ── LEFT: Premium Gallery ── */}
              <div className="col-lg-5">
                <div style={styles.galleryWrapper}>

                  {/* ── Main image ── */}
                  <div
                    style={styles.mainImageContainer}
                    onClick={() => setLightboxOpen(true)}
                  >
                    <img
                      src={activeImage}
                      alt={data?.name || 'Dish'}
                      style={styles.mainImage}
                      className="pdp-main-img"
                    />

                    {/* Bottom gradient */}
                    <div style={styles.imageGradient} />

                    {/* Floating badges top-left */}
                    <div style={styles.badgeStrip}>
                      <span style={styles.availBadge(data?.availability)}>
                        <span style={styles.dot(data?.availability)} />
                        {data?.availability ? 'Available Now' : 'Unavailable'}
                      </span>
                      {data?.discount > 0 && (
                        <span style={styles.discountFloatBadge}>
                          <i className="fa fa-tag me-1" style={{ fontSize: '0.7rem' }}></i>
                          {data.discount}% OFF
                        </span>
                      )}
                    </div>

                    {/* Zoom icon bottom-right */}
                    <div style={styles.zoomOverlay} className="pdp-zoom-btn">
                      <i className="fa fa-expand-alt"></i>
                    </div>
                  </div>

                  {/* ── Thumbnail strip — only when 2+ images ── */}
                  {hasMultiple && (
                    <div style={styles.thumbRow}>
                      {images.map((imgSrc, idx) => (
                        <div
                          key={idx}
                          className="pdp-thumb"
                          style={styles.thumb(activeThumb === idx)}
                          onClick={() => setActiveThumb(idx)}
                          aria-label={`View image ${idx + 1}`}
                        >
                          <img
                            src={imgSrc}
                            alt={`${data?.name} view ${idx + 1}`}
                            style={styles.thumbImg}
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* ── Info strip ── */}
                  <div style={styles.infoStrip}>
                    <i className="fa fa-camera" style={styles.infoStripIcon}></i>
                    <span style={styles.infoStripText}>
                      Tap to zoom{hasMultiple ? ` · ${images.length} photos` : ''}
                    </span>
                    {hasMultiple && (
                      <>
                        <i
                          className="fa fa-chevron-left ms-auto"
                          style={{ ...styles.infoStripIcon, cursor: 'pointer', opacity: activeThumb === 0 ? 0.3 : 1 }}
                          onClick={() => setActiveThumb(p => Math.max(0, p - 1))}
                        ></i>
                        <i
                          className="fa fa-chevron-right"
                          style={{ ...styles.infoStripIcon, cursor: 'pointer', opacity: activeThumb === images.length - 1 ? 0.3 : 1 }}
                          onClick={() => setActiveThumb(p => Math.min(images.length - 1, p + 1))}
                        ></i>
                      </>
                    )}
                  </div>

                </div>
              </div>

              {/* ── RIGHT: details ── */}
              <div className="col-lg-7">
                <div style={styles.detailCard} className="pdp-detail-card">

                  <h1 style={styles.dishName} className="pdp-dish-name">{data?.name || 'Loading…'}</h1>
                  <div style={styles.restaurantLine}>
                    <i className="fa fa-store" style={styles.restaurantIcon}></i>
                    <span>{data?.resturent?.name || 'Restaurant'}</span>
                  </div>

                  <div style={styles.pillRow}>
                    {data?.maincategory?.name && (
                      <span style={styles.pill}>
                        <i className="fa fa-tag" style={{ fontSize: '0.72rem' }}></i>
                        {data.maincategory.name}
                      </span>
                    )}
                    {data?.subcategory?.name && (
                      <span style={styles.pill}>
                        <i className="fa fa-layer-group" style={{ fontSize: '0.72rem' }}></i>
                        {data.subcategory.name}
                      </span>
                    )}
                  </div>

                  <div style={styles.divider} />

                  <div style={styles.priceBlock}>
                    <span style={styles.finalPrice} className="pdp-final-price">&#8377;{data?.finalPrice}</span>
                    {data?.basePrice !== data?.finalPrice && (
                      <span style={styles.basePrice}>&#8377;{data?.basePrice}</span>
                    )}
                    {data?.discount > 0 && (
                      <span style={styles.discountBadge}>{data.discount}% OFF</span>
                    )}
                  </div>

                  <div style={styles.actionRow}>
                    <div style={styles.qtyBox}>
                      <button
                        className="pdp-qty-btn"
                        style={styles.qtyBtn}
                        onClick={() => setQty((p) => Math.max(1, p - 1))}
                        aria-label="Decrease quantity"
                      >
                        <i className="fa fa-minus" style={{ fontSize: '0.8rem' }}></i>
                      </button>
                      <span style={styles.qtyValue}>{qty}</span>
                      <button
                        className="pdp-qty-btn"
                        style={styles.qtyBtn}
                        onClick={() => setQty((p) => p + 1)}
                        aria-label="Increase quantity"
                      >
                        <i className="fa fa-plus" style={{ fontSize: '0.8rem' }}></i>
                      </button>
                    </div>

                    <button className="pdp-cart-btn" style={styles.cartBtn} onClick={addToCart}>
                      <i className="fa fa-shopping-cart"></i>
                      Add to Cart
                      {qty > 1 && (
                        <span style={{
                          background: 'rgba(255,255,255,0.25)',
                          borderRadius: '50px',
                          padding: '1px 10px',
                          fontSize: '0.8rem',
                        }}>
                          × {qty}
                        </span>
                      )}
                    </button>

                    <button
                      className="pdp-wish-btn"
                      style={styles.wishBtn}
                      onClick={addToWishlist}
                      aria-label="Add to wishlist"
                      title="Save to Wishlist"
                    >
                      <i className="fa fa-heart"></i>
                    </button>
                  </div>

                  <div style={styles.divider} />

                  {data?.description && (
                    <>
                      <p style={styles.descLabel}>About this dish</p>
                      <div style={styles.descText} dangerouslySetInnerHTML={{ __html: data.description }} />
                    </>
                  )}

                  <div style={styles.infoRow}>
                    <span style={styles.infoChip}>
                      <i className="fa fa-shield-alt" style={styles.infoChipIcon}></i>
                      Fresh Ingredients
                    </span>
                    <span style={styles.infoChip}>
                      <i className="fa fa-clock" style={styles.infoChipIcon}></i>
                      30–45 min delivery
                    </span>
                    <span style={styles.infoChip}>
                      <i className="fa fa-undo" style={styles.infoChipIcon}></i>
                      Easy Returns
                    </span>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      <div style={{ paddingBottom: '40px' }}>
        {relatedProduct.length > 0 ? (
          <CategorySlider title="You Might Also Like" data={relatedProduct} />
        ) : (
          <p className="text-center text-muted py-4">No related dishes found</p>
        )}
      </div>
    </>
  )
}