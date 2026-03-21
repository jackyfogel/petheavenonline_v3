import { Container, Graphics, Text } from 'pixi.js';

// World dimensions in world-space coordinates.
// These define the extent of the explorable area for now.
const WORLD_WIDTH = 5000;
const WORLD_HEIGHT = 5000;

// Set to true to draw a border around the world extent (useful for debugging).
const SHOW_BORDER = false;

export class World extends Container {
  constructor() {
    super();
    // Set by main.js during drag to prevent click handlers firing on drag-release
    this._dragging = false;
    this._drawOverlay();
  }

  _drawOverlay() {
    if (SHOW_BORDER) {
      const border = new Graphics();
      border.rect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
      border.stroke({ width: 6, color: 0x2d5a27 });
      this.addChild(border);
    }

    // Cross marker at world origin (0, 0)
    const marker = new Graphics();
    marker.moveTo(-20, 0).lineTo(20, 0); // horizontal
    marker.moveTo(0, -20).lineTo(0, 20); // vertical
    marker.stroke({ width: 3, color: 0xcc3333 });
    this.addChild(marker);

    // Label confirming world origin
    const label = new Text({
      text: 'World Origin (0, 0)',
      style: {
        fontSize: 16,
        fill: 0xcc3333,
        fontFamily: 'monospace',
      },
    });
    label.x = 10;
    label.y = 10;
    this.addChild(label);

    // Test objects spread across positive and negative world coordinates
    const testPositions = [
      [  400,   300],
      [  800,  -200],
      [ -300,   500],
      [ 1200,   700],
      [ -600,  -400],
      [ 2000,   100],
      [ -100,  1000],
      [  600, -800],
      [ 1500, -500],
      [-1000,   200],
      [  300,  1800],
      [ -800,  -900],
      [ 2500,  1200],
      [-1500,  1500],
      [  900,  2200],
    ];

    for (const [wx, wy] of testPositions) {
      const obj = new Graphics();

      const draw = (color) => {
        obj.clear();
        obj.rect(-20, -20, 40, 40);
        obj.fill({ color });
      };

      draw(0x111111);
      obj.x = wx;
      obj.y = wy;
      obj.eventMode = 'static';
      obj.cursor = 'pointer';

      obj.on('pointerup', () => {
        if (this._dragging) return;
        console.log(`Clicked object at world (${wx}, ${wy})`);
        draw(0xff3333);
        setTimeout(() => draw(0x111111), 300);
      });

      this.addChild(obj);

      const objLabel = new Text({
        text: `(${wx}, ${wy})`,
        style: { fontSize: 12, fill: 0x111111, fontFamily: 'monospace' },
      });
      objLabel.x = wx - objLabel.width / 2;
      objLabel.y = wy + 25;
      this.addChild(objLabel);
    }
  }
}
