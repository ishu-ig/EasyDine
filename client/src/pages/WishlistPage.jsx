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
    let navigate = useNavigate()

    useEffect(() => {
        dispatch(getWishlist())
    }, [])

    function deleteRecord(_id) {
        if (window.confirm("Remove this item from your wishlist?")) {
            dispatch(deleteWishlist({ _id }))
        }
    }

    useEffect(() => {
        if (WishlistStateData.length) {
            setWislist(WishlistStateData.filter(x => x.user?._id === localStorage.getItem("userid")))
        } else {
            setWislist([])
        }
    }, [WishlistStateData.length])

    function addToCart(item) {
        if (localStorage.getItem("login")) {
            let existingItem = CartStateData.find(x => x.product._id === item.product._id && x.user?._id === localStorage.getItem("userid"))
            if (!existingItem) {
                dispatch(createCart({
                    user: localStorage.getItem("userid"),
                    product: item.product._id,
                    qty: 1,
                    total: item.product.finalPrice * 1,
                }))
            }
            navigate("/cart")
        } else {
            alert("Please log in to add items to your cart.")
            navigate("/login")
        }
    }

    useEffect(() => {
        dispatch(getCart())
    }, [CartStateData.length])

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=DM+Sans:wght@300;400;500&display=swap');

                :root {
                    --cream: #faf7f2;
                    --warm-white: #f5f0e8;
                    --sand: #e8ddd0;
                    --caramel: #c9a87c;
                    --espresso: #3d2b1f;
                    --charcoal: #2c2c2c;
                    --muted: #8a7a70;
                    --green: #2d6a4f;
                    --red: #c0392b;
                }

                .wl-page {
                    min-height: 100vh;
                    background: var(--cream);
                    font-family: 'DM Sans', sans-serif;
                    padding: 60px 20px;
                }

                .wl-hero {
                    text-align: center;
                    margin-bottom: 48px;
                }

                .wl-hero h1 {
                    font-family: 'Cormorant Garamond', serif;
                    font-size: clamp(2.2rem, 5vw, 3.5rem);
                    font-weight: 300;
                    color: var(--espresso);
                    letter-spacing: 0.04em;
                    margin: 0 0 8px;
                }

                .wl-hero-sub {
                    font-size: 0.82rem;
                    letter-spacing: 0.12em;
                    text-transform: uppercase;
                    color: var(--caramel);
                    margin: 0 0 12px;
                }

                .wl-hero-line {
                    width: 60px;
                    height: 2px;
                    background: var(--caramel);
                    margin: 0 auto;
                }

                .wl-container {
                    max-width: 960px;
                    margin: 0 auto;
                }

                /* Items grid */
                .wl-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                    gap: 24px;
                }

                .wl-card {
                    background: #fff;
                    border: 1px solid var(--sand);
                    border-radius: 4px;
                    overflow: hidden;
                    transition: box-shadow 0.3s, transform 0.3s;
                    position: relative;
                }

                .wl-card:hover {
                    box-shadow: 0 16px 48px rgba(61,43,31,0.12);
                    transform: translateY(-4px);
                }

                .wl-img-wrap {
                    position: relative;
                    overflow: hidden;
                    aspect-ratio: 1 / 1;
                    background: var(--warm-white);
                }

                .wl-img-wrap img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: transform 0.5s ease;
                    display: block;
                }

                .wl-card:hover .wl-img-wrap img {
                    transform: scale(1.06);
                }

                .wl-discount-badge {
                    position: absolute;
                    top: 12px;
                    left: 12px;
                    background: var(--espresso);
                    color: var(--caramel);
                    font-size: 0.7rem;
                    letter-spacing: 0.08em;
                    padding: 4px 10px;
                    border-radius: 2px;
                    font-weight: 500;
                }

                .wl-remove-btn {
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    background: rgba(255,255,255,0.9);
                    border: 1px solid var(--sand);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: background 0.2s, color 0.2s;
                    font-size: 14px;
                    color: var(--muted);
                    backdrop-filter: blur(4px);
                }

                .wl-remove-btn:hover {
                    background: var(--red);
                    color: #fff;
                    border-color: var(--red);
                }

                .wl-card-body {
                    padding: 18px 20px 20px;
                }

                .wl-product-name {
                    font-family: 'Cormorant Garamond', serif;
                    font-size: 1.15rem;
                    font-weight: 600;
                    color: var(--espresso);
                    margin: 0 0 10px;
                    line-height: 1.3;
                    letter-spacing: 0.01em;
                }

                .wl-pricing {
                    display: flex;
                    align-items: baseline;
                    gap: 8px;
                    margin-bottom: 16px;
                    flex-wrap: wrap;
                }

                .wl-price-original {
                    font-size: 0.82rem;
                    color: var(--muted);
                    text-decoration: line-through;
                }

                .wl-price-final {
                    font-size: 1.1rem;
                    font-weight: 500;
                    color: var(--charcoal);
                }

                .wl-price-savings {
                    font-size: 0.75rem;
                    color: var(--green);
                    font-weight: 500;
                    letter-spacing: 0.03em;
                }

                .wl-cart-btn {
                    width: 100%;
                    padding: 12px;
                    background: var(--espresso);
                    color: #fff;
                    border: none;
                    border-radius: 2px;
                    font-family: 'DM Sans', sans-serif;
                    font-size: 0.78rem;
                    letter-spacing: 0.1em;
                    text-transform: uppercase;
                    font-weight: 500;
                    cursor: pointer;
                    transition: background 0.2s;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                }

                .wl-cart-btn:hover {
                    background: #5a3d2b;
                }

                /* Count bar */
                .wl-count-bar {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 28px;
                    padding-bottom: 16px;
                    border-bottom: 1px solid var(--sand);
                }

                .wl-count-bar span {
                    font-size: 0.78rem;
                    letter-spacing: 0.1em;
                    text-transform: uppercase;
                    color: var(--muted);
                }

                .wl-count-num {
                    font-family: 'Cormorant Garamond', serif;
                    font-size: 1.4rem !important;
                    color: var(--espresso) !important;
                    letter-spacing: 0 !important;
                    text-transform: none !important;
                    font-weight: 600;
                }

                /* Empty state */
                .wl-empty {
                    text-align: center;
                    padding: 80px 20px;
                    background: #fff;
                    border: 1px solid var(--sand);
                    border-radius: 4px;
                }

                .wl-empty-icon {
                    font-size: 56px;
                    margin-bottom: 20px;
                    opacity: 0.4;
                }

                .wl-empty h3 {
                    font-family: 'Cormorant Garamond', serif;
                    font-size: 1.8rem;
                    font-weight: 300;
                    color: var(--espresso);
                    margin: 0 0 8px;
                }

                .wl-empty p {
                    color: var(--muted);
                    font-size: 0.9rem;
                    margin: 0 0 28px;
                }

                .wl-shop-link {
                    display: inline-block;
                    padding: 13px 36px;
                    background: var(--espresso);
                    color: #fff;
                    text-decoration: none;
                    font-size: 0.8rem;
                    letter-spacing: 0.12em;
                    text-transform: uppercase;
                    font-weight: 500;
                    border-radius: 2px;
                    transition: background 0.2s;
                }

                .wl-shop-link:hover {
                    background: #5a3d2b;
                    color: #fff;
                }

                @media (max-width: 500px) {
                    .wl-grid { grid-template-columns: 1fr; }
                }
            `}</style>

            <div className="wl-page">
                <div className="wl-hero">
                    <p className="wl-hero-sub">Saved for later</p>
                    <h1>My Wishlist</h1>
                    <div className="wl-hero-line"></div>
                </div>

                <div className="wl-container">
                    {wishlist.length ? (
                        <>
                            <div className="wl-count-bar">
                                <span>Saved Items</span>
                                <span className="wl-count-num">{wishlist.length}</span>
                            </div>

                            <div className="wl-grid">
                                {wishlist.map((item) => (
                                    <div className="wl-card" key={item._id}>
                                        <div className="wl-img-wrap">
                                            <img
                                                src={`${process.env.REACT_APP_BACKEND_SERVER}/${item.product.pic}`}
                                                alt={item.product.name}
                                            />
                                            {item.product?.discount > 0 && (
                                                <span className="wl-discount-badge">−{item.product.discount}%</span>
                                            )}
                                            <button
                                                className="wl-remove-btn"
                                                onClick={() => deleteRecord(item._id)}
                                                title="Remove from wishlist"
                                            >
                                                ✕
                                            </button>
                                        </div>

                                        <div className="wl-card-body">
                                            <p className="wl-product-name">{item.product.name}</p>

                                            <div className="wl-pricing">
                                                <span className="wl-price-original">₹{item.product?.basePrice}</span>
                                                <span className="wl-price-final">₹{item.product?.finalPrice}</span>
                                                {item.product?.discount > 0 && (
                                                    <span className="wl-price-savings">Save {item.product.discount}%</span>
                                                )}
                                            </div>

                                            <button
                                                className="wl-cart-btn"
                                                onClick={() => addToCart(item)}
                                            >
                                                <span>🛒</span>
                                                Move to Cart
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="wl-empty">
                            <div className="wl-empty-icon">♡</div>
                            <h3>Your wishlist is empty</h3>
                            <p>Save items you love and find them here anytime.</p>
                            <Link to="/product" className="wl-shop-link">Explore Products</Link>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}