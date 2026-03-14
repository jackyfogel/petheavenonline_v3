import { Application } from 'pixi.js';

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

// Keep canvas filling the browser window on resize
window.addEventListener('resize', () => {
  app.renderer.resize(window.innerWidth, window.innerHeight);
});
