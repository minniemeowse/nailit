import React, { useState, useRef } from "react";
import { Upload, Scissors, Sparkles, Image as ImageIcon, Trash2, HelpCircle } from "lucide-react";
import { ReferenceImage } from "../types";

interface ImagePatchmakerProps {
  uploadedImages: ReferenceImage[];
  onUploadImages: (files: FileList) => void;
  onDeleteImage: (id: string) => void;
  selectedFinger: string | null;
  onApplyPatch: (fingerName: string, croppedDataUrl: string) => void;
  onClearPatch: (fingerName: string) => void;
  nailsList: string[];
}

export const ImagePatchmaker: React.FC<ImagePatchmakerProps> = ({
  uploadedImages,
  onUploadImages,
  onDeleteImage,
  selectedFinger,
  onApplyPatch,
  onClearPatch,
  nailsList,
}) => {
  const [activeImageId, setActiveImageId] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  // Crop Box States (expressed in percentages of the image)
  const [cropX, setCropX] = useState(25);
  const [cropY, setCropY] = useState(25);
  const [cropWidth, setCropWidth] = useState(40);
  const [cropHeight, setCropHeight] = useState(40);

  const [targetFinger, setTargetFinger] = useState<string>("");

  const imageRef = useRef<HTMLImageElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync target finger when selected finger on the hand changes
  React.useEffect(() => {
    if (selectedFinger) {
      setTargetFinger(selectedFinger);
    } else if (nailsList.length > 0 && !targetFinger) {
      setTargetFinger(nailsList[0]);
    }
  }, [selectedFinger, nailsList]);

  const activeImage = uploadedImages.find((img) => img.id === activeImageId) || uploadedImages[0];

  React.useEffect(() => {
    if (uploadedImages.length > 0 && !activeImageId) {
      setActiveImageId(uploadedImages[0].id);
    }
  }, [uploadedImages, activeImageId]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onUploadImages(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onUploadImages(e.target.files);
    }
  };

  // Perform the actual slice & patch operation using canvas
  const executeCrop = () => {
    if (!activeImage || !imageRef.current) return;

    const imgElement = imageRef.current;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    // Use actual dimensions of the image source file
    const naturalW = imgElement.naturalWidth;
    const naturalH = imgElement.naturalHeight;

    // Calculate crop coordinates relative to the natural image file
    const sx = (cropX / 100) * naturalW;
    const sy = (cropY / 100) * naturalH;
    const sWidth = (cropWidth / 100) * naturalW;
    const sHeight = (cropHeight / 100) * naturalH;

    // Define output canvas size (keep it crisp, e.g., 200x300 vertical nail ratio)
    canvas.width = 300;
    canvas.height = 450;

    // Clear and draw image slice
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(imgElement, sx, sy, sWidth, sHeight, 0, 0, canvas.width, canvas.height);

    // Convert to high-quality base64
    const croppedDataUrl = canvas.toDataURL("image/jpeg", 0.9);

    // Send back to parent state
    const destination = targetFinger || selectedFinger || nailsList[0];
    onApplyPatch(destination, croppedDataUrl);
  };

  return (
    <div className="bg-white/60 backdrop-blur-md rounded-2xl p-6 shadow-sm border border-pink-100/50 flex flex-col h-full justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-pink-100 rounded-lg text-pink-600">
              <Scissors className="w-4 h-4" />
            </span>
            <h3 className="font-display text-lg font-bold text-gray-800">
              Reference Patchmaker
            </h3>
          </div>
          <span className="text-xs text-gray-400 font-mono flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-pink-400 animate-pulse" /> Iframe Friendly
          </span>
        </div>

        <p className="text-xs text-gray-500 mb-4 leading-relaxed">
          Stuck trying to explain 3D nail art designs? Upload a reference photo, select the exact glitter or gem region, and <strong>patch it</strong> onto any finger!
        </p>

        {/* DRAG AND DROP ZONE */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-5 mb-5 text-center cursor-pointer transition-all duration-300 ${
            dragOver
              ? "border-pink-500 bg-pink-50/50 scale-[1.01]"
              : "border-pink-200 hover:border-pink-400 hover:bg-pink-50/10"
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            multiple
            onChange={handleFileChange}
          />
          <div className="flex flex-col items-center">
            <Upload className="w-8 h-8 text-pink-400 mb-2 animate-bounce" />
            <span className="text-xs font-semibold text-gray-700">
              Drag &amp; Drop Nail Reference Images
            </span>
            <span className="text-[10px] text-gray-400 mt-1">
              Supports PNG, JPG, WEBP (Local &amp; Secure)
            </span>
          </div>
        </div>

        {/* UPLOADED THUMBNAILS CAROUSEL */}
        {uploadedImages.length > 0 && (
          <div className="mb-5">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
              Your Reference Assets ({uploadedImages.length})
            </span>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
              {uploadedImages.map((img) => (
                <div
                  key={img.id}
                  className={`relative shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 cursor-pointer transition-all duration-200 ${
                    activeImage?.id === img.id
                      ? "border-pink-500 scale-105 shadow-sm"
                      : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                  onClick={() => setActiveImageId(img.id)}
                >
                  <img
                    src={img.src}
                    alt={img.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteImage(img.id);
                    }}
                    className="absolute top-0.5 right-0.5 bg-black/60 hover:bg-red-600 rounded p-0.5 text-white transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* INTERACTIVE CROPPER PANEL */}
        {activeImage ? (
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
            <div className="text-xs font-medium text-gray-700 mb-3 flex items-center justify-between">
              <span>Adjust Selection Box:</span>
              <span className="text-[10px] text-pink-500 font-bold bg-pink-100/50 px-2 py-0.5 rounded">
                Active: {activeImage.name.substring(0, 15)}...
              </span>
            </div>

            {/* Simulated Cropping Box Canvas Display */}
            <div className="relative aspect-square max-h-56 bg-zinc-900 rounded-lg overflow-hidden border border-zinc-200 mx-auto flex items-center justify-center">
              <img
                ref={imageRef}
                src={activeImage.src}
                alt="Source preview"
                className="max-w-full max-h-full object-contain select-none"
                referrerPolicy="no-referrer"
              />

              {/* Crop box overlay */}
              <div
                className="absolute border-2 border-dashed border-pink-500 bg-pink-400/20 shadow-md flex items-center justify-center"
                style={{
                  left: `${cropX}%`,
                  top: `${cropY}%`,
                  width: `${cropWidth}%`,
                  height: `${cropHeight}%`,
                  maxWidth: `${100 - cropX}%`,
                  maxHeight: `${100 - cropY}%`,
                }}
              >
                {/* Crop corner decorations */}
                <div className="absolute -top-1 -left-1 w-2.5 h-2.5 bg-pink-600 border border-white" />
                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-pink-600 border border-white" />
                <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 bg-pink-600 border border-white" />
                <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-pink-600 border border-white" />
                <span className="text-[9px] font-bold text-white bg-pink-600 px-1.5 py-0.5 rounded drop-shadow-sm select-none">
                  Nail Patch Area
                </span>
              </div>
            </div>

            {/* Slider Controls for absolute stability */}
            <div className="mt-4 space-y-2.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-gray-400 uppercase font-bold flex justify-between">
                    <span>X Position</span>
                    <span>{cropX}%</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="90"
                    value={cropX}
                    onChange={(e) => setCropX(Math.min(parseInt(e.target.value), 100 - cropWidth))}
                    className="w-full accent-pink-500 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-gray-400 uppercase font-bold flex justify-between">
                    <span>Y Position</span>
                    <span>{cropY}%</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="90"
                    value={cropY}
                    onChange={(e) => setCropY(Math.min(parseInt(e.target.value), 100 - cropHeight))}
                    className="w-full accent-pink-500 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-gray-400 uppercase font-bold flex justify-between">
                    <span>Width Box</span>
                    <span>{cropWidth}%</span>
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={cropWidth}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      setCropWidth(val);
                      if (cropX + val > 100) setCropX(100 - val);
                    }}
                    className="w-full accent-pink-500 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-gray-400 uppercase font-bold flex justify-between">
                    <span>Height Box</span>
                    <span>{cropHeight}%</span>
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={cropHeight}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      setCropHeight(val);
                      if (cropY + val > 100) setCropY(100 - val);
                    }}
                    className="w-full accent-pink-500 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 rounded-xl p-8 border border-dashed border-gray-200 flex flex-col items-center justify-center text-center">
            <ImageIcon className="w-10 h-10 text-gray-300 mb-2" />
            <span className="text-xs font-medium text-gray-500">
              No Reference Photos Uploaded Yet
            </span>
            <p className="text-[10px] text-gray-400 mt-1 max-w-xs">
              Upload references (like a cute pattern or charm you saw on social media) to start patching textures onto your nail board.
            </p>
          </div>
        )}
      </div>

      {/* FOOTER - PATCH CONTROLLER */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="space-y-3">
          <div>
            <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1.5">
              Select Destination Finger:
            </label>
            <select
              value={targetFinger}
              onChange={(e) => setTargetFinger(e.target.value)}
              className="w-full p-2 text-xs rounded-lg border border-gray-200 bg-white shadow-sm focus:border-pink-300 focus:outline-none"
            >
              {nailsList.map((nail) => (
                <option key={nail} value={nail}>
                  {nail === selectedFinger ? `✨ Selected: ${nail}` : nail}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-2">
            <button
              onClick={executeCrop}
              disabled={!activeImage}
              className="flex-1 bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white font-medium py-2.5 px-4 rounded-xl text-xs transition-all duration-200 shadow-sm disabled:opacity-50 flex items-center justify-center gap-1.5"
            >
              <Scissors className="w-4 h-4" />
              Apply Patch to Finger
            </button>

            {/* Clear patch if existing */}
            <button
              onClick={() => onClearPatch(targetFinger || selectedFinger || nailsList[0])}
              className="px-3 py-2.5 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 text-xs font-medium transition-all"
              title="Clear patch and revert to base colors"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
