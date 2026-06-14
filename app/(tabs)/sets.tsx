import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useFocusEffect, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import DeckListItem from '../../src/components/DeckListItem';
import StatusPicker from '../../src/components/StatusPicker';
import { Glyph } from '../../src/components/Glyph';
import { DECKS, DECK_SECTIONS } from '../../src/data/decks';
import {
  getAllProgress,
  markLearned,
  resetDeck,
  snoozeDeck,
  updateDeckProgress,
  REVIEW_DAYS,
} from '../../src/storage/progress';
import { cancelReviewReminder, scheduleReviewReminder } from '../../src/utils/notifications';
import { useSettings } from '../../src/context/SettingsContext';
import { COLORS, FONT, RADIUS, SPACING } from '../../src/theme';
import { Deck, DeckStatus, ProgressMap } from '../../src/types';

const DAY_MS = 24 * 60 * 60 * 1000;

export default function Sets() {
  const router = useRouter();
  const { settings } = useSettings();
  const [progress, setProgress] = useState<ProgressMap>({});
  const [editingDeck, setEditingDeck] = useState<Deck | null>(null);
  const [query, setQuery] = useState('');

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
    if (settings.haptics) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    setEditingDeck(deck);
  };

  const applyStatus = async (status: DeckStatus) => {
    const deck = editingDeck;
    if (!deck) return;
    if (settings.haptics) Haptics.selectionAsync().catch(() => {});
    const total = deck.cards.length;
    if (status === 'new') {
      await resetDeck(deck.id);
      cancelReviewReminder(deck.id);
    } else if (status === 'learning') {
      await updateDeckProgress(deck.id, { status: 'learning', lastTrainedAt: Date.now(), reviewAfter: undefined });
      cancelReviewReminder(deck.id);
    } else if (status === 'learned') {
      await markLearned(deck.id, total);
      cancelReviewReminder(deck.id);
    } else if (status === 'snoozed') {
      await snoozeDeck(deck.id, total);
      scheduleReviewReminder(deck.id, deck.title, new Date(Date.now() + REVIEW_DAYS * DAY_MS));
    }
    setEditingDeck(null);
    setProgress(await getAllProgress());
  };

  const q = query.trim().toLowerCase();
  const filtered = q
    ? DECKS.filter(
        (d) =>
          d.title.toLowerCase().includes(q) ||
          d.titleEs.toLowerCase().includes(q) ||
          d.cards.some((c) => c.en.toLowerCase().includes(q) || c.es.toLowerCase().includes(q)),
      )
    : null;

  const renderGrid = (title: string, decks: Deck[]) => (
    <View key={title} style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.list}>
        {decks.map((deck) => (
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
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>All sets</Text>
        <Text style={styles.subtitle}>{DECKS.length} sets · tap to train, long-press to set status</Text>

        <View style={styles.search}>
          <Glyph name="search" size={15} color={COLORS.inkFaint} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search sets or words…"
            placeholderTextColor={COLORS.inkFaint}
            style={styles.searchInput}
            autoCorrect={false}
            returnKeyType="search"
          />
          {query.length > 0 ? (
            <Glyph name="close" size={15} color={COLORS.inkFaint} onPress={() => setQuery('')} />
          ) : null}
        </View>

        {filtered ? (
          filtered.length > 0 ? (
            renderGrid(`Results · ${filtered.length}`, filtered)
          ) : (
            <Text style={styles.empty}>No sets match “{query}”.</Text>
          )
        ) : (
          DECK_SECTIONS.map((s) => renderGrid(s.title, s.data))
        )}
      </ScrollView>

      <StatusPicker
        deck={editingDeck}
        currentStatus={editingDeck ? progress[editingDeck.id]?.status : undefined}
        onClose={() => setEditingDeck(null)}
        onSelect={applyStatus}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  content: { paddingHorizontal: SPACING.xl, paddingTop: SPACING.lg, paddingBottom: SPACING.xxl },
  title: { fontSize: 30, fontFamily: FONT.extrabold, color: COLORS.ink },
  subtitle: { fontSize: 14, fontFamily: FONT.regular, color: COLORS.inkSoft, marginTop: SPACING.xs, marginBottom: SPACING.lg },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.md,
    height: 46,
    marginBottom: SPACING.lg,
  },
  searchInput: { flex: 1, fontSize: 15, fontFamily: FONT.medium, color: COLORS.ink, padding: 0 },
  section: { marginBottom: SPACING.sm },
  sectionTitle: { fontSize: 18, fontFamily: FONT.extrabold, color: COLORS.ink, marginBottom: SPACING.md },
  list: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  empty: { fontSize: 15, fontFamily: FONT.regular, color: COLORS.inkSoft, textAlign: 'center', marginTop: SPACING.xl },
});
