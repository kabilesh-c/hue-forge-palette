
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface HeroProps {
  showPalette: boolean;
  setShowPalette: (show: boolean) => void;
}

export function Hero({ showPalette, setShowPalette }: HeroProps) {
  const [backgroundPosition, setBackgroundPosition] = useState("0% 0%");

  // Animated background effect
  useEffect(() => {
    const interval = setInterval(() => {
      setBackgroundPosition((prev) => {
        const currentPos = parseInt(prev.split("%")[0]);
        return `${(currentPos + 1) % 100}% ${(currentPos + 5) % 100}%`;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <section 
      className="relative py-20 overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(${backgroundPosition}, #e6b980, #eacda3, #d299c2, #fef9d7, #accbee)`,
        backgroundSize: "400% 400%"
      }}
    >
      <div className="container relative z-10 flex flex-col items-center text-center px-4">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
          Craft Beautiful Color Palettes
        </h1>
        <p className="text-xl max-w-2xl mb-8 opacity-90">
          Your playground for colors — Generate, Organize, and Play.
        </p>
        <Button 
          size="lg" 
          className="group text-lg px-8 py-6 transition-all hover:scale-105 bg-white/20 backdrop-blur-md border border-white/30 hover:bg-white/30"
          onClick={() => {
            setShowPalette(true);
          }}
        >
          Let's Craft
          <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
        </Button>
        
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background z-0"></div>
      </div>
    </section>
  );
}
