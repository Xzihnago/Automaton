import { assert, describe, test } from "vitest";
import "./Array";

describe("Array", () => {
  test("remove", () => {
    const arr = [1, 2, 3, 4, 5];
    arr.remove(2);
    assert.deepStrictEqual(arr, [1, 3, 4, 5]);
  });

  test("remove", () => {
    const arr = [
      [1, 2],
      [3, 4],
      [5, 6],
    ];
    arr.remove([3, 4]);
    assert.deepStrictEqual(arr, [
      [1, 2],
      [5, 6],
    ]);
  });
});
