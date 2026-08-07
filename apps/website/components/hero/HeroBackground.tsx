import { GradientMesh } from "@/components/background/GradientMesh";
import { AmbientOrbs } from "@/components/background/AmbientOrbs";
import { NoiseLayer } from "@/components/background/NoiseLayer";
import { Vignette } from "@/components/background/Vignette";
import { Particles } from "@/components/background/Particles";
import { Fog } from "@/components/background/Fog";

export function HeroBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <GradientMesh />
      <AmbientOrbs count={3} />
      <Fog opacity={0.35} />
      <Particles quantity={60} />
      <NoiseLayer opacity={0.04} />
      <Vignette intensity={0.85} />
    </div>
  );
}
