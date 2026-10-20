export const parseJson = (text: string): unknown => {
  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text) ?? null;
  } catch (error) {
    console.error('Unable to parse JSON.', error);
  }

  return null;
};
