import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { ColorPicker } from "@/components/ColorPicker";
import { PaletteControls } from "@/components/PaletteControls";
import { PaletteDisplay } from "@/components/PaletteDisplay";
import { PaletteHistory } from "@/components/PaletteHistory";
import { generatePaletteName, mixColors } from "@/lib/colorUtils";
import { v4 as uuidv4 } from "uuid";

interface Palette {
  id: string;
  name: string;
  colors: string[];
}

interface PaletteGeneratorProps {
  paletteSection: React.RefObject<HTMLElement>;
}

// Local storage keys
const STORAGE_KEYS = {
  PALETTES: "hueforge-palettes",
  BASE_COLORS: "hueforge-base-colors"
};

export function PaletteGenerator({ paletteSection }: PaletteGeneratorProps) {
  const paletteRef = useRef<HTMLDivElement>(null);

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
        const html2canvas = (await import('html2canvas')).default;
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
    
    const file = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(file);
    a.download = `${currentPalette.name.replace(/\s+/g, "-").toLowerCase()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
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
    <section ref={paletteSection} className="py-12 bg-background" id="palette-section">
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
  );
}
