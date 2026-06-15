import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useSettings } from '../src/context/SettingsContext';
import { COLORS, FONT, GRADIENTS, RADIUS, SPACING, glow } from '../src/theme';

const STEPS = [
  {
    emoji: '🦜',
    title: 'Meet Loro',
    text: 'Learn Spanish one card at a time — vocabulary, phrases, verbs and a 16-lesson course.',
  },
  {
    emoji: '🔁',
    title: 'Loop until it sticks',
    text: 'Tap a card to flip EN → ES. Mark what you know — cards you miss come back around.',
  },
  {
    emoji: '🔔',
    title: 'Learned or review later',
    text: 'Finish a set to mark it learned, or snooze it 30 days and get a reminder to review.',
  },
];

export default function Onboarding() {
  const router = useRouter();
  const { update } = useSettings();
  const [step, setStep] = useState(0);
  const last = step === STEPS.length - 1;
  const s = STEPS[step];

  const finish = () => {
    update({ onboarded: true });
    router.replace('/');
  };

  return (
    <LinearGradient colors={GRADIENTS.hero} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.fill}>
      <View style={styles.top}>
        <Pressable onPress={finish} accessibilityRole="button" accessibilityLabel="Skip">
          <Text style={styles.skip}>Skip</Text>
        </Pressable>
      </View>

      <View style={styles.center}>
        <Text style={styles.emoji}>{s.emoji}</Text>
        <Text style={styles.title}>{s.title}</Text>
        <Text style={styles.text}>{s.text}</Text>
      </View>

      <View style={styles.bottom}>
        <View style={styles.dots}>
          {STEPS.map((_, i) => (
            <View key={i} style={[styles.dot, i === step && styles.dotActive]} />
          ))}
        </View>
        <Pressable
          onPress={() => (last ? finish() : setStep((x) => x + 1))}
          style={styles.cta}
          accessibilityRole="button"
        >
          <Text style={styles.ctaText}>{last ? 'Get started' : 'Next'}</Text>
        </Pressable>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1, paddingHorizontal: SPACING.xl, paddingTop: 64, paddingBottom: 48 },
  top: { alignItems: 'flex-end' },
  skip: { fontSize: 15, fontFamily: FONT.semibold, color: 'rgba(255,255,255,0.85)' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emoji: { fontSize: 84, marginBottom: SPACING.xl },
  title: {
    fontSize: 32,
    fontFamily: FONT.extrabold,
    color: '#fff',
    textAlign: 'center',
    lineHeight: 38,
  },
  text: {
    fontSize: 16,
    fontFamily: FONT.regular,
    color: 'rgba(255,255,255,0.92)',
    textAlign: 'center',
    marginTop: SPACING.lg,
    lineHeight: 23,
    paddingHorizontal: SPACING.md,
  },
  bottom: { gap: SPACING.xl },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 8 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.4)' },
  dotActive: { width: 22, backgroundColor: '#fff' },
  cta: {
    height: 56,
    borderRadius: RADIUS.lg,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    ...glow('#1B1D39'),
  },
  ctaText: { fontSize: 17, fontFamily: FONT.bold, color: COLORS.primary },
});
