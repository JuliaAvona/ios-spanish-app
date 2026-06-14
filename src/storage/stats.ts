import AsyncStorage from '@react-native-async-storage/async-storage';

export type Stats = {
  /** Consecutive days with at least one review. */
  streak: number;
  /** Local day string of the last review (YYYY-M-D). */
  lastDay: string;
  /** Cards reviewed on `lastDay`. */
  todayCount: number;
  /** All-time cards reviewed. */
  total: number;
};

const KEY = 'spanish-cards:stats:v1';
const EMPTY: Stats = { streak: 0, lastDay: '', todayCount: 0, total: 0 };

function dayStr(d: Date): string {
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}
function today(): string {
  return dayStr(new Date());
}
function yesterday(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return dayStr(d);
}

export async function getStats(): Promise<Stats> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    return raw ? { ...EMPTY, ...JSON.parse(raw) } : EMPTY;
  } catch {
    return EMPTY;
  }
}

/** Record `n` reviewed cards, updating today's count and the day streak. */
export async function recordReviewed(n = 1): Promise<Stats> {
  const s = await getStats();
  const t = today();
  let { streak, lastDay, todayCount, total } = s;
  if (lastDay === t) {
    todayCount += n;
  } else {
    streak = lastDay === yesterday() ? streak + 1 : 1;
    todayCount = n;
    lastDay = t;
  }
  total += n;
  const next: Stats = { streak, lastDay, todayCount, total };
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // best effort
  }
  return next;
}

/** Streak counts only if the last active day is today or yesterday. */
export function liveStreak(s: Stats): number {
  return s.lastDay === today() || s.lastDay === yesterday() ? s.streak : 0;
}

/** Cards reviewed today (0 if the last active day isn't today). */
export function cardsToday(s: Stats): number {
  return s.lastDay === today() ? s.todayCount : 0;
}
