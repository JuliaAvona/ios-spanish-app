import { spanishNumber } from '../decks';

describe('spanishNumber', () => {
  it('handles irregular forms (0–29)', () => {
    expect(spanishNumber(0)).toBe('cero');
    expect(spanishNumber(7)).toBe('siete');
    expect(spanishNumber(15)).toBe('quince');
    expect(spanishNumber(16)).toBe('dieciséis');
    expect(spanishNumber(21)).toBe('veintiuno');
  });

  it('builds the "<tens> y <units>" pattern (30–99)', () => {
    expect(spanishNumber(30)).toBe('treinta');
    expect(spanishNumber(31)).toBe('treinta y uno');
    expect(spanishNumber(42)).toBe('cuarenta y dos');
    expect(spanishNumber(99)).toBe('noventa y nueve');
  });

  it('handles 100', () => {
    expect(spanishNumber(100)).toBe('cien');
  });
});
