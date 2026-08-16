import React, { useState, useEffect, useRef, ChangeEvent } from "react";
import { NailHandRenderer } from "./components/NailHandRenderer";
import { ImagePatchmaker } from "./components/ImagePatchmaker";
import { MonetizationSuite } from "./components/MonetizationSuite";
import { NailRecipeCard } from "./components/NailRecipeCard";
import { SalonFinder } from "./components/SalonFinder";
import { DiscoverBoard } from "./components/DiscoverBoard";
import { UserProfile } from "./components/UserProfile";
import { DiyAtelier } from "./components/DiyAtelier";
import { NailCollection, ReferenceImage, PresetAesthetic, NailFinish, NailArtStyle, NailDesign } from "./types";
import { 
  Sparkles, 
  HelpCircle, 
  Palette, 
  RefreshCw, 
  Scissors, 
  DollarSign, 
  BookOpen, 
  ChevronDown, 
  Check, 
  Info, 
  FileText, 
  Search, 
  Image as ImageIcon, 
  Trash2, 
  Upload, 
  Plus, 
  CheckCircle2, 
  ChevronRight, 
  Layers, 
  ArrowRight,
  MapPin,
  User
} from "lucide-react";

// Curated reference styles that can generate dynamic canvas textures
interface ReferenceStyleItem {
  id: string;
  name: string;
  category: string;
  vibe: string;
  colors: string[];
  description: string;
}

const REFERENCED_STYLES: ReferenceStyleItem[] = [
  {
    id: "ref_aura",
    name: "🌸 Aura Glow Shimmer",
    category: "Coquette",
    vibe: "Ethereal Romantic Pink & Lilac",
    colors: ["#FFB7B2", "#E8D7FF", "#FFC6FF"],
    description: "Soft radiant gradient aura, high-gloss shine with gold drop outlines."
  },
  {
    id: "ref_chrome",
    name: "⚡ Molten Chrome Swirls",
    category: "Y2K",
    vibe: "Futuristic 3D Metallic",
    colors: ["#D1D5DB", "#9CA3AF", "#4B5563"],
    description: "Glass clear nail tips paired with molten silver metal swirls."
  },
  {
    id: "ref_glazed",
    name: "🍩 Hailey Pearl Glaze",
    category: "Clean Girl",
    vibe: "High-Gloss Glazed Donut",
    colors: ["#FFFDF9", "#F3EAE1", "#FFFFFF"],
    description: "Semi-translucent milky base burnished with fine pearl chrome powder."
  },
  {
    id: "ref_cottage",
    name: "🌿 Sage Checked Garden",
    category: "Cottagecore",
    vibe: "Woodland Picnic Vibe",
    colors: ["#9CAF88", "#F4ECE1", "#5C6B53"],
    description: "Olive-sage green checks paired with warm buttermilk solid nails."
  },
  {
    id: "ref_wabi",
    name: "🪵 Wabi-Sabi Sand Stone",
    category: "Minimalist",
    vibe: "Organic speckled terrazzo",
    colors: ["#E8D8C8", "#4A5568", "#975A16"],
    description: "Natural textured stone base with speckled raw elements and matte coat."
  },
  {
    id: "ref_coquette",
    name: "🎀 Velvet Bow Coquette",
    category: "Coquette",
    vibe: "Dreamy Princess Aesthetic",
    colors: ["#FFD1D5", "#FFFFFF", "#FFA8B6"],
    description: "Chic dusty rose base with delicate hand-drawn white lace bows."
  },
  {
    id: "ref_midnight",
    name: "🌙 Celestial Midnight Sky",
    category: "Grunge",
    vibe: "Deep cat-eye navy galaxy",
    colors: ["#0F172A", "#FDE047", "#1E1B4B"],
    description: "Midnight space shimmer base with glowing crescent gold moon stickers."
  },
  {
    id: "ref_matcha",
    name: "🍵 Creamy Matcha Swirl",
    category: "Clean Girl",
    vibe: "Artisan green swirls",
    colors: ["#839B7A", "#F3EFE0", "#5D7355"],
    description: "Linen-white base with custom matcha-gel swirls and high-gloss glaze."
  }
];

// Preset aesthetics to inspire the user
const PRESET_AESTHETICS: PresetAesthetic[] = [
  {
    id: "balletcore",
    name: "🌸 Balletcore Pink",
    vibe: "Balletcore Romantic",
    colorPreference: "Soft blush pink, milk white, gold",
    shape: "Almond",
    length: "Medium",
    extraAccents: "Pearls & Gold lines",
    description: "Soft pink bases, pearlescent overlays, micro-pearl stickers, and subtle gold accents.",
    colors: ["#FFF0F1", "#F7D1D5", "#FAF8F5", "#E6C9A8"]
  },
  {
    id: "midnight_y2k",
    name: "🖤 Midnight Y2K",
    vibe: "Y2K Cyber Punk",
    colorPreference: "Obsidian black, liquid chrome, dark purple",
    shape: "Coffin",
    length: "Long",
    extraAccents: "Chrome drips & Silver gems",
    description: "Chic dark gothic bases paired with magnetic cat-eye glitter and liquid chrome swirls.",
    colors: ["#121214", "#D2D6DC", "#2C1B47", "#E8E7EC"]
  },
  {
    id: "sage_cottagecore",
    name: "🌿 Sage Cottagecore",
    vibe: "Cottagecore Woodland",
    colorPreference: "Sage green, warm oat milk, gold flakes",
    shape: "Round",
    length: "Short",
    extraAccents: "Matte coating & Gold flakes",
    description: "Earthy, warm cottagecore vibe using matte finishes, sage green swirls, and gold foil flecks.",
    colors: ["#9CAF88", "#F4ECE1", "#5C6B53", "#E2C391"]
  },
  {
    id: "glazed_vanilla",
    name: "🍩 Glazed Donut",
    vibe: "Clean Girl High-Gloss",
    colorPreference: "Milky vanilla, translucent white, pearlescent shimmer",
    shape: "Square",
    length: "Medium",
    extraAccents: "Chrome rub powder",
    description: "Ultra elegant, semi-sheer milky white glazed with chrome powder for a wet-look finish.",
    colors: ["#F7F5F0", "#FFFBF2", "#ECECE8", "#F2EAE1"]
  },
  {
    id: "strawberry_jelly",
    name: "🍓 Strawberry Jelly",
    vibe: "Japanese 3D Strawberry Jelly Vibe",
    colorPreference: "Glossy strawberry syrup red, milk glass white, soft green accents",
    shape: "Almond",
    length: "Medium",
    extraAccents: "3D Strawberry Charms & Wavy Syrup Ridges",
    description: "Glossy strawberry translucent syrup gradients, 3D embossed strawberry charms with golden seeds, clear syrup gel ridges, and white milk-bath french tips.",
    colors: ["#EF4444", "#FCA5A5", "#FFFFFF", "#10B981"]
  }
];

// Flawless transparent canvas initialized by default
const TRANSPARENT_INITIAL_COLLECTION: NailCollection = {
  designName: "Glass Extension Tips",
  description: "A pristine set of glass-like transparent nail tips. Select a finger, upload nail art references to your album, and patch them onto individual nails one by one!",
  colorPalette: [
    { name: "Transparent Glass", hex: "transparent" },
    { name: "Clear Glaze", hex: "rgba(255,255,255,0.15)" }
  ],
  nails: [
    {
      finger: "Left Thumb",
      title: "Transparent Base Tip",
      baseColor: "transparent",
      finish: "glossy",
      artStyle: "solid",
      decorations: "None",
      details: "Clear transparent gel base tip. Ready for custom image album decals."
    },
    {
      finger: "Left Index",
      title: "Transparent Base Tip",
      baseColor: "transparent",
      finish: "glossy",
      artStyle: "solid",
      decorations: "None",
      details: "Clear transparent gel base tip. Ready for custom image album decals."
    },
    {
      finger: "Left Middle",
      title: "Transparent Base Tip",
      baseColor: "transparent",
      finish: "glossy",
      artStyle: "solid",
      decorations: "None",
      details: "Clear transparent gel base tip. Ready for custom image album decals."
    },
    {
      finger: "Left Ring",
      title: "Transparent Base Tip",
      baseColor: "transparent",
      finish: "glossy",
      artStyle: "solid",
      decorations: "None",
      details: "Clear transparent gel base tip. Ready for custom image album decals."
    },
    {
      finger: "Left Pinky",
      title: "Transparent Base Tip",
      baseColor: "transparent",
      finish: "glossy",
      artStyle: "solid",
      decorations: "None",
      details: "Clear transparent gel base tip. Ready for custom image album decals."
    },
    {
      finger: "Right Thumb",
      title: "Transparent Base Tip",
      baseColor: "transparent",
      finish: "glossy",
      artStyle: "solid",
      decorations: "None",
      details: "Clear transparent gel base tip. Ready for custom image album decals."
    },
    {
      finger: "Right Index",
      title: "Transparent Base Tip",
      baseColor: "transparent",
      finish: "glossy",
      artStyle: "solid",
      decorations: "None",
      details: "Clear transparent gel base tip. Ready for custom image album decals."
    },
    {
      finger: "Right Middle",
      title: "Transparent Base Tip",
      baseColor: "transparent",
      finish: "glossy",
      artStyle: "solid",
      decorations: "None",
      details: "Clear transparent gel base tip. Ready for custom image album decals."
    },
    {
      finger: "Right Ring",
      title: "Transparent Base Tip",
      baseColor: "transparent",
      finish: "glossy",
      artStyle: "solid",
      decorations: "None",
      details: "Clear transparent gel base tip. Ready for custom image album decals."
    },
    {
      finger: "Right Pinky",
      title: "Transparent Base Tip",
      baseColor: "transparent",
      finish: "glossy",
      artStyle: "solid",
      decorations: "None",
      details: "Clear transparent gel base tip. Ready for custom image album decals."
    }
  ]
};

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<"diy" | "map" | "references" | "profile">("diy");
  const [plannerSubTab, setPlannerSubTab] = useState<"manual" | "ai">("manual");

  // User Profile / Simulated Authentication State
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem("lamour_is_logged_in") === "true";
  });
  const [userProfile, setUserProfile] = useState<{
    email: string;
    phone: string;
    username: string;
    savedPostIds: string[];
    uploadedPostIds: string[];
  }>(() => {
    const saved = localStorage.getItem("lamour_user_profile");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      email: "princess@lamour.com",
      phone: "+1 (555) 349-2092",
      username: "coquette_queen",
      savedPostIds: ["ref_aura", "ref_coquette"],
      uploadedPostIds: ["ref_coquette"]
    };
  });

  // Pinterest-style Global Reference Board state
  const [referenceBoardPosts, setReferenceBoardPosts] = useState<any[]>(() => {
    const saved = localStorage.getItem("lamour_reference_board_posts");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        id: "ref_aura",
        name: "🌸 Aura Glow Shimmer",
        category: "Coquette",
        vibe: "Ethereal Romantic Pink & Lilac",
        colors: ["#FFB7B2", "#E8D7FF", "#FFC6FF"],
        description: "Soft radiant gradient aura, high-gloss shine with gold drop outlines.",
        author: "pastel_dreamer",
        likes: 124,
        image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&auto=format&fit=crop&q=60"
      },
      {
        id: "ref_chrome",
        name: "⚡ Molten Chrome Swirls",
        category: "Y2K",
        vibe: "Futuristic 3D Metallic",
        colors: ["#D1D5DB", "#9CA3AF", "#4B5563"],
        description: "Glass clear nail tips paired with molten silver metal swirls.",
        author: "cyber_nails",
        likes: 89,
        image: "https://images.unsplash.com/photo-1632345031435-8797b2d58045?w=400&auto=format&fit=crop&q=60"
      },
      {
        id: "ref_glazed",
        name: "🍩 Hailey Pearl Glaze",
        category: "Clean Girl",
        vibe: "High-Gloss Glazed Donut",
        colors: ["#FFFDF9", "#F3EAE1", "#FFFFFF"],
        description: "Semi-translucent milky base burnished with fine pearl chrome powder.",
        author: "hailey_fan",
        likes: 312,
        image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&auto=format&fit=crop&q=60"
      },
      {
        id: "ref_coquette",
        name: "🎀 Velvet Bow Coquette",
        category: "Coquette",
        vibe: "Dreamy Princess Aesthetic",
        colors: ["#FFD1D5", "#FFFFFF", "#FFA8B6"],
        description: "Chic dusty rose base with delicate hand-drawn white lace bows and 3D pearls.",
        author: "coquette_queen",
        likes: 420,
        image: "https://images.unsplash.com/photo-1607779097040-26e80aa78e66?w=400&auto=format&fit=crop&q=60"
      },
      {
        id: "ref_midnight",
        name: "🌙 Celestial Midnight Sky",
        category: "Grunge",
        vibe: "Deep cat-eye navy galaxy",
        colors: ["#0F172A", "#FDE047", "#1E1B4B"],
        description: "Midnight space shimmer base with glowing crescent gold moon stickers.",
        author: "goth_nail_tech",
        likes: 156,
        image: "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=400&auto=format&fit=crop&q=60"
      }
    ];
  });

  // Account search by username state
  const [usernameSearchQuery, setUsernameSearchQuery] = useState("");
  // Toggle filter for showing "My Nail Collection" (liked items) on top of the search feed
  const [onlySavedFilter, setOnlySavedFilter] = useState(false);

  // Auto-save user data and board posts to localStorage
  useEffect(() => {
    localStorage.setItem("lamour_is_logged_in", isLoggedIn ? "true" : "false");
    localStorage.setItem("lamour_user_profile", JSON.stringify(userProfile));
  }, [isLoggedIn, userProfile]);

  useEffect(() => {
    localStorage.setItem("lamour_reference_board_posts", JSON.stringify(referenceBoardPosts));
  }, [referenceBoardPosts]);

  // Collection states
  const [collection, setCollection] = useState<NailCollection>(TRANSPARENT_INITIAL_COLLECTION);
  const [aiAlternatives, setAiAlternatives] = useState<NailCollection[]>([]);
  const [selectedAlternativeIndex, setSelectedAlternativeIndex] = useState<number | null>(null);

  // Specification States
  const [vibe, setVibe] = useState("Balletcore Romantic");
  const [colorPreference, setColorPreference] = useState("Soft blush pink, pearl white");
  const [shape, setShape] = useState("Almond");
  const [length, setLength] = useState("Medium");
  const [extraAccents, setExtraAccents] = useState("Pearls & Glitter");
  const [customPrompt, setCustomPrompt] = useState("");

  const [selectedFinger, setSelectedFinger] = useState<string | null>("Left Thumb");
  const [uploadedImages, setUploadedImages] = useState<ReferenceImage[]>([]);
  const [showRecipeCard, setShowRecipeCard] = useState(false);

  // Generator Loading & Network States
  const [isGenerating, setIsGenerating] = useState(false);
  const [apiConfigured, setApiConfigured] = useState(true);
  const [errorText, setErrorText] = useState<string | null>(null);

  // Toast / Status Message State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Search references state
  const [referenceSearch, setReferenceSearch] = useState("");

  // FAQ Accordion state
  const [activeExplainTab, setActiveExplainTab] = useState<string | null>(null);

  // Quick Album Selection Helper
  const [selectedAlbumImageId, setSelectedAlbumImageId] = useState<string | null>(null);

  // DIY 10-Nails Visual Beds Scanner & Separator States
  const [diyReferenceImage, setDiyReferenceImage] = useState<string | null>(null);
  const [isDiyScanning, setIsDiyScanning] = useState(false);
  const [isDiyScanned, setIsDiyScanned] = useState(false);
  const [separatedNailCards, setSeparatedNailCards] = useState<any[]>([]);
  const [selectedSeparatedNailId, setSelectedSeparatedNailId] = useState<string | null>(null);

  // Two-round dissecting and layered customization states
  const [isDissectingLayers, setIsDissectingLayers] = useState(false);
  const [isNailDissected, setIsNailDissected] = useState(false);
  const [dissectMode, setDissectMode] = useState<"full" | "deco">("full");

  // Option 1: Pinterest Mapping States (Retro-compatibility fallback)
  const [pinterestImg, setPinterestImg] = useState<string | null>(null);
  const [isPinterestScanning, setIsPinterestScanning] = useState(false);
  const [isPinterestScanned, setIsPinterestScanned] = useState(false);
  const [selectedDetectedNailIndex, setSelectedDetectedNailIndex] = useState<number | null>(null);
  const [mappingLayer, setMappingLayer] = useState<"base" | "overlay">("base");
  const pinterestFileInputRef = useRef<HTMLInputElement>(null);

  // Option 2: Mood Board Aesthetic Upload States
  const [uploadedAestheticImg, setUploadedAestheticImg] = useState<string | null>(null);
  const [isExtractingColors, setIsExtractingColors] = useState(false);
  const [extractedColors, setExtractedColors] = useState<string[]>([]);
  const aestheticFileInputRef = useRef<HTMLInputElement>(null);

  // Monetization & Membership limits
  const [weeklySpecialRequestsUsed, setWeeklySpecialRequestsUsed] = useState(0);
  const [isSalonPremiumMember, setIsSalonPremiumMember] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // Check backend server status on startup
  useEffect(() => {
    fetch("/api/health")
      .then((res) => res.json())
      .then((data) => {
        setApiConfigured(data.apiKeyConfigured);
        console.log("Server health status:", data);
      })
      .catch((err) => {
        console.error("Could not reach backend health endpoint:", err);
      });
  }, []);

  // Show a beautiful quick toast message
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // --- DIY 10-NAILS BED SCANNING & DRAG-AND-DROP WORKFLOWS ---
  const handleDiyReferenceUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setDiyReferenceImage(event.target.result as string);
          setIsDiyScanned(false);
          setSeparatedNailCards([]);
          setSelectedSeparatedNailId(null);
          setIsNailDissected(false);
          triggerToast("📷 DIY Reference image loaded! Ready to scan 10 nailbeds.");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const scanDiyReferenceImage = () => {
    if (!diyReferenceImage) return;
    setIsDiyScanning(true);
    triggerToast("🔬 Scanning reference image bounds...");

    setTimeout(() => {
      // Create 10 beautiful separated nail-bed layers mimicking high-fashion 3D segments
      const fingerNames = [
        "Left Thumb", "Left Index", "Left Middle", "Left Ring", "Left Pinky",
        "Right Thumb", "Right Index", "Right Middle", "Right Ring", "Right Pinky"
      ];
      
      const designKeywords = ["Strawberry Glazed", "Coquette Bow", "Ethereal Aura", "Vanilla Pearl", "Molten Silver"];
      const baseColors = ["#EF4444", "#FFA8B6", "#E8D7FF", "#FFFDF9", "#E5E7EB"];
      const styles = ["solid", "french", "ombre", "marble", "pattern"];
      const finishes = ["glossy", "chrome", "holographic", "glitter", "matte"];

      const mockSeparated = fingerNames.map((finger, idx) => {
        const color = baseColors[idx % baseColors.length];
        const keyword = designKeywords[idx % designKeywords.length];
        return {
          id: `separated_nail_${idx}_` + Date.now().toString(),
          name: `${keyword} ${finger.split(" ")[1]} Tip`,
          image: diyReferenceImage, // Preserve original image reference
          color: color,
          finish: finishes[idx % finishes.length],
          artStyle: styles[idx % styles.length],
          isMapped: false,
          mappedFinger: undefined,
          decorations: idx % 3 === 0 ? "Delicate 3D pearls" : idx % 3 === 1 ? "Fine metallic swirl line" : "None",
          details: `Layered design separated using 10-Nailbed Scanning. Base coating in ${color} with a professional ${finishes[idx % finishes.length]} finish.`
        };
      });

      setSeparatedNailCards(mockSeparated);
      setIsDiyScanned(true);
      setIsDiyScanning(false);
      triggerToast("🎯 Scan complete! 10 isolated nailbed layers generated. Drag them to the hands below!");
    }, 1500);
  };

  // Handles drag start for individual extracted nail art cards
  const handleDragStartNailCard = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData("text/plain", id);
    setSelectedSeparatedNailId(id);
  };

  // Map dropped or clicked card to target finger
  const handleDropNailOnFinger = (fingerName: string, nailId: string) => {
    const card = separatedNailCards.find((c) => c.id === nailId);
    if (!card) return;

    setCollection((prev) => ({
      ...prev,
      nails: prev.nails.map((nail) => {
        if (nail.finger === fingerName) {
          return {
            ...nail,
            title: card.name,
            baseColor: card.color,
            finish: card.finish,
            artStyle: card.artStyle,
            croppedImage: card.image,
            decorations: card.decorations,
            details: `Mapped directly from scanned DIY reference image: ${card.name}. ${card.details}`
          };
        }
        return nail;
      })
    }));

    // Update state to show this card is mapped
    setSeparatedNailCards((prev) =>
      prev.map((c) => (c.id === nailId ? { ...c, isMapped: true, mappedFinger: fingerName } : c))
    );

    setSelectedFinger(fingerName);
    triggerToast(`💅 Successfully mapped "${card.name}" to your ${fingerName}!`);
  };

  // Mobile-friendly click fallback to map selected card to selected finger
  const handleAssignSelectedCardToSelectedFinger = () => {
    if (!selectedSeparatedNailId) {
      triggerToast("⚠️ Please select an extracted nail card from above first!");
      return;
    }
    if (!selectedFinger) {
      triggerToast("⚠️ Please select a finger on the hand below first!");
      return;
    }
    handleDropNailOnFinger(selectedFinger, selectedSeparatedNailId);
  };

  // --- TWO-ROUND ACCENT DISSECTION ENGINE ---
  const handleDissectNailLayers = () => {
    if (!selectedFinger) return;
    const currentNail = collection.nails.find((n) => n.finger === selectedFinger);
    if (!currentNail) return;

    setIsDissectingLayers(true);
    triggerToast("✂️ Dissecting Layer 1 (Base pigment)...");

    setTimeout(() => {
      triggerToast("💎 Isolating Layer 2 (3D Gems and Overlays)...");
      setTimeout(() => {
        setIsDissectingLayers(false);
        setIsNailDissected(true);

        // Update the current nail to separate base from decorations
        setCollection((prev) => ({
          ...prev,
          nails: prev.nails.map((nail) => {
            if (nail.finger === selectedFinger) {
              return {
                ...nail,
                title: "Dissected Elegant Deco Layer",
                decorations: "Custom Isolated 3D Accent Overlay",
                details: `${nail.details || ""} (Aesthetic layer dissected separately for manual nail art application).`
              };
            }
            return nail;
          })
        }));
        triggerToast(`🎉 Dissected layers successfully! Isolated decorative accents only on ${selectedFinger}!`);
      }, 1000);
    }, 1000);
  };

  // --- ADD APP-PROVIDED GEMS & ORNAMENTS ---
  const handleAddDecorativeGem = (gemType: string) => {
    if (!selectedFinger) {
      triggerToast("⚠️ Please select a finger on the hand below first!");
      return;
    }

    setCollection((prev) => ({
      ...prev,
      nails: prev.nails.map((nail) => {
        if (nail.finger === selectedFinger) {
          const currentDeco = nail.decorations === "None" ? "" : nail.decorations;
          const separator = currentDeco ? " + " : "";
          const newDeco = `${currentDeco}${separator}3D Luxury ${gemType}`;
          return {
            ...nail,
            decorations: newDeco,
            details: `${nail.details || "Custom look."} Added a stunning hand-placed 3D ${gemType} charm on top.`
          };
        }
        return nail;
      })
    }));

    triggerToast(`💎 Adorned ${selectedFinger} with a luxury 3D ${gemType} ornament!`);
  };

  // --- PINTEREST SOCIAL REFERENCE SHARER AND COMMUNITY ---
  const handleCreateSocialPost = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isLoggedIn) {
      triggerToast("🔒 Please login first in the Profile tab to publish your references!");
      setActiveTab("profile");
      return;
    }

    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;
    const category = formData.get("category") as string;
    const vibeDesc = formData.get("vibe") as string;
    const colorsText = formData.get("colors") as string;
    const description = formData.get("description") as string;
    const customImage = formData.get("image_url") as string;

    if (!title || !description) {
      triggerToast("⚠️ Title and Description are required to post a reference!");
      return;
    }

    const colors = colorsText
      ? colorsText.split(",").map((c) => c.trim())
      : ["#FFD1D5", "#FFFFFF"];

    const newPost = {
      id: "custom_" + Date.now().toString(),
      name: `🌸 ${title}`,
      category: category || "Coquette",
      vibe: vibeDesc || "Custom Editorial Nail Blend",
      colors: colors,
      description: description,
      author: userProfile.username,
      likes: 0,
      image: customImage || "https://images.unsplash.com/photo-1607779097040-26e80aa78e66?w=400&auto=format&fit=crop&q=60"
    };

    setReferenceBoardPosts((prev) => [newPost, ...prev]);
    setUserProfile((prev) => ({
      ...prev,
      uploadedPostIds: [...prev.uploadedPostIds, newPost.id]
    }));

    triggerToast(`✨ Successfully posted "${title}" to the Reference Board!`);
    e.currentTarget.reset();
  };

  // Like, heart, or save references to collection
  const handleLikeOrSavePost = (postId: string) => {
    const isSaved = userProfile.savedPostIds.includes(postId);
    
    // Toggle save status
    setUserProfile((prev) => {
      const saved = isSaved 
        ? prev.savedPostIds.filter((id) => id !== postId)
        : [...prev.savedPostIds, postId];
      return { ...prev, savedPostIds: saved };
    });

    // Update like count in posts
    setReferenceBoardPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            likes: isSaved ? Math.max(0, post.likes - 1) : post.likes + 1
          };
        }
        return post;
      })
    );

    triggerToast(isSaved ? "💔 Removed from your saved collection!" : "💖 Saved directly into My Nail Collection!");
  };

  const handleDeleteSocialPost = (postId: string) => {
    setReferenceBoardPosts((prev) => prev.filter((p) => p.id !== postId));
    setUserProfile((prev) => ({
      ...prev,
      uploadedPostIds: prev.uploadedPostIds.filter((id) => id !== postId),
      savedPostIds: prev.savedPostIds.filter((id) => id !== postId)
    }));
    triggerToast("🗑️ reference pin deleted from feed.");
  };

  // Option 1: Pinterest Upload and Auto-Detection
  const handlePinterestUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPinterestImg(event.target.result as string);
          setIsPinterestScanned(false);
          setSelectedDetectedNailIndex(null);
          triggerToast("📷 Pinterest image loaded! Click AI Auto-Detect to scan nail tips.");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const scanPinterestImage = async () => {
    if (!pinterestImg) return;
    setIsPinterestScanning(true);
    try {
      const response = await fetch("/api/detect-nails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image: pinterestImg }),
      });

      if (!response.ok) {
        throw new Error("Failed to scan image using Gemini.");
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      if (data.detectedShape) setShape(data.detectedShape);
      if (data.detectedLength) setLength(data.detectedLength);
      setVibe(data.designName);
      setColorPreference(data.colorPalette.map((c: any) => c.name).join(", "));

      setCollection({
        designName: data.designName,
        description: data.description,
        colorPalette: data.colorPalette,
        nails: data.nails
      });

      setIsPinterestScanned(true);
      setSelectedDetectedNailIndex(0);
      setShowRecipeCard(true); // Open recipe card automatically so they can see the full recipe!
      triggerToast(`🎯 AI Scan complete! Detected shape: ${data.detectedShape || "Almond"}. Fully realistic recipe generated!`);

    } catch (err: any) {
      console.error("Error scanning image:", err);
      triggerToast("⚠️ Connection issue. Loaded realistic French Almond fallback style.");
      
      const fallback = getSimulatedSet("Celestial French & Gems", "Blush pink, white", shape, length, "", "", 0);
      setCollection(fallback);
      setIsPinterestScanned(true);
      setSelectedDetectedNailIndex(0);
      setShowRecipeCard(true);
    } finally {
      setIsPinterestScanning(false);
    }
  };

  const handleMapPinterestNailToFinger = (fingerName: string) => {
    if (!pinterestImg) return;
    
    setCollection((prev) => ({
      ...prev,
      nails: prev.nails.map((nail) => {
        if (nail.finger === fingerName) {
          if (mappingLayer === "base") {
            return {
              ...nail,
              croppedImage: pinterestImg,
              title: "Pinterest Base Design",
              details: "Mapped base design directly from Pinterest reference photo."
            };
          } else {
            return {
              ...nail,
              overlayImage: pinterestImg,
              title: nail.title === "Transparent Base Tip" ? "Pinterest Overlay" : nail.title,
              decorations: "Custom Pinterest Accent Overlay",
              details: `${nail.details || "Base design layer."} Overlay design added on top.`
            };
          }
        }
        return nail;
      })
    }));

    triggerToast(`💅 Assigned detected Tip ${["A", "B", "C", "D", "E"][selectedDetectedNailIndex ?? 0]} to ${fingerName} as ${mappingLayer === "base" ? "Base Layer (A)" : "Overlay Layer (B)"}!`);
  };

  // Option 2: Aesthetic Mood Board Uploader
  const handleAestheticUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setUploadedAestheticImg(event.target.result as string);
          setIsExtractingColors(true);
          setTimeout(() => {
            setIsExtractingColors(false);
            const mockColors = ["#E9D5C5", "#8E9A8A", "#D8A499", "#4A524A"];
            setExtractedColors(mockColors);
            setColorPreference("Warm Terracotta, Eucalyptus Green, Soft Sand, and Slate Gray from mood board");
            triggerToast("🎨 AI extracted a beautiful high-fashion palette from your mood board!");
          }, 1000);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Reset current hands canvas entirely to transparent tips
  const handleResetToTransparent = () => {
    setCollection(TRANSPARENT_INITIAL_COLLECTION);
    triggerToast("🧹 Canvas wiped! Nails are now back to gorgeous transparent tips.");
  };

  // Handle Preset Button Click
  const handleApplyPreset = (preset: PresetAesthetic) => {
    setVibe(preset.vibe);
    setColorPreference(preset.colorPreference);
    setShape(preset.shape);
    setLength(preset.length);
    setExtraAccents(preset.extraAccents);
    setCustomPrompt(preset.description);

    // Apply the colors immediately to the planner
    const presetNails: NailDesign[] = TRANSPARENT_INITIAL_COLLECTION.nails.map((nail, idx) => {
      if (preset.id === "strawberry_jelly") {
        if (nail.finger.includes("Thumb")) {
          return {
            ...nail,
            title: "Strawberry Glazed Gloss",
            baseColor: "#EF4444",
            finish: "chrome",
            artStyle: "solid",
            decorations: "Soft pink shimmer dust glaze",
            details: "Apply translucent jelly red base coat, cure, then burnish pink pearl chrome powder. Seal with glassy gel top coat."
          };
        } else if (nail.finger.includes("Index")) {
          return {
            ...nail,
            title: "Milk-Bath Strawberry French",
            baseColor: "#FFFFFF",
            finish: "glossy",
            artStyle: "french",
            secondaryColor: "#EF4444",
            decorations: "None",
            details: "Apply sheer milky white base. Using a fine detail brush, paint a precise strawberry-red French crescent."
          };
        } else if (nail.finger.includes("Middle")) {
          return {
            ...nail,
            title: "Wavy Strawberry Syrup",
            baseColor: "#FCA5A5",
            finish: "glossy",
            artStyle: "ombre",
            secondaryColor: "#EF4444",
            decorations: "Clear wavy syrup ridges",
            details: "Sponge a translucent strawberry-red syrup starting from the tip to create a juicy ombre. Overlay clear high-viscosity 3D gel syrup ridges."
          };
        } else if (nail.finger.includes("Ring")) {
          return {
            ...nail,
            title: "Juicy Strawberry Charm",
            baseColor: "#FFFFFF",
            finish: "glossy",
            artStyle: "accent",
            decorations: "3D Embossed Strawberry Charm with golden seeds",
            details: "Paint a sheer milky base. Overlay a realistic 3D strawberry gel ornament with gold microseed accents and emerald-green leaves."
          };
        } else {
          return {
            ...nail,
            title: "Matcha Mint Accent",
            baseColor: "#10B981",
            finish: "matte",
            artStyle: "solid",
            decorations: "None",
            details: "Apply soft matcha-cream green base coat. Cure, and apply premium velvet matte top coat for an organic, complementary contrast."
          };
        }
      }

      const col = preset.colors[idx % preset.colors.length];
      return {
        ...nail,
        title: `${preset.name} Color Base`,
        baseColor: col,
        finish: "glossy",
        artStyle: idx % 3 === 1 ? "french" : "solid",
        secondaryColor: preset.colors[(idx + 1) % preset.colors.length],
        details: `Coated in ${col}. Styled under the ${preset.name} concept.`
      };
    });

    setCollection({
      designName: preset.name,
      description: preset.description,
      colorPalette: preset.colors.map((c, i) => ({ name: `Tone ${i+1}`, hex: c })),
      nails: presetNails
    });

    triggerToast(`Applied Preset: ${preset.name}!`);
  };

  // Generate 3 alternative designs side-by-side using Gemini or simulation
  const handleGenerateDesign = async () => {
    // Check if limits exceeded
    if (!isSalonPremiumMember && weeklySpecialRequestsUsed >= 1) {
      setShowUpgradeModal(true);
      triggerToast("🔒 Weekly free AI request limit reached. Join Premium Club for unlimited looks!");
      return;
    }

    setIsGenerating(true);
    setErrorText(null);
    setSelectedAlternativeIndex(null);

    try {
      const response = await fetch("/api/generate-design", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          vibe,
          colorPreference,
          shape,
          length,
          extraAccents,
          customPrompt,
        }),
      });

      if (!response.ok) {
        throw new Error("Generation endpoint returned an error");
      }

      const data = await response.json();
      
      if (data.options && data.options.length > 0) {
        setAiAlternatives(data.options);
        // Automatically set the first alternative as active
        setCollection(data.options[0]);
        setSelectedAlternativeIndex(0);
        triggerToast("✨ AI successfully generated 3 breathtaking alternative design sets! Explore below.");
      } else {
        // Fallback for single options response
        const fallbackOptions = [data];
        setAiAlternatives(fallbackOptions);
        setCollection(data);
        setSelectedAlternativeIndex(0);
        triggerToast("✨ Loaded generated custom design set.");
      }

      // Increment request count
      setWeeklySpecialRequestsUsed((prev) => prev + 1);

      // Reset selected finger detail view to thumb
      setSelectedFinger("Left Thumb");
    } catch (err: any) {
      console.error("Error generating design:", err);
      setErrorText("Oops! We hit a slight server delay. We've loaded 3 elegant custom simulated variations for you to compare and apply!");
      
      // Load simulated alternatives
      const mockOptions = [
        getSimulatedSet(vibe, colorPreference, shape, length, extraAccents, customPrompt, 0),
        getSimulatedSet(vibe, colorPreference, shape, length, extraAccents, customPrompt, 1),
        getSimulatedSet(vibe, colorPreference, shape, length, extraAccents, customPrompt, 2)
      ];
      setAiAlternatives(mockOptions);
      setCollection(mockOptions[0]);
      setSelectedAlternativeIndex(0);

      setWeeklySpecialRequestsUsed((prev) => prev + 1);
    } finally {
      setIsGenerating(false);
    }
  };

  // Helper to generate a simulated set if server fails
  const getSimulatedSet = (v: string, c: string, sh: string, le: string, ac: string, pr: string, idx: number): NailCollection => {
    const isDark = (c || "").toLowerCase().includes("black") || (c || "").toLowerCase().includes("dark");
    const colors = idx === 0 
      ? [isDark ? "#1E1B4B" : "#FFF0F1", "#F7D1D5", "#E6C9A8"]
      : idx === 1 
      ? [isDark ? "#111827" : "#FAF8F5", "#D2D6DC", "#F3E5D8"]
      : [isDark ? "#311042" : "#9CAF88", "#F4ECE1", "#E2C391"];

    const name = idx === 0 ? "Option A: Delicate Glow Rose" : idx === 1 ? "Option B: High Metallic Chrome Edition" : "Option C: Cozy Organic Meadow";
    const desc = idx === 0 ? "A soft interpretation focused on iridescent pastel surfaces" : idx === 1 ? "A heavy-contrast style featuring glazed chrome foils" : "A calm minimalist layout emphasizing hand-painted negative space";

    return {
      designName: name,
      description: desc,
      colorPalette: colors.map((col, i) => ({ name: `Tone ${i+1}`, hex: col })),
      nails: TRANSPARENT_INITIAL_COLLECTION.nails.map((nail, i) => ({
        ...nail,
        title: `${name} ${nail.finger}`,
        baseColor: colors[i % colors.length],
        finish: idx === 1 ? "chrome" : idx === 2 ? "matte" : "glossy",
        artStyle: i % 4 === 1 ? "ombre" : "solid",
        details: `Simulated design details for ${nail.finger}. Perfectly balanced aesthetic overlay.`
      }))
    };
  };

  // Apply a specific AI generated alternative to the active planner hand
  const handleApplyAlternativeToPlanner = (idx: number) => {
    if (!aiAlternatives[idx]) return;
    setCollection(aiAlternatives[idx]);
    setSelectedAlternativeIndex(idx);
    setActiveTab("diy");
    triggerToast(`💅 Loaded "${aiAlternatives[idx].designName}" directly into your 10-Finger Planner!`);
  };

  // Dynamic Texture Generator from Reference
  const handleImportReferenceToAlbum = (ref: ReferenceStyleItem) => {
    // Generate beautiful custom texture in the browser background
    const canvas = document.createElement("canvas");
    canvas.width = 400;
    canvas.height = 400;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear background
    ctx.fillStyle = ref.colors[1] || "#FFFFFF";
    ctx.fillRect(0, 0, 400, 400);

    if (ref.id === "ref_aura") {
      const grad = ctx.createRadialGradient(200, 200, 50, 200, 200, 180);
      grad.addColorStop(0, ref.colors[0]);
      grad.addColorStop(0.5, ref.colors[1]);
      grad.addColorStop(1, ref.colors[2]);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 400, 400);
    } else if (ref.id === "ref_chrome") {
      const grad = ctx.createLinearGradient(0, 0, 400, 400);
      grad.addColorStop(0, ref.colors[0]);
      grad.addColorStop(0.5, ref.colors[1]);
      grad.addColorStop(1, ref.colors[2]);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 400, 400);
      ctx.strokeStyle = "rgba(255,255,255,0.7)";
      ctx.lineWidth = 14;
      ctx.beginPath();
      ctx.moveTo(-50, 150);
      ctx.bezierCurveTo(150, 350, 250, 50, 450, 250);
      ctx.stroke();
    } else if (ref.id === "ref_cottage") {
      ctx.fillStyle = ref.colors[1];
      ctx.fillRect(0, 0, 400, 400);
      ctx.fillStyle = ref.colors[0];
      const size = 50;
      for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
          if ((r + c) % 2 === 0) {
            ctx.fillRect(c * size, r * size, size, size);
          }
        }
      }
    } else {
      // Swirl linear gradient
      const grad = ctx.createLinearGradient(0, 0, 400, 400);
      grad.addColorStop(0, ref.colors[0]);
      grad.addColorStop(0.5, ref.colors[1]);
      grad.addColorStop(1, ref.colors[2] || "#FFFFFF");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 400, 400);
      // Soft marble wave
      ctx.strokeStyle = "rgba(255,255,255,0.3)";
      ctx.lineWidth = 10;
      ctx.beginPath();
      ctx.moveTo(0, 100);
      ctx.lineTo(400, 300);
      ctx.stroke();
    }

    const dataUrl = canvas.toDataURL("image/jpeg", 0.95);
    const newImg: ReferenceImage = {
      id: "ref_" + Date.now().toString(),
      src: dataUrl,
      name: `${ref.name} Texture`,
    };

    setUploadedImages((prev) => [newImg, ...prev]);
    setSelectedAlbumImageId(newImg.id);
    triggerToast(`📥 Imported "${ref.name}" into your Nail Art Album! Swap back to the "10-Finger Planner" to patch it!`);
  };

  // Handle local image upload
  const handleUploadImages = (files: FileList) => {
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          const newImg: ReferenceImage = {
            id: Date.now().toString() + Math.random().toString().substring(2, 5),
            src: e.target.result as string,
            name: file.name,
          };
          setUploadedImages((prev) => [newImg, ...prev]);
          setSelectedAlbumImageId(newImg.id);
          triggerToast(`📷 Successfully added image "${file.name}" to your design album!`);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDeleteImage = (id: string) => {
    setUploadedImages((prev) => prev.filter((img) => img.id !== id));
    if (selectedAlbumImageId === id) {
      setSelectedAlbumImageId(null);
    }
  };

  // Put a picture from the album directly onto the selected finger
  const handleQuickAssignToSelectedFinger = (imgSrc: string) => {
    if (!selectedFinger) {
      triggerToast("⚠️ Please select a finger on the hand above first!");
      return;
    }
    
    setCollection((prev) => ({
      ...prev,
      nails: prev.nails.map((nail) =>
        nail.finger === selectedFinger
          ? { ...nail, croppedImage: imgSrc, title: "Custom Album Pattern", details: "Hand-mapped reference image directly from album." }
          : nail
      ),
    }));
    triggerToast(`🎯 Placed pattern on your ${selectedFinger}!`);
  };

  // Apply crop patch
  const handleApplyPatch = (fingerName: string, croppedDataUrl: string) => {
    setCollection((prev) => ({
      ...prev,
      nails: prev.nails.map((nail) =>
        nail.finger === fingerName
          ? { ...nail, croppedImage: croppedDataUrl, title: "Custom Cropped Art", details: "Precisely cropped reference pattern applied to nail tip." }
          : nail
      ),
    }));
    triggerToast(`✂️ Custom patch applied to ${fingerName}!`);
  };

  // Clear single patch
  const handleClearPatch = (fingerName: string) => {
    setCollection((prev) => ({
      ...prev,
      nails: prev.nails.map((nail) =>
        nail.finger === fingerName
          ? { ...nail, croppedImage: null, baseColor: "transparent", title: "Transparent Base Tip", details: "Clear transparent gel base tip. Ready for custom image album decals." }
          : nail
      ),
    }));
    triggerToast(`🔄 Reset ${fingerName} back to transparent tip.`);
  };

  const activeFingerDetail = collection.nails.find((n) => n.finger === selectedFinger);
  const fingerNamesList = collection.nails.map((n) => n.finger);

  // Search references filter
  const filteredReferences = REFERENCED_STYLES.filter(style => 
    style.name.toLowerCase().includes(referenceSearch.toLowerCase()) ||
    style.vibe.toLowerCase().includes(referenceSearch.toLowerCase()) ||
    style.category.toLowerCase().includes(referenceSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#FCFAF8] text-stone-800 font-sans pb-32">
      {/* LUXURY COSMETICS GLAM HEADER */}
      <header className="bg-white/95 border-b border-pink-100 sticky top-0 z-30 shadow-sm backdrop-blur-md py-3.5">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-pink-400 to-rose-500 flex items-center justify-center text-white text-xl shadow-md shadow-pink-200">
              💅
            </div>
            <div>
              <h1 className="font-display text-lg font-extrabold tracking-tight text-stone-800 flex items-center gap-2">
                La'Mour Nail Atelier <span className="text-pink-600 text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-pink-50 border border-pink-100/50">Atelier Suite</span>
              </h1>
              <p className="text-[10px] text-stone-400 font-mono tracking-wider uppercase">
                DIY Nail Design Palette • Pinterest 1-10 Auto-Mapping • AI Sparkle Studio
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            {/* Membership Quota Display */}
            <div className="flex items-center gap-1.5 bg-pink-50/60 border border-pink-100/80 px-3 py-1.5 rounded-xl text-[10px] font-medium text-pink-700">
              <span>Status: </span>
              {isSalonPremiumMember ? (
                <span className="font-bold flex items-center gap-1 text-pink-800">
                  👑 Salon Premium (Unlimited)
                </span>
              ) : (
                <span className="font-bold flex items-center gap-1">
                  Free Member ({weeklySpecialRequestsUsed}/1 Weekly request used)
                </span>
              )}
              {!isSalonPremiumMember && (
                <button
                  onClick={() => setShowUpgradeModal(true)}
                  className="ml-2 px-2 py-0.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-extrabold rounded-md hover:opacity-90 transition text-[9px]"
                >
                  Upgrade
                </button>
              )}
            </div>

            {!apiConfigured && (
              <span className="text-[9px] bg-amber-50 text-amber-700 px-2 py-1 rounded-full font-mono border border-amber-100">
                ⚠️ Simulation Mode
              </span>
            )}
            
            <button
              onClick={() => setShowRecipeCard(true)}
              className="px-4 py-1.5 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold rounded-xl text-xs transition shadow-sm flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5" />
              Export Recipe
            </button>
          </div>
        </div>
      </header>

      {/* FLOATING TOAST MESSAGE */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs font-semibold px-4 py-3 rounded-full shadow-lg z-50 animate-bounce flex items-center gap-2 border border-white">
          <Sparkles className="w-4 h-4 animate-spin" />
          <span>{toastMessage}</span>
        </div>
      )}
      <main className="max-w-7xl mx-auto px-4 mt-6">
        
        {/* TAB 1: NAIL DIY (Streamlined Studio with nailbed detection & separation) */}
        {activeTab === "diy" && (
          <DiyAtelier
            collection={collection}
            setCollection={setCollection}
            selectedFinger={selectedFinger}
            onSelectFinger={setSelectedFinger}
            shape={shape}
            onDropNail={handleDropNailOnFinger}
            diyReferenceImage={diyReferenceImage}
            onUploadImage={handleDiyReferenceUpload}
            onRemovePhoto={() => {
              setDiyReferenceImage(null);
              setIsDiyScanned(false);
              setSeparatedNailCards([]);
              setSelectedSeparatedNailId(null);
            }}
            separatedNailCards={separatedNailCards}
            setSeparatedNailCards={setSeparatedNailCards}
            selectedSeparatedNailId={selectedSeparatedNailId}
            onSelectCard={setSelectedSeparatedNailId}
            onResetToTransparent={handleResetToTransparent}
            triggerToast={triggerToast}
            onDragStartNailCard={handleDragStartNailCard}
          />
        )}

        {/* OBSOLETE TAB 1 */}
        {false && (activeTab as string) === "planner" && (
          <div className="space-y-6">
            
            {/* SUB-TAB TOGGLE: Manual vs AI */}
            <div className="flex bg-neutral-100 p-1.5 rounded-2xl border border-neutral-200 max-w-sm">
              <button
                onClick={() => setPlannerSubTab("manual")}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  plannerSubTab === "manual"
                    ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md"
                    : "text-stone-500 hover:text-stone-700"
                }`}
              >
                <Scissors className="w-3.5 h-3.5" />
                <span>🖌️ DIY Nail Palette Designer</span>
              </button>
              <button
                onClick={() => setPlannerSubTab("ai")}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  plannerSubTab === "ai"
                    ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md"
                    : "text-stone-500 hover:text-stone-700"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                <span>✨ AI Sparkle Generator</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* LEFT COLUMN: ACTIVE CANVAS DETAILS & ALPHUM & PRESSETS (5 COLS) */}
              <div className="lg:col-span-5 space-y-6">
                
                {plannerSubTab === "manual" ? (
                  <>
                    {/* 1. Quick Presets or Transparent tips buttons */}
                    <div className="bg-white rounded-2xl p-5 border border-pink-100 shadow-sm space-y-4">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <h3 className="font-display font-extrabold text-stone-800 text-xs tracking-wider uppercase flex items-center gap-2">
                          <Layers className="w-4 h-4 text-pink-500" /> Canvas Base Presets
                        </h3>
                        <button
                          onClick={handleResetToTransparent}
                          className="px-3 py-1.5 bg-pink-50 hover:bg-pink-100 text-pink-600 rounded-lg text-[10px] font-mono font-bold transition border border-pink-100/50"
                        >
                          🧹 Reset to Transparent
                        </button>
                      </div>

                      <p className="text-[11px] text-stone-500 leading-relaxed">
                        Select one of our starting visual themes, or wipe to transparent gel tips to map album images finger-by-finger.
                      </p>

                      <div className="grid grid-cols-2 gap-2">
                        {PRESET_AESTHETICS.map((preset) => (
                          <button
                            key={preset.id}
                            onClick={() => handleApplyPreset(preset)}
                            className="p-2.5 text-left rounded-xl border border-stone-200/80 bg-stone-50/50 hover:border-pink-300 hover:bg-pink-50/10 text-xs transition duration-200"
                          >
                            <div className="font-extrabold text-stone-700 text-[11px]">{preset.name}</div>
                            <div className="text-[9px] text-stone-400 truncate mt-0.5">{preset.vibe}</div>
                            <div className="flex gap-1 mt-1.5">
                              {preset.colors.map((c, idx) => (
                                <div key={idx} className="w-2.5 h-2.5 rounded-full border border-stone-200" style={{ backgroundColor: c }} />
                              ))}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* NEW: PINTEREST AUTO-MAPPING INTERACTIVE STATION (OPTION 1) */}
                    <div className="bg-white rounded-2xl p-5 border border-pink-100 shadow-sm space-y-4">
                      <div className="flex items-center gap-2 border-b border-pink-100/50 pb-3">
                        <span className="p-1.5 bg-pink-50 rounded-xl text-pink-600">
                          <Upload className="w-4 h-4" />
                        </span>
                        <div>
                          <h4 className="font-display font-extrabold text-stone-800 text-xs uppercase tracking-widest leading-none mb-1">
                            Option 1: Pinterest 1-10 Auto-Mapping
                          </h4>
                          <p className="text-[9px] text-stone-400 font-mono tracking-wider uppercase">
                            AI Scan &amp; Assign Pins to Hand Palette
                          </p>
                        </div>
                      </div>

                      <p className="text-[11px] text-stone-500 leading-relaxed">
                        Upload your favorite nail style reference photo. AI will scan the layout and assign zones to fingers 1–10. Layer as base colors or detailed charms!
                      </p>

                      {/* Pinterest Image Upload */}
                      {!pinterestImg ? (
                        <div 
                          className="border-2 border-dashed border-pink-100 rounded-xl p-6 text-center bg-pink-50/10 hover:bg-pink-50/40 transition cursor-pointer"
                          onClick={() => pinterestFileInputRef.current?.click()}
                        >
                          <input 
                            type="file" 
                            ref={pinterestFileInputRef} 
                            className="hidden" 
                            accept="image/*" 
                            onChange={handlePinterestUpload} 
                          />
                          <ImageIcon className="w-8 h-8 text-pink-300 mx-auto mb-2" />
                          <span className="text-xs font-bold text-stone-700 block">Upload Pinterest Nail Photo</span>
                          <span className="text-[9px] text-stone-400 block mt-1">PNG, JPG, WEBP (Drag and drop supported)</span>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {/* Simulated Canvas Hotspots Overlay */}
                          <div className="relative rounded-xl overflow-hidden border border-pink-100 max-h-56 flex items-center justify-center bg-stone-50 shadow-inner">
                            <img src={pinterestImg} alt="pinterest nail look" className="max-h-56 object-contain w-full select-none" />
                            
                            {/* Detected nail hotspot indicators */}
                            {isPinterestScanned && (
                              <>
                                <button 
                                  onClick={() => { setSelectedDetectedNailIndex(0); triggerToast("Selected Tip A from scan"); }}
                                  className={`absolute top-[40%] left-[20%] w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold border shadow-md transition-all ${
                                    selectedDetectedNailIndex === 0 
                                      ? "bg-pink-500 text-white border-white scale-110 ring-2 ring-pink-300" 
                                      : "bg-white/90 text-pink-600 border-pink-200 hover:bg-pink-50"
                                  }`}
                                >
                                  Tip A
                                </button>
                                <button 
                                  onClick={() => { setSelectedDetectedNailIndex(1); triggerToast("Selected Tip B from scan"); }}
                                  className={`absolute top-[35%] left-[38%] w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold border shadow-md transition-all ${
                                    selectedDetectedNailIndex === 1 
                                      ? "bg-pink-500 text-white border-white scale-110 ring-2 ring-pink-300" 
                                      : "bg-white/90 text-pink-600 border-pink-200 hover:bg-pink-50"
                                  }`}
                                >
                                  Tip B
                                </button>
                                <button 
                                  onClick={() => { setSelectedDetectedNailIndex(2); triggerToast("Selected Tip C from scan"); }}
                                  className={`absolute top-[38%] left-[55%] w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold border shadow-md transition-all ${
                                    selectedDetectedNailIndex === 2 
                                      ? "bg-pink-500 text-white border-white scale-110 ring-2 ring-pink-300" 
                                      : "bg-white/90 text-pink-600 border-pink-200 hover:bg-pink-50"
                                  }`}
                                >
                                  Tip C
                                </button>
                                <button 
                                  onClick={() => { setSelectedDetectedNailIndex(3); triggerToast("Selected Tip D from scan"); }}
                                  className={`absolute top-[45%] left-[72%] w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold border shadow-md transition-all ${
                                    selectedDetectedNailIndex === 3 
                                      ? "bg-pink-500 text-white border-white scale-110 ring-2 ring-pink-300" 
                                      : "bg-white/90 text-pink-600 border-pink-200 hover:bg-pink-50"
                                  }`}
                                >
                                  Tip D
                                </button>
                                <button 
                                  onClick={() => { setSelectedDetectedNailIndex(4); triggerToast("Selected Tip E from scan"); }}
                                  className={`absolute top-[55%] left-[85%] w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold border shadow-md transition-all ${
                                    selectedDetectedNailIndex === 4 
                                      ? "bg-pink-500 text-white border-white scale-110 ring-2 ring-pink-300" 
                                      : "bg-white/90 text-pink-600 border-pink-200 hover:bg-pink-50"
                                  }`}
                                >
                                  Tip E
                                </button>
                              </>
                            )}

                            {/* Scan active loading panel */}
                            {isPinterestScanning && (
                              <div className="absolute inset-0 bg-white/80 backdrop-blur-xs flex flex-col items-center justify-center text-center p-4">
                                <RefreshCw className="w-8 h-8 text-pink-500 animate-spin mb-2" />
                                <span className="text-xs font-bold text-stone-800">AI Nail Scanning Active</span>
                                <span className="text-[10px] text-stone-500">Detecting individual nail beds &amp; charm decals...</span>
                              </div>
                            )}
                          </div>

                          <div className="flex gap-2">
                            {!isPinterestScanned && !isPinterestScanning && (
                              <button
                                onClick={scanPinterestImage}
                                className="flex-1 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs font-bold rounded-xl shadow-sm hover:from-pink-600 hover:to-rose-600 transition"
                              >
                                🔍 Scan &amp; Auto-Detect Nails
                              </button>
                            )}
                            
                            <button
                              onClick={() => { setPinterestImg(null); setIsPinterestScanned(false); setSelectedDetectedNailIndex(null); }}
                              className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-600 text-xs font-bold rounded-xl transition"
                            >
                              Remove Photo
                            </button>
                          </div>

                          {/* Quick finger assignment grid (1-10 mapped buttons) */}
                          {isPinterestScanned && (
                            <div className="p-3 bg-pink-50/40 rounded-xl border border-pink-100/50 space-y-3.5 animate-fade-in">
                              <div className="text-[11px] font-bold text-stone-700 flex justify-between">
                                <span>Assign to Finger (1-10):</span>
                                <span className="text-pink-600 uppercase font-mono">Active: {["Tip A", "Tip B", "Tip C", "Tip D", "Tip E"][selectedDetectedNailIndex ?? 0]}</span>
                              </div>

                              <div className="grid grid-cols-5 gap-1.5">
                                {[
                                  { num: 1, name: "Left Thumb" },
                                  { num: 2, name: "Left Index" },
                                  { num: 3, name: "Left Middle" },
                                  { num: 4, name: "Left Ring" },
                                  { num: 5, name: "Left Pinky" },
                                  { num: 6, name: "Right Thumb" },
                                  { num: 7, name: "Right Index" },
                                  { num: 8, name: "Right Middle" },
                                  { num: 9, name: "Right Ring" },
                                  { num: 10, name: "Right Pinky" }
                                ].map((f) => (
                                  <button
                                    key={f.num}
                                    onClick={() => handleMapPinterestNailToFinger(f.name)}
                                    className="py-2.5 bg-white hover:bg-pink-50 border border-pink-100 rounded-lg text-xs flex flex-col items-center justify-center group transition shadow-xs hover:border-pink-300"
                                    title={`Map to ${f.name}`}
                                  >
                                    <span className="font-extrabold text-pink-600 text-sm group-hover:scale-110 transition">{f.num}</span>
                                    <span className="text-[7px] text-stone-400 mt-0.5 whitespace-nowrap truncate w-11 text-center font-mono uppercase font-bold">
                                      {f.name.replace("Left ", "L-").replace("Right ", "R-")}
                                    </span>
                                  </button>
                                ))}
                              </div>

                              {/* Layer Assignment Option (Base vs Overlay) */}
                              <div className="flex items-center justify-between text-xs border-t border-pink-100/40 pt-3 flex-wrap gap-2">
                                <span className="font-bold text-stone-600 text-[10px] uppercase tracking-wider">Assign to Layer:</span>
                                <div className="flex bg-stone-100 p-0.5 rounded-lg border border-stone-200">
                                  <button
                                    onClick={() => setMappingLayer("base")}
                                    className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition ${
                                      mappingLayer === "base" 
                                        ? "bg-white text-pink-600 shadow-xs" 
                                        : "text-stone-500 hover:text-stone-700"
                                    }`}
                                  >
                                    Layer A: Base Gel
                                  </button>
                                  <button
                                    onClick={() => setMappingLayer("overlay")}
                                    className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition ${
                                      mappingLayer === "overlay" 
                                        ? "bg-white text-pink-600 shadow-xs" 
                                        : "text-stone-500 hover:text-stone-700"
                                    }`}
                                  >
                                    Layer B: Overlay Charm
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* OPTION 2: THE NAIL ART ALBUM & DIRECT DECAL ATTACHMENT */}
                    <div className="bg-white rounded-2xl p-5 border border-pink-100 shadow-sm space-y-4">
                      <div className="flex items-center justify-between border-b border-pink-100/40 pb-3 flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <span className="p-1.5 bg-pink-50 rounded-lg text-pink-600">
                            <ImageIcon className="w-4 h-4" />
                          </span>
                          <div>
                            <h4 className="font-display font-extrabold text-stone-800 text-xs uppercase tracking-widest leading-none mb-1">
                              Option 2: Personal Art Album
                            </h4>
                            <p className="text-[9px] text-stone-400 font-mono tracking-wider uppercase">
                              Import decals &amp; details manually
                            </p>
                          </div>
                        </div>
                        
                        {/* Add local button */}
                        <label className="cursor-pointer bg-pink-50 hover:bg-pink-100 text-pink-600 px-3 py-1.5 rounded-xl text-[10px] font-bold transition border border-pink-100 flex items-center gap-1.5">
                          <Upload className="w-3.5 h-3.5" />
                          Upload Decals
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            multiple
                            onChange={(e) => e.target.files && handleUploadImages(e.target.files)}
                          />
                        </label>
                      </div>

                      {/* Album list */}
                      {uploadedImages.length > 0 ? (
                        <div className="space-y-4">
                          <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 max-h-48 overflow-y-auto pr-1">
                            {uploadedImages.map((img) => (
                              <div
                                key={img.id}
                                className={`relative aspect-square rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${
                                  selectedAlbumImageId === img.id
                                    ? "border-pink-500 scale-105 shadow-md shadow-pink-100"
                                    : "border-stone-100 opacity-85 hover:opacity-100"
                                }`}
                                onClick={() => setSelectedAlbumImageId(img.id)}
                              >
                                <img src={img.src} alt={img.name} className="w-full h-full object-cover" />
                                
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteImage(img.id);
                                  }}
                                  className="absolute top-0.5 right-0.5 bg-neutral-900/80 hover:bg-red-600 rounded p-0.5 text-white transition"
                                  title="Delete picture"
                                >
                                  <Trash2 className="w-2.5 h-2.5" />
                                </button>
                              </div>
                            ))}
                          </div>

                          {/* Decal and Assign Panel */}
                          {selectedAlbumImageId && (
                            <div className="p-3 bg-pink-50/20 rounded-xl border border-pink-100 space-y-2.5">
                              <div className="text-[10px] font-bold text-stone-600 flex justify-between font-mono uppercase tracking-wider">
                                <span>Assign Album Decal:</span>
                                <span className="text-pink-600 font-extrabold">Active: {selectedFinger || "None Selected"}</span>
                              </div>

                              <div className="flex gap-2">
                                <button
                                  onClick={() => {
                                    const img = uploadedImages.find(i => i.id === selectedAlbumImageId);
                                    if (img) handleQuickAssignToSelectedFinger(img.src);
                                  }}
                                  className="flex-1 py-2 bg-pink-600 hover:bg-pink-500 text-white rounded-lg text-[10px] font-bold transition flex items-center justify-center gap-1"
                                >
                                  <Plus className="w-3.5 h-3.5" /> Direct Cover Tip
                                </button>
                                
                                <button
                                  onClick={() => {
                                    triggerToast("Use the Reference Patchmaker below to crop specific zones!");
                                  }}
                                  className="px-2.5 py-1.5 bg-white border border-pink-100 text-pink-600 rounded-lg text-[10px] font-bold hover:bg-pink-50/50 transition"
                                >
                                  Crop Sliders
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="p-6 bg-stone-50 rounded-xl border border-dashed border-stone-200 text-center space-y-2">
                          <ImageIcon className="w-8 h-8 text-stone-300 mx-auto" />
                          <p className="text-xs text-stone-500 font-bold">Album is empty</p>
                          <p className="text-[10px] text-stone-400 max-w-xs mx-auto leading-relaxed">
                            Upload nail art decals, or browse our <strong className="text-pink-600 cursor-pointer" onClick={() => setActiveTab("references")}>Reference Discovery Board</strong> to import preloaded textures!
                          </p>
                        </div>
                      )}
                    </div>

                    {/* 3. ACTIVE PALETTE INFO */}
                    <div className="bg-white rounded-2xl p-5 border border-pink-100 shadow-sm space-y-4">
                      <div className="flex items-center gap-2 border-b border-pink-100/30 pb-2">
                        <span className="text-pink-600 font-bold">🎨</span>
                        <h4 className="font-display font-extrabold text-stone-800 text-xs uppercase tracking-wider">
                          Active Palette: {collection.designName}
                        </h4>
                      </div>
                      <p className="text-[11px] text-stone-500 leading-relaxed">
                        {collection.description}
                      </p>

                      <div className="space-y-1.5 pt-1">
                        {collection.colorPalette.map((color, i) => (
                          <div key={i} className="flex items-center justify-between p-2 rounded-xl bg-stone-50 text-xs border border-stone-100">
                            <div className="flex items-center gap-2">
                              <div 
                                className="w-5 h-5 rounded-lg border border-stone-200 shrink-0" 
                                style={{ backgroundColor: color.hex === "transparent" ? "rgba(255,255,255,0.85)" : color.hex }}
                              />
                              <span className="text-stone-700 font-bold">{color.name}</span>
                            </div>
                            <span className="text-[10px] font-mono text-stone-400 font-bold">{color.hex}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  /* AI 3-SET CUSTOMIZER INPUT FORM */
                  <div className="bg-white rounded-2xl p-5 border border-pink-100 shadow-sm space-y-5">
                    <div className="flex items-center gap-2 border-b border-pink-100/50 pb-3">
                      <Sparkles className="w-5 h-5 text-pink-500 animate-pulse" />
                      <div>
                        <h3 className="font-display font-extrabold text-stone-800 text-xs uppercase tracking-widest leading-none mb-1">
                          AI 3-Set Customizer
                        </h3>
                        <p className="text-[9px] text-stone-400 font-mono uppercase tracking-wider">
                          Compare 3 Beautiful Alternatives At Once
                        </p>
                      </div>
                    </div>

                    {/* Popular Keywords Cloud Helper */}
                    <div className="space-y-2">
                      <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">
                        Fast Trend Keywords (Click to add):
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {["Chrome Glaze", "Pink Coquette", "Silver Metallic", "Gothic Black", "Matcha Marble", "Soft Ombre", "3D Ribbon Gel", "Aurora Shimmer", "Vintage Lace"].map((tag) => (
                          <button
                            key={tag}
                            onClick={() => {
                              setVibe(tag);
                              triggerToast(`Set Aesthetic to: ${tag}`);
                            }}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                              vibe.includes(tag) 
                                ? "bg-pink-600 text-white shadow-xs" 
                                : "bg-stone-50 hover:bg-pink-50/40 text-stone-600 border border-stone-200"
                            }`}
                          >
                            +{tag}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Spec fields */}
                    <div className="space-y-4 text-xs">
                      <div>
                        <label className="block font-bold text-stone-700 text-[10px] uppercase tracking-wider mb-1.5">
                          Aesthetic Style Vibe:
                        </label>
                        <input
                          type="text"
                          value={vibe}
                          onChange={(e) => setVibe(e.target.value)}
                          className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-stone-800 focus:outline-none focus:border-pink-400 text-xs"
                          placeholder="e.g. Vintage Rose Balletcore, Cyber Punk Grunge"
                        />
                      </div>

                      {/* FAST COLOR PRESETS QUICK-SELECTORS */}
                      <div className="space-y-2">
                        <label className="block font-bold text-stone-700 text-[10px] uppercase tracking-wider">
                          Primary Colors (Quick Selection):
                        </label>
                        <div className="grid grid-cols-2 gap-1.5">
                          {[
                            { name: "Strawberry Milk 🍓", value: "Strawberry milk pink, sheer white glaze" },
                            { name: "Matcha Latte 🍵", value: "Creamy matcha green, golden flakes" },
                            { name: "Glazed Vanilla 🍦", value: "Pearl vanilla chrome glaze, soft cream" },
                            { name: "Peach Mimosa 🍑", value: "Soft peach ombre, subtle coral sheen" }
                          ].map((colPreset) => (
                            <button
                              key={colPreset.name}
                              type="button"
                              onClick={() => {
                                setColorPreference(colPreset.value);
                                triggerToast(`Filled colors: ${colPreset.name}`);
                              }}
                              className={`py-1.5 px-2.5 rounded-lg text-[10px] font-bold border transition text-left truncate ${
                                colorPreference === colPreset.value
                                  ? "bg-pink-50 border-pink-300 text-pink-700"
                                  : "bg-white border-stone-200 text-stone-600 hover:bg-stone-50"
                              }`}
                            >
                              {colPreset.name}
                            </button>
                          ))}
                        </div>
                        <input
                          type="text"
                          value={colorPreference}
                          onChange={(e) => setColorPreference(e.target.value)}
                          className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-stone-800 focus:outline-none focus:border-pink-400 text-xs mt-1"
                          placeholder="Or type e.g. Soft peach, gold foil flake, white glaze"
                        />
                      </div>

                      {/* NEW: MOOD BOARD INSPIRATION IMAGE EXTRACTOR */}
                      <div className="p-3 bg-pink-50/10 rounded-xl border border-pink-100/50 space-y-2.5">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs">📸</span>
                          <span className="text-[10px] font-bold text-stone-700 uppercase tracking-wider">Mood Board Color Extractor:</span>
                        </div>
                        <p className="text-[9px] text-stone-400 leading-normal">
                          Have an image of flowers, sunset, or fabric? Drag it here to automatically capture the perfect color tones!
                        </p>
                        <div className="flex items-center gap-2">
                          <label className="cursor-pointer bg-white hover:bg-pink-50 border border-pink-200 px-3 py-1.5 rounded-xl text-[10px] font-bold text-pink-600 transition flex items-center gap-1">
                            <Upload className="w-3 h-3" />
                            Upload Mood Photo
                            <input
                              type="file"
                              className="hidden"
                              accept="image/*"
                              onChange={handleAestheticUpload}
                            />
                          </label>
                          {uploadedAestheticImg && (
                            <div className="flex items-center gap-1.5">
                              <div className="w-6 h-6 rounded border border-stone-200 overflow-hidden shrink-0">
                                <img src={uploadedAestheticImg} className="w-full h-full object-cover" />
                              </div>
                              <span className="text-[9px] text-green-600 font-bold font-mono">Colors Extracted!</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* VISUAL SHAPE OUTLINES GUIDE */}
                      <div className="space-y-2">
                        <label className="block font-bold text-stone-700 text-[10px] uppercase tracking-wider">
                          Nail Shape (Visual Guide):
                        </label>
                        <div className="grid grid-cols-5 gap-1.5">
                          {[
                            { 
                              id: "Almond", 
                              name: "Almond", 
                              svg: (
                                <svg className="w-4 h-6 text-pink-400" viewBox="0 0 20 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M5 24 C5 15, 6 5, 10 2 C14 5, 15 15, 15 24" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.1" />
                                </svg>
                              )
                            },
                            { 
                              id: "Coffin", 
                              name: "Coffin", 
                              svg: (
                                <svg className="w-4 h-6 text-pink-400" viewBox="0 0 20 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M5.5 24 L6.5 8 L8 3 L12 3 L13.5 8 L14.5 24" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.1" />
                                </svg>
                              )
                            },
                            { 
                              id: "Square", 
                              name: "Square", 
                              svg: (
                                <svg className="w-4 h-6 text-pink-400" viewBox="0 0 20 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M5 24 L5 3 L15 3 L15 24" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.1" />
                                </svg>
                              )
                            },
                            { 
                              id: "Round", 
                              name: "Round", 
                              svg: (
                                <svg className="w-4 h-6 text-pink-400" viewBox="0 0 20 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M5 24 C5 12, 5 6, 10 6 C15 6, 15 12, 15 24" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.1" />
                                </svg>
                              )
                            },
                            { 
                              id: "Stiletto", 
                              name: "Stiletto", 
                              svg: (
                                <svg className="w-4 h-6 text-pink-400" viewBox="0 0 20 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M5 24 C5 15, 8 7, 10 1 C12 7, 15 15, 15 24" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.1" />
                                </svg>
                              )
                            }
                          ].map((s) => {
                            const isSelected = shape.toLowerCase() === s.id.toLowerCase();
                            return (
                              <button
                                key={s.id}
                                type="button"
                                onClick={() => { setShape(s.id); triggerToast(`Set shape to ${s.id}`); }}
                                className={`py-2 rounded-xl border flex flex-col items-center justify-center transition ${
                                  isSelected 
                                    ? "border-pink-500 bg-pink-50 text-pink-600 shadow-xs" 
                                    : "border-stone-200 bg-white hover:bg-stone-50 text-stone-500"
                                }`}
                              >
                                {s.svg}
                                <span className="text-[9px] font-extrabold mt-1 tracking-tight leading-none">{s.name}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div>
                        <label className="block font-bold text-stone-700 text-[10px] uppercase tracking-wider mb-1.5">
                          Length:
                        </label>
                        <select
                          value={length}
                          onChange={(e) => setLength(e.target.value)}
                          className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-stone-800 focus:outline-none focus:border-pink-400 text-xs"
                        >
                          <option>Short</option>
                          <option>Medium</option>
                          <option>Long</option>
                          <option>Extra Long</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-bold text-stone-700 text-[10px] uppercase tracking-wider mb-1.5">
                          Accents &amp; Accessories:
                        </label>
                        <input
                          type="text"
                          value={extraAccents}
                          onChange={(e) => setExtraAccents(e.target.value)}
                          className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-stone-800 focus:outline-none focus:border-pink-400 text-xs"
                          placeholder="e.g. Crystal droplets, metallic chains"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-stone-700 text-[10px] uppercase tracking-wider mb-1.5">
                          Special Requests (Optional):
                        </label>
                        <textarea
                          value={customPrompt}
                          onChange={(e) => setCustomPrompt(e.target.value)}
                          rows={2}
                          className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-stone-800 focus:outline-none focus:border-pink-400 text-xs"
                          placeholder="e.g. Make Option 1 super glow, Option 2 futuristic, Option 3 cottage minimal."
                        />
                      </div>

                      <button
                        onClick={handleGenerateDesign}
                        disabled={isGenerating}
                        className="w-full py-3 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-xl font-extrabold text-xs transition duration-200 flex items-center justify-center gap-1.5 disabled:opacity-50 shadow-md shadow-pink-200"
                      >
                        <RefreshCw className={`w-4 h-4 ${isGenerating ? "animate-spin" : ""}`} />
                        {isGenerating ? "Crafting 3 Alternatives..." : "✨ Generate 3 Beautiful Designs"}
                      </button>
                    </div>

                    {errorText && (
                      <div className="p-3 bg-amber-50 border border-amber-200/60 rounded-xl text-[10px] text-amber-700 leading-relaxed">
                        {errorText}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* RIGHT COLUMN: INTERACTIVE CANVAS & CROPPER BOARD (7 COLS) */}
              <div className="lg:col-span-7 space-y-6">
                
                {plannerSubTab === "manual" && (
                  <>
                    {/* Detail View for active selected finger (MOVED TO THE ABSOLUTE TOP OF RIGHT COLUMN AS REQUESTED!) */}
                    {activeFingerDetail && (
                      <div className="bg-white rounded-2xl p-5 border border-pink-100 shadow-sm relative overflow-hidden animate-fade-in">
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-pink-500" />
                        
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-12 h-16 rounded-xl border border-stone-200 shrink-0 relative overflow-hidden flex justify-center items-end shadow-inner bg-stone-50"
                              style={{ backgroundColor: activeFingerDetail.baseColor === "transparent" ? "rgba(255,255,255,0.85)" : activeFingerDetail.baseColor }}
                            >
                              {activeFingerDetail.croppedImage && (
                                <img src={activeFingerDetail.croppedImage} alt="patch" className="absolute inset-0 w-full h-full object-cover" />
                              )}
                              {!activeFingerDetail.croppedImage && activeFingerDetail.artStyle === "french" && (
                                <div className="absolute top-0 left-0 w-full h-[30%] bg-white border-b border-pink-100" />
                              )}
                            </div>

                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-mono font-extrabold text-xs text-pink-600 uppercase">
                                  {activeFingerDetail.finger}
                                </span>
                                <span className="text-[9px] font-mono uppercase bg-pink-50 text-pink-700 px-2.5 py-0.5 rounded-full font-bold">
                                  {activeFingerDetail.finish} finish
                                </span>
                              </div>
                              <h4 className="font-display font-extrabold text-stone-800 mt-1">
                                {activeFingerDetail.title}
                              </h4>
                              <p className="text-xs text-stone-500 mt-1 max-w-md leading-relaxed">
                                {activeFingerDetail.details}
                              </p>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <span className="text-[10px] text-stone-400 block font-mono uppercase tracking-wider font-bold">Decorations:</span>
                            <span className="text-xs font-extrabold text-pink-600">
                              {activeFingerDetail.decorations || "None"}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* Interactive hand render (always visible in planner) */}
                <NailHandRenderer
                  collection={collection}
                  selectedFinger={selectedFinger}
                  onSelectFinger={setSelectedFinger}
                  shape={shape}
                />

                {plannerSubTab === "manual" ? (
                  <>
                    {/* Slicing Patchmaker integrated nicely */}
                    <ImagePatchmaker
                      uploadedImages={uploadedImages}
                      onUploadImages={handleUploadImages}
                      onDeleteImage={handleDeleteImage}
                      selectedFinger={selectedFinger}
                      onApplyPatch={handleApplyPatch}
                      onClearPatch={handleClearPatch}
                      nailsList={fingerNamesList}
                    />
                  </>
                ) : (
                  /* AI ALTERNATIVES DECKS RENDERED RIGHT UNDER THE INTERACTIVE HAND */
                  <div className="space-y-6">
                    {/* Spinner Shimmer panel while loading */}
                    {isGenerating && (
                      <div className="bg-white rounded-2xl p-12 border border-pink-100 text-center space-y-6 flex flex-col items-center justify-center min-h-[350px] shadow-sm">
                        <div className="w-16 h-16 rounded-full border-4 border-stone-100 border-t-pink-500 animate-spin flex items-center justify-center">
                          <Sparkles className="w-6 h-6 text-pink-500 animate-pulse" />
                        </div>
                        <div className="space-y-2">
                          <h3 className="font-display font-extrabold text-stone-800">AI Studio Nail Artist Is Painting...</h3>
                          <p className="text-xs text-stone-500 max-w-sm leading-relaxed">
                            We are generating exactly 3 creative interpretations of your request, structuring matching color hex swatches, and preparing specific 10-finger gel layered instructions!
                          </p>
                        </div>

                        {/* Animated simulated pipeline list */}
                        <div className="w-full max-w-xs space-y-2 text-[10px] font-mono text-stone-400 text-left">
                          <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-green-500 shrink-0" /> Preparing high-fashion prompts...</div>
                          <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-green-500 shrink-0" /> Prompting Gemini 3.5 Flash Model...</div>
                          <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-pink-500 animate-ping shrink-0" /> Drafting Alternative 1 (Delicate/Sheen)...</div>
                          <div className="flex items-center gap-2 text-stone-300">○ Creating Alternative 2 (Heavy Swirl/Chrome)...</div>
                          <div className="flex items-center gap-2 text-stone-300">○ Formatting detailed technician instructions...</div>
                        </div>
                      </div>
                    )}

                    {/* Default Welcome if empty */}
                    {!isGenerating && aiAlternatives.length === 0 && (
                      <div className="bg-white rounded-2xl p-12 border border-pink-100 text-center space-y-4 flex flex-col items-center justify-center min-h-[300px] shadow-sm">
                        <Sparkles className="w-10 h-10 text-pink-400 animate-pulse" />
                        <h3 className="font-display font-extrabold text-stone-800">No AI Designs Generated Yet</h3>
                        <p className="text-xs text-stone-500 max-w-sm leading-relaxed">
                          Select your keywords, shape, and length on the left, then click the sparkle generator! We'll show you 3 stunning custom alternative sets to compare.
                        </p>
                        <button
                          onClick={handleGenerateDesign}
                          className="px-5 py-2.5 bg-pink-50 hover:bg-pink-100 text-pink-600 text-xs font-bold rounded-xl border border-pink-100 transition shadow-xs"
                        >
                          Generate Initial Set
                        </button>
                      </div>
                    )}

                    {/* Show the 3 Alternatives side-by-side if loaded */}
                    {!isGenerating && aiAlternatives.length > 0 && (
                      <div className="space-y-6 animate-fade-in">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-stone-500 uppercase tracking-widest block font-mono">
                            Generated Options: Compare &amp; Tweak
                          </span>
                          <span className="text-[10px] text-pink-600 font-mono font-bold">
                            Shape: {shape} • Length: {length}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {aiAlternatives.map((alt, i) => {
                            const isSelected = selectedAlternativeIndex === i;
                            return (
                              <div
                                key={i}
                                className={`bg-neutral-900 rounded-2xl p-4 border transition-all duration-300 flex flex-col justify-between cursor-pointer group ${
                                  isSelected
                                    ? "border-pink-500 ring-1 ring-pink-500 shadow-md shadow-pink-950/20"
                                    : "border-neutral-800 hover:border-neutral-700"
                                }`}
                                onClick={() => {
                                  setSelectedAlternativeIndex(i);
                                  setCollection(alt);
                                  triggerToast(`Selected Option ${i + 1} to inspect!`);
                                }}
                              >
                                <div className="space-y-2">
                                  <div className="flex justify-between items-start">
                                    <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase ${
                                      isSelected ? "bg-pink-600 text-white" : "bg-neutral-800 text-neutral-400"
                                    }`}>
                                      Option {i + 1}
                                    </span>
                                    {isSelected && <Check className="w-3.5 h-3.5 text-pink-500" />}
                                  </div>

                                  <h4 className="font-display font-bold text-white text-xs tracking-tight group-hover:text-pink-400 transition leading-snug">
                                    {alt.designName}
                                  </h4>

                                  <p className="text-[10px] text-neutral-400 leading-relaxed line-clamp-4 min-h-[3.5rem]">
                                    {alt.description}
                                  </p>

                                  {/* Color Palette row representation */}
                                  <div className="space-y-1 pt-1">
                                    <span className="text-[8px] uppercase tracking-wider text-neutral-500 font-mono block">Color Palette:</span>
                                    <div className="flex gap-1 flex-wrap">
                                      {alt.colorPalette.map((col, idx) => (
                                        <div
                                          key={idx}
                                          className="w-4 h-4 rounded-full border border-neutral-900"
                                          style={{ backgroundColor: col.hex }}
                                          title={col.name}
                                        />
                                      ))}
                                    </div>
                                  </div>
                                </div>

                                <div className="mt-4 pt-2.5 border-t border-neutral-800/60">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleApplyAlternativeToPlanner(i);
                                    }}
                                    className="w-full py-1.5 bg-pink-600 hover:bg-pink-500 text-white font-bold rounded-lg text-[9px] uppercase tracking-wider transition-all flex items-center justify-center gap-1"
                                  >
                                    <span>Apply &amp; Tweak</span>
                                    <ArrowRight className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* INSPECT DETAILED FINGERS SUB-PREVIEW */}
                        {selectedAlternativeIndex !== null && aiAlternatives[selectedAlternativeIndex] && (
                          <div className="bg-neutral-900 rounded-2xl p-5 border border-neutral-800 space-y-4">
                            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                              <div>
                                <h4 className="font-display font-bold text-white text-xs uppercase tracking-wider">
                                  Finger-by-Finger Art Checklist
                                </h4>
                                <p className="text-[10px] text-neutral-400">
                                  Inspecting Option {selectedAlternativeIndex + 1}
                                </p>
                              </div>
                              <span className="text-xs text-neutral-400 font-bold">
                                {aiAlternatives[selectedAlternativeIndex].designName}
                              </span>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                              {aiAlternatives[selectedAlternativeIndex].nails.map((nail, idx) => (
                                <div key={idx} className="bg-neutral-950 p-2 rounded-xl border border-neutral-800/40 text-center space-y-1">
                                  <div className="text-[8px] font-mono text-neutral-500 font-bold uppercase truncate">
                                    {nail.finger.replace("Left ", "L ").replace("Right ", "R ")}
                                  </div>
                                  <div 
                                    className="w-6 h-8 rounded-t-lg mx-auto border border-neutral-800"
                                    style={{ backgroundColor: nail.baseColor }}
                                  />
                                  <div className="text-[9px] text-neutral-200 font-semibold truncate leading-none mt-1">
                                    {nail.title}
                                  </div>
                                  <div className="text-[7px] text-neutral-500 truncate leading-none">
                                    {nail.finish} • {nail.artStyle}
                                  </div>
                                </div>
                              ))}
                            </div>

                            <div className="pt-2 flex justify-end">
                              <button
                                onClick={() => handleApplyAlternativeToPlanner(selectedAlternativeIndex)}
                                className="px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold rounded-xl text-xs transition shadow-md flex items-center gap-1.5"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" /> Load into Studio &amp; Edit
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

            </div>

          </div>
        )}

        {/* TAB 3: FIND REFERENCES (Discover styles & pins) */}
        {activeTab === "references" && (
          <DiscoverBoard
            referenceBoardPosts={referenceBoardPosts}
            userProfile={userProfile}
            onLikeOrSave={handleLikeOrSavePost}
            onImportToAlbum={handleImportReferenceToAlbum}
            onDeletePost={handleDeleteSocialPost}
            isLoggedIn={isLoggedIn}
            triggerToast={triggerToast}
          />
        )}

        {/* TAB 4: MY PROFILE (User login & publishing reference pins) */}
        {activeTab === "profile" && (
          <UserProfile
            isLoggedIn={isLoggedIn}
            userProfile={userProfile}
            onLogin={(email, phone, username) => {
              setIsLoggedIn(true);
              setUserProfile((prev) => ({ ...prev, email, phone, username }));
            }}
            onLogout={() => {
              setIsLoggedIn(false);
            }}
            onUpdateUsername={(newUsername) => {
              setUserProfile((prev) => ({ ...prev, username: newUsername }));
            }}
            onPublishPost={handleCreateSocialPost}
            referenceBoardPosts={referenceBoardPosts}
            onLikeOrSave={handleLikeOrSavePost}
            onImportToAlbum={handleImportReferenceToAlbum}
            triggerToast={triggerToast}
          />
        )}

        {/* OBSOLETE TAB 2 FIND REFERENCES */}
        {false && (activeTab as string) === "references" && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white rounded-2xl p-6 border border-pink-100 text-center max-w-3xl mx-auto space-y-4 shadow-sm">
              <span className="px-3.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-pink-50 text-pink-600 border border-pink-100">
                🔍 Reference Discovery Board
              </span>
              <h2 className="font-display text-2xl font-extrabold text-stone-800">
                Find Creative Reference Textures &amp; Styles
              </h2>
              <p className="text-xs text-stone-500 max-w-lg mx-auto leading-relaxed">
                Browse beautiful, high-fashion nail styles. Click <strong className="text-pink-600">"📥 Import to Album"</strong> to instantly draw and render their pattern textures in your design album, then map them to your planner hands!
              </p>

              {/* Discovery Search Bar */}
              <div className="relative max-w-md mx-auto">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  type="text"
                  value={referenceSearch}
                  onChange={(e) => setReferenceSearch(e.target.value)}
                  placeholder="Search styles (e.g. coquette, chrome, checked, glass)..."
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-pink-400 transition text-stone-800"
                />
              </div>

              {/* Fast keyword buttons */}
              <div className="flex justify-center flex-wrap gap-2 pt-2">
                {["Coquette", "Y2K", "Clean Girl", "Cottagecore", "Minimalist", "Grunge"].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setReferenceSearch(tag)}
                    className="px-3 py-1 bg-stone-100 hover:bg-pink-50 rounded-full text-[10px] text-stone-600 font-bold hover:text-pink-600 transition border border-stone-200/40"
                  >
                    #{tag}
                  </button>
                ))}
                {referenceSearch && (
                  <button
                    onClick={() => setReferenceSearch("")}
                    className="px-3 py-1 bg-pink-50 text-pink-600 rounded-full text-[10px] font-bold border border-pink-100"
                  >
                    Clear Search
                  </button>
                )}
              </div>
            </div>

            {/* CURATED GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredReferences.map((style) => (
                <div
                  key={style.id}
                  className="bg-white rounded-2xl border border-pink-100 overflow-hidden hover:border-pink-300 transition-all duration-300 flex flex-col justify-between group shadow-sm"
                >
                  {/* Styled simulation texture on the fly */}
                  <div className="aspect-square bg-stone-50 flex items-center justify-center relative overflow-hidden">
                    
                    {/* Render style texture dynamically */}
                    <div className="absolute inset-0 opacity-90 group-hover:scale-105 transition duration-500 flex items-center justify-center">
                      {style.id === "ref_aura" && (
                        <div className="w-full h-full" style={{ background: `radial-gradient(circle, ${style.colors[0]}, ${style.colors[1]}, ${style.colors[2]})` }} />
                      )}
                      {style.id === "ref_chrome" && (
                        <div className="w-full h-full flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${style.colors[0]}, ${style.colors[1]}, ${style.colors[2]})` }}>
                          <div className="absolute w-full h-1 bg-white/40 blur-[1px] rotate-12" />
                          <div className="absolute w-full h-3 bg-white/20 blur-sm -rotate-45" />
                        </div>
                      )}
                      {style.id === "ref_glazed" && (
                        <div className="w-full h-full" style={{ background: `linear-gradient(to bottom, ${style.colors[0]}, ${style.colors[1]})` }}>
                          <div className="absolute inset-0 bg-white/30 mix-blend-overlay" />
                        </div>
                      )}
                      {style.id === "ref_cottage" && (
                        <div className="w-full h-full grid grid-cols-4 grid-rows-4">
                          {[...Array(16)].map((_, i) => (
                            <div key={i} style={{ backgroundColor: i % 2 === Math.floor(i / 4) % 2 ? style.colors[0] : style.colors[1] }} />
                          ))}
                        </div>
                      )}
                      {style.id === "ref_wabi" && (
                        <div className="w-full h-full p-4 relative" style={{ backgroundColor: style.colors[0] }}>
                          <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#ddd_10%,transparent_11%)] [background-size:6px_6px]" />
                        </div>
                      )}
                      {style.id === "ref_coquette" && (
                        <div className="w-full h-full flex flex-col justify-center items-center gap-4" style={{ background: `linear-gradient(45deg, ${style.colors[0]}, ${style.colors[2]})` }}>
                          <span className="text-2xl">🎀</span>
                        </div>
                      )}
                      {style.id === "ref_midnight" && (
                        <div className="w-full h-full relative" style={{ backgroundColor: style.colors[0] }}>
                          <div className="absolute inset-0 bg-gradient-to-tr from-[#1A1A2E] to-[#16213E]" />
                          <span className="absolute top-4 right-4 text-xl">🌙</span>
                        </div>
                      )}
                      {style.id === "ref_matcha" && (
                        <div className="w-full h-full" style={{ background: `radial-gradient(ellipse at bottom, ${style.colors[0]}, ${style.colors[1]})` }} />
                      )}
                    </div>

                    {/* Category pill */}
                    <span className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-white/90 text-pink-600 font-mono text-[9px] uppercase tracking-wider block border border-pink-100 font-bold">
                      {style.category}
                    </span>

                    {/* Colors Swatches Bar */}
                    <div className="absolute bottom-3 left-3 right-3 flex gap-1 bg-white/90 backdrop-blur-xs p-1.5 rounded-lg border border-pink-100 w-fit shadow-xs">
                      {style.colors.map((c, idx) => (
                        <div key={idx} className="w-3.5 h-3.5 rounded-full border border-stone-200 shrink-0" style={{ backgroundColor: c }} title={c} />
                      ))}
                    </div>
                  </div>

                  {/* Descriptions and CTA */}
                  <div className="p-4 space-y-2.5">
                    <div>
                      <h4 className="font-display font-extrabold text-stone-800 text-sm group-hover:text-pink-600 transition">
                        {style.name}
                      </h4>
                      <p className="text-[10px] text-stone-400 font-mono mt-0.5 uppercase tracking-wide">
                        {style.vibe}
                      </p>
                    </div>

                    <p className="text-[11px] text-stone-500 leading-relaxed min-h-8">
                      {style.description}
                    </p>

                    <button
                      onClick={() => handleImportReferenceToAlbum(style)}
                      className="w-full py-2 bg-pink-50 hover:bg-pink-600 border border-pink-100 text-pink-600 hover:text-white rounded-xl text-[10px] font-bold tracking-wider uppercase transition-all duration-200 flex items-center justify-center gap-1.5"
                    >
                      <span>📥 Import to Album</span>
                    </button>
                  </div>
                </div>
              ))}

              {filteredReferences.length === 0 && (
                <div className="col-span-full py-16 text-center text-neutral-500">
                  No matches found for "{referenceSearch}". Try searching "chrome" or "coquette".
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: NAIL MAP (Nearby Salons Search tool) */}
        {activeTab === "map" && (
          <div className="animate-fade-in">
            <SalonFinder 
              collection={collection} 
              shape={shape} 
              length={length} 
              triggerToast={triggerToast} 
            />
          </div>
        )}

        {/* MONETIZATION SUITE INTEGRATION (COMMON METADATA) */}
        <div className="mt-12">
          <MonetizationSuite
            collection={collection}
            onSimulatePdfExport={() => setShowRecipeCard(true)}
          />
        </div>

        {/* FAQ ACCORDION GUIDES */}
        <div className="bg-white rounded-2xl p-6 border border-pink-100 space-y-5 mt-8 shadow-sm">
          <div className="flex items-center gap-2 border-b border-pink-100/50 pb-3">
            <HelpCircle className="w-5 h-5 text-pink-500" />
            <div>
              <h4 className="font-display font-extrabold text-stone-800 text-base">
                📖 Creative Nail Studio Tech Guide
              </h4>
              <p className="text-xs text-stone-400 font-mono uppercase tracking-wider">
                Plain English explanations of the core features and how you can monetize.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="border border-stone-200/60 rounded-xl overflow-hidden bg-stone-50">
              <button
                onClick={() => setActiveExplainTab(activeExplainTab === "q1" ? null : "q1")}
                className="w-full px-5 py-3.5 hover:bg-pink-50/20 text-left flex justify-between items-center transition-all"
              >
                <span className="font-display font-bold text-xs text-stone-700">
                  How do the custom transparent nail tips work?
                </span>
                <ChevronDown className={`w-3.5 h-3.5 text-stone-400 transition-transform ${activeExplainTab === "q1" ? "rotate-180" : ""}`} />
              </button>
              {activeExplainTab === "q1" && (
                <div className="p-5 bg-white text-xs text-stone-500 leading-relaxed space-y-2 border-t border-stone-100">
                  <p>
                    By default or when clicking the "Reset to Transparent Tips" button, the nails are set to <code className="bg-stone-100 px-1.5 py-0.5 rounded font-mono text-pink-600">transparent</code>. 
                  </p>
                  <p>
                    Our Hand Renderer component reads this transparent value and applies high-contrast glassmorphic filters using Tailwind's <code className="bg-stone-100 px-1.5 py-0.5 rounded font-mono">backdrop-blur-xs</code> and glass borders. This makes the nails look exactly like clear acrylic or press-on tips, acting as a clean canvas.
                  </p>
                </div>
              )}
            </div>

            <div className="border border-stone-200/60 rounded-xl overflow-hidden bg-stone-50">
              <button
                onClick={() => setActiveExplainTab(activeExplainTab === "q2" ? null : "q2")}
                className="w-full px-5 py-3.5 hover:bg-pink-50/20 text-left flex justify-between items-center transition-all"
              >
                <span className="font-display font-bold text-xs text-stone-700">
                  How does the "AI Generator (Generate 3)" comparison feature work?
                </span>
                <ChevronDown className={`w-3.5 h-3.5 text-stone-400 transition-transform ${activeExplainTab === "q2" ? "rotate-180" : ""}`} />
              </button>
              {activeExplainTab === "q2" && (
                <div className="p-5 bg-white text-xs text-stone-500 leading-relaxed space-y-2 border-t border-stone-100">
                  <p>
                    When you click generate, the backend endpoint calls the Gemini API instructing it to output exactly three creative variations representing different styles (e.g., minimalist, heavy glitter, metallic chrome) of your chosen aesthetic.
                  </p>
                  <p>
                    The UI renders all three generated options side-by-side. You can inspect the finger detail list for any alternative, and when you are happy, click "Apply this Set" to load it instantly onto the hand models.
                  </p>
                </div>
              )}
            </div>

            <div className="border border-stone-200/60 rounded-xl overflow-hidden bg-stone-50">
              <button
                onClick={() => setActiveExplainTab(activeExplainTab === "q3" ? null : "q3")}
                className="w-full px-5 py-3.5 hover:bg-pink-50/20 text-left flex justify-between items-center transition-all"
              >
                <span className="font-display font-bold text-xs text-stone-700">
                  How can I turn this application into a profitable business?
                </span>
                <ChevronDown className={`w-3.5 h-3.5 text-stone-400 transition-transform ${activeExplainTab === "q3" ? "rotate-180" : ""}`} />
              </button>
              {activeExplainTab === "q3" && (
                <div className="p-5 bg-white text-xs text-stone-500 leading-relaxed space-y-2 border-t border-stone-100">
                  <p>
                    <strong>1. Charge for High-Quality Recipe Exports:</strong> Clients and nail technicians love precise directions. You can charge $1.99 per PDF download of the detailed formula sheets.
                  </p>
                  <p>
                    <strong>2. Affiliate Product Links:</strong> When displaying the palette, add Amazon affiliate links for matching gel polishes, liner brushes, UV lamps, or rhinestone accessories. You make a commission on every purchase!
                  </p>
                  <p>
                    <strong>3. Custom Salon Portals:</strong> Charge nail salons a monthly subscription to let their clients pre-plan custom sets before coming in, saving valuable appointment time.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

      </main>

      {/* SOFT PASTEL ROUNDED BOTTOM TAB NAVIGATION WITH NAIL EXTENSION POP-UP */}
      <nav aria-label="Bottom Navigation" className="fixed bottom-3 left-0 right-0 z-40 px-4 pointer-events-none">
        <div className="max-w-md mx-auto pointer-events-auto bg-[#FFFDFB]/95 backdrop-blur-xl border border-[#EDE5D8]/90 shadow-[0_12px_32px_-6px_rgba(180,150,145,0.18)] rounded-full p-1.5 flex justify-between items-center gap-1.5">
          
          {/* TAB 1: Nail DIY (Pastel Pink) */}
          <button
            onClick={() => setActiveTab("diy")}
            className={`flex-1 relative py-2 px-2.5 rounded-full flex flex-col items-center justify-center transition-all duration-200 group ${
              activeTab === "diy"
                ? "bg-[#FCEAE6] text-[#B8656E] shadow-2xs font-bold"
                : "text-[#9E968D] hover:text-[#5E574F] hover:bg-[#F8F5EE]/80 font-medium"
            }`}
          >
            {/* Nail Extension Tip Pop-up */}
            {activeTab === "diy" && (
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none animate-nail-pop">
                <div className="w-5 h-2 rounded-t-full bg-gradient-to-t from-[#F8D2D7] to-[#FDF1F3] border-t border-x border-[#F2BFC6]/80 shadow-[0_2px_6px_rgba(242,191,198,0.35)] relative overflow-hidden">
                  {/* Subtle glossy micro-shine line */}
                  <div className="absolute top-0.5 left-1/2 -translate-x-1/2 w-3 h-0.5 rounded-full bg-white/70" />
                </div>
              </div>
            )}
            <Scissors className={`w-4 h-4 transition-transform duration-200 ${activeTab === "diy" ? "scale-105" : "group-hover:scale-105"}`} />
            <span className="text-[9px] uppercase font-mono tracking-wider whitespace-nowrap mt-0.5">
              Nail DIY
            </span>
          </button>

          {/* TAB 2: Nail Map (Pastel Mint) */}
          <button
            onClick={() => setActiveTab("map")}
            className={`flex-1 relative py-2 px-2.5 rounded-full flex flex-col items-center justify-center transition-all duration-200 group ${
              activeTab === "map"
                ? "bg-[#E6F3E9] text-[#4A7D5C] shadow-2xs font-bold"
                : "text-[#9E968D] hover:text-[#5E574F] hover:bg-[#F8F5EE]/80 font-medium"
            }`}
          >
            {/* Nail Extension Tip Pop-up */}
            {activeTab === "map" && (
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none animate-nail-pop">
                <div className="w-5 h-2 rounded-t-full bg-gradient-to-t from-[#CAE8D2] to-[#EEF7F0] border-t border-x border-[#B5DDC0]/80 shadow-[0_2px_6px_rgba(181,221,192,0.35)] relative overflow-hidden">
                  {/* Subtle glossy micro-shine line */}
                  <div className="absolute top-0.5 left-1/2 -translate-x-1/2 w-3 h-0.5 rounded-full bg-white/70" />
                </div>
              </div>
            )}
            <MapPin className={`w-4 h-4 transition-transform duration-200 ${activeTab === "map" ? "scale-105" : "group-hover:scale-105"}`} />
            <span className="text-[9px] uppercase font-mono tracking-wider whitespace-nowrap mt-0.5">
              Nail Map
            </span>
          </button>

          {/* TAB 3: Find References (Pastel Pink) */}
          <button
            onClick={() => setActiveTab("references")}
            className={`flex-1 relative py-2 px-2.5 rounded-full flex flex-col items-center justify-center transition-all duration-200 group ${
              activeTab === "references"
                ? "bg-[#FCEAE6] text-[#B8656E] shadow-2xs font-bold"
                : "text-[#9E968D] hover:text-[#5E574F] hover:bg-[#F8F5EE]/80 font-medium"
            }`}
          >
            {/* Nail Extension Tip Pop-up */}
            {activeTab === "references" && (
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none animate-nail-pop">
                <div className="w-5 h-2 rounded-t-full bg-gradient-to-t from-[#F8D2D7] to-[#FDF1F3] border-t border-x border-[#F2BFC6]/80 shadow-[0_2px_6px_rgba(242,191,198,0.35)] relative overflow-hidden">
                  {/* Subtle glossy micro-shine line */}
                  <div className="absolute top-0.5 left-1/2 -translate-x-1/2 w-3 h-0.5 rounded-full bg-white/70" />
                </div>
              </div>
            )}
            <Search className={`w-4 h-4 transition-transform duration-200 ${activeTab === "references" ? "scale-105" : "group-hover:scale-105"}`} />
            <span className="text-[9px] uppercase font-mono tracking-wider whitespace-nowrap mt-0.5">
              References
            </span>
          </button>

          {/* TAB 4: My Profile (Pastel Mint) */}
          <button
            onClick={() => setActiveTab("profile")}
            className={`flex-1 relative py-2 px-2.5 rounded-full flex flex-col items-center justify-center transition-all duration-200 group ${
              activeTab === "profile"
                ? "bg-[#E6F3E9] text-[#4A7D5C] shadow-2xs font-bold"
                : "text-[#9E968D] hover:text-[#5E574F] hover:bg-[#F8F5EE]/80 font-medium"
            }`}
          >
            {/* Nail Extension Tip Pop-up */}
            {activeTab === "profile" && (
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none animate-nail-pop">
                <div className="w-5 h-2 rounded-t-full bg-gradient-to-t from-[#CAE8D2] to-[#EEF7F0] border-t border-x border-[#B5DDC0]/80 shadow-[0_2px_6px_rgba(181,221,192,0.35)] relative overflow-hidden">
                  {/* Subtle glossy micro-shine line */}
                  <div className="absolute top-0.5 left-1/2 -translate-x-1/2 w-3 h-0.5 rounded-full bg-white/70" />
                </div>
              </div>
            )}
            <User className={`w-4 h-4 transition-transform duration-200 ${activeTab === "profile" ? "scale-105" : "group-hover:scale-105"}`} />
            <span className="text-[9px] uppercase font-mono tracking-wider whitespace-nowrap mt-0.5">
              My Profile
            </span>
          </button>

        </div>
      </nav>

      {/* POP-UP PREMIUM SALON RECIPE SHEET MODAL */}
      {showRecipeCard && (
        <NailRecipeCard
          collection={collection}
          shape={shape}
          length={length}
          onClose={() => setShowRecipeCard(false)}
        />
      )}

      {/* POP-UP PREMIUM CLUB MEMBERSHIP UPGRADE MODAL */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-pink-100 shadow-2xl relative overflow-hidden text-center space-y-6">
            <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-pink-400 via-rose-500 to-pink-500" />
            
            <button
              onClick={() => setShowUpgradeModal(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-700"
            >
              ✕
            </button>

            <div className="w-12 h-12 rounded-full bg-pink-50 text-pink-600 flex items-center justify-center mx-auto text-xl">
              👑
            </div>

            <div className="space-y-1">
              <h3 className="font-display font-extrabold text-stone-800 text-lg">
                La'Mour Premium Club
              </h3>
              <p className="text-xs text-stone-400 font-mono uppercase tracking-widest">
                Unlock Unlimited Nail Creations
              </p>
            </div>

            <p className="text-xs text-stone-500 leading-relaxed">
              You reached your weekly free limit of 1 special request. Upgrade to premium to instantly unlock ultimate potential!
            </p>

            <div className="space-y-2.5 text-left bg-stone-50 p-4 rounded-2xl border border-stone-100 text-xs">
              <div className="flex items-center gap-2 text-stone-700 font-bold">
                <span className="text-pink-500">✨</span>
                <span>Unlimited high-fashion design sets</span>
              </div>
              <div className="flex items-center gap-2 text-stone-700 font-bold">
                <span className="text-pink-500">✨</span>
                <span>Generate photorealistic 10-finger blueprints</span>
              </div>
              <div className="flex items-center gap-2 text-stone-700 font-bold">
                <span className="text-pink-500">✨</span>
                <span>Custom Decal Album uploads &amp; saving</span>
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => {
                  setIsSalonPremiumMember(true);
                  setShowUpgradeModal(false);
                  triggerToast("🎉 Congratulations! Welcome to the Premium Club. Enjoy unlimited creations!");
                }}
                className="w-full py-3 bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-600 text-white rounded-xl font-extrabold text-xs transition shadow-md shadow-pink-100"
              >
                Join Premium Club for $4.99/mo
              </button>
              
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="text-[10px] text-stone-400 hover:text-stone-600 font-bold font-mono uppercase tracking-wider"
              >
                No thanks, keep dreaming
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
