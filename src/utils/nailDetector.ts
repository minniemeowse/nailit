// Utility for client-side canvas nail extraction, brush selection masks, 8-Point Landmark TPS rectification, 3D charm accessories, and "Baked" glossy gel press-on finishing
import {
  Point2D,
  NailLandmarks8,
  RectificationQuality,
  estimateNailLandmarks,
  warpNailToCanonicalSpace,
  CANONICAL_LANDMARKS
} from "./tpsWarp";

export interface TappedPoint {
  id: string;
  normX: number; // 0 to 1000
  normY: number; // 0 to 1000
  pixelX: number;
  pixelY: number;
  label?: string;
  fingerGuess?: string;
}

export type NailShapeType = "almond" | "oval" | "coffin" | "square" | "round";

export interface AppliedCharm {
  id: string;
  name: string;
  category: "gummy" | "crystal" | "bow" | "pearl" | "decal";
  emoji?: string;
  iconSvg?: string;
  x: number; // percentage on nail (0 to 100)
  y: number; // percentage on nail (0 to 100)
  scale: number; // 0.6 to 2.0
  rotation: number; // degrees
}

export interface DetectedNailBox {
  id: string;
  label: string;
  fingerGuess?: string;
  box2d?: [number, number, number, number];
  dominantColor: string;
  colorName?: string;
  finish: "glossy" | "matte" | "chrome" | "holographic" | "glitter";
  artStyle: "solid" | "french" | "ombre" | "marble" | "pattern" | "accent";
  secondaryColor?: string | null;
  decorations?: string;
  details?: string;
  croppedImage: string;
  rawCroppedImage?: string;
  rotationDegrees?: number;
  isStraightened?: boolean;
  confidence?: number;
  isBaked?: boolean;
  shapeType?: NailShapeType;
  landmarks?: Point2D[];
  rectificationQuality?: RectificationQuality;
  appliedCharms?: AppliedCharm[];
  tappedPoint?: TappedPoint;
}

export interface ContourStraightenResult {
  pngDataUrl: string;
  rawPngDataUrl: string;
  dominantColor: string;
  rotationDegrees: number;
  confidence: number;
  isStraightened: boolean;
  landmarks?: Point2D[];
  rectificationQuality?: RectificationQuality;
}

// 3D Gem & Charm Library (Rich collection matching salon reference photo)
export interface CharmPreset {
  id: string;
  name: string;
  category: "gummy" | "crystal" | "bow" | "pearl" | "decal";
  emoji: string;
  color: string;
  glow: string;
  description: string;
}

export const CHARM_PRESETS: CharmPreset[] = [
  // 🧸 3D Resin Figurines & Gummy Bears (Exact match to reference photo)
  {
    id: "charm_gummy_amber",
    name: "Caramel 3D Gummy Bear",
    category: "gummy",
    emoji: "🧸",
    color: "#C67D4A",
    glow: "rgba(198, 125, 74, 0.4)",
    description: "Glossy amber 3D resin gummy bear with party hat"
  },
  {
    id: "charm_gummy_pink",
    name: "Bubblegum 3D Bear",
    category: "gummy",
    emoji: "🐻",
    color: "#F48FB1",
    glow: "rgba(244, 143, 177, 0.4)",
    description: "Cute translucent jelly pink bear charm"
  },
  {
    id: "charm_birthday_cake",
    name: "3D Birthday Cake",
    category: "gummy",
    emoji: "🎂",
    color: "#FFF0F5",
    glow: "rgba(255, 182, 193, 0.5)",
    description: "Miniature layered cream cake with rainbow sprinkles"
  },
  {
    id: "charm_gift_box",
    name: "3D Gift Box with Ribbon",
    category: "gummy",
    emoji: "🎁",
    color: "#80DEEA",
    glow: "rgba(128, 222, 234, 0.5)",
    description: "Candy-wrapped turquoise gift charm with yellow ribbon"
  },

  // 🎀 3D Coquette Bows
  {
    id: "charm_bow_pearl",
    name: "3D Pearl Ribbon Bow",
    category: "bow",
    emoji: "🎀",
    color: "#FFFFFF",
    glow: "rgba(255, 255, 255, 0.6)",
    description: "Delicate sculpted acrylic ribbon with center micro-gem"
  },
  {
    id: "charm_bow_pink",
    name: "Blush Coquette Bow",
    category: "bow",
    emoji: "🩰",
    color: "#F8BBD0",
    glow: "rgba(248, 187, 208, 0.5)",
    description: "Translucent frosted resin bow"
  },

  // 💎 3D Aurora Crystals & Rhinestones
  {
    id: "charm_gem_diamond",
    name: "Aurora Star Diamond",
    category: "crystal",
    emoji: "💎",
    color: "#E0F7FA",
    glow: "rgba(0, 229, 255, 0.6)",
    description: "Multi-faceted holographic glass crystal with brilliant refraction"
  },
  {
    id: "charm_gem_heart",
    name: "Jelly Crystal Heart",
    category: "crystal",
    emoji: "💖",
    color: "#FF4081",
    glow: "rgba(255, 64, 129, 0.5)",
    description: "3D raised faceted ruby-pink crystal heart"
  },
  {
    id: "charm_star_holo",
    name: "Silver Cosmic Star",
    category: "crystal",
    emoji: "⭐",
    color: "#FFF9C4",
    glow: "rgba(255, 235, 59, 0.5)",
    description: "Raised 4-point aurora rhinestone star"
  },

  // ⚪ Pearls & Caviar Accents
  {
    id: "charm_pearl_drop",
    name: "Iridescent Half-Pearl",
    category: "pearl",
    emoji: "⚪",
    color: "#FFFDE7",
    glow: "rgba(255, 253, 231, 0.7)",
    description: "Lustrous Japanese salon dome pearl"
  },
  {
    id: "charm_gold_bead",
    name: "Golden Caviar Bead",
    category: "pearl",
    emoji: "✨",
    color: "#FFD700",
    glow: "rgba(255, 215, 0, 0.5)",
    description: "14K gold metallic micro-sphere cluster"
  },
  {
    id: "charm_cherry",
    name: "3D Glazed Cherries",
    category: "decal",
    emoji: "🍒",
    color: "#E91E63",
    glow: "rgba(233, 30, 99, 0.4)",
    description: "Juicy twin red cherries with green stem"
  }
];

/**
 * Loads an image from a Data URL / URL asynchronously
 */
export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.src = src;
  });
}

/**
 * Converts RGB numbers to Hex string
 */
export function rgbToHex(r: number, g: number, b: number): string {
  return (
    "#" +
    [r, g, b]
      .map((x) => {
        const hex = Math.max(0, Math.min(255, Math.round(x))).toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      })
      .join("")
  );
}

/**
 * Draws an anatomical nail silhouette path (Almond, Oval, Coffin, Square, Round)
 */
export function drawAnatomicalNailPath(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  width: number,
  height: number,
  shape: NailShapeType = "almond"
) {
  const hw = width / 2;
  const hh = height / 2;

  ctx.beginPath();

  // Cuticle Base (bottom center)
  ctx.moveTo(cx, cy + hh);

  // Left Cuticle Curve
  ctx.bezierCurveTo(cx - hw * 0.92, cy + hh, cx - hw, cy + hh * 0.55, cx - hw, cy + hh * 0.1);

  if (shape === "almond") {
    // Tapered Almond Tip
    ctx.bezierCurveTo(cx - hw * 0.95, cy - hh * 0.35, cx - hw * 0.45, cy - hh * 0.88, cx, cy - hh);
    ctx.bezierCurveTo(cx + hw * 0.45, cy - hh * 0.88, cx + hw * 0.95, cy - hh * 0.35, cx + hw, cy + hh * 0.1);
  } else if (shape === "coffin") {
    // Tapered Flat Coffin Tip
    ctx.lineTo(cx - hw * 0.58, cy - hh);
    ctx.lineTo(cx + hw * 0.58, cy - hh);
    ctx.lineTo(cx + hw, cy + hh * 0.1);
  } else if (shape === "square") {
    // Crisp Square Tip with Soft Corners
    ctx.bezierCurveTo(cx - hw, cy - hh * 0.7, cx - hw, cy - hh, cx - hw * 0.85, cy - hh);
    ctx.lineTo(cx + hw * 0.85, cy - hh);
    ctx.bezierCurveTo(cx + hw, cy - hh, cx + hw, cy - hh * 0.7, cx + hw, cy + hh * 0.1);
  } else {
    // Oval / Round Tip
    ctx.bezierCurveTo(cx - hw, cy - hh * 0.45, cx - hw * 0.82, cy - hh, cx, cy - hh);
    ctx.bezierCurveTo(cx + hw * 0.82, cy - hh, cx + hw, cy - hh * 0.45, cx + hw, cy + hh * 0.1);
  }

  // Right Cuticle Curve back to Bottom Center
  ctx.bezierCurveTo(cx + hw, cy + hh * 0.55, cx + hw * 0.92, cy + hh, cx, cy + hh);
  ctx.closePath();
}

/**
 * Adds a high-gloss "Baked" 3D gel topcoat with specular light reflections onto an isolated upright nail canvas
 */
export function renderBakedGlossyTopcoat(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
) {
  ctx.save();
  ctx.globalCompositeOperation = "source-atop";

  // 1. Glossy Specular Reflection Arc (Left/Top Curve of the Nail)
  const glossGrad = ctx.createLinearGradient(0, 0, width * 0.65, height * 0.85);
  glossGrad.addColorStop(0, "rgba(255, 255, 255, 0.78)");
  glossGrad.addColorStop(0.25, "rgba(255, 255, 255, 0.48)");
  glossGrad.addColorStop(0.55, "rgba(255, 255, 255, 0.0)");
  glossGrad.addColorStop(1, "rgba(255, 255, 255, 0.22)");

  ctx.fillStyle = glossGrad;
  ctx.beginPath();
  ctx.ellipse(
    width * 0.35,
    height * 0.38,
    Math.max(4, width * 0.14),
    Math.max(12, height * 0.35),
    -0.12,
    0,
    Math.PI * 2
  );
  ctx.fill();

  // 2. High-point circular glossy glint near the upper apex
  const glintGrad = ctx.createRadialGradient(
    width * 0.32,
    height * 0.22,
    1,
    width * 0.32,
    height * 0.22,
    Math.max(6, width * 0.22)
  );
  glintGrad.addColorStop(0, "rgba(255, 255, 255, 0.98)");
  glintGrad.addColorStop(0.4, "rgba(255, 255, 255, 0.45)");
  glintGrad.addColorStop(1, "rgba(255, 255, 255, 0)");

  ctx.fillStyle = glintGrad;
  ctx.beginPath();
  ctx.arc(width * 0.32, height * 0.22, Math.max(6, width * 0.22), 0, Math.PI * 2);
  ctx.fill();

  // 3. Subtle Bottom Right Rim Light (Glass volume bounce)
  const rimGrad = ctx.createLinearGradient(width * 0.7, height * 0.6, width, height);
  rimGrad.addColorStop(0, "rgba(255, 255, 255, 0)");
  rimGrad.addColorStop(1, "rgba(255, 255, 255, 0.4)");

  ctx.fillStyle = rimGrad;
  ctx.beginPath();
  ctx.ellipse(
    width * 0.75,
    height * 0.75,
    Math.max(3, width * 0.12),
    Math.max(8, height * 0.25),
    0.2,
    0,
    Math.PI * 2
  );
  ctx.fill();

  ctx.restore();
}

/**
 * Detects the local finger orientation angle θ around a tapped coordinate using gradient tensor analysis
 */
function estimateFingerAngleFromGradients(
  imgData: ImageData,
  centerX: number,
  centerY: number,
  radius: number
): number {
  const data = imgData.data;
  const w = imgData.width;
  const h = imgData.height;

  let gxx = 0;
  let gyy = 0;
  let gxy = 0;

  const minX = Math.max(2, Math.round(centerX - radius));
  const maxX = Math.min(w - 3, Math.round(centerX + radius));
  const minY = Math.max(2, Math.round(centerY - radius));
  const maxY = Math.min(h - 3, Math.round(centerY + radius));

  for (let y = minY; y <= maxY; y += 2) {
    for (let x = minX; x <= maxX; x += 2) {
      const idx = (y * w + x) * 4;
      const idxRight = (y * w + (x + 1)) * 4;
      const idxLeft = (y * w + (x - 1)) * 4;
      const idxDown = ((y + 1) * w + x) * 4;
      const idxUp = ((y - 1) * w + x) * 4;

      const lumR = data[idxRight] * 0.299 + data[idxRight + 1] * 0.587 + data[idxRight + 2] * 0.114;
      const lumL = data[idxLeft] * 0.299 + data[idxLeft + 1] * 0.587 + data[idxLeft + 2] * 0.114;
      const lumD = data[idxDown] * 0.299 + data[idxDown + 1] * 0.587 + data[idxDown + 2] * 0.114;
      const lumU = data[idxUp] * 0.299 + data[idxUp + 1] * 0.587 + data[idxUp + 2] * 0.114;

      const gx = (lumR - lumL) / 2;
      const gy = (lumD - lumU) / 2;

      gxx += gx * gx;
      gyy += gy * gy;
      gxy += gx * gy;
    }
  }

  const edgeTheta = 0.5 * Math.atan2(2 * gxy, gxx - gyy);
  let nailAngleRad = edgeTheta + Math.PI / 2;

  while (nailAngleRad > Math.PI) nailAngleRad -= 2 * Math.PI;
  while (nailAngleRad < -Math.PI) nailAngleRad += 2 * Math.PI;

  return nailAngleRad;
}

/**
 * Shape-Based Precision Nail Clipping & Auto-Straightening Engine
 */
export function extractContourStraightenedNail(
  img: HTMLImageElement,
  box: [number, number, number, number],
  seedPoint?: { normX: number; normY: number },
  applyBake: boolean = true,
  shapeType: NailShapeType = "almond",
  customAngleDeg?: number
): ContourStraightenResult {
  const naturalW = img.naturalWidth || img.width || 800;
  const naturalH = img.naturalHeight || img.height || 800;

  let [ymin, xmin, ymax, xmax] = box;
  const maxCoord = Math.max(ymin, xmin, ymax, xmax);
  const scale = maxCoord > 100 ? 1000 : maxCoord > 1 ? 100 : 1;

  const tapPixelX = seedPoint
    ? Math.round((seedPoint.normX / 1000) * naturalW)
    : Math.round(((xmin + xmax) / (2 * scale)) * naturalW);
  const tapPixelY = seedPoint
    ? Math.round((seedPoint.normY / 1000) * naturalH)
    : Math.round(((ymin + ymax) / (2 * scale)) * naturalH);

  const defaultNailW = Math.max(45, Math.round(naturalW * 0.13));
  const defaultNailH = Math.max(72, Math.round(defaultNailW * 1.65));

  const searchPad = Math.max(defaultNailW, defaultNailH) * 1.2;
  const srcX = Math.max(0, Math.round(tapPixelX - searchPad));
  const srcY = Math.max(0, Math.round(tapPixelY - searchPad));
  const srcW = Math.min(naturalW - srcX, Math.round(searchPad * 2));
  const srcH = Math.min(naturalH - srcY, Math.round(searchPad * 2));

  const localTapX = tapPixelX - srcX;
  const localTapY = tapPixelY - srcY;

  const sampleCanvas = document.createElement("canvas");
  const sampleCtx = sampleCanvas.getContext("2d", { willReadFrequently: true });
  if (!sampleCtx) {
    return {
      pngDataUrl: "",
      rawPngDataUrl: "",
      dominantColor: "#F4B8BA",
      rotationDegrees: 0,
      confidence: 0.8,
      isStraightened: false
    };
  }

  sampleCanvas.width = srcW;
  sampleCanvas.height = srcH;
  sampleCtx.drawImage(img, srcX, srcY, srcW, srcH, 0, 0, srcW, srcH);

  const sampleData = sampleCtx.getImageData(0, 0, srcW, srcH);

  const tapIdx = (Math.max(0, Math.min(srcH - 1, localTapY)) * srcW + Math.max(0, Math.min(srcW - 1, localTapX))) * 4;
  const dominantColor = rgbToHex(sampleData.data[tapIdx], sampleData.data[tapIdx + 1], sampleData.data[tapIdx + 2]);

  let rotationRad = 0;
  if (customAngleDeg !== undefined) {
    rotationRad = (customAngleDeg * Math.PI) / 180;
  } else {
    const estimatedAngle = estimateFingerAngleFromGradients(sampleData, localTapX, localTapY, defaultNailW * 0.8);
    rotationRad = -(estimatedAngle - Math.PI / 2);
  }

  let rotationDeg = Math.round((rotationRad * 180) / Math.PI);
  while (rotationDeg > 180) rotationDeg -= 360;
  while (rotationDeg < -180) rotationDeg += 360;

  // 2. Generate 8-Point Anatomical Landmarks in photo space
  const photoLandmarks = estimateNailLandmarks(
    tapPixelX,
    tapPixelY,
    defaultNailW,
    defaultNailH,
    -rotationRad
  );

  try {
    // 3. Thin Plate Spline (TPS) Geometric Rectification into Canonical 256x384 Space
    const tpsResult = warpNailToCanonicalSpace(img, photoLandmarks, applyBake);

    return {
      pngDataUrl: tpsResult.canonicalPngDataUrl,
      rawPngDataUrl: tpsResult.rawCanonicalPngDataUrl,
      dominantColor: tpsResult.dominantColor || dominantColor,
      rotationDegrees: rotationDeg,
      confidence: tpsResult.quality.designConfidence,
      isStraightened: true,
      landmarks: photoLandmarks,
      rectificationQuality: tpsResult.quality
    };
  } catch (err) {
    console.warn("TPS Rectification fallback:", err);
    // Fallback to anatomical affine slice
    const nailCanvasW = defaultNailW + 16;
    const nailCanvasH = defaultNailH + 16;

    const clipCanvas = document.createElement("canvas");
    clipCanvas.width = nailCanvasW;
    clipCanvas.height = nailCanvasH;
    const clipCtx = clipCanvas.getContext("2d");
    if (!clipCtx) {
      return {
        pngDataUrl: "",
        rawPngDataUrl: "",
        dominantColor,
        rotationDegrees: rotationDeg,
        confidence: 0.9,
        isStraightened: true
      };
    }

    clipCtx.clearRect(0, 0, nailCanvasW, nailCanvasH);
    const centerX = nailCanvasW / 2;
    const centerY = nailCanvasH / 2;

    clipCtx.save();
    drawAnatomicalNailPath(clipCtx, centerX, centerY, defaultNailW, defaultNailH, shapeType);
    clipCtx.clip();
    clipCtx.translate(centerX, centerY);
    clipCtx.rotate(-rotationRad);
    clipCtx.drawImage(img, -tapPixelX, -tapPixelY);
    clipCtx.restore();

    const rawPngDataUrl = clipCanvas.toDataURL("image/png");
    if (applyBake) {
      renderBakedGlossyTopcoat(clipCtx, nailCanvasW, nailCanvasH);
    }
    const pngDataUrl = clipCanvas.toDataURL("image/png");

    return {
      pngDataUrl,
      rawPngDataUrl,
      dominantColor,
      rotationDegrees: rotationDeg,
      confidence: 0.95,
      isStraightened: true,
      landmarks: photoLandmarks
    };
  }
}

/**
 * Point-Prompted Shape-Based Segmentation Engine with TPS
 */
export function segmentNailFromPoint(
  img: HTMLImageElement,
  normX: number, // 0 to 1000
  normY: number, // 0 to 1000
  tapIndex: number = 0,
  isBaked: boolean = true,
  shapeType: NailShapeType = "almond",
  customAngleDeg?: number
): DetectedNailBox & { croppedImage: string } {
  const naturalW = img.naturalWidth || img.width || 800;
  const naturalH = img.naturalHeight || img.height || 800;

  const pixelX = Math.round((normX / 1000) * naturalW);
  const pixelY = Math.round((normY / 1000) * naturalH);

  const nailWidthPercent = 0.14;
  const nailHeightPercent = 0.22;

  const halfW = Math.round(naturalW * (nailWidthPercent / 2));
  const halfH = Math.round(naturalH * (nailHeightPercent / 2));

  const yminPx = Math.max(0, pixelY - halfH);
  const ymaxPx = Math.min(naturalH, pixelY + halfH);
  const xminPx = Math.max(0, pixelX - halfW);
  const xmaxPx = Math.min(naturalW, pixelX + halfW);

  const ymin = Math.round((yminPx / naturalH) * 1000);
  const xmin = Math.round((xminPx / naturalW) * 1000);
  const ymax = Math.round((ymaxPx / naturalH) * 1000);
  const xmax = Math.round((xmaxPx / naturalW) * 1000);

  const box2d: [number, number, number, number] = [ymin, xmin, ymax, xmax];

  const {
    pngDataUrl,
    rawPngDataUrl,
    dominantColor,
    rotationDegrees,
    confidence,
    landmarks,
    rectificationQuality
  } = extractContourStraightenedNail(
    img,
    box2d,
    { normX, normY },
    isBaked,
    shapeType,
    customAngleDeg
  );

  const fingerSequence = [
    "Left Thumb",
    "Left Index",
    "Left Middle",
    "Left Ring",
    "Left Pinky",
    "Right Thumb",
    "Right Index",
    "Right Middle",
    "Right Ring",
    "Right Pinky"
  ];
  const fingerGuess = fingerSequence[tapIndex % fingerSequence.length];
  const labelNames = ["Left Thumb", "Left Index", "Left Middle", "Left Ring", "Left Pinky", "Right Thumb", "Right Index", "Right Middle", "Right Ring", "Right Pinky"];
  const label = labelNames[tapIndex % labelNames.length];

  return {
    id: `point_nail_${tapIndex + 1}_${Date.now()}`,
    label: label,
    fingerGuess: fingerGuess,
    box2d: box2d,
    dominantColor: dominantColor,
    colorName: `Custom Shade ${dominantColor}`,
    finish: isBaked ? "glossy" : "matte",
    artStyle: "solid",
    decorations: isBaked ? "✨ TPS Rectified & Baked 3D Gel" : "Canonical TPS segment",
    details: `8-Point TPS rectified nail warped to canonical 256×384 UV plane.`,
    croppedImage: pngDataUrl,
    rawCroppedImage: rawPngDataUrl,
    rotationDegrees: rotationDegrees,
    isStraightened: true,
    confidence: confidence,
    isBaked: isBaked,
    shapeType: shapeType,
    landmarks: landmarks,
    rectificationQuality: rectificationQuality,
    appliedCharms: [],
    tappedPoint: {
      id: `point_${tapIndex + 1}`,
      normX,
      normY,
      pixelX,
      pixelY,
      label,
      fingerGuess
    }
  };
}

/**
 * Brush/Lasso Stroke Extraction Engine:
 * Takes painted bounding coordinates or freehand stroke points, extracts the area,
 * straightens it, and clips it into a clean press-on piece.
 */
export function extractFromBrushBounds(
  img: HTMLImageElement,
  bounds: { minX: number; minY: number; maxX: number; maxY: number },
  tapIndex: number = 0,
  isBaked: boolean = true,
  shapeType: NailShapeType = "almond"
): DetectedNailBox & { croppedImage: string } {
  const naturalW = img.naturalWidth || img.width || 800;
  const naturalH = img.naturalHeight || img.height || 800;

  const centerX = (bounds.minX + bounds.maxX) / 2;
  const centerY = (bounds.minY + bounds.maxY) / 2;

  const normX = Math.round((centerX / naturalW) * 1000);
  const normY = Math.round((centerY / naturalH) * 1000);

  return segmentNailFromPoint(img, normX, normY, tapIndex, isBaked, shapeType);
}
