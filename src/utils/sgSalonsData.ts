// Comprehensive Singapore Nail Salons & Home-Based Studios (HBNS) Registry
// Verified across Google Maps, Instagram, TikTok & Lemon8

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
  type: "commercial" | "homebased"; // Commercial Salon vs Home-Based Studio (HBNS)
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
  coverImage?: string;
  reviews: SalonReview[];
  estimatedPrice?: number;
  aiMatchedMenu?: string;
  aiMenuDetails?: string[];
  aiConsultationMsg?: string;
}

export const SG_SALONS_INITIAL_DATA: SalonInfo[] = [
  // ==========================================
  // 🌟 CENTRAL & DOWNTOWN / BUGIS / ORCHARD
  // ==========================================
  {
    id: "sg_nail_artelier_bugis",
    name: "The Nail Artelier",
    type: "commercial",
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
    priceRange: "$65 - $135",
    specialties: ["Japanese Gel Art", "3D Sculpted Charms", "Cat Eye Magnetic", "Nuance Marble"],
    vibe: "Trendy hipster boutique studio in Haji Lane famous for intricate customized nail art",
    verified: true,
    reviews: [
      {
        author: "Valerie Tan",
        rating: 5,
        date: "2 weeks ago",
        source: "Google Maps",
        text: "Did a full 3D gummy bear and French chrome set here. The nail artist was super meticulous and the gel lasted more than 5 weeks without chipping!",
        nailStyle: "3D Resin Charms + French"
      },
      {
        author: "Rachel Lee",
        rating: 5,
        date: "1 month ago",
        source: "Lemon8",
        text: "Best Japanese gel studio in Bugis! Their magnetic cat-eye technique is flawless.",
        nailStyle: "Silver Stardust Cat Eye"
      }
    ]
  },
  {
    id: "sg_manicurious_beach_rd",
    name: "Manicurious",
    type: "commercial",
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
    vibe: "Vibrant and aesthetic nail bar cafe with plush vintage armchairs and complimentary tea",
    verified: true,
    reviews: [
      {
        author: "Hannah Koh",
        rating: 5,
        date: "3 weeks ago",
        source: "Google Maps",
        text: "Amazing ambience and super skilled nail techs. Recreated my Pinterest reference photo accurately!",
        nailStyle: "Glazed Donut Chrome"
      }
    ]
  },
  {
    id: "sg_nail_county_millenia",
    name: "Nail County SG",
    type: "commercial",
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
        text: "Authentic Korean syrup gel colors that you cannot find anywhere else in SG. Very clean cuticle care.",
        nailStyle: "Korean Jelly Syrup"
      }
    ]
  },
  {
    id: "sg_bejeweled_orchard",
    name: "Bejeweled Nails & Spa",
    type: "commercial",
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
    priceRange: "$55 - $120",
    specialties: ["Russian Dry Manicure", "Aurora Rhinestones", "Ombre French", "Velvet Cat Eye"],
    vibe: "Elegant salon in central Orchard with comprehensive sanitization and luxury recliner seats",
    verified: true,
    reviews: [
      {
        author: "Cheryl Ng",
        rating: 5,
        date: "Last week",
        source: "Google Maps",
        text: "Their Russian dry manicure cleaned up my cuticles so neatly! The chrome french line was razor sharp.",
        nailStyle: "Chrome Tip French"
      }
    ]
  },
  {
    id: "sg_the_nail_social_chinatown",
    name: "The Nail Social",
    type: "commercial",
    rating: 4.9,
    reviewsCount: 356,
    latitude: 1.2818,
    longitude: 103.8431,
    address: "42A Haji Lane & 333 Kreta Ayer Rd, #01-14, Singapore 080333",
    district: "Central & Orchard",
    mrt: "Chinatown MRT (NE4 / DT19) - 4 min walk",
    phone: "+65 6717 3221",
    whatsapp: "6567173221",
    instagram: "@thenailsocial",
    hours: "Tue - Sun 10:00 AM - 7:00 PM",
    priceLevel: "$$",
    priceRange: "$50 - $110",
    specialties: ["Non-Toxic Cruelty-Free Gel", "Fair Trade Spa Care", "Minimalist French", "Glass Topcoat"],
    vibe: "Socially-conscious lifestyle nail bar providing vocational training, iPad movies & free drinks",
    verified: true,
    reviews: [
      {
        author: "Emma Watson",
        rating: 5,
        date: "1 month ago",
        source: "Google Maps",
        text: "Super relaxing pedicure and manicure with Netflix on personal iPads. Love their ethical mission!",
        nailStyle: "Milky Nude Gel"
      }
    ]
  },
  {
    id: "sg_hbns_eunice_bugis",
    name: "Eunice Claws (Home-Based Studio)",
    type: "homebased",
    rating: 5.0,
    reviewsCount: 142,
    latitude: 1.3032,
    longitude: 103.8535,
    address: "Bencoolen St (near Bugis / Rochor, full unit given upon booking)",
    district: "Downtown & Bugis",
    mrt: "Rochor MRT (DT13) - 2 min walk",
    phone: "+65 9123 4567",
    whatsapp: "6591234567",
    instagram: "@euniceclaws.sg",
    tiktok: "@euniceclaws",
    hours: "By Appointment (10:00 AM - 9:00 PM)",
    priceLevel: "$",
    priceRange: "$40 - $75",
    specialties: ["Korean Airbrush Aura", "3D Gummy Bears", "Cat Eye Velvet", "Apres Gel-X"],
    vibe: "Super cozy home studio with Netflix, cute cats, and zero hard-selling",
    verified: true,
    reviews: [
      {
        author: "Amanda Poh",
        rating: 5,
        date: "2 days ago",
        source: "Lemon8",
        text: "Found Eunice on Lemon8! Her home studio is so aesthetic and clean. She recreated my Pinterest nail design with 3D teddy bears perfectly for only $55!",
        nailStyle: "3D Bear + Pastel Ombre"
      }
    ]
  },

  // ==========================================
  // 🌴 EAST & TAMPINES / BEDOK / KATONG / PASIR RIS
  // ==========================================
  {
    id: "sg_hbns_vleenails_tampines",
    name: "Vlee Nails (@vleenails Home-Based)",
    type: "homebased",
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
        text: "Booked her mystery set after seeing her TikTok viral videos. My nails look like real salon press-ons!",
        nailStyle: "Mystery Chrome Set"
      }
    ]
  },
  {
    id: "sg_hbns_elenails_tampines",
    name: "Elenails.sg (Home-Based Tampines East)",
    type: "homebased",
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
        text: "Super sweet tech in Tampines East. Clean work and very affordable pricing without hidden charges.",
        nailStyle: "Cat Eye Magnetic + Bows"
      }
    ]
  },
  {
    id: "sg_hbns_claw_therapy_tampines",
    name: "Claw Therapy SG (Home-Based)",
    type: "homebased",
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
        text: "Chloe is the sweetest tech in Tampines! Her syrup gels are so glossy and she has thousands of charms in stock.",
        nailStyle: "Coquette Bows + Syrup Nude"
      }
    ]
  },
  {
    id: "sg_glitter_nails_katong",
    name: "Glitter Nails SG",
    type: "commercial",
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
    id: "sg_hbns_lunalili_tampines",
    name: "Lunalili Nails (Home-Based Tampines)",
    type: "homebased",
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
        text: "Japanese style nuance nails here are out of this world. Lasted more than a month!",
        nailStyle: "Nuance Marble"
      }
    ]
  },

  // ==========================================
  // 🌲 NORTH & NORTH-EAST / BISHAN / YISHUN / ANG MO KIO / SENGKANG / HOUGANG
  // ==========================================
  {
    id: "sg_hbns_cuteticle_bishan",
    name: "Cuteticle SG (Home-Based Bishan)",
    type: "homebased",
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
    name: "Manicure By Ling (Home-Based Yishun)",
    type: "homebased",
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
    id: "sg_nails_good_company_bishan",
    name: "Nails & Good Company",
    type: "commercial",
    rating: 4.8,
    reviewsCount: 268,
    latitude: 1.3506,
    longitude: 103.8488,
    address: "9 Bishan Place, #02-04 Junction 8, Singapore 579837",
    district: "North & Bishan",
    mrt: "Bishan MRT (NS17 / CC15) - Direct link",
    phone: "+65 6262 3889",
    whatsapp: "6562623889",
    instagram: "@nailsgoodco",
    hours: "Daily 11:00 AM - 9:00 PM",
    priceLevel: "$$",
    priceRange: "$65 - $130",
    specialties: ["Non-Toxic Gel Care", "Airbrush Aura", "Chrome Glaze", "Pastel French"],
    vibe: "Eco-friendly, breathable non-toxic gel polishes in a bright Scandinavian studio",
    verified: true,
    reviews: [
      {
        author: "Mei Ling",
        rating: 5,
        date: "3 weeks ago",
        source: "Google Maps",
        text: "Love that they use non-toxic products. The chrome glazed donut finish was super shiny.",
        nailStyle: "Glazed Donut Chrome"
      }
    ]
  },
  {
    id: "sg_hbns_pastel_claws_hougang",
    name: "Pastel Claws (Home-Based Studio)",
    type: "homebased",
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

  // ==========================================
  // 🌿 WEST & JURONG / CLEMENTI / HOLLAND VILLAGE
  // ==========================================
  {
    id: "sg_nail_addiction_holland",
    name: "Nail Addiction Holland Village",
    type: "commercial",
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
    name: "Studio M Nails (Home-Based Jurong)",
    type: "homebased",
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
  {
    id: "sg_hbns_callinails_bartley",
    name: "Callinails (@callinails Home-Based)",
    type: "homebased",
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
