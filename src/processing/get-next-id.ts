// Returns the next ID in an already sorted/shuffled list.
export const getNextId = (
  ids: number[],
  previousId?: number | null
): number | null => {
  if (!ids.length) {
    return null;
  }

  if (previousId == null) {
    return ids[0];
  }

  const currentIndex = ids.indexOf(previousId);
  if (currentIndex === -1) {
    return null;
  }

  const nextIndex = currentIndex + 1;
  if (nextIndex >= ids.length) {
    return null;
  }

  return ids[nextIndex];
};
