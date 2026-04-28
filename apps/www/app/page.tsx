import Hero from "@/src/components/Hero";
import Features from "@/src/components/Features";
import Footer from "@/src/components/Footer";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Features />
      <Footer />
    </main>
  );
}
