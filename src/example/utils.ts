import { p5 } from "../types";

export const randomChoice = <T>(p: p5, arr: T[]): T => {
  const index = Math.floor(p.random(0, arr.length));
  return arr[index];
};
