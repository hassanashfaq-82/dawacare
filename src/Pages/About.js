import React from "react";
import Header from "../Components/Header";
import Footer from "../Components/Footer";

const About = () => {
  return (
    <div>
      <Header />

      <div className="content" style={{ margin: "100px 0px" }}>
        <h1 style={{ color: "#d2222d" }}>
          Who We Are
        </h1>
        <p style={{ textAlign: "justify", lineHeight: "1.8", marginTop: "20px" }}>
          Dawacare is a trusted healthcare platform committed to making health and wellness products easily accessible to everyone. Our mission is to empower individuals to take charge of their health by providing high-quality medicines, supplements, and personal care products in a safe and convenient way.
        </p>

        <h2 style={{ marginTop: "40px", color: "#d2222d" }}>Our Mission</h2>
        <p style={{ textAlign: "justify", lineHeight: "1.8" }}>
          We strive to deliver reliable, authentic, and affordable healthcare products directly to your doorstep. At Dawacare, we believe in accessibility, quality, and trust. We want every customer to feel confident in the products they purchase and the guidance we provide.
        </p>

        <h2 style={{ marginTop: "40px", color: "#d2222d" }}>What We Offer</h2>
        <p style={{ textAlign: "justify", lineHeight: "1.8" }}>
          Our platform offers a wide range of products, including prescription medicines, over-the-counter supplements, vitamins, wellness boosters, and personal care items. Every product is sourced from verified manufacturers to ensure authenticity and effectiveness.
        </p>

        <h2 style={{ marginTop: "40px", color: "#d2222d" }}>Why Choose Dawacare?</h2>
        <ul style={{ lineHeight: "1.8", paddingLeft: "20px", marginTop: "10px" }}>
          <li><strong>Easy Ordering:</strong> A user-friendly platform to search, select, and order products in minutes.</li>
          <li><strong>Fast Delivery:</strong> Quick, safe, and tracked delivery right to your doorstep.</li>
          <li><strong>Expert Guidance:</strong> Assistance and information on proper usage of medicines and supplements.</li>
          <li><strong>Secure Transactions:</strong> Safe payment options with complete privacy protection.</li>
        </ul>

        <h2 style={{ marginTop: "40px", color: "#d2222d" }}>Our Values</h2>
        <ul style={{ lineHeight: "1.8", paddingLeft: "20px", marginTop: "10px" }}>
          <li><strong>Integrity:</strong> Honesty in every transaction and product we offer.</li>
          <li><strong>Customer-Centric:</strong> The needs and health of our customers are our top priority.</li>
          <li><strong>Innovation:</strong> Continuously improving our platform for the best healthcare experience.</li>
          <li><strong>Reliability:</strong> Consistency and quality service you can trust.</li>
        </ul>

        <h2 style={{ marginTop: "40px", color: "#d2222d" }}>Looking Ahead</h2>
        <p style={{ textAlign: "justify", lineHeight: "1.8" }}>
          At Dawacare, we are dedicated to improving the way people access healthcare. We continue to expand our product range, enhance our technology, and create a better experience for our customers. Your health is our priority, and we are here to make healthcare simple, convenient, and reliable.
        </p>
      </div>

      <Footer />
    </div>
  );
};

export default About;