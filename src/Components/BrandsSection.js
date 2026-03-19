import React, { useEffect, useRef } from "react";
import Swiper from "swiper";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

function BrandsSection() {
  const swiperRef = useRef(null);
  const swiperInstance = useRef(null);

  useEffect(() => {
    if (swiperRef.current) {
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
          992: { slidesPerView: 5 },
        },
      });
    }

    return () => {
      if (swiperInstance.current) {
        swiperInstance.current.destroy(true, true);
      }
    };
  }, []);

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
            {/* Slide 1 */}
            <div className="swiper-slide brand-slide">
              <div className="brand-item">
                <div className="brand-circle">
                  <img src="./assets/Images/Ellipse 1 (1).png" alt="Pfizer" />
                </div>
                <p className="brand-name">Pfizer</p>
              </div>
            </div>

            {/* Slide 2 */}
            <div className="swiper-slide brand-slide">
              <div className="brand-item">
                <div className="brand-circle">
                  <img src="./assets/Images/Ellipse 1 (2).png" alt="Novartis" />
                </div>
                <p className="brand-name">Novartis</p>
              </div>
            </div>

            {/* Slide 3 */}
            <div className="swiper-slide brand-slide">
              <div className="brand-item">
                <div className="brand-circle">
                  <img src="./assets/Images/Ellipse 1 (5).png" alt="AbbVie" />
                </div>
                <p className="brand-name">AbbVie</p>
              </div>
            </div>

            {/* Slide 4 */}
            <div className="swiper-slide brand-slide">
              <div className="brand-item">
                <div className="brand-circle">
                  <img src="./assets/Images/Ellipse 1.png" alt="Panadol" />
                </div>
                <p className="brand-name">Panadol</p>
              </div>
            </div>

            {/* Slide 5 */}
            <div className="swiper-slide brand-slide">
              <div className="brand-item">
                <div className="brand-circle">
                  <img src="./assets/Images/Ellipse 1 (5).png" alt="AbbVie" />
                </div>
                <p className="brand-name">AbbVie</p>
              </div>
            </div>

            {/* Slide 6 */}
            <div className="swiper-slide brand-slide">
              <div className="brand-item">
                <div className="brand-circle">
                  <img src="./assets/Images/Ellipse 1.png" alt="Panadol" />
                </div>
                <p className="brand-name">Panadol</p>
              </div>
            </div>
          </div>

          {/* Pagination */}
       </div>
      </div>
    </section>
  );
}

export default BrandsSection;
