import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import DeckListItem from '../src/components/DeckListItem';
import { DECKS } from '../src/data/decks';
import { getAllProgress } from '../src/storage/progress';
import { COLORS, FONT, GRADIENTS, RADIUS, SPACING } from '../src/theme';
import { ProgressMap } from '../src/types';

export default function Home() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [progress, setProgress] = useState<ProgressMap>({});

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
          <View style={styles.list}>
            {DECKS.map((deck) => (
              <DeckListItem
                key={deck.id}
                deck={deck}
                progress={progress[deck.id]}
                onPress={() => router.push(`/deck/${deck.id}`)}
              />
            ))}
          </View>
        </View>
      </ScrollView>
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
  list: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});
