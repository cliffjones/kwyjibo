import type { QuizItem } from './types';

// Returns a random ID from the list, weighted by confidence. Lower ratings are more likely chosen.
export const getRandomId = (
  ids: number[],
  items: QuizItem[],
  previousId?: number | null
): number => {
  const choices = ids.filter(id => id !== previousId);
  const candidates = choices.length ? choices : ids;
  const weights = [5, 4, 3, 2, 1];
  const weightedCandidates = candidates.map(id => {
    const confidence = items.find(question => question.id === id)?.confidence ?? 0;
    return { id, weight: weights[confidence] ?? weights[0] };
  });
  const totalWeight = weightedCandidates.reduce(
    (total, candidate) => total + candidate.weight,
    0
  );
  let selection = Math.random() * totalWeight;
  for (const candidate of weightedCandidates) {
    selection -= candidate.weight;
    if (selection < 0) {
      return candidate.id;
    }
  }
  return candidates[candidates.length - 1];
};
