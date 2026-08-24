import { describe, expect, it } from "vitest";

import { analyzeDatasetData } from "./analyzeDataset";

describe("analyzeDatasetData", () => {
  it("rejects an empty dataset", () => {
    expect(() => analyzeDatasetData([])).toThrow(
      "No data provided for analysis",
    );
  });

  it("uses population deviation and interpolated R-7 quartiles", () => {
    const result = analyzeDatasetData([
      { value: 1 },
      { value: 2 },
      { value: 3 },
      { value: 4 },
      { value: "" },
    ]);

    expect(result.column_types.value).toBe("numeric");
    expect(result.missing_values.value).toBe(1);
    expect(result.summary_stats.value).toEqual({
      count: 4,
      mean: 2.5,
      median: 2.5,
      std_dev: 1.118,
      min: 1,
      max: 4,
      q1: 1.75,
      q3: 3.25,
      range: 3,
    });
  });

  it("uses all non-missing values for type inference", () => {
    const result = analyzeDatasetData([
      { mixed: "1" },
      { mixed: "not-a-number" },
      { mixed: "2" },
    ]);

    expect(result.column_types.mixed).toBe("text");
    expect(result.missing_values.mixed).toBe(0);
    expect(result.summary_stats.mixed.count).toBe(3);
  });

  it("classifies native and textual booleans before numeric values", () => {
    const result = analyzeDatasetData([
      { enabled: true },
      { enabled: "false" },
      { enabled: false },
    ]);

    expect(result.column_types.enabled).toBe("boolean");
    expect(result.summary_stats.enabled).toEqual({
      count: 3,
      true_count: 1,
      false_count: 2,
      true_percentage: 33.33,
    });
  });

  it("requires consistent ISO dates instead of broad date parsing", () => {
    const result = analyzeDatasetData([
      { observedAt: "2025-10-07" },
      { observedAt: "2025-10-08T12:30:00Z" },
    ]);

    expect(result.column_types.observedAt).toBe("date");
    expect(result.summary_stats.observedAt).toBeUndefined();

    const broadDate = analyzeDatasetData([{ value: "January 1, 2025" }]);
    expect(broadDate.column_types.value).toBe("text");

    const mixedDate = analyzeDatasetData([
      { value: "2025-10-07" },
      { value: "not-a-date" },
    ]);
    expect(mixedDate.column_types.value).toBe("text");
  });

  it("preserves row alignment for pairwise-complete correlation", () => {
    const result = analyzeDatasetData([
      { x: 1, y: undefined },
      { x: 2, y: 20 },
      { x: undefined, y: 30 },
      { x: 4, y: 10 },
    ]);

    expect(result.correlation_matrix.x.y).toBe(-1);
    expect(result.correlation_matrix.y.x).toBe(-1);
    expect(result.correlation_matrix.x.x).toBe(1);
    expect(result.correlation_matrix.y.y).toBe(1);
  });

  it("returns zero correlation for constant or insufficient pairs", () => {
    const result = analyzeDatasetData([
      { constant: 1, single: "" },
      { constant: 1, single: 2 },
    ]);

    expect(result.correlation_matrix.constant.single).toBe(0);
    expect(result.correlation_matrix.single.constant).toBe(0);
  });

  it("bounds correlation work to the configured numeric-column limit", () => {
    const row = Object.fromEntries(
      Array.from({ length: 31 }, (_, index) => [`column_${index}`, index + 1]),
    );
    const result = analyzeDatasetData([row, row]);

    expect(result.column_types.column_30).toBe("numeric");
    expect(result.correlation_matrix.column_29.column_29).toBe(1);
    expect(result.correlation_matrix.column_30.column_30).toBe(0);
  });
});
