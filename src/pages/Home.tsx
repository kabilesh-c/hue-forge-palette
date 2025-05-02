
import { useRef, useState } from "react";
import { Hero } from "@/components/sections/Hero";
import { Features } from "@/components/sections/Features";
import { WhySection } from "@/components/sections/WhySection";
import { Footer } from "@/components/Footer";
import { PaletteGenerator } from "@/components/sections/PaletteGenerator";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Palette } from "lucide-react";

export default function Home() {
  const [showPalette, setShowPalette] = useState(false);
  const paletteSection = useRef<HTMLElement>(null);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="sticky top-0 z-10 backdrop-blur-sm bg-background/80 border-b">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Palette className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">
              Hue<span className="text-primary">Forge</span>
            </h1>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-grow">
        {/* Hero Section */}
        <Hero showPalette={showPalette} setShowPalette={setShowPalette} />

        {/* Palette Generator Section */}
        {showPalette && <PaletteGenerator paletteSection={paletteSection} />}

        {/* Features Preview (only shown when palette is hidden) */}
        {!showPalette && <Features />}

        {/* Why Use HueForge */}
        <WhySection />
      </main>
      
      <Footer />
    </div>
  );
}
