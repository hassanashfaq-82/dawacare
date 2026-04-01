import React from "react";

function CTABanner() {
  return (
    <section className="cta-banner">
      <div className="cta-container">
        {/* CTA Content */}
        <div className="cta-content">
          <span className="hot-offer-tag">Todays Hot Offer</span>
          <h2 className="cta-heading">Unlock 50% Off on Essential Medicines!</h2>
          <p className="cta-description">
            Embrance wellness without breaking the bank! Enjoy a generous 25% discount on a wide range of vital
            medicines at our online pharmacy. Your health matters, and so does your budget.
          </p>
          <a href="#" className="cta-order-btn">
            Place an Order Now
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18 8L22 12L18 16"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 12H22"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>

        {/* CTA Image */}
        <div className="cta-image-holder">
          <img src="./assets/Images/image 3.png" alt="CTA Banner" />
        </div>
      </div>
    </section>
  );
}

export default CTABanner;
