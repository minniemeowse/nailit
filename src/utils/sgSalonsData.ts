// Singapore Nail Salons & Home-Based Studios (HBNS) Directory
// Real coordinates across Orchard, Bugis, Tampines, Jurong, Bishan, Katong, Holland Village & Hougang

export interface SalonReview {
  author: string;
  rating: number;
  date: string;
  source: "Google Reviews" | "Lemon8" | "Instagram" | "Verified Customer";
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
  hours: string;
  priceLevel: "$" | "$$" | "$$$";
  priceRange: string;
  specialties: string[];
  vibe: string;
  verified: boolean;
  coverImage?: string;
  reviews: SalonReview[];
  // AI calculated pricing matching current user nail collection
  estimatedPrice?: number;
  aiMatchedMenu?: string;
  aiMenuDetails?: string[];
  aiConsultationMsg?: string;
}

export const SG_SALONS_INITIAL_DATA: SalonInfo[] = [
  // 🌟 CENTRAL & DOWNTOWN / BUGIS / ORCHARD
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
    hours: "Daily 11:00 AM - 9:00 PM",
    priceLevel: "$$",
    priceRange: "$65 - $130",
    specialties: ["Japanese Gel Art", "3D Hand-Sculpted Charms", "Cat Eye Magnetic", "Nuance Marble"],
    vibe: "Trendy hipster boutique studio famous for intricate customized nail art",
    verified: true,
    reviews: [
      {
        author: "Valerie Tan",
        rating: 5,
        date: "2 weeks ago",
        source: "Google Reviews",
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
    priceRange: "$80 - $160",
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
    vibe: "Elegant salon with plush leather recliners and comprehensive sanitization",
    verified: true,
    reviews: [
      {
        author: "Cheryl Ng",
        rating: 5,
        date: "Last week",
        source: "Google Reviews",
        text: "Their Russian dry manicure cleaned up my cuticles so neatly! The chrome french line was razor sharp.",
        nailStyle: "Chrome Tip French"
      }
    ]
  },

  // 🏡 VIRAL HOME-BASED NAIL STUDIOS (HBNS)
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

  // 🌴 EAST / KATONG & MARINE PARADE
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
        source: "Google Reviews",
        text: "Super quick and neat Gel-X extensions! The rhinestones stay firmly attached.",
        nailStyle: "Gel-X Almond + Crystals"
      }
    ]
  },

  // 🌿 WEST / JURONG & HOLLAND VILLAGE
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
        source: "Google Reviews",
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

  // 🌲 NORTH / BISHAN & ANG MO KIO
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
        source: "Google Reviews",
        text: "Love that they use non-toxic products. The chrome glazed donut finish was super shiny.",
        nailStyle: "Glazed Donut Chrome"
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
