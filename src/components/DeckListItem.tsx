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

/** A square-ish deck tile sized for a two-column grid. */
export default function DeckListItem({ deck, progress, onPress }: Props) {
  const badge = badgeFor(progress);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.tile, pressed && styles.tilePressed]}
    >
      <View style={[styles.emojiWrap, { backgroundColor: deck.accent + '1A' }]}>
        <Text style={styles.emoji}>{deck.emoji}</Text>
      </View>

      <Text style={styles.title} numberOfLines={2}>
        {deck.title}
      </Text>
      <Text style={styles.subtitle} numberOfLines={1}>
        {deck.titleEs}
      </Text>
      <Text style={styles.meta}>{deck.cards.length} cards</Text>

      <View style={[styles.badge, { backgroundColor: badge.bg }]}>
        {badge.icon ? <Glyph name={badge.icon} size={12} color={badge.fg} /> : null}
        <Text style={[styles.badgeText, { color: badge.fg }]} numberOfLines={1}>
          {badge.label}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tile: {
    width: '48%',
    minHeight: 184,
    marginBottom: SPACING.md,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.lg,
  },
  tilePressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },
  emojiWrap: {
    width: 52,
    height: 52,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  emoji: {
    fontSize: 26,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.ink,
    lineHeight: 21,
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.inkSoft,
    marginTop: 3,
  },
  meta: {
    fontSize: 12,
    color: COLORS.inkFaint,
    marginTop: 2,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 4,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
    borderRadius: 999,
    marginTop: 'auto',
  },
  badgeText: {
    fontSize: 11.5,
    fontWeight: '700',
  },
});
