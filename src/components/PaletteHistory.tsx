
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  ChevronDown,
  ChevronUp, 
  History,
  Trash2
} from "lucide-react";
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface Palette {
  id: string;
  name: string;
  colors: string[];
}

interface PaletteHistoryProps {
  palettes: Palette[];
  onSelect: (palette: Palette) => void;
  currentPaletteId: string;
  onClearHistory?: () => void;
}

export function PaletteHistory({ 
  palettes, 
  onSelect,
  currentPaletteId,
  onClearHistory
}: PaletteHistoryProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (palettes.length <= 0) return null;

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="mb-6 border rounded-lg p-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History className="h-5 w-5" />
          <h3 className="font-medium">Palette History</h3>
          <span className="text-xs text-muted-foreground">({palettes.length})</span>
        </div>
        <div className="flex items-center gap-2">
          {onClearHistory && palettes.length > 0 && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onClearHistory}
              title="Clear history"
            >
              <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
            </Button>
          )}
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm">
              {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </CollapsibleTrigger>
        </div>
      </div>
      
      <CollapsibleContent className="mt-4">
        <div className="space-y-3">
          {palettes.map((palette) => (
            <div 
              key={palette.id}
              className={`p-3 rounded-md cursor-pointer hover:bg-secondary transition-colors ${palette.id === currentPaletteId ? 'bg-secondary' : ''}`}
              onClick={() => onSelect(palette)}
            >
              <div className="text-sm font-medium mb-2">{palette.name}</div>
              <div className="flex gap-1">
                {palette.colors.map((color, index) => (
                  <div
                    key={`${palette.id}-${color}-${index}`}
                    className="h-5 w-5 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
