// Thin Plate Spline (TPS) 8-Point Geometric Rectification Engine for Nail Biometrics
// Maps non-planar, curved, angled fingernails into a standardized canonical 256x384 UV plane.

export interface Point2D {
  x: number;
  y: number;
}

export interface NailLandmarks8 {
  p0_cuticle_center: Point2D;
  p1_cuticle_left: Point2D;
  p2_lateral_mid_left: Point2D;
  p3_tip_left: Point2D;
  p4_tip_apex: Point2D;
  p5_tip_right: Point2D;
  p6_lateral_mid_right: Point2D;
  p7_cuticle_right: Point2D;
}

export interface RectificationQuality {
  visibility: number; // 0.0 to 1.0
  tiltAngleDeg: number;
  aspectRatio: number;
  designConfidence: number;
}

export interface CanonicalNailResult {
  canonicalPngDataUrl: string;
  rawCanonicalPngDataUrl: string;
  quality: RectificationQuality;
  landmarks: NailLandmarks8;
  dominantColor: string;
}

export const CANONICAL_WIDTH = 256;
export const CANONICAL_HEIGHT = 384;

// 8 Canonical Target Anchor Points in standardized 256x384 space
export const CANONICAL_LANDMARKS: Point2D[] = [
  { x: 128, y: 370 }, // p0: Cuticle Center
  { x: 48, y: 338 },  // p1: Cuticle Left Corner
  { x: 26, y: 192 },  // p2: Lateral Mid Left
  { x: 50, y: 44 },   // p3: Free-Edge Tip Left
  { x: 128, y: 12 },  // p4: Free-Edge Tip Apex (Top Center)
  { x: 206, y: 44 },  // p5: Free-Edge Tip Right
  { x: 230, y: 192 }, // p6: Lateral Mid Right
  { x: 208, y: 338 }  // p7: Cuticle Right Corner
];

/**
 * Radial Basis Function U(r) = r^2 * ln(r)
 */
function rbfKernel(r: number): number {
  if (r <= 1e-6) return 0;
  return r * r * Math.log(r);
}

/**
 * Euclidean distance
 */
function dist(p1: Point2D, p2: Point2D): number {
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Solves standard Ax = B linear system using Gaussian Elimination with partial pivoting
 */
function solveLinearSystem(A: number[][], B: number[]): number[] {
  const n = B.length;
  const M: number[][] = [];
  for (let i = 0; i < n; i++) {
    M[i] = [...A[i], B[i]];
  }

  for (let col = 0; col < n; col++) {
    // Pivot
    let maxRow = col;
    let maxVal = Math.abs(M[col][col]);
    for (let r = col + 1; r < n; r++) {
      if (Math.abs(M[r][col]) > maxVal) {
        maxVal = Math.abs(M[r][col]);
        maxRow = r;
      }
    }

    if (maxRow !== col) {
      const temp = M[col];
      M[col] = M[maxRow];
      M[maxRow] = temp;
    }

    const pivot = M[col][col];
    if (Math.abs(pivot) < 1e-12) continue;

    for (let c = col; c <= n; c++) {
      M[col][c] /= pivot;
    }

    for (let r = 0; r < n; r++) {
      if (r !== col) {
        const factor = M[r][col];
        for (let c = col; c <= n; c++) {
          M[r][c] -= factor * M[col][c];
        }
      }
    }
  }

  const result = new Array(n);
  for (let i = 0; i < n; i++) {
    result[i] = M[i][n];
  }
  return result;
}

/**
 * Fit 8-Point Anatomical Landmarks in photo space around a tap center
 */
export function estimateNailLandmarks(
  centerX: number,
  centerY: number,
  nailWidth: number,
  nailHeight: number,
  angleRad: number
): Point2D[] {
  const cos = Math.cos(angleRad);
  const sin = Math.sin(angleRad);

  const hw = nailWidth / 2;
  const hh = nailHeight / 2;

  // Normalized template offsets (-1 to 1)
  const templateOffsets = [
    { x: 0, y: hh * 0.95 },      // p0: Cuticle Center
    { x: -hw * 0.78, y: hh * 0.78 }, // p1: Cuticle Left
    { x: -hw * 0.95, y: 0 },          // p2: Mid Left
    { x: -hw * 0.75, y: -hh * 0.78 },// p3: Tip Left
    { x: 0, y: -hh * 0.98 },     // p4: Tip Apex
    { x: hw * 0.75, y: -hh * 0.78 }, // p5: Tip Right
    { x: hw * 0.95, y: 0 },          // p6: Mid Right
    { x: hw * 0.78, y: hh * 0.78 }  // p7: Cuticle Right
  ];

  return templateOffsets.map((pt) => {
    const rotX = pt.x * cos - pt.y * sin;
    const rotY = pt.x * sin + pt.y * cos;
    return {
      x: centerX + rotX,
      y: centerY + rotY
    };
  });
}

/**
 * Computes Thin Plate Spline (TPS) Backward Mapping Parameters
 * Source points Q (Canonical space), Destination points P (Photo space)
 */
export function computeTPSCoefficients(canonicalQ: Point2D[], photoP: Point2D[]) {
  const numPoints = canonicalQ.length;
  const matrixSize = numPoints + 3;

  const L: number[][] = Array.from({ length: matrixSize }, () => new Array(matrixSize).fill(0));
  const Bx: number[] = new Array(matrixSize).fill(0);
  const By: number[] = new Array(matrixSize).fill(0);

  // Fill K matrix: K_ij = U(|Q_i - Q_j|) with regularization
  const lambda = 0.005; // Regularization parameter to prevent extreme warping
  for (let i = 0; i < numPoints; i++) {
    for (let j = 0; j < numPoints; j++) {
      if (i === j) {
        L[i][j] = lambda;
      } else {
        const d = dist(canonicalQ[i], canonicalQ[j]);
        L[i][j] = rbfKernel(d);
      }
    }
    // Fill P block: [1, Q_x, Q_y]
    L[i][numPoints] = 1;
    L[i][numPoints + 1] = canonicalQ[i].x;
    L[i][numPoints + 2] = canonicalQ[i].y;

    // Fill P^T block
    L[numPoints][i] = 1;
    L[numPoints + 1][i] = canonicalQ[i].x;
    L[numPoints + 2][i] = canonicalQ[i].y;

    // Target photo coordinates
    Bx[i] = photoP[i].x;
    By[i] = photoP[i].y;
  }

  const coeffX = solveLinearSystem(L, Bx);
  const coeffY = solveLinearSystem(L, By);

  return { coeffX, coeffY };
}

/**
 * Renders the Canonical Rectified Nail (256x384) using TPS Nonlinear Warping & Masking
 */
export function warpNailToCanonicalSpace(
  sourceImage: HTMLImageElement,
  photoLandmarks: Point2D[],
  applyBake: boolean = true
): CanonicalNailResult {
  const targetW = CANONICAL_WIDTH;
  const targetH = CANONICAL_HEIGHT;

  const canonicalLandmarks = CANONICAL_LANDMARKS;
  const numAnchors = canonicalLandmarks.length;

  // 1. Calculate TPS mapping coefficients
  const { coeffX, coeffY } = computeTPSCoefficients(canonicalLandmarks, photoLandmarks);

  // 2. Source Image Canvas
  const naturalW = sourceImage.naturalWidth || sourceImage.width;
  const naturalH = sourceImage.naturalHeight || sourceImage.height;

  const srcCanvas = document.createElement("canvas");
  srcCanvas.width = naturalW;
  srcCanvas.height = naturalH;
  const srcCtx = srcCanvas.getContext("2d", { willReadFrequently: true });
  if (!srcCtx) throw new Error("Could not initialize 2D context");
  srcCtx.drawImage(sourceImage, 0, 0);

  const srcImgData = srcCtx.getImageData(0, 0, naturalW, naturalH);
  const srcData = srcImgData.data;

  // 3. Output Canonical Canvas
  const outCanvas = document.createElement("canvas");
  outCanvas.width = targetW;
  outCanvas.height = targetH;
  const outCtx = outCanvas.getContext("2d");
  if (!outCtx) throw new Error("Could not initialize canonical context");

  const outImgData = outCtx.createImageData(targetW, targetH);
  const outData = outImgData.data;

  // 4. Create standard canonical nail boundary mask path
  const maskCanvas = document.createElement("canvas");
  maskCanvas.width = targetW;
  maskCanvas.height = targetH;
  const maskCtx = maskCanvas.getContext("2d");
  if (!maskCtx) throw new Error("Could not initialize mask context");

  maskCtx.beginPath();
  maskCtx.moveTo(canonicalLandmarks[0].x, canonicalLandmarks[0].y);
  maskCtx.bezierCurveTo(
    canonicalLandmarks[1].x - 10,
    canonicalLandmarks[1].y,
    canonicalLandmarks[1].x,
    canonicalLandmarks[1].y - 20,
    canonicalLandmarks[2].x,
    canonicalLandmarks[2].y
  );
  maskCtx.bezierCurveTo(
    canonicalLandmarks[2].x,
    canonicalLandmarks[2].y - 60,
    canonicalLandmarks[3].x - 15,
    canonicalLandmarks[3].y + 20,
    canonicalLandmarks[4].x,
    canonicalLandmarks[4].y
  );
  maskCtx.bezierCurveTo(
    canonicalLandmarks[5].x + 15,
    canonicalLandmarks[5].y + 20,
    canonicalLandmarks[6].x,
    canonicalLandmarks[6].y - 60,
    canonicalLandmarks[6].x,
    canonicalLandmarks[6].y
  );
  maskCtx.bezierCurveTo(
    canonicalLandmarks[6].x,
    canonicalLandmarks[6].y + 60,
    canonicalLandmarks[7].x + 10,
    canonicalLandmarks[7].y,
    canonicalLandmarks[0].x,
    canonicalLandmarks[0].y
  );
  maskCtx.closePath();
  maskCtx.fillStyle = "#FFFFFF";
  maskCtx.fill();

  const maskData = maskCtx.getImageData(0, 0, targetW, targetH).data;

  let totalR = 0, totalG = 0, totalB = 0, validPixelCount = 0;
  let outOfBoundsCount = 0;

  // 5. Warp: Iterate every canonical pixel (x, y) and sample (u, v) from photo
  for (let y = 0; y < targetH; y++) {
    for (let x = 0; x < targetW; x++) {
      const outIdx = (y * targetW + x) * 4;
      const isInsideNail = maskData[outIdx] > 100;

      if (!isInsideNail) {
        outData[outIdx + 3] = 0; // Transparent
        continue;
      }

      // Evaluate TPS at (x, y)
      let u = coeffX[numAnchors] + coeffX[numAnchors + 1] * x + coeffX[numAnchors + 2] * y;
      let v = coeffY[numAnchors] + coeffY[numAnchors + 1] * x + coeffY[numAnchors + 2] * y;

      for (let i = 0; i < numAnchors; i++) {
        const d = dist({ x, y }, canonicalLandmarks[i]);
        const rbf = rbfKernel(d);
        u += coeffX[i] * rbf;
        v += coeffY[i] * rbf;
      }

      // Check photo boundaries
      if (u < 0 || u >= naturalW - 1 || v < 0 || v >= naturalH - 1) {
        outOfBoundsCount++;
        outData[outIdx + 3] = 0;
        continue;
      }

      // Bilinear interpolation
      const u0 = Math.floor(u);
      const v0 = Math.floor(v);
      const u1 = u0 + 1;
      const v1 = v0 + 1;
      const du = u - u0;
      const dv = v - v0;

      const idx00 = (v0 * naturalW + u0) * 4;
      const idx10 = (v0 * naturalW + u1) * 4;
      const idx01 = (v1 * naturalW + u0) * 4;
      const idx11 = (v1 * naturalW + u1) * 4;

      const w00 = (1 - du) * (1 - dv);
      const w10 = du * (1 - dv);
      const w01 = (1 - du) * dv;
      const w11 = du * dv;

      const r = Math.round(srcData[idx00] * w00 + srcData[idx10] * w10 + srcData[idx01] * w01 + srcData[idx11] * w11);
      const g = Math.round(srcData[idx00 + 1] * w00 + srcData[idx10 + 1] * w10 + srcData[idx01 + 1] * w01 + srcData[idx11 + 1] * w11);
      const b = Math.round(srcData[idx00 + 2] * w00 + srcData[idx10 + 2] * w10 + srcData[idx01 + 2] * w01 + srcData[idx11 + 2] * w11);

      outData[outIdx] = r;
      outData[outIdx + 1] = g;
      outData[outIdx + 2] = b;
      outData[outIdx + 3] = 255;

      totalR += r;
      totalG += g;
      totalB += b;
      validPixelCount++;
    }
  }

  outCtx.putImageData(outImgData, 0, 0);

  const rawCanonicalPngDataUrl = outCanvas.toDataURL("image/png");

  // Dominant base color in hex
  const dominantColor =
    validPixelCount > 0
      ? "#" +
        [totalR / validPixelCount, totalG / validPixelCount, totalB / validPixelCount]
          .map((c) => Math.round(c).toString(16).padStart(2, "0"))
          .join("")
      : "#F4B8BA";

  // Calculate tilt angle & quality metrics
  const deltaX = photoLandmarks[4].x - photoLandmarks[0].x;
  const deltaY = photoLandmarks[4].y - photoLandmarks[0].y;
  const tiltRad = Math.atan2(deltaY, deltaX);
  const tiltAngleDeg = Math.round(((tiltRad + Math.PI / 2) * 180) / Math.PI);

  const totalNailPixels = validPixelCount + outOfBoundsCount;
  const visibility = totalNailPixels > 0 ? Math.max(0.2, Math.min(1.0, validPixelCount / totalNailPixels)) : 0.85;

  const quality: RectificationQuality = {
    visibility: Number(visibility.toFixed(2)),
    tiltAngleDeg: tiltAngleDeg,
    aspectRatio: Number((CANONICAL_HEIGHT / CANONICAL_WIDTH).toFixed(2)),
    designConfidence: Number((visibility * (Math.abs(tiltAngleDeg) < 60 ? 0.95 : 0.78)).toFixed(2))
  };

  // 6. Apply Baked Glossy Topcoat
  if (applyBake) {
    outCtx.save();
    outCtx.globalCompositeOperation = "source-atop";

    // Specular Reflection Curved Arc
    const glossGrad = outCtx.createLinearGradient(0, 0, targetW * 0.65, targetH * 0.85);
    glossGrad.addColorStop(0, "rgba(255, 255, 255, 0.78)");
    glossGrad.addColorStop(0.25, "rgba(255, 255, 255, 0.45)");
    glossGrad.addColorStop(0.55, "rgba(255, 255, 255, 0.0)");
    glossGrad.addColorStop(1, "rgba(255, 255, 255, 0.2)");

    outCtx.fillStyle = glossGrad;
    outCtx.beginPath();
    outCtx.ellipse(targetW * 0.35, targetH * 0.38, targetW * 0.14, targetH * 0.35, -0.12, 0, Math.PI * 2);
    outCtx.fill();

    // Apex Glint
    const glint = outCtx.createRadialGradient(targetW * 0.32, targetH * 0.22, 1, targetW * 0.32, targetH * 0.22, targetW * 0.22);
    glint.addColorStop(0, "rgba(255, 255, 255, 0.95)");
    glint.addColorStop(0.4, "rgba(255, 255, 255, 0.4)");
    glint.addColorStop(1, "rgba(255, 255, 255, 0)");

    outCtx.fillStyle = glint;
    outCtx.beginPath();
    outCtx.arc(targetW * 0.32, targetH * 0.22, targetW * 0.22, 0, Math.PI * 2);
    outCtx.fill();

    outCtx.restore();
  }

  const canonicalPngDataUrl = outCanvas.toDataURL("image/png");

  return {
    canonicalPngDataUrl,
    rawCanonicalPngDataUrl,
    quality,
    landmarks: {
      p0_cuticle_center: photoLandmarks[0],
      p1_cuticle_left: photoLandmarks[1],
      p2_lateral_mid_left: photoLandmarks[2],
      p3_tip_left: photoLandmarks[3],
      p4_tip_apex: photoLandmarks[4],
      p5_tip_right: photoLandmarks[5],
      p6_lateral_mid_right: photoLandmarks[6],
      p7_cuticle_right: photoLandmarks[7]
    },
    dominantColor
  };
}
