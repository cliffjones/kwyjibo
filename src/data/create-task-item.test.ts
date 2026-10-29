import { createTaskItem } from './create-task-item';

describe('createTaskItem', () => {
  it('infers a reminder type when there is no answer', () => {
    expect(createTaskItem({ task: 'Remember to hydrate.' }, 7)).toEqual({
      task: 'Remember to hydrate.',
      topic: '',
      type: 'reminder',
      solution: '',
      id: 7,
      rating: 0
    });
  });

  it('infers a question type when there is an answer', () => {
    expect(createTaskItem({ task: 'What is DNA?', solution: 'A hereditary molecule.' }, 9)).toEqual({
      task: 'What is DNA?',
      topic: '',
      type: 'question',
      solution: 'A hereditary molecule.',
      id: 9,
      rating: 0
    });
  });
});
