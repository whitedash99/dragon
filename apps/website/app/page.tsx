import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/hero/Hero";
import FeaturedGames from "@/components/sections/FeaturedGames";
import StudioTech from "@/components/sections/StudioTech";
import LatestNews from "@/components/sections/LatestNews";
import Community from "@/components/sections/Community";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="cinematic-page overflow-x-hidden bg-background">
        <Hero />
        <div className="section-divider" />
        <FeaturedGames />
        <div className="section-divider" />
        <StudioTech />
        <div className="section-divider" />
        <LatestNews />
        <div className="section-divider" />
        <Community />
      </main>
      <Footer />
    </>
  );
}
