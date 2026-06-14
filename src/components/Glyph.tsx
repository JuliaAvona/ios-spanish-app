import { Pressable, Text } from 'react-native';

// Lightweight icon replacement that renders Unicode/emoji glyphs in a plain
// <Text>. Unlike @expo/vector-icons it pulls in no native font module
// (ExpoFontLoader), so it runs in any runtime without a native rebuild.
const GLYPHS = {
  'chevron-forward': '›',
  'chevron-back': '‹',
  checkmark: '✓',
  'checkmark-circle': '✓',
  refresh: '↻',
  'refresh-circle': '↻',
  ellipse: '●',
  time: '⏰',
  'time-outline': '⏰',
  trophy: '🏆',
  'volume-high': '🔊',
  settings: '⚙️',
  flame: '🔥',
  search: '🔍',
  close: '✕',
  star: '★',
  play: '▶',
  lock: '🔒',
  map: '🗺️',
  cards: '🃏',
  person: '👤',
} as const;

export type GlyphName = keyof typeof GLYPHS;

type Props = {
  name: GlyphName;
  size?: number;
  color?: string;
  bold?: boolean;
  onPress?: () => void;
  accessibilityLabel?: string;
};

export function Glyph({ name, size = 20, color, bold = true, onPress, accessibilityLabel }: Props) {
  const text = (
    <Text
      allowFontScaling={false}
      style={{ fontSize: size, color, fontWeight: bold ? '700' : '400', lineHeight: size + 2 }}
    >
      {GLYPHS[name]}
    </Text>
  );
  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        hitSlop={10}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
      >
        {text}
      </Pressable>
    );
  }
  return text;
}
