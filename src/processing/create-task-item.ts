import { ITEM_TYPES } from './constants';
import { isPlainObject } from './is-plain-object';
import { parseJson } from './parse-json';
import type { TaskData, TaskItem } from './types';

export const createTaskItem = (item: TaskData, id: number): TaskItem => {
  const topic = item.topic ?? '';
  let solution = item.solution ?? '';
  let inputConfig: unknown = null;
  if (solution.endsWith('}')) {
    const inputPos = solution.lastIndexOf('{');
    if (inputPos != -1) {
      inputConfig = parseJson(solution.slice(inputPos));
      if (isPlainObject(inputConfig)) {
        solution = solution.slice(0, inputPos).trim();
      } else {
        inputConfig = null;
      }
    }
  }
  const responses = item.responses ?? [];

  // If a type was specified, trust it. Otherwise, infer it from the data.
  let type = item.type ?? '';
  if (!type) {
    type = inputConfig
      ? ITEM_TYPES.input
      : responses.length
        ? ITEM_TYPES.quiz
        : solution
          ? ITEM_TYPES.question
          : ITEM_TYPES.reminder;
  }

  /** @todo: Make use of `inputConfig` to allow different types of input. */
  return {
    ...item,
    id,
    topic,
    type,
    solution,
    responses,
    rating: 0,
  };
};
