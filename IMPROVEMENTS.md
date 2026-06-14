# Spanish Cards — Improvement roadmap

Status: ⬜ planned · 🟡 in progress · ✅ done
Effort: S (≤1h) · M (½ day) · L (1+ day) · ⚙️ needs `npx expo run:ios` (native module)

---

## 🔴 Tier 1 — core learning

- [ ] **1. Audio pronunciation (TTS)** · S · ⚙️
  `expo-speech` → 🔊 button on the card + auto-play Spanish on flip (`es-ES`).
- [ ] **2. Real review reminders** · S · ⚙️
  `expo-notifications` → schedule a local notification when a deck is snoozed; cancel on status change. (Currently `reviewAfter` is stored but nothing fires.)
- [ ] **3. Spaced repetition (SRS-lite)** · L
  Per-card mastery (Leitner boxes) instead of a single deck status; resurface due cards.

## 🟠 Tier 2 — retention

- [ ] **4. Streak + daily goal + stats** · M
  Cards-today counter, day streak 🔥, daily goal, mini stats surface.
- [ ] **5. Onboarding** · M
  First-run intro (3 slides) gated by a flag.

## 🟡 Tier 3 — scale & navigation

- [ ] **6. Search + sections on Home** · M
  Search box + group the 27 decks into sections (Vocabulary / Phrases / Verbs / Course).
- [ ] **7. Settings screen** · M
  Default direction, haptics on/off, audio auto-play, reset progress, UI language RU/EN.

## 🟢 Tier 4 — polish & launch

- [ ] **8. Dark mode** · M — dark palette + `useColorScheme` (theme is already tokenised).
- [ ] **9. Accessibility** · S — `accessibilityLabel`/roles on buttons & glyphs, Dynamic Type.
- [ ] **10. Tests** · S — jest-expo: number generator, storage/status logic, data integrity.
- [ ] **11. Content** · S — reverse drill for verbs, example sentences, split Numbers (101), difficulty tags.
- [ ] **12. Launch** · M — App Store screenshots, analytics, crash reporting, ASO, privacy policy.

---

## Notes
- Items marked ⚙️ add native modules; after them run `npx expo run:ios` once to rebuild the dev client.
- Deferred for a focused follow-up: **#3 SRS** (data-model change) and **#8 Dark mode** (theme threading) — higher risk, done separately.
