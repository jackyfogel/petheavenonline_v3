import { Application, Graphics, TilingSprite } from 'pixi.js';
import { World } from './World.js';

const app = new Application();

await app.init({
  width: window.innerWidth,
  height: window.innerHeight,
  background: 0x000000,
  antialias: true,
  resolution: window.devicePixelRatio || 1,
  autoDensity: true,
});

document.body.appendChild(app.canvas);

// --- Grass terrain (viewport-sized TilingSprite) ---
// Stays fixed on screen; only its tilePosition scrolls as the world pans.
// This makes the grass feel infinite — no rectangle edge is ever visible.

const tileSize = 64;
const tileGraphics = new Graphics();
tileGraphics.rect(0, 0, tileSize, tileSize);
tileGraphics.fill(0x4a8c3f);
// Subtle tonal variation dots
const dots = [
  { x: 10, y: 8,  r: 4, color: 0x5a9e4a },
  { x: 40, y: 20, r: 3, color: 0x3d7a35 },
  { x: 55, y: 50, r: 5, color: 0x4f8f40 },
  { x: 20, y: 45, r: 3, color: 0x3d7a35 },
  { x: 32, y: 10, r: 2, color: 0x5a9e4a },
  { x: 58, y: 30, r: 3, color: 0x3d7a35 },
  { x: 6,  y: 55, r: 4, color: 0x4f8f40 },
  { x: 48, y: 58, r: 2, color: 0x5a9e4a },
];
for (const d of dots) {
  tileGraphics.circle(d.x, d.y, d.r);
  tileGraphics.fill(d.color);
}
const grassTexture = app.renderer.generateTexture(tileGraphics);
tileGraphics.destroy();

const terrain = new TilingSprite({
  texture: grassTexture,
  width: window.innerWidth,
  height: window.innerHeight,
});
app.stage.addChild(terrain);

// --- Camera focus animation ---
// Smoothly pans and zooms the camera so the given world coordinate is centered on screen.
// Uses an ease-out lerp on position and scale together.

const FOCUS_SCALE = 1.4; // target zoom level when focusing a memorial
let focusRaf = null;

function focusOn(wx, wy, onComplete) {
  if (focusRaf !== null) cancelAnimationFrame(focusRaf);

  function step() {
    // Target position accounts for scale: world point appears at screen center
    const targetX = window.innerWidth  / 2 - wx * FOCUS_SCALE;
    const targetY = window.innerHeight / 2 - wy * FOCUS_SCALE;

    const prevX = world.x;
    const prevY = world.y;

    world.x += (targetX - world.x) * 0.08;
    world.y += (targetY - world.y) * 0.08;
    world.scale.x += (FOCUS_SCALE - world.scale.x) * 0.08;
    world.scale.y += (FOCUS_SCALE - world.scale.y) * 0.08;

    // Keep terrain tilePosition and tileScale in sync with world
    terrain.tilePosition.x += world.x - prevX;
    terrain.tilePosition.y += world.y - prevY;
    terrain.tileScale.set(world.scale.x);

    repositionOverlay();

    const distX  = Math.abs(targetX - world.x);
    const distY  = Math.abs(targetY - world.y);
    const distS  = Math.abs(FOCUS_SCALE - world.scale.x);

    if (distX > 0.5 || distY > 0.5 || distS > 0.005) {
      focusRaf = requestAnimationFrame(step);
    } else {
      // Snap to exact target
      terrain.tilePosition.x += targetX - world.x;
      terrain.tilePosition.y += targetY - world.y;
      world.x = targetX;
      world.y = targetY;
      world.scale.set(FOCUS_SCALE);
      terrain.tileScale.set(FOCUS_SCALE);
      focusRaf = null;
      if (onComplete) onComplete();
    }
  }

  focusRaf = requestAnimationFrame(step);
}

// --- Memorial detail overlay ---
// A plain HTML card shown when a memorial is clicked. Owned entirely by main.js.

const overlay = document.createElement('div');
overlay.style.cssText = `
  display: none;
  position: fixed;
  background: white;
  border: 1px solid #aaa;
  padding: 20px 24px;
  min-width: 220px;
  font-family: serif;
  z-index: 10;
  transform: translateX(-50%);
`;
document.body.appendChild(overlay);

const closeBtn = document.createElement('button');
closeBtn.textContent = '✕';
closeBtn.style.cssText = `
  position: absolute;
  top: 8px;
  right: 10px;
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
`;
closeBtn.addEventListener('click', () => {
  overlay.style.display = 'none';
  activeMemorial = null;
  resetZoom();
});
overlay.appendChild(closeBtn);

const overlayBody = document.createElement('div');
overlay.appendChild(overlayBody);

const TOMBSTONE_BODY_HEIGHT = 48; // must match the value in World.js
const OVERLAY_GAP = 12; // px below the tombstone bottom

let activeMemorial = null;

// --- Zoom reset animation ---
// Smoothly returns world scale to 1 while keeping the current screen center fixed.

let resetRaf = null;

function resetZoom() {
  if (resetRaf !== null) cancelAnimationFrame(resetRaf);

  // Capture the world point at screen center — keep it fixed during zoom-out
  const cx = (window.innerWidth  / 2 - world.x) / world.scale.x;
  const cy = (window.innerHeight / 2 - world.y) / world.scale.y;

  function step() {
    world.scale.x += (1 - world.scale.x) * 0.08;
    world.scale.y += (1 - world.scale.y) * 0.08;

    const newX = window.innerWidth  / 2 - cx * world.scale.x;
    const newY = window.innerHeight / 2 - cy * world.scale.y;

    terrain.tilePosition.x += newX - world.x;
    terrain.tilePosition.y += newY - world.y;
    world.x = newX;
    world.y = newY;
    terrain.tileScale.set(world.scale.x);

    if (Math.abs(1 - world.scale.x) > 0.005) {
      resetRaf = requestAnimationFrame(step);
    } else {
      const snapX = window.innerWidth  / 2 - cx;
      const snapY = window.innerHeight / 2 - cy;
      terrain.tilePosition.x += snapX - world.x;
      terrain.tilePosition.y += snapY - world.y;
      world.x = snapX;
      world.y = snapY;
      world.scale.set(1);
      terrain.tileScale.set(1);
      resetRaf = null;
    }
  }

  resetRaf = requestAnimationFrame(step);
}

function repositionOverlay() {
  if (!activeMemorial) return;
  const { x: wx, y: wy } = activeMemorial.position;
  const s = world.scale.x;
  overlay.style.left = `${world.x + wx * s}px`;
  overlay.style.top  = `${world.y + wy * s + TOMBSTONE_BODY_HEIGHT * s + OVERLAY_GAP}px`;
}

function showOverlay(memorial) {
  activeMemorial = memorial;
  overlayBody.innerHTML = `
    <h2 style="margin:0 0 4px;">${memorial.name}</h2>
    <p style="margin:0 0 2px;">${memorial.species}</p>
    <p style="margin:0 0 8px;">${memorial.birthYear} – ${memorial.deathYear}</p>
    <p style="margin:0; font-style:italic;">${memorial.epitaph}</p>
  `;
  repositionOverlay();
  overlay.style.display = 'block';
}

// --- World container (border, origin marker, future memorials) ---
const world = new World((memorial) => {
  focusOn(memorial.position.x, memorial.position.y, () => showOverlay(memorial));
});
app.stage.addChild(world);

// Center camera on the memorial grid (world origin) at scale 1 on load
world.x = window.innerWidth  / 2;
world.y = window.innerHeight / 2;
terrain.tilePosition.x = world.x;
terrain.tilePosition.y = world.y;

// Keep canvas and terrain filling the browser window on resize
window.addEventListener('resize', () => {
  app.renderer.resize(window.innerWidth, window.innerHeight);
  terrain.width = window.innerWidth;
  terrain.height = window.innerHeight;
});

// --- Camera panning ---
// Dragging moves the world container in screen space.
// terrain.tilePosition mirrors world.position so the grass scrolls with the pan.

let dragging = false;
let lastX = 0;
let lastY = 0;
let startX = 0;
let startY = 0;

const DRAG_THRESHOLD = 4; // px — movement below this is treated as a click

const canvas = app.canvas;

canvas.addEventListener('pointerdown', (e) => {
  dragging = true;
  world._dragging = false; // reset drag flag for this gesture
  if (focusRaf !== null) { cancelAnimationFrame(focusRaf); focusRaf = null; }
  if (resetRaf  !== null) { cancelAnimationFrame(resetRaf);  resetRaf  = null; }
  lastX = e.clientX;
  lastY = e.clientY;
  startX = e.clientX;
  startY = e.clientY;
  canvas.setPointerCapture(e.pointerId);
  canvas.style.cursor = 'grabbing';
});

canvas.addEventListener('pointermove', (e) => {
  if (!dragging) return;
  const dx = e.clientX - lastX;
  const dy = e.clientY - lastY;
  lastX = e.clientX;
  lastY = e.clientY;
  world.x += dx;
  world.y += dy;
  // Scroll the tile pattern to match the world offset
  terrain.tilePosition.x += dx;
  terrain.tilePosition.y += dy;
  repositionOverlay();
  // Mark as a drag once pointer moves beyond threshold
  const totalDx = e.clientX - startX;
  const totalDy = e.clientY - startY;
  if (Math.sqrt(totalDx * totalDx + totalDy * totalDy) > DRAG_THRESHOLD) {
    world._dragging = true;
  }
});

canvas.addEventListener('pointerup', (e) => {
  dragging = false;
  canvas.releasePointerCapture(e.pointerId);
  canvas.style.cursor = 'default';
});

canvas.addEventListener('pointercancel', (e) => {
  dragging = false;
  canvas.releasePointerCapture(e.pointerId);
  canvas.style.cursor = 'default';
});
