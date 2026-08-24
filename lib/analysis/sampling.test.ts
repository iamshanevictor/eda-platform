import { describe, expect, it } from "vitest";

import { deterministicSampleIndexes, deterministicSampleRows } from "./sampling";

describe("deterministic sampling", () => {
  it("returns all rows when the requested sample covers the input", () => {
    expect(deterministicSampleRows(["a", "b"], 3)).toEqual(["a", "b"]);
  });

  it("is stable, evenly spaced, and includes both endpoints", () => {
    expect(deterministicSampleIndexes(10, 4)).toEqual([0, 3, 6, 9]);
    expect(deterministicSampleIndexes(10, 4)).toEqual([0, 3, 6, 9]);
  });

  it("rejects invalid dimensions", () => {
    expect(() => deterministicSampleIndexes(-1, 1)).toThrow();
    expect(() => deterministicSampleIndexes(1, 0)).toThrow();
  });
});
