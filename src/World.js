import { Container, Graphics } from 'pixi.js';

// World dimensions in world-space coordinates.
// These define the extent of the explorable area for now.
const WORLD_WIDTH = 5000;
const WORLD_HEIGHT = 5000;

export class World extends Container {
  constructor() {
    super();
    this._drawPlaceholder();
  }

  _drawPlaceholder() {
    // Temporary flat rectangle representing the world area.
    // Will be replaced by grass terrain tiles in a later step.
    const ground = new Graphics();
    ground.rect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
    ground.fill(0xb5d99c); // muted green placeholder
    this.addChild(ground);
  }
}
