import Preloader from "@/components/ui/Preloader";
import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero";
import HeroCinematic from "@/components/sections/HeroCinematic";
import HeroParallaxBg from "@/components/sections/HeroParallaxBg";
import TrustStrip from "@/components/sections/TrustStrip";
import AboutFounder from "@/components/sections/AboutFounder";
import FeaturedProjects from "@/components/sections/FeaturedProjects";
import ProjectHighlights from "@/components/sections/ProjectHighlights";
import CustomerTools from "@/components/sections/CustomerTools";
import AmenitiesGrid from "@/components/sections/AmenitiesGrid";
import FloorPlans from "@/components/sections/FloorPlans";
import GalleryLightbox from "@/components/sections/GalleryLightbox";
import LocationAdvantage from "@/components/sections/LocationAdvantage";
import WhyChooseUs from "@/components/sections/WhyChooseUs";
import FaqAccordion from "@/components/sections/FaqAccordion";
import SiteVisitBooking from "@/components/sections/SiteVisitBooking";
import FloatingWhatsApp from "@/components/ui/FloatingWhatsApp";
import Footer from "@/components/layout/Footer";

export default function HomePage() {
  return (
    <>
      <Preloader />
      <Navbar />
      <main id="main-content">
        <Hero />
        {/* <HeroCinematic /> */}
        {/* <HeroParallaxBg /> */}
        <TrustStrip />
        <AboutFounder />
        <FeaturedProjects />
        <ProjectHighlights />
        <CustomerTools />
        <AmenitiesGrid />
        <FloorPlans />
        <GalleryLightbox />
        <LocationAdvantage />
        <WhyChooseUs />
        <FaqAccordion />
        <SiteVisitBooking />
      </main>
      <FloatingWhatsApp />
      <Footer />
    </>
  );
}