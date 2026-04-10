import React from 'react'
import Header from '../components/Header';
import SaleMarquee from '../components/SaleMarquee';
import HeroSection from '../components/Herosection';
import FeaturesBar from '../components/Featuresbar';
import ProductSlider from '../components/Productslider';
import BrandsSection from '../components/BrandsSection';
import FeatureProducts from '../components/FeatureProducts';
import CTABanner from '../components/CTABanner';
import Gallery from '../components/Gallery';
import Testimonials from '../components/Testimonials';
// import NewsSection from '../components/NewsSection';
import FAQSection from '../components/FAQSection';
import Footer from '../components/Footer';

const Home = () => {
  return (
    <div>
      <Header />
      <SaleMarquee />
      <HeroSection />
      <FeaturesBar />
      <ProductSlider />
      <BrandsSection />
      <FeatureProducts />
      <CTABanner />
      <Gallery />
      <Testimonials />
      {/* <NewsSection/> */}
      <FAQSection />
      <Footer />

    </div>
  )
}

export default Home
