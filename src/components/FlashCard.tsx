import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { COLORS, FONT, RADIUS, SHADOW, SPACING, isLightColor } from '../theme';

export type Face =
  // Vocab word (with optional color swatch).
  | { kind: 'word'; tag: string; text: string; color?: string; answer?: boolean }
  // Verb prompt: infinitive + meaning + pattern label.
  | { kind: 'verb'; tag: string; infinitive: string; meaning: string; pattern: string }
  // Verb answer: full present-tense conjugation table.
  | { kind: 'forms'; tag: string; infinitive: string; forms: { pron: string; form: string }[] };

type Props = {
  front: Face;
  back: Face;
  flipped: boolean;
  onPress: () => void;
};

/** A tappable card that flips between a prompt and its answer. */
export default function FlashCard({ front, back, flipped, onPress }: Props) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(anim, {
      toValue: flipped ? 1 : 0,
      useNativeDriver: true,
      friction: 9,
      tension: 12,
    }).start();
  }, [flipped, anim]);

  const frontRotate = anim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] });
  const backRotate = anim.interpolate({ inputRange: [0, 1], outputRange: ['180deg', '360deg'] });

  // Fades/scales in on mount. Since the parent remounts this component per card
  // (via key), this also gives each new card a gentle entrance.
  const mount = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(mount, { toValue: 1, duration: 170, useNativeDriver: true }).start();
  }, [mount]);
  const mountScale = mount.interpolate({ inputRange: [0, 1], outputRange: [0.97, 1] });

  return (
    <Pressable onPress={onPress} style={styles.pressable}>
      <Animated.View style={{ opacity: mount, transform: [{ scale: mountScale }] }}>
        <Animated.View
          style={[styles.face, { transform: [{ perspective: 1000 }, { rotateY: frontRotate }] }]}
        >
          <CardFace face={front} hint="Tap to reveal" />
        </Animated.View>
        <Animated.View
          style={[
            styles.face,
            styles.faceBack,
            { transform: [{ perspective: 1000 }, { rotateY: backRotate }] },
          ]}
        >
          <CardFace face={back} hint="Tap to flip back" />
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
}

function CardFace({ face, hint }: { face: Face; hint: string }) {
  return (
    <>
      <Text style={styles.tag}>{face.tag}</Text>
      <FaceBody face={face} />
      <Text style={styles.hint}>{hint}</Text>
    </>
  );
}

function FaceBody({ face }: { face: Face }) {
  if (face.kind === 'verb') {
    return (
      <View style={styles.center}>
        <Text style={styles.verbInfinitive}>{face.infinitive}</Text>
        <Text style={styles.verbMeaning}>{face.meaning}</Text>
        <View style={styles.patternPill}>
          <Text style={styles.patternText}>{face.pattern}</Text>
        </View>
      </View>
    );
  }

  if (face.kind === 'forms') {
    return (
      <View style={styles.center}>
        <Text style={styles.formsInfinitive}>{face.infinitive}</Text>
        <View style={styles.formsTable}>
          {face.forms.map((f) => (
            <View key={f.pron} style={styles.formRow}>
              <Text style={styles.formPron}>{f.pron}</Text>
              <Text style={styles.formVal}>{f.form}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  }

  // word
  return (
    <View style={styles.center}>
      {face.color ? (
        <View
          style={[
            styles.swatch,
            { backgroundColor: face.color },
            isLightColor(face.color) && styles.swatchBordered,
          ]}
        />
      ) : null}
      <Text
        style={[styles.word, face.answer && styles.wordAnswer]}
        numberOfLines={3}
        adjustsFontSizeToFit
      >
        {face.text}
      </Text>
    </View>
  );
}

const CARD_HEIGHT = 340;

const styles = StyleSheet.create({
  pressable: {
    width: '100%',
  },
  face: {
    width: '100%',
    height: CARD_HEIGHT,
    borderRadius: RADIUS.xl,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.xl,
    backfaceVisibility: 'hidden',
    ...SHADOW.md,
  },
  faceBack: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#FFFDF8',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  tag: {
    position: 'absolute',
    top: SPACING.xl,
    fontSize: 13,
    fontFamily: FONT.bold,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: COLORS.primary,
  },
  swatch: {
    width: 92,
    height: 92,
    borderRadius: 46,
    marginBottom: SPACING.lg,
  },
  swatchBordered: {
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  word: {
    fontSize: 44,
    fontFamily: FONT.extrabold,
    color: COLORS.ink,
    textAlign: 'center',
  },
  wordAnswer: {
    color: COLORS.primaryDark,
  },
  // Verb front
  verbInfinitive: {
    fontSize: 42,
    fontFamily: FONT.extrabold,
    color: COLORS.ink,
    textAlign: 'center',
  },
  verbMeaning: {
    fontSize: 17,
    fontFamily: FONT.regular,
    color: COLORS.inkSoft,
    marginTop: SPACING.xs,
  },
  patternPill: {
    marginTop: SPACING.lg,
    backgroundColor: COLORS.warnSoft,
    paddingHorizontal: SPACING.md,
    paddingVertical: 5,
    borderRadius: 999,
  },
  patternText: {
    fontSize: 13,
    fontFamily: FONT.bold,
    color: COLORS.primaryDark,
  },
  // Verb back (conjugation table)
  formsInfinitive: {
    fontSize: 22,
    fontFamily: FONT.extrabold,
    color: COLORS.ink,
    marginBottom: SPACING.md,
  },
  formsTable: {
    width: '78%',
    gap: 2,
  },
  formRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    paddingVertical: 7,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.border,
  },
  formPron: {
    fontSize: 15,
    fontFamily: FONT.regular,
    color: COLORS.inkSoft,
  },
  formVal: {
    fontSize: 19,
    fontFamily: FONT.bold,
    color: COLORS.primaryDark,
  },
  hint: {
    position: 'absolute',
    bottom: SPACING.xl,
    fontSize: 13,
    fontFamily: FONT.regular,
    color: COLORS.inkFaint,
  },
});
