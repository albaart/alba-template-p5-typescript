import type p5 from "p5";

interface Constructable<T> {
  new (...args: any): T;
}

declare global {
  interface Window {
    p5: Constructable<p5>;
  }
}

export type Alba = typeof window & {
  alba: {
    params: {
      seed: string;
      tokenId: number;
      width?: number;
      isRenderer: boolean;
    };
    isComplete: () => boolean;
    setComplete: (a: boolean) => void;
    getMetadata: () => Record<string, any>;
    setMetadata: (a: Record<string, any>) => void;
    prng: (seed: string) => () => number;
    _testSeed: () => string;
  };
};

export { p5 };
