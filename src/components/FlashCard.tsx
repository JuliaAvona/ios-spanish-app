import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { COLORS, RADIUS, SPACING, isLightColor } from '../theme';

export type Face = {
  text: string;
  /** Small label above the word, e.g. the language ("English" / "Español"). */
  tag: string;
  /** Hex swatch (color decks only). */
  color?: string;
};

type Props = {
  front: Face;
  back: Face;
  flipped: boolean;
  onPress: () => void;
};

/** A tappable card that flips between an English prompt and its Spanish answer. */
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

  return (
    <Pressable onPress={onPress} style={styles.pressable}>
      <View>
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
          <CardFace face={back} hint="Tap to flip back" answer />
        </Animated.View>
      </View>
    </Pressable>
  );
}

function CardFace({ face, hint, answer }: { face: Face; hint: string; answer?: boolean }) {
  return (
    <>
      <Text style={styles.tag}>{face.tag}</Text>
      {face.color ? (
        <View
          style={[
            styles.swatch,
            { backgroundColor: face.color },
            isLightColor(face.color) && styles.swatchBordered,
          ]}
        />
      ) : null}
      <Text style={[styles.word, answer && styles.wordAnswer]} numberOfLines={3} adjustsFontSizeToFit>
        {face.text}
      </Text>
      <Text style={styles.hint}>{hint}</Text>
    </>
  );
}

const CARD_HEIGHT = 320;

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
    shadowColor: COLORS.shadow,
    shadowOpacity: 0.1,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 6,
  },
  faceBack: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#FFFDF8',
  },
  tag: {
    position: 'absolute',
    top: SPACING.xl,
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: COLORS.inkFaint,
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
    fontWeight: '800',
    color: COLORS.ink,
    textAlign: 'center',
  },
  wordAnswer: {
    color: COLORS.primaryDark,
  },
  hint: {
    position: 'absolute',
    bottom: SPACING.xl,
    fontSize: 13,
    color: COLORS.inkFaint,
  },
});
