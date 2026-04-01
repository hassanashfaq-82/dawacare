import React, { useEffect, useRef } from "react";
import Swiper from "swiper";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { useBrands } from "../contexts/BrandsContext";

function BrandsSection() {
  const swiperRef = useRef(null);
  const swiperInstance = useRef(null);
  const { brands, loading } = useBrands();

  const sortedBrands = [...brands].sort((a, b) => a.order - b.order);

  useEffect(() => {
    if (!swiperRef.current || sortedBrands.length === 0) return;

    // Destroy previous instance before creating a new one
    if (swiperInstance.current) {
      swiperInstance.current.destroy(true, true);
      swiperInstance.current = null;
    }

    swiperInstance.current = new Swiper(swiperRef.current, {
      modules: [Autoplay, Pagination],
      slidesPerView: 4,
      spaceBetween: 30,
      loop: true,
      autoplay: {
        delay: 2500,
        disableOnInteraction: false,
      },
      pagination: {
        el: ".brands-pagination",
        clickable: true,
      },
      breakpoints: {
        0: { slidesPerView: 2 },
        576: { slidesPerView: 3 },
        992: { slidesPerView: 6 },
      },
    });

    return () => {
      if (swiperInstance.current) {
        swiperInstance.current.destroy(true, true);
        swiperInstance.current = null;
      }
    };
  }, [sortedBrands.length, loading]);

  if (loading || sortedBrands.length === 0) return null;

  return (
    <section className="brands-section">
      <div className="brands-container">
        <div className="section-header">
          <h2 className="section-title">
            Featured <span className="text-red big-span">Brand</span>
          </h2>
        </div>

        {/* SWIPER */}
        <div className="swiper brands-swiper" ref={swiperRef}>
          <div className="swiper-wrapper">
            {sortedBrands.map((brand) => (
              <div key={brand.id} className="swiper-slide brand-slide">
                <div className="brand-item">
                  <div className="brand-circle">
                    <img
                      src={brand.logoUrl}
                      alt={brand.name}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(brand.name)}&background=d2222d&color=fff&size=128&bold=true&rounded=true`;
                      }}
                    />
                  </div>
                  <p className="brand-name">{brand.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default BrandsSection;
