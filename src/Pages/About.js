import React from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

const stats = [
  { value: "10,000+", label: "Happy Customers" },
  { value: "5,000+", label: "Products Available" },
  { value: "24hrs", label: "Delivery Time" },
  { value: "100%", label: "Authentic Products" },
];

const offerings = [
  {
    icon: "fa-solid fa-pills",
    title: "Prescription Medicines",
    desc: "Genuine prescription drugs sourced directly from verified manufacturers.",
  },
  {
    icon: "fa-solid fa-flask",
    title: "Supplements & Vitamins",
    desc: "A full range of vitamins, minerals, and wellness boosters for every need.",
  },
  {
    icon: "fa-solid fa-heart",
    title: "Personal Care",
    desc: "Premium personal care and hygiene products for your daily routine.",
  },
  {
    icon: "fa-solid fa-truck",
    title: "Fast Doorstep Delivery",
    desc: "Safe, tracked, and fast delivery right to your home in 24 hours.",
  },
  {
    icon: "fa-solid fa-stethoscope",
    title: "Expert Guidance",
    desc: "Proper usage information and healthcare assistance from our team.",
  },
  {
    icon: "fa-solid fa-shield",
    title: "Secure Transactions",
    desc: "End-to-end encrypted payments with complete privacy protection.",
  },
];

const values = [
  { icon: "fa-solid fa-handshake", title: "Integrity", desc: "Honesty in every transaction and every product we offer." },
  { icon: "fa-solid fa-users", title: "Customer-Centric", desc: "Your health and satisfaction drive every decision we make." },
  { icon: "fa-solid fa-lightbulb", title: "Innovation", desc: "Continuously improving our platform for the best experience." },
  { icon: "fa-solid fa-circle-check", title: "Reliability", desc: "Consistent quality service you can trust, every single time." },
];

const About = () => {
  return (
    <div>
      <Header />

      {/* ── Hero Banner ── */}
      <section className="hero-section">
        <div className="hero-content about-hero-content">
          <div className="hero-text about-hero-text">
            <span className="about-eyebrow">Who We Are</span>
            <h1 className="hero-title about-hero-title">
              Healthcare, <span className="big-span">Simplified.</span>
            </h1>
            <p className="hero-subtitle about-hero-sub">
              Dawacare is a trusted healthcare platform committed to making health and wellness products
              easily accessible to everyone — delivering quality, trust, and convenience right to your door.
            </p>
            <Link to="/" className="cta-button about-hero-cta">
              Shop Now &nbsp;<i className="fa-solid fa-arrow-right"></i>
            </Link>
          </div>

          <div className="hero-image-wrapper about-hero-image-wrapper">
            <div className="about-hero-badge-grid">
              {stats.map((s, i) => (
                <div className="about-stat-card" key={i}>
                  <span className="about-stat-value">{s.value}</span>
                  <span className="about-stat-label">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Mission ── */}
      <section className="about-section about-mission">
        <div className="about-section-tag">
          <i className="fa-solid fa-bullseye"></i> Our Mission
        </div>
        <div className="about-mission-layout">
          <div className="about-mission-text">
            <h2>Delivering Healthcare <span className="about-red">You Can Trust</span></h2>
            <p>
              We strive to deliver reliable, authentic, and affordable healthcare products directly to
              your doorstep. At Dawacare, we believe in accessibility, quality, and trust — so every
              customer feels confident in the products they purchase and the guidance we provide.
            </p>
            <p>
              We continue to expand our product range, enhance our technology, and create a better
              experience for our customers. Your health is our priority, and we are here to make
              healthcare simple, convenient, and reliable.
            </p>
          </div>
          <div className="about-mission-accent">
            <div className="about-accent-circle">
              <i className="fa-solid fa-heart"></i>
            </div>
            <div className="about-accent-lines">
              <div className="about-accent-line"></div>
              <div className="about-accent-line short"></div>
              <div className="about-accent-line"></div>
            </div>
          </div>
        </div>
      </section>

      {/* ── What We Offer ── */}
      <section className="about-section about-offerings">
        <div className="about-section-tag">
          <i className="fa-solid fa-store"></i> What We Offer
        </div>
        <h2 className="about-section-title">Everything Your Health <span className="about-red">Needs</span></h2>
        <div className="about-offerings-grid">
          {offerings.map((item, i) => (
            <div className="about-offer-card" key={i}>
              <div className="about-offer-icon">
                <i className={item.icon}></i>
              </div>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Values ── */}
      <section className="about-section about-values">
        <div className="about-section-tag">
          <i className="fa-solid fa-star"></i> Our Values
        </div>
        <h2 className="about-section-title">What We <span className="about-red">Stand For</span></h2>
        <div className="about-values-grid">
          {values.map((v, i) => (
            <div className="about-value-card" key={i}>
              <i className={v.icon}></i>
              <div>
                <h3>{v.title}</h3>
                <p>{v.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA Strip ── */}
      <section className="about-cta-strip">
        <div className="about-cta-strip-inner">
          <div>
            <h2>Ready to take charge of your health?</h2>
            <p>Browse thousands of authentic products and get them delivered in 24 hours.</p>
          </div>
          <Link to="/" className="about-cta-strip-btn">
            Order Now &nbsp;<i className="fa-solid fa-arrow-right"></i>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
