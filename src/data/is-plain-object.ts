export const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  value != null
  && typeof value === 'object'
  && Object.getPrototypeOf(value) === Object.prototype;
