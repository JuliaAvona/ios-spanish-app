import { useCallback, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import DeckListItem from '../src/components/DeckListItem';
import StatusPicker from '../src/components/StatusPicker';
import { Glyph } from '../src/components/Glyph';
import { DECKS, DECK_SECTIONS } from '../src/data/decks';
import {
  getAllProgress,
  markLearned,
  resetDeck,
  snoozeDeck,
  updateDeckProgress,
  REVIEW_DAYS,
} from '../src/storage/progress';
import { cardsToday, getStats, liveStreak, Stats } from '../src/storage/stats';
import { cancelReviewReminder, scheduleReviewReminder } from '../src/utils/notifications';
import { useSettings } from '../src/context/SettingsContext';
import { COLORS, FONT, GRADIENTS, RADIUS, SPACING } from '../src/theme';
import { Deck, DeckStatus, ProgressMap } from '../src/types';

const DAY_MS = 24 * 60 * 60 * 1000;
const EMPTY_STATS: Stats = { streak: 0, lastDay: '', todayCount: 0, total: 0 };

export default function Home() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { settings, ready } = useSettings();
  const [progress, setProgress] = useState<ProgressMap>({});
  const [stats, setStats] = useState<Stats>(EMPTY_STATS);
  const [editingDeck, setEditingDeck] = useState<Deck | null>(null);
  const [query, setQuery] = useState('');

  // First-run gate.
  useEffect(() => {
    if (ready && !settings.onboarded) router.replace('/onboarding');
  }, [ready, settings.onboarded, router]);

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
    <View style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <LinearGradient
          colors={GRADIENTS.hero}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.hero, { paddingTop: insets.top + SPACING.lg }]}
        >
          <View style={styles.heroTop}>
            <Text style={styles.heroPill}>EN → ES</Text>
            <Glyph
              name="settings"
              size={22}
              color="#fff"
              accessibilityLabel="Settings"
              onPress={() => router.push('/settings')}
            />
          </View>
          <Text style={styles.heroTitle}>Spanish Cards ✨</Text>

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
            <>
              <Text style={styles.hint}>Tip — long-press a set to change its status</Text>
              {DECK_SECTIONS.map((s) => renderGrid(s.title, s.data))}
            </>
          )}
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
  safe: { flex: 1, backgroundColor: COLORS.bg },
  hero: {
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.xxl + SPACING.lg,
  },
  heroTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  heroPill: {
    fontSize: 12,
    fontFamily: FONT.extrabold,
    letterSpacing: 1.5,
    color: '#fff',
    backgroundColor: 'rgba(255,255,255,0.22)',
    paddingHorizontal: SPACING.md,
    paddingVertical: 5,
    borderRadius: RADIUS.pill,
    overflow: 'hidden',
  },
  heroTitle: {
    fontSize: 34,
    fontFamily: FONT.extrabold,
    color: '#fff',
  },
  statRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginTop: SPACING.md,
  },
  statPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    borderRadius: RADIUS.pill,
  },
  statText: {
    fontSize: 13,
    fontFamily: FONT.bold,
    color: '#fff',
  },
  body: {
    marginTop: -SPACING.xl,
    backgroundColor: COLORS.bg,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.lg,
  },
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
  searchInput: {
    flex: 1,
    fontSize: 15,
    fontFamily: FONT.medium,
    color: COLORS.ink,
    padding: 0,
  },
  hint: {
    fontSize: 12.5,
    fontFamily: FONT.regular,
    color: COLORS.inkFaint,
    marginBottom: SPACING.md,
  },
  section: {
    marginBottom: SPACING.sm,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: FONT.extrabold,
    color: COLORS.ink,
    marginBottom: SPACING.md,
  },
  list: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  empty: {
    fontSize: 15,
    fontFamily: FONT.regular,
    color: COLORS.inkSoft,
    textAlign: 'center',
    marginTop: SPACING.xl,
  },
});
