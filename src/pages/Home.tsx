
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Palette, Copy, Download, Github } from "lucide-react";

export default function Home() {
  const navigate = useNavigate();
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
        <section 
          className="relative py-20 overflow-hidden" 
          style={{
            background: `linear-gradient(${backgroundPosition}, #e6b980, #eacda3, #d299c2, #fef9d7, #accbee)`,
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
              onClick={() => navigate('/palette')}
            >
              Launch HueForge
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background z-0"></div>
          </div>
        </section>

        {/* Features Preview */}
        <section className="py-16 bg-background">
          <div className="container px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-card rounded-xl p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 border border-border/50 backdrop-blur-sm">
                <div className="h-12 w-12 flex items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
                  <Palette className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Pick and Customize Colors</h3>
                <p className="text-muted-foreground">
                  Select up to three base colors and generate beautiful, harmonious palettes with a single click.
                </p>
              </div>
              
              <div className="bg-card rounded-xl p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 border border-border/50 backdrop-blur-sm">
                <div className="h-12 w-12 flex items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
                  <Copy className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Save and Manage Palettes</h3>
                <p className="text-muted-foreground">
                  Lock colors you love, regenerate others, and keep a history of your favorite palettes locally.
                </p>
              </div>
              
              <div className="bg-card rounded-xl p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 border border-border/50 backdrop-blur-sm">
                <div className="h-12 w-12 flex items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
                  <Download className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Instant Copy & Export</h3>
                <p className="text-muted-foreground">
                  Export your palettes as PNG or JSON with one click, or copy individual color codes instantly.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Why Use HueForge */}
        <section className="py-16 bg-secondary/50">
          <div className="container px-4 text-center">
            <h2 className="text-3xl font-bold mb-8">Why Use HueForge?</h2>
            <div className="flex flex-wrap justify-center gap-8 max-w-3xl mx-auto">
              <div className="flex flex-col items-center">
                <div className="text-4xl font-bold text-primary mb-2">Fast</div>
                <p className="text-muted-foreground">Generate palettes instantly</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-4xl font-bold text-primary mb-2">Offline</div>
                <p className="text-muted-foreground">Works without internet</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-4xl font-bold text-primary mb-2">Beautiful</div>
                <p className="text-muted-foreground">Clean, modern UI/UX</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="border-t py-8 bg-card">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm text-muted-foreground">
              HueForge Palette Generator — Create beautiful color palettes with ease.
            </div>
            <div className="flex items-center gap-6">
              <a href="#about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                About
              </a>
              <a 
                href="https://github.com" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="h-4 w-4" />
                GitHub
              </a>
              <a href="#credits" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Credits
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
