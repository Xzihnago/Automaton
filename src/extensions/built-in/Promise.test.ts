import { assert, describe, test } from "vitest";
import "./Promise";

describe("Promise", () => {
  test("on time", async () => {
    assert.isTrue(
      await new Promise((resolve) => {
        resolve(true);
      }).timeout(1000),
    );
  });

  test.fails("timeout", async () => {
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 1000);
    }).timeout(500);
  });

  test("timeout with catch", async () => {
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 1000);
    })
      .timeout(500)
      .catch((error: unknown) => {
        if (error instanceof Error) {
          assert.equal(
            error.message,
            "Promise exceeded maximum execution time: 500 ms",
          );
        }
      });
  });
});
