// Salon Base & Texture Library: Solid shades, French designs, Cat Eye Magnetic, Chrome Glazes, Aura & Marble

export type BaseCategory = "solid" | "french" | "cateye" | "chrome" | "aura" | "marble";

export interface NailBasePreset {
  id: string;
  name: string;
  category: BaseCategory;
  baseColor: string;
  secondaryColor?: string;
  accentColor?: string;
  finish: "glossy" | "matte" | "chrome" | "holographic" | "glitter";
  artStyle: "solid" | "french" | "ombre" | "marble" | "pattern" | "accent";
  description: string;
  badge?: string;
  // Dynamic CSS / Canvas Shader params
  gradient?: string;
  overlayPattern?: "classic_french" | "v_french" | "micro_french" | "ombre_french" | "cateye_beam" | "velvet_glow" | "aura_glow" | "marble_swirl" | "leopard_spots" | "glazed_chrome";
}

export const SALON_BASE_PRESETS: NailBasePreset[] = [
  // 💅 1. SOLID & JELLY SYRUP POLISHES
  {
    id: "solid_milky_nude",
    name: "Milky Nude Syrup",
    category: "solid",
    baseColor: "#F7E6DC",
    finish: "glossy",
    artStyle: "solid",
    description: "Translucent Korean syrup gel in soft milky beige",
    gradient: "linear-gradient(180deg, #FBF0EB 0%, #F5DEC9 100%)"
  },
  {
    id: "solid_ballet_pink",
    name: "Balletcore Blush",
    category: "solid",
    baseColor: "#FAD2E1",
    finish: "glossy",
    artStyle: "solid",
    description: "Sheer baby pink with juicy glass jelly shine",
    gradient: "linear-gradient(180deg, #FCE4EC 0%, #F8BBD0 100%)"
  },
  {
    id: "solid_peach_jelly",
    name: "Peach Syrup Gel",
    category: "solid",
    baseColor: "#FFD1B3",
    finish: "glossy",
    artStyle: "solid",
    description: "Fresh apricot jelly with high-shine gloss finish",
    gradient: "linear-gradient(180deg, #FFE0B2 0%, #FFCC80 100%)"
  },
  {
    id: "solid_lavender_syrup",
    name: "Lavender Milk",
    category: "solid",
    baseColor: "#E1BEE7",
    finish: "glossy",
    artStyle: "solid",
    description: "Soft lilac pastel with translucent glaze",
    gradient: "linear-gradient(180deg, #EDE7F6 0%, #D1C4E9 100%)"
  },
  {
    id: "solid_matcha_cream",
    name: "Matcha Latte",
    category: "solid",
    baseColor: "#DCE7C8",
    finish: "glossy",
    artStyle: "solid",
    description: "Creamy muted sage matcha green",
    gradient: "linear-gradient(180deg, #E8F5E9 0%, #C8E6C9 100%)"
  },
  {
    id: "solid_cherry_glaze",
    name: "Cherry Syrup",
    category: "solid",
    baseColor: "#D32F2F",
    finish: "glossy",
    artStyle: "solid",
    description: "Rich translucent red berry glass glaze",
    gradient: "linear-gradient(180deg, #EF5350 0%, #C62828 100%)"
  },
  {
    id: "solid_noir_obsidian",
    name: "Obsidian Noir",
    category: "solid",
    baseColor: "#1A1A1A",
    finish: "glossy",
    artStyle: "solid",
    description: "Deep jet black with mirror topcoat reflection",
    gradient: "linear-gradient(180deg, #333333 0%, #111111 100%)"
  },

  // 🤍 2. FRENCH MANICURE BASES
  {
    id: "french_classic_white",
    name: "Classic French Arch",
    category: "french",
    baseColor: "#F5DEC9",
    secondaryColor: "#FFFFFF",
    finish: "glossy",
    artStyle: "french",
    badge: "Popular",
    description: "Nude base with crisp white smile line arc",
    overlayPattern: "classic_french"
  },
  {
    id: "french_glazed_chrome",
    name: "Chrome Tip French",
    category: "french",
    baseColor: "#F8BBD0",
    secondaryColor: "#E0E0E0",
    accentColor: "#FFFFFF",
    finish: "chrome",
    artStyle: "french",
    badge: "Trending",
    description: "Blush jelly base with liquid silver chrome tips",
    overlayPattern: "classic_french"
  },
  {
    id: "french_micro_minimal",
    name: "Micro Line French",
    category: "french",
    baseColor: "#FBF0EB",
    secondaryColor: "#1A1A1A",
    finish: "glossy",
    artStyle: "french",
    description: "Ultra-fine razor line tip French in black / white",
    overlayPattern: "micro_french"
  },
  {
    id: "french_baby_boomer",
    name: "Baby Boomer Ombre",
    category: "french",
    baseColor: "#FAD2E1",
    secondaryColor: "#FFFFFF",
    finish: "glossy",
    artStyle: "ombre",
    badge: "Classic",
    description: "Seamless gradient transition from blush cuticle to milky white tip",
    overlayPattern: "ombre_french"
  },
  {
    id: "french_v_cut",
    name: "Modern V-Cut French",
    category: "french",
    baseColor: "#F5DEC9",
    secondaryColor: "#FF80AB",
    finish: "glossy",
    artStyle: "french",
    description: "Geometric sharp chevron V-tips in rose pink",
    overlayPattern: "v_french"
  },

  // 🧲 3. CAT EYE & MAGNETIC VELVET BASES
  {
    id: "cateye_silver_stardust",
    name: "Silver Stardust Cat Eye",
    category: "cateye",
    baseColor: "#424242",
    secondaryColor: "#E0F7FA",
    finish: "holographic",
    artStyle: "accent",
    badge: "3D Light",
    description: "Shimmering diagonal magnetic silver beam with deep smoky base",
    overlayPattern: "cateye_beam"
  },
  {
    id: "cateye_rose_velvet",
    name: "Rose Quartz Velvet",
    category: "cateye",
    baseColor: "#D81B60",
    secondaryColor: "#F8BBD0",
    finish: "glitter",
    artStyle: "accent",
    badge: "Velvet",
    description: "Diffused velvet magnetic glitter in luminous rose quartz",
    overlayPattern: "velvet_glow"
  },
  {
    id: "cateye_aurora_jade",
    name: "Aurora Emerald Cat Eye",
    category: "cateye",
    baseColor: "#1B5E20",
    secondaryColor: "#80CBC4",
    finish: "holographic",
    artStyle: "accent",
    description: "Emerald jelly base with electric teal-gold magnetic beam",
    overlayPattern: "cateye_beam"
  },
  {
    id: "cateye_midnight_galaxy",
    name: "Midnight Galaxy Cat Eye",
    category: "cateye",
    baseColor: "#1A237E",
    secondaryColor: "#CE93D8",
    finish: "holographic",
    artStyle: "accent",
    description: "Deep cosmos indigo with sparkling purple-blue magnetic streak",
    overlayPattern: "cateye_beam"
  },

  // ✨ 4. CHROME, AURA & ART TEXTURES
  {
    id: "chrome_glazed_donut",
    name: "Glazed Donut Chrome",
    category: "chrome",
    baseColor: "#FFF9C4",
    finish: "chrome",
    artStyle: "solid",
    badge: "Viral",
    description: "Milky base burnished with iridescent pearl chrome powder",
    overlayPattern: "glazed_chrome"
  },
  {
    id: "aura_sunset_blush",
    name: "Airbrush Blush Aura",
    category: "aura",
    baseColor: "#F5DEC9",
    secondaryColor: "#FF4081",
    finish: "glossy",
    artStyle: "ombre",
    badge: "Y2K",
    description: "Soft center airbrush aura blooming out to nude borders",
    overlayPattern: "aura_glow"
  },
  {
    id: "marble_white_quartz",
    name: "White Agate Marble",
    category: "marble",
    baseColor: "#FAFAFA",
    secondaryColor: "#BDBDBD",
    accentColor: "#FFD700",
    finish: "glossy",
    artStyle: "marble",
    description: "Hand-painted smokey quartz veins with 14K gold leaf foil",
    overlayPattern: "marble_swirl"
  },
  {
    id: "art_leopard_tortoise",
    name: "Tortoiseshell & Leopard",
    category: "marble",
    baseColor: "#FFB300",
    secondaryColor: "#3E2723",
    finish: "glossy",
    artStyle: "pattern",
    description: "Amber syrup jelly layered with dark brown leopard rosettes",
    overlayPattern: "leopard_spots"
  }
];

/**
 * Generates an ultra-crisp transparent PNG canvas representation of a nail base preset
 */
export function generateBaseNailImage(
  preset: NailBasePreset,
  width: number = 256,
  height: number = 384
): string {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  // 1. Draw Anatomical Almond/Oval Clipping Path
  ctx.save();
  const hw = width / 2;
  const hh = height / 2;
  const cx = hw;
  const cy = hh;

  ctx.beginPath();
  ctx.moveTo(cx, cy + hh * 0.95);
  ctx.bezierCurveTo(cx - hw * 0.92, cy + hh * 0.95, cx - hw * 0.98, cy + hh * 0.55, cx - hw * 0.95, cy + hh * 0.1);
  ctx.bezierCurveTo(cx - hw * 0.95, cy - hh * 0.35, cx - hw * 0.45, cy - hh * 0.88, cx, cy - hh * 0.96);
  ctx.bezierCurveTo(cx + hw * 0.45, cy - hh * 0.96, cx + hw * 0.95, cy - hh * 0.35, cx + hw * 0.95, cy + hh * 0.1);
  ctx.bezierCurveTo(cx + hw * 0.98, cy + hh * 0.55, cx + hw * 0.92, cy + hh * 0.95, cx, cy + hh * 0.95);
  ctx.closePath();
  ctx.clip();

  // 2. Base Color & Gradient Fill
  if (preset.gradient) {
    const grad = ctx.createLinearGradient(0, 0, 0, height);
    grad.addColorStop(0, preset.baseColor);
    grad.addColorStop(1, preset.secondaryColor || preset.baseColor);
    ctx.fillStyle = grad;
  } else {
    ctx.fillStyle = preset.baseColor;
  }
  ctx.fillRect(0, 0, width, height);

  // 3. Render Specific Pattern Overlays
  if (preset.overlayPattern === "classic_french") {
    // White French Smile Arc
    ctx.save();
    ctx.fillStyle = preset.secondaryColor || "#FFFFFF";
    ctx.beginPath();
    ctx.moveTo(0, height * 0.28);
    ctx.bezierCurveTo(width * 0.25, height * 0.42, width * 0.75, height * 0.42, width, height * 0.28);
    ctx.lineTo(width, 0);
    ctx.lineTo(0, 0);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  } else if (preset.overlayPattern === "micro_french") {
    // Micro Tip French
    ctx.save();
    ctx.fillStyle = preset.secondaryColor || "#1A1A1A";
    ctx.beginPath();
    ctx.moveTo(width * 0.15, height * 0.12);
    ctx.bezierCurveTo(width * 0.35, height * 0.16, width * 0.65, height * 0.16, width * 0.85, height * 0.12);
    ctx.lineTo(width, 0);
    ctx.lineTo(0, 0);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  } else if (preset.overlayPattern === "v_french") {
    // Chevron V-French
    ctx.save();
    ctx.fillStyle = preset.secondaryColor || "#FF80AB";
    ctx.beginPath();
    ctx.moveTo(0, height * 0.22);
    ctx.lineTo(cx, height * 0.44);
    ctx.lineTo(width, height * 0.22);
    ctx.lineTo(width, 0);
    ctx.lineTo(0, 0);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  } else if (preset.overlayPattern === "ombre_french") {
    // Baby Boomer Gradient
    const ombre = ctx.createLinearGradient(0, 0, 0, height * 0.75);
    ombre.addColorStop(0, preset.secondaryColor || "#FFFFFF");
    ombre.addColorStop(0.5, "rgba(255, 255, 255, 0.4)");
    ombre.addColorStop(1, "rgba(255, 255, 255, 0)");
    ctx.fillStyle = ombre;
    ctx.fillRect(0, 0, width, height);
  } else if (preset.overlayPattern === "cateye_beam") {
    // 3D Magnetic Cat Eye Light Streak
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(-Math.PI / 4);
    const beam = ctx.createLinearGradient(-width, 0, width, 0);
    beam.addColorStop(0, "rgba(255, 255, 255, 0)");
    beam.addColorStop(0.4, "rgba(255, 255, 255, 0.2)");
    beam.addColorStop(0.5, preset.secondaryColor || "#FFFFFF");
    beam.addColorStop(0.6, "rgba(255, 255, 255, 0.2)");
    beam.addColorStop(1, "rgba(255, 255, 255, 0)");
    ctx.fillStyle = beam;
    ctx.fillRect(-width * 1.5, -height * 1.5, width * 3, height * 3);
    ctx.restore();
  } else if (preset.overlayPattern === "velvet_glow") {
    // Soft Velvet Cat Eye Dome
    const velvet = ctx.createRadialGradient(cx, cy * 0.8, 10, cx, cy, width * 0.75);
    velvet.addColorStop(0, "rgba(255, 255, 255, 0.7)");
    velvet.addColorStop(0.5, "rgba(255, 255, 255, 0.2)");
    velvet.addColorStop(1, "rgba(255, 255, 255, 0)");
    ctx.fillStyle = velvet;
    ctx.fillRect(0, 0, width, height);
  } else if (preset.overlayPattern === "aura_glow") {
    // Center Airbrush Aura Blooming Glow
    const aura = ctx.createRadialGradient(cx, cy * 0.9, 10, cx, cy * 0.9, width * 0.55);
    aura.addColorStop(0, preset.secondaryColor || "#FF4081");
    aura.addColorStop(0.55, "rgba(255, 64, 129, 0.45)");
    aura.addColorStop(1, "rgba(255, 64, 129, 0)");
    ctx.fillStyle = aura;
    ctx.fillRect(0, 0, width, height);
  } else if (preset.overlayPattern === "glazed_chrome") {
    // Glazed Pearl Chrome Iridescent Burnish
    const chrome = ctx.createLinearGradient(0, 0, width, height);
    chrome.addColorStop(0, "rgba(255, 255, 255, 0.65)");
    chrome.addColorStop(0.3, "rgba(255, 224, 178, 0.35)");
    chrome.addColorStop(0.7, "rgba(225, 190, 231, 0.35)");
    chrome.addColorStop(1, "rgba(255, 255, 255, 0.5)");
    ctx.fillStyle = chrome;
    ctx.fillRect(0, 0, width, height);
  } else if (preset.overlayPattern === "marble_swirl") {
    // Marble Quartz Veining
    ctx.save();
    ctx.strokeStyle = "rgba(100, 100, 100, 0.25)";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(width * 0.2, height * 0.1);
    ctx.bezierCurveTo(width * 0.4, height * 0.4, width * 0.7, height * 0.3, width * 0.8, height * 0.7);
    ctx.stroke();

    ctx.strokeStyle = "rgba(255, 215, 0, 0.6)"; // Gold Vein
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(width * 0.3, height * 0.2);
    ctx.bezierCurveTo(width * 0.5, height * 0.35, width * 0.6, height * 0.6, width * 0.7, height * 0.85);
    ctx.stroke();
    ctx.restore();
  } else if (preset.overlayPattern === "leopard_spots") {
    // Leopard Spots
    ctx.save();
    const spots = [
      { x: cx - 35, y: cy - 60, r: 14 },
      { x: cx + 40, y: cy - 40, r: 16 },
      { x: cx - 20, y: cy + 30, r: 18 },
      { x: cx + 30, y: cy + 70, r: 15 },
      { x: cx, y: cy - 10, r: 12 }
    ];
    spots.forEach((sp) => {
      ctx.fillStyle = "#8D6E63";
      ctx.beginPath();
      ctx.arc(sp.x, sp.y, sp.r, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#3E2723";
      ctx.beginPath();
      ctx.arc(sp.x - 3, sp.y - 3, sp.r * 0.6, 0, Math.PI * 1.5);
      ctx.fill();
    });
    ctx.restore();
  }

  // 4. Specular High-Gloss "Baked" 3D Gel Topcoat
  const glossGrad = ctx.createLinearGradient(0, 0, width * 0.65, height * 0.85);
  glossGrad.addColorStop(0, "rgba(255, 255, 255, 0.8)");
  glossGrad.addColorStop(0.25, "rgba(255, 255, 255, 0.45)");
  glossGrad.addColorStop(0.55, "rgba(255, 255, 255, 0.0)");
  glossGrad.addColorStop(1, "rgba(255, 255, 255, 0.22)");

  ctx.fillStyle = glossGrad;
  ctx.beginPath();
  ctx.ellipse(width * 0.35, height * 0.38, Math.max(4, width * 0.14), Math.max(12, height * 0.35), -0.12, 0, Math.PI * 2);
  ctx.fill();

  // Apex Glint
  const glint = ctx.createRadialGradient(width * 0.32, height * 0.22, 1, width * 0.32, height * 0.22, width * 0.22);
  glint.addColorStop(0, "rgba(255, 255, 255, 0.98)");
  glint.addColorStop(0.4, "rgba(255, 255, 255, 0.45)");
  glint.addColorStop(1, "rgba(255, 255, 255, 0)");
  ctx.fillStyle = glint;
  ctx.beginPath();
  ctx.arc(width * 0.32, height * 0.22, width * 0.22, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();

  return canvas.toDataURL("image/png");
}
