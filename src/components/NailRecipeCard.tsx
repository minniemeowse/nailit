import React from "react";
import { NailCollection, NailDesign } from "../types";
import { Printer, X, Download, ShieldCheck, Sparkles } from "lucide-react";
import { NailHandRenderer } from "./NailHandRenderer";

interface NailRecipeCardProps {
  collection: NailCollection;
  shape: string;
  length: string;
  onClose: () => void;
}

const PressOnNailTip: React.FC<{ nail: NailDesign; shape: string }> = ({ nail, shape }) => {
  // Determine shape style classes
  let shapeClass = "w-10 h-16 rounded-t-2xl rounded-b-md"; // default
  if (shape.toLowerCase() === "almond") {
    shapeClass = "w-11 h-18 rounded-t-[50%_100%] rounded-b-lg border-x border-t border-rose-100";
  } else if (shape.toLowerCase() === "coffin") {
    shapeClass = "w-10 h-18 rounded-t-sm rounded-b-md border-b-4 border-b-neutral-300 border-x border-rose-100";
  } else if (shape.toLowerCase() === "stiletto") {
    shapeClass = "w-8 h-20 rounded-t-[50%_100%] rounded-b-md border-x border-rose-100";
  } else if (shape.toLowerCase() === "square") {
    shapeClass = "w-10 h-16 rounded-t-none rounded-b-md border-t border-x border-rose-100";
  } else if (shape.toLowerCase() === "round") {
    shapeClass = "w-10 h-14 rounded-t-full rounded-b-lg border-t border-x border-rose-100";
  }

  return (
    <div className="flex flex-col items-center">
      <div 
        className={`relative ${shapeClass} shadow-md overflow-hidden flex items-end justify-center border border-gray-200/80 bg-stone-100/50 group transition-all duration-300 hover:scale-110 hover:shadow-lg`}
        style={{
          backgroundColor: nail.baseColor === "transparent" ? "rgba(255,255,255,0.15)" : nail.baseColor,
        }}
      >
        {/* Layer A - Base Cropped Image */}
        {nail.croppedImage && (
          <img src={nail.croppedImage} alt="base pattern" className="absolute inset-0 w-full h-full object-cover pointer-events-none" />
        )}
        
        {/* Layer B - Overlay Art */}
        {nail.overlayImage && (
          <img src={nail.overlayImage} alt="overlay art" className="absolute inset-0 w-full h-full object-cover pointer-events-none" style={{ filter: "drop-shadow(0px 1px 2px rgba(0,0,0,0.25))" }} />
        )}

        {/* If no image, render standard artStyle elements */}
        {!nail.croppedImage && nail.artStyle === "french" && (
          <div className="absolute top-0 left-0 w-full h-[30%] bg-white border-b border-gray-100" style={{ backgroundColor: nail.secondaryColor || "#FFFFFF" }} />
        )}
        {!nail.croppedImage && nail.artStyle === "ombre" && (
          <div className="absolute inset-0 bg-gradient-to-t" style={{ backgroundImage: `linear-gradient(to top, ${nail.baseColor}, ${nail.secondaryColor || "rgba(255,255,255,0.8)"})` }} />
        )}

        {/* Glass Glaze Reflection Overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-white/40 pointer-events-none" />
        
        {/* Shine highlight */}
        <div className="absolute top-1 left-1.5 w-1 h-1/2 bg-white/35 rounded-full blur-[0.5px]" />
      </div>
      <span className="text-[10px] font-mono font-bold text-neutral-500 mt-2 uppercase text-center w-12 truncate">
        {nail.finger.replace("Left ", "").replace("Right ", "")}
      </span>
    </div>
  );
};

export const NailRecipeCard: React.FC<NailRecipeCardProps> = ({
  collection,
  shape,
  length,
  onClose,
}) => {
  const handlePrint = () => {
    window.print();
  };

  const leftHandNails = collection.nails.filter((n) => n.finger.startsWith("Left"));
  const rightHandNails = collection.nails.filter((n) => n.finger.startsWith("Right"));

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#FAF5F3] rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-pink-100 flex flex-col justify-between" id="printable-recipe-card">
        {/* MODAL HEADER - NON PRINTABLE */}
        <div className="p-4 bg-white border-b border-pink-100 flex items-center justify-between sticky top-0 z-10 print:hidden">
          <div className="flex items-center gap-2">
            <span className="p-1 bg-pink-100 text-pink-600 rounded text-xs font-bold font-mono">PRO</span>
            <h4 className="font-display font-bold text-gray-800 text-sm">
              Atelier Recipe &amp; Specification Box
            </h4>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-lg text-xs font-semibold transition shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-neutral-100 text-neutral-400 hover:text-neutral-600 rounded-lg transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* PRINTABLE BODY CONTENT */}
        <div className="p-8 space-y-8 bg-white print:p-0 print:space-y-6">
          {/* Main Recipe Header */}
          <div className="text-center pb-6 border-b-2 border-dashed border-pink-100">
            <h2 className="font-display text-3xl font-extrabold text-neutral-800 tracking-tight">
              {collection.designName}
            </h2>
            <p className="text-sm text-pink-600 font-medium font-mono mt-1 uppercase tracking-widest">
              DIY Nail Recipe &amp; Specification Sheet
            </p>
            <p className="text-xs text-neutral-500 mt-2 max-w-xl mx-auto italic">
              "{collection.description}"
            </p>

            {/* Core Specs tags */}
            <div className="flex justify-center gap-4 mt-4 text-xs font-mono">
              <span className="bg-pink-50 text-pink-700 border border-pink-100 px-3 py-1 rounded-full">
                Shape: <strong className="text-pink-900 uppercase">{shape}</strong>
              </span>
              <span className="bg-pink-50 text-pink-700 border border-pink-100 px-3 py-1 rounded-full">
                Length: <strong className="text-pink-900 uppercase">{length}</strong>
              </span>
            </div>
          </div>

          {/* Color Palette swatch bar */}
          <div className="space-y-3">
            <h5 className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">
              I. Atelier Color Palette
            </h5>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {collection.colorPalette.map((color, idx) => (
                <div key={idx} className="flex items-center gap-2.5 p-2 bg-neutral-50 rounded-lg border border-neutral-100">
                  <div
                    className="w-8 h-8 rounded-md border border-neutral-200 shrink-0"
                    style={{ backgroundColor: color.hex === "transparent" ? "rgba(255,255,255,0.15)" : color.hex }}
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-neutral-700 truncate leading-none mb-1">
                      {color.name}
                    </p>
                    <p className="text-[10px] text-neutral-400 font-mono leading-none">
                      {color.hex}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* TWO LAYERS VIEW: FULL HAND PREVIEW */}
          <div className="space-y-3">
            <h5 className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">
              II. Visual Hand Layout
            </h5>
            <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-100">
              <NailHandRenderer
                collection={collection}
                selectedFinger={null}
                shape={shape}
              />
            </div>
          </div>

          {/* PRESS-ON STYLE PACKAGING TRAY */}
          <div className="space-y-3">
            <h5 className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-1">
              <span>III. Close-up Press-On Tip Tray</span>
              <Sparkles className="w-3.5 h-3.5 text-pink-500" />
            </h5>
            <div className="bg-gradient-to-b from-[#FFFDFB] to-[#FAF3EE] rounded-3xl p-6 border-2 border-pink-100 shadow-inner relative overflow-hidden">
              {/* Satin ribbon overlay effect */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-white px-3 py-1 rounded-full border border-pink-100 shadow-sm text-[9px] font-mono tracking-widest text-pink-500 font-bold uppercase">
                ✨ Bespoke Atelier Press-On Box Set ✨
              </div>
              
              <div className="mt-6 space-y-6">
                {/* ROW 1: LEFT HAND */}
                <div>
                  <div className="text-[10px] uppercase tracking-wider font-mono text-neutral-400 mb-2 block text-center">
                    Left Hand Nails
                  </div>
                  <div className="flex justify-center items-end gap-3 sm:gap-6 py-4 bg-white/40 rounded-xl border border-pink-100/30">
                    {leftHandNails.map((nail, idx) => (
                      <PressOnNailTip key={idx} nail={nail} shape={shape} />
                    ))}
                  </div>
                </div>

                {/* ROW 2: RIGHT HAND */}
                <div>
                  <div className="text-[10px] uppercase tracking-wider font-mono text-neutral-400 mb-2 block text-center">
                    Right Hand Nails
                  </div>
                  <div className="flex justify-center items-end gap-3 sm:gap-6 py-4 bg-white/40 rounded-xl border border-pink-100/30">
                    {rightHandNails.map((nail, idx) => (
                      <PressOnNailTip key={idx} nail={nail} shape={shape} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 10 FINGERS DETAILED TEXT STEPS */}
          <div className="space-y-3">
            <h5 className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">
              IV. Nail Formula &amp; Recipes
            </h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {collection.nails.map((nail, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-stone-50/60 rounded-xl border border-stone-200/50 flex items-start gap-4"
                >
                  {/* Miniature Nail Contour View */}
                  <div className="shrink-0 flex flex-col items-center">
                    <div
                      className="w-10 h-14 rounded-t-xl border border-gray-200 shadow-inner relative overflow-hidden flex justify-center items-end"
                      style={{
                        backgroundColor: nail.baseColor === "transparent" ? "rgba(255,255,255,0.15)" : nail.baseColor,
                      }}
                    >
                      {nail.croppedImage && (
                        <img
                          src={nail.croppedImage}
                          alt="patch"
                          className="absolute inset-0 w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      )}
                      {nail.overlayImage && (
                        <img
                          src={nail.overlayImage}
                          alt="overlay"
                          className="absolute inset-0 w-full h-full object-cover"
                          style={{ filter: "drop-shadow(0px 1px 1px rgba(0,0,0,0.2))" }}
                          referrerPolicy="no-referrer"
                        />
                      )}
                      {!nail.croppedImage && nail.artStyle === "french" && (
                        <div
                          className="absolute top-0 left-0 w-full h-[30%] rounded-t-inherit"
                          style={{ backgroundColor: nail.secondaryColor || "#FFFFFF" }}
                        />
                      )}
                      {!nail.croppedImage && nail.artStyle === "ombre" && (
                        <div
                          className="absolute inset-0"
                          style={{
                            background: `linear-gradient(to top, ${nail.baseColor}, ${nail.secondaryColor || "#FFFFFF"})`,
                          }}
                        />
                      )}
                    </div>
                    <span className="text-[9px] text-neutral-400 font-mono font-bold mt-1.5 uppercase text-center w-14 truncate">
                      {nail.finger.replace("Left ", "L ").replace("Right ", "R ")}
                    </span>
                  </div>

                  {/* Nail Description & Steps */}
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-display font-bold text-xs text-neutral-800 truncate">
                        {nail.title}
                      </span>
                      <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-pink-50 text-pink-600">
                        {nail.finish}
                      </span>
                      <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-pink-50 text-pink-600">
                        {nail.artStyle}
                      </span>
                    </div>

                    {nail.decorations !== "None" && nail.decorations !== "" && (
                      <p className="text-[10px] text-pink-600 font-medium">
                        ✨ Decor: {nail.decorations}
                      </p>
                    )}

                    <p className="text-[11px] text-neutral-600 leading-relaxed font-sans">
                      {nail.details}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Printable Note footer */}
          <div className="p-4 bg-pink-50 rounded-xl border border-pink-100 flex items-center justify-between text-xs text-pink-800 print:bg-white print:border-gray-200">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-pink-600" />
              <span>Verified DIY Nail Palette Recipe Specification. Hand Crafted.</span>
            </div>
            <span className="font-mono text-[9px] text-gray-400">Date: {new Date().toLocaleDateString()}</span>
          </div>
        </div>

        {/* FOOTER ACTION - NON PRINTABLE */}
        <div className="p-4 bg-white border-t border-pink-100 flex justify-end gap-2 print:hidden rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-600 font-semibold rounded-lg text-xs transition"
          >
            Close Spec Card
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold rounded-lg text-xs transition shadow-sm flex items-center gap-1"
          >
            <Download className="w-3.5 h-3.5" />
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
};
