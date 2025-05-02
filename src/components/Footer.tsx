
import { Github } from "lucide-react";

export function Footer() {
  return (
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
  );
}
