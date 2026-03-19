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

    // Test object at world coordinate (400, 300)
    // Confirms world-space objects pan correctly with the camera
    const testObject = new Graphics();
    testObject.rect(-20, -20, 40, 40);
    testObject.fill({ color: 0x5566ff });
    testObject.x = 400;
    testObject.y = 300;
    this.addChild(testObject);

    const testLabel = new Text({
      text: 'Test Object (400, 300)',
      style: {
        fontSize: 14,
        fill: 0x5566ff,
        fontFamily: 'monospace',
      },
    });
    testLabel.x = 400 - testLabel.width / 2;
    testLabel.y = 300 + 25;
    this.addChild(testLabel);
  }
}
