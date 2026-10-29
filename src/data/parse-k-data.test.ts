import { parseKData } from './parse-k-data';

describe('parseKData', () => {
  it('parses array-based config and task data', () => {
    expect(parseKData('[{"title":"Example"}, {"task":"Question?","solution":"Answer"}, {"task":"Next?"}]')).toEqual([
      { title: 'Example' },
      { task: 'Question?', solution: 'Answer' },
      { task: 'Next?' }
    ]);
  });

  it('parses topic markers and multi-line block data', () => {
    expect(parseKData('# Science\n\nWhat is gravity?\nA force that pulls objects together.')).toEqual([
      {},
      { topic: 'Science', task: 'What is gravity?', solution: 'A force that pulls objects together.' }
    ]);

    expect(parseKData('{\n  "heading": "Welcome"\n}\n# Math\n\n2 + 2\n4')).toEqual([
      { heading: 'Welcome' },
      { topic: 'Math', task: '2 + 2', solution: '4' }
    ]);
  });
});
