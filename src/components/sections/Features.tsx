
import { Palette, Copy, Download } from "lucide-react";

export function Features() {
  return (
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
  );
}
