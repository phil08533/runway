# Guided Tour

The Runway app has an interactive guided tour. This document records its structure so you can extend or redesign it without re-discovering the moving parts.

## Where it lives

| Concern | File | Notes |
|---|---|---|
| Tour engine + step content | `docs/app.js` | Section header `// ===== GUIDED TOUR =====` |
| Tour styles (backdrop, ring, card) | `docs/styles.css` | Section header `/* ===== GUIDED TOUR ===== */` |
| Trigger button | `docs/index.html` | Inside `.sub-header`, class `.tour-btn` |
| Safety snapshot | branch `backup/pre-guided-tour` | The commit just before this feature was built |

## How it works

### Trigger
A pulsing `.tour-btn` lives on the right side of the `.sub-header`. Its background is `var(--xp-accent-light)` so it retints with the active theme. The pulse animation is `tour-pulse` (2.4s loop). Clicking it calls `startTour()`.

### Engine
`startTour()` sets `tourActive = true`, registers a keydown handler (Esc / ←/→), and calls `renderTour()`. `renderTour()`:

1. Clears any existing spotlight + card.
2. Runs the step's `setup()` (e.g. switch tab).
3. If `scrollToTop`, scrolls the page up smoothly.
4. After ~380ms (so the tab/scroll settles), measures the target's `getBoundingClientRect()`, pads it 8px, and calls `placeTourSpotlight(rect)`.
5. Renders the tour card.

### Spotlight (cutout)
Implemented as four absolutely-positioned dim divs (top/bottom/left/right of the target rect) plus a `.tour-ring` with the accent-colored box-shadow. **No `z-index` manipulation of the target itself** — that avoids problems with parent stacking contexts (e.g. the header's `overflow: hidden`). The cutout leaves the target naturally visible and clickable.

If a step has no `target`, a single full-screen dim div covers everything.

### Card
A fixed-position card at the bottom-center of the viewport (centered horizontally). Slides in with `tour-card-in` keyframe (overshoot bounce). Buttons:
- **Skip** — calls `endTour()`
- **Back** — `tourPrev()`, disabled on the first step
- **Next / Finish** — `tourNext()`, primary style

Step counter (`X of N`) is on the left.

### Reposition on scroll/resize
A debounced `tourReposition()` handler runs on `window.scroll` and `window.resize` while the tour is active, re-measuring the current target.

## Step structure

Each step in `TOUR_STEPS` is an object:

```js
{
  title: string,                    // Card heading
  body: string,                     // Card HTML body (paragraphs, lists allowed)
  setup?: () => void,               // Run before measuring (e.g. switchTab)
  target?: () => Element | null,    // Element to spotlight
  scrollToTop?: boolean             // If true, scroll page to top before measuring
}
```

## Current step list (in order)

1. **Welcome** — no target, full-screen dim
2. **Step 1 — Income** — switches to `#income-tab`, spotlights `#incomeForm`
3. **Step 2 — Expenses** — switches to `#expense-tab`, spotlights `#expenseForm`
4. **Step 3 — Savings goals** — switches to `#savings-tab`, spotlights `#savingsGoalForm`
5. **Step 4 — Snapshots** — switches to `#budgets-tab`, spotlights `#budgets-tab`
6. **Step 5 — Save to file** — scrolls to top, spotlights the Save button in `.header-right`
7. **Step 6 — Load from file** — scrolls to top, spotlights the Load button
8. **Step 7 — Calculate runway** — spotlights `#runwaySection`
9. **Step 8 — Themes** — scrolls to top, spotlights `.theme-btn`
10. **Done** — no target, celebrates with confetti when finished

## Adding or editing steps

Edit `TOUR_STEPS` in `docs/app.js`. To target a new section, give the section an `id` and use `document.querySelector('#newId')`. Always run any tab switch / DOM mutation in `setup()` so the engine waits for it before measuring.

After editing, bump `CACHE_NAME` in `docs/sw.js` so returning visitors pick up the new tour.

## Reverting

If the tour is broken or unwanted, hard-reset the branch to the snapshot:

```bash
git checkout claude/refactor-doc-styling-DvNUw
git reset --hard backup/pre-guided-tour
git push --force-with-lease origin claude/refactor-doc-styling-DvNUw
```

(Or open `backup/pre-guided-tour` in a fresh PR.)

## Known caveats

- Inline `onclick` handlers in the dynamically-rendered card call `endTour`, `tourPrev`, `tourNext` — these must remain top-level functions in `app.js`.
- `switchTab` was modified to no longer rely on the global `event` object so it can be called programmatically. If you rewrite `switchTab`, keep that contract.
- The `#budgets-tab` step targets the whole tab pane (not a specific element) since the snapshot UI is a list, not a single field. If you rework that tab, update the step's `target`.
