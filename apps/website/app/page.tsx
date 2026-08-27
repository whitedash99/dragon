import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { cookies } from "next/headers";
import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/hero/Hero";
import FeaturedGames from "@/components/sections/FeaturedGames";
import Community from "@/components/sections/Community";
import Footer from "@/components/layout/Footer";
import { ClientAuthWatcher } from "@/components/auth/ClientAuthWatcher";
import { ScrollSlideSection } from "@/components/motion/ScrollSlideSection";
import { PersonalizedWelcomeBar } from "@/components/auth/PersonalizedWelcomeBar";
import { DragonAtmosphere } from "@/components/cinematic/DragonAtmosphere";

export const dynamic = "force-dynamic";

export default async function Home() {
  let currentUser = null;
  try {
    const session = await getServerSession(authOptions);
    const cookieStore = await cookies();
    const hasDragonSession = cookieStore.get("dragon_session")?.value;
    currentUser = session?.user || (hasDragonSession ? { name: "Player" } : null);
  } catch (err) {
    currentUser = null;
  }

  return (
    <div className="min-h-screen bg-[#020512] text-slate-100 font-sans antialiased overflow-x-hidden select-none relative">
      <ClientAuthWatcher />
      <Navbar />

      {/* ═══ WORLD 1: DRAGON COSMIC CORE FULL-PAGE 3D ATMOSPHERE (FULL BLEED) ═══ */}
      <DragonAtmosphere world="core" />

      {currentUser && (
        <PersonalizedWelcomeBar initialUser={currentUser} />
      )}
      
      <main id="main-content" className="relative z-10 cinematic-page overflow-x-hidden">
        {/* ═══ 1. HERO SECTION (CYAN + VIOLET EMOTIONAL CORE) ═══ */}
        <Hero />
        
        {/* ═══ 2. FEATURED FLAGSHIP GAME SHOWCASE (SEAMLESS 3D DARK GLASS) ═══ */}
        <ScrollSlideSection direction="left">
          <FeaturedGames />
        </ScrollSlideSection>

        {/* ═══ 3. COMMUNITY & VERIFIED BROADCAST CHANNELS ═══ */}
        <ScrollSlideSection direction="right">
          <Community />
        </ScrollSlideSection>
      </main>

      <Footer />
    </div>
  );
}
