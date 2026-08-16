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
  Scissors, 
  Sparkles,
  Calendar,
  DollarSign,
  MessageSquare,
  Copy,
  Check,
  Info,
  ZoomIn,
  ZoomOut,
  Navigation,
  ArrowRight,
  Map as MapIcon,
  Layers,
  HelpCircle,
  Eye,
  Settings
} from "lucide-react";
import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow } from "@vis.gl/react-google-maps";
import { NailCollection } from "../types";

interface Salon {
  id: string;
  name: string;
  rating: number;
  reviewsCount: number;
  latitude: number;
  longitude: number;
  address: string;
  phone: string;
  whatsapp: string;
  instagram: string;
  hours: string;
  vibe: string;
  district: string;
  priceLevel: string;
  // Dynamically populated by backend AI
  estimatedPrice: number;
  aiMatchedMenu: string;
  aiMenuDetails: string[];
  aiConsultationMsg: string;
}

interface SalonFinderProps {
  collection: NailCollection;
  shape: string;
  length: string;
  triggerToast: (msg: string) => void;
}

// Map boundaries of Singapore for precise SVG mapping
const MAP_BOUNDS = {
  minLat: 1.23,
  maxLat: 1.38,
  minLng: 103.68,
  maxLng: 103.98
};

// Coastal GPS points representing the Singapore main island coastline
const SG_COASTLINE_GPS = [
  { lat: 1.340, lng: 103.680 },
  { lat: 1.375, lng: 103.700 },
  { lat: 1.415, lng: 103.725 },
  { lat: 1.442, lng: 103.745 },
  { lat: 1.458, lng: 103.790 },
  { lat: 1.455, lng: 103.825 },
  { lat: 1.440, lng: 103.855 },
  { lat: 1.415, lng: 103.900 },
  { lat: 1.408, lng: 103.935 },
  { lat: 1.385, lng: 103.985 },
  { lat: 1.355, lng: 104.030 },
  { lat: 1.315, lng: 104.015 },
  { lat: 1.295, lng: 103.945 },
  { lat: 1.285, lng: 103.895 },
  { lat: 1.258, lng: 103.855 },
  { lat: 1.242, lng: 103.820 },
  { lat: 1.265, lng: 103.765 },
  { lat: 1.285, lng: 103.715 },
  { lat: 1.305, lng: 103.685 },
  { lat: 1.340, lng: 103.680 }
];

// Sentosa Island coordinates
const SENTOSA_GPS = [
  { lat: 1.242, lng: 103.818 },
  { lat: 1.254, lng: 103.832 },
  { lat: 1.250, lng: 103.849 },
  { lat: 1.235, lng: 103.832 },
  { lat: 1.242, lng: 103.818 }
];

// MacRitchie Reservoir coordinates (Central Water catchment)
const MACRITCHIE_GPS = [
  { lat: 1.342, lng: 103.822 },
  { lat: 1.348, lng: 103.832 },
  { lat: 1.343, lng: 103.842 },
  { lat: 1.336, lng: 103.832 },
  { lat: 1.342, lng: 103.822 }
];

// Marina Bay basin coordinates
const MARINA_BAY_GPS = [
  { lat: 1.282, lng: 103.854 },
  { lat: 1.289, lng: 103.859 },
  { lat: 1.284, lng: 103.865 },
  { lat: 1.277, lng: 103.858 },
  { lat: 1.282, lng: 103.854 }
];

// Botanic Gardens (green lung)
const BOTANIC_GPS = [
  { lat: 1.311, lng: 103.812 },
  { lat: 1.318, lng: 103.814 },
  { lat: 1.314, lng: 103.821 },
  { lat: 1.307, lng: 103.817 },
  { lat: 1.311, lng: 103.812 }
];

// East Coast Park coordinates
const EAST_COAST_GPS = [
  { lat: 1.301, lng: 103.905 },
  { lat: 1.308, lng: 103.922 },
  { lat: 1.321, lng: 103.951 },
  { lat: 1.326, lng: 103.967 },
  { lat: 1.316, lng: 103.972 },
  { lat: 1.296, lng: 103.912 },
  { lat: 1.301, lng: 103.905 }
];

// Major Expressways for Google Map simulation
const EXPRESSWAYS = [
  {
    id: "pie",
    name: "PIE (Pan Island Expressway)",
    points: [
      { lat: 1.325, lng: 103.680 },
      { lat: 1.338, lng: 103.740 },
      { lat: 1.328, lng: 103.810 },
      { lat: 1.342, lng: 103.860 },
      { lat: 1.332, lng: 103.930 },
      { lat: 1.355, lng: 103.985 }
    ],
    traffic: "fluent"
  },
  {
    id: "ecp",
    name: "ECP (East Coast Parkway)",
    points: [
      { lat: 1.272, lng: 103.850 },
      { lat: 1.298, lng: 103.895 },
      { lat: 1.308, lng: 103.940 },
      { lat: 1.348, lng: 103.990 }
    ],
    traffic: "fluent"
  },
  {
    id: "cte",
    name: "CTE (Central Expressway)",
    points: [
      { lat: 1.420, lng: 103.855 },
      { lat: 1.365, lng: 103.862 },
      { lat: 1.318, lng: 103.846 },
      { lat: 1.280, lng: 103.840 }
    ],
    traffic: "heavy"
  },
  {
    id: "aye",
    name: "AYE (Ayer Rajah Expressway)",
    points: [
      { lat: 1.325, lng: 103.680 },
      { lat: 1.312, lng: 103.750 },
      { lat: 1.278, lng: 103.805 },
      { lat: 1.272, lng: 103.850 }
    ],
    traffic: "moderate"
  }
];

// Google style landmarks
const LANDMARKS = [
  { name: "Marina Bay Sands", emoji: "🏨", lat: 1.2831, lng: 103.8598, type: "landmark" },
  { name: "Changi Airport", emoji: "✈️", lat: 1.3550, lng: 103.9870, type: "landmark" },
  { name: "Singapore Flyer", emoji: "🎡", lat: 1.2892, lng: 103.8631, type: "landmark" },
  { name: "Merlion Park", emoji: "🦁", lat: 1.2868, lng: 103.8545, type: "landmark" },
  { name: "Orchard Road Mall Hub", emoji: "🛍️", lat: 1.3025, lng: 103.8350, type: "landmark" },
  { name: "Botanic Gardens", emoji: "🌺", lat: 1.3138, lng: 103.8159, type: "landmark" },
  { name: "Sentosa Resort", emoji: "🏝️", lat: 1.2420, lng: 103.8350, type: "landmark" }
];

// MRT stations overlay on Google Map clone
const MRT_STATIONS = [
  { name: "Somerset MRT (NS23)", lat: 1.3002, lng: 103.8381 },
  { name: "Orchard MRT (NS22)", lat: 1.3040, lng: 103.8322 },
  { name: "Bugis MRT (EW12/DT14)", lat: 1.3005, lng: 103.8557 },
  { name: "Chinatown MRT (NE4/DT19)", lat: 1.2825, lng: 103.8430 },
  { name: "Dhoby Ghaut MRT (NS24)", lat: 1.3007, lng: 103.8454 }
];

// Standard preset options for the style category selection bar
const STYLES_PRESETS = [
  { id: "extensions_coffin_complex", label: "💅 Coffin Extensions (Complex)", desc: "Nail extensions coffin medium length complex design" },
  { id: "jelly_oval_medium", label: "🔮 Japanese Jelly (Ombre)", desc: "Japanese translucent jelly nails almond medium length ombre" },
  { id: "chrome_stiletto_long", label: "✨ Mirror Chrome (Y2K)", desc: "Long stiletto chrome nails liquid silver cyber punk" },
  { id: "glazed_donut_square", label: "🍩 Hailey's Glazed Donut", desc: "Short square glazed donut nails milky pearl base" },
  { id: "classic_gel_mani", label: "🎀 Clean Girl Classic", desc: "Classic gel manicure solid color sheer blush" }
];

// Districts for SG filtering
const SG_DISTRICTS = ["All Districts", "Orchard Road", "Somerset / Orchard", "Chinatown", "Bugis", "River Valley", "Marina Bay", "Tampines", "Jurong East"];

// Retrieve process env keys safely
const API_KEY =
  process.env.GOOGLE_MAPS_PLATFORM_KEY ||
  (import.meta as any).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY ||
  (globalThis as any).GOOGLE_MAPS_PLATFORM_KEY ||
  "";
const hasValidKey = Boolean(API_KEY) && API_KEY !== "YOUR_API_KEY";

export function SalonFinder({ collection, shape: initialShape, length: initialLength, triggerToast }: SalonFinderProps) {
  // Style Builder states
  const [selectedStyleQuery, setSelectedStyleQuery] = useState<string>("nail extensions coffin medium length complex design");
  const [customSearchText, setCustomSearchText] = useState<string>("");
  const [selectedShape, setSelectedShape] = useState<string>(initialShape || "Coffin");
  const [selectedLength, setSelectedLength] = useState<string>(initialLength || "Medium");
  const [selectedComplexity, setSelectedComplexity] = useState<string>("Complex");
  const [selectedType, setSelectedType] = useState<string>("Gel-X Extensions");

  // Map settings and layout states
  const [salons, setSalons] = useState<Salon[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedSalonId, setSelectedSalonId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"price_low_high" | "price_high_low" | "distance" | "rating">("price_low_high");
  
  // Map interactive features (Google Maps Clone parameters)
  const [zoom, setZoom] = useState<number>(12);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [mapLayer, setMapLayer] = useState<"standard" | "satellite" | "traffic">("standard");
  const [showMRT, setShowMRT] = useState<boolean>(true);
  const [showLandmarks, setShowLandmarks] = useState<boolean>(true);
  const [mapSource, setMapSource] = useState<"clone" | "google">(hasValidKey ? "google" : "clone");

  // Dragging interaction states
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStart = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // User simulated GPS location (Somerset Orchard default)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number }>({
    lat: 1.3002,
    lng: 103.8381
  });
  const [isLocating, setIsLocating] = useState<boolean>(false);

  // Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [maxDistanceKM, setMaxDistanceKM] = useState<number>(15);
  const [selectedDistrict, setSelectedDistrict] = useState<string>("All Districts");
  const [showFilters, setShowFilters] = useState(false);
  const [mobileView, setMobileView] = useState<"list" | "map">("map");

  // Booking details Simulation
  const [bookingStep, setBookingStep] = useState<"none" | "transmitting" | "confirmed">("none");
  const [copiedTextType, setCopiedTextType] = useState<"phone" | "whatsapp" | "msg" | null>(null);
  const [ticketCode, setTicketCode] = useState("");

  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Trigger search on mount and when style builder configurations change
  useEffect(() => {
    fetchSalonsData();
  }, [selectedStyleQuery]);

  // Construct style query when builder items change
  const handleApplyBuilder = () => {
    const query = `${selectedType.toLowerCase()} ${selectedShape.toLowerCase()} ${selectedLength.toLowerCase()} length ${selectedComplexity.toLowerCase()} design`;
    setSelectedStyleQuery(query);
    triggerToast(`💅 AI searching rates for: "${query}"`);
  };

  const fetchSalonsData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/salons/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ style: selectedStyleQuery })
      });
      const data = await response.json();
      if (data.salons) {
        setSalons(data.salons);
        // Automatically select the cheapest or first salon
        if (data.salons.length > 0) {
          setSelectedSalonId(data.salons[0].id);
        }
      } else {
        throw new Error("Failed to load salons list from API");
      }
    } catch (err) {
      console.error(err);
      triggerToast("⚠️ Connection issue. Using local simulated rates.");
    } finally {
      setIsLoading(false);
    }
  };

  // Locate user using actual geolocation API
  const handleFindMyLocation = () => {
    setIsLocating(true);
    if (!navigator.geolocation) {
      triggerToast("❌ Geolocation not supported by your browser. Defaulting to Somerset, SG.");
      setIsLocating(false);
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        // Confirm coordinates lie roughly within Singapore region
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        if (lat > 1.20 && lat < 1.48 && lng > 103.55 && lng < 104.15) {
          setUserLocation({ lat, lng });
          triggerToast("📍 GPS synced! Relocating to your actual Singapore position.");
        } else {
          // Centered on SG Somerset for developers outside SG
          setUserLocation({ lat: 1.3002, lng: 103.8381 });
          triggerToast("📍 Synced to Central Singapore (Somerset/Orchard) for visual preview!");
        }
        setIsLocating(false);
      },
      (error) => {
        console.warn(error);
        triggerToast("📍 Synced to central Orchard / Somerset, Singapore.");
        setUserLocation({ lat: 1.3002, lng: 103.8381 });
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  };

  // Haversine formula to compute actual distances in km
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Number((R * c).toFixed(1)); // Rounded to 1 decimal place
  };

  // GPS to SVG Coordinate translation accounting for Zoom and Drag offset
  const gpsToSvgCoords = (lat: number, lng: number, width: number = 800, height: number = 420) => {
    const xPct = (lng - MAP_BOUNDS.minLng) / (MAP_BOUNDS.maxLng - MAP_BOUNDS.minLng);
    const yPct = 1 - (lat - MAP_BOUNDS.minLat) / (MAP_BOUNDS.maxLat - MAP_BOUNDS.minLat);
    
    // Zoom factor scale (base is 12)
    const scale = Math.pow(1.5, zoom - 12);
    
    // Center point projection with scale and panOffset
    const x = (xPct - 0.5) * width * scale + width / 2 + panOffset.x;
    const y = (yPct - 0.5) * height * scale + height / 2 + panOffset.y;
    
    return { x, y };
  };

  const formatPoints = (points: { lat: number; lng: number }[]) => {
    return points.map(p => {
      const { x, y } = gpsToSvgCoords(p.lat, p.lng);
      return `${x},${y}`;
    }).join(" ");
  };

  // Map Dragging / Panning Handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0) return; // Left click only
    setIsDragging(true);
    dragStart.current = { x: e.clientX - panOffset.x, y: e.clientY - panOffset.y };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    setPanOffset({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length !== 1) return;
    setIsDragging(true);
    const touch = e.touches[0];
    dragStart.current = { x: touch.clientX - panOffset.x, y: touch.clientY - panOffset.y };
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    setPanOffset({
      x: touch.clientX - dragStart.current.x,
      y: touch.clientY - dragStart.current.y
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Map Double-click to custom set simulated user location
  const handleMapDoubleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!mapContainerRef.current) return;
    const rect = mapContainerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - panOffset.x;
    const y = e.clientY - rect.top - panOffset.y;
    
    // Reverse calculation
    const baseWidth = 800;
    const baseHeight = 420;
    const scale = Math.pow(1.5, zoom - 12);
    
    const xPct = (x - baseWidth / 2) / (baseWidth * scale) + 0.5;
    const yPct = 1 - ((y - baseHeight / 2) / (baseHeight * scale) + 0.5);
    
    const lat = MAP_BOUNDS.minLat + yPct * (MAP_BOUNDS.maxLat - MAP_BOUNDS.minLat);
    const lng = MAP_BOUNDS.minLng + xPct * (MAP_BOUNDS.maxLng - MAP_BOUNDS.minLng);
    
    if (lat > MAP_BOUNDS.minLat && lat < MAP_BOUNDS.maxLat && lng > MAP_BOUNDS.minLng && lng < MAP_BOUNDS.maxLng) {
      setUserLocation({ lat, lng });
      triggerToast("📍 Relocated your GPS location pin!");
    }
  };

  // Filter & Sort Salons list
  const filteredSalons = salons.map(s => {
    const dist = calculateDistance(userLocation.lat, userLocation.lng, s.latitude, s.longitude);
    return { ...s, distance: dist };
  }).filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          s.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.district.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDistance = s.distance <= maxDistanceKM;
    const matchesDistrict = selectedDistrict === "All Districts" || s.district === selectedDistrict;
    return matchesSearch && matchesDistance && matchesDistrict;
  }).sort((a, b) => {
    if (sortBy === "price_low_high") return a.estimatedPrice - b.estimatedPrice;
    if (sortBy === "price_high_low") return b.estimatedPrice - a.estimatedPrice;
    if (sortBy === "distance") return a.distance - b.distance;
    if (sortBy === "rating") return b.rating - a.rating;
    return 0;
  });

  const activeSalon = salons.find(s => s.id === selectedSalonId) || filteredSalons[0] || salons[0];

  const handleCopyText = (text: string, type: "phone" | "whatsapp" | "msg") => {
    navigator.clipboard.writeText(text);
    setCopiedTextType(type);
    triggerToast("📋 Copied to clipboard successfully!");
    setTimeout(() => setCopiedTextType(null), 2000);
  };

  const handleInitiateBooking = () => {
    setBookingStep("transmitting");
    setTimeout(() => {
      const randomCode = `SG-NAIL-ART-${Math.floor(Math.random() * 90000 + 10000)}`;
      setTicketCode(randomCode);
      setBookingStep("confirmed");
      triggerToast(`📬 Recipe Pack formula transmitted to ${activeSalon.name}!`);
    }, 2000);
  };

  // Dynamic price level colors for Trip.com styling
  const getPriceBadgeStyle = (price: number) => {
    if (price <= 70) return { bg: "bg-emerald-600 border-emerald-500 text-white", text: "text-emerald-400" };
    if (price <= 120) return { bg: "bg-amber-600 border-amber-500 text-white", text: "text-amber-400" };
    if (price <= 180) return { bg: "bg-rose-600 border-rose-500 text-white", text: "text-rose-400" };
    return { bg: "bg-purple-700 border-purple-600 text-white", text: "text-purple-400" };
  };

  // Style properties based on mapLayer
  const getLayerColors = () => {
    switch (mapLayer) {
      case "satellite":
        return {
          sea: "#080f1e",
          land: "#121d30",
          landStroke: "#1e3a5f",
          sentosa: "#1a2a44",
          reservoirs: "#063c5e",
          parks: "#0c3b26",
          parksStroke: "#105e3a",
          expressways: "#0ea5e9",
          expresswaysStroke: "#0369a1",
          streets: "#334155",
          route: "#f43f5e",
          gridColor: "rgba(14, 165, 233, 0.05)"
        };
      case "traffic":
      case "standard":
      default:
        return {
          sea: "#ccdbee",
          land: "#f6f5f1",
          landStroke: "#e2dacf",
          sentosa: "#eae8e0",
          reservoirs: "#b8d0eb",
          parks: "#d1ebd6",
          parksStroke: "#a2dbaa",
          expressways: "#fcd34d",
          expresswaysStroke: "#d97706",
          streets: "#ffffff",
          route: "#2563eb",
          gridColor: "rgba(219,39,119,0.03)"
        };
    }
  };

  const layerColors = getLayerColors();

  return (
    <div className="space-y-4">
      {/* STYLE FOR DASHED LINE ANIMATION */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes routeFlow {
          to {
            stroke-dashoffset: -20;
          }
        }
        .animate-route {
          animation: routeFlow 1.2s linear infinite;
        }
      `}} />

      {/* HEADER ROW */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 border-b border-pink-100 pb-3">
        <div>
          <h2 className="font-display text-lg font-black text-stone-800 flex items-center gap-1.5">
            <Compass className="w-5 h-5 text-pink-600 animate-spin-slow" /> Interactive Singapore Nail Map
          </h2>
          <p className="text-[11px] text-stone-500">
            Compare live price tags on the map, match bespoke services, and contact salons instantly via WhatsApp or Instagram.
          </p>
        </div>
        
        {/* GPS location and toggle source selector */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Map Source Toggle Switch */}
          <div className="flex bg-stone-100 p-1 rounded-xl border border-stone-200">
            <button
              onClick={() => {
                setMapSource("clone");
                triggerToast("🗺️ Map view: Google Maps Clone Mode");
              }}
              className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition-all ${
                mapSource === "clone" ? "bg-white text-stone-800 shadow-xs" : "text-stone-500 hover:text-stone-700"
              }`}
            >
              Google Map Clone
            </button>
            <button
              onClick={() => {
                setMapSource("google");
                triggerToast("🌐 Map view: Live Google Maps (API Required)");
              }}
              className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition-all ${
                mapSource === "google" ? "bg-white text-stone-800 shadow-xs" : "text-stone-500 hover:text-stone-700"
              }`}
            >
              Live Google Maps
            </button>
          </div>

          <button
            onClick={handleFindMyLocation}
            disabled={isLocating}
            className="px-3 py-1.5 rounded-xl border border-pink-100 bg-white hover:bg-pink-50 text-pink-600 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-xs"
          >
            <Navigation className={`w-3 h-3 ${isLocating ? "animate-pulse" : ""}`} />
            <span>{isLocating ? "Locating..." : "Sync GPS Location"}</span>
          </button>
          <div className="text-[9px] bg-stone-900 text-stone-200 px-2 py-1 rounded-md font-mono">
            Somerset, SG: {userLocation.lat.toFixed(4)}°N, {userLocation.lng.toFixed(4)}°E
          </div>
        </div>
      </div>

      {/* TOP COMPONENT: DESIGN STYLE BUILDER SECTOR */}
      <div className="bg-white border border-pink-150 rounded-2xl p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-stone-100 pb-2">
          <div className="flex items-center gap-1.5">
            <Scissors className="w-4 h-4 text-pink-500" />
            <span className="text-[11px] uppercase tracking-wider font-extrabold text-stone-700">1. Define Desired Style Category (AI Lookups)</span>
          </div>
          <span className="text-[9px] text-stone-400 font-mono">Quotes update dynamically</span>
        </div>

        {/* Builder Matrix Selectors */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
          <div>
            <label className="block text-[9px] font-bold text-stone-400 uppercase tracking-wider mb-1">Shape</label>
            <select 
              value={selectedShape}
              onChange={(e) => { setSelectedShape(e.target.value); }}
              className="w-full bg-stone-50 border border-stone-200 rounded-lg p-1.5 text-stone-700 text-[11px] focus:outline-none focus:ring-1 focus:ring-pink-300"
            >
              {["Coffin", "Almond", "Square", "Round", "Stiletto"].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-[9px] font-bold text-stone-400 uppercase tracking-wider mb-1">Length</label>
            <select 
              value={selectedLength}
              onChange={(e) => { setSelectedLength(e.target.value); }}
              className="w-full bg-stone-50 border border-stone-200 rounded-lg p-1.5 text-stone-700 text-[11px] focus:outline-none focus:ring-1 focus:ring-pink-300"
            >
              {["Short", "Medium", "Long", "Extra Long"].map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-[9px] font-bold text-stone-400 uppercase tracking-wider mb-1">Design Complexity</label>
            <select 
              value={selectedComplexity}
              onChange={(e) => { setSelectedComplexity(e.target.value); }}
              className="w-full bg-stone-50 border border-stone-200 rounded-lg p-1.5 text-stone-700 text-[11px] focus:outline-none focus:ring-1 focus:ring-pink-300"
            >
              {["Simple", "Medium", "Complex", "High Luxury 3D"].map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-[9px] font-bold text-stone-400 uppercase tracking-wider mb-1">Treatment Type</label>
            <select 
              value={selectedType}
              onChange={(e) => { setSelectedType(e.target.value); }}
              className="w-full bg-stone-50 border border-stone-200 rounded-lg p-1.5 text-stone-700 text-[11px] focus:outline-none focus:ring-1 focus:ring-pink-300"
            >
              {["Gel Manicure", "Gel-X Extensions", "Sculptured Acrylics", "Japanese Jelly Set"].map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>

        {/* Search Input Bar & preset buttons */}
        <div className="flex flex-col sm:flex-row gap-2 pt-1">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input 
              type="text"
              value={customSearchText || selectedStyleQuery}
              onChange={(e) => {
                setCustomSearchText(e.target.value);
                setSelectedStyleQuery(e.target.value);
              }}
              placeholder="Search or edit custom query string..."
              className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 font-medium focus:outline-none focus:border-pink-500"
            />
          </div>
          <button
            onClick={handleApplyBuilder}
            className="px-5 py-2 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Generate Quotes</span>
          </button>
        </div>

        {/* Quick presets buttons */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-stone-100">
          <span className="text-[9px] text-stone-400 font-bold uppercase mr-1">Aesthetic Presets:</span>
          {STYLES_PRESETS.map((p) => {
            const isActive = selectedStyleQuery.toLowerCase() === p.desc.toLowerCase();
            return (
              <button
                key={p.id}
                onClick={() => {
                  setSelectedStyleQuery(p.desc);
                  setCustomSearchText("");
                  triggerToast(`Selected: "${p.label}"`);
                }}
                className={`px-2.5 py-1 rounded-full text-[10px] font-semibold border transition-all ${
                  isActive 
                    ? "bg-pink-100 border-pink-300 text-pink-700 font-bold"
                    : "bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100"
                }`}
              >
                {p.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* MOBILE TAB CONTROLLER */}
      <div className="flex lg:hidden bg-stone-100 p-1 rounded-xl border border-stone-200 w-full shrink-0">
        <button
          onClick={() => setMobileView("map")}
          className={`flex-1 py-1.5 text-xs font-extrabold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            mobileView === "map" ? "bg-white text-pink-600 shadow-xs" : "text-stone-500"
          }`}
        >
          <Compass className="w-3.5 h-3.5" /> Interactive Map
        </button>
        <button
          onClick={() => setMobileView("list")}
          className={`flex-1 py-1.5 text-xs font-extrabold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            mobileView === "list" ? "bg-white text-pink-600 shadow-xs" : "text-stone-500"
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" /> Salon Lists ({filteredSalons.length})
        </button>
      </div>

      {/* DUAL COLUMN PORTAL CONTAINER (H: 580px) */}
      <div className="bg-stone-100 rounded-3xl border border-pink-100/60 shadow-md overflow-hidden grid grid-cols-1 lg:grid-cols-12 h-[580px] relative">
        
        {/* PANEL A: SALONS SCROLLABLE LISTING & FILTERS (4 Columns) */}
        <div className={`lg:col-span-4 border-r border-pink-100/50 flex flex-col h-full bg-white ${
          mobileView === "map" ? "hidden lg:flex" : "flex"
        }`}>
          {/* List Search & Collapsible Filters */}
          <div className="p-3 border-b border-stone-100 space-y-2 bg-stone-50/50 shrink-0">
            <div className="flex gap-1.5">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400" />
                <input
                  type="text"
                  placeholder="Filter by name/address..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-stone-200 rounded-lg pl-7 pr-2 py-1 text-[11px] focus:outline-none focus:border-pink-400"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-2 py-1 rounded-lg border text-[10px] font-bold flex items-center gap-1 transition ${
                  showFilters ? "bg-pink-50 border-pink-300 text-pink-600" : "bg-white border-stone-200 text-stone-600 hover:bg-stone-50"
                }`}
              >
                <SlidersHorizontal className="w-3 h-3" />
                <span>Filters</span>
              </button>
            </div>

            {showFilters && (
              <div className="p-2 bg-white rounded-lg border border-stone-150 space-y-2 text-[10px] animate-fade-in shadow-xs">
                {/* Distance range */}
                <div className="space-y-1">
                  <div className="flex justify-between font-bold text-stone-500">
                    <span>Radius limit:</span>
                    <span className="text-pink-600 font-mono">{maxDistanceKM} km</span>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="30"
                    value={maxDistanceKM}
                    onChange={(e) => setMaxDistanceKM(Number(e.target.value))}
                    className="w-full h-1 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-pink-500"
                  />
                </div>

                {/* Districts */}
                <div className="space-y-1">
                  <label className="block font-bold text-stone-500 uppercase tracking-wider text-[9px]">District</label>
                  <select
                    value={selectedDistrict}
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded p-1 text-[10px] focus:outline-none focus:border-pink-400 text-stone-700"
                  >
                    {SG_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>
            )}

            {/* List Header Sorters */}
            <div className="flex items-center justify-between text-[10px] pt-1">
              <span className="text-stone-400 font-bold uppercase tracking-wider">Salons Sorted by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent border-0 text-pink-600 font-bold p-0 cursor-pointer text-[10.5px] focus:ring-0 focus:outline-none"
              >
                <option value="price_low_high">💸 Lowest Price</option>
                <option value="price_high_low">💎 Highest Price</option>
                <option value="distance">📍 Distance (KM)</option>
                <option value="rating">⭐️ Customer Rating</option>
              </select>
            </div>
          </div>

          {/* LIST BOX */}
          <div className="flex-1 overflow-y-auto p-2 space-y-2 bg-stone-50/20 scrollbar-thin">
            {isLoading ? (
              <div className="py-24 flex flex-col items-center justify-center space-y-2">
                <div className="w-8 h-8 rounded-full border-2 border-pink-100 border-t-pink-500 animate-spin" />
                <span className="text-[10px] text-stone-400 uppercase tracking-wider font-bold">Quoting Singapore rates...</span>
              </div>
            ) : filteredSalons.length > 0 ? (
              filteredSalons.map((salon) => {
                const isSelected = selectedSalonId === salon.id;
                const badges = getPriceBadgeStyle(salon.estimatedPrice);
                return (
                  <div
                    key={salon.id}
                    onClick={() => {
                      setSelectedSalonId(salon.id);
                      if (window.innerWidth < 1024) {
                        setMobileView("map");
                      }
                    }}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all duration-150 relative overflow-hidden group ${
                      isSelected
                        ? "bg-pink-50/45 border-pink-500 shadow-xs animate-pulse-subtle"
                        : "bg-white border-stone-200 hover:border-pink-200 hover:bg-stone-50"
                    }`}
                  >
                    {/* Trip.com pricing bubble overlay on item list */}
                    <div className="absolute top-2.5 right-2.5">
                      <span className={`px-2 py-0.5 rounded-lg font-mono font-extrabold text-[10.5px] tracking-tight block ${badges.bg}`}>
                        S${salon.estimatedPrice}
                      </span>
                    </div>

                    <div className="pr-16 space-y-1">
                      <h4 className="font-display font-extrabold text-[11.5px] text-stone-800 group-hover:text-pink-600 transition truncate">
                        {salon.name}
                      </h4>
                      <p className="text-[9.5px] text-pink-600/90 font-mono font-bold uppercase tracking-wider">
                        {salon.district} • {salon.vibe}
                      </p>
                      
                      <div className="flex items-center gap-1 text-[10px] text-amber-500 font-bold">
                        <Star className="w-3 h-3 fill-amber-400 stroke-amber-500" />
                        <span>{salon.rating}</span>
                        <span className="text-stone-300">({salon.reviewsCount} reviews)</span>
                        <span className="text-stone-300">•</span>
                        <span className="text-stone-500 font-sans font-normal">{salon.distance} km away</span>
                      </div>

                      <p className="text-[9px] text-stone-400 truncate mt-0.5 font-sans">
                        {salon.address}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-24 text-center text-[10.5px] text-stone-400">
                No salons match these active radius or district filters. <br />
                <button 
                  onClick={() => { setMaxDistanceKM(30); setSelectedDistrict("All Districts"); setSearchQuery(""); }} 
                  className="text-pink-600 underline font-bold mt-2"
                >
                  Reset Map Filters
                </button>
              </div>
            )}
          </div>
        </div>

        {/* PANEL B: GEOGRAPHIC VECTOR MAP / LIVE GOOGLE MAP (8 Columns) */}
        <div className={`lg:col-span-8 bg-stone-50 flex flex-col h-full relative ${
          mobileView === "list" ? "hidden lg:flex" : "flex"
        }`}>

          {mapSource === "google" ? (
            /* --- LIVE GOOGLE MAPS COMPONENT VIEW --- */
            <div className="w-full flex-1 relative flex flex-col">
              {!hasValidKey ? (
                /* Splash Setup Instruction Screen when secret key is missing */
                <div className="flex-1 flex items-center justify-center bg-stone-900 text-white p-6 text-center select-text">
                  <div className="max-w-md bg-stone-800 p-6 rounded-2xl border border-stone-700 shadow-xl space-y-4">
                    <MapIcon className="w-12 h-12 text-pink-500 animate-pulse mx-auto" />
                    <h3 className="font-display font-black text-lg">Google Maps API Key Required</h3>
                    <p className="text-stone-300 text-xs leading-relaxed">
                      To run the <strong>Live Google Maps Platform SDK</strong> inside this workspace, please configure your API credentials.
                    </p>
                    
                    <div className="text-left bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-2 text-[11px] font-sans">
                      <p><strong>Step 1:</strong> <a href="https://console.cloud.google.com/google/maps-apis/start?utm_campaign=gmp-code-assist-ais" target="_blank" rel="noopener noreferrer" className="text-pink-400 underline font-bold">Get a Google Maps API Key</a></p>
                      <p><strong>Step 2:</strong> Add your key as a secret:</p>
                      <ul className="list-disc pl-5 text-stone-400 space-y-1 mt-1">
                        <li>Open <strong>Settings</strong> (⚙️ gear icon, top-right corner)</li>
                        <li>Select <strong>Secrets</strong></li>
                        <li>Type <code className="bg-stone-800 text-pink-300 px-1.5 py-0.5 rounded font-mono font-bold">GOOGLE_MAPS_PLATFORM_KEY</code> as the secret name</li>
                        <li>Paste your API key and press <strong>Enter</strong></li>
                      </ul>
                    </div>

                    <p className="text-[10px] text-stone-500">
                      Or toggle back to <strong>"Google Map Clone"</strong> above to enjoy the fully local high-fidelity vector simulation instantly!
                    </p>

                    <button
                      onClick={() => setMapSource("clone")}
                      className="px-4 py-2 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all"
                    >
                      Back to Google Map Clone
                    </button>
                  </div>
                </div>
              ) : (
                /* Renders actual React Google Maps platform */
                <div className="w-full flex-1 relative" style={{ height: "100%" }}>
                  <APIProvider apiKey={API_KEY} version="weekly">
                    <Map
                      defaultCenter={userLocation}
                      defaultZoom={12}
                      mapId="DEMO_MAP_ID"
                      internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
                      style={{ width: '100%', height: '100%' }}
                    >
                      {/* User GPS Pin marker */}
                      <AdvancedMarker position={userLocation} title="My Location">
                        <Pin background="#2563eb" border="#ffffff" glyphColor="#fff" />
                      </AdvancedMarker>

                      {/* Salon pins showing pricing tags */}
                      {filteredSalons.map((salon) => {
                        const isSelected = selectedSalonId === salon.id;
                        const badges = getPriceBadgeStyle(salon.estimatedPrice);
                        return (
                          <AdvancedMarker 
                            key={salon.id} 
                            position={{ lat: salon.latitude, lng: salon.longitude }}
                            onClick={() => setSelectedSalonId(salon.id)}
                          >
                            <div className={`px-2 py-1 rounded font-mono font-bold text-xs border shadow-md transition-all whitespace-nowrap cursor-pointer ${
                              isSelected ? "bg-stone-900 text-white border-pink-500 scale-110" : `${badges.bg}`
                            }`}>
                              S${salon.estimatedPrice}
                            </div>
                          </AdvancedMarker>
                        );
                      })}
                    </Map>
                  </APIProvider>
                </div>
              )}
            </div>
          ) : (
            /* --- GOOGLE MAPS HIGH-FIDELITY INTERACTIVE CLONE (SVG VECTOR ENGINE) --- */
            <div 
              ref={mapContainerRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onDoubleClick={handleMapDoubleClick}
              className={`w-full flex-1 relative overflow-hidden select-none border-b border-stone-200/50 cursor-grab ${
                isDragging ? "cursor-grabbing" : ""
              }`}
              style={{ backgroundColor: layerColors.sea }}
            >
              {/* VECTOR GEOGRAPHY LAYER */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                <defs>
                  {/* Grid Lines Pattern */}
                  <pattern id="gmap-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke={layerColors.gridColor} strokeWidth="1" />
                  </pattern>
                  {/* Land Gradient for Realistic Coastal look */}
                  <linearGradient id="landGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={layerColors.land} />
                    <stop offset="100%" stopColor={mapLayer === "satellite" ? "#182c47" : "#ebe5da"} />
                  </linearGradient>
                </defs>
                
                {/* Grid Overlay */}
                <rect width="100%" height="100%" fill="url(#gmap-grid)" />

                {/* 1. Mainland Coastline Vector (Zooms and pans mathematically!) */}
                <polygon 
                  points={formatPoints(SG_COASTLINE_GPS)} 
                  fill="url(#landGrad)" 
                  stroke={layerColors.landStroke} 
                  strokeWidth="2" 
                  opacity="0.95"
                />

                {/* 2. Sentosa Island Vector */}
                <polygon 
                  points={formatPoints(SENTOSA_GPS)} 
                  fill={layerColors.sentosa} 
                  stroke={layerColors.landStroke} 
                  strokeWidth="1.5" 
                />

                {/* 3. Green Reserves & Parks (MacRitchie Reservoir, Botanic Gardens, East Coast Park) */}
                <polygon 
                  points={formatPoints(BOTANIC_GPS)} 
                  fill={layerColors.parks} 
                  stroke={layerColors.parksStroke} 
                  strokeWidth="1" 
                />
                <polygon 
                  points={formatPoints(EAST_COAST_GPS)} 
                  fill={layerColors.parks} 
                  stroke={layerColors.parksStroke} 
                  strokeWidth="1" 
                />

                {/* 4. Reservoirs (Water inclusions) */}
                <polygon 
                  points={formatPoints(MACRITCHIE_GPS)} 
                  fill={layerColors.sea} 
                  stroke={layerColors.landStroke} 
                  strokeWidth="0.8" 
                />
                <polygon 
                  points={formatPoints(MARINA_BAY_GPS)} 
                  fill={layerColors.sea} 
                  stroke={layerColors.landStroke} 
                  strokeWidth="0.8" 
                />

                {/* 5. Major Expressways (Double stroked lines for authentic look) */}
                {EXPRESSWAYS.map((exp) => {
                  const pointsStr = formatPoints(exp.points);
                  
                  // In Traffic Mode, draw live speeds (Green = Fast, Red = Heavy jam, Orange = Moderate)
                  let trafficColor = layerColors.expressways;
                  if (mapLayer === "traffic") {
                    if (exp.traffic === "heavy") trafficColor = "#ef4444"; // red
                    else if (exp.traffic === "moderate") trafficColor = "#f97316"; // orange
                    else trafficColor = "#22c55e"; // green
                  }

                  return (
                    <g key={exp.id}>
                      {/* Underlay casing line */}
                      <polyline 
                        points={pointsStr} 
                        fill="none" 
                        stroke={mapLayer === "satellite" ? layerColors.expresswaysStroke : "#e2dacf"} 
                        strokeWidth="5" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                      />
                      {/* Core expressway line */}
                      <polyline 
                        points={pointsStr} 
                        fill="none" 
                        stroke={trafficColor} 
                        strokeWidth="3.2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                      />
                    </g>
                  );
                })}

                {/* 6. Orchard Road Shopping Street Boulevard line */}
                <polyline
                  points={formatPoints([
                    { lat: 1.3048, lng: 103.831 },
                    { lat: 1.3000, lng: 103.843 }
                  ])}
                  fill="none"
                  stroke={mapLayer === "satellite" ? "#475569" : "#ffffff"}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />

                {/* 7. Active GPS Navigation Route Line! Flows dynamically to Selected Salon */}
                {activeSalon && (
                  <path
                    d={`M ${gpsToSvgCoords(userLocation.lat, userLocation.lng).x} ${gpsToSvgCoords(userLocation.lat, userLocation.lng).y} 
                        Q ${(gpsToSvgCoords(userLocation.lat, userLocation.lng).x + gpsToSvgCoords(activeSalon.latitude, activeSalon.longitude).x) / 2 + 30} 
                          ${(gpsToSvgCoords(userLocation.lat, userLocation.lng).y + gpsToSvgCoords(activeSalon.latitude, activeSalon.longitude).y) / 2 - 40}
                          ${gpsToSvgCoords(activeSalon.latitude, activeSalon.longitude).x} ${gpsToSvgCoords(activeSalon.latitude, activeSalon.longitude).y}`}
                    fill="none"
                    stroke={layerColors.route}
                    strokeWidth="3.5"
                    strokeDasharray="6,4"
                    className="animate-route"
                  />
                )}
              </svg>

              {/* FLOATING GOOGLE MAP HUD CARD (Top-left Over the map) */}
              <div className="absolute top-3 left-3 z-30 max-w-xs w-[280px] bg-white rounded-2xl shadow-xl border border-stone-200/80 p-2.5 space-y-2 pointer-events-auto">
                <div className="relative flex items-center bg-stone-100 rounded-xl px-2.5 py-1.5 border border-stone-200">
                  <Search className="w-4 h-4 text-stone-400 shrink-0" />
                  <input
                    type="text"
                    readOnly
                    value={selectedStyleQuery}
                    className="w-full bg-transparent pl-2 text-[11px] text-stone-800 font-medium focus:outline-none placeholder-stone-400 select-all"
                  />
                  <span className="text-[10px] text-stone-400 cursor-default px-1 font-semibold border-l border-stone-300 ml-1 shrink-0">SG</span>
                </div>
                
                {/* Quick Map Overlay Controls */}
                <div className="flex items-center justify-between pt-1 border-t border-stone-100 text-[10px]">
                  <div className="flex gap-1.5">
                    <button 
                      onClick={() => {
                        setShowMRT(!showMRT);
                        triggerToast(showMRT ? "Hidden transit MRT stations" : "Displayed Singapore MRT overlay");
                      }}
                      className={`px-2 py-0.5 rounded-md font-bold transition ${
                        showMRT ? "bg-blue-50 text-blue-600 border border-blue-100" : "bg-stone-50 text-stone-500 border border-stone-150"
                      }`}
                    >
                      🚇 Transit
                    </button>
                    <button 
                      onClick={() => {
                        setShowLandmarks(!showLandmarks);
                        triggerToast(showLandmarks ? "Hidden landmark highlights" : "Displayed landmarks");
                      }}
                      className={`px-2 py-0.5 rounded-md font-bold transition ${
                        showLandmarks ? "bg-rose-50 text-rose-600 border border-rose-100" : "bg-stone-50 text-stone-500 border border-stone-150"
                      }`}
                    >
                      🎪 Attractions
                    </button>
                  </div>
                  
                  <span className="text-[9px] text-stone-400 font-mono italic">Zoom: {zoom}x</span>
                </div>
              </div>

              {/* LANDMARKS & ATTRACTIVE SYMBOLS ON MAP */}
              {showLandmarks && LANDMARKS.map((land, i) => {
                const coords = gpsToSvgCoords(land.lat, land.lng);
                return (
                  <div
                    key={i}
                    className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-all duration-300 flex flex-col items-center"
                    style={{ left: `${coords.x}px`, top: `${coords.y}px` }}
                  >
                    <div className="text-sm drop-shadow-sm filter select-none">{land.emoji}</div>
                    <span className={`text-[8px] font-bold px-1 py-0.2 rounded shadow-xs border ${
                      mapLayer === "satellite" 
                        ? "bg-stone-900/90 text-sky-300 border-stone-800" 
                        : "bg-white/80 text-stone-600 border-stone-150"
                    } whitespace-nowrap`}>
                      {land.name}
                    </span>
                  </div>
                );
              })}

              {/* MRT TRANSIT OVERLAYS */}
              {showMRT && MRT_STATIONS.map((mrt, i) => {
                const coords = gpsToSvgCoords(mrt.lat, mrt.lng);
                return (
                  <div
                    key={i}
                    className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-all duration-300 flex items-center gap-1 bg-stone-900/95 text-[7.5px] font-black text-emerald-400 px-1 py-0.5 rounded shadow-xs"
                    style={{ left: `${coords.x}px`, top: `${coords.y}px` }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 block animate-pulse" />
                    <span>Ⓜ️ {mrt.name}</span>
                  </div>
                );
              })}

              {/* PULSING COMPASS ACTIVE SELECTION RADAR */}
              {activeSalon && (() => {
                const coords = gpsToSvgCoords(activeSalon.latitude, activeSalon.longitude);
                return (
                  <div 
                    className="absolute w-28 h-28 bg-pink-500/10 rounded-full border-2 border-pink-500/20 animate-ping pointer-events-none -translate-x-1/2 -translate-y-1/2 transition-all duration-300 z-10"
                    style={{ left: `${coords.x}px`, top: `${coords.y}px` }}
                  />
                );
              })()}

              {/* MY USER CURRENT GPS LOCATION MARKER */}
              {(() => {
                const coords = gpsToSvgCoords(userLocation.lat, userLocation.lng);
                return (
                  <div 
                    className="absolute cursor-default -translate-x-1/2 -translate-y-1/2 z-30 flex flex-col items-center"
                    style={{ left: `${coords.x}px`, top: `${coords.y}px` }}
                  >
                    <div className="w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-md relative flex items-center justify-center">
                      <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping scale-150 opacity-40" />
                      <span className="text-[7px] text-white font-extrabold font-sans">ME</span>
                    </div>
                    <span className="text-[7.5px] font-extrabold text-blue-700 bg-white/95 border border-blue-200 rounded px-1.5 mt-0.5 whitespace-nowrap shadow-md">
                      Current Location
                    </span>
                  </div>
                );
              })()}

              {/* TRIP.COM PRICE BUBBLES PIN TAGS (COMPATIBLE WITH ZOOM) */}
              {filteredSalons.map((salon) => {
                const isSelected = selectedSalonId === salon.id;
                const coords = gpsToSvgCoords(salon.latitude, salon.longitude);
                const badges = getPriceBadgeStyle(salon.estimatedPrice);
                
                return (
                  <div
                    key={salon.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedSalonId(salon.id);
                    }}
                    className="absolute cursor-pointer -translate-x-1/2 -translate-y-1/2 transition-all duration-200 z-20 hover:z-25 group pointer-events-auto"
                    style={{ left: `${coords.x}px`, top: `${coords.y}px` }}
                  >
                    {/* Trip.com-style pricing label */}
                    <div 
                      className={`px-2.5 py-0.5 rounded-full border shadow-md font-mono font-black text-[11px] transition-all duration-150 flex items-center gap-1.5 whitespace-nowrap ${
                        isSelected 
                          ? "bg-stone-900 border-pink-500 text-white scale-110 ring-2 ring-pink-400/35" 
                          : `${badges.bg} hover:scale-105`
                      }`}
                    >
                      {/* Tiny pulsing status dot based on tier color */}
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                      <span>S${salon.estimatedPrice}</span>
                    </div>

                    {/* Downward pointer triangle */}
                    <div 
                      className="w-2 rotate-45 mx-auto -mt-1 border-r border-b transition-all" 
                      style={{ 
                        width: "8px",
                        height: "8px",
                        backgroundColor: isSelected ? "#1c1917" : (salon.estimatedPrice <= 70 ? "#059669" : salon.estimatedPrice <= 120 ? "#d97706" : salon.estimatedPrice <= 180 ? "#e11d48" : "#6b21a8"),
                        borderColor: isSelected ? "#ec4899" : "transparent"
                      }}
                    />
                    
                    {/* Tooltip on hover showing salon name */}
                    <div className="absolute top-[-26px] left-1/2 -translate-x-1/2 scale-0 group-hover:scale-100 bg-stone-900 text-white text-[8px] font-bold px-1.5 py-0.5 rounded shadow-md transition-all whitespace-nowrap">
                      {salon.name}
                    </div>
                  </div>
                );
              })}

              {/* LAYER VIEW & MAP UTILITY TOGGLES (Floating Bottom Left) */}
              <div className="absolute bottom-3 left-3 flex flex-col gap-1.5 z-30 pointer-events-auto bg-white/95 backdrop-blur-md rounded-2xl p-2 border border-stone-200 shadow-lg text-[9px] font-semibold text-stone-500">
                <div className="text-[8px] font-bold uppercase tracking-wider text-stone-400 border-b border-stone-100 pb-1 flex items-center gap-1">
                  <Layers className="w-3 h-3 text-stone-500" /> <span>Map Layers</span>
                </div>
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => {
                      setMapLayer("standard");
                      triggerToast("Switched to Standard Road Map");
                    }}
                    className={`px-2 py-1 rounded text-left transition ${
                      mapLayer === "standard" ? "bg-stone-100 text-stone-900 font-bold" : "hover:bg-stone-50"
                    }`}
                  >
                    🗺️ Standard View
                  </button>
                  <button
                    onClick={() => {
                      setMapLayer("satellite");
                      triggerToast("Switched to Satellite Imagery");
                    }}
                    className={`px-2 py-1 rounded text-left transition ${
                      mapLayer === "satellite" ? "bg-stone-100 text-stone-900 font-bold" : "hover:bg-stone-50"
                    }`}
                  >
                    🛰️ Satellite Earth
                  </button>
                  <button
                    onClick={() => {
                      setMapLayer("traffic");
                      triggerToast("Switched to Live Traffic speed flow");
                    }}
                    className={`px-2 py-1 rounded text-left transition ${
                      mapLayer === "traffic" ? "bg-stone-100 text-stone-900 font-bold" : "hover:bg-stone-50"
                    }`}
                  >
                    🚦 Live Traffic Flow
                  </button>
                </div>
              </div>

              {/* ZOOM CONTROLS HUD (Floating Bottom Right) */}
              <div className="absolute bottom-3 right-3 flex flex-col gap-1 z-30 pointer-events-auto">
                <div className="flex flex-col bg-white rounded-xl shadow-lg border border-stone-200 overflow-hidden">
                  <button 
                    onClick={() => {
                      if (zoom < 16) {
                        setZoom(prev => prev + 1);
                        triggerToast("Zoomed in");
                      }
                    }}
                    className="p-2 hover:bg-stone-50 text-stone-600 transition border-b border-stone-200"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => {
                      if (zoom > 10) {
                        setZoom(prev => prev - 1);
                        triggerToast("Zoomed out");
                      }
                    }}
                    className="p-2 hover:bg-stone-50 text-stone-600 transition"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                </div>
                
                {/* Reset Center control */}
                <button
                  onClick={() => {
                    setZoom(12);
                    setPanOffset({ x: 0, y: 0 });
                    triggerToast("Recentered Singapore Map view");
                  }}
                  className="p-2 bg-white rounded-xl shadow-lg border border-stone-200 text-stone-600 hover:bg-stone-50 transition"
                  title="Recenter Map"
                >
                  <Compass className="w-4 h-4 text-pink-600" />
                </button>
              </div>

              {/* INTRODUCTORY GUIDE DIALOG */}
              {salons.length === 0 && (
                <div className="absolute inset-0 bg-stone-950/60 flex items-center justify-center p-4 z-40">
                  <div className="bg-white rounded-2xl p-6 text-center max-w-sm space-y-4 shadow-xl border border-pink-100 animate-scale-up">
                    <Sparkles className="w-10 h-10 text-pink-500 animate-bounce mx-auto" />
                    <h3 className="font-display font-extrabold text-stone-800 text-sm">Quote the Singapore Nail Map!</h3>
                    <p className="text-[11px] text-stone-500 leading-relaxed">
                      Choose or build your custom look in the style selector above, then click "Generate Quotes" to query local studios near you.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ACTIVE SALON DETAILS DRAWER: FLOATS OVER BOTTOM HALF */}
          {activeSalon && (
            <div className="p-4 bg-white border-t border-pink-100 shadow-lg relative flex flex-col md:flex-row gap-4 max-h-[250px] overflow-y-auto shrink-0 z-10 animate-slide-up">
              
              {/* Profile Details Column */}
              <div className="md:w-1/2 space-y-2 text-left">
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <h3 className="font-display font-black text-sm text-stone-800 flex items-center gap-1.5">
                      {activeSalon.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-[10px] text-amber-500 font-extrabold mt-0.5">
                      <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-500" />
                      <span>{activeSalon.rating}</span>
                      <span className="text-stone-400">({activeSalon.reviewsCount} reviews)</span>
                      <span className="text-stone-300">•</span>
                      <span className="text-pink-600 font-mono font-bold uppercase">{activeSalon.district}</span>
                    </div>
                  </div>
                  <div className="px-2.5 py-1 bg-pink-50 border border-pink-100 rounded-lg text-center font-mono">
                    <span className="block text-[8px] uppercase font-bold text-stone-400 leading-none">Est. Quote</span>
                    <strong className="text-sm font-black text-pink-600">S${activeSalon.estimatedPrice}</strong>
                  </div>
                </div>

                <div className="text-[11px] space-y-1.5 text-stone-600">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span className="truncate">{activeSalon.address}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span>{activeSalon.hours}</span>
                  </div>
                  <div className="text-[10px] text-pink-600 font-semibold bg-pink-50 px-2 py-0.5 rounded-md inline-block">
                    🌈 Vibe: {activeSalon.vibe}
                  </div>
                </div>

                {/* Direct Contact Action Row */}
                <div className="border-t border-stone-100 pt-2 space-y-1.5">
                  <span className="block text-[9px] uppercase font-bold text-stone-400">📲 Direct Salon Contact channels</span>
                  <div className="grid grid-cols-2 gap-2">
                    {/* WhatsApp DM Button */}
                    <a 
                      href={`${activeSalon.whatsapp}?text=${encodeURIComponent(activeSalon.aiConsultationMsg || "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10.5px] font-bold transition-all flex items-center justify-center gap-1 shadow-xs"
                      title="Direct Chat on WhatsApp"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>WhatsApp Chat</span>
                    </a>

                    {/* Instagram Profile DM Helper */}
                    <a 
                      href={activeSalon.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => {
                        navigator.clipboard.writeText(activeSalon.aiConsultationMsg || "");
                        triggerToast("📋 Copied custom IG introduction template to clipboard!");
                      }}
                      className="px-3 py-1.5 bg-pink-600 hover:bg-pink-700 text-white rounded-lg text-[10.5px] font-bold transition-all flex items-center justify-center gap-1 shadow-xs"
                      title="Direct Message on Instagram"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Instagram DM</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* AI-tailored Treatment Menu column */}
              <div className="md:w-1/2 flex flex-col justify-between bg-stone-50/70 p-3 rounded-xl border border-stone-200/50 text-left">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] uppercase tracking-wider font-extrabold text-pink-600 flex items-center gap-1 font-mono">
                      <Sparkles className="w-3 h-3 text-pink-500 animate-spin-slow" /> Match AI Custom Menu
                    </span>
                    <span className="text-[8.5px] font-mono text-stone-400">100% matched</span>
                  </div>
                  
                  <strong className="block text-[11px] font-extrabold text-stone-800 leading-tight">
                    {activeSalon.aiMatchedMenu || "Custom Designer Consultation Package"}
                  </strong>

                  {/* Dynamic menu steps checklist */}
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1 pt-1 border-t border-stone-200/50">
                    {(activeSalon.aiMenuDetails || [
                      "Full-service clean nail bed shaping & cuticle prep",
                      "Exclusive Japanese color syrup gel coatings",
                      "Nail-art design formulas matched precisely",
                      "Secure bonding of 3D decorative nail gems"
                    ]).map((detail, index) => (
                      <li key={index} className="flex items-start gap-1 text-[9px] text-stone-500 leading-tight">
                        <CheckCircle2 className="w-3 h-3 text-pink-500 shrink-0 mt-0.5" />
                        <span className="line-clamp-2">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Submit recipe formulas */}
                <div className="mt-3 flex items-center gap-2">
                  <button
                    onClick={handleInitiateBooking}
                    className="flex-1 py-1.5 bg-stone-900 hover:bg-stone-850 text-white rounded-lg text-[10.5px] font-extrabold uppercase tracking-wide transition flex items-center justify-center gap-1 shadow-xs"
                  >
                    <Send className="w-3 h-3 text-pink-400" />
                    <span>Submit Decals to Salon</span>
                  </button>
                  <button
                    onClick={() => handleCopyText(activeSalon.aiConsultationMsg || "", "msg")}
                    className="p-1.5 bg-white border border-stone-200 hover:bg-stone-50 rounded-lg text-stone-500 hover:text-stone-700 transition"
                    title="Copy outreach text template"
                  >
                    {copiedTextType === "msg" ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

              </div>

            </div>
          )}

        </div>

      </div>

      {/* TRANSMITTING MODAL OVERLAYS */}
      {bookingStep !== "none" && (
        <div className="fixed inset-0 bg-stone-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white border border-pink-100 rounded-3xl p-6 max-w-sm w-full space-y-5 relative overflow-hidden shadow-2xl text-center">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-pink-500 to-rose-600" />
            
            <button 
              onClick={() => setBookingStep("none")}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 p-1 rounded-full bg-stone-100 transition"
            >
              <X className="w-4 h-4" />
            </button>

            {bookingStep === "transmitting" && (
              <div className="text-center py-4 space-y-5 flex flex-col items-center justify-center">
                <div className="w-12 h-12 rounded-full border-4 border-stone-100 border-t-pink-500 animate-spin flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-pink-500 animate-pulse" />
                </div>
                
                <div className="space-y-1">
                  <h4 className="font-display font-extrabold text-stone-800 text-sm">Transmitting Recipes...</h4>
                  <p className="text-[11px] text-stone-500 max-w-xs leading-relaxed">
                    Uploading your customized 10-finger cropped canvas decals, color hex parameters, and real-time instructions over our secure salon API...
                  </p>
                </div>

                <div className="w-full bg-stone-50 p-2.5 rounded-lg border border-stone-200 text-[8.5px] font-mono text-left text-stone-400 space-y-1">
                  <div className="flex items-center justify-between">
                    <span>Converting canvas formula...</span>
                    <span className="text-green-600 font-bold">DONE</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Sending design pack to {activeSalon.name}...</span>
                    <span className="text-pink-500 animate-pulse font-bold">TRANSMITTING</span>
                  </div>
                </div>
              </div>
            )}

            {bookingStep === "confirmed" && (
              <div className="space-y-4 text-center">
                <div className="w-10 h-10 rounded-full bg-green-50 border border-green-500 flex items-center justify-center mx-auto text-green-600">
                  <Check className="w-5 h-5" />
                </div>
                
                <div className="space-y-1">
                  <h3 className="font-display font-black text-stone-800 text-sm">Recipe Formulated &amp; Transmitted!</h3>
                  <p className="text-[11px] text-stone-500 leading-relaxed">
                    Your custom 10-finger recipe was successfully submitted to the booking desk at <strong className="text-pink-600">{activeSalon.name}</strong>.
                  </p>
                </div>

                <div className="p-3 bg-pink-50 border border-pink-100 rounded-2xl font-mono space-y-2">
                  <span className="block text-[8px] uppercase tracking-wider font-extrabold text-stone-400">Digital Formula Ticket</span>
                  <strong className="block text-base font-extrabold text-pink-700 tracking-wider font-mono">{ticketCode}</strong>
                  <p className="text-[9px] text-stone-400 font-sans leading-tight">
                    Show this ticket upon arrival. The stylist will instantly retrieve your bespoke nail art configurations in the atelier workspace.
                  </p>
                </div>

                <button
                  onClick={() => setBookingStep("none")}
                  className="w-full py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition uppercase tracking-wider"
                >
                  Return to Nail Map
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
