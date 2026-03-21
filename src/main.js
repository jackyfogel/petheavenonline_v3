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

// --- World container (border, origin marker, future memorials) ---
const world = new World();
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
