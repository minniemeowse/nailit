import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  MapPin,
  SlidersHorizontal,
  Phone,
  Clock,
  Star,
  Compass,
  Send,
  CheckCircle2,
  X,
  Sparkles,
  DollarSign,
  MessageSquare,
  Copy,
  Check,
  Info,
  Navigation,
  ArrowRight,
  Map as MapIcon,
  Layers,
  Heart,
  Plus,
  Building2,
  Home,
  Instagram,
  Filter,
  CheckSquare,
  Square as SquareIcon
} from "lucide-react";
import L from "leaflet";
import { NailCollection } from "../types";
import {
  SalonInfo,
  SalonReview,
  NailShapeFilter,
  NailLengthFilter,
  ComplexityFilter,
  getStoredSalons,
  saveCustomHBNS,
  calculateDynamicSalonPrice
} from "../utils/sgSalonsData";

interface SalonFinderProps {
  collection: NailCollection;
  shape: string;
  length: string;
  triggerToast: (msg: string) => void;
}

export function SalonFinder({ collection, shape: initialShape, length: initialLength, triggerToast }: SalonFinderProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  const [salonsList, setSalonsList] = useState<SalonInfo[]>([]);
  const [selectedSalonId, setSelectedSalonId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<"all" | "commercial" | "homebased">("all");

  // 1. Nail Shape Criteria
  const [selectedShape, setSelectedShape] = useState<NailShapeFilter>("almond");
  // 2. Nail Length Criteria
  const [selectedLength, setSelectedLength] = useState<NailLengthFilter>("short");
  // 3. Design Complexity Criteria
  const [selectedComplexity, setSelectedComplexity] = useState<ComplexityFilter>("solid");

  // Registration Modal State for Home-Based Nail Techs
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [newStudioName, setNewStudioName] = useState("");
  const [newStudioAddress, setNewStudioAddress] = useState("");
  const [newStudioDistrict, setNewStudioDistrict] = useState<SalonInfo["district"]>("Central & Orchard");
  const [newStudioMrt, setNewStudioMrt] = useState("");
  const [newStudioWhatsapp, setNewStudioWhatsapp] = useState("");
  const [newStudioInstagram, setNewStudioInstagram] = useState("");
  const [newStudioBasePrice, setNewStudioBasePrice] = useState("38");
  const [newStudioSpecialties, setNewStudioSpecialties] = useState("Korean Syrup Jelly, 3D Charms, Gel-X");
  const [newStudioVibe, setNewStudioVibe] = useState("Cozy private home-based studio with Netflix");

  // AI Quote message copy state
  const [copiedQuote, setCopiedQuote] = useState(false);

  // Load salons on mount
  useEffect(() => {
    const loaded = getStoredSalons();
    setSalonsList(loaded);
    if (loaded.length > 0) {
      setSelectedSalonId(loaded[0].id);
    }
  }, []);

  const selectedSalon = salonsList.find((s) => s.id === selectedSalonId) || salonsList[0];

  // Filter salons by search, district, type
  const filteredSalons = salonsList.filter((salon) => {
    const matchesSearch =
      searchQuery === "" ||
      salon.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      salon.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      salon.mrt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      salon.specialties.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesDistrict = selectedDistrict === "all" || salon.district === selectedDistrict;
    const matchesType = selectedType === "all" || salon.type === selectedType;

    return matchesSearch && matchesDistrict && matchesType;
  });

  // Initialize and update Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Singapore center coordinates: [1.3521, 103.8198]
      const map = L.map(mapContainerRef.current, {
        center: [1.3521, 103.8198],
        zoom: 12,
        minZoom: 11,
        maxZoom: 18,
        zoomControl: false
      });

      // CartoDB Positron clean map tiles (100% Free, high contrast & stylish)
      L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
        attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        subdomains: "abcd",
        maxZoom: 19
      }).addTo(map);

      // Add zoom control top right
      L.control.zoom({ position: "topright" }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Clear old markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    // Custom Price Pill Marker generator (Pastel Pink for Commercial, Pastel Mint for Home-Based)
    const createPriceMarkerIcon = (salon: SalonInfo, price: number, isSelected: boolean) => {
      const isHome = salon.type === "homebased";
      
      // Pastel Pink: Commercial Salons (#FCE7F3 bg, #F472B6 border, #9D174D text)
      // Pastel Mint: Home-Based Studios (#D1FAE5 bg, #34D399 border, #065F46 text)
      const bg = isHome ? "#D1FAE5" : "#FCE7F3";
      const border = isSelected ? (isHome ? "#059669" : "#E11D48") : isHome ? "#34D399" : "#F472B6";
      const text = isHome ? "#065F46" : "#9D174D";
      const shadow = isSelected ? "0 8px 16px rgba(0,0,0,0.35)" : "0 3px 8px rgba(0,0,0,0.18)";

      return L.divIcon({
        className: "custom-price-marker",
        html: `
          <div style="
            display: flex;
            flex-direction: column;
            align-items: center;
            transform: translate(-50%, -100%);
            cursor: pointer;
            z-index: ${isSelected ? 100 : 10};
            transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
          ">
            <div style="
              background: ${bg};
              color: ${text};
              border: 2px solid ${border};
              box-shadow: ${shadow};
              padding: ${isSelected ? "5px 11px" : "4px 9px"};
              border-radius: 9999px;
              font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              font-weight: 900;
              font-size: ${isSelected ? "13px" : "11px"};
              white-space: nowrap;
              display: flex;
              align-items: center;
              gap: 4px;
              letter-spacing: -0.02em;
            ">
              <span style="font-size: ${isSelected ? "11px" : "9px"}; opacity: 0.85;">${isHome ? "🏡" : "💅"}</span>
              <span>$${price}</span>
            </div>
            <div style="
              width: 0;
              height: 0;
              border-left: 5px solid transparent;
              border-right: 5px solid transparent;
              border-top: 6px solid ${border};
              margin-top: -1px;
            "></div>
          </div>
        `,
        iconSize: [0, 0],
        iconAnchor: [0, 0]
      });
    };

    // Add markers with real-time calculated prices
    filteredSalons.forEach((salon) => {
      const { price } = calculateDynamicSalonPrice(salon, selectedShape, selectedLength, selectedComplexity);
      const isSelected = salon.id === selectedSalonId;

      const marker = L.marker([salon.latitude, salon.longitude], {
        icon: createPriceMarkerIcon(salon, price, isSelected)
      }).addTo(map);

      marker.on("click", () => {
        setSelectedSalonId(salon.id);
        map.flyTo([salon.latitude, salon.longitude], 14, { duration: 0.7 });
      });

      markersRef.current.push(marker);
    });

    if (selectedSalon) {
      map.flyTo([selectedSalon.latitude, selectedSalon.longitude], 14, { duration: 0.5 });
    }
  }, [filteredSalons.length, selectedSalonId, selectedShape, selectedLength, selectedComplexity]);

  const handleCopyQuote = (msg: string) => {
    navigator.clipboard.writeText(msg);
    setCopiedQuote(true);
    triggerToast("✨ Consultation inquiry copied! Ready to paste into WhatsApp / Instagram.");
    setTimeout(() => setCopiedQuote(false), 2500);
  };

  const handleRegisterNewHBNS = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudioName || !newStudioAddress) {
      triggerToast("Please enter your studio name and neighborhood/address!");
      return;
    }

    const baseCost = parseInt(newStudioBasePrice, 10) || 38;
    const latOffset = (Math.random() - 0.5) * 0.04;
    const lngOffset = (Math.random() - 0.5) * 0.04;

    const newSalon: SalonInfo = {
      id: `hbns_${Date.now()}`,
      name: newStudioName,
      type: "homebased",
      basePrice: baseCost,
      rating: 5.0,
      reviewsCount: 1,
      latitude: 1.3400 + latOffset,
      longitude: 103.8500 + lngOffset,
      address: newStudioAddress,
      district: newStudioDistrict,
      mrt: newStudioMrt || "Nearby MRT",
      phone: newStudioWhatsapp ? `+65 ${newStudioWhatsapp}` : "+65 9000 0000",
      whatsapp: newStudioWhatsapp || "6590000000",
      instagram: newStudioInstagram.startsWith("@") ? newStudioInstagram : `@${newStudioInstagram || "home_studio"}`,
      hours: "By Appointment",
      priceLevel: "$",
      priceRange: `$${baseCost} - $${baseCost + 35}`,
      specialties: newStudioSpecialties.split(",").map((s) => s.trim()),
      vibe: newStudioVibe,
      verified: true,
      reviews: [
        {
          author: "Founder / Verified Tech",
          rating: 5,
          date: "Just now",
          source: "Verified Customer",
          text: "Registered on Nail Design Planner! Accepting new appointment bookings."
        }
      ]
    };

    saveCustomHBNS(newSalon);
    setSalonsList((prev) => [newSalon, ...prev]);
    setSelectedSalonId(newSalon.id);
    setShowRegisterModal(false);
    triggerToast(`🎉 "${newStudioName}" registered and pinned to Singapore map with pastel mint price badge!`);
  };

  const currentPriceCalc = selectedSalon
    ? calculateDynamicSalonPrice(selectedSalon, selectedShape, selectedLength, selectedComplexity)
    : null;

  const consultationMsg = selectedSalon && currentPriceCalc
    ? `Hi ${selectedSalon.name}! 💅 I'd like to check appointment availability for:\n• Shape: ${selectedShape.toUpperCase()}\n• Length: ${selectedLength.toUpperCase()}\n• Complexity: ${selectedComplexity.toUpperCase()}\n• Estimated Price: ~$${currentPriceCalc.price} SGD\nDo you have any available slots this week? Thank you! 💕`
    : "";

  return (
    <div className="space-y-6 animate-fade-in" id="singapore-nail-map">
      
      {/* HEADER BAR */}
      <div className="bg-white/80 backdrop-blur-md rounded-2xl p-5 border border-pink-100 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl text-white shadow-xs">
              <DollarSign className="w-4 h-4" />
            </span>
            <h2 className="font-display font-extrabold text-stone-800 text-lg sm:text-xl">
              Singapore Nail Salon &amp; Price Map
            </h2>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Real-time price estimates mapped across Singapore with Pastel Pink for Salons &amp; Pastel Mint for Home-Based Studios
          </p>
        </div>

        {/* Register Home-Based Nail Studio Button */}
        <button
          onClick={() => setShowRegisterModal(true)}
          className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-xs font-extrabold transition shadow-xs flex items-center gap-1.5 shrink-0 hover:scale-105 active:scale-95"
        >
          <Home className="w-3.5 h-3.5" />
          <span>➕ Register Home-Based Studio</span>
        </button>
      </div>

      {/* 🎯 TOP CRITERIA BAR: 1. NAIL SHAPE | 2. NAIL LENGTH | 3. DESIGN COMPLEXITY */}
      <div className="bg-white rounded-3xl p-5 border border-pink-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-pink-100/50 pb-2">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-pink-600" />
            <h3 className="font-display font-extrabold text-stone-800 text-xs uppercase tracking-wider">
              Set Nail Criteria to Recalculate Live Map Prices
            </h3>
          </div>
          <span className="text-[10px] text-pink-600 font-bold">
            Prices update dynamically on map markers
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
          
          {/* CRITERIA 1: NAIL SHAPE */}
          <div className="space-y-2 p-3 bg-stone-50 rounded-2xl border border-stone-200/60">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold text-stone-800 flex items-center gap-1">
                <span className="w-4 h-4 rounded-full bg-pink-600 text-white text-[9px] font-bold flex items-center justify-center">1</span>
                <span>Nail Shape</span>
              </span>
              <span className="text-[10px] text-pink-600 font-bold capitalize">
                {selectedShape.replace("_", " ")}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-1.5 text-[10px] font-bold">
              {[
                { id: "almond", label: "Almond" },
                { id: "russian_almond", label: "Russian Alm." },
                { id: "coffin", label: "Coffin" },
                { id: "stiletto", label: "Stiletto" },
                { id: "square", label: "Square" },
                { id: "squoval", label: "Squoval" },
                { id: "round", label: "Round" },
                { id: "oval", label: "Oval" },
                { id: "lipstick", label: "Lipstick" }
              ].map((s) => {
                const isSelected = selectedShape === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => setSelectedShape(s.id as NailShapeFilter)}
                    className={`py-1.5 px-2 rounded-xl transition flex items-center justify-start gap-1 ${
                      isSelected
                        ? "bg-pink-600 text-white shadow-2xs font-extrabold"
                        : "bg-white text-stone-600 hover:bg-pink-50 border border-stone-200/70"
                    }`}
                  >
                    {isSelected ? (
                      <CheckSquare className="w-3 h-3 text-white shrink-0" />
                    ) : (
                      <SquareIcon className="w-3 h-3 text-stone-300 shrink-0" />
                    )}
                    <span className="truncate">{s.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* CRITERIA 2: NAIL LENGTH */}
          <div className="space-y-2 p-3 bg-stone-50 rounded-2xl border border-stone-200/60">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold text-stone-800 flex items-center gap-1">
                <span className="w-4 h-4 rounded-full bg-pink-600 text-white text-[9px] font-bold flex items-center justify-center">2</span>
                <span>Nail Length</span>
              </span>
              <span className="text-[10px] text-pink-600 font-bold capitalize">
                {selectedLength.replace("_", " ")}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-1.5 text-[10px] font-bold">
              {[
                { id: "short", label: "Short (Natural)", extra: "+$0" },
                { id: "medium", label: "Medium (+1.0cm)", extra: "+$8-12" },
                { id: "long", label: "Long (+2.0cm)", extra: "+$15-22" },
                { id: "extra_long", label: "Extra Long (+3cm)", extra: "+$22-32" }
              ].map((len) => {
                const isSelected = selectedLength === len.id;
                return (
                  <button
                    key={len.id}
                    onClick={() => setSelectedLength(len.id as NailLengthFilter)}
                    className={`py-2 px-2.5 rounded-xl transition flex flex-col items-start ${
                      isSelected
                        ? "bg-pink-600 text-white shadow-2xs font-extrabold"
                        : "bg-white text-stone-600 hover:bg-pink-50 border border-stone-200/70"
                    }`}
                  >
                    <div className="flex items-center gap-1 w-full">
                      {isSelected ? (
                        <CheckSquare className="w-3 h-3 text-white shrink-0" />
                      ) : (
                        <SquareIcon className="w-3 h-3 text-stone-300 shrink-0" />
                      )}
                      <span className="truncate">{len.label}</span>
                    </div>
                    <span className={`text-[8px] pl-4 ${isSelected ? "text-pink-100" : "text-stone-400"}`}>
                      {len.extra}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* CRITERIA 3: DESIGN COMPLEXITY */}
          <div className="space-y-2 p-3 bg-stone-50 rounded-2xl border border-stone-200/60">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold text-stone-800 flex items-center gap-1">
                <span className="w-4 h-4 rounded-full bg-pink-600 text-white text-[9px] font-bold flex items-center justify-center">3</span>
                <span>Design Complexity</span>
              </span>
              <span className="text-[10px] text-pink-600 font-bold capitalize">
                {selectedComplexity.replace("_", " ")}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-1.5 text-[10px] font-bold">
              {[
                { id: "solid", label: "Solid & Syrup Gel", extra: "Base Price" },
                { id: "french_cateye", label: "French / Cat Eye", extra: "+$12-18" },
                { id: "charms_3d", label: "3D Charms & Gems", extra: "+$20-30" },
                { id: "full_gelx_extreme", label: "Full Gel-X + 3D", extra: "+$32-45" }
              ].map((comp) => {
                const isSelected = selectedComplexity === comp.id;
                return (
                  <button
                    key={comp.id}
                    onClick={() => setSelectedComplexity(comp.id as ComplexityFilter)}
                    className={`py-2 px-2.5 rounded-xl transition flex flex-col items-start ${
                      isSelected
                        ? "bg-pink-600 text-white shadow-2xs font-extrabold"
                        : "bg-white text-stone-600 hover:bg-pink-50 border border-stone-200/70"
                    }`}
                  >
                    <div className="flex items-center gap-1 w-full">
                      {isSelected ? (
                        <CheckSquare className="w-3 h-3 text-white shrink-0" />
                      ) : (
                        <SquareIcon className="w-3 h-3 text-stone-300 shrink-0" />
                      )}
                      <span className="truncate">{comp.label}</span>
                    </div>
                    <span className={`text-[8px] pl-4 ${isSelected ? "text-pink-100" : "text-stone-400"}`}>
                      {comp.extra}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      </div>

      {/* SEARCH & FILTERS BAR */}
      <div className="bg-white rounded-2xl p-4 border border-pink-100 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          
          {/* Search Input */}
          <div className="sm:col-span-5 relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search salon name, MRT, area (e.g. Far East Plaza, Jurong Point, Tampines)..."
              className="w-full pl-9 pr-3.5 py-2 text-xs bg-stone-50 border border-stone-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 font-medium"
            />
          </div>

          {/* Type Filter (All / Commercial / Home-Based) */}
          <div className="sm:col-span-4 flex items-center gap-1 bg-stone-100 p-1 rounded-xl border border-stone-200/70">
            <button
              onClick={() => setSelectedType("all")}
              className={`flex-1 py-1.5 text-[11px] font-extrabold rounded-lg transition ${
                selectedType === "all" ? "bg-white text-stone-900 shadow-2xs" : "text-stone-500 hover:text-stone-800"
              }`}
            >
              All ({salonsList.length})
            </button>
            <button
              onClick={() => setSelectedType("commercial")}
              className={`flex-1 py-1.5 text-[11px] font-extrabold rounded-lg transition flex items-center justify-center gap-1 ${
                selectedType === "commercial" ? "bg-pink-100 text-pink-800 border border-pink-300 shadow-2xs" : "text-stone-500 hover:text-stone-800"
              }`}
            >
              <Building2 className="w-3 h-3 text-pink-700" />
              <span>Salons (Pink)</span>
            </button>
            <button
              onClick={() => setSelectedType("homebased")}
              className={`flex-1 py-1.5 text-[11px] font-extrabold rounded-lg transition flex items-center justify-center gap-1 ${
                selectedType === "homebased" ? "bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-2xs" : "text-stone-500 hover:text-stone-800"
              }`}
            >
              <Home className="w-3 h-3 text-emerald-700" />
              <span>Home (Mint)</span>
            </button>
          </div>

          {/* District Dropdown */}
          <div className="sm:col-span-3">
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full py-2 px-3 text-xs bg-stone-50 border border-stone-200/80 rounded-xl font-bold text-stone-700 focus:outline-none focus:ring-2 focus:ring-pink-300"
            >
              <option value="all">📍 All Singapore Districts</option>
              <option value="Downtown & Bugis">Bugis &amp; Downtown</option>
              <option value="Central & Orchard">Orchard &amp; Far East Plaza</option>
              <option value="East & Tampines">East &amp; Tampines Mall / Katong</option>
              <option value="West & Jurong">West &amp; Jurong Point / Holland V</option>
              <option value="North & Bishan">North &amp; NEX / Northpoint / Punggol</option>
            </select>
          </div>
        </div>
      </div>

      {/* MAIN 2-COLUMN MAP & STUDIO DETAILS VIEW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: INTERACTIVE LEAFLET SINGAPORE MAP (7 COLS) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-4 border border-pink-100 shadow-sm space-y-3">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-extrabold text-stone-700">
                Interactive Singapore Price Map ({filteredSalons.length} Studios Found)
              </span>
            </div>
            
            {/* Color Legend for Marker Price Pills */}
            <div className="flex items-center gap-3 text-[10px] font-bold">
              <span className="flex items-center gap-1 text-pink-800 bg-pink-100 px-2 py-0.5 rounded-full border border-pink-300">
                <span>💅</span>
                <span>Pastel Pink: Commercial Salon</span>
              </span>
              <span className="flex items-center gap-1 text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                <span>🏡</span>
                <span>Pastel Mint: Home-Based (HBNS)</span>
              </span>
            </div>
          </div>

          {/* Leaflet Map Canvas */}
          <div
            ref={mapContainerRef}
            className="w-full h-[470px] sm:h-[530px] rounded-2xl overflow-hidden border border-stone-200 shadow-inner z-10"
          />
        </div>

        {/* RIGHT COLUMN: SELECTED SALON / HBNS DETAIL & LIVE QUOTE (5 COLS) */}
        <div className="lg:col-span-5 space-y-4">
          {selectedSalon && currentPriceCalc ? (
            <div className="bg-white rounded-3xl p-5 border border-pink-100 shadow-sm space-y-5 animate-fade-in">
              
              {/* Studio Header */}
              <div className="border-b border-pink-100/60 pb-4 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2.5 py-0.5 text-[10px] font-extrabold rounded-full uppercase tracking-wide border ${
                          selectedSalon.type === "homebased"
                            ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                            : "bg-pink-100 text-pink-800 border-pink-300"
                        }`}
                      >
                        {selectedSalon.type === "homebased" ? "🏡 Home-Based Studio" : "🏬 Commercial Salon"}
                      </span>
                      {selectedSalon.verified && (
                        <span className="flex items-center gap-0.5 text-[10px] text-emerald-600 font-extrabold">
                          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                          <span>Verified</span>
                        </span>
                      )}
                    </div>
                    <h3 className="font-display font-black text-stone-900 text-lg mt-1">
                      {selectedSalon.name}
                    </h3>
                  </div>

                  <div className="flex flex-col items-end">
                    <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-xl border border-amber-200/60 text-amber-800 font-extrabold text-xs">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      <span>{selectedSalon.rating.toFixed(1)}</span>
                    </div>
                    <span className="text-[10px] text-stone-400 mt-0.5">
                      ({selectedSalon.reviewsCount} reviews)
                    </span>
                  </div>
                </div>

                <p className="text-xs text-stone-600 italic">
                  "{selectedSalon.vibe}"
                </p>

                {/* Location & MRT */}
                <div className="space-y-1 text-xs text-stone-600 pt-1">
                  <div className="flex items-center gap-1.5 text-stone-700 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-pink-500 shrink-0" />
                    <span>{selectedSalon.address}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-stone-500 text-[11px]">
                    <Navigation className="w-3 h-3 text-cyan-600 shrink-0" />
                    <span>{selectedSalon.mrt}</span>
                  </div>
                </div>

                {/* Specialties Tags */}
                <div className="flex items-center gap-1.5 flex-wrap pt-1">
                  {selectedSalon.specialties.map((spec, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 bg-pink-50 text-pink-700 text-[10px] font-extrabold rounded-md border border-pink-100"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              {/* LIVE DYNAMIC PRICE BREAKDOWN BASED ON TICKED CRITERIA */}
              <div className="p-4 bg-gradient-to-br from-pink-50 via-rose-50/40 to-amber-50/40 rounded-2xl border border-pink-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-extrabold text-stone-800 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-pink-600" />
                      <span>Estimated Price for Selected Criteria</span>
                    </span>
                    <span className="text-[9px] text-stone-500 block">
                      {selectedShape.toUpperCase()} • {selectedLength.toUpperCase()} • {selectedComplexity.toUpperCase()}
                    </span>
                  </div>
                  <span className="text-base font-black text-pink-700">
                    ${currentPriceCalc.price} SGD
                  </span>
                </div>

                <div className="space-y-1 text-[10px] text-stone-600 border-t border-pink-200/60 pt-2 font-mono">
                  {currentPriceCalc.breakdown.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-1 text-stone-700">
                      <span>•</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                {/* Actions: WhatsApp Direct & Copy Consultation Msg */}
                <div className="flex items-center gap-2 pt-1">
                  <a
                    href={`https://wa.me/${selectedSalon.whatsapp}?text=${encodeURIComponent(
                      consultationMsg
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold text-center transition flex items-center justify-center gap-1.5 shadow-2xs"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Chat on WhatsApp (${currentPriceCalc.price})</span>
                  </a>

                  <button
                    onClick={() => handleCopyQuote(consultationMsg)}
                    className="px-3 py-2 bg-white hover:bg-pink-50 text-stone-700 rounded-xl text-xs font-bold transition border border-stone-200 shadow-2xs flex items-center gap-1 shrink-0"
                    title="Copy inquiry text"
                  >
                    {copiedQuote ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedQuote ? "Copied" : "Copy"}</span>
                  </button>
                </div>
              </div>

              {/* RECENT REVIEWS & TESTIMONIALS */}
              <div className="space-y-2.5 pt-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-extrabold text-stone-800 uppercase tracking-wider">
                    Verified Customer Reviews
                  </h4>
                  <span className="text-[10px] text-pink-600 font-bold">
                    {selectedSalon.reviews.length} Featured
                  </span>
                </div>

                <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                  {selectedSalon.reviews.map((rev, i) => (
                    <div
                      key={i}
                      className="p-3 bg-stone-50 rounded-xl border border-stone-200/70 space-y-1 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="font-extrabold text-stone-800">{rev.author}</span>
                          <span className="px-1.5 py-0.2 bg-stone-200/60 text-stone-600 text-[9px] rounded font-bold">
                            {rev.source}
                          </span>
                        </div>
                        <div className="flex items-center text-amber-500 text-[10px]">
                          {"★".repeat(rev.rating)}
                        </div>
                      </div>
                      <p className="text-[11px] text-stone-600 leading-relaxed">
                        "{rev.text}"
                      </p>
                      {rev.nailStyle && (
                        <span className="text-[9px] text-pink-600 font-bold block pt-0.5">
                          💅 Style: {rev.nailStyle}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 bg-white rounded-3xl border border-stone-200 text-center text-stone-400">
              Select a salon from the map or list to view pricing &amp; reviews
            </div>
          )}
        </div>
      </div>

      {/* REGISTRATION MODAL: HOME-BASED NAIL ARTIST / STUDIO (HBNS) */}
      {showRegisterModal && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 border border-pink-100 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-2 bg-emerald-600 rounded-xl text-white">
                  <Home className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="font-display font-extrabold text-stone-900 text-base">
                    Register Your Home-Based Nail Studio (HBNS)
                  </h3>
                  <p className="text-[10px] text-stone-400">
                    Get discovered by nail enthusiasts in Singapore with a Pastel Mint price pin!
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowRegisterModal(false)}
                className="p-1 text-stone-400 hover:text-stone-800 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRegisterNewHBNS} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-stone-700 block mb-1">
                  Studio / Artist Name *
                </label>
                <input
                  type="text"
                  required
                  value={newStudioName}
                  onChange={(e) => setNewStudioName(e.target.value)}
                  placeholder="e.g. Luna Claws Studio (Home-Based)"
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-300 font-medium"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="font-bold text-stone-700 block mb-1">
                    District / Region *
                  </label>
                  <select
                    value={newStudioDistrict}
                    onChange={(e) => setNewStudioDistrict(e.target.value as any)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-bold text-stone-700"
                  >
                    <option value="Central & Orchard">Central &amp; Orchard</option>
                    <option value="Downtown & Bugis">Downtown &amp; Bugis</option>
                    <option value="East & Tampines">East &amp; Tampines</option>
                    <option value="West & Jurong">West &amp; Jurong</option>
                    <option value="North & Bishan">North &amp; Bishan</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">
                    Base Gel Price ($)
                  </label>
                  <input
                    type="number"
                    value={newStudioBasePrice}
                    onChange={(e) => setNewStudioBasePrice(e.target.value)}
                    placeholder="38"
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-bold text-stone-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">
                    Nearest MRT Station
                  </label>
                  <input
                    type="text"
                    value={newStudioMrt}
                    onChange={(e) => setNewStudioMrt(e.target.value)}
                    placeholder="e.g. Tampines West (DT31)"
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-medium"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">
                    Neighborhood / Location *
                  </label>
                  <input
                    type="text"
                    required
                    value={newStudioAddress}
                    onChange={(e) => setNewStudioAddress(e.target.value)}
                    placeholder="e.g. Tampines St 81"
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">
                    WhatsApp Number (Digits only)
                  </label>
                  <input
                    type="text"
                    value={newStudioWhatsapp}
                    onChange={(e) => setNewStudioWhatsapp(e.target.value)}
                    placeholder="e.g. 6591234567"
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-medium"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">
                    Instagram Handle
                  </label>
                  <input
                    type="text"
                    value={newStudioInstagram}
                    onChange={(e) => setNewStudioInstagram(e.target.value)}
                    placeholder="e.g. @lunaclaws.sg"
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">
                  Specialties (Comma separated)
                </label>
                <input
                  type="text"
                  value={newStudioSpecialties}
                  onChange={(e) => setNewStudioSpecialties(e.target.value)}
                  placeholder="Korean Syrup, 3D Charms, Gel-X, Cat Eye"
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">
                  Studio Vibe &amp; Description
                </label>
                <textarea
                  rows={2}
                  value={newStudioVibe}
                  onChange={(e) => setNewStudioVibe(e.target.value)}
                  placeholder="Tell clients about your setup (e.g. Netflix, cozy private room, pet friendly)..."
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-medium"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRegisterModal(false)}
                  className="flex-1 py-2.5 bg-stone-100 text-stone-700 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-extrabold shadow-md"
                >
                  Pin Studio (Pastel Mint) ✨
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
