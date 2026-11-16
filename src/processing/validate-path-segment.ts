// Returns either a valid path segment or an empty string.
export const validatePathSegment = (segment: string): string => {
  let stem: string;
  try {
    stem = decodeURIComponent(segment);
  } catch {
    return '';
  }

  // Disallow any characters with a special meaning in the system.
  if (!stem || /[.\\/]/.test(stem)) {
    return '';
  }

  return stem;
};
