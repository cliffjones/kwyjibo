import type { TaskData, TaskItem } from './types';

export const createTaskItem = (item: TaskData, id: number): TaskItem => {
  const topic = item.topic ?? '';
  let type = item.type ?? '';
  const solution = item.solution ?? '';
  if (!type) {
    type = solution ? 'question' : 'reminder';
  }
  return {
    ...item,
    id,
    topic,
    type,
    solution,
    confidence: 0
  };
};
