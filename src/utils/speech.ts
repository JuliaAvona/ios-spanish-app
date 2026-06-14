import * as Speech from 'expo-speech';

// Pick the most natural Spanish voice the device offers, preferring downloaded
// "Enhanced/Premium" voices over the robotic default, and Spain → Latin America
// by region. Resolved once and cached.
let voiceId: string | null | undefined; // undefined = not resolved yet
let resolving: Promise<void> | null = null;

const REGION_PRIORITY = ['es-ES', 'es-US', 'es-MX', 'es-419', 'es-AR', 'es-CO'];

function scoreVoice(v: Speech.Voice): number {
  let s = 0;
  if (v.quality === Speech.VoiceQuality.Enhanced) s += 100; // big win — much less robotic
  const idx = REGION_PRIORITY.indexOf(v.language);
  if (idx !== -1) s += REGION_PRIORITY.length - idx;
  return s;
}

async function resolveVoice(): Promise<void> {
  try {
    const voices = await Speech.getAvailableVoicesAsync();
    const spanish = voices.filter((v) => v.language?.toLowerCase().startsWith('es'));
    if (spanish.length === 0) {
      voiceId = null;
      return;
    }
    spanish.sort((a, b) => scoreVoice(b) - scoreVoice(a));
    voiceId = spanish[0].identifier;
  } catch {
    voiceId = null; // fall back to the default es-ES voice
  }
}

// Warm the cache at startup so the first tap doesn't wait.
resolving = resolveVoice();

function options(): Speech.SpeechOptions {
  return {
    language: 'es-ES',
    rate: 0.9,
    pitch: 1.0,
    ...(voiceId ? { voice: voiceId } : {}),
  };
}

/** Speak Spanish text aloud with the best available voice. */
export function speakSpanish(text: string) {
  const clean = text
    .replace(/\([^)]*\)/g, '')
    .split('/')[0]
    .trim();
  if (!clean) return;

  const say = () => {
    try {
      Speech.stop();
      Speech.speak(clean, options());
    } catch {
      // expo-speech native module not present — ignore.
    }
  };

  if (voiceId === undefined) {
    // First call before the voice resolved — wait for it, then speak.
    (resolving ?? (resolving = resolveVoice())).then(say).catch(say);
    return;
  }
  say();
}
