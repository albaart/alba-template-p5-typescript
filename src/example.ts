import { Alba, p5 } from "./types";
import { randomChoice } from "./example/utils";

const ASPECT_RATIO = 4 / 5;

// Extend p5.Color to include the levels property which is there in 1.5.0
type Color = p5.Color & { levels?: number[] };
type Cell = {
  color: Color;
};

const sketch = (p: p5) => {
  const albaWindow = window as Alba;
  const { seed = albaWindow.alba._testSeed(), isRenderer } = albaWindow.alba.params;

  // Seed the PRNG with the input seed and use it with p5's random functions.
  const prng = albaWindow.alba.prng(seed);
  p.randomSeed(prng() * 1e15);

  // Choose a random grid size between 5 and 10.
  const gridSize = Math.round(p.random(5, 11));
  const colorStepChange = Math.round(p.random(1, 10));
  const channel = randomChoice(p, [0, 1, 2]);

  // Compute the canvas size based on the window size and the aspect ratio.
  let width = window.innerWidth;
  let height = width / ASPECT_RATIO;

  // In the Alba renderer, we ignore the window height limitation as the entire canvas is captured.
  // But if we are in a display which is constrained by height, then use the height and compute the width.
  // This ensures we don't overflow the window.
  if (!isRenderer && height > window.innerHeight) {
    height = window.innerHeight;
    width = height * ASPECT_RATIO;
  }

  // Create a 2d array of cells.
  const cells: Cell[][] = [];

  p.setup = () => {
    p.createCanvas(width, height);
    p.background(0, 0, 0);

    // Initialize our 2d array of cells with random starting colors.
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        cells[i] = cells[i] || [];
        cells[i][j] = {
          color: p.color(p.random(0, 255), p.random(0, 255), p.random(0, 255)),
        };
      }
    }

    // Set our metadata
    albaWindow.alba.setMetadata({
      "Grid Size": `${gridSize}x${gridSize}`,
      "Color Change Speed": colorStepChange,
      "Color Channel": channel === 0 ? "Red" : channel === 1 ? "Green" : "Blue",
    });
  };

  p.draw = () => {
    // Scale our cell size based on the dimensions of the canvas.
    const cellWidth = width / gridSize;
    const cellHeight = height / gridSize;

    p.push();
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        const cell = cells[i][j];
        p.noStroke();
        p.fill(cell.color);
        p.rect(i * cellWidth, j * cellHeight, cellWidth, cellHeight);

        // As a scaling example, draw the cell coordinates in the top left corner of each cell.
        // The position should not change even if the size of the canvas changes.
        p.fill(0, 0, 0);
        p.textSize(cellWidth / 10);
        p.text(`${i},${j}`, i * cellWidth + cellWidth / 20, j * cellHeight + cellHeight / 10);

        // Select the channel based on the random channel we chose earlier and update it.
        const currentColor = cell.color.levels![channel];
        const newColor = (currentColor + colorStepChange) % 255;
        cell.color.levels![channel] = newColor;
        cells[i][j] = cell;
      }
    }
    p.pop();

    // Allow the renderer to capture the canvas after the first frame is drawn.
    // Note that this doesn't guarantee that the renderer will capture exactly the first frame.
    albaWindow.alba.setComplete(true);
  };
};

new window.p5(sketch);
