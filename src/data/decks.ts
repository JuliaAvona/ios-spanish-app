import { Card, Deck } from '../types';
import { VERB_DECKS } from './verbs';

// --- Numbers 0–100 ------------------------------------------------------
// Built programmatically: the 0–29 forms are irregular, 30–99 follow the
// "<tens> y <units>" pattern, and 100 is "cien".

const UNITS_0_29 = [
  'cero', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho',
  'nueve', 'diez', 'once', 'doce', 'trece', 'catorce', 'quince', 'dieciséis',
  'diecisiete', 'dieciocho', 'diecinueve', 'veinte', 'veintiuno', 'veintidós',
  'veintitrés', 'veinticuatro', 'veinticinco', 'veintiséis', 'veintisiete',
  'veintiocho', 'veintinueve',
];

const TENS: Record<number, string> = {
  30: 'treinta',
  40: 'cuarenta',
  50: 'cincuenta',
  60: 'sesenta',
  70: 'setenta',
  80: 'ochenta',
  90: 'noventa',
};

export function spanishNumber(n: number): string {
  if (n <= 29) return UNITS_0_29[n];
  if (n === 100) return 'cien';
  const tens = Math.floor(n / 10) * 10;
  const units = n % 10;
  return units === 0 ? TENS[tens] : `${TENS[tens]} y ${UNITS_0_29[units]}`;
}

function numberCards(): Card[] {
  return Array.from({ length: 101 }, (_, n) => ({
    en: String(n),
    es: spanishNumber(n),
  }));
}

// --- Colors -------------------------------------------------------------

const colorCards: Card[] = [
  { en: 'Red', es: 'rojo', color: '#E5392F' },
  { en: 'Orange', es: 'naranja', color: '#F2851E' },
  { en: 'Yellow', es: 'amarillo', color: '#F2C00E' },
  { en: 'Green', es: 'verde', color: '#34A853' },
  { en: 'Blue', es: 'azul', color: '#2D6CDF' },
  { en: 'Light blue', es: 'celeste', color: '#7EC8E3' },
  { en: 'Purple', es: 'morado', color: '#7E3FF2' },
  { en: 'Pink', es: 'rosa', color: '#F25C9C' },
  { en: 'Brown', es: 'marrón', color: '#8B5A2B' },
  { en: 'Black', es: 'negro', color: '#1A1A1A' },
  { en: 'White', es: 'blanco', color: '#FFFFFF' },
  { en: 'Gray', es: 'gris', color: '#9AA0A6' },
  { en: 'Gold', es: 'dorado', color: '#D4AF37' },
  { en: 'Silver', es: 'plateado', color: '#C0C0C0' },
];

// --- Body parts ---------------------------------------------------------

const bodyCards: Card[] = [
  { en: 'Head', es: 'la cabeza' },
  { en: 'Hair', es: 'el pelo' },
  { en: 'Face', es: 'la cara' },
  { en: 'Eye', es: 'el ojo' },
  { en: 'Ear', es: 'la oreja' },
  { en: 'Nose', es: 'la nariz' },
  { en: 'Mouth', es: 'la boca' },
  { en: 'Tooth', es: 'el diente' },
  { en: 'Tongue', es: 'la lengua' },
  { en: 'Neck', es: 'el cuello' },
  { en: 'Shoulder', es: 'el hombro' },
  { en: 'Arm', es: 'el brazo' },
  { en: 'Elbow', es: 'el codo' },
  { en: 'Hand', es: 'la mano' },
  { en: 'Finger', es: 'el dedo' },
  { en: 'Chest', es: 'el pecho' },
  { en: 'Back', es: 'la espalda' },
  { en: 'Stomach', es: 'el estómago' },
  { en: 'Leg', es: 'la pierna' },
  { en: 'Knee', es: 'la rodilla' },
  { en: 'Foot', es: 'el pie' },
  { en: 'Heart', es: 'el corazón' },
];

// --- Decks --------------------------------------------------------------

export const DECKS: Deck[] = [
  {
    id: 'colors',
    title: 'Colors',
    titleEs: 'Los colores',
    emoji: '🎨',
    accent: '#E07A5F',
    kind: 'vocab',
    cards: colorCards,
  },
  {
    id: 'numbers',
    title: 'Numbers 0–100',
    titleEs: 'Los números',
    emoji: '🔢',
    accent: '#3D7EA6',
    kind: 'vocab',
    cards: numberCards(),
  },
  {
    id: 'body',
    title: 'Body parts',
    titleEs: 'El cuerpo',
    emoji: '🧍',
    accent: '#7B61A8',
    kind: 'vocab',
    cards: bodyCards,
  },
  ...VERB_DECKS,
];

export function getDeck(id: string | undefined): Deck | undefined {
  return DECKS.find((d) => d.id === id);
}
