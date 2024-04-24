import { isDeepStrictEqual } from "util";

declare global {
  interface Array<T> {
    remove: (item: T) => T | undefined;
    awaitAll: () => Promise<T[]>;
  }
}

Array.prototype.remove = function <T>(item: T): T | undefined {
  for (let i = 0; i < this.length; ++i) {
    if (isDeepStrictEqual(this[i], item)) {
      return this.splice(i, 1)[0];
    }
  }
};

Array.prototype.awaitAll = function <T>(): Promise<T[]> {
  return Promise.all(this);
};
