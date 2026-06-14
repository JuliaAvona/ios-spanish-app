// Shared visual language for the app — a warm, Spanish-flavored palette.

export const COLORS = {
  bg: '#FBF7F0',
  card: '#FFFFFF',
  ink: '#2B2520',
  inkSoft: '#7A6F63',
  inkFaint: '#B6ABA0',
  border: '#ECE3D8',

  primary: '#E07A5F',
  primaryDark: '#C45D43',

  success: '#2E9E6B',
  successSoft: '#E4F4EC',

  warn: '#E0A23F',
  warnSoft: '#FBF0DC',

  shadow: '#2B2520',
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const RADIUS = {
  sm: 10,
  md: 16,
  lg: 22,
  xl: 28,
} as const;

/** Cards whose swatch is very light need a dark check/border to stay visible. */
export function isLightColor(hex: string): boolean {
  const c = hex.replace('#', '');
  if (c.length < 6) return false;
  const r = parseInt(c.slice(0, 2), 16);
  const g = parseInt(c.slice(2, 4), 16);
  const b = parseInt(c.slice(4, 6), 16);
  // Perceived luminance.
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.8;
}
