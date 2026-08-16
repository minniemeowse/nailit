import React, { useState } from "react";
import { NailCollection, NailDesign } from "../types";
import { Sparkles, Scissors, Sun, Eye, ZoomIn, Layers, Award, CornerDownRight, RotateCw, Lightbulb, CheckCircle } from "lucide-react";

export interface SkinTone {
  id: string;
  name: string;
  baseColor: string;      // main skin tone
  shadowColor: string;    // finger shadowing
  highlightColor: string; // specular light highlight
  nailBedColor: string;   // flesh tone underneath nail plates
}

const SKIN_TONES: SkinTone[] = [
  { id: "fair", name: "Fair Ivory", baseColor: "#F8ECE3", shadowColor: "#DFC2B0", highlightColor: "#FFF8F4", nailBedColor: "#F4C4BC" },
  { id: "warm", name: "Warm Honey", baseColor: "#E4B18E", shadowColor: "#C38C66", highlightColor: "#F5DEC9", nailBedColor: "#DF9789" },
  { id: "olive", name: "Olive Bronze", baseColor: "#BE875D", shadowColor: "#9A633B", highlightColor: "#DAC0A3", nailBedColor: "#B76F61" },
  { id: "espresso", name: "Espresso Rich", baseColor: "#674025", shadowColor: "#4A2D17", highlightColor: "#8D5D3B", nailBedColor: "#753930" },
];

interface NailHandRendererProps {
  collection: NailCollection;
  selectedFinger: string | null;
  onSelectFinger?: (fingerName: string) => void;
  shape: string;
  onDropNail?: (fingerName: string, nailId: string) => void;
}

export const NailHandRenderer: React.FC<NailHandRendererProps> = ({
  collection,
  selectedFinger,
  onSelectFinger,
  shape,
  onDropNail,
}) => {
  const [skinTone, setSkinTone] = useState<SkinTone>(SKIN_TONES[0]);
  const [studioLight, setStudioLight] = useState<"glossy" | "candlelight" | "studio" | "sunlight">("glossy");
  const [rotationAngle, setRotationAngle] = useState<number>(0); // 3D skew degree

  // New interactive 3D Orbit parameters for Japanese Jelly styles
  const [is3DMode, setIs3DMode] = useState<boolean>(true);
  const [rotationX, setRotationX] = useState<number>(15); // pitch
  const [rotationY, setRotationY] = useState<number>(-12); // yaw
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Custom 3D Gel Ornaments Layering Desk toggles
  const [active3DDecorations, setActive3DDecorations] = useState<{
    flower: boolean;
    bow: boolean;
    chain: boolean;
    pearl: boolean;
    gem: boolean;
    syrup: boolean;
    strawberry: boolean;
  }>({
    flower: false,
    bow: false,
    chain: false,
    pearl: false,
    gem: false,
    syrup: false,
    strawberry: false,
  });

  // Find currently selected nail
  const selectedNail = collection.nails.find(n => n.finger === selectedFinger) || collection.nails[0];

  // Helper to check if a nail is a jelly style
  const isJellyStyle = (nail: NailDesign | undefined): boolean => {
    if (!nail) return false;
    const desc = (nail.decorations || "").toLowerCase();
    const det = (nail.details || "").toLowerCase();
    const title = (nail.title || "").toLowerCase();
    return nail.baseColor.startsWith("rgba") || title.includes("jelly") || desc.includes("jelly") || det.includes("jelly") || title.includes("syrup") || desc.includes("syrup");
  };

  // Drag handlers for 3D showcase rotation
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!is3DMode) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !is3DMode) return;
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;
    setRotationY(prev => prev + dx * 0.5);
    setRotationX(prev => Math.max(-45, Math.min(45, prev - dy * 0.5)));
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!is3DMode || e.touches.length !== 1) return;
    setIsDragging(true);
    setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !is3DMode || e.touches.length !== 1) return;
    const dx = e.touches[0].clientX - dragStart.x;
    const dy = e.touches[0].clientY - dragStart.y;
    setRotationY(prev => prev + dx * 0.5);
    setRotationX(prev => Math.max(-45, Math.min(45, prev - dy * 0.5)));
    setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  // Helper to render high-fidelity 3D ornaments with shadows, gradients and depth
  const renderNail3DDecorations = (nail: NailDesign, isBig: boolean = false) => {
    const decStr = (nail.decorations || "").toLowerCase();
    const detStr = (nail.details || "").toLowerCase();
    const titleStr = (nail.title || "").toLowerCase();

    // Check presence in state if it's the selected nail, or infer from design strings
    const isSelectedNail = nail.finger === selectedNail?.finger;
    const hasFlower = /flower|camellia|floral|rose/i.test(decStr) || /flower|camellia|floral|rose/i.test(detStr);
    const hasBow = /bow|ribbon|coquette/i.test(decStr) || /bow|ribbon|coquette/i.test(detStr);
    const hasChain = /chain|draping|swag|silver line/i.test(decStr) || /chain|draping|swag|silver line/i.test(detStr);
    const hasPearl = /pearl|bead/i.test(decStr) || /pearl|bead/i.test(detStr);
    const hasGem = /gem|rhinestone|crystal|diamond|stone/i.test(decStr) || /gem|rhinestone|crystal|diamond|stone/i.test(detStr);
    const hasSyrup = /syrup|jelly|ridge|wave|contour/i.test(decStr) || /syrup|jelly|ridge|wave|contour/i.test(detStr) || titleStr.includes("jelly") || titleStr.includes("syrup");
    const hasStrawberry = /strawberry|berry|fruit/i.test(decStr) || /strawberry|berry|fruit/i.test(detStr) || titleStr.includes("strawberry") || titleStr.includes("berry");

    const showFlower = (isSelectedNail && active3DDecorations.flower) || hasFlower;
    const showBow = (isSelectedNail && active3DDecorations.bow) || hasBow;
    const showChain = (isSelectedNail && active3DDecorations.chain) || hasChain;
    const showPearl = (isSelectedNail && active3DDecorations.pearl) || hasPearl;
    const showGem = (isSelectedNail && active3DDecorations.gem) || hasGem;
    const showSyrup = (isSelectedNail && active3DDecorations.syrup) || hasSyrup;
    const showStrawberry = (isSelectedNail && active3DDecorations.strawberry) || hasStrawberry;

    const scaleClass = isBig ? "" : "scale-[0.38] origin-center absolute inset-0 flex items-center justify-center";

    return (
      <div className={`absolute inset-0 pointer-events-none rounded-inherit ${scaleClass}`}>
        {/* 1. Clear Syrup Gel Waves (Japanese Jelly) */}
        {showSyrup && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path 
              d="M30 15 Q 55 45, 25 80" 
              fill="none" 
              stroke="rgba(255, 255, 255, 0.45)" 
              strokeWidth={isBig ? "8" : "15"} 
              strokeLinecap="round"
              className="filter drop-shadow-[0_2px_2px_rgba(0,0,0,0.15)] opacity-85"
            />
            <path 
              d="M30 15 Q 55 45, 25 80" 
              fill="none" 
              stroke="rgba(255, 255, 255, 0.75)" 
              strokeWidth={isBig ? "2.5" : "5"} 
              strokeLinecap="round"
              className="opacity-95"
            />
            <path 
              d="M70 25 Q 45 60, 75 90" 
              fill="none" 
              stroke="rgba(255, 255, 255, 0.4)" 
              strokeWidth={isBig ? "6" : "12"} 
              strokeLinecap="round"
              className="filter drop-shadow-[0_2px_2px_rgba(0,0,0,0.15)] opacity-85"
            />
            <path 
              d="M70 25 Q 45 60, 75 90" 
              fill="none" 
              stroke="rgba(255, 255, 255, 0.7)" 
              strokeWidth={isBig ? "2" : "4"} 
              strokeLinecap="round"
              className="opacity-95"
            />
          </svg>
        )}

        {/* 2. Silver hanging draping chains */}
        {showChain && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path 
              d="M15 35 Q 50 65, 85 35" 
              fill="none" 
              stroke="#B0B0B0" 
              strokeWidth={isBig ? "3.5" : "7"} 
              strokeLinecap="round"
              strokeDasharray={isBig ? "1, 4.5" : "1, 9"}
              className="filter drop-shadow-[0_2.5px_2px_rgba(0,0,0,0.35)]"
            />
            <path 
              d="M15 35 Q 50 65, 85 35" 
              fill="none" 
              stroke="#FFFFFF" 
              strokeWidth={isBig ? "1.5" : "3"} 
              strokeLinecap="round"
              strokeDasharray={isBig ? "1, 4.5" : "1, 9"}
              className="opacity-90"
            />
            <path 
              d="M20 55 Q 50 80, 80 55" 
              fill="none" 
              stroke="#D8D8D8" 
              strokeWidth={isBig ? "3" : "6"} 
              strokeLinecap="round"
              strokeDasharray={isBig ? "1, 4" : "1, 8"}
              className="filter drop-shadow-[0_2px_1.5px_rgba(0,0,0,0.3)]"
            />
          </svg>
        )}

        {/* 3. 3D Iridescent Camellia Flower */}
        {showFlower && (
          <div className={`absolute top-[42%] left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.35)] select-none ${isBig ? "w-14 h-14" : "w-28 h-28 scale-[2.2]"}`}>
            {[0, 72, 144, 216, 288].map((angle, i) => (
              <div 
                key={i}
                className="absolute rounded-full opacity-90 border border-white/40"
                style={{
                  width: isBig ? "20px" : "40px",
                  height: isBig ? "24px" : "48px",
                  background: "radial-gradient(circle at 35% 35%, #fffdfd 0%, #ffd6eb 55%, #f472b6 100%)",
                  transform: `rotate(${angle}deg) translateY(${isBig ? "-8px" : "-16px"})`,
                  boxShadow: "inset 1px 1px 2px rgba(255,255,255,0.8), 0 2px 3px rgba(0,0,0,0.15)",
                }}
              />
            ))}
            {/* Golden pearl center */}
            <div 
              className="absolute rounded-full border border-yellow-200/50"
              style={{
                width: isBig ? "16px" : "32px",
                height: isBig ? "16px" : "32px",
                background: "radial-gradient(circle at 30% 30%, #ffffff 0%, #fef3c7 40%, #eab308 100%)",
                boxShadow: "inset 1px 1px 2px rgba(255,255,255,0.9), 0 2px 4px rgba(0,0,0,0.3)"
              }}
            />
          </div>
        )}

        {/* 4. 3D Coquette Ribbon / Bow */}
        {showBow && (
          <div className={`absolute top-[22%] left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center filter drop-shadow-[0_4px_5px_rgba(0,0,0,0.25)] ${isBig ? "w-12 h-10" : "w-24 h-20 scale-[2.0]"}`}>
            {/* Left Loop */}
            <div 
              className="rounded-l-full rounded-r-sm border border-white/50"
              style={{
                width: isBig ? "20px" : "40px",
                height: isBig ? "24px" : "48px",
                background: "radial-gradient(circle at 70% 30%, #fffdfd 0%, #ffcbdc 50%, #ec4899 100%)",
                transform: "rotate(-15deg) translateX(-2px)",
                boxShadow: "inset -1px 1px 2px rgba(255,255,255,0.8)"
              }}
            />
            {/* Right Loop */}
            <div 
              className="rounded-r-full rounded-l-sm border border-white/50"
              style={{
                width: isBig ? "20px" : "40px",
                height: isBig ? "24px" : "48px",
                background: "radial-gradient(circle at 30% 30%, #fffdfd 0%, #ffcbdc 50%, #ec4899 100%)",
                transform: "rotate(15deg) translateX(2px)",
                boxShadow: "inset 1px 1px 2px rgba(255,255,255,0.8)"
              }}
            />
            {/* Left Tail */}
            <div 
              className="absolute rounded-sm origin-top"
              style={{
                width: isBig ? "8px" : "16px",
                height: isBig ? "20px" : "40px",
                background: "linear-gradient(to bottom, #fbcfe8, #ec4899)",
                transform: `rotate(35deg) translate(${isBig ? "-6px, 10px" : "-12px, 20px"})`,
                clipPath: "polygon(0 0, 100% 0, 100% 100%, 50% 80%, 0 100%)"
              }}
            />
            {/* Right Tail */}
            <div 
              className="absolute rounded-sm origin-top"
              style={{
                width: isBig ? "8px" : "16px",
                height: isBig ? "20px" : "40px",
                background: "linear-gradient(to bottom, #fbcfe8, #ec4899)",
                transform: `rotate(-35deg) translate(${isBig ? "6px, 10px" : "12px, 20px"})`,
                clipPath: "polygon(0 0, 100% 0, 100% 100%, 50% 80%, 0 100%)"
              }}
            />
            {/* Center knot */}
            <div 
              className="absolute rounded-full bg-white border border-pink-200"
              style={{
                width: isBig ? "14px" : "28px",
                height: isBig ? "14px" : "28px",
                background: "radial-gradient(circle at 30% 30%, #ffffff 0%, #fbcfe8 100%)",
                boxShadow: "inset 1px 1px 2px rgba(255,255,255,0.9)"
              }}
            />
          </div>
        )}

        {/* 5. 3D Pearls & Rhinestones Cluster */}
        {showPearl && (
          <div className={`absolute top-[68%] left-1/2 -translate-x-1/2 pointer-events-none relative select-none ${isBig ? "w-16 h-12" : "w-32 h-24 scale-[2.2]"}`}>
            {/* Large Pearl */}
            <div 
              className="absolute rounded-full border border-stone-100"
              style={{
                width: isBig ? "20px" : "40px",
                height: isBig ? "20px" : "40px",
                top: isBig ? "4px" : "8px",
                left: isBig ? "8px" : "16px",
                background: "radial-gradient(circle at 30% 30%, #ffffff 0%, #fae8ff 45%, #ec4899 100%)",
                boxShadow: "inset 1px 1px 2px rgba(255,255,255,0.85), 0 3px 5px rgba(0,0,0,0.25)"
              }}
            />
            {/* Medium Pearl */}
            <div 
              className="absolute rounded-full border border-stone-100"
              style={{
                width: isBig ? "14px" : "28px",
                height: isBig ? "14px" : "28px",
                top: isBig ? "20px" : "40px",
                left: isBig ? "32px" : "64px",
                background: "radial-gradient(circle at 30% 30%, #ffffff 0%, #fff 50%, #cbd5e1 100%)",
                boxShadow: "inset 1px 1px 1px rgba(255,255,255,0.9), 0 2px 4px rgba(0,0,0,0.2)"
              }}
            />
            {/* Small Pearl */}
            <div 
              className="absolute rounded-full bg-white shadow"
              style={{
                width: isBig ? "10px" : "20px",
                height: isBig ? "10px" : "20px",
                top: isBig ? "4px" : "8px",
                left: isBig ? "32px" : "64px",
                background: "radial-gradient(circle at 30% 30%, #fff, #cbd5e1)"
              }}
            />
            <div 
              className="absolute rounded-full bg-white shadow"
              style={{
                width: isBig ? "10px" : "20px",
                height: isBig ? "10px" : "20px",
                top: isBig ? "28px" : "56px",
                left: isBig ? "12px" : "24px",
                background: "radial-gradient(circle at 30% 30%, #fff, #fbcfe8)"
              }}
            />
          </div>
        )}

        {/* 6. 3D Crystals and Diamond Rhinestones */}
        {showGem && (
          <div className="absolute inset-0 pointer-events-none rounded-inherit">
            <div className={`absolute bg-white/95 border border-white/50 rotate-[15deg] shadow-lg ${isBig ? "top-[10%] left-[28%] w-3 h-4" : "top-[10%] left-[25%] w-6 h-8 scale-150"}`}
                 style={{
                   clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
                   background: "linear-gradient(135deg, #ffffff 0%, #f1f5f9 40%, #0ea5e9 100%)",
                   boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
                 }}
            />
            <div className={`absolute bg-white/95 border border-white/40 rotate-[35deg] shadow-lg ${isBig ? "top-[12%] right-[28%] w-3.5 h-3.5" : "top-[12%] right-[25%] w-7 h-7 scale-150"}`}
                 style={{
                   clipPath: "polygon(50% 0%, 100% 35%, 80% 100%, 20% 100%, 0% 35%)",
                   background: "linear-gradient(135deg, #ffffff 0%, #fbcfe8 50%, #a855f7 100%)",
                   boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
                 }}
            />
          </div>
        )}

        {/* 7. 3D Embossed Strawberry Charm */}
        {showStrawberry && (
          <div className={`absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center filter drop-shadow-[0_5px_8px_rgba(0,0,0,0.35)] select-none ${isBig ? "w-16 h-18" : "w-32 h-36 scale-[2.2]"}`}>
            {/* Strawberry Leaf Crown */}
            <div className="absolute -top-[12%] flex justify-center gap-[1px] z-10">
              {/* Center Leaf */}
              <div 
                className="rounded-t-full rounded-b-sm bg-gradient-to-b from-emerald-400 to-green-700 border border-white/20"
                style={{
                  width: isBig ? "8px" : "16px",
                  height: isBig ? "12px" : "24px",
                  boxShadow: "inset 1px 1px 1px rgba(255,255,255,0.4)",
                }}
              />
              {/* Left Leaf */}
              <div 
                className="rounded-t-full rounded-b-sm bg-gradient-to-b from-emerald-400 to-green-700 border border-white/20 -rotate-30 origin-bottom"
                style={{
                  width: isBig ? "7px" : "14px",
                  height: isBig ? "10px" : "20px",
                  boxShadow: "inset 1px 1px 1px rgba(255,255,255,0.4)",
                }}
              />
              {/* Right Leaf */}
              <div 
                className="rounded-t-full rounded-b-sm bg-gradient-to-b from-emerald-400 to-green-700 border border-white/20 rotate-30 origin-bottom"
                style={{
                  width: isBig ? "7px" : "14px",
                  height: isBig ? "10px" : "20px",
                  boxShadow: "inset 1px 1px 1px rgba(255,255,255,0.4)",
                }}
              />
            </div>

            {/* Strawberry Fruit Body */}
            <div 
              className="rounded-t-[45%] rounded-b-[75%] border border-white/40 relative overflow-hidden"
              style={{
                width: isBig ? "34px" : "68px",
                height: isBig ? "40px" : "80px",
                background: "radial-gradient(circle at 35% 25%, #ff8a9a 0%, #ef4444 45%, #991b1b 100%)",
                boxShadow: "inset 2px 3px 6px rgba(255,255,255,0.6), inset -2px -3px 6px rgba(0,0,0,0.4), 0 4px 6px rgba(0,0,0,0.2)"
              }}
            >
              {/* 3D Glossy Slit Highlight on Body */}
              <div 
                className="absolute top-[8%] left-[15%] w-[30%] h-[35%] bg-white/50 rounded-full filter blur-[0.5px]"
                style={{ transform: "rotate(-15deg)" }}
              />

              {/* Embossed Golden Strawberry Seeds */}
              <div className="absolute inset-0 grid grid-cols-4 gap-x-1 gap-y-2 p-3 justify-items-center opacity-90">
                {[...Array(12)].map((_, i) => (
                  <div 
                    key={i}
                    className="bg-gradient-to-b from-amber-200 to-yellow-500 rounded-full"
                    style={{
                      width: isBig ? "2px" : "4px",
                      height: isBig ? "3px" : "6px",
                      transform: `rotate(${15 * (i % 3 - 1)}deg) translateY(${i % 2 === 0 ? "2px" : "0px"})`,
                      boxShadow: "0 1px 1px rgba(0,0,0,0.3), inset 0.5px 0.5px 0.5px #fff",
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Helper to translate shape text into custom luxury press-on path shapes
  const getNailShapeStyle = (shapeName: string, isBig: boolean = false, isThumb: boolean = false): string => {
    const s = shapeName.toLowerCase();
    const hClass = isBig ? "h-[190px] w-[88px]" : (isThumb ? "h-[44px] w-[25px]" : "h-[46px] w-[19px]");
    
    if (s.includes("coffin")) {
      // Coffin: tapered sides with flat squared-off free edge
      return `rounded-t-[4px] rounded-b-[2px] ${hClass} clip-coffin`;
    } else if (s.includes("almond")) {
      // Almond: oval, tapered beautifully to a soft rounded point
      return `rounded-t-[48%] rounded-b-[6px] ${hClass}`;
    } else if (s.includes("square")) {
      // Square: completely straight parallel sides and sharp corners
      return `rounded-t-[2px] rounded-b-[1px] ${hClass}`;
    } else if (s.includes("stiletto")) {
      // Stiletto: ultra-tapered sides coming to an extremely sharp tip
      return `rounded-t-[90%] rounded-b-[3px] ${hClass} scale-y-110 origin-bottom`;
    }
    // Round default
    return `rounded-t-[42%] rounded-b-[8px] ${hClass}`;
  };

  // Generate 3D volumetric background style representing professional press-on materials
  const getNailBackground = (nail: NailDesign, lightMode: string): React.CSSProperties => {
    const { baseColor, secondaryColor, artStyle } = nail;
    const sec = secondaryColor || "#FFFFFF";

    const isTrans = baseColor === "transparent" || baseColor === "rgba(255, 255, 255, 0.15)";
    let backgroundStyle = isTrans ? "rgba(255, 255, 255, 0.18)" : baseColor;

    // Premium multi-stop linear shading for maximum physical realism
    if (!isTrans) {
      if (artStyle === "ombre") {
        backgroundStyle = `linear-gradient(to top, ${baseColor} 15%, ${sec} 85%)`;
      } else if (artStyle === "french") {
        backgroundStyle = baseColor;
      } else if (artStyle === "marble") {
        backgroundStyle = `repeating-linear-gradient(45deg, ${baseColor}, ${baseColor} 6px, ${sec} 11px, ${baseColor} 18px)`;
      } else if (artStyle === "pattern") {
        backgroundStyle = `radial-gradient(circle at 50% 50%, ${sec} 10%, ${baseColor} 60%)`;
      }
    }

    // Studio Lighting overlay configuration
    let lightOverlays = "";
    if (lightMode === "candlelight") {
      lightOverlays = "linear-gradient(to right, rgba(251, 191, 36, 0.15), transparent 60%)";
    } else if (lightMode === "studio") {
      lightOverlays = "linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 50%, rgba(0,0,0,0.15) 100%)";
    } else if (lightMode === "sunlight") {
      lightOverlays = "linear-gradient(to bottom, rgba(253, 224, 71, 0.2), rgba(0,0,0,0.05))";
    } else {
      // High-Glossy Studio (Default)
      lightOverlays = "linear-gradient(105deg, rgba(255,255,255,0.3) 0%, transparent 60%)";
    }

    const isGradient = backgroundStyle.startsWith("linear") || backgroundStyle.startsWith("radial") || backgroundStyle.startsWith("repeating");
    const finalBg = isGradient
      ? `${lightOverlays}, ${backgroundStyle}`
      : `${lightOverlays}, linear-gradient(to right, rgba(0,0,0,0.08) 0%, transparent 15%, transparent 85%, rgba(0,0,0,0.12) 100%), ${backgroundStyle}`;

    const style: React.CSSProperties = {
      background: finalBg,
      position: "relative",
      overflow: "hidden",
      border: "1px solid rgba(255, 255, 255, 0.45)",
      backdropFilter: isTrans ? "blur(4px)" : "none",
      boxShadow: `
        inset 1px 2px 3px rgba(255,255,255,0.7), 
        inset -1px -2px 3px rgba(0,0,0,0.2),
        0 4px 6px -1px rgba(0,0,0,0.15), 
        0 2px 4px -1px rgba(0,0,0,0.1)
      `,
    };

    return style;
  };

  const renderNailTip = (nail: NailDesign | undefined, isSelected: boolean, isThumb: boolean = false) => {
    if (!nail) return null;

    const baseStyle = getNailShapeStyle(shape, false, isThumb);
    const bgStyle = getNailBackground(nail, studioLight);
    const widthClass = isThumb ? "w-[25px] h-[44px]" : "w-[19px] h-[46px]";

    return (
      <div
        className={`relative cursor-pointer transition-all duration-300 hover:scale-115 flex justify-center items-end group ${widthClass} rounded-t-lg ${
          isSelected ? "ring-2 ring-pink-500 ring-offset-2 scale-105 z-20" : ""
        }`}
        onClick={(e) => {
          e.stopPropagation();
          if (onSelectFinger) onSelectFinger(nail.finger);
        }}
        title={`${nail.finger}: ${nail.title}`}
      >
        {/* 3D Acrylic Press-On Volume Structure */}
        <div className="absolute inset-0 pointer-events-none filter drop-shadow-[0_4px_5px_rgba(0,0,0,0.22)]">
          <div
            className={`${baseStyle} transition-all duration-300 relative`}
            style={bgStyle}
          >
            {/* Custom Cropped Image Overlay */}
            {nail.croppedImage && (
              <img
                src={nail.croppedImage}
                alt="patched art"
                className="absolute inset-0 w-full h-full object-contain rounded-inherit pointer-events-none drop-shadow-sm"
                referrerPolicy="no-referrer"
              />
            )}

            {/* Premium Overlay Elements (crystals, flowers) */}
            {nail.overlayImage && (
              <img
                src={nail.overlayImage}
                alt="overlay design"
                className="absolute inset-0 w-full h-full object-cover rounded-inherit pointer-events-none"
                style={{ filter: "drop-shadow(0px 2px 3px rgba(0,0,0,0.35))" }}
                referrerPolicy="no-referrer"
              />
            )}

            {/* French Tip Overlay Layer */}
            {!nail.croppedImage && nail.artStyle === "french" && (
              <div
                className="absolute top-0 left-0 w-full h-[32%] rounded-t-inherit pointer-events-none shadow-sm"
                style={{ 
                  backgroundColor: nail.secondaryColor || "#FFFFFF",
                  borderBottom: "1px solid rgba(255,255,255,0.25)"
                }}
              />
            )}

            {/* Real Holographic, Glitter and Pearl microtextures */}
            {!nail.croppedImage && nail.finish === "glitter" && (
              <div
                className="absolute inset-0 opacity-45 pointer-events-none mix-blend-screen"
                style={{
                  backgroundImage: `radial-gradient(circle, #fff 12%, transparent 13%), radial-gradient(circle, #ffe3e3 8%, transparent 10%)`,
                  backgroundSize: "4px 4px",
                  backgroundPosition: "0 0, 2px 2px",
                }}
              />
            )}

            {!nail.croppedImage && nail.finish === "chrome" && (
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent pointer-events-none mix-blend-overlay" />
            )}

            {!nail.croppedImage && nail.finish === "holographic" && (
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500/15 via-purple-500/10 to-cyan-500/15 pointer-events-none animate-pulse mix-blend-color" />
            )}

            {!nail.croppedImage && nail.finish === "matte" && (
              <div className="absolute inset-0 bg-black/15 mix-blend-multiply pointer-events-none" />
            )}

            {/* Super Glassy Jelly Depth Layer */}
            {isJellyStyle(nail) && (
              <div 
                className="absolute inset-0 pointer-events-none rounded-inherit"
                style={{
                  background: "radial-gradient(circle at 50% 15%, rgba(255, 255, 255, 0.45) 0%, rgba(255, 255, 255, 0.05) 50%, rgba(244, 63, 94, 0.1) 100%)",
                  boxShadow: "inset 0 4px 12px rgba(255,255,255,0.6), inset 0 -4px 12px rgba(0,0,0,0.1)"
                }}
              />
            )}

            {/* Sparkle micro emblem */}
            {nail.decorations !== "None" && nail.decorations !== "" && (
              <div className="absolute bottom-1 right-1 pointer-events-none text-white drop-shadow-md">
                <Sparkles className="w-2.5 h-2.5 text-yellow-100 animate-bounce" />
              </div>
            )}

            {/* ULTRA-REALISTIC PRESS-ON SHEEN (Specular glaze glare) */}
            <div className="absolute inset-x-0 top-0 h-full bg-gradient-to-b from-white/30 via-transparent to-black/10 pointer-events-none" />
            <div className="absolute top-[3%] left-[12%] w-[18%] h-[92%] bg-white/45 rounded-full pointer-events-none filter blur-[0.2px]" />
            <div className="absolute top-[8%] left-[22%] w-[1.5px] h-[75%] bg-white/60 rounded-full pointer-events-none filter blur-[0.1px]" />
            
            {/* Cuticle base microshadowing */}
            <div className="absolute bottom-0 inset-x-0 h-[6px] bg-gradient-to-t from-black/20 to-transparent pointer-events-none rounded-b-inherit" />

            {/* Mini 3D Ornaments */}
            {renderNail3DDecorations(nail, false)}
          </div>
        </div>

        {/* Selected Pulse Indicator */}
        {isSelected && (
          <span className="absolute -bottom-5 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-600"></span>
          </span>
        )}
      </div>
    );
  };

  const getFingerForName = (name: string): NailDesign | undefined => {
    return collection.nails.find((n) => n.finger === name);
  };

  return (
    <div className="bg-gradient-to-b from-stone-50/80 to-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-md border border-pink-100/40">
      
      {/* Upper header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-stone-100 pb-5 mb-6">
        <div>
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-pink-100 text-pink-700 tracking-wider uppercase">
            🌟 Real-Detail Fingertip View
          </span>
          <h3 className="font-display text-xl font-bold text-gray-800 mt-2">
            Professional Press-On Swatch Display
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Tap any individual nail to zoom into the glamorous 3D Studio Close-Up!
          </p>
        </div>

        {/* Skin Tone & Lighting Swapper */}
        <div className="flex flex-col gap-2 shrink-0 w-full md:w-auto">
          {/* Tone Selector */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider shrink-0">
              Skin:
            </span>
            <div className="flex gap-1 bg-stone-100 p-1 rounded-lg border border-stone-200 w-full justify-between md:justify-start">
              {SKIN_TONES.map((tone) => (
                <button
                  key={tone.id}
                  onClick={() => setSkinTone(tone)}
                  className={`p-1 px-2 rounded-md text-[10px] font-bold transition flex items-center gap-1 shrink-0 ${
                    skinTone.id === tone.id
                      ? "bg-white text-pink-700 shadow-sm"
                      : "text-stone-500 hover:text-stone-700"
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full border border-black/10 shrink-0" style={{ backgroundColor: tone.baseColor }} />
                  {tone.name.split(" ")[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Light Studio Toggle */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider shrink-0">
              Lighting:
            </span>
            <div className="flex gap-1 bg-stone-100 p-1 rounded-lg border border-stone-200">
              {[
                { id: "glossy", label: "Studio Flash" },
                { id: "candlelight", label: "Golden Hour" },
                { id: "sunlight", label: "Sun Glare" }
              ].map((light) => (
                <button
                  key={light.id}
                  onClick={() => setStudioLight(light.id as any)}
                  className={`px-2 py-0.5 rounded text-[9px] font-bold transition shrink-0 ${
                    studioLight === light.id
                      ? "bg-stone-800 text-amber-300"
                      : "text-stone-500 hover:text-stone-700"
                  }`}
                >
                  {light.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid Area containing the 10 fingers & the detailed close-up display */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left column: 10 vertical fingers side by side */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-4 bg-stone-50/50 rounded-xl border border-stone-100">
            <div className="flex justify-between items-center mb-3 text-xs font-bold text-stone-500">
              <span className="flex items-center gap-1.5"><Layers className="w-3.5 h-3.5 text-pink-500" /> LEFT HAND FINGERS</span>
              <span className="text-[10px] bg-stone-200/50 px-1.5 py-0.5 rounded">Tapered Almond</span>
            </div>

            {/* Left Fingers Grid */}
            <div className="flex justify-between items-end bg-gradient-to-t from-stone-100/50 to-white p-5 pt-12 pb-4 rounded-xl border border-stone-200/40 h-44 relative overflow-visible">
              {[
                { name: "Left Thumb", label: "Thumb", h: "h-15", w: "w-[34px]", rounded: "rounded-t-[15px] rounded-b-[6px]", isThumb: true },
                { name: "Left Index", label: "Index", h: "h-20", w: "w-[24px]", rounded: "rounded-t-[11px] rounded-b-[4px]", isThumb: false },
                { name: "Left Middle", label: "Middle", h: "h-23", w: "w-[25px]", rounded: "rounded-t-[12px] rounded-b-[4px]", isThumb: false },
                { name: "Left Ring", label: "Ring", h: "h-20", w: "w-[24px]", rounded: "rounded-t-[11px] rounded-b-[4px]", isThumb: false },
                { name: "Left Pinky", label: "Pinky", h: "h-14", w: "w-[19px]", rounded: "rounded-t-[9px] rounded-b-[3px]", isThumb: false },
              ].map((f) => {
                const nail = getFingerForName(f.name);
                const isSelected = selectedFinger === f.name;
                return (
                  <div key={f.name} className="flex flex-col items-center flex-1 relative group">
                    {/* Visual Finger stem */}
                    <div 
                      className={`${f.w} ${f.h} ${f.rounded} transition-all duration-300 relative flex flex-col justify-between items-center pb-1 cursor-pointer hover:brightness-105`}
                      style={{ 
                        background: `linear-gradient(to right, ${skinTone.highlightColor} 0%, ${skinTone.baseColor} 45%, ${skinTone.shadowColor} 100%)`,
                        boxShadow: "0 3px 6px rgba(0,0,0,0.08), inset 0 1px 1.5px rgba(255,255,255,0.4)"
                      }}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        const nailId = e.dataTransfer.getData("text/plain");
                        if (onDropNail) onDropNail(f.name, nailId);
                      }}
                    >
                      {/* Crease lines */}
                      <div className="absolute bottom-[20%] w-3/4 flex flex-col gap-0.5 opacity-40">
                        <div className="h-[1px] bg-black/10" />
                        <div className="h-[1px] bg-black/10" />
                      </div>

                      {/* Placed Nail at tip */}
                      <div className="absolute -top-[23px] left-1/2 transform -translate-x-1/2 flex justify-center z-10">
                        {renderNailTip(nail, isSelected, f.isThumb)}
                      </div>
                    </div>
                    <span className="text-[10px] text-stone-400 font-bold mt-2 font-mono">{f.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-4 bg-stone-50/50 rounded-xl border border-stone-100">
            <div className="flex justify-between items-center mb-3 text-xs font-bold text-stone-500">
              <span className="flex items-center gap-1.5"><Layers className="w-3.5 h-3.5 text-pink-500" /> RIGHT HAND FINGERS</span>
              <span className="text-[10px] bg-stone-200/50 px-1.5 py-0.5 rounded font-mono">Precision Symmetrical</span>
            </div>

            {/* Right Fingers Grid */}
            <div className="flex justify-between items-end bg-gradient-to-t from-stone-100/50 to-white p-5 pt-12 pb-4 rounded-xl border border-stone-200/40 h-44 relative overflow-visible">
              {[
                { name: "Right Pinky", label: "Pinky", h: "h-14", w: "w-[19px]", rounded: "rounded-t-[9px] rounded-b-[3px]", isThumb: false },
                { name: "Right Ring", label: "Ring", h: "h-20", w: "w-[24px]", rounded: "rounded-t-[11px] rounded-b-[4px]", isThumb: false },
                { name: "Right Middle", label: "Middle", h: "h-23", w: "w-[25px]", rounded: "rounded-t-[12px] rounded-b-[4px]", isThumb: false },
                { name: "Right Index", label: "Index", h: "h-20", w: "w-[24px]", rounded: "rounded-t-[11px] rounded-b-[4px]", isThumb: false },
                { name: "Right Thumb", label: "Thumb", h: "h-15", w: "w-[34px]", rounded: "rounded-t-[15px] rounded-b-[6px]", isThumb: true },
              ].map((f) => {
                const nail = getFingerForName(f.name);
                const isSelected = selectedFinger === f.name;
                return (
                  <div key={f.name} className="flex flex-col items-center flex-1 relative group">
                    {/* Visual Finger stem */}
                    <div 
                      className={`${f.w} ${f.h} ${f.rounded} transition-all duration-300 relative flex flex-col justify-between items-center pb-1 cursor-pointer hover:brightness-105`}
                      style={{ 
                        background: `linear-gradient(to right, ${skinTone.highlightColor} 0%, ${skinTone.baseColor} 45%, ${skinTone.shadowColor} 100%)`,
                        boxShadow: "0 3px 6px rgba(0,0,0,0.08), inset 0 1px 1.5px rgba(255,255,255,0.4)"
                      }}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        const nailId = e.dataTransfer.getData("text/plain");
                        if (onDropNail) onDropNail(f.name, nailId);
                      }}
                    >
                      {/* Crease lines */}
                      <div className="absolute bottom-[20%] w-3/4 flex flex-col gap-0.5 opacity-40">
                        <div className="h-[1px] bg-black/10" />
                        <div className="h-[1px] bg-black/10" />
                      </div>

                      {/* Placed Nail at tip */}
                      <div className="absolute -top-[23px] left-1/2 transform -translate-x-1/2 flex justify-center z-10">
                        {renderNailTip(nail, isSelected, f.isThumb)}
                      </div>
                    </div>
                    <span className="text-[10px] text-stone-400 font-bold mt-2 font-mono">{f.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right column: The gorgeous 3D Zoom & Close-Up Studio */}
        <div className="lg:col-span-5 bg-gradient-to-br from-stone-900 via-stone-850 to-stone-950 text-white rounded-2xl p-5 shadow-xl relative border border-stone-800/80 overflow-hidden">
          
          {/* Background Ambient glow */}
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Studio Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-stone-800 pb-3 mb-4 gap-3">
            <div className="flex items-center gap-1.5">
              <ZoomIn className="w-4 h-4 text-pink-400 animate-pulse" />
              <span className="text-[10px] font-bold text-pink-300 uppercase tracking-widest">
                Press-On Luxury Close-up Studio
              </span>
            </div>
            
            {/* 2D/3D Mode Selector Toggle */}
            <div className="flex gap-1 bg-stone-800 p-1 rounded-lg border border-stone-700/60 self-stretch sm:self-auto justify-between sm:justify-start">
              <button
                onClick={() => setIs3DMode(false)}
                className={`px-2 py-1 rounded text-[9px] font-extrabold uppercase tracking-wide transition ${
                  !is3DMode
                    ? "bg-stone-700 text-white shadow-sm"
                    : "text-stone-400 hover:text-stone-200"
                }`}
              >
                📺 2D Flat
              </button>
              <button
                onClick={() => setIs3DMode(true)}
                className={`px-2 py-1 rounded text-[9px] font-extrabold uppercase tracking-wide transition flex items-center gap-1 ${
                  is3DMode
                    ? "bg-pink-600 text-white shadow-sm"
                    : "text-stone-400 hover:text-pink-400"
                }`}
              >
                <span>🔮 3D Orbit</span>
              </button>
            </div>
          </div>

          {/* The Zoom Display Area */}
          {selectedNail ? (
            <div className="flex flex-col items-center">
              
              {/* Massive Realistic Nail Model Stand */}
              <div 
                className={`w-full flex flex-col items-center justify-center py-8 bg-stone-950/80 rounded-xl border border-stone-800/80 relative overflow-hidden select-none ${
                  is3DMode ? (isDragging ? "cursor-grabbing" : "cursor-grab") : ""
                }`}
                style={{ perspective: "1000px" }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUpOrLeave}
                onMouseLeave={handleMouseUpOrLeave}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleMouseUpOrLeave}
              >
                {/* Visual measurement grid pattern on background */}
                <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />

                {/* 3D Orbit Helper Tag */}
                {is3DMode && (
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-stone-900/90 backdrop-blur border border-stone-800 rounded-full px-3 py-1 text-[9px] font-mono text-pink-400 flex items-center gap-1.5 shadow pointer-events-none animate-pulse z-20">
                    <span className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-ping" />
                    <span>Drag/Swipe to rotate in 3D space</span>
                  </div>
                )}
                
                {/* The 3D physical stand */}
                <div 
                  className="relative flex justify-center items-end"
                  style={{ 
                    transform: is3DMode 
                      ? `rotateX(${rotationX}deg) rotateY(${rotationY}deg) rotateZ(${rotationAngle}deg) scale(1.15)`
                      : `rotate(${rotationAngle}deg) scale(1.05)`,
                    transformStyle: "preserve-3d",
                    transition: isDragging ? "none" : "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)"
                  }}
                >
                  {/* Gigantic high-definition nail */}
                  <div className="filter drop-shadow-[0_20px_30px_rgba(0,0,0,0.85)]">
                    <div
                      className={`${getNailShapeStyle(shape, true)} transition-all duration-300 relative`}
                      style={getNailBackground(selectedNail, studioLight)}
                    >
                      {/* Rendered image patch */}
                      {selectedNail.croppedImage && (
                        <img
                          src={selectedNail.croppedImage}
                          alt="Magnified Patched Art"
                          className="absolute inset-0 w-full h-full object-cover rounded-inherit pointer-events-none"
                          referrerPolicy="no-referrer"
                        />
                      )}

                      {/* Rendered Overlay Deco */}
                      {selectedNail.overlayImage && (
                        <img
                          src={selectedNail.overlayImage}
                          alt="Magnified Overlay Art"
                          className="absolute inset-0 w-full h-full object-cover rounded-inherit pointer-events-none"
                          style={{ filter: "drop-shadow(0px 3px 6px rgba(0,0,0,0.45))" }}
                          referrerPolicy="no-referrer"
                        />
                      )}

                      {/* Magnified French Tip Layer */}
                      {!selectedNail.croppedImage && selectedNail.artStyle === "french" && (
                        <div
                          className="absolute top-0 left-0 w-full h-[32%] rounded-t-inherit pointer-events-none shadow-md"
                          style={{ 
                            backgroundColor: selectedNail.secondaryColor || "#FFFFFF",
                            borderBottom: "1.5px solid rgba(255,255,255,0.3)"
                          }}
                        />
                      )}

                      {/* Magnified finishes */}
                      {!selectedNail.croppedImage && selectedNail.finish === "glitter" && (
                        <div
                          className="absolute inset-0 opacity-55 pointer-events-none mix-blend-screen"
                          style={{
                            backgroundImage: `radial-gradient(circle, #fff 14%, transparent 15%), radial-gradient(circle, #ffd4d4 10%, transparent 12%)`,
                            backgroundSize: "8px 8px",
                            backgroundPosition: "0 0, 4px 4px",
                          }}
                        />
                      )}

                      {!selectedNail.croppedImage && selectedNail.finish === "chrome" && (
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/50 to-transparent pointer-events-none mix-blend-overlay" />
                      )}

                      {!selectedNail.croppedImage && selectedNail.finish === "holographic" && (
                        <div className="absolute inset-0 bg-gradient-to-r from-pink-500/25 via-purple-500/20 to-cyan-500/25 pointer-events-none mix-blend-color animate-pulse" />
                      )}

                      {!selectedNail.croppedImage && selectedNail.finish === "matte" && (
                        <div className="absolute inset-0 bg-black/25 mix-blend-multiply pointer-events-none" />
                      )}

                      {/* Super Glassy Jelly Translucent Depth Layer */}
                      {isJellyStyle(selectedNail) && (
                        <div 
                          className="absolute inset-0 pointer-events-none rounded-inherit"
                          style={{
                            background: "radial-gradient(circle at 50% 15%, rgba(255, 255, 255, 0.45) 0%, rgba(255, 255, 255, 0.05) 50%, rgba(244, 63, 94, 0.15) 100%)",
                            boxShadow: "inset 0 8px 24px rgba(255,255,255,0.65), inset 0 -8px 24px rgba(0,0,0,0.15)"
                          }}
                        />
                      )}

                      {/* Realistic specular light glare overlays for high-end polish look */}
                      <div className="absolute inset-x-0 top-0 h-full bg-gradient-to-b from-white/35 via-transparent to-black/15 pointer-events-none" />
                      <div className="absolute top-[3%] left-[12%] w-[18%] h-[94%] bg-white/45 rounded-full pointer-events-none filter blur-[0.4px]" />
                      <div className="absolute top-[8%] left-[22%] w-[2.5px] h-[75%] bg-white/60 rounded-full pointer-events-none filter blur-[0.2px]" />
                      
                      {/* Cuticle shade bevel */}
                      <div className="absolute bottom-0 inset-x-0 h-[10px] bg-gradient-to-t from-black/35 to-transparent pointer-events-none rounded-b-inherit" />

                      {/* High-definition 3D Jelly Ornaments overlaid */}
                      {renderNail3DDecorations(selectedNail, true)}
                    </div>
                  </div>
                </div>
              </div>

              {/* 3D Gel Ornaments Layering Desk */}
              <div className="w-full mt-4 p-4 bg-stone-900/60 rounded-xl border border-stone-800/80 text-left">
                <span className="text-[10px] uppercase font-extrabold text-pink-400 tracking-wider flex items-center gap-1.5">
                  💅 3D Gel Ornaments Layering Desk
                </span>
                <p className="text-[11px] text-stone-300 mt-1">
                  Combine multi-dimensional Japanese gel syrup ridges, pearls, and coquette ribbons to design an authentic textured look!
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-3">
                  {[
                    { id: "syrup", label: "🔮 Syrup Gel Ridges", desc: "Japanese wavy gel syrup" },
                    { id: "flower", label: "🌸 Camellia Petals", desc: "Iridescent 3D flower" },
                    { id: "bow", label: "🎀 Coquette Ribbon", desc: "Fluid 3D resin bow" },
                    { id: "chain", label: "🔗 Hanging Chain", desc: "Draping silver beads" },
                    { id: "pearl", label: "🔮 Pearl Clusters", desc: "Glossy pinkish pearls" },
                    { id: "gem", label: "💎 Diamond Crystals", desc: "Shimmering facets" },
                    { id: "strawberry", label: "🍓 Strawberry Charm", desc: "Glossy 3D strawberry" },
                  ].map((item) => {
                    const isActive = active3DDecorations[item.id as keyof typeof active3DDecorations];
                    
                    // Inferred check
                    const decStr = (selectedNail.decorations || "").toLowerCase();
                    const detStr = (selectedNail.details || "").toLowerCase();
                    const titleStr = (selectedNail.title || "").toLowerCase();
                    const hasInferred = 
                      item.id === "flower" ? /flower|camellia|floral|rose/i.test(decStr) || /flower|camellia|floral|rose/i.test(detStr) :
                      item.id === "bow" ? /bow|ribbon|coquette/i.test(decStr) || /bow|ribbon|coquette/i.test(detStr) :
                      item.id === "chain" ? /chain|draping|swag|silver line/i.test(decStr) || /chain|draping|swag|silver line/i.test(detStr) :
                      item.id === "pearl" ? /pearl|bead/i.test(decStr) || /pearl|bead/i.test(detStr) :
                      item.id === "gem" ? /gem|rhinestone|crystal|diamond|stone/i.test(decStr) || /gem|rhinestone|crystal|diamond|stone/i.test(detStr) :
                      item.id === "strawberry" ? /strawberry|berry|fruit/i.test(decStr) || /strawberry|berry|fruit/i.test(detStr) || titleStr.includes("strawberry") || titleStr.includes("berry") :
                      item.id === "syrup" ? /syrup|jelly|ridge|wave|contour/i.test(decStr) || /syrup|jelly|ridge|wave|contour/i.test(detStr) || titleStr.includes("jelly") || titleStr.includes("syrup") : false;

                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActive3DDecorations(prev => ({
                            ...prev,
                            [item.id]: !prev[item.id as keyof typeof active3DDecorations]
                          }));
                        }}
                        className={`p-2 rounded-lg text-left border transition text-xs flex flex-col justify-between ${
                          isActive || hasInferred
                            ? "bg-pink-950/40 border-pink-500/50 text-pink-200"
                            : "bg-stone-900/50 border-stone-850 text-stone-400 hover:border-stone-700 hover:text-stone-300"
                        }`}
                      >
                        <div className="font-bold flex items-center gap-1 justify-between w-full">
                          <span>{item.label}</span>
                          {(isActive || hasInferred) && <CheckCircle className="w-3.5 h-3.5 text-pink-500 shrink-0" />}
                        </div>
                        <span className="text-[9px] opacity-70 mt-0.5">{item.desc}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Specification Specs breakdown */}
              <div className="w-full mt-4 space-y-3.5 text-left text-xs">
                <div>
                  <div className="text-[10px] uppercase font-bold text-stone-500 tracking-wider">Active Close-Up Selection</div>
                  <h4 className="text-sm font-bold text-pink-300 mt-1 flex items-center gap-1.5">
                    {selectedNail.finger} &mdash; {selectedNail.title}
                  </h4>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 bg-stone-900 rounded-lg border border-stone-800">
                    <span className="text-[9px] text-stone-400 uppercase font-bold">Artistic Finish</span>
                    <p className="font-semibold text-white capitalize mt-0.5">{selectedNail.finish}</p>
                  </div>
                  <div className="p-2 bg-stone-900 rounded-lg border border-stone-800">
                    <span className="text-[9px] text-stone-400 uppercase font-bold">Style/Pattern</span>
                    <p className="font-semibold text-white capitalize mt-0.5">{selectedNail.artStyle}</p>
                  </div>
                </div>

                {/* Base color indicator swatch */}
                <div className="flex items-center gap-3 p-2 bg-stone-900 rounded-lg border border-stone-800">
                  <div 
                    className="w-5 h-5 rounded border border-white/20 shrink-0" 
                    style={{ backgroundColor: selectedNail.baseColor }} 
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-[8px] text-stone-400 uppercase font-bold">Main Base Coat Gel</div>
                    <div className="text-xs font-mono text-stone-200 truncate">{selectedNail.baseColor}</div>
                  </div>
                  {selectedNail.secondaryColor && (
                    <>
                      <div 
                        className="w-5 h-5 rounded border border-white/20 shrink-0" 
                        style={{ backgroundColor: selectedNail.secondaryColor }} 
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-[8px] text-stone-400 uppercase font-bold">Secondary Color</div>
                        <div className="text-xs font-mono text-stone-200 truncate">{selectedNail.secondaryColor}</div>
                      </div>
                    </>
                  )}
                </div>

                {/* Decorations */}
                <div className="p-2.5 bg-stone-900 rounded-lg border border-stone-800 space-y-1">
                  <span className="text-[9px] text-stone-400 uppercase font-bold flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-amber-400" /> Embedded Jewels &amp; Decals
                  </span>
                  <p className="text-stone-200 leading-relaxed text-xs">
                    {selectedNail.decorations || "No embedded rhinestones or 3D gems detected."}
                  </p>
                </div>

                {/* Technician Replica steps */}
                <div className="p-2.5 bg-pink-950/20 rounded-lg border border-pink-900/30 space-y-1">
                  <span className="text-[9px] text-pink-400 uppercase font-bold flex items-center gap-1">
                    <Lightbulb className="w-3.5 h-3.5 text-pink-400" /> Nail Tech Formula Steps
                  </span>
                  <p className="text-stone-300 leading-relaxed text-xs italic">
                    "{selectedNail.details}"
                  </p>
                </div>
              </div>

            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-stone-500">
              <Eye className="w-8 h-8 opacity-40 mb-2" />
              <p className="text-xs">Select a swatch nail on the left to display its physical press-on close-up.</p>
            </div>
          )}

        </div>

      </div>

      {/* CSS custom clip paths for Coffin nails inside file tree */}
      <style>{`
        .clip-coffin {
          clip-path: polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%);
        }
      `}</style>

    </div>
  );
};
