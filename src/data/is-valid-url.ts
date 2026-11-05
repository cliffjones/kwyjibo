// Determines whether a given string is a valid HTTPS URL that can be accessed.
export const isValidUrl = (value: string): boolean => {
  try {
    const parsedUrl = new URL(value);
    return parsedUrl.protocol === 'https:';
  } catch {
    return false;
  }
};
