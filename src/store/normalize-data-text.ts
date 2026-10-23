export const normalizeDataText = (data: string) => {
  const normalData = data.replaceAll('\r', '');

  if (!normalData.includes('\t')) {
    return normalData;
  }

  // If the data contains tab characters, convert it from compact mode.
  return normalData.replaceAll('\n', '\n\n').replaceAll('\t', '\n');
};
