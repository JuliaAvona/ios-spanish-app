import { Alert, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Glyph } from '../src/components/Glyph';
import { useSettings } from '../src/context/SettingsContext';
import { clearAllProgress } from '../src/storage/progress';
import { COLORS, FONT, RADIUS, SHADOW, SPACING } from '../src/theme';

export default function Settings() {
  const router = useRouter();
  const { settings, update } = useSettings();

  const confirmReset = () => {
    Alert.alert('Reset all progress?', 'This clears the status of every set. This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Reset',
        style: 'destructive',
        onPress: () => {
          clearAllProgress();
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right', 'bottom']}>
      <View style={styles.header}>
        <Glyph name="chevron-back" size={30} color={COLORS.ink} onPress={() => router.back()} accessibilityLabel="Back" />
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 30 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  headerTitle: { fontSize: 17, fontFamily: FONT.bold, color: COLORS.ink },
  content: { padding: SPACING.xl, gap: SPACING.md },
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
    marginBottom: SPACING.md,
  },
  segmentItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.sm,
  },
  segmentItemActive: { backgroundColor: COLORS.card, ...SHADOW.sm },
  segmentText: { fontSize: 15, fontFamily: FONT.bold, color: COLORS.inkSoft },
  segmentTextActive: { color: COLORS.primary },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.lg,
    ...SHADOW.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.lg,
    gap: SPACING.md,
  },
  rowText: { flex: 1 },
  rowTitle: { fontSize: 16, fontFamily: FONT.bold, color: COLORS.ink },
  rowSub: { fontSize: 13, fontFamily: FONT.regular, color: COLORS.inkSoft, marginTop: 2 },
  divider: { height: 1, backgroundColor: COLORS.border },
  dangerBtn: {
    marginTop: SPACING.lg,
    alignItems: 'center',
    paddingVertical: SPACING.lg,
    borderRadius: RADIUS.lg,
    borderWidth: 1.5,
    borderColor: '#F3C7C0',
    backgroundColor: '#FBE9E6',
  },
  dangerText: { fontSize: 15, fontFamily: FONT.bold, color: '#C7402E' },
});
