import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Glyph, GlyphName } from './Glyph';
import { COLORS, RADIUS, SPACING } from '../theme';
import { Deck, DeckProgress } from '../types';
import { daysUntilReview, isDue } from '../storage/progress';

type Props = {
  deck: Deck;
  progress?: DeckProgress;
  onPress: () => void;
};

type Badge = { label: string; fg: string; bg: string; icon?: GlyphName };

function badgeFor(progress?: DeckProgress): Badge {
  if (!progress || progress.status === 'new') {
    return { label: 'New', fg: COLORS.inkSoft, bg: COLORS.border };
  }
  if (progress.status === 'learned') {
    return { label: 'Learned', fg: COLORS.success, bg: COLORS.successSoft, icon: 'checkmark-circle' };
  }
  if (progress.status === 'snoozed') {
    if (isDue(progress)) {
      return { label: 'Review due', fg: COLORS.primaryDark, bg: '#FBE7E0', icon: 'refresh-circle' };
    }
    const days = daysUntilReview(progress);
    return { label: `Review in ${days}d`, fg: COLORS.warn, bg: COLORS.warnSoft, icon: 'time' };
  }
  return { label: 'In progress', fg: COLORS.warn, bg: COLORS.warnSoft, icon: 'ellipse' };
}

export default function DeckListItem({ deck, progress, onPress }: Props) {
  const badge = badgeFor(progress);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
    >
      <View style={[styles.emojiWrap, { backgroundColor: deck.accent + '1A' }]}>
        <Text style={styles.emoji}>{deck.emoji}</Text>
      </View>

      <View style={styles.middle}>
        <Text style={styles.title}>{deck.title}</Text>
        <Text style={styles.subtitle}>
          {deck.titleEs} · {deck.cards.length} cards
        </Text>
        <View style={[styles.badge, { backgroundColor: badge.bg }]}>
          {badge.icon ? <Glyph name={badge.icon} size={13} color={badge.fg} /> : null}
          <Text style={[styles.badgeText, { color: badge.fg }]}>{badge.label}</Text>
        </View>
      </View>

      <Glyph name="chevron-forward" size={22} color={COLORS.inkFaint} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.lg,
    gap: SPACING.lg,
  },
  rowPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.99 }],
  },
  emojiWrap: {
    width: 56,
    height: 56,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 28,
  },
  middle: {
    flex: 1,
    gap: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.ink,
  },
  subtitle: {
    fontSize: 13.5,
    color: COLORS.inkSoft,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 4,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
    borderRadius: 999,
    marginTop: SPACING.xs,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
});
