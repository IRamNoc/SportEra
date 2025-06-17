import React from 'react';
import Head from 'next/head';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import HeroSection from '../components/sections/HeroSection';
import UserProfilesSection from '../components/sections/UserProfilesSection';
import HowItWorksSection from '../components/sections/HowItWorksSection';
import AdvantagesSection from '../components/sections/AdvantagesSection';
import PartnersSection from '../components/sections/TestimonialsSection';
import StatisticsSection from '../components/sections/StatisticsSection';
import FinalCTASection from '../components/sections/FinalCTASection';

const HomePage: React.FC = () => {
  return (
    <>
      <Head>
        <title>Sport'Era - Révolutionnez votre pratique sportive</title>
        <meta name="description" content="Découvrez, explorez et validez vos sessions sportives dans toute la ville avec SportEra. Une expérience gamifiée unique." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-white">
        <Header />
        <HeroSection />
        <UserProfilesSection />
        <HowItWorksSection />
        <AdvantagesSection />
        <PartnersSection />
        <StatisticsSection />
        <FinalCTASection />
        <Footer />
      </div>
    </>
  );
};

export default HomePage;
