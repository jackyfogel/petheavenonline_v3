import { Application } from 'pixi.js';
import { World } from './World.js';

// Soft placeholder background color (pale sage green — peaceful feel)
const BACKGROUND_COLOR = 0xd4e8c2;

const app = new Application();

await app.init({
  width: window.innerWidth,
  height: window.innerHeight,
  background: BACKGROUND_COLOR,
  antialias: true,
  resolution: window.devicePixelRatio || 1,
  autoDensity: true,
});

document.body.appendChild(app.canvas);

const world = new World();
app.stage.addChild(world);

// Keep canvas filling the browser window on resize
window.addEventListener('resize', () => {
  app.renderer.resize(window.innerWidth, window.innerHeight);
});

// --- Camera panning ---
// Dragging moves the world container in screen space.
// world.position represents the camera offset.

let dragging = false;
let lastX = 0;
let lastY = 0;

const canvas = app.canvas;

canvas.addEventListener('pointerdown', (e) => {
  dragging = true;
  lastX = e.clientX;
  lastY = e.clientY;
  canvas.setPointerCapture(e.pointerId); // keep drag alive outside canvas
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
