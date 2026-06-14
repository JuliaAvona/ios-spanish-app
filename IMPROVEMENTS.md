# Spanish Cards — Improvement roadmap

Status: ⬜ planned · 🟡 partial · ✅ done
Effort: S (≤1h) · M (½ day) · L (1+ day) · ⚙️ needs `npx expo run:ios` (native module)

---

## 🔴 Tier 1 — core learning

- [x] ✅ **1. Audio pronunciation (TTS)** · S · ⚙️
  `expo-speech` → 🔊 "Hear it" button on the card + auto-play Spanish on flip (`es-ES`). Toggle in Settings.
- [x] ✅ **2. Real review reminders** · S · ⚙️
  `expo-notifications` → schedules a local reminder when a deck is snoozed; cancels it when the status changes.
- [ ] ⬜ **3. Spaced repetition (SRS-lite)** · L
  Per-card mastery (Leitner boxes) instead of a single deck status. *(Deferred — data-model change.)*

## 🟠 Tier 2 — retention

- [x] ✅ **4. Streak + daily stats** · M
  Day-streak 🔥 and "today" counter in the Home header; `src/storage/stats.ts` records every reviewed card.
- [x] ✅ **5. Onboarding** · M
  3-slide first-run intro (`app/onboarding.tsx`), gated by the `onboarded` flag.

## 🟡 Tier 3 — scale & navigation

- [x] ✅ **6. Search + sections on Home** · M
  Search box (matches set names + card text) and decks grouped into Vocabulary / Phrases / Verbs / Course.
- [x] ✅ **7. Settings screen** · M
  Default direction, auto-play audio, haptics, reset-all-progress. Gear icon in the Home header.

## 🟢 Tier 4 — polish & launch

- [ ] ⬜ **8. Dark mode** · M — dark palette + `useColorScheme`. *(Deferred — theme threading.)*
- [x] 🟡 **9. Accessibility** · S — labels/roles on tiles, rate buttons, glyph buttons, switches. (Dynamic Type still TODO.)
- [x] ✅ **10. Tests** · S — jest-expo: number generator, review-timing logic, deck data integrity (9 tests).
- [ ] ⬜ **11. Content** · S — reverse drill for verbs, example sentences, split Numbers (101), difficulty tags.
- [ ] ⬜ **12. Launch** · M — App Store screenshots, analytics, crash reporting, ASO, privacy policy.

---

## ✅ Done in this pass
Audio (1), Reminders (2), Streak/stats (4), Onboarding (5), Search+sections (6), Settings (7),
Accessibility labels (9), Tests (10).

New files: `src/context/SettingsContext.tsx`, `src/utils/speech.ts`, `src/utils/notifications.ts`,
`src/storage/stats.ts`, `app/settings.tsx`, `app/onboarding.tsx`, `src/**/__tests__/*`.

## ⏭️ Next (recommended order)
1. **#3 SRS-lite** — biggest learning upgrade; per-card boxes + "due today" queue.
2. **#8 Dark mode** — wrap COLORS in a theme hook + dark palette.
3. **#11 Content** — verb reverse drill, example sentences.
4. **#12 Launch** — analytics + ASO screenshots.

## ⚙️ Rebuild required
Audio + notifications add native modules. Run once:
```bash
npx expo run:ios
```
After that, everything else is JS and hot-reloads.
