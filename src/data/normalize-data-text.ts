export const normalizeDataText = (text: string) => {
  const newText = text.replaceAll('\r', '');

  if (!newText.includes('\t')) {
    return newText;
  }

  // If the data contains tab characters, convert it from compact mode.
  return newText.replaceAll('\n', '\n\n').replaceAll('\t', '\n');
};
