export type SizeUnit = "px" | "mm" | "cm";

export interface CanvasSize {
  width: number;
  height: number;
}

export const DEFAULT_CANVAS_SIZE: CanvasSize = { width: 800, height: 600 };
export const FALLBACK_IMPORT_SIZE: CanvasSize = { width: 1920, height: 1080 };

const MAX_EDGE_PX = 8000;
const CSS_DPI = 96;

export function toPixels(value: number, unit: SizeUnit): number {
  if (!Number.isFinite(value) || value <= 0) {
    return 1;
  }

  let pixels = value;
  if (unit === "mm") {
    pixels = (value / 25.4) * CSS_DPI;
  } else if (unit === "cm") {
    pixels = (value / 2.54) * CSS_DPI;
  }

  return Math.min(MAX_EDGE_PX, Math.max(1, Math.round(pixels)));
}

export function customCanvasSize(
  width: number,
  height: number,
  unit: SizeUnit
): CanvasSize {
  return {
    width: toPixels(width, unit),
    height: toPixels(height, unit),
  };
}

/** Tamanho em CSS px (96dpi) usado na prancheta Fabric. */
export const FORMAT_CANVAS_SIZE: Record<string, CanvasSize> = {
  "infinite-canvas": { width: 1920, height: 1080 },
  "a4-report": { width: toPixels(210, "mm"), height: toPixels(297, "mm") },
  presentation: { width: 1920, height: 1080 },
  whiteboard: { width: 1920, height: 1080 },
  "social-post": { width: 1080, height: 1080 },
  "weekly-planner": { width: 1920, height: 1080 },
  "workflow-diagram": { width: 1920, height: 1080 },
  "web-banner": { width: 1200, height: 630 },
};

export function canvasSizeForFormatId(formatId: string): CanvasSize {
  return FORMAT_CANVAS_SIZE[formatId] ?? DEFAULT_CANVAS_SIZE;
}

export function sanitizeCanvasSize(
  width: unknown,
  height: unknown
): CanvasSize {
  const w = typeof width === "number" && width > 0 ? Math.round(width) : DEFAULT_CANVAS_SIZE.width;
  const h = typeof height === "number" && height > 0 ? Math.round(height) : DEFAULT_CANVAS_SIZE.height;
  return {
    width: Math.min(MAX_EDGE_PX, w),
    height: Math.min(MAX_EDGE_PX, h),
  };
}
