import { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Glyph } from '../../src/components/Glyph';
import { DECK_SECTIONS, DeckSection } from '../../src/data/decks';
import { daysUntilReview, getAllProgress, isDue } from '../../src/storage/progress';
import { cardsToday, getStats, liveStreak, Stats } from '../../src/storage/stats';
import { COLORS, FONT, GRADIENTS, RADIUS, SPACING, glow } from '../../src/theme';
import { Deck, DeckStatus, ProgressMap } from '../../src/types';

const EMPTY_STATS: Stats = { streak: 0, bestStreak: 0, lastDay: '', todayCount: 0, total: 0 };
const CHAPTER_ORDER = ['Vocabulary', 'Course', 'Phrases', 'Verbs'];

export default function Roadmap() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [progress, setProgress] = useState<ProgressMap>({});
  const [stats, setStats] = useState<Stats>(EMPTY_STATS);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      getAllProgress().then((p) => active && setProgress(p));
      getStats().then((s) => active && setStats(s));
      return () => {
        active = false;
      };
    }, []),
  );

  const chapters = CHAPTER_ORDER.map((t) => DECK_SECTIONS.find((s) => s.title === t)).filter(
    (s): s is DeckSection => !!s,
  );
  const ordered = chapters.flatMap((c) => c.data);
  const currentId = ordered.find((d) => progress[d.id]?.status !== 'learned')?.id;
  const learnedCount = ordered.filter((d) => progress[d.id]?.status === 'learned').length;

  return (
    <View style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={GRADIENTS.hero}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.hero, { paddingTop: insets.top + SPACING.lg }]}
        >
          <Text style={styles.heroPill}>YOUR PATH</Text>
          <Text style={styles.heroTitle}>Step by step ✨</Text>
          <Text style={styles.heroSub}>
            {learnedCount} of {ordered.length} sets learned
          </Text>
          <View style={styles.statRow}>
            <View style={styles.statPill}>
              <Glyph name="flame" size={14} />
              <Text style={styles.statText}>{liveStreak(stats)} day streak</Text>
            </View>
            <View style={styles.statPill}>
              <Glyph name="checkmark" size={13} color="#fff" />
              <Text style={styles.statText}>{cardsToday(stats)} today</Text>
            </View>
          </View>
        </LinearGradient>

        <View style={[styles.body, { paddingBottom: insets.bottom + SPACING.xxl }]}>
          {chapters.map((chapter) => {
            const done = chapter.data.filter((d) => progress[d.id]?.status === 'learned').length;
            return (
              <View key={chapter.title} style={styles.chapter}>
                <View style={styles.chapterHead}>
                  <Text style={styles.chapterTitle}>{chapter.title}</Text>
                  <Text style={styles.chapterCount}>
                    {done}/{chapter.data.length}
                  </Text>
                </View>
                <View style={styles.timeline}>
                  <View style={styles.spine} />
                  {chapter.data.map((deck) => (
                    <PathNode
                      key={deck.id}
                      deck={deck}
                      status={progress[deck.id]?.status ?? 'new'}
                      reviewDays={daysUntilReview(progress[deck.id])}
                      due={isDue(progress[deck.id])}
                      isCurrent={deck.id === currentId}
                      onPress={() => router.push(`/deck/${deck.id}`)}
                    />
                  ))}
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

function PathNode({
  deck,
  status,
  reviewDays,
  due,
  isCurrent,
  onPress,
}: {
  deck: Deck;
  status: DeckStatus;
  reviewDays: number;
  due: boolean;
  isCurrent: boolean;
  onPress: () => void;
}) {
  const learned = status === 'learned';
  let statusLabel = 'Not started';
  let statusColor: string = COLORS.inkFaint;
  if (learned) {
    statusLabel = 'Learned';
    statusColor = COLORS.success;
  } else if (status === 'snoozed') {
    statusLabel = due ? 'Review due' : `Review in ${reviewDays}d`;
    statusColor = due ? COLORS.primaryDark : COLORS.warn;
  } else if (status === 'learning') {
    statusLabel = 'In progress';
    statusColor = COLORS.warn;
  } else if (isCurrent) {
    statusLabel = 'Tap to start →';
    statusColor = COLORS.primary;
  }

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && { opacity: 0.85 }]}
      accessibilityRole="button"
      accessibilityLabel={`${deck.title}, ${statusLabel}`}
    >
      <View
        style={[
          styles.node,
          { borderColor: learned || isCurrent ? deck.accent : deck.accent + '66' },
          learned && { backgroundColor: deck.accent + '1A' },
          isCurrent && [styles.nodeCurrent, glow(deck.accent)],
        ]}
      >
        <Text style={styles.nodeEmoji}>{deck.emoji}</Text>
        {learned ? (
          <View style={[styles.badge, { backgroundColor: COLORS.success }]}>
            <Glyph name="checkmark" size={12} color="#fff" />
          </View>
        ) : status === 'snoozed' ? (
          <View style={[styles.badge, { backgroundColor: COLORS.warn }]}>
            <Glyph name="time" size={11} color="#fff" />
          </View>
        ) : null}
      </View>

      <View style={styles.info}>
        <Text style={styles.nodeTitle} numberOfLines={1}>
          {deck.title}
        </Text>
        <Text style={styles.nodeSub} numberOfLines={1}>
          {deck.titleEs} · {deck.cards.length} cards
        </Text>
        <Text style={[styles.nodeStatus, { color: statusColor }]}>{statusLabel}</Text>
      </View>
    </Pressable>
  );
}

const NODE = 64;
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  hero: { paddingHorizontal: SPACING.xl, paddingBottom: SPACING.xxl + SPACING.lg },
  heroPill: {
    alignSelf: 'flex-start',
    fontSize: 12,
    fontFamily: FONT.extrabold,
    letterSpacing: 1.5,
    color: '#fff',
    backgroundColor: 'rgba(255,255,255,0.22)',
    paddingHorizontal: SPACING.md,
    paddingVertical: 5,
    borderRadius: RADIUS.pill,
    overflow: 'hidden',
    marginBottom: SPACING.md,
  },
  heroTitle: { fontSize: 32, fontFamily: FONT.extrabold, color: '#fff' },
  heroSub: { fontSize: 15, fontFamily: FONT.regular, color: 'rgba(255,255,255,0.92)', marginTop: SPACING.xs },
  statRow: { flexDirection: 'row', gap: SPACING.sm, marginTop: SPACING.md },
  statPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    borderRadius: RADIUS.pill,
  },
  statText: { fontSize: 13, fontFamily: FONT.bold, color: '#fff' },
  body: {
    marginTop: -SPACING.xl,
    backgroundColor: COLORS.bg,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.xl,
  },
  chapter: { marginBottom: SPACING.lg },
  chapterHead: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  chapterTitle: { fontSize: 18, fontFamily: FONT.extrabold, color: COLORS.ink },
  chapterCount: { fontSize: 14, fontFamily: FONT.bold, color: COLORS.inkSoft },
  timeline: { position: 'relative' },
  spine: {
    position: 'absolute',
    left: NODE / 2 - 1.5,
    top: NODE / 2,
    bottom: NODE / 2,
    width: 3,
    backgroundColor: COLORS.border,
    borderRadius: 2,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: SPACING.lg, paddingVertical: SPACING.sm },
  node: {
    width: NODE,
    height: NODE,
    borderRadius: NODE / 2,
    backgroundColor: COLORS.card,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nodeCurrent: { borderWidth: 3.5, transform: [{ scale: 1.06 }] },
  nodeEmoji: { fontSize: 30 },
  badge: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.bg,
  },
  info: { flex: 1, gap: 1 },
  nodeTitle: { fontSize: 16, fontFamily: FONT.bold, color: COLORS.ink },
  nodeSub: { fontSize: 12.5, fontFamily: FONT.regular, color: COLORS.inkSoft },
  nodeStatus: { fontSize: 13, fontFamily: FONT.bold, marginTop: 2 },
});
