import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import DeckListItem from '../src/components/DeckListItem';
import StatusPicker from '../src/components/StatusPicker';
import { DECKS } from '../src/data/decks';
import {
  getAllProgress,
  markLearned,
  resetDeck,
  snoozeDeck,
  updateDeckProgress,
} from '../src/storage/progress';
import { COLORS, FONT, GRADIENTS, RADIUS, SPACING } from '../src/theme';
import { Deck, DeckStatus, ProgressMap } from '../src/types';

export default function Home() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [progress, setProgress] = useState<ProgressMap>({});
  const [editingDeck, setEditingDeck] = useState<Deck | null>(null);

  // Reload whenever the screen regains focus so status badges reflect the
  // result of the training session the user just finished.
  useFocusEffect(
    useCallback(() => {
      let active = true;
      getAllProgress().then((p) => active && setProgress(p));
      return () => {
        active = false;
      };
    }, []),
  );

  const openStatusPicker = (deck: Deck) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    setEditingDeck(deck);
  };

  const applyStatus = async (status: DeckStatus) => {
    const deck = editingDeck;
    if (!deck) return;
    Haptics.selectionAsync().catch(() => {});
    const total = deck.cards.length;
    if (status === 'new') {
      await resetDeck(deck.id);
    } else if (status === 'learning') {
      await updateDeckProgress(deck.id, {
        status: 'learning',
        lastTrainedAt: Date.now(),
        reviewAfter: undefined,
      });
    } else if (status === 'learned') {
      await markLearned(deck.id, total);
    } else if (status === 'snoozed') {
      await snoozeDeck(deck.id, total);
    }
    setEditingDeck(null);
    setProgress(await getAllProgress());
  };

  const learnedCount = DECKS.filter((d) => progress[d.id]?.status === 'learned').length;

  return (
    <View style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={GRADIENTS.hero}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.hero, { paddingTop: insets.top + SPACING.lg }]}
        >
          <Text style={styles.heroPill}>EN → ES</Text>
          <Text style={styles.heroTitle}>Spanish Cards ✨</Text>
          <Text style={styles.heroSub}>
            {learnedCount > 0
              ? `${learnedCount} of ${DECKS.length} sets learned · pick a topic to train`
              : 'Pick a topic and loop the cards until they stick'}
          </Text>
        </LinearGradient>

        <View style={[styles.body, { paddingBottom: insets.bottom + SPACING.xxl }]}>
          <Text style={styles.hint}>Tip — long-press a set to change its status</Text>
          <View style={styles.list}>
            {DECKS.map((deck) => (
              <DeckListItem
                key={deck.id}
                deck={deck}
                progress={progress[deck.id]}
                onPress={() => router.push(`/deck/${deck.id}`)}
                onLongPress={() => openStatusPicker(deck)}
              />
            ))}
          </View>
        </View>
      </ScrollView>

      <StatusPicker
        deck={editingDeck}
        currentStatus={editingDeck ? progress[editingDeck.id]?.status : undefined}
        onClose={() => setEditingDeck(null)}
        onSelect={applyStatus}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  hero: {
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.xxl + SPACING.lg,
  },
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
  heroTitle: {
    fontSize: 34,
    fontFamily: FONT.extrabold,
    color: '#fff',
  },
  heroSub: {
    fontSize: 15,
    fontFamily: FONT.regular,
    color: 'rgba(255,255,255,0.92)',
    marginTop: SPACING.xs,
  },
  body: {
    marginTop: -SPACING.xl,
    backgroundColor: COLORS.bg,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.xl,
  },
  hint: {
    fontSize: 12.5,
    fontFamily: FONT.regular,
    color: COLORS.inkFaint,
    marginBottom: SPACING.md,
  },
  list: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});
