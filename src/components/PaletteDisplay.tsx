
import { useState } from "react";
import { ColorSwatch } from "./ColorSwatch";

interface PaletteDisplayProps {
  colors: string[];
  lockedColors: boolean[];
  onToggleLock: (index: number) => void;
}

export function PaletteDisplay({ colors, lockedColors, onToggleLock }: PaletteDisplayProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [colorsList, setColorsList] = useState<string[]>(colors);
  const [lockedList, setLockedList] = useState<boolean[]>(lockedColors);

  // Update local state when props change
  if (JSON.stringify(colorsList) !== JSON.stringify(colors)) {
    setColorsList(colors);
  }

  if (JSON.stringify(lockedList) !== JSON.stringify(lockedColors)) {
    setLockedList(lockedColors);
  }

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    // Create new arrays for the reordered colors and locked states
    const newColors = [...colorsList];
    const newLocked = [...lockedList];

    // Save the dragged items
    const draggedColor = newColors[draggedIndex];
    const draggedLocked = newLocked[draggedIndex];

    // Remove the dragged items
    newColors.splice(draggedIndex, 1);
    newLocked.splice(draggedIndex, 1);

    // Insert the dragged items at the new position
    newColors.splice(index, 0, draggedColor);
    newLocked.splice(index, 0, draggedLocked);

    // Update the state
    setColorsList(newColors);
    setLockedList(newLocked);

    // Update the dragged index
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    // Here we would update the parent state to reflect the new order
    // But since we would need to add a callback prop from the parent, 
    // we'll leave this as a visual-only reordering for now
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
      {colorsList.map((color, index) => (
        <div 
          key={`${color}-${index}`} 
          className="animate-slide-up" 
          style={{ animationDelay: `${index * 0.1}s` }}
          draggable="true"
          onDragStart={() => handleDragStart(index)}
          onDragOver={(e) => handleDragOver(e, index)}
          onDragEnd={handleDragEnd}
        >
          <ColorSwatch
            color={color}
            isLocked={lockedList[index]}
            onToggleLock={() => onToggleLock(index)}
          />
        </div>
      ))}
    </div>
  );
}
