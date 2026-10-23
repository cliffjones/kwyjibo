import { TaskData } from "./types";

export const createTaskItem = (item: TaskData, id: number) => {
  const topic = ('topic' in item ? item.topic : '') ?? '';
  let type = ('type' in item ? item.type : '') ?? '';
  const solution = ('solution' in item ? item.solution : '') ?? '';
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
