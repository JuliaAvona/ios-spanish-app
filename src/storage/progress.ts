import AsyncStorage from '@react-native-async-storage/async-storage';
import { DeckProgress, ProgressMap } from '../types';

const KEY = 'spanish-cards:progress:v1';

export const REVIEW_DAYS = 30;
const DAY_MS = 24 * 60 * 60 * 1000;

export async function getAllProgress(): Promise<ProgressMap> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as ProgressMap) : {};
  } catch {
    return {};
  }
}

async function writeAll(map: ProgressMap): Promise<void> {
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(map));
  } catch {
    // Best-effort persistence; an MVP can tolerate a dropped write.
  }
}

/** Merge a patch into one deck's progress and persist the whole map. */
export async function updateDeckProgress(
  deckId: string,
  patch: Partial<DeckProgress>,
): Promise<ProgressMap> {
  const map = await getAllProgress();
  const existing: DeckProgress = map[deckId] ?? { status: 'new' };
  map[deckId] = { ...existing, ...patch };
  await writeAll(map);
  return map;
}

export async function markLearned(deckId: string, lastTotal: number): Promise<ProgressMap> {
  return updateDeckProgress(deckId, {
    status: 'learned',
    lastTrainedAt: Date.now(),
    lastTotal,
    reviewAfter: undefined,
  });
}

export async function snoozeDeck(deckId: string, lastTotal: number): Promise<ProgressMap> {
  return updateDeckProgress(deckId, {
    status: 'snoozed',
    lastTrainedAt: Date.now(),
    lastTotal,
    reviewAfter: Date.now() + REVIEW_DAYS * DAY_MS,
  });
}

export async function resetDeck(deckId: string): Promise<ProgressMap> {
  const map = await getAllProgress();
  delete map[deckId];
  await writeAll(map);
  return map;
}

/** Wipe progress for every deck. */
export async function clearAllProgress(): Promise<void> {
  try {
    await AsyncStorage.removeItem(KEY);
  } catch {
    // best effort
  }
}

/** A snoozed deck whose review date has passed is "due" again. */
export function isDue(p: DeckProgress | undefined, now: number = Date.now()): boolean {
  return !!p && p.status === 'snoozed' && p.reviewAfter !== undefined && p.reviewAfter <= now;
}

export function daysUntilReview(p: DeckProgress | undefined, now: number = Date.now()): number {
  if (!p || p.reviewAfter === undefined) return 0;
  return Math.max(0, Math.ceil((p.reviewAfter - now) / DAY_MS));
}
