import { Text } from 'react-native';

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
} as const;

export type GlyphName = keyof typeof GLYPHS;

type Props = {
  name: GlyphName;
  size?: number;
  color?: string;
  bold?: boolean;
};

export function Glyph({ name, size = 20, color, bold = true }: Props) {
  return (
    <Text
      allowFontScaling={false}
      style={{ fontSize: size, color, fontWeight: bold ? '700' : '400', lineHeight: size + 2 }}
    >
      {GLYPHS[name]}
    </Text>
  );
}
