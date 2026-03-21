import { Container, Graphics, Text } from 'pixi.js';

// World dimensions in world-space coordinates.
// These define the extent of the explorable area for now.
const WORLD_WIDTH = 5000;
const WORLD_HEIGHT = 5000;

// Set to true to draw a border around the world extent (useful for debugging).
const SHOW_BORDER = false;

// Mock memorial data — content only, no position (placement is derived from grid).
const MEMORIALS = [
  { id: 1,  name: 'Bella',   species: 'Dog',    birthYear: 2008, deathYear: 2021, epitaph: 'Forever chasing squirrels.'         },
  { id: 2,  name: 'Oliver',  species: 'Cat',    birthYear: 2010, deathYear: 2023, epitaph: 'Napped in every sunbeam.'           },
  { id: 3,  name: 'Nemo',    species: 'Fish',   birthYear: 2015, deathYear: 2019, epitaph: 'Small but full of wonder.'          },
  { id: 4,  name: 'Max',     species: 'Dog',    birthYear: 2006, deathYear: 2020, epitaph: 'Loyal until the very last day.'     },
  { id: 5,  name: 'Luna',    species: 'Cat',    birthYear: 2012, deathYear: 2022, epitaph: 'Moonlight and mystery.'             },
  { id: 6,  name: 'Peanut',  species: 'Rabbit', birthYear: 2014, deathYear: 2020, epitaph: 'Tiny heart, endless energy.'       },
  { id: 7,  name: 'Coco',    species: 'Dog',    birthYear: 2009, deathYear: 2021, epitaph: 'Brought warmth to every room.'     },
  { id: 8,  name: 'Whisper', species: 'Cat',    birthYear: 2011, deathYear: 2024, epitaph: 'Quiet and endlessly wise.'         },
  { id: 9,  name: 'Sunny',   species: 'Bird',   birthYear: 2016, deathYear: 2023, epitaph: 'Sang the mornings awake.'          },
  { id: 10, name: 'Biscuit', species: 'Dog',    birthYear: 2007, deathYear: 2019, epitaph: 'Good boy. Always.'                 },
  { id: 11, name: 'Mochi',   species: 'Cat',    birthYear: 2017, deathYear: 2024, epitaph: 'Sweet and soft as her name.'       },
  { id: 12, name: 'Pepper',  species: 'Rabbit', birthYear: 2013, deathYear: 2018, epitaph: 'Quick paws, gentle soul.'          },
  { id: 13, name: 'Archie',  species: 'Dog',    birthYear: 2005, deathYear: 2018, epitaph: 'Walked every trail with joy.'      },
  { id: 14, name: 'Misty',   species: 'Cat',    birthYear: 2003, deathYear: 2017, epitaph: 'Appeared and disappeared like fog.'},
  { id: 15, name: 'Goldie',  species: 'Fish',   birthYear: 2018, deathYear: 2022, epitaph: 'Shimmered in still water.'         },
];

// Memorial lawn — one zone, centered around world origin.
const LAWN = { x: -240, y: -150 };

// Grid layout within the lawn.
const GRID = {
  columns:  5,
  spacingX: 120,
  spacingY: 150,
};

export class World extends Container {
  constructor(onMemorialClick) {
    super();
    // Set by main.js during drag to prevent click handlers firing on drag-release
    this._dragging = false;
    this._onMemorialClick = onMemorialClick;
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

    // Memorial objects driven by mock data, placed on the lawn grid
    for (let i = 0; i < MEMORIALS.length; i++) {
      const memorial = MEMORIALS[i];
      const { id, name } = memorial;

      const col = i % GRID.columns;
      const row = Math.floor(i / GRID.columns);
      const wx = LAWN.x + col * GRID.spacingX;
      const wy = LAWN.y + row * GRID.spacingY;

      // Attach computed position so main.js can use memorial.position for focus/overlay
      memorial.position = { x: wx, y: wy };

      const obj = new Graphics();

      // Tombstone shape: rectangular body with a semicircle on top
      const w = 36, h = 48, r = 18; // body width/height, arc radius
      const draw = (color) => {
        obj.clear();
        obj.rect(-w / 2, 0, w, h);          // body
        obj.arc(0, 0, r, Math.PI, 0);        // rounded top
        obj.fill({ color });
      };

      draw(0x444444);
      obj.x = wx;
      obj.y = wy;
      obj.eventMode = 'static';
      obj.cursor = 'pointer';

      obj.on('pointerup', () => {
        if (this._dragging) return;
        console.log(`Clicked memorial id=${id} name=${name}`);
        draw(0xff3333);
        setTimeout(() => draw(0x444444), 300);
        this._onMemorialClick(memorial);
      });

      this.addChild(obj);

      const nameLabel = new Text({
        text: name,
        style: { fontSize: 13, fill: 0x222222, fontFamily: 'serif' },
      });
      nameLabel.x = wx - nameLabel.width / 2;
      nameLabel.y = wy + h + 6;
      this.addChild(nameLabel);
    }
  }
}
