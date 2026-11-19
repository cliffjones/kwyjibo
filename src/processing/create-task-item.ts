import { ITEM_TYPES } from './constants';
import type { TaskData, TaskItem } from './types';

export const createTaskItem = (item: TaskData, id: number): TaskItem => {
  const topic = item.topic ?? '';
  let type = item.type ?? '';
  const solution = item.solution ?? '';
  const responses = item.responses ?? [];
  if (!type) {
    type = responses.length ? ITEM_TYPES.quiz : solution ? ITEM_TYPES.question : ITEM_TYPES.reminder;
  }
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
