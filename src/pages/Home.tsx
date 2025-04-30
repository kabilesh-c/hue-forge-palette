
import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ArrowRight, Palette, Copy, Download, Github, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";
import { ColorPicker } from "@/components/ColorPicker";
import { PaletteControls } from "@/components/PaletteControls";
import { PaletteDisplay } from "@/components/PaletteDisplay";
import { PaletteHistory } from "@/components/PaletteHistory";
import { generatePaletteName, mixColors } from "@/lib/colorUtils";
import html2canvas from "html2canvas";
import { v4 as uuidv4 } from "uuid";

interface Palette {
  id: string;
  name: string;
  colors: string[];
}

// Local storage keys
const STORAGE_KEYS = {
  PALETTES: "hueforge-palettes",
  BASE_COLORS: "hueforge-base-colors"
};

// Function to download data as a file
function downloadFile(data: string, filename: string, type: string) {
  const file = new Blob([data], { type });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(file);
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

export default function Home() {
  const [showPalette, setShowPalette] = useState(false);
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

  // Load base colors from local storage or use default
  const [baseColors, setBaseColors] = useState<string[]>(() => {
    const savedBaseColors = localStorage.getItem(STORAGE_KEYS.BASE_COLORS);
    return savedBaseColors ? JSON.parse(savedBaseColors) : ["#6366F1"];
  });

  const [currentPalette, setCurrentPalette] = useState<Palette>({
    id: uuidv4(),
    name: generatePaletteName(),
    colors: ["#6366F1", "#8B5CF6", "#A78BFA", "#C4B5FD", "#EDE9FE"]
  });
  const [lockedColors, setLockedColors] = useState<boolean[]>(Array(5).fill(false));
  
  // Load palette history from local storage or initialize empty
  const [paletteHistory, setPaletteHistory] = useState<Palette[]>(() => {
    const savedPalettes = localStorage.getItem(STORAGE_KEYS.PALETTES);
    return savedPalettes ? JSON.parse(savedPalettes) : [];
  });
  
  const paletteRef = useRef<HTMLDivElement>(null);

  // Initialize with a palette
  useEffect(() => {
    if (paletteHistory.length === 0) {
      regeneratePalette();
    }
  }, []);

  // Save base colors to local storage when they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BASE_COLORS, JSON.stringify(baseColors));
  }, [baseColors]);

  // Save palette history to local storage when it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PALETTES, JSON.stringify(paletteHistory));
  }, [paletteHistory]);

  // Add current palette to history when it changes
  useEffect(() => {
    if (currentPalette.colors.length > 0) {
      // Only add to history if it's not already there
      if (!paletteHistory.some(p => p.id === currentPalette.id)) {
        setPaletteHistory(prev => [currentPalette, ...prev].slice(0, 10));
      }
    }
  }, [currentPalette, paletteHistory]);

  const regeneratePalette = () => {
    const newColors = mixColors(baseColors);
    const updatedColors = currentPalette.colors.map((color, index) => {
      return lockedColors[index] ? color : newColors[index];
    });

    setCurrentPalette({
      id: uuidv4(),
      name: generatePaletteName(),
      colors: updatedColors
    });
  };

  const handleToggleLock = (index: number) => {
    setLockedColors(prev => {
      const updated = [...prev];
      updated[index] = !updated[index];
      return updated;
    });
  };

  const handleAddBaseColor = () => {
    if (baseColors.length < 3) {
      // Generate a random color if we've added 2+ colors already
      // Otherwise use a complementary color to the first one
      const newColor = baseColors.length >= 2
        ? `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`
        : `#${(parseInt(baseColors[0].slice(1), 16) ^ 0xFFFFFF).toString(16).padStart(6, '0')}`;
      
      setBaseColors([...baseColors, newColor]);
    } else {
      toast.error("Maximum 3 base colors allowed");
    }
  };

  const handleRemoveBaseColor = (index: number) => {
    if (baseColors.length > 1) {
      const newColors = [...baseColors];
      newColors.splice(index, 1);
      setBaseColors(newColors);
    } else {
      toast.error("At least one base color is required");
    }
  };

  const handleExportPNG = async () => {
    if (paletteRef.current) {
      try {
        const canvas = await html2canvas(paletteRef.current, {
          backgroundColor: null,
          scale: 2
        });
        
        const dataUrl = canvas.toDataURL("image/png");
        const a = document.createElement("a");
        a.href = dataUrl;
        a.download = `${currentPalette.name.replace(/\s+/g, "-").toLowerCase()}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        toast.success("Palette exported as PNG");
      } catch (error) {
        console.error("Error exporting PNG:", error);
        toast.error("Failed to export as PNG");
      }
    }
  };

  const handleExportJSON = () => {
    const data = {
      name: currentPalette.name,
      colors: currentPalette.colors,
      timestamp: new Date().toISOString()
    };
    
    downloadFile(
      JSON.stringify(data, null, 2),
      `${currentPalette.name.replace(/\s+/g, "-").toLowerCase()}.json`,
      "application/json"
    );
    
    toast.success("Palette exported as JSON");
  };
  
  const handleSelectFromHistory = (palette: Palette) => {
    setCurrentPalette(palette);
    setLockedColors(Array(palette.colors.length).fill(false));
  };

  const handleClearHistory = () => {
    setPaletteHistory([]);
    localStorage.removeItem(STORAGE_KEYS.PALETTES);
    toast.success("Palette history cleared");
  };

  const handleReorderColors = (newOrder: string[], newLockedOrder: boolean[]) => {
    setCurrentPalette({
      ...currentPalette,
      colors: newOrder
    });
    setLockedColors(newLockedOrder);
  };

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
              onClick={() => setShowPalette(!showPalette)}
            >
              {showPalette ? "Hide Palette" : "Let's Craft"}
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background z-0"></div>
          </div>
        </section>

        {/* Palette Generator Section */}
        {showPalette && (
          <section className="py-12 bg-background">
            <div className="container">
              <div className="mb-8">
                <h2 className="text-lg font-medium mb-4">Base Colors</h2>
                
                <div className="flex flex-wrap items-center gap-4">
                  {baseColors.map((color, index) => (
                    <ColorPicker
                      key={index}
                      color={color}
                      onChange={(newColor) => {
                        const newColors = [...baseColors];
                        newColors[index] = newColor;
                        setBaseColors(newColors);
                      }}
                      onRemove={() => handleRemoveBaseColor(index)}
                      canRemove={baseColors.length > 1}
                    />
                  ))}
                  
                  {baseColors.length < 3 && (
                    <Button 
                      variant="outline" 
                      className="w-20 h-20 border-dashed"
                      onClick={handleAddBaseColor}
                    >
                      <ArrowRight size={24} />
                    </Button>
                  )}
                </div>
                
                <div className="mt-4">
                  <Button 
                    onClick={regeneratePalette}
                    className="bg-primary hover:bg-primary/90 transition-all hover:scale-105"
                  >
                    Generate Palette
                  </Button>
                </div>
              </div>
              
              {paletteHistory.length > 0 && (
                <PaletteHistory 
                  palettes={paletteHistory} 
                  onSelect={handleSelectFromHistory}
                  currentPaletteId={currentPalette.id}
                  onClearHistory={handleClearHistory}
                />
              )}
              
              <div className="bg-card rounded-lg shadow-sm p-6 border border-border/50 backdrop-blur-sm hover:shadow-md transition-all">
                <PaletteControls
                  paletteName={currentPalette.name}
                  onRegenerate={regeneratePalette}
                  onExportPNG={handleExportPNG}
                  onExportJSON={handleExportJSON}
                />
                
                <div ref={paletteRef}>
                  <PaletteDisplay
                    colors={currentPalette.colors}
                    lockedColors={lockedColors}
                    onToggleLock={handleToggleLock}
                    onReorderColors={handleReorderColors}
                  />
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Features Preview (only shown when palette is hidden) */}
        {!showPalette && (
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
        )}

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
