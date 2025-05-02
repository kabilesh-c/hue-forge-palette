
export function WhySection() {
  return (
    <section className="py-16 bg-secondary/50">
      <div className="container px-4 text-center">
        <h2 className="text-3xl font-bold mb-8">Why Use HueForge?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="bg-card/50 backdrop-blur-sm p-6 rounded-lg border border-border/30 hover:shadow-md transition-all hover:-translate-y-1">
            <div className="text-4xl font-bold text-primary mb-2">Fast</div>
            <p className="text-muted-foreground">Generate harmonious color palettes instantly with just a few clicks.</p>
          </div>
          <div className="bg-card/50 backdrop-blur-sm p-6 rounded-lg border border-border/30 hover:shadow-md transition-all hover:-translate-y-1">
            <div className="text-4xl font-bold text-primary mb-2">Offline</div>
            <p className="text-muted-foreground">Works without internet connection — all processing happens locally.</p>
          </div>
          <div className="bg-card/50 backdrop-blur-sm p-6 rounded-lg border border-border/30 hover:shadow-md transition-all hover:-translate-y-1">
            <div className="text-4xl font-bold text-primary mb-2">Beautiful</div>
            <p className="text-muted-foreground">Clean modern UI/UX designed for the best color creation experience.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
