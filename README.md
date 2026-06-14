# Spanish Cards 🇪🇸

EN → ES флешкарточный тренажёр для iOS (React Native + Expo SDK 54, expo-router).

Выбираешь тему, гоняешь карточки по кругу: тапаешь — переворачиваешь EN→ES, отмечаешь
«знаю» (карточка уходит) или «keep looping» (возвращается в конец круга). Когда выучил
весь набор — помечаешь его как **выученный** или ставишь **повтор через 30 дней**.

## Наборы в MVP

**Лексика** (EN → ES, карточка-переворот, можно менять направление):

| Тема | Карточек |
|------|----------|
| 🎨 Colors (Los colores) — со свотчами цветов | 14 |
| 🔢 Numbers 0–100 (Los números) | 101 |
| 🧍 Body parts (El cuerpo) — с артиклями el/la | 22 |
| 🌅 Daily routine (Mi rutina diaria) — дни недели, глаголы, связки, фразы | 43 |
| 💬 Everyday phrases · 1–4 (Frases) — бытовые фразы, по 20 в наборе | 80 |
| 📘 Course · Lesson 1–16 — лексика 16-урочного базового курса, набор на урок | 314 |

**Глаголы** (Presente, перёд — инфинитив + перевод + паттерн, оборот — таблица спряжения
yo/tú/él/nosotros/ellos). Данные перенесены из `spanish_verbs_quiz`:

| Тема | Глаголов |
|------|----------|
| 🔄 Verbs · Stem-changing (e→ie, o→ue, e→i) | 19 |
| ⚡ Verbs · Irregular (yo -go/-zco, ser/ir/estar…) | 15 |
| ✏️ Verbs · Regular | 9 |

## Запуск

```bash
npm install
npx expo start        # затем 'i' — открыть в iOS-симуляторе, или скан QR в Expo Go
```

Проверки:

```bash
npm run typecheck                       # tsc --noEmit
npx expo export --platform ios          # собрать JS-бандл (валидирует импорты)
```

## Структура

```
app/
  _layout.tsx        Stack-навигация (expo-router)
  index.tsx          Главная — список тем со статусами
  deck/[id].tsx      Экран тренировки + экран завершения
src/
  data/decks.ts      Наборы карточек + генератор чисел 0–100
  storage/progress.ts AsyncStorage: статусы наборов (new/learning/learned/snoozed)
  components/         FlashCard (переворот), DeckListItem
  theme.ts, types.ts
```

## Как добавить новый набор

Добавь объект в массив `DECKS` в [src/data/decks.ts](src/data/decks.ts):

```ts
{
  id: 'animals',
  title: 'Animals',
  titleEs: 'Los animales',
  emoji: '🐾',
  accent: '#3D9970',
  cards: [
    { en: 'Dog', es: 'el perro' },
    { en: 'Cat', es: 'el gato' },
    // ...
  ],
}
```

Для цветов можно указать `color: '#RRGGBB'` — на карточке появится свотч.

## Статусы наборов

- **New** — ещё не открывали
- **In progress** — начали тренировать, но не закончили круг
- **Learned** — помечен выученным
- **Review in Nd / Review due** — отложен на 30 дней, по истечении подсвечивается как «пора повторить»

Прогресс хранится локально в AsyncStorage (ключ `spanish-cards:progress:v1`).
