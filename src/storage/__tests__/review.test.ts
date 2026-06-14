import { daysUntilReview, isDue } from '../progress';
import { DeckProgress } from '../../types';

const DAY = 24 * 60 * 60 * 1000;

describe('review timing', () => {
  it('isDue only for snoozed decks whose date has passed', () => {
    const now = 1_700_000_000_000;
    const snoozedPast: DeckProgress = { status: 'snoozed', reviewAfter: now - 1 };
    const snoozedFuture: DeckProgress = { status: 'snoozed', reviewAfter: now + DAY };
    expect(isDue(snoozedPast, now)).toBe(true);
    expect(isDue(snoozedFuture, now)).toBe(false);
    expect(isDue({ status: 'learned' }, now)).toBe(false);
    expect(isDue(undefined, now)).toBe(false);
  });

  it('daysUntilReview rounds up to whole days', () => {
    const now = 0;
    expect(daysUntilReview({ status: 'snoozed', reviewAfter: 5 * DAY }, now)).toBe(5);
    expect(daysUntilReview({ status: 'snoozed', reviewAfter: 0.5 * DAY }, now)).toBe(1);
    expect(daysUntilReview({ status: 'snoozed', reviewAfter: -DAY }, now)).toBe(0);
    expect(daysUntilReview(undefined, now)).toBe(0);
  });
});
