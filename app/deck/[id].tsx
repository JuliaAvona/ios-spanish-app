import { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import FlashCard, { Face } from '../../src/components/FlashCard';
import { Glyph, GlyphName } from '../../src/components/Glyph';
import { getDeck } from '../../src/data/decks';
import { PRONOUNS } from '../../src/data/verbs';
import {
  REVIEW_DAYS,
  getAllProgress,
  markLearned,
  snoozeDeck,
  updateDeckProgress,
} from '../../src/storage/progress';
import { COLORS, RADIUS, SPACING } from '../../src/theme';
import { Card, DeckKind } from '../../src/types';

type Direction = 'en-es' | 'es-en';

function shuffledIndices(n: number): number[] {
  const a = Array.from({ length: n }, (_, i) => i);
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const DUMMY_FACE: Face = { kind: 'word', tag: '', text: '' };

function faces(card: Card, dir: Direction, kind: DeckKind): { front: Face; back: Face } {
  if (kind === 'verbs') {
    return {
      front: {
        kind: 'verb',
        tag: 'Infinitive',
        infinitive: card.es,
        meaning: card.meaning ?? '',
        pattern: card.pattern ?? '',
      },
      back: {
        kind: 'forms',
        tag: 'Presente',
        infinitive: card.es,
        forms: PRONOUNS.map((pron, i) => ({ pron, form: card.forms?.[i] ?? '' })),
      },
    };
  }
  const word = (text: string, tag: string, answer: boolean): Face => ({
    kind: 'word',
    text,
    tag,
    color: card.color,
    answer,
  });
  const enFirst = dir === 'en-es';
  return {
    front: enFirst ? word(card.en, 'English', false) : word(card.es, 'Español', false),
    back: enFirst ? word(card.es, 'Español', true) : word(card.en, 'English', true),
  };
}

export default function DeckTraining() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const deck = getDeck(id);
  const total = deck?.cards.length ?? 0;

  const [queue, setQueue] = useState<number[]>(() => shuffledIndices(total));
  const [flipped, setFlipped] = useState(false);
  const [direction, setDirection] = useState<Direction>('en-es');

  // Only downgrade a fresh deck to "learning"; leave learned/snoozed intact
  // until the user finishes and chooses an outcome.
  const baselineNew = useRef(true);
  const markedLearning = useRef(false);
  useEffect(() => {
    if (!deck) return;
    getAllProgress().then((p) => {
      const status = p[deck.id]?.status;
      baselineNew.current = !status || status === 'new';
    });
  }, [deck]);

  const ensureLearning = useCallback(() => {
    if (!deck || markedLearning.current || !baselineNew.current) return;
    markedLearning.current = true;
    updateDeckProgress(deck.id, { status: 'learning', lastTrainedAt: Date.now() });
  }, [deck]);

  if (!deck) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={styles.notFound}>Set not found.</Text>
        <Pressable onPress={() => router.back()} style={styles.linkBtn}>
          <Text style={styles.linkText}>Back to topics</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const remaining = queue.length;
  const mastered = total - remaining;
  const done = remaining === 0;
  const current = deck.cards[queue[0]];
  const { front, back } = done
    ? { front: DUMMY_FACE, back: DUMMY_FACE }
    : faces(current, direction, deck.kind);

  const onFlip = () => {
    Haptics.selectionAsync().catch(() => {});
    setFlipped((f) => !f);
  };

  const onKnow = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    ensureLearning();
    setFlipped(false);
    setQueue((q) => q.slice(1));
  };

  const onDontKnow = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    ensureLearning();
    setFlipped(false);
    // Send the card to the back of the loop so it comes around again.
    setQueue((q) => (q.length <= 1 ? q : [...q.slice(1), q[0]]));
  };

  const trainAgain = () => {
    markedLearning.current = false;
    setFlipped(false);
    setQueue(shuffledIndices(total));
  };

  const finishLearned = async () => {
    await markLearned(deck.id, total);
    router.back();
  };

  const finishSnooze = async () => {
    await snoozeDeck(deck.id, total);
    router.back();
  };

  const toggleDirection = () => {
    setFlipped(false);
    setDirection((d) => (d === 'en-es' ? 'es-en' : 'en-es'));
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12} style={styles.headerBtn}>
          <Glyph name="chevron-back" size={30} color={COLORS.ink} />
        </Pressable>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>
            {deck.emoji} {deck.title}
          </Text>
        </View>
        {deck.kind === 'verbs' ? (
          <View style={styles.headerBtn} />
        ) : (
          <Pressable onPress={toggleDirection} hitSlop={12} style={styles.dirBtn}>
            <Text style={styles.dirText}>{direction === 'en-es' ? 'EN→ES' : 'ES→EN'}</Text>
          </Pressable>
        )}
      </View>

      {/* Progress */}
      <View style={styles.progressBlock}>
        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              { width: `${total ? (mastered / total) * 100 : 0}%`, backgroundColor: deck.accent },
            ]}
          />
        </View>
        <Text style={styles.progressLabel}>
          {done ? `${total} / ${total} mastered` : `${mastered} / ${total} mastered · ${remaining} left`}
        </Text>
      </View>

      {done ? (
        <CompletionView
          accent={deck.accent}
          total={total}
          onLearned={finishLearned}
          onSnooze={finishSnooze}
          onAgain={trainAgain}
          onBack={() => router.back()}
        />
      ) : (
        <View style={styles.cardArea}>
          <FlashCard front={front} back={back} flipped={flipped} onPress={onFlip} />

          <View style={styles.actions}>
            <RateButton
              label="Keep looping"
              icon="refresh"
              tone="neutral"
              disabled={!flipped}
              onPress={onDontKnow}
            />
            <RateButton
              label="Got it"
              icon="checkmark"
              tone="success"
              disabled={!flipped}
              onPress={onKnow}
            />
          </View>
          <Text style={styles.actionHint}>
            {flipped ? 'Rate yourself — looping cards come back around' : 'Tap the card to reveal the answer'}
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

function RateButton({
  label,
  icon,
  tone,
  disabled,
  onPress,
}: {
  label: string;
  icon: GlyphName;
  tone: 'success' | 'neutral';
  disabled: boolean;
  onPress: () => void;
}) {
  const isSuccess = tone === 'success';
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.rateBtn,
        isSuccess ? styles.rateSuccess : styles.rateNeutral,
        pressed && !disabled && styles.ratePressed,
        disabled && styles.rateDisabled,
      ]}
    >
      <Glyph name={icon} size={20} color={isSuccess ? '#fff' : COLORS.ink} />
      <Text style={[styles.rateText, isSuccess && styles.rateTextSuccess]}>{label}</Text>
    </Pressable>
  );
}

function CompletionView({
  accent,
  total,
  onLearned,
  onSnooze,
  onAgain,
  onBack,
}: {
  accent: string;
  total: number;
  onLearned: () => void;
  onSnooze: () => void;
  onAgain: () => void;
  onBack: () => void;
}) {
  return (
    <View style={styles.completion}>
      <View style={[styles.completionBadge, { backgroundColor: accent + '1A' }]}>
        <Glyph name="trophy" size={40} color={accent} />
      </View>
      <Text style={styles.completionTitle}>¡Bien hecho!</Text>
      <Text style={styles.completionSub}>You looped all {total} cards. What next?</Text>

      <View style={styles.completionActions}>
        <Pressable onPress={onLearned} style={[styles.primaryBtn, { backgroundColor: COLORS.success }]}>
          <Glyph name="checkmark-circle" size={20} color="#fff" />
          <Text style={styles.primaryBtnText}>Mark as learned</Text>
        </Pressable>

        <Pressable onPress={onSnooze} style={styles.outlineBtn}>
          <Glyph name="time-outline" size={20} color={COLORS.warn} />
          <Text style={[styles.outlineBtnText, { color: COLORS.warn }]}>
            Repeat in {REVIEW_DAYS} days
          </Text>
        </Pressable>

        <Pressable onPress={onAgain} style={styles.ghostBtn}>
          <Glyph name="refresh" size={18} color={COLORS.inkSoft} />
          <Text style={styles.ghostBtnText}>Train again</Text>
        </Pressable>

        <Pressable onPress={onBack} hitSlop={8} style={styles.linkBtn}>
          <Text style={styles.linkText}>Back to topics</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  notFound: {
    fontSize: 16,
    color: COLORS.ink,
    textAlign: 'center',
    marginTop: SPACING.xxl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  headerBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.ink,
  },
  dirBtn: {
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: COLORS.border,
  },
  dirText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: COLORS.inkSoft,
    letterSpacing: 0.5,
  },
  progressBlock: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.md,
    gap: 6,
  },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.border,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressLabel: {
    fontSize: 13,
    color: COLORS.inkSoft,
    fontWeight: '600',
  },
  cardArea: {
    flex: 1,
    paddingHorizontal: SPACING.xl,
    justifyContent: 'center',
    gap: SPACING.xl,
    paddingBottom: SPACING.xl,
  },
  actions: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  rateBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    height: 58,
    borderRadius: RADIUS.md,
  },
  rateSuccess: {
    backgroundColor: COLORS.success,
  },
  rateNeutral: {
    backgroundColor: COLORS.card,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  ratePressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  rateDisabled: {
    opacity: 0.4,
  },
  rateText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.ink,
  },
  rateTextSuccess: {
    color: '#fff',
  },
  actionHint: {
    textAlign: 'center',
    fontSize: 13,
    color: COLORS.inkFaint,
    marginTop: -SPACING.sm,
  },
  completion: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.xl,
    gap: SPACING.sm,
  },
  completionBadge: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  completionTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.ink,
  },
  completionSub: {
    fontSize: 15,
    color: COLORS.inkSoft,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  completionActions: {
    width: '100%',
    gap: SPACING.md,
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    height: 56,
    borderRadius: RADIUS.md,
  },
  primaryBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  outlineBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    height: 56,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.warn,
    backgroundColor: COLORS.warnSoft,
  },
  outlineBtnText: {
    fontSize: 16,
    fontWeight: '700',
  },
  ghostBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    height: 50,
  },
  ghostBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.inkSoft,
  },
  linkBtn: {
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  linkText: {
    fontSize: 15,
    color: COLORS.primary,
    fontWeight: '600',
  },
});
