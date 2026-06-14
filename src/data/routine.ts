import { Card, Deck } from '../types';

// Source: the user's "MI RUTINA DIARIA" lesson — days, reflexive routine
// verbs, action verbs, meals, time words, connectors and a few key phrases.
const routineCards: Card[] = [
  // Days of the week
  { en: 'Monday', es: 'lunes' },
  { en: 'Tuesday', es: 'martes' },
  { en: 'Wednesday', es: 'miércoles' },
  { en: 'Thursday', es: 'jueves' },
  { en: 'Friday', es: 'viernes' },
  { en: 'Saturday', es: 'sábado' },
  { en: 'Sunday', es: 'domingo' },
  { en: 'the weekend', es: 'el fin de semana' },

  // Reflexive routine verbs
  { en: 'to get up', es: 'levantarse' },
  { en: 'to take a shower', es: 'ducharse' },
  { en: 'to take a bath', es: 'bañarse' },
  { en: 'to get ready', es: 'arreglarse' },
  { en: 'to brush (teeth/hair)', es: 'cepillarse' },
  { en: 'to get dressed', es: 'vestirse' },

  // Action verbs
  { en: 'to have breakfast', es: 'desayunar' },
  { en: 'to have lunch', es: 'almorzar' },
  { en: 'to have dinner', es: 'cenar' },
  { en: 'to sleep', es: 'dormir' },
  { en: 'to turn off', es: 'apagar' },
  { en: 'to stretch', es: 'estirarse' },
  { en: 'to watch', es: 'mirar' },
  { en: 'to see / look at', es: 'ver' },
  { en: 'to usually (do)', es: 'soler' },

  // Meals
  { en: 'breakfast', es: 'el desayuno' },
  { en: 'lunch', es: 'el almuerzo' },
  { en: 'dinner', es: 'la cena' },

  // Time
  { en: 'noon (12:00)', es: 'el mediodía' },
  { en: 'midnight (00:00)', es: 'la medianoche' },
  { en: 'half past (:30)', es: 'y media' },
  { en: 'in the morning', es: 'de la mañana' },
  { en: 'At what time…?', es: '¿A qué hora…?' },

  // Connectors
  { en: 'well…', es: 'pues' },
  { en: 'after / later', es: 'después' },
  { en: 'then', es: 'luego' },
  { en: 'so / then', es: 'entonces' },
  { en: 'before (doing)', es: 'antes de' },
  { en: 'while', es: 'mientras' },
  { en: 'by the way', es: 'por cierto' },

  // Phrases
  { en: 'What time do you get up?', es: '¿A qué hora te levantas?' },
  { en: 'I get up at seven in the morning.', es: 'Me levanto a las siete de la mañana.' },
  { en: 'I usually wake up at seven.', es: 'Suelo despertarme a las siete.' },
  { en: 'What do you usually do in the mornings?', es: '¿Qué sueles hacer por las mañanas?' },
  { en: "While I have breakfast, I'm on my phone.", es: 'Mientras desayuno, estoy en mi móvil.' },
];

export const ROUTINE_DECK: Deck = {
  id: 'routine',
  title: 'Daily routine',
  titleEs: 'Mi rutina diaria',
  emoji: '🌅',
  accent: '#2A9D8F',
  kind: 'vocab',
  cards: routineCards,
};
