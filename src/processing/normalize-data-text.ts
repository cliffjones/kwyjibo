export const normalizeDataText = (text: string) => {
  // Standardize line breaks.
  const newText = text.trim().replaceAll('\r', '');

  // If the data contains tab characters, convert it from compact mode.
  if (newText.includes('\t')) {
    return newText.replaceAll('\n', '\n\n').replaceAll('\t', '\n');
  }

  // If no lines have been skipped, take each line as its own separate item.
  if (!newText.includes('\n\n')) {
    return newText.replaceAll('\n', '\n\n');
  }

  return newText;
};
