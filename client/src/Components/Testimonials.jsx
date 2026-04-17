import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import { useDispatch, useSelector } from 'react-redux';
import { getTestimonial } from "../Redux/ActionCreators/TestimonialActionCreators";

// Star rating display
function Stars({ count = 5 }) {
  return (
    <div style={{ display: 'flex', gap: 3, marginBottom: 12 }}>
      {Array.from({ length: count }).map((_, i) => (
        <i key={i} className="fa fa-star" style={{ color: 'var(--secondary)', fontSize: '0.75rem' }}></i>
      ))}
    </div>
  );
}

export default function Testimonials() {
  const TestimonialStateData = useSelector(state => state.TestimonialStateData);
  const dispatch = useDispatch();
  const [slidePerViews, setSlidePerViews] = useState(window.innerWidth < 1000 ? 1 : 3);

  useEffect(() => {
    const handleResize = () => setSlidePerViews(window.innerWidth < 1000 ? 1 : 3);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    dispatch(getTestimonial());
  }, [TestimonialStateData.length]);

  const swiperOptions = {
    effect: 'coverflow',
    grabCursor: true,
    centeredSlides: true,
    slidesPerView: slidePerViews,
    coverflowEffect: {
      rotate: 40,
      stretch: 0,
      depth: 120,
      modifier: 1,
      slideShadows: false,
    },
    pagination: { clickable: true },
    loop: true,
    autoplay: { delay: 4000, disableOnInteraction: false },
    modules: [EffectCoverflow, Pagination, Autoplay],
    className: "mySwiper",
  };

  return (
    <section style={{
      padding: '90px 0',
      background: 'linear-gradient(180deg, #FDF6EE 0%, #FFF8F0 100%)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Decorative large quote */}
      <div style={{
        position: 'absolute',
        top: 40,
        left: '50%',
        transform: 'translateX(-50%)',
        fontFamily: 'Playfair Display, serif',
        fontSize: '20rem',
        color: 'rgba(200,64,10,0.04)',
        lineHeight: 1,
        pointerEvents: 'none',
        userSelect: 'none',
        zIndex: 0,
      }}>
        "
      </div>

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        {/* Section header */}
        <div className="text-center mb-5">
          <p style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.15em', color: 'var(--primary)', textTransform: 'uppercase', marginBottom: 8 }}>
            Testimonials
          </p>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', fontWeight: 900, color: 'var(--dark)', marginBottom: 12 }}>
            What Our Customers Say
          </h2>
          <p style={{ color: 'var(--gray)', maxWidth: 480, margin: '0 auto', fontSize: '0.95rem' }}>
            Real experiences from people who love dining with us.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 16 }}>
            <span style={{ width: 36, height: 3, background: 'var(--primary)', borderRadius: 2, display: 'block' }} />
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--secondary)', display: 'block' }} />
            <span style={{ width: 56, height: 3, background: 'var(--secondary)', borderRadius: 2, display: 'block', opacity: 0.5 }} />
          </div>
        </div>

        <Swiper {...swiperOptions} style={{ paddingBottom: 50 }}>
          {TestimonialStateData.map((item) => (
            <SwiperSlide key={item._id}>
              {({ isActive }) => (
                <div style={{
                  background: isActive
                    ? 'linear-gradient(135deg, var(--primary) 0%, #E86834 100%)'
                    : 'white',
                  borderRadius: 24,
                  padding: '32px 28px',
                  boxShadow: isActive
                    ? '0 24px 60px rgba(200,64,10,0.3)'
                    : '0 4px 20px rgba(28,16,9,0.07)',
                  border: isActive ? 'none' : '1px solid rgba(200,64,10,0.1)',
                  transition: 'all 0.4s ease',
                  position: 'relative',
                  overflow: 'hidden',
                }}>
                  {/* Big quote decoration */}
                  <div style={{
                    position: 'absolute',
                    top: -10,
                    right: 20,
                    fontFamily: 'Playfair Display, serif',
                    fontSize: '8rem',
                    color: isActive ? 'rgba(255,255,255,0.12)' : 'rgba(200,64,10,0.06)',
                    lineHeight: 1,
                    pointerEvents: 'none',
                  }}>
                    "
                  </div>

                  <Stars />

                  {/* Message */}
                  <p style={{
                    color: isActive ? 'rgba(255,255,255,0.9)' : 'var(--gray)',
                    fontSize: '0.9rem',
                    lineHeight: 1.75,
                    marginBottom: 24,
                    maxHeight: 160,
                    overflowY: 'auto',
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                  }}>
                    {item.message}
                  </p>

                  {/* Divider */}
                  <div style={{
                    height: 1,
                    background: isActive ? 'rgba(255,255,255,0.2)' : 'rgba(200,64,10,0.1)',
                    marginBottom: 20,
                  }} />

                  {/* Author */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <img
                      src={`${process.env.REACT_APP_BACKEND_SERVER}/${item.pic}`}
                      alt={item.name}
                      style={{
                        width: 52, height: 52,
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: isActive ? '3px solid rgba(255,255,255,0.4)' : '3px solid rgba(200,64,10,0.15)',
                        flexShrink: 0,
                      }}
                    />
                    <div>
                      <h5 style={{
                        margin: 0,
                        fontFamily: 'Playfair Display, serif',
                        fontWeight: 700,
                        fontSize: '0.95rem',
                        color: isActive ? 'white' : 'var(--dark)',
                      }}>
                        {item.name}
                      </h5>
                      <span style={{
                        fontSize: '0.8rem',
                        color: isActive ? 'rgba(255,255,255,0.65)' : 'var(--gray)',
                        fontStyle: 'italic',
                      }}>
                        {item.profession}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}