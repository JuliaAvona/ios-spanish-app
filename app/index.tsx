import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import DeckListItem from '../src/components/DeckListItem';
import { DECKS } from '../src/data/decks';
import { getAllProgress } from '../src/storage/progress';
import { COLORS, SPACING } from '../src/theme';
import { ProgressMap } from '../src/types';

export default function Home() {
  const router = useRouter();
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
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.kicker}>EN → ES</Text>
        <Text style={styles.heading}>Spanish Cards</Text>
        <Text style={styles.sub}>
          {learnedCount > 0
            ? `${learnedCount} of ${DECKS.length} sets learned · pick a topic to train`
            : 'Pick a topic and loop the cards until they stick'}
        </Text>

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
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  content: {
    padding: SPACING.xl,
    paddingBottom: SPACING.xxl,
  },
  kicker: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 2,
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  heading: {
    fontSize: 34,
    fontWeight: '800',
    color: COLORS.ink,
  },
  sub: {
    fontSize: 15,
    color: COLORS.inkSoft,
    marginTop: SPACING.xs,
    marginBottom: SPACING.xl,
  },
  list: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});
