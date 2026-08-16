import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

async function processImage(inputPath, outputPath) {
  if (!fs.existsSync(inputPath)) {
    console.log(`Skipping missing ${inputPath}`);
    return;
  }
  const image = sharp(inputPath);
  const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  const outBuffer = Buffer.alloc(width * height * 4);

  // Sample corner background color (top-left 15x15)
  let bgR = 0, bgG = 0, bgB = 0, sampleCount = 0;
  for (let y = 0; y < Math.min(15, height); y++) {
    for (let x = 0; x < Math.min(15, width); x++) {
      const idx = (y * width + x) * channels;
      bgR += data[idx];
      bgG += data[idx + 1];
      bgB += data[idx + 2];
      sampleCount++;
    }
  }
  bgR /= sampleCount;
  bgG /= sampleCount;
  bgB /= sampleCount;

  for (let i = 0; i < width * height; i++) {
    const srcIdx = i * channels;
    const dstIdx = i * 4;

    const r = data[srcIdx];
    const g = data[srcIdx + 1];
    const b = data[srcIdx + 2];

    const dR = r - bgR;
    const dG = g - bgG;
    const dB = b - bgB;
    const dist = Math.sqrt(dR * dR + dG * dG + dB * dB);
    const brightness = (r + g + b) / 3;

    let alpha = 255;
    if (dist < 18 && brightness > 228) {
      alpha = 0;
    } else if (dist < 38 && brightness > 210) {
      alpha = Math.round(((dist - 18) / 20) * 255);
    } else if (brightness > 248) {
      alpha = Math.max(0, Math.round((255 - brightness) / 7 * 255));
    }

    outBuffer[dstIdx] = r;
    outBuffer[dstIdx + 1] = g;
    outBuffer[dstIdx + 2] = b;
    outBuffer[dstIdx + 3] = alpha;
  }

  await sharp(outBuffer, {
    raw: {
      width,
      height,
      channels: 4
    }
  })
    .trim({ threshold: 5 })
    .png({ quality: 100, compressionLevel: 9 })
    .toFile(outputPath);

  console.log(`Saved transparent PNG: ${outputPath}`);
}

async function main() {
  const publicDir = path.resolve('public/charms');
  if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });

  await processImage('public/charms/gummy_bear.jpg', 'public/charms/gummy_bear.png');
  await processImage('public/charms/pearl_bow.jpg', 'public/charms/pearl_bow.png');
  await processImage('public/charms/aurora_crystal.jpg', 'public/charms/aurora_crystal.png');
  await processImage('public/charms/birthday_cake.jpg', 'public/charms/birthday_cake.png');
}

main().catch(console.error);
