
export function WhySection() {
  return (
    <section className="py-16 bg-secondary/50">
      <div className="container px-4 text-center">
        <h2 className="text-3xl font-bold mb-8">Why Use HueForge?</h2>
        <div className="flex flex-wrap justify-center gap-8 max-w-3xl mx-auto">
          <div className="flex flex-col items-center">
            <div className="text-4xl font-bold text-primary mb-2">Fast</div>
            <p className="text-muted-foreground">Generate palettes instantly</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-4xl font-bold text-primary mb-2">Offline</div>
            <p className="text-muted-foreground">Works without internet</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-4xl font-bold text-primary mb-2">Beautiful</div>
            <p className="text-muted-foreground">Clean, modern UI/UX</p>
          </div>
        </div>
      </div>
    </section>
  );
}
