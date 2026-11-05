import { parseFileData } from './parse-file-data';

describe('parseFileData', () => {
  it('parses array-based config and task data', () => {
    expect(parseFileData('[{"title":"Example"}, {"task":"Question?","solution":"Answer"}, {"task":"Next?"}]')).toEqual([
      { title: 'Example' },
      { task: 'Question?', solution: 'Answer' },
      { task: 'Next?' },
    ]);
  });

  it('parses topic markers and multi-line block data', () => {
    expect(parseFileData('# Science\n\nWhat is gravity?\nA force that pulls objects together.')).toEqual([
      {},
      { topic: 'Science', task: 'What is gravity?', solution: 'A force that pulls objects together.' },
    ]);

    expect(parseFileData('{\n  "heading": "Welcome"\n}\n# Math\n\n2 + 2\n4')).toEqual([
      { heading: 'Welcome' },
      { topic: 'Math', task: '2 + 2', solution: '4' },
    ]);
  });
});
