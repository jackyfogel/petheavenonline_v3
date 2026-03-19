import { Container, Graphics, Text } from 'pixi.js';

// World dimensions in world-space coordinates.
// These define the extent of the explorable area for now.
const WORLD_WIDTH = 5000;
const WORLD_HEIGHT = 5000;

export class World extends Container {
  constructor() {
    super();
    this._drawOverlay();
  }

  _drawOverlay() {
    // Border around the world extent
    const border = new Graphics();
    border.rect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
    border.stroke({ width: 6, color: 0x2d5a27 }); // dark green border
    this.addChild(border);

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
  }
}
