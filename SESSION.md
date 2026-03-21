# Session Log

---

## 2026-03-21 — Start: 2026-03-21 | End: [in progress]

### Work Done

- Added a single test object (black square) at world coordinate (400, 300) to validate world-space placement
- Expanded to 15 test objects spread across positive and negative world coordinates
- Added click interaction: clicking a test object logs its world coordinate to the console and flashes it red briefly (300ms)
- Added drag vs click conflict guard using a `_dragging` flag and a 4px movement threshold
- Introduced mock memorial data (15 entries) shaped like future backend data
- Replaced test squares with tombstone-shaped Graphics objects (rectangle body + semicircle top)
- Each memorial shows a pet name label beneath it
- Click logs memorial id + name and flashes red briefly
- Added smooth camera focus: clicking a memorial animates the camera to center it on screen using ease-out lerp
- Dragging while a focus animation is in progress cancels the animation cleanly
- Added HTML overlay card showing memorial name, species, years, and epitaph on click
- Overlay appears immediately on click in parallel with the camera focus animation
- Overlay has a close (✕) button; clicking it hides the card

### Files Modified

- `src/World.js`
- `src/main.js`

---
