export type NailFinish = "glossy" | "matte" | "chrome" | "holographic" | "glitter";
export type NailArtStyle = "solid" | "french" | "ombre" | "marble" | "pattern" | "accent";

export interface ColorPaletteItem {
  name: string;
  hex: string;
}

export interface NailDesign {
  finger: string; // e.g. "Left Thumb", "Left Index", etc.
  title: string;
  baseColor: string;
  finish: NailFinish;
  artStyle: NailArtStyle;
  secondaryColor?: string | null;
  decorations: string;
  details: string;
  croppedImage?: string | null; // Stores the base64/URL of the user's custom cropped reference image for this nail!
  overlayImage?: string | null; // Stores an optional second overlay reference photo (e.g., star/flower) on top!
}

export interface NailCollection {
  designName: string;
  description: string;
  colorPalette: ColorPaletteItem[];
  nails: NailDesign[];
  simulated?: boolean;
  message?: string;
}

export interface ReferenceImage {
  id: string;
  src: string; // Base64 or object URL of the uploaded picture
  name: string;
}

export interface PresetAesthetic {
  id: string;
  name: string;
  vibe: string;
  colorPreference: string;
  shape: string;
  length: string;
  extraAccents: string;
  description: string;
  colors: string[];
}
