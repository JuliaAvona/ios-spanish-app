import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Glyph, GlyphName } from './Glyph';
import { COLORS, FONT, RADIUS, SHADOW, SPACING } from '../theme';
import { Deck, DeckStatus } from '../types';

type Props = {
  deck: Deck | null;
  currentStatus?: DeckStatus;
  onClose: () => void;
  onSelect: (status: DeckStatus) => void;
};

const OPTIONS: {
  value: DeckStatus;
  label: string;
  sub: string;
  icon: GlyphName;
  color: string;
}[] = [
  { value: 'new', label: 'New', sub: 'Not started yet', icon: 'ellipse', color: COLORS.inkFaint },
  { value: 'learning', label: 'In progress', sub: 'Still learning', icon: 'ellipse', color: COLORS.warn },
  { value: 'learned', label: 'Learned', sub: 'Marked as done', icon: 'checkmark-circle', color: COLORS.success },
  { value: 'snoozed', label: 'Review in 30 days', sub: 'Remind me later', icon: 'time', color: COLORS.primary },
];

/** Bottom-sheet for manually overriding a deck's status. */
export default function StatusPicker({ deck, currentStatus, onClose, onSelect }: Props) {
  const insets = useSafeAreaInsets();
  const current = currentStatus ?? 'new';

  return (
    <Modal visible={!!deck} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        {/* Stop taps on the sheet from dismissing the modal. */}
        <Pressable style={[styles.sheet, { paddingBottom: insets.bottom + SPACING.lg }]} onPress={() => {}}>
          <View style={styles.handle} />
          <Text style={styles.title}>Set status</Text>
          {deck ? (
            <Text style={styles.deckName} numberOfLines={1}>
              {deck.emoji} {deck.title}
            </Text>
          ) : null}

          <View style={styles.options}>
            {OPTIONS.map((o) => {
              const active = current === o.value;
              return (
                <Pressable
                  key={o.value}
                  onPress={() => onSelect(o.value)}
                  style={({ pressed }) => [
                    styles.option,
                    active && styles.optionActive,
                    pressed && styles.optionPressed,
                  ]}
                >
                  <View style={[styles.optionIcon, { backgroundColor: o.color + '22' }]}>
                    <Glyph name={o.icon} size={16} color={o.color} />
                  </View>
                  <View style={styles.optionText}>
                    <Text style={styles.optionLabel}>{o.label}</Text>
                    <Text style={styles.optionSub}>{o.sub}</Text>
                  </View>
                  {active ? <Glyph name="checkmark" size={20} color={COLORS.primary} /> : null}
                </Pressable>
              );
            })}
          </View>

          <Pressable style={styles.cancel} onPress={onClose}>
            <Text style={styles.cancelText}>Cancel</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(22,22,58,0.45)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: COLORS.card,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.md,
    ...SHADOW.md,
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: COLORS.border,
    marginBottom: SPACING.lg,
  },
  title: {
    fontSize: 20,
    fontFamily: FONT.extrabold,
    color: COLORS.ink,
  },
  deckName: {
    fontSize: 14,
    fontFamily: FONT.medium,
    color: COLORS.inkSoft,
    marginTop: 2,
    marginBottom: SPACING.lg,
  },
  options: {
    gap: SPACING.sm,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  optionActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primarySoft,
  },
  optionPressed: {
    opacity: 0.7,
  },
  optionIcon: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionText: {
    flex: 1,
  },
  optionLabel: {
    fontSize: 16,
    fontFamily: FONT.bold,
    color: COLORS.ink,
  },
  optionSub: {
    fontSize: 12.5,
    fontFamily: FONT.regular,
    color: COLORS.inkSoft,
    marginTop: 1,
  },
  cancel: {
    alignItems: 'center',
    paddingVertical: SPACING.lg,
    marginTop: SPACING.sm,
  },
  cancelText: {
    fontSize: 15,
    fontFamily: FONT.semibold,
    color: COLORS.inkSoft,
  },
});
