import Header from "@/src/components/Header";

import ContactCTA from "@/src/components/ContactCTA";
import Footer from "@/src/components/Footer";
import Hero from "@/src/components/Hero";
import FeaturePromotion from "../../src/components/Features";
import FestivalCaseStudy from "../../src/components/FestivalCaseStudy";

export default function AboutPage() {
  return (
    <>
      <Header />
      <Hero />
      <FeaturePromotion />
      <FestivalCaseStudy />
      <ContactCTA />
      <Footer />
    </>
  );
}
