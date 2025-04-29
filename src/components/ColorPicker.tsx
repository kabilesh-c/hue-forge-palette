
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { HexColorPicker } from "react-colorful";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Check, X } from "lucide-react";

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  onRemove?: () => void;
  canRemove?: boolean;
}

export function ColorPicker({ color, onChange, onRemove, canRemove = false }: ColorPickerProps) {
  const [localColor, setLocalColor] = useState(color);
  const [isOpen, setIsOpen] = useState(false);

  const handleColorChange = (newColor: string) => {
    setLocalColor(newColor);
    onChange(newColor);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalColor(value);
    if (/^#[0-9A-Fa-f]{6}$/.test(value)) {
      onChange(value);
    }
  };

  return (
    <div className="relative">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <div className="relative">
            <Button
              variant="outline"
              className={cn(
                "w-20 h-20 rounded-md p-0 border-2 flex items-center justify-center overflow-hidden",
                isOpen && "ring-2 ring-primary"
              )}
              style={{ backgroundColor: color }}
              aria-label="Pick a color"
            >
              <span className="sr-only">Pick a color</span>
            </Button>
            {canRemove && (
              <Button
                size="icon"
                variant="destructive"
                className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove?.();
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-3" align="start">
          <div className="space-y-3">
            <HexColorPicker color={localColor} onChange={handleColorChange} />
            <div className="flex gap-2 items-center">
              <div className="flex-1">
                <Input
                  value={localColor}
                  onChange={handleInputChange}
                  className="font-mono text-sm"
                />
              </div>
              <Button size="sm" onClick={() => setIsOpen(false)}>
                <Check className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
