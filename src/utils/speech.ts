import * as Speech from 'expo-speech';

/** Speak Spanish text aloud. No-op if the speech module is unavailable. */
export function speakSpanish(text: string) {
  try {
    Speech.stop();
    // Drop parenthetical notes and speak only the first of "a / b" variants.
    const clean = text
      .replace(/\([^)]*\)/g, '')
      .split('/')[0]
      .trim();
    if (!clean) return;
    Speech.speak(clean, { language: 'es-ES', rate: 0.95, pitch: 1.0 });
  } catch {
    // expo-speech native module not present in this runtime — ignore.
  }
}
