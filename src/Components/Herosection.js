import React, { useEffect } from "react";
import Swiper from "swiper/bundle";
import "swiper/css/bundle";
import { useSiteInfo, DEFAULT_SITE_INFO } from "../contexts/SiteInfoContext";

function HeroSection() {
  const { siteInfo, loading } = useSiteInfo();
  const slides = (!loading && siteInfo?.slides) ? siteInfo.slides : DEFAULT_SITE_INFO.slides;

  useEffect(() => {
    const heroSwiper = new Swiper(".hero-swiper", {
      loop: true,
      navigation: {
        nextEl: ".hero-next",
        prevEl: ".hero-prev",
      },
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
    });

    return () => {
      heroSwiper.destroy(true, true);
    };
  }, [slides]);

  return (
    <section className="hero-section">
      <br />
      <div className="swiper hero-swiper">
        <div className="swiper-wrapper">
          {slides.map((slide, index) => (
            <div className="swiper-slide" key={index}>
              <div className="hero-content">
                <div className="hero-text">
                  <h2 className="brand-tagline">{slide.heroTagline}</h2>
                  <h1 className="hero-title">
                    {slide.heroTitle}
                    <span className="big-span">{index === 1 ? <><br />{slide.heroTitleHighlight}</> : slide.heroTitleHighlight}</span>
                  </h1>
                  <h2 className="hero-subtitle">{slide.heroSubtitle}</h2>
                  <a href="#products" className="cta-button">Upto {slide.heroCTAButtonText}</a>
                </div>

                <div className="hero-image-wrapper">
                  <div className="red-circle">
                    <img src="/assets/Images/Ellipse 2.png" alt="Decorative circle" />
                  </div>
                  <img
                    src={slide.heroImageURL || "/assets/Images/steptodown.com322394 2.png"}
                    alt="Happy Customer"
                    className="hero-img"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="swiper-button-next hero-next">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path fill="currentColor" d="M4 12h12.25L11 6.75l.66-.75l6.5 6.5l-6.5 6.5l-.66-.75L16.25 13H4z" />
          </svg>
        </div>
        <div className="swiper-button-prev hero-prev">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path fill="currentColor" d="M19 13H6.75L12 18.25l-.66.75l-6.5-6.5l6.5-6.5l.66.75L6.75 12H19z" />
          </svg>
        </div>
        {/* <div className="swiper-pagination"></div> */}
      </div>
    </section>
  );
}

export default HeroSection;
