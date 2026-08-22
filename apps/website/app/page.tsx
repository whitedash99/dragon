import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/hero/Hero";
import FeaturedGames from "@/components/sections/FeaturedGames";
import LatestNews from "@/components/sections/LatestNews";
import Footer from "@/components/layout/Footer";
import { MobileGodLevelHome } from "@/components/mobile/MobileGodLevelHome";
import { ClientAuthWatcher } from "@/components/auth/ClientAuthWatcher";
import { ScrollSlideSection } from "@/components/motion/ScrollSlideSection";

export const dynamic = "force-dynamic";

export default async function Home() {
  const session = await getServerSession(authOptions);
  const cookieStore = await cookies();
  const hasDragonSession = cookieStore.get("dragon_session")?.value;

  // If user is signed in with Google or Email, immediately open the God-Level Dashboard!
  if (session?.user || hasDragonSession) {
    redirect("/dashboard");
  }

  return (
    <>
      <ClientAuthWatcher />

      <Navbar />
      <main id="main-content" className="cinematic-page overflow-x-hidden bg-background">
        <Hero />
        
        <div className="section-divider" />
        
        {/* Section 2: Slides In Smoothly from Left to Right with 3D Air-Lifting Lightning */}
        <ScrollSlideSection direction="left">
          <FeaturedGames />
        </ScrollSlideSection>

        <div className="section-divider" />
        
        {/* Section 3: Slides In Smoothly from Right to Left */}
        <ScrollSlideSection direction="right">
          <LatestNews />
        </ScrollSlideSection>
      </main>
      <Footer />
    </>
  );
}
