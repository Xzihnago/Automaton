import { isDeepStrictEqual } from "util";

declare global {
  interface Array<T> {
    remove: (item: T) => T | undefined;
  }
}

Array.prototype.remove = function <T>(item: T): T | undefined {
  for (let i = 0; i < this.length; ++i) {
    if (isDeepStrictEqual(this[i], item)) {
      return this.splice(i, 1)[0];
    }
  }
};
