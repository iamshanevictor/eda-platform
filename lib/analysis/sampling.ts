export function deterministicSampleIndexes(
  totalRows: number,
  sampleSize: number,
): number[] {
  if (!Number.isInteger(totalRows) || totalRows < 0) {
    throw new Error("totalRows must be a non-negative integer");
  }
  if (!Number.isInteger(sampleSize) || sampleSize <= 0) {
    throw new Error("sampleSize must be a positive integer");
  }
  if (totalRows <= sampleSize) {
    return Array.from({ length: totalRows }, (_, index) => index);
  }
  if (sampleSize === 1) return [0];

  return Array.from({ length: sampleSize }, (_, index) =>
    Math.floor((index * (totalRows - 1)) / (sampleSize - 1)),
  );
}

export function deterministicSampleRows<T>(rows: T[], sampleSize: number): T[] {
  return deterministicSampleIndexes(rows.length, sampleSize).map(
    (index) => rows[index],
  );
}
