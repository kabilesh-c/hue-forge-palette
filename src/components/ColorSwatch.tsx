
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Check, Copy, Lock, Unlock } from "lucide-react";

interface ColorSwatchProps {
  color: string;
  isLocked?: boolean;
  onToggleLock?: () => void;
}

export function ColorSwatch({ color, isLocked = false, onToggleLock }: ColorSwatchProps) {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(color);
    setIsCopied(true);
    toast.success("Color copied to clipboard!", {
      description: color,
    });
    
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  return (
    <div className="flex flex-col color-swatch">
      <div 
        className="h-32 rounded-t-lg cursor-pointer relative group"
        style={{ backgroundColor: color }}
        onClick={copyToClipboard}
      >
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <Button 
            size="icon" 
            variant="secondary" 
            className="bg-white/20 backdrop-blur-sm border border-white/30 shadow-md"
          >
            {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>
        
        {onToggleLock && (
          <Button
            size="icon"
            variant={isLocked ? "secondary" : "ghost"} 
            className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 bg-white/20 backdrop-blur-sm hover:bg-white/40"
            onClick={(e) => {
              e.stopPropagation();
              onToggleLock();
            }}
          >
            {isLocked ? (
              <Lock className="h-3 w-3" />
            ) : (
              <Unlock className="h-3 w-3" />
            )}
          </Button>
        )}
      </div>
      <div 
        className="py-2 px-3 rounded-b-lg text-center text-sm font-medium cursor-pointer"
        onClick={copyToClipboard}
      >
        {color}
      </div>
    </div>
  );
}
