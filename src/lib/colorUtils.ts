// Color conversion utilities
export function hexToHSL(hex: string): [number, number, number] {
  // Convert hex to RGB first
  let r = 0, g = 0, b = 0;
  
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  } else if (hex.length === 7) {
    r = parseInt(hex.slice(1, 3), 16);
    g = parseInt(hex.slice(3, 5), 16);
    b = parseInt(hex.slice(5, 7), 16);
  }
  
  // Then to HSL
  r /= 255;
  g /= 255;
  b /= 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    
    h /= 6;
  }
  
  return [h * 360, s * 100, l * 100];
}

export function HSLToHex(h: number, s: number, l: number): string {
  h /= 360;
  s /= 100;
  l /= 100;
  
  let r, g, b;
  
  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }
  
  const toHex = (x: number) => {
    const hex = Math.round(x * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

// Palette generation functions
export function generateMonochromaticPalette(baseColor: string): string[] {
  const [h, s, l] = hexToHSL(baseColor);
  
  return [
    HSLToHex(h, Math.max(0, s - 30), Math.min(95, l + 25)),
    HSLToHex(h, Math.max(0, s - 15), Math.min(90, l + 15)),
    baseColor,
    HSLToHex(h, Math.min(100, s + 15), Math.max(10, l - 15)),
    HSLToHex(h, Math.min(100, s + 30), Math.max(5, l - 25))
  ];
}

export function generateAnalogousPalette(baseColor: string): string[] {
  const [h, s, l] = hexToHSL(baseColor);
  
  return [
    HSLToHex((h - 30 + 360) % 360, s, l),
    HSLToHex((h - 15 + 360) % 360, s, l),
    baseColor,
    HSLToHex((h + 15) % 360, s, l),
    HSLToHex((h + 30) % 360, s, l)
  ];
}

export function generateComplementaryPalette(baseColor: string): string[] {
  const [h, s, l] = hexToHSL(baseColor);
  const complementH = (h + 180) % 360;
  
  return [
    HSLToHex(h, Math.max(0, s - 15), Math.min(95, l + 15)),
    baseColor,
    HSLToHex(h, Math.min(100, s + 15), Math.max(25, l - 10)),
    HSLToHex(complementH, Math.max(0, s - 15), Math.min(95, l + 15)),
    HSLToHex(complementH, Math.min(100, s), Math.max(25, l))
  ];
}

export function generateTriadicPalette(baseColor: string): string[] {
  const [h, s, l] = hexToHSL(baseColor);
  
  return [
    baseColor,
    HSLToHex((h + 120) % 360, s, l),
    HSLToHex((h + 240) % 360, s, l),
    HSLToHex((h + 60) % 360, s - 10, l + 10),
    HSLToHex((h + 300) % 360, s - 10, l + 10)
  ];
}

export function generateRandomPalette(): string[] {
  const palette = [];
  
  for (let i = 0; i < 5; i++) {
    const h = Math.floor(Math.random() * 360);
    const s = Math.floor(Math.random() * 40) + 60; // 60-100% saturation
    const l = Math.floor(Math.random() * 30) + 35; // 35-65% lightness
    palette.push(HSLToHex(h, s, l));
  }
  
  return palette;
}

// Enhanced mixColors function that considers color theory more deeply
export function mixColors(colors: string[]): string[] {
  if (colors.length === 0) return generateRandomPalette();
  
  // For a single color, generate an aesthetically pleasing palette
  if (colors.length === 1) {
    // Randomly choose between different palette types for variety
    const paletteTypes = [
      generateMonochromaticPalette,
      generateAnalogousPalette,
      generateComplementaryPalette
    ];
    
    const randomPaletteGenerator = paletteTypes[Math.floor(Math.random() * paletteTypes.length)];
    return randomPaletteGenerator(colors[0]);
  }
  
  // For 2-3 base colors, create a palette that includes the originals
  // and intelligently generates complementary colors
  const palette: string[] = [...colors];
  
  // Convert all colors to HSL for better mixing
  const hslColors = colors.map(color => hexToHSL(color));
  
  // Calculate average HSL values
  const avgH = hslColors.reduce((sum, [h]) => sum + h, 0) / hslColors.length;
  const avgS = hslColors.reduce((sum, [, s]) => sum + s, 0) / hslColors.length;
  const avgL = hslColors.reduce((sum, [, , l]) => sum + l, 0) / hslColors.length;
  
  // Add a color that complements the average
  palette.push(HSLToHex((avgH + 180) % 360, avgS, avgL));
  
  // For 2 colors, add a transitional color between them
  if (colors.length === 2) {
    const [h1, s1, l1] = hslColors[0];
    const [h2, s2, l2] = hslColors[1];
    
    // Calculate the shortest path between the two hues
    let hueDiff = (h2 - h1 + 360) % 360;
    if (hueDiff > 180) hueDiff = hueDiff - 360;
    
    // Create transitional color
    const transH = (h1 + hueDiff / 2 + 360) % 360;
    const transS = (s1 + s2) / 2;
    const transL = (l1 + l2) / 2;
    
    palette.push(HSLToHex(transH, transS, transL));
  }
  
  // If we have 3 colors already, add two more to make 5
  if (colors.length === 3) {
    // Add a color that's complementary to the first base color
    const [h1, s1, l1] = hslColors[0];
    palette.push(HSLToHex((h1 + 180) % 360, s1, l1));
    
    // Add a color that balances all three input colors
    // by using the triadic complement of their average
    palette.push(HSLToHex((avgH + 120) % 360, avgS, avgL));
  }
  
  // Ensure we always return exactly 5 colors
  while (palette.length < 5) {
    // Add variations of existing colors
    const baseIndex = Math.floor(Math.random() * colors.length);
    const [h, s, l] = hexToHSL(colors[baseIndex]);
    
    // Create a subtle variation
    const newH = (h + (Math.random() * 40 - 20) + 360) % 360;
    const newS = Math.max(20, Math.min(95, s + (Math.random() * 20 - 10)));
    const newL = Math.max(20, Math.min(80, l + (Math.random() * 30 - 15)));
    
    palette.push(HSLToHex(newH, newS, newL));
  }
  
  // If we somehow got more than 5 colors, trim the excess
  return palette.slice(0, 5);
}

// Palette naming
const adjectives = [
  "Vibrant", "Muted", "Pastel", "Bold", "Subtle",
  "Warm", "Cool", "Rich", "Soft", "Bright",
  "Dusty", "Deep", "Light", "Dark", "Vivid",
  "Dreamy", "Electric", "Earthy", "Vintage", "Modern"
];

const nouns = [
  "Sunset", "Ocean", "Forest", "Desert", "Mountain",
  "Meadow", "Dawn", "Dusk", "Twilight", "Spring",
  "Summer", "Autumn", "Winter", "Garden", "Sky",
  "Reef", "Valley", "Mist", "Storm", "Breeze"
];

export function generatePaletteName(): string {
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  return `${adjective} ${noun}`;
}

// Additional utility function to get color name
export function getColorName(hex: string): string {
  // This is a simple implementation
  // A more sophisticated version would use a color names database
  
  const [h, s, l] = hexToHSL(hex);
  
  // Define hue ranges for basic color names
  const hueRanges = [
    { name: "Red", min: 355, max: 10 },
    { name: "Orange", min: 11, max: 40 },
    { name: "Yellow", min: 41, max: 70 },
    { name: "Green", min: 71, max: 150 },
    { name: "Cyan", min: 151, max: 200 },
    { name: "Blue", min: 201, max: 260 },
    { name: "Purple", min: 261, max: 320 },
    { name: "Pink", min: 321, max: 354 }
  ];
  
  // Find the color name based on hue
  let colorName = "Gray"; // Default
  
  // If it's very dark or very light or not saturated, it's a neutral
  if (l < 10) return "Black";
  if (l > 90 && s < 15) return "White";
  if (s < 15) return l < 50 ? "Dark Gray" : "Light Gray";
  
  // Find the matching hue range
  for (const range of hueRanges) {
    if ((range.min <= h && h <= range.max) || 
        (range.name === "Red" && (h >= 355 || h <= 10))) {
      colorName = range.name;
      
      // Add modifiers based on saturation and lightness
      if (s < 40) colorName = "Muted " + colorName;
      else if (s > 80) colorName = "Vibrant " + colorName;
      
      if (l < 30) colorName = "Dark " + colorName;
      else if (l > 70) colorName = "Light " + colorName;
      
      break;
    }
  }
  
  return colorName;
}
