export type {};
declare global {
  interface Math {
    clamp: (value: number, min: number, max: number) => number;
  }
}

Math.clamp = (value, min, max) => Math.min(Math.max(value, min), max);
