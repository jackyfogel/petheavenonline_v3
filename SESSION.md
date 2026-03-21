# Session Log

---

## 2026-03-21 #2 — Start: 2026-03-21 | End: [in progress]

### Work Done

- Removed hardcoded positions from memorial data — memorials are now content only
- Added LAWN config (top-left origin, centered around world origin) and GRID config (5 columns, 120×150 spacing)
- Grid position computed at render time from memorial index; attached back as memorial.position for main.js compatibility
- Extended camera focus to animate scale (1.0 → 1.4) alongside pan using the same ease-out lerp
- Centering formula updated to account for scale: targetX = innerWidth/2 - wx * FOCUS_SCALE
- Terrain tileScale synced to world.scale each animation frame so grass zooms with the world
- repositionOverlay updated to multiply world coords by world.scale for correct screen position under zoom
- Overlay still appears only after pan+zoom both complete
- Fixed initial camera position: on load, world centers on the memorial grid at scale 1
- Fixed zoom reset: closing the overlay smoothly animates scale back to 1, keeping current view center fixed
- Drag cancels reset animation cleanly

### Files Modified

- `src/World.js`

---

## 2026-03-21 — Start: 2026-03-21 | End: 2026-03-21

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
- Overlay positioned directly below the clicked tomb, horizontally centered, tracking camera movement
- Overlay appears only after the camera focus animation completes
- Clicking a new tomb mid-pan cancels the pending overlay and starts fresh
- Drag while overlay is open keeps it anchored below the tomb
- Overlay has a close (✕) button; clicking it hides the card

### Files Modified

- `src/World.js`
- `src/main.js`

---
