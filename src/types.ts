// Core domain types for the flashcard trainer.

export type Card = {
  /** English prompt (for numbers this is the digit, e.g. "42"). */
  en: string;
  /** Spanish answer, including the article for nouns (e.g. "la cabeza"). */
  es: string;
  /** Optional hex color — used to render a swatch on color cards. */
  color?: string;

  // --- Verb cards only ---
  /** English meaning of the verb, shown under the infinitive. */
  meaning?: string;
  /** Conjugation pattern label, e.g. "e → ie". */
  pattern?: string;
  /** Present-tense forms, ordered to match PRONOUNS (yo, tú, él, nos, ellos). */
  forms?: string[];
};

export type DeckKind = 'vocab' | 'verbs';

export type Deck = {
  id: string;
  /** English topic name. */
  title: string;
  /** Spanish topic name, shown as a subtitle. */
  titleEs: string;
  emoji: string;
  /** Accent color used for the deck card and training screen. */
  accent: string;
  /** Drives how cards render: simple word vs verb conjugation. */
  kind: DeckKind;
  cards: Card[];
};

export type DeckStatus = 'new' | 'learning' | 'learned' | 'snoozed';

export type DeckProgress = {
  status: DeckStatus;
  /** Epoch ms of the last training session. */
  lastTrainedAt?: number;
  /** Epoch ms after which a snoozed deck becomes due again. */
  reviewAfter?: number;
  /** Cards in the deck the last time it was completed. */
  lastTotal?: number;
};

export type ProgressMap = Record<string, DeckProgress>;
