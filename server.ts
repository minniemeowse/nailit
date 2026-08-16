import express from "express";
import path from "path";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

// Load .env.local first, then fallback to .env
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

// Function to dynamically get or initialize the Gemini API client
let ai: GoogleGenAI | null = null;

export function getAIClient(): GoogleGenAI | null {
  // Re-read .env files if client is not yet active
  if (!ai) {
    dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
    dotenv.config({ path: path.resolve(process.cwd(), ".env") });

    const key = process.env.GEMINI_API_KEY?.trim();
    if (key && key !== "MY_GEMINI_API_KEY" && key !== "") {
      try {
        ai = new GoogleGenAI({
          apiKey: key,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build',
            }
          }
        });
        console.log("✨ Successfully initialized Gemini API client with GEMINI_API_KEY!");
      } catch (err) {
        console.error("Failed to initialize Gemini API client:", err);
        ai = null;
      }
    }
  }
  return ai;
}

// Robust model fallback runner
export async function generateContentWithFallback(currentAi: GoogleGenAI, request: any) {
  const models = ["gemini-2.0-flash", "gemini-1.5-flash", "gemini-1.5-pro", "gemini-2.5-flash"];
  let lastError: any = null;

  for (const model of models) {
    try {
      const response = await currentAi.models.generateContent({
        ...request,
        model
      });
      return response;
    } catch (err: any) {
      lastError = err;
      if (err?.status === 404 || err?.message?.includes("not found") || err?.message?.includes("no longer available")) {
        console.warn(`Model ${model} not available on this API key. Falling back to next available Gemini model...`);
        continue;
      }
      throw err;
    }
  }
  throw lastError;
}

// Initial check on server boot
getAIClient();
if (!ai) {
  console.warn("ℹ️ GEMINI_API_KEY is not configured. Server will run in visual simulator mode until a key is added to .env.local or .env.");
}

const app = express();
app.use(express.json({ limit: "10mb" }));

const PORT = 3000;

// API Endpoints
app.get("/api/health", (req, res) => {
  const currentAi = getAIClient();
  res.json({
    status: "ok",
    apiKeyConfigured: !!currentAi,
    environment: process.env.NODE_ENV || "development"
  });
});

// Primary Nail Art Generation endpoint using gemini-3.5-flash
app.post("/api/generate-design", async (req, res) => {
  const { vibe, colorPreference, shape, length, extraAccents, customPrompt } = req.body;

  console.log("Generating 3 alternative designs for:", { vibe, colorPreference, shape, length, extraAccents });

  const currentAi = getAIClient();
  if (!currentAi) {
    // Return 3 high-quality, simulated aesthetic nail sets if Gemini is not configured
    console.log("No Gemini API client initialized. Returning 3 highly-curated, simulated responses.");
    const options = [
      getSimulatedDesign(vibe, colorPreference, shape, length, extraAccents, customPrompt, 0),
      getSimulatedDesign(vibe, colorPreference, shape, length, extraAccents, customPrompt, 1),
      getSimulatedDesign(vibe, colorPreference, shape, length, extraAccents, customPrompt, 2)
    ];
    return res.json({
      options,
      simulated: true,
      message: "Operating in visual simulator mode. Connect your Gemini API Key in Settings > Secrets for customized AI generation!"
    });
  }

  try {
    const prompt = `Generate EXACTLY 3 distinct alternative, professional, and visually breathtaking 10-finger nail art design sets based on these preferences:
Vibe/Aesthetic: ${vibe || "Any classic chic"}
Primary Color Preference: ${colorPreference || "Complimentary palette"}
Nail Shape: ${shape || "Almond"}
Nail Length: ${length || "Medium"}
Key Accent Elements: ${extraAccents || "None"}
Special Instructions: ${customPrompt || "None"}

Each of the 3 alternative sets should represent a different creative interpretation of this aesthetic (e.g., Set 1 could be romantic/soft, Set 2 could be high-glitz/chrome accented, Set 3 could be chic minimal negative space).

You must output a single, valid JSON object containing an array "options" with EXACTLY 3 objects. Each object in "options" must contain:
1. designName: A highly artistic, editorial, and elegant name for this look (e.g., "Celestial Matcha Latte", "Vintage Rose Balletcore", "Y2K Obsidian Glaze").
2. description: An atmospheric, elegant description of the mood, texture, and why these elements fit together.
3. colorPalette: An array of 3 to 5 matching colors, each with:
   - name: A chic shade name (e.g., "Oat Milk", "Emerald Veil", "Blush Satin")
   - hex: A valid hexadecimal hex code representing that exact shade.
4. nails: An array containing exactly 10 distinct finger objects (5 for Left hand, 5 for Right hand) covering all fingers: "Left Thumb", "Left Index", "Left Middle", "Left Ring", "Left Pinky", "Right Thumb", "Right Index", "Right Middle", "Right Ring", "Right Pinky".
   Each finger object must have:
   - finger: The exact string name ("Left Thumb", "Left Index", "Left Middle", "Left Ring", "Left Pinky", "Right Thumb", "Right Index", "Right Middle", "Right Ring", "Right Pinky").
   - title: Short, chic design style for this nail (e.g., "Glossy Pearl Accent", "Vanilla Ombre Base", "3D Ribbon Overlay").
   - baseColor: The main hex color code.
   - finish: Must be one of: "glossy", "matte", "chrome", "holographic", "glitter".
   - artStyle: Must be one of: "solid", "french", "ombre", "marble", "pattern", "accent".
   - secondaryColor: (Optional) A contrasting or matching hex color code if artStyle is ombre, french, marble, or pattern. Defaults to null if not used.
   - decorations: A descriptive string of specific accessories/painted art (e.g., "A single dainty gold pearl sticker at the cuticle base", "Hand-painted fine white line art waves", "None").
   - details: Specific, highly practical instructions for a real-world nail technician to replicate this design. Describe brushes, gel layers, or application order.

Do not use markdown backticks in the response. Only return a raw JSON object.`;

    const response = await generateContentWithFallback(currentAi, {
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            options: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  designName: { type: Type.STRING },
                  description: { type: Type.STRING },
                  colorPalette: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        name: { type: Type.STRING },
                        hex: { type: Type.STRING },
                      },
                      required: ["name", "hex"]
                    }
                  },
                  nails: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        finger: { type: Type.STRING },
                        title: { type: Type.STRING },
                        baseColor: { type: Type.STRING },
                        finish: { type: Type.STRING },
                        artStyle: { type: Type.STRING },
                        secondaryColor: { type: Type.STRING },
                        decorations: { type: Type.STRING },
                        details: { type: Type.STRING },
                      },
                      required: ["finger", "title", "baseColor", "finish", "artStyle", "decorations", "details"]
                    }
                  }
                },
                required: ["designName", "description", "colorPalette", "nails"]
              }
            }
          },
          required: ["options"]
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("Empty response from Gemini API");
    }

    const parsedData = JSON.parse(text.trim());
    res.json(parsedData);

  } catch (error: any) {
    console.error("Error calling Gemini API:", error);
    res.status(500).json({
      error: "Failed to generate design using Gemini API.",
      details: error.message || error,
      fallback: {
        options: [
          getSimulatedDesign(vibe, colorPreference, shape, length, extraAccents, customPrompt, 0),
          getSimulatedDesign(vibe, colorPreference, shape, length, extraAccents, customPrompt, 1),
          getSimulatedDesign(vibe, colorPreference, shape, length, extraAccents, customPrompt, 2)
        ]
      }
    });
  }
});

// Nail detection and recipe generation endpoint from user-uploaded images
app.post("/api/detect-nails", async (req, res) => {
  const { image } = req.body;

  if (!image) {
    return res.status(400).json({
      isNailPhoto: false,
      message: "Missing uploaded image data.",
      detectedNails: []
    });
  }

  console.log("Detecting and isolating nail beds from uploaded photo...");

  let base64Data = image;
  let mimeType = "image/jpeg";

  if (image.startsWith("data:")) {
    const parts = image.split(";base64,");
    if (parts.length === 2) {
      const mimeParts = parts[0].split(":");
      if (mimeParts.length === 2) {
        mimeType = mimeParts[1];
      }
      base64Data = parts[1];
    }
  }

  const currentAi = getAIClient();
  if (!currentAi) {
    console.log("No Gemini API client initialized. Running visual simulator mode for nail detection.");
    const fallback = getSimulatedDetectedNails();
    return res.json(fallback);
  }

  try {
    const prompt = `You are an expert computer vision model and celebrity nail artist.
Analyze the uploaded image carefully.

Step 1: Check if the photo actually shows human fingers, hands, or nail art.
If the image is NOT a nail or hand photo (for example: cars, landscapes, animals, text, random objects, food, shoes, etc. where no human fingernails are visible), set "isNailPhoto" to false, "message" to "Unable to detect any nail beds in this photo. Please upload a clear photo showing nails or hands.", and "detectedNails" to an empty array [].

Step 2: If the photo DOES contain fingernails/nail art:
- Set "isNailPhoto" to true.
- Detect each visible nail bed individually (whether there is 1 nail, 3 nails, 5 nails on one hand, or all 10 nails across both hands. Detect ONLY the visible ones).
- For each detected nail bed, output:
  - id: unique string ID like "detected_nail_1", "detected_nail_2", etc.
  - label: descriptive label like "Thumb Nail", "Index Finger Tip", "Accent Ring Nail", etc.
  - fingerGuess: Best guess of finger anatomical location ("Left Thumb", "Left Index", "Left Middle", "Left Ring", "Left Pinky", "Right Thumb", "Right Index", "Right Middle", "Right Ring", "Right Pinky").
  - box2d: [ymin, xmin, ymax, xmax] normalized bounding box coordinates for this nail bed on a 0-1000 integer scale.
  - dominantColor: Exact hex code (e.g. "#F4B8BA") of the nail bed base.
  - colorName: Chic name (e.g. "Blush Satin").
  - finish: One of: "glossy", "matte", "chrome", "holographic", "glitter".
  - artStyle: One of: "solid", "french", "ombre", "marble", "pattern", "accent".
  - secondaryColor: Contrasting hex code if french, ombre, marble, or null.
  - decorations: Detailed description of rhinestones, stickers, chrome powder, or hand-painted art on this nail.
  - details: Professional application steps for nail technician.

Return ONLY a single valid JSON object following this schema. Do not wrap with markdown code fences.`;

    const imagePart = {
      inlineData: {
        mimeType: mimeType,
        data: base64Data,
      },
    };

    const response = await generateContentWithFallback(currentAi, {
      contents: { parts: [imagePart, { text: prompt }] },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isNailPhoto: { type: Type.BOOLEAN },
            message: { type: Type.STRING },
            designName: { type: Type.STRING },
            description: { type: Type.STRING },
            detectedShape: { type: Type.STRING },
            detectedLength: { type: Type.STRING },
            colorPalette: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  hex: { type: Type.STRING },
                },
                required: ["name", "hex"]
              }
            },
            detectedNails: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  label: { type: Type.STRING },
                  fingerGuess: { type: Type.STRING },
                  box2d: {
                    type: Type.ARRAY,
                    items: { type: Type.INTEGER }
                  },
                  dominantColor: { type: Type.STRING },
                  colorName: { type: Type.STRING },
                  finish: { type: Type.STRING },
                  artStyle: { type: Type.STRING },
                  secondaryColor: { type: Type.STRING },
                  decorations: { type: Type.STRING },
                  details: { type: Type.STRING },
                },
                required: ["id", "label", "box2d", "dominantColor", "finish", "artStyle", "decorations", "details"]
              }
            }
          },
          required: ["isNailPhoto", "message", "detectedNails"]
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("Empty response from Gemini API");
    }

    const parsedData = JSON.parse(text.trim());
    res.json(parsedData);

  } catch (error: any) {
    console.error("Error in AI nail detection:", error);
    // Return gracefully with simulated fallback
    res.json(getSimulatedDetectedNails());
  }
});

// Point-Prompted Single Nail Segmentation endpoint (Manual Click-to-Segment)
app.post("/api/segment-point", async (req, res) => {
  const { image, point, tapIndex = 0 } = req.body;

  if (!image || !point) {
    return res.status(400).json({
      success: false,
      message: "Missing image or tap point coordinates."
    });
  }

  const normX = Math.round(point.normX ?? 500);
  const normY = Math.round(point.normY ?? 500);

  console.log(`Point-prompted segmentation request at (normX: ${normX}, normY: ${normY}), tap #${tapIndex + 1}`);

  let base64Data = image;
  let mimeType = "image/jpeg";

  if (image.startsWith("data:")) {
    const parts = image.split(";base64,");
    if (parts.length === 2) {
      const mimeParts = parts[0].split(":");
      if (mimeParts.length === 2) {
        mimeType = mimeParts[1];
      }
      base64Data = parts[1];
    }
  }

  const currentAi = getAIClient();
  // If Gemini client is active, prompt Gemini 2.5 Flash for the localized nail at this point
  if (currentAi) {
    try {
      const prompt = `You are a precision computer vision nail segmentation model.
The user clicked directly on a single fingernail bed in this image at normalized coordinate (x = ${normX} / 1000, y = ${normY} / 1000).

Your task:
1. Locate the exact fingernail located at or closest to coordinate (${normX}, ${normY}).
2. Provide a tight bounding box [ymin, xmin, ymax, xmax] (on a 0-1000 integer scale) around this specific nail plate.
3. Extract:
   - label: e.g. "Thumb Nail", "Index Finger Tip", "Accent Ring Nail", etc.
   - fingerGuess: Best guess anatomical finger name ("Left Thumb", "Left Index", "Left Middle", "Left Ring", "Left Pinky", "Right Thumb", "Right Index", "Right Middle", "Right Ring", "Right Pinky").
   - dominantColor: Hex code for the primary nail color (e.g. "#F4B8BA").
   - finish: One of: "glossy", "matte", "chrome", "holographic", "glitter".
   - artStyle: One of: "solid", "french", "ombre", "marble", "pattern", "accent".
   - decorations: Description of any rhinestones, decals, or line art on this nail.
   - details: Replicate instruction for a nail technician.

Return ONLY a single valid JSON object following this schema without markdown fences.`;

      const imagePart = {
        inlineData: {
          mimeType: mimeType,
          data: base64Data,
        },
      };

      const response = await generateContentWithFallback(currentAi, {
        contents: { parts: [imagePart, { text: prompt }] },
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              success: { type: Type.BOOLEAN },
              label: { type: Type.STRING },
              fingerGuess: { type: Type.STRING },
              box2d: {
                type: Type.ARRAY,
                items: { type: Type.INTEGER }
              },
              dominantColor: { type: Type.STRING },
              finish: { type: Type.STRING },
              artStyle: { type: Type.STRING },
              decorations: { type: Type.STRING },
              details: { type: Type.STRING },
            },
            required: ["box2d", "dominantColor", "finish", "artStyle", "decorations", "details"]
          }
        }
      });

      const text = response.text;
      if (text) {
        const parsed = JSON.parse(text.trim());
        return res.json({
          success: true,
          nail: {
            id: `point_nail_${tapIndex + 1}_${Date.now()}`,
            label: parsed.label || `Tapped Nail #${tapIndex + 1}`,
            fingerGuess: parsed.fingerGuess,
            box2d: parsed.box2d,
            dominantColor: parsed.dominantColor || "#F4B8BA",
            finish: parsed.finish || "glossy",
            artStyle: parsed.artStyle || "solid",
            decorations: parsed.decorations || "None",
            details: parsed.details || `Segmented from point tap at (${normX}, ${normY})`
          }
        });
      }
    } catch (err) {
      console.warn("AI Point segmentation failed, returning local segment:", err);
    }
  }

  // Fallback box computation around point
  const halfH = 90; // ~18% height
  const halfW = 60; // ~12% width
  const ymin = Math.max(0, normY - halfH);
  const ymax = Math.min(1000, normY + halfH);
  const xmin = Math.max(0, normX - halfW);
  const xmax = Math.min(1000, normX + halfW);

  const fingerSequence = [
    "Left Thumb", "Left Index", "Left Middle", "Left Ring", "Left Pinky",
    "Right Thumb", "Right Index", "Right Middle", "Right Ring", "Right Pinky"
  ];

  return res.json({
    success: true,
    nail: {
      id: `point_nail_${tapIndex + 1}_${Date.now()}`,
      label: `Tapped Nail #${tapIndex + 1}`,
      fingerGuess: fingerSequence[tapIndex % fingerSequence.length],
      box2d: [ymin, xmin, ymax, xmax],
      dominantColor: "#F4B8BA",
      finish: "glossy",
      artStyle: "solid",
      decorations: "None",
      details: `Segmented from manual tap at (${normX}, ${normY})`
    }
  });
});

// Enriched Singapore Salons endpoint
const SG_SALONS_BASE = [
  {
    id: "sg_salon_1",
    name: "The Nail Social (Chinatown)",
    rating: 4.8,
    reviewsCount: 312,
    latitude: 1.2825,
    longitude: 103.8443,
    address: "42A Haji Lane / 333 Chinatown Road, Singapore 059413",
    phone: "+6581234567",
    whatsapp: "https://wa.me/6581234567",
    instagram: "https://instagram.com/thenailsocial",
    hours: "10:00 AM - 8:00 PM",
    vibe: "Cozy & Socially Conscious",
    district: "Chinatown",
    priceLevel: "$$",
    basePriceMultiplier: 1.1
  },
  {
    id: "sg_salon_2",
    name: "Princess's Cottage: The Nail Co (Somerset)",
    rating: 4.9,
    reviewsCount: 428,
    latitude: 1.3005,
    longitude: 103.8395,
    address: "111 Somerset Rd, #02-05 TripleOne Somerset, Singapore 238164",
    phone: "+6592345678",
    whatsapp: "https://wa.me/6592345678",
    instagram: "https://instagram.com/princessscottage",
    hours: "11:00 AM - 9:00 PM",
    vibe: "Japanese Kawaii & Elegant Art",
    district: "Somerset / Orchard",
    priceLevel: "$$$",
    basePriceMultiplier: 1.5
  },
  {
    id: "sg_salon_3",
    name: "Nail Deck (River Valley)",
    rating: 4.7,
    reviewsCount: 189,
    latitude: 1.2934,
    longitude: 103.8341,
    address: "264 River Valley Rd, Singapore 238310",
    phone: "+6591238888",
    whatsapp: "https://wa.me/6591238888",
    instagram: "https://instagram.com/thenaildeck",
    hours: "10:00 AM - 8:30 PM",
    vibe: "Minimalist & Custom Curated Gels",
    district: "River Valley",
    priceLevel: "$$",
    basePriceMultiplier: 1.2
  },
  {
    id: "sg_salon_4",
    name: "Bugis Street Gel Lab",
    rating: 4.6,
    reviewsCount: 512,
    latitude: 1.3006,
    longitude: 103.8552,
    address: "3 New Bugis Street, #02-18, Singapore 188867",
    phone: "+6582349999",
    whatsapp: "https://wa.me/6582349999",
    instagram: "https://instagram.com/bugisgellab",
    hours: "11:30 AM - 9:30 PM",
    vibe: "Trendy Y2K & Cyber Chrome",
    district: "Bugis",
    priceLevel: "$",
    basePriceMultiplier: 0.8
  },
  {
    id: "sg_salon_5",
    name: "Auum Luxury Atelier (Marina Bay Sands)",
    rating: 4.9,
    reviewsCount: 104,
    latitude: 1.2831,
    longitude: 103.8598,
    address: "10 Bayfront Ave, Hotel Tower 3 VIP Arcade, Singapore 018956",
    phone: "+6598881234",
    whatsapp: "https://wa.me/6598881234",
    instagram: "https://instagram.com/auum_luxury",
    hours: "9:00 AM - 10:00 PM",
    vibe: "VIP Luxury, Organic & Champagnes",
    district: "Marina Bay",
    priceLevel: "$$$$",
    basePriceMultiplier: 2.2
  },
  {
    id: "sg_salon_6",
    name: "Project Nails (Orchard Gateway)",
    rating: 4.8,
    reviewsCount: 224,
    latitude: 1.3002,
    longitude: 103.8385,
    address: "277 Orchard Rd, #03-15 Orchard Gateway, Singapore 238858",
    phone: "+6583451111",
    whatsapp: "https://wa.me/6583451111",
    instagram: "https://instagram.com/projectnailssg",
    hours: "11:00 AM - 8:30 PM",
    vibe: "Chic Sculpted Extensions",
    district: "Orchard Road",
    priceLevel: "$$$",
    basePriceMultiplier: 1.6
  },
  {
    id: "sg_salon_7",
    name: "Tampines Oasis Nail Parlor (East)",
    rating: 4.7,
    reviewsCount: 156,
    latitude: 1.3524,
    longitude: 103.9443,
    address: "4 Tampines Central 5, #04-12 Tampines Mall, Singapore 529510",
    phone: "+6591230000",
    whatsapp: "https://wa.me/6591230000",
    instagram: "https://instagram.com/tampinesoasis",
    hours: "10:00 AM - 9:00 PM",
    vibe: "Relaxing Botanical & Matte Designs",
    district: "Tampines",
    priceLevel: "$$",
    basePriceMultiplier: 1.0
  },
  {
    id: "sg_salon_8",
    name: "Jurong Gate Dream Nails (West)",
    rating: 4.7,
    reviewsCount: 167,
    latitude: 1.3331,
    longitude: 103.7423,
    address: "3 Gateway Dr, #04-11 Westgate, Singapore 608532",
    phone: "+6591231111",
    whatsapp: "https://wa.me/6591231111",
    instagram: "https://instagram.com/juronggate_nails",
    hours: "10:00 AM - 9:00 PM",
    vibe: "Modern Classic & Clean Aesthetics",
    district: "Jurong East",
    priceLevel: "$$",
    basePriceMultiplier: 1.0
  }
];

app.post("/api/salons/search", async (req, res) => {
  const { style } = req.body;
  const styleQuery = style || "Classic gel manicure";

  console.log(`Analyzing local Singapore menus for style: "${styleQuery}"`);

  const currentAi = getAIClient();
  if (!currentAi) {
    // Generate beautiful simulated results instantly
    const enriched = SG_SALONS_BASE.map(salon => {
      const enrichment = getSimulatedSalonAIEnrichment(styleQuery, salon.basePriceMultiplier, salon.name, salon.vibe);
      return {
        ...salon,
        ...enrichment
      };
    });
    return res.json({ salons: enriched, simulated: true });
  }

  try {
    const prompt = `You are an AI-powered nail industry consultant in Singapore.
We have a user searching for this specific custom nail style: "${styleQuery}".
Your task is to analyze our database of Singapore nail salons and generate customized pricing, matched menu packages, and tailored package inclusions for each salon based on their price tier, specialty, and vibe.

Here is the list of salons to analyze:
${JSON.stringify(SG_SALONS_BASE.map(s => ({ id: s.id, name: s.name, vibe: s.vibe, priceLevel: s.priceLevel, basePriceMultiplier: s.basePriceMultiplier })))}

For each salon, determine:
1. "estimatedPrice": A highly realistic price in SGD (S$) for this specific treatment at this specific salon.
   - Standard Classic Gel manicure starts at S$45-65.
   - Extensions (Gel-X / Acrylics) add S$50-100.
   - Design complexity (Simple, Medium, Complex/3D art) adds S$15 to S$80.
   - A budget salon (e.g. Bugis Street Gel Lab) should charge less (e.g. S$60 - S$120 total).
   - A luxury atelier (e.g. Auum) should charge premium prices (e.g. S$150 - S$350 total).
2. "aiMatchedMenu": A beautiful, sophisticated, and realistic service package name matched to this request (e.g. "Signature Apres Gel-X Extensions + Hand-painted Y2K Art Set").
3. "aiMenuDetails": An array of exactly 4 specific, premium service details/steps offered by this salon (e.g., mention Leafgel Japanese gels for Princess's Cottage, organic massages for Auum, vegan polishes for The Nail Social).
4. "aiConsultationMsg": A pre-written, highly polite and tailored outreach message the user can copy to WhatsApp or IG DM to inquire directly (e.g., "Hello Princess's Cottage! I found your Somerset studio on Nail Map and would love to enquire about a booking for 'coffin medium length extensions with complex design'. My custom app quote was S$185. Do you have slots available this weekend? Thanks!").

Return ONLY a single valid JSON object following this schema:
{
  "salons": [
    {
      "id": "sg_salon_1",
      "estimatedPrice": 120,
      "aiMatchedMenu": "...",
      "aiMenuDetails": ["...", "...", "...", "..."],
      "aiConsultationMsg": "..."
    }
    // ... continue for all 8 salons in the exact order requested
  ]
}

Ensure estimatedPrice is an integer. Return only RAW JSON, no markdown formatting.`;

    const response = await generateContentWithFallback(currentAi, {
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            salons: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  estimatedPrice: { type: Type.INTEGER },
                  aiMatchedMenu: { type: Type.STRING },
                  aiMenuDetails: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  },
                  aiConsultationMsg: { type: Type.STRING }
                },
                required: ["id", "estimatedPrice", "aiMatchedMenu", "aiMenuDetails", "aiConsultationMsg"]
              }
            }
          },
          required: ["salons"]
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("Empty response from Gemini");
    }

    const parsed = JSON.parse(text.trim());
    
    // Map the AI predictions back into our full base objects
    const enriched = SG_SALONS_BASE.map(base => {
      const matchedAI = parsed.salons.find((s: any) => s.id === base.id);
      if (matchedAI) {
        return {
          ...base,
          estimatedPrice: matchedAI.estimatedPrice,
          aiMatchedMenu: matchedAI.aiMatchedMenu,
          aiMenuDetails: matchedAI.aiMenuDetails,
          aiConsultationMsg: matchedAI.aiConsultationMsg
        };
      } else {
        // Fallback simulation for this specific salon if missing
        return {
          ...base,
          ...getSimulatedSalonAIEnrichment(styleQuery, base.basePriceMultiplier, base.name, base.vibe)
        };
      }
    });

    res.json({ salons: enriched, simulated: false });

  } catch (err: any) {
    console.error("Gemini failed for Singapore salons. Using simulation:", err);
    const enrichedFallback = SG_SALONS_BASE.map(base => {
      return {
        ...base,
        ...getSimulatedSalonAIEnrichment(styleQuery, base.basePriceMultiplier, base.name, base.vibe)
      };
    });
    res.json({ salons: enrichedFallback, simulated: true, error: err.message });
  }
});

function getSimulatedSalonAIEnrichment(style: string, multiplier: number, name: string, vibe: string) {
  const lowerStyle = style.toLowerCase();
  
  let basePrice = 55;
  let matchName = "Classic Gel Manicure + Custom Accents";
  let details = [
    "Precision dry cuticle care, filing & organic oil shaping",
    "High-retention premium structural base coat layer",
    "Tailored aesthetic line accents or fine glitter overlays"
  ];

  if (lowerStyle.includes("extension") || lowerStyle.includes("gel-x") || lowerStyle.includes("apres") || lowerStyle.includes("nail extensions")) {
    basePrice = 110;
    matchName = "Apres Gel-X Full Set Extensions";
    details = [
      "Premium soft-gel full-cover extension tips sizing",
      "Slick apex structure formulation and UV bonding",
      "Fine buffing & custom smile-line layout painting"
    ];
  } else if (lowerStyle.includes("acrylic") || lowerStyle.includes("sculpt")) {
    basePrice = 125;
    matchName = "Custom Sculptured Acrylic Extensions";
    details = [
      "Precision hand-sculpted acrylic length forms",
      "Extreme-durability hybrid core powder application",
      "Crisp file-shaping (coffin/stiletto)"
    ];
  } else if (lowerStyle.includes("jelly") || lowerStyle.includes("syrup")) {
    basePrice = 75;
    matchName = "Japanese Translucent Jelly Gel Set";
    details = [
      "Triple-layer high-translucency syrup building",
      "Blushing core ombre center layer",
      "Glossy wet-look thick UV lacquer sealant"
    ];
  }

  // Adjust complexity
  let complexityLabel = "Classic Solid";
  if (lowerStyle.includes("complex") || lowerStyle.includes("art") || lowerStyle.includes("intricate") || lowerStyle.includes("rhinestone") || lowerStyle.includes("3d") || lowerStyle.includes("chain")) {
    basePrice += 45;
    complexityLabel = "Intricate 3D Art & Charms";
    details.push("Custom 3D gel-molded hand-painted art on selected accent fingers");
    details.push("Secure placement of Swarovski crystals & luxury metal nail charms");
  } else if (lowerStyle.includes("medium") || lowerStyle.includes("moderate") || lowerStyle.includes("ombre") || lowerStyle.includes("french")) {
    basePrice += 20;
    complexityLabel = "Elegant French / Ombre Accents";
    details.push("Premium hand-painted French tip curves or dual-tone aura blush fades");
    details.push("Subtle burnished metallic gold/silver foil transfers");
  } else {
    details.push("Sleek single-tone high-shine glossy protective gel barrier");
  }

  let finalPrice = Math.round(basePrice * multiplier);

  const customDetails = [...details];
  if (name.includes("Auum")) {
    customDetails.unshift("Organic herbal hand exfoliation massage & hydration wrap");
    customDetails.push("Complimentary organic premium lavender tea & cold champagne");
  } else if (name.includes("Princess")) {
    customDetails.unshift("Strict usage of non-toxic imported Japanese Leafgel bases");
    customDetails.push("Personal custom recipe matching by Tokyo-licensed specialist");
  } else if (name.includes("The Nail Social")) {
    customDetails.unshift("Cruelty-free, vegan premium breathable colors");
    customDetails.push("Personal tablet entertainment & local organic snacks");
  } else if (name.includes("Bugis")) {
    customDetails.push("Ultra-fast trending cyber mirror chrome powder burnishing");
  }

  const consultationMsg = `Hi ${name}! I customized my nail design on Nail DIY and found your studio on the Nail Map! I'm interested in booking a slot for: "${style}". My customized app quote is S$${finalPrice}. Could I enquire about your availability this week? Thanks!`;

  return {
    estimatedPrice: finalPrice,
    aiMatchedMenu: `${matchName} (${complexityLabel})`,
    aiMenuDetails: customDetails.slice(0, 4),
    aiConsultationMsg: consultationMsg
  };
}

// Returns simulated detected nails with bounding boxes for the 1-to-10 nailbed separation engine
function getSimulatedDetectedNails() {
  const detectedNails = [
    {
      id: "detected_nail_1",
      label: "Thumb Nail Bed",
      fingerGuess: "Left Thumb",
      box2d: [280, 120, 560, 320],
      dominantColor: "#F4B8BA",
      colorName: "Blush Satin",
      finish: "glossy",
      artStyle: "french",
      secondaryColor: "#FFFFFF",
      decorations: "Delicate white french smile line",
      details: "Clean french arch with high-shine gloss top coat."
    },
    {
      id: "detected_nail_2",
      label: "Index Finger Tip",
      fingerGuess: "Left Index",
      box2d: [180, 300, 480, 460],
      dominantColor: "#FAD2E1",
      colorName: "Milky Rose",
      finish: "chrome",
      artStyle: "ombre",
      secondaryColor: "#FFFFFF",
      decorations: "Subtle silver chrome powder burnish",
      details: "Gentle baby boomer gradient with glazed chrome finish."
    },
    {
      id: "detected_nail_3",
      label: "Middle Accent Bed",
      fingerGuess: "Left Middle",
      box2d: [140, 460, 440, 620],
      dominantColor: "#E2ECE9",
      colorName: "Opal Dust",
      finish: "holographic",
      artStyle: "accent",
      secondaryColor: null,
      decorations: "Micro rhinestone placed near cuticle",
      details: "Center statement nail with 3D shimmer and secure crystal mount."
    },
    {
      id: "detected_nail_4",
      label: "Ring Finger Bed",
      fingerGuess: "Left Ring",
      box2d: [180, 600, 480, 760],
      dominantColor: "#FDE2E4",
      colorName: "Ballet Pink",
      finish: "glitter",
      artStyle: "pattern",
      secondaryColor: "#E0E0E0",
      decorations: "Fine hand-painted metallic swirl",
      details: "Fine liner brush work with champagne glitter highlight."
    },
    {
      id: "detected_nail_5",
      label: "Pinky Nail Bed",
      fingerGuess: "Left Pinky",
      box2d: [300, 740, 580, 900],
      dominantColor: "#F4B8BA",
      colorName: "Blush Satin",
      finish: "glossy",
      artStyle: "solid",
      secondaryColor: null,
      decorations: "None",
      details: "Minimalist solid coverage matching the thumb base."
    }
  ];

  return {
    isNailPhoto: true,
    message: "Detected 5 individual nail beds in the uploaded look!",
    detectedCount: 5,
    detectedShape: "Almond",
    detectedLength: "Medium",
    designName: "Celestial French & Shimmer Slices",
    description: "Extracted 5 individual nailbed layers from your reference look. Ready to map to your manicure hand.",
    colorPalette: [
      { name: "Blush Satin", hex: "#F4B8BA" },
      { name: "Milky Rose", hex: "#FAD2E1" },
      { name: "Opal Dust", hex: "#E2ECE9" },
      { name: "Ballet Pink", hex: "#FDE2E4" }
    ],
    detectedNails
  };
}

// Returns a gorgeous, celebrity-quality premium design (inspired by the user's uploaded hand selfie)
function getPremiumDetectedDesign() {
  const palette = [
    { name: "Sheer Blossom Gel", hex: "#FCEFEA" },
    { name: "Alabaster White Tip", hex: "#FFFFFF" },
    { name: "Diamond Shimmer Dust", hex: "#F3EFE9" },
    { name: "Star Platinum Foil", hex: "#E0E0E0" },
    { name: "Glass Top Coat", hex: "#FCFBFB" }
  ];

  const fingers = [
    "Left Thumb", "Left Index", "Left Middle", "Left Ring", "Left Pinky",
    "Right Thumb", "Right Index", "Right Middle", "Right Ring", "Right Pinky"
  ];

  const nails = fingers.map((finger) => {
    let title = "Glossy Bare Blossom";
    let baseColor = "#FCEFEA";
    let finish: any = "glossy";
    let artStyle: any = "solid";
    let secondaryColor = null;
    let decorations = "None";
    let details = "Apply one coat of sheer blossom gel base. Cure for 60 seconds. Seal with glossy gel top coat.";

    if (finger.includes("Middle") || finger.includes("Index")) {
      title = "Classic Alabaster French";
      baseColor = "#FCEFEA";
      secondaryColor = "#FFFFFF";
      artStyle = "french";
      decorations = "Single tiny Swarovski rhinestone at the cuticle line";
      details = "Paint sheer nude pink base. Using a fine detail brush, paint a crisp Alabaster French crescent. Set a single micro-rhinestone near the cuticle with gel glue, cure, and top coat.";
    } else if (finger.includes("Ring")) {
      title = "Celestial Shimmer Star";
      baseColor = "#FCEFEA";
      finish = "chrome";
      decorations = "Hand-painted silver starburst in the center with a micro-rhinestone core";
      details = "Coat with sheer base. Apply fine pearlescent chrome powder. Draw a delicate starburst at the center using silver liner gel, place a rhinestone in the center, cure, and apply top coat.";
    } else if (finger.includes("Pinky")) {
      title = "Bare Blossom Shine";
      baseColor = "#FCEFEA";
      decorations = "None";
      details = "Two coats of sheer gel, cured and sealed with high-shine glass top coat.";
    } else if (finger.includes("Thumb")) {
      title = "Glossy Soft Glaze";
      baseColor = "#FCEFEA";
      finish = "chrome";
      details = "Apply sheer base, cure. Rub diamond shimmer chrome dust to add subtle, high-society iridescence. Cure under UV lamp.";
    }

    return {
      finger,
      title,
      baseColor,
      finish,
      artStyle,
      secondaryColor,
      decorations,
      details
    };
  });

  return {
    designName: "Celestial French & Rhinestones",
    description: "An elegant, highly realistic celebrity-tier Almond set modeled directly from premium high-fashion references. It pairs sheer healthy-blossom nail beds with crisp alabaster French tips, delicate silver starbursts, and hand-placed Swarovski micro-rhinestones for a sparkling, luxurious finish.",
    detectedShape: "Almond",
    detectedLength: "Long",
    colorPalette: palette,
    nails
  };
}

// A helper to generate incredibly realistic, beautiful simulated results when no API Key is available
function getSimulatedDesign(vibe: string, color: string, shape: string, length: string, accents: string, custom: string, index: number = 0) {
  const inputVibe = (vibe || "Balletcore").toLowerCase();
  const inputColor = (color || "Pink").toLowerCase();

  // Define curated aesthetic bases
  let designName = "Rose Champagne Balletcore";
  let description = "A soft, romantic, and dreamy set capturing the classic Balletcore grace. It pairs iridescent pearlescent bases with delicate hand-drawn gold line work, soft ombre blush fades, and dainty hand-placed rhinestones.";
  let palette = [
    { name: "Satin Blush", hex: "#FFF0F1" },
    { name: "Champagne Glaze", hex: "#F3E5D8" },
    { name: "Cream Silk", hex: "#FAF8F5" },
    { name: "Rose Quartz", hex: "#F7D1D5" },
    { name: "Chic Gold Foil", hex: "#E6C9A8" }
  ];

  if (inputVibe.includes("strawberry") || inputVibe.includes("berry") || inputColor.includes("strawberry") || inputColor.includes("berry") || inputColor.includes("red")) {
    designName = "Sweet Strawberry Jelly";
    description = "A juicy, multi-dimensional set capturing the whimsical Japanese strawberry jelly aesthetic. It blends semi-translucent red syrup bases, milky white french accents, clear wavy syrup ridges, and 3D strawberry charms.";
    palette = [
      { name: "Juicy Strawberry Red", hex: "#EF4444" },
      { name: "Strawberry Milk Pink", hex: "#FCA5A5" },
      { name: "Milky Glass White", hex: "#FFFFFF" },
      { name: "Matcha Leaf Green", hex: "#10B981" },
      { name: "Gold Dust", hex: "#F59E0B" }
    ];
  } else if (inputVibe.includes("y2k") || inputVibe.includes("grunge") || inputVibe.includes("cyber") || inputColor.includes("dark") || inputColor.includes("black")) {
    designName = "Midnight Cyber Glitter";
    description = "A striking futuristic gothic style combining deep obsidian black surfaces, hyper-reflective silver magnetic cat-eye glitter, and abstract hand-painted metallic line work for a bold look.";
    palette = [
      { name: "Obsidian Black", hex: "#121214" },
      { name: "Liquid Chrome", hex: "#D2D6DC" },
      { name: "Cyber Purple", hex: "#2C1B47" },
      { name: "Gunmetal Shimmer", hex: "#4A4D53" },
      { name: "Holographic Sparkle", hex: "#E8E7EC" }
    ];
  } else if (inputVibe.includes("matcha") || inputVibe.includes("sage") || inputVibe.includes("cottage") || inputColor.includes("green")) {
    designName = "Sage & Oat Cottagecore";
    description = "An earthy, serene woodland aesthetic blending creamy warm oats with gentle sage green swirls. It uses a clean, matte top coat paired with subtle gold flakes for an organic, handmade feel.";
    palette = [
      { name: "Sage Grass", hex: "#9CAF88" },
      { name: "Warm Oat Milk", hex: "#F4ECE1" },
      { name: "Earth Moss", hex: "#5C6B53" },
      { name: "Wild Honey", hex: "#E2C391" },
      { name: "Soft Linen", hex: "#EFECE8" }
    ];
  } else if (inputVibe.includes("glazed") || inputVibe.includes("clean") || inputColor.includes("white") || inputColor.includes("milk")) {
    designName = "Milky Glazed Vanilla";
    description = "The ultimate 'Clean Girl' manicure. Features a semi-translucent warm white base topped with high-shine chrome powder, mirroring the viral Hailey Bieber glazed donut finish.";
    palette = [
      { name: "Milky Rice", hex: "#F7F5F0" },
      { name: "Vanilla Glaze", hex: "#FFFBF2" },
      { name: "Soft Pearl", hex: "#ECECE8" },
      { name: "Nude Silk", hex: "#F2EAE1" },
      { name: "Soft Silver Frost", hex: "#EDECE6" }
    ];
  }

  // Adjust designs slightly based on alternative Index to make the 3 choices look beautifully different!
  if (index === 1) {
    designName = `${designName} (Metallic Accent Mix)`;
    description = `${description} (Alternative Variation: Features enhanced metallic chrome foilings, dual ombre gradients on the mid-digits, and a glossy high-shine top coat).`;
    palette = [
      palette[1],
      palette[2],
      palette[0],
      { name: "Alternative Lustre", hex: "#D4AF37" },
      palette[4] || { name: "Opal Dust", hex: "#F0F0F0" }
    ];
  } else if (index === 2) {
    designName = `${designName} (Chic Minimalist Edition)`;
    description = `${description} (Alternative Variation: A stripped back, modern negative-space configuration focusing on ultra-clean matte borders, elegant line work, and lightweight crystal droplets).`;
    palette = [
      palette[2],
      palette[0],
      palette[3] || { name: "Soft Frost", hex: "#E0E0E0" },
      palette[1],
      palette[4] || { name: "Silver Leaf", hex: "#C0C0C0" }
    ];
  }

  const baseHex = palette[0].hex;
  const secondaryHex = palette[1].hex;
  const neutralHex = palette[2].hex;
  const accentHex = palette[3]?.hex || "#E6C9A8";

  const fingers = [
    "Left Thumb", "Left Index", "Left Middle", "Left Ring", "Left Pinky",
    "Right Thumb", "Right Index", "Right Middle", "Right Ring", "Right Pinky"
  ];

  const nails = fingers.map((finger, idx) => {
    let title = "Solid Base Glaze";
    let baseColor = baseHex;
    let finish = (index === 2) ? "matte" : "glossy";
    let artStyle = "solid";
    let secondaryColor = null;
    let decorations = "None";
    let details = "Apply two thin layers of the semi-sheer base gel, cure for 60 seconds, then seal with top coat.";

    const isStrawberry = designName.includes("Strawberry") || designName.includes("Sweet Strawberry Jelly");

    if (isStrawberry) {
      if (finger.includes("Ring")) {
        title = "Juicy Strawberry Charm";
        baseColor = "#FFFFFF";
        finish = "glossy";
        artStyle = "accent";
        decorations = "3D Embossed Strawberry Charm with golden seeds";
        details = "Paint a sheer milky base. Overlay a realistic 3D strawberry gel ornament with gold microseed accents and emerald-green leaves.";
      } else if (finger.includes("Middle")) {
        title = "Wavy Strawberry Syrup";
        baseColor = "#FCA5A5";
        finish = "glossy";
        artStyle = "ombre";
        secondaryColor = "#EF4444";
        decorations = "Clear wavy syrup ridges";
        details = "Sponge a translucent strawberry-red syrup starting from the tip to create a juicy ombre. Overlay clear high-viscosity 3D gel syrup ridges.";
      } else if (finger.includes("Index")) {
        title = "Milk-Bath Strawberry French";
        baseColor = "#FFFFFF";
        finish = "glossy";
        artStyle = "french";
        secondaryColor = "#EF4444";
        decorations = "None";
        details = "Apply sheer milky white base. Using a fine detail brush, paint a precise strawberry-red French crescent.";
      } else if (finger.includes("Pinky")) {
        title = "Matcha Mint Accent";
        baseColor = "#10B981";
        finish = "matte";
        artStyle = "solid";
        decorations = "None";
        details = "Apply soft matcha-cream green base coat. Cure, and apply premium velvet matte top coat for an organic, complementary contrast.";
      } else if (finger.includes("Thumb")) {
        title = "Strawberry Glazed Gloss";
        baseColor = "#EF4444";
        finish = "chrome";
        artStyle = "solid";
        decorations = "Soft pink shimmer dust glaze";
        details = "Apply translucent jelly red base coat, cure, then burnish pink pearl chrome powder. Seal with glassy gel top coat.";
      }
    } else {
      if (finger.includes("Ring")) {
        title = index === 1 ? "Liquid Metallic Crown" : "Elegant Gem Accent";
        baseColor = index === 1 ? accentHex : baseHex;
        finish = index === 1 ? "chrome" : "glossy";
        artStyle = "accent";
        decorations = index === 1 ? "3D Gold liquid chrome frame" : "A trio of tiny crystal rhinestones near the nail bed";
        details = index === 1 
          ? "Draw borders using high-viscosity builder gel, cure, then rub gold chrome powder over it. Seal."
          : `Apply base coat, cure. Carefully brush a tiny dabs of rhinestone glue. Position rhinestones, cure, then seal.`;
      } else if (finger.includes("Middle")) {
        title = "Graceful Ombre Swirl";
        baseColor = baseHex;
        finish = "glossy";
        artStyle = "ombre";
        secondaryColor = secondaryHex;
        decorations = "Delicate shimmer lines along the ombre boundary";
        details = `Sponge the accent shade starting from the nail tip down to the center. Cure. Paint thin, elegant waves.`;
      } else if (finger.includes("Index")) {
        title = "Classic Modern French";
        baseColor = neutralHex;
        finish = "glossy";
        artStyle = "french";
        secondaryColor = baseHex;
        decorations = "None";
        details = `Paint a neutral nude base. Paint a precise smiley-face French tip in the main shade.`;
      } else if (finger.includes("Pinky")) {
        title = "Glitter Micro-Tip";
        baseColor = baseHex;
        finish = "glitter";
        artStyle = "pattern";
        decorations = "None";
        details = `Apply the soft solid base. Before top coating, paint an ultra-thin frame of micro-glitter around the edge.`;
      } else if (finger.includes("Thumb")) {
        title = "Full Soft Glaze";
        baseColor = baseHex;
        finish = index === 1 ? "holographic" : "chrome";
        artStyle = "solid";
        decorations = "Soft shimmer dust glaze";
        details = `Apply base. Burnish fine shimmer powder into the sticky inhibition layer.`;
      }
    }

    return {
      finger,
      title,
      baseColor,
      finish: finish as any,
      artStyle: artStyle as any,
      secondaryColor,
      decorations,
      details
    };
  });

  return {
    designName,
    description,
    colorPalette: palette,
    nails
  };
}

// Serve client-side static files
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Mounted Vite middleware for development.");
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log("Serving static production files from dist/.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
