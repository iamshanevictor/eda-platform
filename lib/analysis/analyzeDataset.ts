import { UPLOAD_LIMITS } from "../security/upload-limits";

export interface AnalysisResult {
  summary_stats: Record<
    string,
    Record<string, number | string | { value: string; count: number }[]>
  >;
  missing_values: Record<string, number>;
  column_types: Record<string, string>;
  correlation_matrix: Record<string, Record<string, number>>;
}

export function analyzeDatasetData(
  csvData: Record<string, unknown>[],
): AnalysisResult {
  if (!csvData || csvData.length === 0) {
    throw new Error("No data provided for analysis");
  }

  const columns = Object.keys(csvData[0]);
  const summaryStats: AnalysisResult["summary_stats"] = {};
  const missingValues: AnalysisResult["missing_values"] = {};
  const columnTypes: AnalysisResult["column_types"] = {};
  const correlationMatrix: AnalysisResult["correlation_matrix"] = {};

  columns.forEach((column) => {
    correlationMatrix[column] = {};
    columns.forEach((otherColumn) => {
      correlationMatrix[column][otherColumn] = 0;
    });
  });

  columns.forEach((column) => {
    const nonNullValues = csvData
      .map((row) => row[column])
      .filter((value) => !isMissing(value));

    missingValues[column] = csvData.length - nonNullValues.length;

    if (nonNullValues.length === 0) {
      columnTypes[column] = "empty";
    } else {
      columnTypes[column] = inferColumnType(nonNullValues);
    }

    if (columnTypes[column] === "numeric") {
      const numericValues = nonNullValues
        .map((value) => Number(value))
        .filter((value) => !isNaN(value));

      if (numericValues.length > 0) {
        const sorted = [...numericValues].sort((a, b) => a - b);
        const sum = numericValues.reduce((acc, value) => acc + value, 0);
        const mean = sum / numericValues.length;
        const variance =
          numericValues.reduce(
            (acc, value) => acc + Math.pow(value - mean, 2),
            0,
          ) / numericValues.length;
        const stdDev = Math.sqrt(variance);

        summaryStats[column] = {
          count: numericValues.length,
          mean: round(mean),
          median: round(quantile(sorted, 0.5)),
          std_dev: round(stdDev),
          min: round(Math.min(...numericValues)),
          max: round(Math.max(...numericValues)),
          q1: round(quantile(sorted, 0.25)),
          q3: round(quantile(sorted, 0.75)),
          range: round(Math.max(...numericValues) - Math.min(...numericValues)),
        };
      }
    } else if (columnTypes[column] === "text") {
      const textValues = nonNullValues.map((value) => String(value));
      const uniqueValues = [...new Set(textValues)];
      const valueCounts: Record<string, number> = {};
      textValues.forEach((value) => {
        valueCounts[value] = (valueCounts[value] || 0) + 1;
      });

      summaryStats[column] = {
        count: textValues.length,
        unique_count: uniqueValues.length,
        most_common: Object.entries(valueCounts)
          .sort(([, countA], [, countB]) => countB - countA)
          .slice(0, 5)
          .map(([value, count]) => ({ value, count })),
        avg_length: Number(
          (
            textValues.reduce((acc, value) => acc + value.length, 0) /
            textValues.length
          ).toFixed(2),
        ),
      };
    } else if (columnTypes[column] === "boolean") {
      const booleanValues = nonNullValues.map((value) =>
        typeof value === "boolean" ? value : String(value).trim().toLowerCase() === "true",
      );
      const trueCount = booleanValues.filter((value) => value === true).length;

      summaryStats[column] = {
        count: booleanValues.length,
        true_count: trueCount,
        false_count: booleanValues.length - trueCount,
        true_percentage: round((trueCount / booleanValues.length) * 100, 2),
      };
    }
  });

  const numericColumns = columns.filter(
    (column) => columnTypes[column] === "numeric",
  ).slice(0, UPLOAD_LIMITS.maxCorrelationColumns);

  for (let i = 0; i < numericColumns.length; i++) {
    for (let j = i; j < numericColumns.length; j++) {
      const columnA = numericColumns[i];
      const columnB = numericColumns[j];

      if (columnA === columnB) {
        correlationMatrix[columnA][columnB] = 1;
      } else {
        const pairs = csvData.flatMap((row) => {
          const valueA = row[columnA];
          const valueB = row[columnB];
          return isNumericValue(valueA) && isNumericValue(valueB)
            ? [[Number(valueA), Number(valueB)] as const]
            : [];
        });
        const correlation = calculateCorrelation(
          pairs.map(([value]) => value),
          pairs.map(([, value]) => value),
        );
        const rounded = round(correlation);
        correlationMatrix[columnA][columnB] = rounded;
        correlationMatrix[columnB][columnA] = rounded;
      }
    }
  }

  return {
    summary_stats: summaryStats,
    missing_values: missingValues,
    column_types: columnTypes,
    correlation_matrix: correlationMatrix,
  };
}

function calculateCorrelation(x: number[], y: number[]): number {
  const n = Math.min(x.length, y.length);
  if (n < 2) return 0;

  const xSlice = x.slice(0, n);
  const ySlice = y.slice(0, n);

  const sumX = xSlice.reduce((acc, value) => acc + value, 0);
  const sumY = ySlice.reduce((acc, value) => acc + value, 0);
  const sumXY = xSlice.reduce(
    (acc, value, index) => acc + value * ySlice[index],
    0,
  );
  const sumX2 = xSlice.reduce((acc, value) => acc + value * value, 0);
  const sumY2 = ySlice.reduce((acc, value) => acc + value * value, 0);

  const numerator = n * sumXY - sumX * sumY;
  const denominator = Math.sqrt(
    (n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY),
  );

  return denominator === 0 ? 0 : numerator / denominator;
}

function isMissing(value: unknown): boolean {
  return value === null || value === undefined ||
    (typeof value === "string" && value.trim() === "");
}

function inferColumnType(values: unknown[]): string {
  if (values.every(isBooleanValue)) return "boolean";
  if (values.every(isNumericValue)) return "numeric";
  if (values.every(isIsoDateValue)) return "date";
  return "text";
}

function isBooleanValue(value: unknown): boolean {
  return typeof value === "boolean" ||
    (typeof value === "string" && /^(true|false)$/i.test(value.trim()));
}

function isNumericValue(value: unknown): boolean {
  if (typeof value === "boolean" || isMissing(value)) return false;
  if (typeof value === "number") return Number.isFinite(value);
  if (typeof value !== "string") return false;
  return Number.isFinite(Number(value.trim()));
}

function isIsoDateValue(value: unknown): boolean {
  if (value instanceof Date) return Number.isFinite(value.getTime());
  if (typeof value !== "string") return false;
  const normalized = value.trim();
  const dateOnly = /^(\d{4})-(\d{2})-(\d{2})$/.exec(normalized);
  if (dateOnly) {
    const year = Number(dateOnly[1]);
    const month = Number(dateOnly[2]);
    const day = Number(dateOnly[3]);
    const date = new Date(Date.UTC(year, month - 1, day));
    return date.getUTCFullYear() === year &&
      date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
  }
  return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d{1,3})?)?(?:Z|[+-]\d{2}:\d{2})$/.test(normalized) &&
    Number.isFinite(Date.parse(normalized));
}

function quantile(sorted: number[], probability: number): number {
  if (sorted.length === 1) return sorted[0];
  const position = (sorted.length - 1) * probability;
  const lower = Math.floor(position);
  const upper = Math.ceil(position);
  const weight = position - lower;
  return sorted[lower] + (sorted[upper] - sorted[lower]) * weight;
}

function round(value: number, digits = 4): number {
  const rounded = Number(value.toFixed(digits));
  return Object.is(rounded, -0) ? 0 : rounded;
}
