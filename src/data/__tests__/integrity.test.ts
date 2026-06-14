import { DECKS } from '../decks';

describe('deck data integrity', () => {
  it('has unique deck ids', () => {
    const ids = DECKS.map((d) => d.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('has no empty decks', () => {
    for (const d of DECKS) expect(d.cards.length).toBeGreaterThan(0);
  });

  it('every card has non-empty en and es', () => {
    for (const d of DECKS) {
      for (const c of d.cards) {
        expect(c.en.trim().length).toBeGreaterThan(0);
        expect(c.es.trim().length).toBeGreaterThan(0);
      }
    }
  });

  it('verb cards carry 5 conjugation forms', () => {
    for (const d of DECKS.filter((d) => d.kind === 'verbs')) {
      for (const c of d.cards) {
        expect(c.forms).toBeDefined();
        expect(c.forms?.length).toBe(5);
      }
    }
  });
});
