import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import 'swiper/css';
import 'swiper/css/pagination';
import { useDispatch, useSelector } from 'react-redux';
import { getResturent } from "../Redux/ActionCreators/ResturentActionCreators";

export default function ResturentSlider({ title, data }) {
  const dispatch = useDispatch();
  const ResturentStateData = useSelector(state => state.ResturentStateData);

  useEffect(() => { dispatch(getResturent()); }, [ResturentStateData.length, dispatch]);

  return (
    <section style={{
      padding: '90px 0',
      background: 'var(--accent)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Subtle texture overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(200,64,10,0.12) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(244,160,68,0.08) 0%, transparent 50%)',
        pointerEvents: 'none',
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        {/* Section header */}
        <div className="text-center mb-5">
          <p style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.15em', color: 'var(--secondary)', textTransform: 'uppercase', marginBottom: 8 }}>
            Dine Out
          </p>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', fontWeight: 900, color: 'white', margin: 0 }}>
            {title}
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 14 }}>
            <span style={{ width: 36, height: 3, background: 'var(--secondary)', borderRadius: 2, display: 'block' }} />
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--primary-light)', display: 'block' }} />
            <span style={{ width: 56, height: 3, background: 'var(--primary-light)', borderRadius: 2, display: 'block', opacity: 0.4 }} />
          </div>
        </div>

        <Swiper
          modules={[Autoplay, Pagination]}
          slidesPerView={1}
          spaceBetween={20}
          autoplay={{ delay: 3500, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          breakpoints={{
            640: { slidesPerView: 2, spaceBetween: 20 },
            768: { slidesPerView: 2, spaceBetween: 24 },
            1024: { slidesPerView: 3, spaceBetween: 28 },
          }}
          loop={true}
          className="mySwiper"
          style={{ paddingBottom: 48 }}
        >
          {data?.map((item) => (
            <SwiperSlide key={item._id}>
              <div style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 20,
                overflow: 'hidden',
                backdropFilter: 'blur(10px)',
                transition: 'transform 0.35s ease, box-shadow 0.35s ease, background 0.35s ease',
                cursor: 'pointer',
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.background = 'rgba(255,255,255,0.12)';
                  e.currentTarget.style.boxShadow = '0 24px 60px rgba(0,0,0,0.3)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = '';
                  e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                  e.currentTarget.style.boxShadow = '';
                }}
              >
                {/* Image */}
                <div style={{ position: 'relative', overflow: 'hidden', height: 220 }}>
                  <img
                    src={`${process.env.REACT_APP_BACKEND_SERVER}/${item.pic}`}
                    alt={item.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                    onMouseEnter={e => e.target.style.transform = 'scale(1.06)'}
                    onMouseLeave={e => e.target.style.transform = ''}
                  />
                  {/* Gradient overlay */}
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(to top, rgba(26,26,46,0.7) 0%, transparent 60%)',
                  }} />
                  {item.discount && (
                    <div style={{
                      position: 'absolute', top: 14, left: 14,
                      background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                      color: 'white',
                      padding: '5px 14px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      borderRadius: 50,
                      letterSpacing: '0.04em',
                    }}>
                      {item.discount}% OFF
                    </div>
                  )}
                </div>

                {/* Content */}
                <div style={{ padding: '20px 22px 24px' }}>
                  <h4 style={{
                    fontFamily: 'Playfair Display, serif',
                    color: 'white',
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    marginBottom: 6,
                  }}>
                    {item.name}
                  </h4>
                  <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.83rem', marginBottom: 18, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <i className="fa fa-map-marker-alt" style={{ color: 'var(--secondary)', fontSize: '0.75rem' }}></i>
                    {item.address}
                  </p>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <Link
                      to={`/resturent/${item._id}`}
                      style={{
                        flex: 1,
                        textAlign: 'center',
                        padding: '9px 0',
                        background: 'var(--primary)',
                        color: 'white',
                        borderRadius: 50,
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        textDecoration: 'none',
                        transition: 'background 0.25s',
                        letterSpacing: '0.02em',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--primary-light)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'var(--primary)'}
                    >
                      View Details
                    </Link>
                    <Link
                      to={`/resturent/${item._id}`}
                      style={{
                        flex: 1,
                        textAlign: 'center',
                        padding: '9px 0',
                        background: 'transparent',
                        color: 'white',
                        border: '2px solid rgba(255,255,255,0.25)',
                        borderRadius: 50,
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        textDecoration: 'none',
                        transition: 'border-color 0.25s, background 0.25s',
                        letterSpacing: '0.02em',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.6)';
                        e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)';
                        e.currentTarget.style.background = 'transparent';
                      }}
                    >
                      Reserve
                    </Link>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}