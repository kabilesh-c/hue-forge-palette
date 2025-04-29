
import { ColorSwatch } from "./ColorSwatch";

interface PaletteDisplayProps {
  colors: string[];
  lockedColors: boolean[];
  onToggleLock: (index: number) => void;
}

export function PaletteDisplay({ colors, lockedColors, onToggleLock }: PaletteDisplayProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
      {colors.map((color, index) => (
        <ColorSwatch
          key={`${color}-${index}`}
          color={color}
          isLocked={lockedColors[index]}
          onToggleLock={() => onToggleLock(index)}
        />
      ))}
    </div>
  );
}
