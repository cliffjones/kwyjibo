import type { TaskData, TaskItem } from './types';

export const createTaskItem = (item: TaskData, id: number): TaskItem => {
  const topic = item.topic ?? '';
  let type = item.type ?? '';
  const solution = item.solution ?? '';
  const responses = item.responses ?? [];
  if (!type) {
    type = responses.length ? 'quiz' : solution ? 'question' : 'reminder';
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
