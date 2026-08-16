import React, { useRef, useState, useEffect, ChangeEvent } from "react";
import {
  Upload,
  Sparkles,
  Scissors,
  Check,
  Plus,
  Trash2,
  ArrowRight,
  CheckCircle2,
  Crosshair,
  Undo2,
  Flame,
  Paintbrush,
  Move,
  X,
  Palette,
  RotateCw,
  Sliders,
  Layers,
  Heart
} from "lucide-react";
import {
  loadImage,
  extractContourStraightenedNail,
  segmentNailFromPoint,
  extractFromBrushBounds,
  TappedPoint,
  NailShapeType,
  CHARM_PRESETS,
  CharmPreset,
  AppliedCharm
} from "../utils/nailDetector";
import { RectificationQuality, Point2D } from "../utils/tpsWarp";

export interface SeparatedNailCard {
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
  isMapped?: boolean;
  mappedFinger?: string;
  tappedPoint?: TappedPoint;
}

interface DiyAtelierProps {
  collection: any;
  setCollection: React.Dispatch<React.SetStateAction<any>>;
  selectedFinger: string | null;
  onSelectFinger: (finger: string | null) => void;
  shape: string;
  onDropNail: (fingerName: string, nailId: string) => void;
  diyReferenceImage: string | null;
  onUploadImage: (e: ChangeEvent<HTMLInputElement>) => void;
  onRemovePhoto: () => void;
  separatedNailCards: SeparatedNailCard[];
  setSeparatedNailCards: React.Dispatch<React.SetStateAction<SeparatedNailCard[]>>;
  selectedSeparatedNailId: string | null;
  onSelectCard: (id: string | null) => void;
  onResetToTransparent: () => void;
  triggerToast: (msg: string) => void;
  onDragStartNailCard: (e: React.DragEvent, id: string) => void;
}

const FINGER_ORDER = [
  { index: 1, label: "Left Thumb", symbol: "①", side: "Left" },
  { index: 2, label: "Left Index", symbol: "②", side: "Left" },
  { index: 3, label: "Left Middle", symbol: "③", side: "Left" },
  { index: 4, label: "Left Ring", symbol: "④", side: "Left" },
  { index: 5, label: "Left Pinky", symbol: "⑤", side: "Left" },
  { index: 6, label: "Right Thumb", symbol: "⑥", side: "Right" },
  { index: 7, label: "Right Index", symbol: "⑦", side: "Right" },
  { index: 8, label: "Right Middle", symbol: "⑧", side: "Right" },
  { index: 9, label: "Right Ring", symbol: "⑨", side: "Right" },
  { index: 10, label: "Right Pinky", symbol: "⑩", side: "Right" }
];

export function DiyAtelier({
  collection,
  setCollection,
  selectedFinger,
  onSelectFinger,
  shape,
  onDropNail,
  diyReferenceImage,
  onUploadImage,
  onRemovePhoto,
  separatedNailCards,
  setSeparatedNailCards,
  selectedSeparatedNailId,
  onSelectCard,
  onResetToTransparent,
  triggerToast,
  onDragStartNailCard
}: DiyAtelierProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const imgElementRef = useRef<HTMLImageElement>(null);
  const brushCanvasRef = useRef<HTMLCanvasElement>(null);

  // Selection Mode: "brush" (drag to highlight) or "tap" (1-click center)
  const [selectionTool, setSelectionTool] = useState<"brush" | "tap">("brush");
  const [selectedShapeType, setSelectedShapeType] = useState<NailShapeType>("almond");
  const [isBaked, setIsBaked] = useState<boolean>(true);
  const [isBakingAnimation, setIsBakingAnimation] = useState<boolean>(false);

  // Brush drawing state
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushStrokePoints, setBrushStrokePoints] = useState<Array<{ x: number; y: number }>>([]);
  const [selectedCharmCategory, setSelectedCharmCategory] = useState<string>("all");

  // Manual Click/Brush Pins
  const [tappedPoints, setTappedPoints] = useState<TappedPoint[]>([]);

  // Automatically select the first nail for the close-up studio if none selected
  useEffect(() => {
    if (separatedNailCards.length > 0 && !selectedSeparatedNailId) {
      onSelectCard(separatedNailCards[0].id);
    }
  }, [separatedNailCards, selectedSeparatedNailId]);

  const activeCard = separatedNailCards.find((c) => c.id === selectedSeparatedNailId) || separatedNailCards[0];

  // --- BRUSH & TAP SELECTION HANDLERS ---
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!diyReferenceImage) return;
    if (tappedPoints.length >= 10) {
      triggerToast("⚠️ Maximum 10 nail pieces reached. Clear or reset to start over.");
      return;
    }

    const imgEl = imgElementRef.current;
    if (!imgEl) return;

    const rect = imgEl.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    if (clickX < 0 || clickX > rect.width || clickY < 0 || clickY > rect.height) return;

    if (selectionTool === "tap") {
      processSingleTap(clickX, clickY, rect.width, rect.height);
    } else {
      setIsDrawing(true);
      setBrushStrokePoints([{ x: clickX, y: clickY }]);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDrawing || selectionTool !== "brush" || !imgElementRef.current) return;
    const rect = imgElementRef.current.getBoundingClientRect();
    const curX = e.clientX - rect.left;
    const curY = e.clientY - rect.top;

    if (curX >= 0 && curX <= rect.width && curY >= 0 && curY <= rect.height) {
      setBrushStrokePoints((prev) => [...prev, { x: curX, y: curY }]);
      drawLiveBrushOverlay([...brushStrokePoints, { x: curX, y: curY }]);
    }
  };

  const handleMouseUp = () => {
    if (!isDrawing || selectionTool !== "brush" || brushStrokePoints.length === 0 || !imgElementRef.current) {
      setIsDrawing(false);
      return;
    }

    setIsDrawing(false);
    const rect = imgElementRef.current.getBoundingClientRect();
    processBrushStroke(brushStrokePoints, rect.width, rect.height);
    clearBrushOverlay();
  };

  const drawLiveBrushOverlay = (points: Array<{ x: number; y: number }>) => {
    const canvas = brushCanvasRef.current;
    if (!canvas || points.length < 2) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "rgba(244, 114, 182, 0.65)";
    ctx.fillStyle = "rgba(251, 207, 232, 0.4)";
    ctx.lineWidth = 28;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.stroke();
  };

  const clearBrushOverlay = () => {
    const canvas = brushCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx?.clearRect(0, 0, canvas.width, canvas.height);
    setBrushStrokePoints([]);
  };

  // Process a 1-click tap
  const processSingleTap = async (clickX: number, clickY: number, renderW: number, renderH: number) => {
    if (!diyReferenceImage || !imgElementRef.current) return;

    const normX = Math.round((clickX / renderW) * 1000);
    const normY = Math.round((clickY / renderH) * 1000);

    const tapIndex = tappedPoints.length;
    const fingerInfo = FINGER_ORDER[tapIndex % FINGER_ORDER.length];

    const newPoint: TappedPoint = {
      id: `point_${tapIndex + 1}_${Date.now()}`,
      normX,
      normY,
      pixelX: Math.round((clickX / renderW) * (imgElementRef.current.naturalWidth || renderW)),
      pixelY: Math.round((clickY / renderH) * (imgElementRef.current.naturalHeight || renderH)),
      label: `${fingerInfo.symbol} ${fingerInfo.label}`
    };

    setTappedPoints((prev) => [...prev, newPoint]);

    try {
      const img = await loadImage(diyReferenceImage);
      const piece = segmentNailFromPoint(img, normX, normY, tapIndex, isBaked, selectedShapeType);
      piece.label = `${fingerInfo.symbol} ${fingerInfo.label}`;
      piece.fingerGuess = fingerInfo.label;

      setSeparatedNailCards((prev) => {
        const next = [...prev, { ...piece, isMapped: false, tappedPoint: newPoint, appliedCharms: [] }];
        onSelectCard(piece.id);
        return next;
      });

      triggerToast(`✨ Clipped ${fingerInfo.symbol} ${fingerInfo.label} into ${selectedShapeType} shape!`);
    } catch (err) {
      console.warn("Tap clipping error:", err);
    }
  };

  // Process a drawn brush stroke
  const processBrushStroke = async (points: Array<{ x: number; y: number }>, renderW: number, renderH: number) => {
    if (!diyReferenceImage || !imgElementRef.current || points.length === 0) return;

    let minX = renderW, minY = renderH, maxX = 0, maxY = 0;
    points.forEach((pt) => {
      if (pt.x < minX) minX = pt.x;
      if (pt.x > maxX) maxX = pt.x;
      if (pt.y < minY) minY = pt.y;
      if (pt.y > maxY) maxY = pt.y;
    });

    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;
    const normX = Math.round((centerX / renderW) * 1000);
    const normY = Math.round((centerY / renderH) * 1000);

    const tapIndex = tappedPoints.length;
    const fingerInfo = FINGER_ORDER[tapIndex % FINGER_ORDER.length];

    const newPoint: TappedPoint = {
      id: `point_${tapIndex + 1}_${Date.now()}`,
      normX,
      normY,
      pixelX: Math.round((centerX / renderW) * (imgElementRef.current.naturalWidth || renderW)),
      pixelY: Math.round((centerY / renderH) * (imgElementRef.current.naturalHeight || renderH)),
      label: `${fingerInfo.symbol} ${fingerInfo.label}`
    };

    setTappedPoints((prev) => [...prev, newPoint]);

    try {
      const img = await loadImage(diyReferenceImage);
      const piece = segmentNailFromPoint(img, normX, normY, tapIndex, isBaked, selectedShapeType);
      piece.label = `${fingerInfo.symbol} ${fingerInfo.label}`;
      piece.fingerGuess = fingerInfo.label;

      setSeparatedNailCards((prev) => {
        const next = [...prev, { ...piece, isMapped: false, tappedPoint: newPoint, appliedCharms: [] }];
        onSelectCard(piece.id);
        return next;
      });

      triggerToast(`🖌️ Smart-brushed ${fingerInfo.symbol} ${fingerInfo.label} into ${selectedShapeType} shape!`);
    } catch (err) {
      console.warn("Brush clipping error:", err);
    }
  };

  // Undo last pin
  const handleUndoLastTap = () => {
    if (tappedPoints.length === 0) return;
    setTappedPoints((prev) => prev.slice(0, prev.length - 1));
    setSeparatedNailCards((prev) => {
      const next = prev.slice(0, prev.length - 1);
      if (next.length > 0) onSelectCard(next[next.length - 1].id);
      else onSelectCard(null);
      return next;
    });
    triggerToast("Undid last nail piece.");
  };

  // Clear all
  const handleClearAllTaps = () => {
    setTappedPoints([]);
    setSeparatedNailCards([]);
    onSelectCard(null);
    triggerToast("Cleared all nail pins.");
  };

  // Adjust rotation angle of a specific nail piece
  const handleRotatePiece = async (cardId: string, angleDelta: number) => {
    if (!diyReferenceImage) return;
    const card = separatedNailCards.find((c) => c.id === cardId);
    if (!card || !card.tappedPoint) return;

    try {
      const img = await loadImage(diyReferenceImage);
      const newAngle = ((card.rotationDegrees || 0) + angleDelta) % 360;
      const { pngDataUrl, rawPngDataUrl, dominantColor } = extractContourStraightenedNail(
        img,
        card.box2d || [200, 200, 800, 800],
        { normX: card.tappedPoint.normX, normY: card.tappedPoint.normY },
        card.isBaked !== false,
        card.shapeType || selectedShapeType,
        newAngle
      );

      setSeparatedNailCards((prev) =>
        prev.map((c) =>
          c.id === cardId
            ? {
                ...c,
                croppedImage: pngDataUrl,
                rawCroppedImage: rawPngDataUrl,
                rotationDegrees: newAngle,
                dominantColor
              }
            : c
        )
      );
    } catch (e) {
      console.warn("Rotate failed:", e);
    }
  };

  // --- "BAKE" ACTION: UV Topcoat Cure & Glossy Finish ---
  const handleBakePressOnSet = async () => {
    if (separatedNailCards.length === 0 || !diyReferenceImage) {
      triggerToast("Clip some nails first to bake your press-on set!");
      return;
    }

    setIsBakingAnimation(true);
    triggerToast("✨ UV Lamp Curing... Baking glossy 3D gel topcoat!");

    try {
      const img = await loadImage(diyReferenceImage);
      const updatedCards = separatedNailCards.map((card) => {
        const { pngDataUrl, rawPngDataUrl, dominantColor, rotationDegrees, isStraightened } =
          extractContourStraightenedNail(
            img,
            card.box2d || [200, 200, 800, 800],
            card.tappedPoint ? { normX: card.tappedPoint.normX, normY: card.tappedPoint.normY } : undefined,
            true,
            card.shapeType || selectedShapeType,
            card.rotationDegrees
          );

        return {
          ...card,
          croppedImage: pngDataUrl,
          rawCroppedImage: rawPngDataUrl,
          dominantColor,
          finish: "glossy" as const,
          decorations: "✨ Baked 3D Gel Topcoat",
          isBaked: true,
          rotationDegrees,
          isStraightened
        };
      });

      setTimeout(() => {
        setSeparatedNailCards(updatedCards);
        setIsBaked(true);
        setIsBakingAnimation(false);
        triggerToast("💖 Press-on set baked! Ultra-glossy, cute, and ready to display!");
      }, 600);
    } catch (e) {
      setIsBakingAnimation(false);
      setIsBaked(true);
    }
  };

  // --- 3D CHARM ATELIER: ADD, MOVE & REMOVE CHARMS ---
  const handleAddCharmToNail = (charmPreset: CharmPreset) => {
    if (!activeCard) {
      triggerToast("Select a nail on the rack first to add charms!");
      return;
    }

    const newCharm: AppliedCharm = {
      id: `charm_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      name: charmPreset.name,
      category: charmPreset.category,
      emoji: charmPreset.emoji,
      x: 50, // Center on nail
      y: 50,
      scale: charmPreset.category === "gummy" ? 1.35 : 1.0,
      rotation: 0
    };

    setSeparatedNailCards((prev) =>
      prev.map((c) =>
        c.id === activeCard.id
          ? {
              ...c,
              appliedCharms: [...(c.appliedCharms || []), newCharm]
            }
          : c
      )
    );

    triggerToast(`✨ Placed "${charmPreset.name}" onto ${activeCard.label}!`);
  };

  const handleRemoveCharm = (charmId: string) => {
    if (!activeCard) return;
    setSeparatedNailCards((prev) =>
      prev.map((c) =>
        c.id === activeCard.id
          ? {
              ...c,
              appliedCharms: (c.appliedCharms || []).filter((ch) => ch.id !== charmId)
            }
          : c
      )
    );
  };

  return (
    <div className="space-y-6 animate-fade-in" id="nail-diy-studio">
      {/* HEADER BAR */}
      <div className="bg-white/80 backdrop-blur-md rounded-2xl p-5 border border-pink-100/70 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl text-white shadow-xs">
              <Scissors className="w-4 h-4" />
            </span>
            <h2 className="font-display font-extrabold text-stone-800 text-lg sm:text-xl">
              Nail DIY Studio &amp; Press-On Atelier
            </h2>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Brush or tap over your photo to clip clean press-on shapes, bake with high-gloss UV gel, and add 3D charms!
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* "BAKE" ACTION BUTTON */}
          <button
            onClick={handleBakePressOnSet}
            disabled={separatedNailCards.length === 0}
            className={`px-4 py-2 text-xs font-extrabold rounded-xl transition flex items-center gap-2 shadow-xs ${
              separatedNailCards.length > 0
                ? "bg-gradient-to-r from-pink-500 via-rose-500 to-amber-400 text-white hover:opacity-95 hover:scale-105 active:scale-95 ring-2 ring-pink-300/60 animate-pulse"
                : "bg-stone-100 text-stone-400 cursor-not-allowed"
            }`}
            title="Cure nails with ultra-glossy 3D gel topcoat finish"
          >
            <Flame className="w-3.5 h-3.5 text-amber-200 fill-amber-200" />
            <span>✨ Bake Press-On Set ({separatedNailCards.length})</span>
          </button>

          <button
            onClick={onResetToTransparent}
            className="px-3.5 py-2 bg-stone-100 hover:bg-rose-50 hover:text-rose-600 text-stone-600 rounded-xl text-xs font-semibold transition border border-stone-200/60 flex items-center gap-1.5 shrink-0"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Reset Nails</span>
          </button>
        </div>
      </div>

      {/* 2-COLUMN MAIN WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: UPLOAD, BRUSH & CLIPPING (5 COLS) */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* UPLOAD & SELECTION CARD */}
          <div className="bg-white rounded-2xl p-5 border border-pink-100 shadow-sm space-y-4">
            
            {/* Header & Tool Switcher */}
            <div className="flex items-center justify-between flex-wrap gap-2 border-b border-pink-100/50 pb-3">
              <span className="text-xs font-extrabold text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
                <Paintbrush className="w-3.5 h-3.5 text-pink-500" />
                1. Select Nails in Photo
              </span>

              {diyReferenceImage && (
                <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl border border-stone-200/60">
                  <button
                    onClick={() => setSelectionTool("brush")}
                    className={`px-2.5 py-1 text-[10px] font-extrabold rounded-lg transition flex items-center gap-1 ${
                      selectionTool === "brush"
                        ? "bg-pink-600 text-white shadow-xs"
                        : "text-stone-600 hover:text-stone-900"
                    }`}
                  >
                    <Paintbrush className="w-3 h-3" />
                    <span>Brush</span>
                  </button>
                  <button
                    onClick={() => setSelectionTool("tap")}
                    className={`px-2.5 py-1 text-[10px] font-extrabold rounded-lg transition flex items-center gap-1 ${
                      selectionTool === "tap"
                        ? "bg-pink-600 text-white shadow-xs"
                        : "text-stone-600 hover:text-stone-900"
                    }`}
                  >
                    <Crosshair className="w-3 h-3" />
                    <span>1-Tap</span>
                  </button>
                </div>
              )}
            </div>

            {/* Empty Upload State */}
            {!diyReferenceImage ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-pink-200 hover:border-pink-400 rounded-2xl p-8 text-center bg-pink-50/20 hover:bg-pink-50/50 transition cursor-pointer group"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={onUploadImage}
                />
                <div className="w-12 h-12 rounded-2xl bg-white shadow-xs border border-pink-100 flex items-center justify-center mx-auto mb-3 text-pink-500 group-hover:scale-110 transition">
                  <Upload className="w-6 h-6" />
                </div>
                <p className="text-sm font-bold text-stone-800 mb-1">
                  Upload Reference Photo
                </p>
                <p className="text-xs text-stone-400">
                  Brush or tap over each nail to extract clean, straight press-on pieces
                </p>
              </div>
            ) : (
              /* ACTIVE PHOTO & INTERACTIVE BRUSH/TAP CANVAS */
              <div className="space-y-3">
                {/* Shape Selector Bar */}
                <div className="flex items-center justify-between gap-1.5 p-1.5 bg-stone-100/90 rounded-xl border border-stone-200/70">
                  <span className="text-[10px] font-extrabold text-stone-500 uppercase px-1.5">Target Shape:</span>
                  <div className="flex gap-1 flex-1">
                    {(["almond", "oval", "coffin", "square", "round"] as NailShapeType[]).map((st) => (
                      <button
                        key={st}
                        onClick={() => {
                          setSelectedShapeType(st);
                          triggerToast(`Nail clipping shape set to "${st}".`);
                        }}
                        className={`flex-1 py-1 text-[10px] font-extrabold rounded-lg capitalize transition ${
                          selectedShapeType === st
                            ? "bg-white text-pink-600 shadow-xs border border-pink-200"
                            : "text-stone-500 hover:text-stone-800"
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Interactive Clickable & Brushable Image Container */}
                <div
                  ref={imageContainerRef}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  className="relative w-full rounded-2xl overflow-hidden bg-stone-900 border border-stone-200/80 shadow-inner group flex items-center justify-center max-h-[380px] cursor-crosshair select-none"
                >
                  <img
                    ref={imgElementRef}
                    src={diyReferenceImage}
                    alt="Nail Reference"
                    className="w-full h-auto max-h-[380px] object-contain pointer-events-none select-none"
                  />

                  {/* Canvas Overlay for Live Brush Stroke Drawing */}
                  <canvas
                    ref={brushCanvasRef}
                    width={imgElementRef.current?.clientWidth || 500}
                    height={imgElementRef.current?.clientHeight || 380}
                    className="absolute inset-0 w-full h-full pointer-events-none z-20"
                  />

                  {/* Instruction Tag */}
                  <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none z-30">
                    <span className="px-2.5 py-1 bg-black/75 backdrop-blur-md text-white text-[10px] font-bold rounded-lg flex items-center gap-1.5 shadow-xs">
                      {selectionTool === "brush" ? (
                        <>
                          <Paintbrush className="w-3 h-3 text-pink-400" />
                          <span>Brush across nail to clip shape</span>
                        </>
                      ) : (
                        <>
                          <Crosshair className="w-3 h-3 text-pink-400" />
                          <span>Click nail center to clip</span>
                        </>
                      )}
                    </span>

                    {tappedPoints.length > 0 && (
                      <span className="px-2 py-1 bg-pink-500 text-white text-[10px] font-extrabold rounded-lg shadow-xs">
                        {tappedPoints.length}/10 Nails
                      </span>
                    )}
                  </div>

                  {/* NUMBERED PIN MARKERS ON TAPPED COORDINATES */}
                  {tappedPoints.map((pt, idx) => {
                    const fingerInfo = FINGER_ORDER[idx % FINGER_ORDER.length];
                    return (
                      <div
                        key={pt.id}
                        className="absolute z-20 -translate-x-1/2 -translate-y-1/2 pointer-events-none animate-scale-in flex flex-col items-center"
                        style={{
                          left: `${pt.normX / 10}%`,
                          top: `${pt.normY / 10}%`
                        }}
                      >
                        {/* Numbered Pin Badge */}
                        <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-pink-600 to-rose-400 text-white font-extrabold text-[11px] flex items-center justify-center shadow-lg border-2 border-white">
                          {fingerInfo.symbol}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Pin Management Bar */}
                <div className="flex items-center justify-between gap-2 pt-1">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={handleUndoLastTap}
                      disabled={tappedPoints.length === 0}
                      className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold rounded-xl transition flex items-center gap-1 disabled:opacity-40"
                    >
                      <Undo2 className="w-3.5 h-3.5" />
                      <span>Undo Pin</span>
                    </button>

                    <button
                      onClick={handleClearAllTaps}
                      disabled={tappedPoints.length === 0}
                      className="px-3 py-1.5 bg-stone-100 hover:bg-rose-50 hover:text-rose-600 text-stone-600 text-xs font-bold rounded-xl transition disabled:opacity-40"
                    >
                      Clear All
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      onRemovePhoto();
                      setSeparatedNailCards([]);
                      setTappedPoints([]);
                      onSelectCard(null);
                    }}
                    className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-500 text-xs font-medium rounded-xl transition"
                  >
                    Change Image
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: 10-NAIL ACRYLIC PRESS-ON RACK & 3D CHARMS STUDIO (7 COLS) */}
        <div className="lg:col-span-7 space-y-5">

          {/* AUTHENTIC 10-NAIL ACRYLIC PRESS-ON DISPLAY RACK (Exact match to reference photo!) */}
          <div className="bg-gradient-to-b from-[#FAF8F5] via-[#FFFDFB] to-[#F5EFEB] rounded-3xl p-6 border border-pink-100/80 shadow-md relative overflow-hidden">
            
            {/* UV Lamp Sweep Animation during "Bake" */}
            {isBakingAnimation && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-300/35 to-pink-400/35 z-50 pointer-events-none animate-pulse" />
            )}

            {/* Acrylic Rack Header */}
            <div className="flex items-center justify-between flex-wrap gap-2 pb-4 border-b border-stone-200/60">
              <div>
                <h3 className="font-display font-black text-stone-800 text-sm tracking-wide flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-pink-500" />
                  <span>10-Nail Press-On Acrylic Display Atelier</span>
                  {isBaked && (
                    <span className="px-2 py-0.5 bg-gradient-to-r from-amber-400 to-pink-500 text-white font-mono text-[9px] font-extrabold uppercase rounded-full shadow-2xs">
                      ✨ Baked Gel Finish
                    </span>
                  )}
                </h3>
                <p className="text-[11px] text-stone-500 mt-0.5">
                  10 isolated upright press-on nails mounted on transparent acrylic display pedestals
                </p>
              </div>
            </div>

            {/* EMPTY STATE */}
            {separatedNailCards.length === 0 ? (
              <div className="py-12 text-center text-stone-400 space-y-2">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-white border border-stone-200 flex items-center justify-center text-stone-300 shadow-xs">
                  <Paintbrush className="w-6 h-6 text-pink-300" />
                </div>
                <p className="text-xs font-bold text-stone-600">No Nails Clipped Yet</p>
                <p className="text-[11px] text-stone-400 max-w-xs mx-auto">
                  Upload your photo on the left and brush or tap on each nail to populate all 10 slots on the acrylic rack.
                </p>
              </div>
            ) : (
              /* REAL ACRYLIC PRESS-ON RACK DISPLAY */
              <div className="pt-5 space-y-6">
                
                {/* RACK ROW 1: LEFT HAND (NAILS 1 TO 5) */}
                <div className="relative p-4 rounded-2xl bg-white/70 backdrop-blur-md border border-stone-200/60 shadow-inner">
                  <span className="absolute -top-2.5 left-4 px-2 py-0.5 bg-stone-800 text-white text-[9px] font-extrabold rounded-md shadow-2xs">
                    Left Hand Tips (① to ⑤)
                  </span>

                  {/* Clear Acrylic Horizontal Bar Visual */}
                  <div className="absolute top-1/2 left-3 right-3 h-2 -translate-y-1/2 bg-gradient-to-r from-white/90 via-pink-100/60 to-white/90 rounded-full border border-stone-200/50 shadow-xs pointer-events-none" />

                  <div className="grid grid-cols-5 gap-3 relative z-10 pt-1">
                    {FINGER_ORDER.slice(0, 5).map((fingerInfo, idx) => {
                      const card = separatedNailCards[idx];
                      const isSelected = card && selectedSeparatedNailId === card.id;

                      return (
                        <div
                          key={fingerInfo.index}
                          onClick={() => {
                            if (card) {
                              onSelectCard(card.id);
                              triggerToast(`Selected ${fingerInfo.symbol} ${fingerInfo.label} for decoration & fine-tuning.`);
                            }
                          }}
                          className={`flex flex-col items-center text-center cursor-pointer transition-all duration-200 group relative ${
                            card ? "hover:scale-108 active:scale-95" : "opacity-35 cursor-default"
                          }`}
                        >
                          {/* Press-on Nail on Pedestal */}
                          <div className="relative flex flex-col items-center">
                            <div className="w-12 h-16 sm:w-14 sm:h-20 flex items-center justify-center relative">
                              {card ? (
                                <div className="relative w-full h-full flex items-center justify-center">
                                  <img
                                    src={card.croppedImage}
                                    alt={card.label}
                                    className={`max-w-full max-h-full object-contain filter drop-shadow-[0_8px_10px_rgba(0,0,0,0.18)] transition-all ${
                                      isSelected ? "ring-2 ring-pink-500 scale-105" : ""
                                    }`}
                                  />
                                  {/* Render Applied 3D Charms Overlay */}
                                  {card.appliedCharms?.map((charm) => (
                                    <span
                                      key={charm.id}
                                      className="absolute text-sm pointer-events-none drop-shadow-md z-20"
                                      style={{
                                        left: `${charm.x}%`,
                                        top: `${charm.y}%`,
                                        transform: `translate(-50%, -50%) scale(${charm.scale}) rotate(${charm.rotation}deg)`
                                      }}
                                    >
                                      {charm.emoji}
                                    </span>
                                  ))}
                                </div>
                              ) : (
                                <div className="w-10 h-14 rounded-full border-2 border-dashed border-stone-300 flex items-center justify-center text-[10px] text-stone-400">
                                  {fingerInfo.symbol}
                                </div>
                              )}
                            </div>

                            {/* Crystal Gem / Acrylic Pedestal Mount */}
                            <div className="w-6 h-3.5 -mt-1 rounded-full bg-gradient-to-t from-pink-300 via-rose-200 to-white border border-pink-300/80 shadow-md flex items-center justify-center">
                              <span className="w-2 h-1 bg-white/80 rounded-full" />
                            </div>
                          </div>

                          {/* Numbered Pink Badge & Label */}
                          <div className="mt-2 text-center space-y-0.5">
                            <div className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-pink-50 rounded-md border border-pink-100 shadow-2xs">
                              <span className="w-3.5 h-3.5 rounded-full bg-pink-600 text-white font-extrabold text-[8px] flex items-center justify-center">
                                {fingerInfo.index}
                              </span>
                              <span className="text-[9px] font-extrabold text-pink-900 truncate max-w-[55px]">
                                {fingerInfo.label.replace("Left ", "")}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* RACK ROW 2: RIGHT HAND (NAILS 6 TO 10) */}
                <div className="relative p-4 rounded-2xl bg-white/70 backdrop-blur-md border border-stone-200/60 shadow-inner">
                  <span className="absolute -top-2.5 left-4 px-2 py-0.5 bg-stone-800 text-white text-[9px] font-extrabold rounded-md shadow-2xs">
                    Right Hand Tips (⑥ to ⑩)
                  </span>

                  {/* Clear Acrylic Horizontal Bar Visual */}
                  <div className="absolute top-1/2 left-3 right-3 h-2 -translate-y-1/2 bg-gradient-to-r from-white/90 via-pink-100/60 to-white/90 rounded-full border border-stone-200/50 shadow-xs pointer-events-none" />

                  <div className="grid grid-cols-5 gap-3 relative z-10 pt-1">
                    {FINGER_ORDER.slice(5, 10).map((fingerInfo, idx) => {
                      const card = separatedNailCards[idx + 5];
                      const isSelected = card && selectedSeparatedNailId === card.id;

                      return (
                        <div
                          key={fingerInfo.index}
                          onClick={() => {
                            if (card) {
                              onSelectCard(card.id);
                              triggerToast(`Selected ${fingerInfo.symbol} ${fingerInfo.label} for decoration & fine-tuning.`);
                            }
                          }}
                          className={`flex flex-col items-center text-center cursor-pointer transition-all duration-200 group relative ${
                            card ? "hover:scale-108 active:scale-95" : "opacity-35 cursor-default"
                          }`}
                        >
                          {/* Press-on Nail on Pedestal */}
                          <div className="relative flex flex-col items-center">
                            <div className="w-12 h-16 sm:w-14 sm:h-20 flex items-center justify-center relative">
                              {card ? (
                                <div className="relative w-full h-full flex items-center justify-center">
                                  <img
                                    src={card.croppedImage}
                                    alt={card.label}
                                    className={`max-w-full max-h-full object-contain filter drop-shadow-[0_8px_10px_rgba(0,0,0,0.18)] transition-all ${
                                      isSelected ? "ring-2 ring-pink-500 scale-105" : ""
                                    }`}
                                  />
                                  {/* Render Applied 3D Charms Overlay */}
                                  {card.appliedCharms?.map((charm) => (
                                    <span
                                      key={charm.id}
                                      className="absolute text-sm pointer-events-none drop-shadow-md z-20"
                                      style={{
                                        left: `${charm.x}%`,
                                        top: `${charm.y}%`,
                                        transform: `translate(-50%, -50%) scale(${charm.scale}) rotate(${charm.rotation}deg)`
                                      }}
                                    >
                                      {charm.emoji}
                                    </span>
                                  ))}
                                </div>
                              ) : (
                                <div className="w-10 h-14 rounded-full border-2 border-dashed border-stone-300 flex items-center justify-center text-[10px] text-stone-400">
                                  {fingerInfo.symbol}
                                </div>
                              )}
                            </div>

                            {/* Crystal Gem / Acrylic Pedestal Mount */}
                            <div className="w-6 h-3.5 -mt-1 rounded-full bg-gradient-to-t from-pink-300 via-rose-200 to-white border border-pink-300/80 shadow-md flex items-center justify-center">
                              <span className="w-2 h-1 bg-white/80 rounded-full" />
                            </div>
                          </div>

                          {/* Numbered Pink Badge & Label */}
                          <div className="mt-2 text-center space-y-0.5">
                            <div className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-pink-50 rounded-md border border-pink-100 shadow-2xs">
                              <span className="w-3.5 h-3.5 rounded-full bg-pink-600 text-white font-extrabold text-[8px] flex items-center justify-center">
                                {fingerInfo.index}
                              </span>
                              <span className="text-[9px] font-extrabold text-pink-900 truncate max-w-[55px]">
                                {fingerInfo.label.replace("Right ", "")}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 3D GEMS & CHARMS STUDIO (Close-Up Decorator for Selected Nail) */}
          {activeCard && (
            <div className="bg-white rounded-3xl p-5 border border-pink-100 shadow-sm space-y-4 animate-fade-in">
              <div className="flex items-center justify-between flex-wrap gap-2 border-b border-pink-100/50 pb-3">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 bg-gradient-to-br from-pink-500 to-rose-500 rounded-lg text-white">
                    <Sparkles className="w-3.5 h-3.5" />
                  </span>
                  <div>
                    <h4 className="font-display font-extrabold text-stone-800 text-xs uppercase tracking-wide">
                      3D Charms &amp; Decorator Studio — {activeCard.label}
                    </h4>
                    <p className="text-[10px] text-stone-400">
                      8-Point TPS canonical rectification (256×384). Click charms below to attach!
                    </p>
                  </div>
                </div>

                {/* Quality & Rotation Controls */}
                <div className="flex items-center gap-2 flex-wrap">
                  {activeCard.rectificationQuality && (
                    <div className="hidden sm:flex items-center gap-1.5 text-[9px] font-mono font-bold">
                      <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-700 rounded border border-emerald-200">
                        Vis: {Math.round(activeCard.rectificationQuality.visibility * 100)}%
                      </span>
                      <span className="px-1.5 py-0.5 bg-pink-50 text-pink-700 rounded border border-pink-200">
                        Conf: {Math.round(activeCard.rectificationQuality.designConfidence * 100)}%
                      </span>
                    </div>
                  )}

                  <div className="flex items-center gap-1 bg-stone-50 p-1 rounded-xl border border-stone-200/60">
                    <span className="text-[10px] font-bold text-stone-500 px-1">Rotate:</span>
                    <button
                      onClick={() => handleRotatePiece(activeCard.id, -15)}
                      className="px-2 py-0.5 bg-white hover:bg-pink-100 text-pink-700 text-[10px] font-extrabold rounded-lg border border-pink-200 shadow-2xs transition"
                    >
                      ↺ -15°
                    </button>
                    <button
                      onClick={() => handleRotatePiece(activeCard.id, 15)}
                      className="px-2 py-0.5 bg-white hover:bg-pink-100 text-pink-700 text-[10px] font-extrabold rounded-lg border border-pink-200 shadow-2xs transition"
                    >
                      ↻ +15°
                    </button>
                  </div>
                </div>
              </div>

              {/* Close-Up Workspace + 3D Charms Drawer */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                
                {/* Large Close-up Nail Preview Stand */}
                <div className="md:col-span-4 flex flex-col items-center justify-center p-4 bg-gradient-to-b from-stone-50 via-pink-50/20 to-stone-100 rounded-2xl border border-stone-200/70 shadow-inner min-h-[190px] relative">
                  <div className="relative w-20 h-28 flex items-center justify-center">
                    <img
                      src={activeCard.croppedImage}
                      alt={activeCard.label}
                      className="max-w-full max-h-full object-contain filter drop-shadow-[0_12px_16px_rgba(0,0,0,0.22)]"
                    />

                    {/* Applied 3D Charms */}
                    {activeCard.appliedCharms?.map((charm) => (
                      <div
                        key={charm.id}
                        onClick={() => handleRemoveCharm(charm.id)}
                        className="absolute cursor-pointer hover:scale-125 transition-transform group"
                        style={{
                          left: `${charm.x}%`,
                          top: `${charm.y}%`,
                          transform: `translate(-50%, -50%) scale(${charm.scale}) rotate(${charm.rotation}deg)`
                        }}
                        title={`Click to remove ${charm.name}`}
                      >
                        <span className="text-xl filter drop-shadow-md">{charm.emoji}</span>
                        <span className="hidden group-hover:block absolute -top-4 left-1/2 -translate-x-1/2 px-1 bg-red-500 text-white text-[8px] font-extrabold rounded">
                          ✕
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Crystal Pedestal */}
                  <div className="w-10 h-4 -mt-1 rounded-full bg-gradient-to-t from-pink-300 via-rose-200 to-white border border-pink-300/80 shadow-md flex items-center justify-center">
                    <span className="w-3 h-1 bg-white/80 rounded-full" />
                  </div>

                  <span className="text-[10px] font-extrabold text-stone-600 mt-2">
                    {activeCard.appliedCharms?.length ? `${activeCard.appliedCharms.length} Charm(s) Applied` : "Bare Nail Plate"}
                  </span>
                </div>

                {/* 3D Charms Catalog Grid */}
                <div className="md:col-span-8 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-stone-700">
                      Select 3D Gem or Charm:
                    </span>
                    <span className="text-[10px] text-pink-600 font-semibold">
                      Click to place on nail
                    </span>
                  </div>

                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-48 overflow-y-auto pr-1">
                    {CHARM_PRESETS.map((charm) => (
                      <button
                        key={charm.id}
                        onClick={() => handleAddCharmToNail(charm)}
                        className="p-2.5 bg-stone-50 hover:bg-pink-50/70 border border-stone-200/80 hover:border-pink-300 rounded-xl text-center transition-all duration-150 group flex flex-col items-center justify-center shadow-2xs hover:scale-105 active:scale-95"
                      >
                        <span className="text-2xl mb-1 filter drop-shadow-xs group-hover:scale-115 transition-transform">
                          {charm.emoji}
                        </span>
                        <span className="text-[9px] font-bold text-stone-700 truncate w-full block">
                          {charm.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
