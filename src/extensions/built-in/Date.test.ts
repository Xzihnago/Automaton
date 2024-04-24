import { assert, describe, test } from "vitest";
import "./Date";

describe("Date", () => {
  const now = new Date();
  const testCases = [
    // Native parse
    ["2021-01-01 08:00:00", 0, new Date("2021-01-01T08:00:00.000Z")],
    ["2021-01-01 08:00:00", 1, new Date("2021-01-01T07:00:00.000Z")],
    ["2021-01-01 08:00:00", -1, new Date("2021-01-01T09:00:00.000Z")],
    ["2021-01-01 08:00:00", 8, new Date("2021-01-01T00:00:00.000Z")],
    ["2021-01-01 08:00:00", -8, new Date("2021-01-01T16:00:00.000Z")],
    ["2021-01-01 08:00:00", 12, new Date("2020-12-31T20:00:00.000Z")],
    ["2021-01-01 08:00:00", -12, new Date("2021-01-01T20:00:00.000Z")],

    ["2021-01-01 08:00", 0, new Date("2021-01-01T08:00:00.000Z")],
    ["2021-01-01 08:00", 1, new Date("2021-01-01T07:00:00.000Z")],
    ["2021-01-01 08:00", -1, new Date("2021-01-01T09:00:00.000Z")],
    ["2021-01-01 08:00", 8, new Date("2021-01-01T00:00:00.000Z")],
    ["2021-01-01 08:00", -8, new Date("2021-01-01T16:00:00.000Z")],
    ["2021-01-01 08:00", 12, new Date("2020-12-31T20:00:00.000Z")],
    ["2021-01-01 08:00", -12, new Date("2021-01-01T20:00:00.000Z")],

    ["2021-01-01", 0, new Date("2021-01-01T00:00:00.000Z")],
    ["2021-01-01", 1, new Date("2020-12-31T23:00:00.000Z")],
    ["2021-01-01", -1, new Date("2021-01-01T01:00:00.000Z")],
    ["2021-01-01", 8, new Date("2020-12-31T16:00:00.000Z")],
    ["2021-01-01", -8, new Date("2021-01-01T08:00:00.000Z")],
    ["2021-01-01", 12, new Date("2020-12-31T12:00:00.000Z")],
    ["2021-01-01", -12, new Date("2021-01-01T12:00:00.000Z")],

    // Custom parse
    ["01-01 08:00", 0, new Date(Date.UTC(now.getFullYear(), 0, 1, 8))],
    ["01-01 08:00", 1, new Date(Date.UTC(now.getFullYear(), 0, 1, 7))],
    ["01-01 08:00", -1, new Date(Date.UTC(now.getFullYear(), 0, 1, 9))],
    ["01-01 08:00", 8, new Date(Date.UTC(now.getFullYear(), 0, 1))],
    ["01-01 08:00", -8, new Date(Date.UTC(now.getFullYear(), 0, 1, 16))],
    ["01-01 08:00", 12, new Date(Date.UTC(now.getFullYear() - 1, 0, -1, 20))],
    ["01-01 08:00", -12, new Date(Date.UTC(now.getFullYear(), 0, 1, 20))],

    [
      "00:00",
      0,
      new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())),
    ],
    [
      "08:00",
      0,
      new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), 8)),
    ],
    [
      "08:00",
      1,
      new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), 7)),
    ],
    [
      "08:00",
      -1,
      new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), 9)),
    ],
    [
      "08:00",
      8,
      new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())),
    ],
    [
      "08:00",
      -8,
      new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), 16)),
    ],
    [
      "08:00",
      12,
      new Date(
        Date.UTC(now.getFullYear(), now.getMonth(), now.getDate() - 1, 20),
      ),
    ],
    [
      "08:00",
      -12,
      new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), 20)),
    ],

    [
      "0800",
      0,
      new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), 8)),
    ],
    [
      "0800",
      1,
      new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), 7)),
    ],
    [
      "0800",
      -1,
      new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), 9)),
    ],
    [
      "0800",
      8,
      new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())),
    ],
    [
      "0800",
      -8,
      new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), 16)),
    ],
    [
      "0800",
      12,
      new Date(
        Date.UTC(now.getFullYear(), now.getMonth(), now.getDate() - 1, 20),
      ),
    ],
    [
      "0800",
      -12,
      new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), 20)),
    ],
  ] as const;

  for (const [input, tz, expected] of testCases) {
    test("parseTime", () => {
      const actual = Date.tryParse(input, tz);
      assert.strictEqual(actual.toISOString(), expected.toISOString());
    });
  }
});
