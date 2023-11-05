import { Alba, p5 } from "./types";

const ASPECT_RATIO = 4 / 5;

const sketch = (p: p5) => {
  const albaWindow = window as Alba;
  const { seed = albaWindow.alba._testSeed(), isRenderer } = albaWindow.alba.params;

  // Seed the PRNG with the input seed and use it with p5's random functions.
  const prng = albaWindow.alba.prng(seed);
  p.randomSeed(prng() * 1e15);

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

  p.setup = () => {
    p.createCanvas(width, height);
    p.background(0, 0, 0);
  };

  p.draw = () => {
    // Implement your artwork.
  };
};

new window.p5(sketch);
