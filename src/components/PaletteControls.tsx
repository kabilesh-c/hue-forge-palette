
import { Button } from "@/components/ui/button";
import { 
  Download, 
  RefreshCw 
} from "lucide-react";
import { toast } from "sonner";
import html2canvas from "html2canvas";

interface PaletteControlsProps {
  onRegenerate: () => void;
  paletteName: string;
  onExportPNG: () => void;
  onExportJSON: () => void;
}

export function PaletteControls({
  onRegenerate,
  paletteName,
  onExportPNG,
  onExportJSON
}: PaletteControlsProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
      <div className="text-xl font-medium">{paletteName}</div>
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="outline" onClick={onRegenerate}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Regenerate
        </Button>
        
        <Button variant="outline" onClick={onExportPNG}>
          <Download className="mr-2 h-4 w-4" />
          Export PNG
        </Button>
        
        <Button variant="outline" onClick={onExportJSON}>
          <Download className="mr-2 h-4 w-4" />
          Export JSON
        </Button>
      </div>
    </div>
  );
}
