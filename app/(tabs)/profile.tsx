import { useCallback, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Glyph } from '../../src/components/Glyph';
import { useSettings } from '../../src/context/SettingsContext';
import { DECKS } from '../../src/data/decks';
import { clearAllProgress, getAllProgress } from '../../src/storage/progress';
import { cardsToday, getStats, liveStreak, Stats } from '../../src/storage/stats';
import { COLORS, FONT, RADIUS, SHADOW, SPACING } from '../../src/theme';

const EMPTY_STATS: Stats = { streak: 0, bestStreak: 0, lastDay: '', todayCount: 0, total: 0 };

export default function Profile() {
  const { settings, update } = useSettings();
  const [stats, setStats] = useState<Stats>(EMPTY_STATS);
  const [learnedSets, setLearnedSets] = useState(0);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      getStats().then((s) => active && setStats(s));
      getAllProgress().then((p) => {
        if (active) setLearnedSets(Object.values(p).filter((d) => d.status === 'learned').length);
      });
      return () => {
        active = false;
      };
    }, []),
  );

  const confirmReset = () => {
    Alert.alert('Reset all progress?', 'This clears the status of every set. This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Reset', style: 'destructive', onPress: () => clearAllProgress() },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Profile</Text>

        {/* Progress */}
        <View style={styles.grid}>
          <StatCard emoji="🔥" value={`${liveStreak(stats)}`} label="Day streak" sub={`best ${stats.bestStreak}`} />
          <StatCard emoji="✅" value={`${cardsToday(stats)}`} label="Cards today" />
          <StatCard emoji="📚" value={`${stats.total}`} label="Cards reviewed" />
          <StatCard emoji="🎯" value={`${learnedSets}/${DECKS.length}`} label="Sets learned" />
        </View>

        {/* Settings */}
        <Text style={styles.label}>Default direction</Text>
        <View style={styles.segment}>
          {(['en-es', 'es-en'] as const).map((d) => {
            const active = settings.direction === d;
            return (
              <Pressable
                key={d}
                onPress={() => update({ direction: d })}
                style={[styles.segmentItem, active && styles.segmentItemActive]}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
              >
                <Text style={[styles.segmentText, active && styles.segmentTextActive]}>
                  {d === 'en-es' ? 'EN → ES' : 'ES → EN'}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.card}>
          <Row
            title="Auto-play pronunciation"
            sub="Speak the Spanish answer when a card flips"
            value={settings.autoPlayAudio}
            onChange={(v) => update({ autoPlayAudio: v })}
          />
          <View style={styles.divider} />
          <Row
            title="Haptics"
            sub="Vibration feedback on taps"
            value={settings.haptics}
            onChange={(v) => update({ haptics: v })}
          />
        </View>

        <Pressable onPress={confirmReset} style={styles.dangerBtn} accessibilityRole="button">
          <Text style={styles.dangerText}>Reset all progress</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function StatCard({ emoji, value, label, sub }: { emoji: string; value: string; label: string; sub?: string }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statEmoji}>{emoji}</Text>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
      {sub ? <Text style={styles.statSub}>{sub}</Text> : null}
    </View>
  );
}

function Row({
  title,
  sub,
  value,
  onChange,
}: {
  title: string;
  sub: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <View style={styles.row}>
      <View style={styles.rowText}>
        <Text style={styles.rowTitle}>{title}</Text>
        <Text style={styles.rowSub}>{sub}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ true: COLORS.primary, false: COLORS.border }}
        accessibilityLabel={title}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  content: { paddingHorizontal: SPACING.xl, paddingTop: SPACING.lg, paddingBottom: SPACING.xxl, gap: SPACING.md },
  title: { fontSize: 30, fontFamily: FONT.extrabold, color: COLORS.ink, marginBottom: SPACING.sm },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: SPACING.md },
  statCard: {
    width: '48%',
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    ...SHADOW.sm,
  },
  statEmoji: { fontSize: 24 },
  statValue: { fontSize: 26, fontFamily: FONT.extrabold, color: COLORS.ink, marginTop: SPACING.xs },
  statLabel: { fontSize: 13, fontFamily: FONT.medium, color: COLORS.inkSoft, marginTop: 1 },
  statSub: { fontSize: 11.5, fontFamily: FONT.regular, color: COLORS.inkFaint, marginTop: 1 },
  label: {
    fontSize: 13,
    fontFamily: FONT.bold,
    color: COLORS.inkSoft,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  segment: {
    flexDirection: 'row',
    backgroundColor: COLORS.border,
    borderRadius: RADIUS.md,
    padding: 4,
    gap: 4,
  },
  segmentItem: { flex: 1, alignItems: 'center', paddingVertical: SPACING.md, borderRadius: RADIUS.sm },
  segmentItemActive: { backgroundColor: COLORS.card, ...SHADOW.sm },
  segmentText: { fontSize: 15, fontFamily: FONT.bold, color: COLORS.inkSoft },
  segmentTextActive: { color: COLORS.primary },
  card: { backgroundColor: COLORS.card, borderRadius: RADIUS.lg, paddingHorizontal: SPACING.lg, ...SHADOW.sm },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: SPACING.lg, gap: SPACING.md },
  rowText: { flex: 1 },
  rowTitle: { fontSize: 16, fontFamily: FONT.bold, color: COLORS.ink },
  rowSub: { fontSize: 13, fontFamily: FONT.regular, color: COLORS.inkSoft, marginTop: 2 },
  divider: { height: 1, backgroundColor: COLORS.border },
  dangerBtn: {
    marginTop: SPACING.sm,
    alignItems: 'center',
    paddingVertical: SPACING.lg,
    borderRadius: RADIUS.lg,
    borderWidth: 1.5,
    borderColor: '#F3C7C0',
    backgroundColor: '#FBE9E6',
  },
  dangerText: { fontSize: 15, fontFamily: FONT.bold, color: '#C7402E' },
});
