import * as Notifications from 'expo-notifications';

// Show review reminders even while the app is foregrounded.
try {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: false,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
} catch {
  // native module absent — ignore.
}

const idFor = (deckId: string) => `review-${deckId}`;

async function ensurePermission(): Promise<boolean> {
  try {
    const current = await Notifications.getPermissionsAsync();
    if (current.granted) return true;
    if (!current.canAskAgain) return false;
    const req = await Notifications.requestPermissionsAsync();
    return req.granted;
  } catch {
    return false;
  }
}

/** Schedule a local reminder to review a snoozed deck at `date`. */
export async function scheduleReviewReminder(deckId: string, deckTitle: string, date: Date) {
  try {
    await cancelReviewReminder(deckId);
    const ok = await ensurePermission();
    if (!ok) return;
    await Notifications.scheduleNotificationAsync({
      identifier: idFor(deckId),
      content: {
        title: '¡A repasar! Time to review',
        body: `“${deckTitle}” is ready for another round.`,
      },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date },
    });
  } catch {
    // ignore scheduling failures (no permission / no native module)
  }
}

/** Cancel a deck's pending review reminder (e.g. when its status changes). */
export async function cancelReviewReminder(deckId: string) {
  try {
    await Notifications.cancelScheduledNotificationAsync(idFor(deckId));
  } catch {
    // ignore
  }
}
