import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Glyph, GlyphName } from './Glyph';
import { COLORS, FONT, RADIUS, SHADOW, SPACING } from '../theme';
import { Deck, DeckProgress } from '../types';
import { daysUntilReview, isDue } from '../storage/progress';

type Props = {
  deck: Deck;
  progress?: DeckProgress;
  onPress: () => void;
  onLongPress: () => void;
};

type Badge = { label: string; fg: string; bg: string; icon?: GlyphName };

function badgeFor(progress?: DeckProgress): Badge {
  if (!progress || progress.status === 'new') {
    return { label: 'New', fg: COLORS.primary, bg: COLORS.primarySoft };
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
export default function DeckListItem({ deck, progress, onPress, onLongPress }: Props) {
  const badge = badgeFor(progress);

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      delayLongPress={250}
      accessibilityRole="button"
      accessibilityLabel={`${deck.title}, ${deck.cards.length} cards, ${badge.label}. Long-press to change status.`}
      style={({ pressed }) => [
        styles.tile,
        { shadowColor: deck.accent },
        pressed && styles.tilePressed,
      ]}
    >
      <View style={styles.emojiWrap}>
        <LinearGradient
          colors={[deck.accent + '33', deck.accent + '12'] as const}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFillObject}
        />
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
    minHeight: 190,
    marginBottom: SPACING.lg,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    // Soft accent-tinted halo (shadowColor is set per-tile from the deck accent).
    ...SHADOW.md,
    shadowOpacity: 0.22,
  },
  tilePressed: {
    opacity: 0.95,
    transform: [{ scale: 0.97 }],
  },
  emojiWrap: {
    width: 56,
    height: 56,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
    overflow: 'hidden',
  },
  emoji: {
    fontSize: 28,
  },
  title: {
    fontSize: 17,
    fontFamily: FONT.bold,
    color: COLORS.ink,
    lineHeight: 21,
  },
  subtitle: {
    fontSize: 13,
    fontFamily: FONT.medium,
    color: COLORS.inkSoft,
    marginTop: 3,
  },
  meta: {
    fontSize: 12,
    fontFamily: FONT.regular,
    color: COLORS.inkFaint,
    marginTop: 2,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 4,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: RADIUS.pill,
    marginTop: 'auto',
  },
  badgeText: {
    fontSize: 11.5,
    fontFamily: FONT.bold,
  },
});
