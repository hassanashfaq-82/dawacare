import React from 'react'
import Header from '../Components/Header';
import SaleMarquee from '../Components/SaleMarquee';
import HeroSection from '../Components/Herosection';
import FeaturesBar from '../Components/Featuresbar';
import ProductSlider from '../Components/Productslider';
import BrandsSection from '../Components/BrandsSection';
import FeatureProducts from '../Components/FeatureProducts';
import CTABanner from '../Components/CTABanner';
import Gallery from '../Components/Gallery';
import Testimonials from '../Components/Testimonials';
// import NewsSection from '../Components/NewsSection';
import FAQSection from '../Components/FAQSection';
import Footer from '../Components/Footer';

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
