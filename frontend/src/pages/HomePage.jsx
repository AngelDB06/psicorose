import React from 'react';
import HeroSection from '../components/common/HeroSection';
import ServicesSection from '../components/common/ServicesSection';
import ReviewsPreview from '../components/common/ReviewsPreview';

function HomePage() {
  return (
    <>
      <HeroSection />
      <ServicesSection />
      <ReviewsPreview />
    </>
  );
}

export default HomePage;
