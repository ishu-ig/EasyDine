import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import 'swiper/css';
import 'swiper/css/pagination';
import { useDispatch, useSelector } from 'react-redux';
import { getMaincategory } from "../Redux/ActionCreators/MaincategoryActionCreators";
import { getSubcategory } from "../Redux/ActionCreators/SubcategoryActionCreators";

export default function CategorySlider({ title, data }) {
  const dispatch = useDispatch();
  const MaincategoryStateData = useSelector(state => state.MaincategoryStateData);
  const SubcategoryStateData = useSelector(state => state.SubcategoryStateData);

  useEffect(() => { dispatch(getMaincategory()); }, [MaincategoryStateData.length, dispatch]);
  useEffect(() => { dispatch(getSubcategory()); }, [SubcategoryStateData.length, dispatch]);

  return (
    <section
      style={{
        padding: '80px 0',
        background: 'linear-gradient(135deg, #FDF6EE 0%, #FFF8F3 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative blobs */}
      <div style={{
        position: 'absolute', top: -60, right: -60,
        width: 280, height: 280,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(200,64,10,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: -40, left: -40,
        width: 200, height: 200,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(244,160,68,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div className="container">
        {/* Section header */}
        <div className="text-center mb-5">
          <p style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.15em', color: 'var(--primary)', textTransform: 'uppercase', marginBottom: 8 }}>
            Browse By
          </p>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', fontWeight: 900, color: 'var(--dark)', margin: 0 }}>
            {title}
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 14 }}>
            <span style={{ width: 36, height: 3, background: 'var(--primary)', borderRadius: 2, display: 'block' }} />
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--secondary)', display: 'block' }} />
            <span style={{ width: 56, height: 3, background: 'var(--secondary)', borderRadius: 2, display: 'block', opacity: 0.5 }} />
          </div>
        </div>

        <Swiper
          modules={[Autoplay, Pagination]}
          slidesPerView={2}
          spaceBetween={20}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          breakpoints={{
            480: { slidesPerView: 2, spaceBetween: 16 },
            768: { slidesPerView: 3, spaceBetween: 20 },
            1024: { slidesPerView: 4, spaceBetween: 24 },
          }}
          loop={true}
          className="mySwiper"
          style={{ paddingBottom: 40 }}
        >
          {data?.map((item) => (
            <SwiperSlide key={item._id}>
              <div style={{ textAlign: 'center', padding: '0 8px' }}>
                {/* Image ring */}
                <div style={{ position: 'relative', display: 'inline-block', marginBottom: 16 }}>
                  <div style={{
                    width: 'clamp(120px, 18vw, 180px)',
                    height: 'clamp(120px, 18vw, 180px)',
                    borderRadius: '50%',
                    border: '3px solid transparent',
                    background: 'linear-gradient(white, white) padding-box, linear-gradient(135deg, var(--primary), var(--secondary)) border-box',
                    padding: 4,
                    display: 'inline-block',
                    boxShadow: '0 8px 24px rgba(200,64,10,0.15)',
                    transition: 'transform 0.35s ease, box-shadow 0.35s ease',
                  }}
                    className="category-ring"
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = 'translateY(-6px) scale(1.03)';
                      e.currentTarget.style.boxShadow = '0 16px 40px rgba(200,64,10,0.25)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = '';
                      e.currentTarget.style.boxShadow = '0 8px 24px rgba(200,64,10,0.15)';
                    }}
                  >
                    <img
                      src={`${process.env.REACT_APP_BACKEND_SERVER}/${item.pic}`}
                      alt={item.name}
                      style={{
                        width: '100%', height: '100%',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        display: 'block',
                      }}
                    />
                  </div>
                </div>

                <h4 style={{
                  fontFamily: 'Playfair Display, serif',
                  fontSize: 'clamp(0.85rem, 1.8vw, 1rem)',
                  fontWeight: 700,
                  color: 'var(--dark)',
                  marginBottom: 10,
                }}>
                  {item.name}
                </h4>

                <Link
                  to={title === "Maincategory" ? `/product?mc=${item.name}` : `/product?sc=${item.name}`}
                  style={{
                    display: 'inline-block',
                    background: 'transparent',
                    border: '2px solid var(--primary)',
                    color: 'var(--primary)',
                    borderRadius: 50,
                    padding: '6px 18px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    letterSpacing: '0.03em',
                    textDecoration: 'none',
                    transition: 'all 0.25s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'var(--primary)';
                    e.currentTarget.style.color = 'white';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = 'var(--primary)';
                  }}
                >
                  Explore →
                </Link>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}