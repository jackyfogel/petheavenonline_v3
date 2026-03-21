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
// Smoothly moves the camera so the given world coordinate is centered on screen.
// Uses an ease-out lerp — fast at first, settles gently.

let focusRaf = null;

function focusOn(wx, wy, onComplete) {
  if (focusRaf !== null) cancelAnimationFrame(focusRaf);

  function step() {
    const targetX = window.innerWidth  / 2 - wx;
    const targetY = window.innerHeight / 2 - wy;

    const prevX = world.x;
    const prevY = world.y;

    world.x += (targetX - world.x) * 0.08;
    world.y += (targetY - world.y) * 0.08;

    // Keep terrain tilePosition in sync with world movement
    terrain.tilePosition.x += world.x - prevX;
    terrain.tilePosition.y += world.y - prevY;

    repositionOverlay();

    const distX = Math.abs(targetX - world.x);
    const distY = Math.abs(targetY - world.y);

    if (distX > 0.5 || distY > 0.5) {
      focusRaf = requestAnimationFrame(step);
    } else {
      // Snap to exact target
      terrain.tilePosition.x += targetX - world.x;
      terrain.tilePosition.y += targetY - world.y;
      world.x = targetX;
      world.y = targetY;
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
closeBtn.addEventListener('click', () => { overlay.style.display = 'none'; activeMemorial = null; });
overlay.appendChild(closeBtn);

const overlayBody = document.createElement('div');
overlay.appendChild(overlayBody);

const TOMBSTONE_BODY_HEIGHT = 48; // must match the value in World.js
const OVERLAY_GAP = 12; // px below the tombstone bottom

let activeMemorial = null;

function repositionOverlay() {
  if (!activeMemorial) return;
  const { x: wx, y: wy } = activeMemorial.position;
  overlay.style.left = `${world.x + wx}px`;
  overlay.style.top  = `${world.y + wy + TOMBSTONE_BODY_HEIGHT + OVERLAY_GAP}px`;
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
