import { selectAvailableTopics } from './select-available-topics';

describe('selectAvailableTopics', () => {
  it('returns a unique, alphabetized list of topics or fallback task text', () => {
    const state = {
      kwyjibo: {
        items: [
          { topic: 'Science', task: 'Gravity question', solution: 'Answer', responses: [], rating: 0 },
          { topic: '', task: 'Zebra question', solution: 'Answer', responses: [], rating: 0 },
          { topic: 'Science', task: 'Another gravity question', solution: 'Answer', responses: [], rating: 0 },
          { topic: 'Math', task: 'Arithmetic question', solution: 'Answer', responses: [], rating: 0 },
        ],
      },
    } as any;

    expect(selectAvailableTopics(state)).toEqual(['Math', 'Science', 'Zebra question']);
  });
});
