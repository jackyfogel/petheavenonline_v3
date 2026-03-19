import { Container, Graphics, Text, TilingSprite } from 'pixi.js';

// World dimensions in world-space coordinates.
// These define the extent of the explorable area for now.
const WORLD_WIDTH = 5000;
const WORLD_HEIGHT = 5000;

const TILE_SIZE = 64;

// Subtle dot variations painted onto the grass tile
const TILE_DETAILS = [
  { x: 10, y: 8,  r: 4, color: 0x5a9e4a },  // slightly lighter
  { x: 40, y: 20, r: 3, color: 0x3d7a35 },  // slightly darker
  { x: 55, y: 50, r: 5, color: 0x4f8f40 },
  { x: 20, y: 45, r: 3, color: 0x3d7a35 },
  { x: 32, y: 10, r: 2, color: 0x5a9e4a },
  { x: 58, y: 30, r: 3, color: 0x3d7a35 },
  { x: 6,  y: 55, r: 4, color: 0x4f8f40 },
  { x: 48, y: 58, r: 2, color: 0x5a9e4a },
];

function createGrassTexture(renderer) {
  const g = new Graphics();
  // Base grass green
  g.rect(0, 0, TILE_SIZE, TILE_SIZE);
  g.fill(0x4a8c3f);
  // Subtle tonal variation dots
  for (const d of TILE_DETAILS) {
    g.circle(d.x, d.y, d.r);
    g.fill(d.color);
  }
  const texture = renderer.generateTexture(g);
  g.destroy();
  return texture;
}

export class World extends Container {
  constructor(renderer) {
    super();
    this._buildTerrain(renderer);
    this._drawOverlay();
  }

  _buildTerrain(renderer) {
    const texture = createGrassTexture(renderer);
    const terrain = new TilingSprite({ texture, width: WORLD_WIDTH, height: WORLD_HEIGHT });
    this.addChild(terrain);
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
