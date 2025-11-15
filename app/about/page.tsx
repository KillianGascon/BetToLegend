// app/about/page.tsx (par exemple)
import Navbar from "@/components/Navbar";
import AboutHero from "@/components/about/AboutHero";
import AboutMission from "@/components/about/AboutMission";
import AboutHighlights from "@/components/about/AboutHighlights";
import AboutValues from "@/components/about/AboutValues";
import AboutCTA from "@/components/about/AboutCTA";


export default function AboutPage() {
  return (
    <div className="relative min-h-screen text-white">
      {/* <div className="absolute inset-0 w-full h-full -z-10">
        <img
          src="/bg.png"
          alt="Background"
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div> */}

      {/* Contenu */}
      <header className="container mx-auto px-6 lg:px-16 py-4 lg:py-6">
        <Navbar />
      </header>

      <main className="pb-16">
        <AboutHero />
        <AboutMission />
        <AboutHighlights />
        <AboutValues />
        <AboutCTA />
      </main>
    </div>
  );
}
