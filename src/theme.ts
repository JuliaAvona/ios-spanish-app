// Visual language — Skyeng-inspired: cool light canvas, white shadowed cards,
// a vivid indigo primary, deep-navy type, fresh green for "correct".

export const COLORS = {
  bg: '#F4F2FB',
  card: '#FFFFFF',
  ink: '#16163A',
  inkSoft: '#6E7191',
  inkFaint: '#A9ADC9',
  border: '#EAE7F6',

  primary: '#5046E5',
  primaryDark: '#372FBF',
  primarySoft: '#ECEAFD',

  // Skyeng's near-black "active chip" navy.
  navy: '#16163A',

  success: '#22C06B',
  successSoft: '#E1F7EC',

  warn: '#FF9F2E',
  warnSoft: '#FFF3E1',

  shadow: '#332A6B',
} as const;

// Rubik — a friendly geometric sans close to Skyeng's brand type.
// Google Fonts registers each weight as its own family, so fontWeight has no
// effect; set fontFamily explicitly via these tokens.
export const FONT = {
  regular: 'Rubik_400Regular',
  medium: 'Rubik_500Medium',
  semibold: 'Rubik_600SemiBold',
  bold: 'Rubik_700Bold',
  extrabold: 'Rubik_800ExtraBold',
} as const;

// Skyeng-style gradients (used via expo-linear-gradient).
export const GRADIENTS = {
  hero: ['#6E7CFF', '#A57BFF'] as const, // blue → lilac (home header)
  brand: ['#7A5CFF', '#E15BD0'] as const, // violet → magenta (signature accent)
  success: ['#2BD17E', '#16A862'] as const, // fresh green (positive actions)
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
  sm: 12,
  md: 16,
  lg: 22,
  xl: 28,
  pill: 999,
} as const;

// Soft, slightly-blue elevation used across cards and buttons.
export const SHADOW = {
  sm: {
    shadowColor: COLORS.shadow,
    shadowOpacity: 0.07,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
    elevation: 3,
  },
  md: {
    shadowColor: COLORS.shadow,
    shadowOpacity: 0.1,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
} as const;

/** A colored "glow" shadow for primary/positive buttons. */
export function glow(color: string) {
  return {
    shadowColor: color,
    shadowOpacity: 0.35,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  } as const;
}

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
