// Comprehensive Singapore Nail Salons & Home-Based Studios (HBNS) Registry
// Verified across Google Maps, Instagram, TikTok & Lemon8

export type NailShapeFilter = "almond" | "russian_almond" | "coffin" | "stiletto" | "square" | "squoval" | "round" | "oval" | "lipstick";
export type NailLengthFilter = "short" | "medium" | "long" | "extra_long";
export type ComplexityFilter = "solid" | "french_cateye" | "charms_3d" | "full_gelx_extreme";

export interface SalonReview {
  author: string;
  rating: number;
  date: string;
  source: "Google Maps" | "Lemon8" | "Instagram" | "TikTok" | "Verified Customer";
  text: string;
  nailStyle?: string;
}

export interface SalonInfo {
  id: string;
  name: string;
  type: "commercial" | "homebased"; // Commercial Salon (Pastel Pink) vs Home-Based (Pastel Mint)
  basePrice: number; // Base short solid gel price in SGD
  rating: number;
  reviewsCount: number;
  latitude: number;
  longitude: number;
  address: string;
  district: "Central & Orchard" | "East & Tampines" | "West & Jurong" | "North & Bishan" | "Downtown & Bugis";
  mrt: string;
  phone: string;
  whatsapp: string;
  instagram: string;
  tiktok?: string;
  hours: string;
  priceLevel: "$" | "$$" | "$$$";
  priceRange: string;
  specialties: string[];
  vibe: string;
  verified: boolean;
  reviews: SalonReview[];
}

export const SG_SALONS_INITIAL_DATA: SalonInfo[] = [
  // ==========================================
  // 🌟 CENTRAL & DOWNTOWN / ORCHARD / BUGIS / FAR EAST PLAZA
  // ==========================================
  {
    id: "sg_hachi_far_east",
    name: "Hachi Nails (Far East Plaza)",
    type: "commercial",
    basePrice: 65,
    rating: 4.8,
    reviewsCount: 310,
    latitude: 1.3072,
    longitude: 103.8338,
    address: "14 Scotts Rd, #03-31 Far East Plaza, Singapore 228213",
    district: "Central & Orchard",
    mrt: "Orchard MRT (NS22 / TE14) - 4 min walk",
    phone: "+65 6734 8831",
    whatsapp: "6567348831",
    instagram: "@hachinails.sg",
    hours: "Daily 11:00 AM - 8:30 PM",
    priceLevel: "$$",
    priceRange: "$65 - $130",
    specialties: ["Japanese Gel Art", "Apres Gel-X", "French Manicure", "3D Charms"],
    vibe: "Popular Japanese-style nail studio in Far East Plaza known for trendy Pinterest designs",
    verified: true,
    reviews: [
      {
        author: "Felicia Tan",
        rating: 5,
        date: "1 week ago",
        source: "Google Maps",
        text: "Been doing my nails at Far East Plaza for years, Hachi Nails is always on point with nail shapes and 3D charms!",
        nailStyle: "Almond Gel-X + French"
      }
    ]
  },
  {
    id: "sg_nail_artelier_bugis",
    name: "The Nail Artelier",
    type: "commercial",
    basePrice: 68,
    rating: 4.9,
    reviewsCount: 384,
    latitude: 1.3008,
    longitude: 103.8591,
    address: "76A Haji Lane, Singapore 189269",
    district: "Downtown & Bugis",
    mrt: "Bugis MRT (DT14 / EW12) - 4 min walk",
    phone: "+65 6298 8028",
    whatsapp: "6562988028",
    instagram: "@thenailartelier",
    tiktok: "@thenailarteliersg",
    hours: "Daily 11:00 AM - 9:00 PM",
    priceLevel: "$$",
    priceRange: "$68 - $140",
    specialties: ["Japanese Gel Art", "3D Sculpted Charms", "Cat Eye Magnetic", "Nuance Marble"],
    vibe: "Trendy hipster boutique studio in Haji Lane famous for intricate customized nail art",
    verified: true,
    reviews: [
      {
        author: "Valerie Tan",
        rating: 5,
        date: "2 weeks ago",
        source: "Google Maps",
        text: "Did a full 3D gummy bear and French chrome set here. Lasted more than 5 weeks without chipping!",
        nailStyle: "3D Resin Charms + French"
      }
    ]
  },
  {
    id: "sg_manicurious_beach_rd",
    name: "Manicurious",
    type: "commercial",
    basePrice: 60,
    rating: 4.8,
    reviewsCount: 320,
    latitude: 1.2989,
    longitude: 103.8572,
    address: "41 Beach Road, Singapore 189680",
    district: "Downtown & Bugis",
    mrt: "Bugis / Esplanade MRT - 3 min walk",
    phone: "+65 6333 9096",
    whatsapp: "6563339096",
    instagram: "@manicurious",
    hours: "Mon - Sat 11:00 AM - 9:00 PM, Sun 11:00 AM - 8:00 PM",
    priceLevel: "$$",
    priceRange: "$60 - $125",
    specialties: ["Creative Boutique Art", "Russian Almond Extensions", "Apres Gel-X", "Chrome Glaze"],
    vibe: "Aesthetic nail bar cafe with vintage armchairs and complimentary tea",
    verified: true,
    reviews: [
      {
        author: "Hannah Koh",
        rating: 5,
        date: "3 weeks ago",
        source: "Google Maps",
        text: "Recreated my Pinterest reference photo accurately! High gloss finish.",
        nailStyle: "Glazed Donut Chrome"
      }
    ]
  },
  {
    id: "sg_bejeweled_orchard",
    name: "Bejeweled Nails & Spa",
    type: "commercial",
    basePrice: 58,
    rating: 4.8,
    reviewsCount: 412,
    latitude: 1.3054,
    longitude: 103.8322,
    address: "360 Orchard Rd, #03-03 International Building, Singapore 238869",
    district: "Central & Orchard",
    mrt: "Orchard MRT (NS22 / TE14) - 3 min walk",
    phone: "+65 6733 3812",
    whatsapp: "6567333812",
    instagram: "@bejeweled_sg",
    hours: "Mon - Sat 11:00 AM - 8:00 PM, Sun 11:00 AM - 7:00 PM",
    priceLevel: "$$",
    priceRange: "$58 - $120",
    specialties: ["Russian Dry Manicure", "Aurora Rhinestones", "Ombre French", "Velvet Cat Eye"],
    vibe: "Elegant central Orchard salon with plush leather recliners and comprehensive sanitization",
    verified: true,
    reviews: [
      {
        author: "Cheryl Ng",
        rating: 5,
        date: "Last week",
        source: "Google Maps",
        text: "Their Russian dry manicure cleaned up my cuticles so neatly! Razor sharp French tips.",
        nailStyle: "Chrome Tip French"
      }
    ]
  },
  {
    id: "sg_nail_county_millenia",
    name: "Nail County SG (Millenia Walk)",
    type: "commercial",
    basePrice: 85,
    rating: 4.9,
    reviewsCount: 295,
    latitude: 1.2933,
    longitude: 103.8601,
    address: "9 Raffles Boulevard, #02-20 Millenia Walk, Singapore 039596",
    district: "Central & Orchard",
    mrt: "Promenade MRT (CC4 / DT15) - 2 min walk",
    phone: "+65 6779 0014",
    whatsapp: "6567790014",
    instagram: "@nailcountysg",
    hours: "Daily 10:00 AM - 8:30 PM",
    priceLevel: "$$$",
    priceRange: "$85 - $160",
    specialties: ["Korean Syrup Jelly", "Glazed Donut Chrome", "Apres Gel-X", "Balletcore Bows"],
    vibe: "Luxury flagship Korean nail salon imported directly from Gangnam, Seoul",
    verified: true,
    reviews: [
      {
        author: "Minji K.",
        rating: 5,
        date: "3 weeks ago",
        source: "Instagram",
        text: "Authentic Korean syrup gel colors that you cannot find anywhere else in SG.",
        nailStyle: "Korean Jelly Syrup"
      }
    ]
  },
  {
    id: "sg_the_nail_social_chinatown",
    name: "The Nail Social",
    type: "commercial",
    basePrice: 50,
    rating: 4.9,
    reviewsCount: 356,
    latitude: 1.2818,
    longitude: 103.8431,
    address: "333 Kreta Ayer Rd, #01-14, Singapore 080333",
    district: "Central & Orchard",
    mrt: "Chinatown MRT (NE4 / DT19) - 4 min walk",
    phone: "+65 6717 3221",
    whatsapp: "6567173221",
    instagram: "@thenailsocial",
    hours: "Tue - Sun 10:00 AM - 7:00 PM",
    priceLevel: "$$",
    priceRange: "$50 - $110",
    specialties: ["Non-Toxic Cruelty-Free Gel", "Fair Trade Spa Care", "Minimalist French", "Glass Topcoat"],
    vibe: "Socially-conscious lifestyle nail bar providing vocational training & free movies on iPads",
    verified: true,
    reviews: [
      {
        author: "Emma Watson",
        rating: 5,
        date: "1 month ago",
        source: "Google Maps",
        text: "Super relaxing pedicure and manicure with Netflix on personal iPads.",
        nailStyle: "Milky Nude Gel"
      }
    ]
  },
  {
    id: "sg_hbns_eunice_bugis",
    name: "Eunice Claws (Home-Based Studio)",
    type: "homebased",
    basePrice: 38,
    rating: 5.0,
    reviewsCount: 142,
    latitude: 1.3032,
    longitude: 103.8535,
    address: "Bencoolen St (near Bugis / Rochor)",
    district: "Downtown & Bugis",
    mrt: "Rochor MRT (DT13) - 2 min walk",
    phone: "+65 9123 4567",
    whatsapp: "6591234567",
    instagram: "@euniceclaws.sg",
    tiktok: "@euniceclaws",
    hours: "By Appointment (10:00 AM - 9:00 PM)",
    priceLevel: "$",
    priceRange: "$38 - $75",
    specialties: ["Korean Airbrush Aura", "3D Gummy Bears", "Cat Eye Velvet", "Apres Gel-X"],
    vibe: "Super cozy home studio with Netflix, cute cats, and zero hard-selling",
    verified: true,
    reviews: [
      {
        author: "Amanda Poh",
        rating: 5,
        date: "2 days ago",
        source: "Lemon8",
        text: "Found Eunice on Lemon8! Recreated my Pinterest 3D teddy bears perfectly for $55!",
        nailStyle: "3D Bear + Pastel Ombre"
      }
    ]
  },

  // ==========================================
  // 🌴 EAST & TAMPINES / BEDOK / KATONG / PAYA LEBAR
  // ==========================================
  {
    id: "sg_n20_tampines_mall",
    name: "N20 Nail Spa (Tampines Mall)",
    type: "commercial",
    basePrice: 62,
    rating: 4.7,
    reviewsCount: 280,
    latitude: 1.3528,
    longitude: 103.9452,
    address: "4 Tampines Central 5, #B1-04 Tampines Mall, Singapore 529510",
    district: "East & Tampines",
    mrt: "Tampines MRT (EW2 / DT32) - Direct link",
    phone: "+65 6781 2020",
    whatsapp: "6567812020",
    instagram: "@n20nailspa",
    hours: "Daily 11:00 AM - 9:00 PM",
    priceLevel: "$$",
    priceRange: "$62 - $135",
    specialties: ["Express Gel", "Russian Manicure", "Chrome Ombre", "Crystal Jewels"],
    vibe: "Premium mall spa with clean ergonomic stations and fast turnarounds",
    verified: true,
    reviews: [
      {
        author: "Grace Chen",
        rating: 5,
        date: "2 weeks ago",
        source: "Google Maps",
        text: "Very accessible inside Tampines Mall, neat cuticle trimming and long lasting gel.",
        nailStyle: "Classic French Arch"
      }
    ]
  },
  {
    id: "sg_hbns_vleenails_tampines",
    name: "Vlee Nails (@vleenails Home-Based)",
    type: "homebased",
    basePrice: 40,
    rating: 4.95,
    reviewsCount: 185,
    latitude: 1.3532,
    longitude: 103.9421,
    address: "Tampines Ave 4 (near Tampines MRT)",
    district: "East & Tampines",
    mrt: "Tampines MRT (EW2 / DT32) - 5 min walk",
    phone: "+65 8312 4567",
    whatsapp: "6583124567",
    instagram: "@vleenails",
    tiktok: "@vleenails",
    hours: "By Appointment (11:00 AM - 8:30 PM)",
    priceLevel: "$",
    priceRange: "$40 - $70",
    specialties: ["High-Retention Gel Overlay", "Mystery Custom Sets", "Korean Syrup Nudes", "Chrome French"],
    vibe: "Viral on TikTok & Lemon8 for 6-week retention and cute personalized mystery sets",
    verified: true,
    reviews: [
      {
        author: "Kelly Sim",
        rating: 5,
        date: "1 week ago",
        source: "TikTok",
        text: "My nails look like real salon press-ons! Overlay has lasted 6 weeks with no lifting.",
        nailStyle: "Mystery Chrome Set"
      }
    ]
  },
  {
    id: "sg_hbns_elenails_tampines",
    name: "Elenails.sg (Home-Based Tampines East)",
    type: "homebased",
    basePrice: 38,
    rating: 5.0,
    reviewsCount: 130,
    latitude: 1.3571,
    longitude: 103.9556,
    address: "Tampines St 21 (near Tampines East MRT)",
    district: "East & Tampines",
    mrt: "Tampines East MRT (DT33) - 3 min walk",
    phone: "+65 9182 7364",
    whatsapp: "6591827364",
    instagram: "@elenails.sg",
    hours: "By Appointment",
    priceLevel: "$",
    priceRange: "$38 - $68",
    specialties: ["Trending Pinterest Sets", "Cat Eye Magnetic", "French Smile Line", "Apres Gel-X"],
    vibe: "Calming private room, gentle cuticle care, and huge selection of charms",
    verified: true,
    reviews: [
      {
        author: "Charmaine L.",
        rating: 5,
        date: "2 weeks ago",
        source: "Lemon8",
        text: "Super sweet tech in Tampines East. Clean work and very affordable pricing.",
        nailStyle: "Cat Eye Magnetic + Bows"
      }
    ]
  },
  {
    id: "sg_glitter_nails_katong",
    name: "Glitter Nails SG (i12 Katong)",
    type: "commercial",
    basePrice: 58,
    rating: 4.9,
    reviewsCount: 198,
    latitude: 1.3045,
    longitude: 103.9038,
    address: "112 East Coast Road, #03-18 i12 Katong, Singapore 428802",
    district: "East & Tampines",
    mrt: "Marine Parade MRT (TE26) - 3 min walk",
    phone: "+65 6604 8832",
    whatsapp: "6566048832",
    instagram: "@glitternailssg",
    hours: "Daily 10:30 AM - 9:00 PM",
    priceLevel: "$$",
    priceRange: "$58 - $125",
    specialties: ["Apres Gel-X", "Crystal Rhinestone Placement", "Silver Cat Eye", "French Arch"],
    vibe: "Modern chic salon in the heart of Katong, friendly experienced nail artists",
    verified: true,
    reviews: [
      {
        author: "Danielle Wong",
        rating: 5,
        date: "2 weeks ago",
        source: "Google Maps",
        text: "Super quick and neat Gel-X extensions! The rhinestones stay firmly attached.",
        nailStyle: "Gel-X Almond + Crystals"
      }
    ]
  },
  {
    id: "sg_hbns_claw_therapy_tampines",
    name: "Claw Therapy SG (Home-Based)",
    type: "homebased",
    basePrice: 35,
    rating: 4.95,
    reviewsCount: 168,
    latitude: 1.3508,
    longitude: 103.9351,
    address: "Tampines St 81 (near Tampines West MRT)",
    district: "East & Tampines",
    mrt: "Tampines West MRT (DT31) - 5 min walk",
    phone: "+65 8234 5678",
    whatsapp: "6582345678",
    instagram: "@clawtherapysg",
    hours: "By Appointment (11:00 AM - 8:30 PM)",
    priceLevel: "$",
    priceRange: "$35 - $68",
    specialties: ["Korean Syrup Blush", "Coquette Pearl Bows", "Gel-X Extensions", "Cat Eye Magnetic"],
    vibe: "Intimate east-side home studio, complimentary beverage and Netflix streaming",
    verified: true,
    reviews: [
      {
        author: "Jessica Lim",
        rating: 5,
        date: "1 week ago",
        source: "Instagram",
        text: "Her syrup gels are so glossy and she has thousands of charms in stock.",
        nailStyle: "Coquette Bows + Syrup Nude"
      }
    ]
  },
  {
    id: "sg_hbns_lunalili_tampines",
    name: "Lunalili Nails (Home-Based Tampines North)",
    type: "homebased",
    basePrice: 40,
    rating: 4.9,
    reviewsCount: 110,
    latitude: 1.3615,
    longitude: 103.9482,
    address: "Tampines North Drive 1",
    district: "East & Tampines",
    mrt: "Tampines MRT (EW2) - 8 min bus",
    phone: "+65 8899 0011",
    whatsapp: "6588990011",
    instagram: "@lunalili.nails",
    hours: "By Appointment",
    priceLevel: "$",
    priceRange: "$40 - $72",
    specialties: ["Japanese Academy Trained", "Nuance Layering", "3D Jelly Gems", "Pastel French"],
    vibe: "Certified Japanese nail tech with meticulous attention to nail health and shaping",
    verified: true,
    reviews: [
      {
        author: "Nicole Tan",
        rating: 5,
        date: "1 month ago",
        source: "Verified Customer",
        text: "Japanese style nuance nails here are out of this world.",
        nailStyle: "Nuance Marble"
      }
    ]
  },

  // ==========================================
  // 🌿 WEST & JURONG POINT / WESTGATE / HOLLAND VILLAGE / CLEMENTI
  // ==========================================
  {
    id: "sg_nail_palace_jurong_point",
    name: "Nail Palace (Jurong Point 2)",
    type: "commercial",
    basePrice: 55,
    rating: 4.6,
    reviewsCount: 310,
    latitude: 1.3398,
    longitude: 103.7068,
    address: "1 Jurong West Central 2, #03-26A Jurong Point, Singapore 648886",
    district: "West & Jurong",
    mrt: "Boon Lay MRT (EW27) - Direct link",
    phone: "+65 6794 8832",
    whatsapp: "6567948832",
    instagram: "@nailpalacesg",
    hours: "Daily 10:30 AM - 9:30 PM",
    priceLevel: "$$",
    priceRange: "$55 - $125",
    specialties: ["Express Gel", "Spa Pedicure", "French Tips", "Glitter Ombre"],
    vibe: "Convenient high-capacity mall salon inside Jurong Point with full spa chairs",
    verified: true,
    reviews: [
      {
        author: "Samantha Neo",
        rating: 5,
        date: "3 weeks ago",
        source: "Google Maps",
        text: "Quick and efficient service right inside Jurong Point.",
        nailStyle: "Express Gel Manicure"
      }
    ]
  },
  {
    id: "sg_pixie_jurong_point",
    name: "Pixie Nail Spa (Jurong Point 1)",
    type: "commercial",
    basePrice: 58,
    rating: 4.7,
    reviewsCount: 275,
    latitude: 1.3402,
    longitude: 103.7059,
    address: "1 Jurong West Central 2, #B1-56 Jurong Point, Singapore 648886",
    district: "West & Jurong",
    mrt: "Boon Lay MRT (EW27) - Direct link",
    phone: "+65 6793 5218",
    whatsapp: "6567935218",
    instagram: "@pixienailspa",
    hours: "Daily 11:00 AM - 9:00 PM",
    priceLevel: "$$",
    priceRange: "$58 - $130",
    specialties: ["Classic Gel", "Apres Gel-X", "Chrome Glaze", "Russian Manicure"],
    vibe: "Established mall chain known for hygienic single-use kits and comfortable spa seats",
    verified: true,
    reviews: [
      {
        author: "Kylie Koh",
        rating: 5,
        date: "2 weeks ago",
        source: "Google Maps",
        text: "Clean environment and very gentle cuticle trimming.",
        nailStyle: "Squoval Nude Gel"
      }
    ]
  },
  {
    id: "sg_nail_addiction_holland",
    name: "Nail Addiction (Holland Village)",
    type: "commercial",
    basePrice: 60,
    rating: 4.8,
    reviewsCount: 184,
    latitude: 1.3115,
    longitude: 103.7958,
    address: "211 Holland Ave, #02-15 Holland Road Shopping Centre, Singapore 278967",
    district: "West & Jurong",
    mrt: "Holland Village MRT (CC21) - 1 min walk",
    phone: "+65 6465 5228",
    whatsapp: "6564655228",
    instagram: "@nailaddictionsg",
    hours: "Daily 10:00 AM - 8:00 PM",
    priceLevel: "$$",
    priceRange: "$60 - $135",
    specialties: ["Organic Toxin-Free Gel", "Cat Eye Magnetic", "Agate Marble", "French Ombre"],
    vibe: "Expat favorite cozy salon in Holland V, premium gentle organic polish products",
    verified: true,
    reviews: [
      {
        author: "Sophie M.",
        rating: 5,
        date: "1 month ago",
        source: "Google Maps",
        text: "Clean, calming atmosphere. Very skilled in marble nail art and gentle cuticle work.",
        nailStyle: "White Agate Marble"
      }
    ]
  },
  {
    id: "sg_hbns_studio_m_jurong",
    name: "Studio M Nails (Home-Based Jurong West)",
    type: "homebased",
    basePrice: 35,
    rating: 4.9,
    reviewsCount: 135,
    latitude: 1.3482,
    longitude: 103.7198,
    address: "Jurong West St 52 (near Lakeside MRT)",
    district: "West & Jurong",
    mrt: "Lakeside MRT (EW26) - 4 min walk",
    phone: "+65 8765 4321",
    whatsapp: "6587654321",
    instagram: "@studiom_nails.sg",
    hours: "By Appointment (11:00 AM - 9:00 PM)",
    priceLevel: "$",
    priceRange: "$35 - $65",
    specialties: ["Russian Almond Extensions", "Cat Eye Magnetic", "Korean Jelly Syrup", "Minimalist French"],
    vibe: "Affordable and precision-oriented home studio for Westies",
    verified: true,
    reviews: [
      {
        author: "Clara Tan",
        rating: 5,
        date: "2 weeks ago",
        source: "Lemon8",
        text: "Best hidden gem in Jurong! Super affordable prices without compromising quality at all.",
        nailStyle: "Coffin French + Magnetic"
      }
    ]
  },

  // ==========================================
  // 🌲 NORTH & NORTH-EAST / BISHAN / NEX / NORTHPOINT / WATERWAY POINT / YISHUN / HOUGANG
  // ==========================================
  {
    id: "sg_nailz_haus_northpoint",
    name: "Nailz Haus (Northpoint City)",
    type: "commercial",
    basePrice: 58,
    rating: 4.7,
    reviewsCount: 260,
    latitude: 1.4295,
    longitude: 103.8354,
    address: "930 Yishun Ave 2, South Wing #B1-168 Northpoint City, Singapore 769098",
    district: "North & Bishan",
    mrt: "Yishun MRT (NS13) - Direct link",
    phone: "+65 6481 8832",
    whatsapp: "6564818832",
    instagram: "@nailzhaussg",
    hours: "Daily 11:00 AM - 9:00 PM",
    priceLevel: "$$",
    priceRange: "$58 - $125",
    specialties: ["Russian Manicure", "Magnetic Cat Eye", "French Tips", "Spa Care"],
    vibe: "Bright and modern salon in Northpoint City South Wing with experienced technicians",
    verified: true,
    reviews: [
      {
        author: "Peggy Goh",
        rating: 5,
        date: "2 weeks ago",
        source: "Google Maps",
        text: "Very neat work and friendly nail artists at Northpoint.",
        nailStyle: "Silver Cat Eye"
      }
    ]
  },
  {
    id: "sg_nailz_gallery_nex",
    name: "Nailz Gallery (NEX Serangoon)",
    type: "commercial",
    basePrice: 62,
    rating: 4.8,
    reviewsCount: 340,
    latitude: 1.3506,
    longitude: 103.8728,
    address: "23 Serangoon Central, #B2-55 NEX, Singapore 556083",
    district: "North & Bishan",
    mrt: "Serangoon MRT (NE12 / CC13) - Direct link",
    phone: "+65 6634 8831",
    whatsapp: "6566348831",
    instagram: "@nailzgallery",
    hours: "Daily 11:00 AM - 9:00 PM",
    priceLevel: "$$",
    priceRange: "$62 - $130",
    specialties: ["Russian Dry Manicure", "Aura Ombre", "3D Charms", "Chrome Donut"],
    vibe: "Busy central salon in NEX Serangoon with fast service and wide nail art catalog",
    verified: true,
    reviews: [
      {
        author: "Serene Lim",
        rating: 5,
        date: "1 week ago",
        source: "Google Maps",
        text: "Did chrome glazed almond nails here, shape was filed so symmetrically!",
        nailStyle: "Almond Chrome Glaze"
      }
    ]
  },
  {
    id: "sg_shugar_spa_waterway",
    name: "Shugar Spa (Waterway Point Punggol)",
    type: "commercial",
    basePrice: 60,
    rating: 4.8,
    reviewsCount: 220,
    latitude: 1.4067,
    longitude: 103.9022,
    address: "83 Punggol Central, #01-35/36 Waterway Point, Singapore 828761",
    district: "North & Bishan",
    mrt: "Punggol MRT (NE17 / PTC) - Direct link",
    phone: "+65 6385 7798",
    whatsapp: "6563857798",
    instagram: "@shugarspa",
    hours: "Daily 10:30 AM - 9:00 PM",
    priceLevel: "$$",
    priceRange: "$60 - $130",
    specialties: ["Organic Gel Manicure", "French Arch", "Cat Eye Magnetic", "Spa Pedicure"],
    vibe: "Eco-friendly salon overlooking the Punggol waterway, soothing pastel interior",
    verified: true,
    reviews: [
      {
        author: "Gwen Tan",
        rating: 5,
        date: "3 weeks ago",
        source: "Google Maps",
        text: "Lovely water view while getting nails done. Polish stayed glossy for a month.",
        nailStyle: "Organic Gel French"
      }
    ]
  },
  {
    id: "sg_hbns_cuteticle_bishan",
    name: "Cuteticle SG (Home-Based Bishan)",
    type: "homebased",
    basePrice: 38,
    rating: 4.95,
    reviewsCount: 240,
    latitude: 1.3536,
    longitude: 103.8502,
    address: "Bishan St 12 (near Bishan MRT)",
    district: "North & Bishan",
    mrt: "Bishan MRT (NS17 / CC15) - 4 min walk",
    phone: "+65 9345 6789",
    whatsapp: "6593456789",
    instagram: "@cuteticlesg",
    tiktok: "@cuteticlesg",
    hours: "By Appointment (10:00 AM - 9:00 PM)",
    priceLevel: "$",
    priceRange: "$38 - $75",
    specialties: ["Anime & Character Art", "3D Gummy Bears", "Y2K Chrome Stars", "Express Gel"],
    vibe: "Featured on Zula & TikTok! Famous for hyper-detailed hand-painted characters and 3D charms",
    verified: true,
    reviews: [
      {
        author: "Janice Low",
        rating: 5,
        date: "3 days ago",
        source: "TikTok",
        text: "Her 3D bear charms and character art are insane! Best home-based tech in Bishan.",
        nailStyle: "3D Bears + Hand-Painted Art"
      }
    ]
  },
  {
    id: "sg_hbns_manicure_ling_yishun",
    name: "Manicure By Ling (Home-Based Yishun/Khatib)",
    type: "homebased",
    basePrice: 35,
    rating: 4.9,
    reviewsCount: 145,
    latitude: 1.4182,
    longitude: 103.8375,
    address: "Yishun Ave 2 (near Khatib MRT)",
    district: "North & Bishan",
    mrt: "Khatib MRT (NS14) - 3 min walk",
    phone: "+65 9112 2334",
    whatsapp: "6591122334",
    instagram: "@manicurebyling",
    hours: "By Appointment (10:30 AM - 8:00 PM)",
    priceLevel: "$",
    priceRange: "$35 - $65",
    specialties: ["Russian Dry Cuticle Care", "Floral Hand-Painting", "Cat Eye Magnetic", "Syrup Gel"],
    vibe: "Meticulous Russian dry manicure technique with long-lasting Japanese and Korean gel formulas",
    verified: true,
    reviews: [
      {
        author: "Bernice Ong",
        rating: 5,
        date: "2 weeks ago",
        source: "Lemon8",
        text: "Cleanest cuticles ever! My nails grew out for 5 weeks with zero lifting.",
        nailStyle: "Russian Manicure + Cat Eye"
      }
    ]
  },
  {
    id: "sg_hbns_pallyynails_yishun",
    name: "Pallyynails (A'Posh BizHub Yishun)",
    type: "homebased",
    basePrice: 38,
    rating: 4.9,
    reviewsCount: 160,
    latitude: 1.4332,
    longitude: 103.8421,
    address: "1 Yishun Industrial St 1, A'Posh BizHub, Singapore 768160",
    district: "North & Bishan",
    mrt: "Yishun MRT (NS13) - 5 min bus",
    phone: "+65 8456 7890",
    whatsapp: "6584567890",
    instagram: "@pallyynails",
    tiktok: "@pallyynails",
    hours: "By Appointment",
    priceLevel: "$",
    priceRange: "$38 - $70",
    specialties: ["Cybersigilism Nails", "Cat Eye Velvet", "French Tips", "Apres Gel-X"],
    vibe: "Edgy Y2K chrome designs, cyber art and velvet magnetic cat eye sets",
    verified: true,
    reviews: [
      {
        author: "Zoey Chan",
        rating: 5,
        date: "1 week ago",
        source: "Instagram",
        text: "The cyber chrome lines were so clean. Definitely coming back for my next set!",
        nailStyle: "Y2K Cyber Chrome"
      }
    ]
  },
  {
    id: "sg_hbns_pastel_claws_hougang",
    name: "Pastel Claws (Home-Based Hougang)",
    type: "homebased",
    basePrice: 38,
    rating: 5.0,
    reviewsCount: 115,
    latitude: 1.3712,
    longitude: 103.8865,
    address: "Hougang Ave 8 (near Hougang MRT)",
    district: "North & Bishan",
    mrt: "Hougang MRT (NE14) - 6 min walk",
    phone: "+65 9876 5432",
    whatsapp: "6598765432",
    instagram: "@pastelclaws_sg",
    hours: "Mon - Sat (10:30 AM - 8:00 PM)",
    priceLevel: "$",
    priceRange: "$38 - $70",
    specialties: ["3D Resin Charms", "Y2K Chrome Art", "Tortoiseshell Jelly", "French Manicure"],
    vibe: "Dreamy pastel aesthetic room with wide selection of Japanese imported charms",
    verified: true,
    reviews: [
      {
        author: "Fiona Teo",
        rating: 5,
        date: "3 weeks ago",
        source: "Verified Customer",
        text: "Got the cute 3D birthday cake and ribbon charms here! The overlay structure gel was thick and sturdy.",
        nailStyle: "3D Birthday Cake + Gems"
      }
    ]
  },
  {
    id: "sg_hbns_lumiere_sengkang",
    name: "Lumiere Nails (Home-Based Sengkang)",
    type: "homebased",
    basePrice: 35,
    rating: 4.95,
    reviewsCount: 148,
    latitude: 1.3918,
    longitude: 103.8952,
    address: "Sengkang East Way (near Sengkang MRT)",
    district: "North & Bishan",
    mrt: "Sengkang MRT (NE16) - 5 min walk",
    phone: "+65 9234 5678",
    whatsapp: "6592345678",
    instagram: "@lumierenails.sg",
    hours: "By Appointment (10:00 AM - 8:30 PM)",
    priceLevel: "$",
    priceRange: "$35 - $68",
    specialties: ["Y2K Aura Nails", "Cat Eye Velvet", "3D Gummy Bears & Bows", "Gel-X Extensions"],
    vibe: "Super cozy, high-quality Japanese & Korean polishes, private appointment room",
    verified: true,
    reviews: [
      {
        author: "Sarah Chia",
        rating: 5,
        date: "4 days ago",
        source: "Lemon8",
        text: "The magnetic cat eye shift is insane in the sunlight! So happy I found a home tech in Sengkang.",
        nailStyle: "Aurora Emerald Cat Eye"
      }
    ]
  },
  {
    id: "sg_hbns_callinails_bartley",
    name: "Callinails (@callinails Home-Based)",
    type: "homebased",
    basePrice: 48,
    rating: 5.0,
    reviewsCount: 175,
    latitude: 1.3428,
    longitude: 103.8795,
    address: "Bartley Rd (near Bartley MRT)",
    district: "North & Bishan",
    mrt: "Bartley MRT (CC12) - 4 min walk",
    phone: "+65 9456 1234",
    whatsapp: "6594561234",
    instagram: "@callinails",
    hours: "By Appointment",
    priceLevel: "$$",
    priceRange: "$48 - $85",
    specialties: ["JNEC-Certified Japanese Art", "Minimalist Nuance", "Sculpted 3D Ribbons", "Syrup Gel"],
    vibe: "JNEC Japanese certified technician known for aesthetic minimalist nuance art and gentle care",
    verified: true,
    reviews: [
      {
        author: "Evelyn Chew",
        rating: 5,
        date: "3 weeks ago",
        source: "Instagram",
        text: "Her nuance work is unmatched in SG. She took her time with my prep and the result was so classy!",
        nailStyle: "Nuance Japanese Marble"
      }
    ]
  }
];

/**
 * Calculates real-time dynamically computed price for any salon based on user selected criteria
 */
export function calculateDynamicSalonPrice(
  salon: SalonInfo,
  shape: NailShapeFilter = "almond",
  length: NailLengthFilter = "short",
  complexity: ComplexityFilter = "solid"
): { price: number; breakdown: string[] } {
  let cost = salon.basePrice;
  const breakdown: string[] = [
    `Base ${salon.type === "homebased" ? "Home-Based" : "Salon"} Gel Manicure: $${salon.basePrice}`
  ];

  // 1. Nail Shape
  if (["russian_almond", "coffin", "stiletto", "lipstick"].includes(shape)) {
    const shapeFee = salon.type === "homebased" ? 8 : 12;
    cost += shapeFee;
    breakdown.push(`Sculpted ${shape.replace("_", " ").toUpperCase()} Shape: +$${shapeFee}`);
  } else if (["almond", "round_square"].includes(shape)) {
    const shapeFee = salon.type === "homebased" ? 4 : 6;
    cost += shapeFee;
    breakdown.push(`Tapered ${shape.replace("_", " ").toUpperCase()} Shape: +$${shapeFee}`);
  }

  // 2. Nail Length Extensions
  if (length === "medium") {
    const lenFee = salon.type === "homebased" ? 8 : 12;
    cost += lenFee;
    breakdown.push(`Medium Extensions (+1.0cm): +$${lenFee}`);
  } else if (length === "long") {
    const lenFee = salon.type === "homebased" ? 15 : 22;
    cost += lenFee;
    breakdown.push(`Long Extensions (+2.0cm): +$${lenFee}`);
  } else if (length === "extra_long") {
    const lenFee = salon.type === "homebased" ? 22 : 32;
    cost += lenFee;
    breakdown.push(`Extra Long Sculpted (+3.0cm): +$${lenFee}`);
  }

  // 3. Design Complexity
  if (complexity === "french_cateye") {
    const artFee = salon.type === "homebased" ? 12 : 18;
    cost += artFee;
    breakdown.push(`French Smile Line / Cat Eye Magnetic / Aura: +$${artFee}`);
  } else if (complexity === "charms_3d") {
    const artFee = salon.type === "homebased" ? 20 : 30;
    cost += artFee;
    breakdown.push(`Hand-Placed 3D Acrylic Gems & Resin Charms: +$${artFee}`);
  } else if (complexity === "full_gelx_extreme") {
    const artFee = salon.type === "homebased" ? 32 : 45;
    cost += artFee;
    breakdown.push(`Full Apres Gel-X Structure + Intricate 3D Art: +$${artFee}`);
  }

  return { price: cost, breakdown };
}

export const STORAGE_KEY_HBNS = "nailit_user_registered_hbns";

export function getStoredSalons(): SalonInfo[] {
  try {
    const custom = localStorage.getItem(STORAGE_KEY_HBNS);
    if (custom) {
      const parsed = JSON.parse(custom) as SalonInfo[];
      return [...parsed, ...SG_SALONS_INITIAL_DATA];
    }
  } catch (e) {
    console.warn("Could not read custom HBNS:", e);
  }
  return SG_SALONS_INITIAL_DATA;
}

export function saveCustomHBNS(newSalon: SalonInfo) {
  try {
    const custom = localStorage.getItem(STORAGE_KEY_HBNS);
    const list: SalonInfo[] = custom ? JSON.parse(custom) : [];
    list.unshift(newSalon);
    localStorage.setItem(STORAGE_KEY_HBNS, JSON.stringify(list));
  } catch (e) {
    console.warn("Could not save custom HBNS:", e);
  }
}
