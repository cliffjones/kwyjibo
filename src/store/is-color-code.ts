// Determines whether a given value is a hexadecimal color code.
export const isColorCode = (value: unknown): value is string =>
  typeof value === 'string' && /^#[\da-f]{6}$/i.test(value);
