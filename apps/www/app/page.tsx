import Features from "@/src/components/Features";
import Footer from "@/src/components/Footer";
import Hero from "@/src/components/Hero";
import LogoMarquee from "@/src/components/LogoMarquee";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Hero />
      <LogoMarquee />
      <Features />
      <Footer />
    </main>
  );
}
