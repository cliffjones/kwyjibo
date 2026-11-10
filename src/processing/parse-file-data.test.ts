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

  it('preserves all supported interface message properties in K-format config', () => {
    const config = {
      homeMessage: 'Home',
      lightModeMessage: 'Change theme',
      preloadedDataHeading: 'Decks',
      customDataHeading: 'Custom',
      startButton: 'Begin',
      revealButton: 'Show',
      resetButton: 'Restart',
      yesButton: 'Yes',
      noButton: 'No',
      ratingPrompt: 'How did you do?',
      ratingLabel1: 'One',
      ratingLabel2: 'Two',
      ratingLabel3: 'Three',
      ratingLabel4: 'Four',
      ratingLabel5: 'Five',
      ratingMessage: 'Rated:',
      noCardsMessage: 'No cards.',
      resultsMessage: 'Results',
    };

    expect(parseFileData(JSON.stringify(config))).toEqual([config]);
  });
});
