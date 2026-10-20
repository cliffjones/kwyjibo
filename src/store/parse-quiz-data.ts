import { isQuizData } from './is-quiz-data';
import { isQuizSettings } from './is-quiz-settings';
import { parseJson } from './parse-json';
import { QuizData, QuizSettings } from './types';

const normalizeData = (data: string) => {
  const normalData = data.replaceAll('\r', '');

  if (!normalData.includes('\t')) {
    return normalData;
  }

  // If the data contains tab characters, convert it from compact mode.
  return normalData.replaceAll('\n', '\n\n').replaceAll('\t', '\n');
};

/** @todo: Each item returned can be QuizSettings or QuizData. Maybe make a parent type and make tasks a third subtype. */
export const parseQuizData = (data: string): QuizData[] => {
  let newData = data.trim();
  let quizSettings: QuizSettings = {};

  // If the data looks like a JSON array, treat it as such.
  if (newData.startsWith('[')) {
    const parsedData = parseJson(newData);
    if (Array.isArray(parsedData) && parsedData.length) {
      if (isQuizSettings(parsedData[0])) {
        quizSettings = parsedData.shift();
      }
      if (parsedData.every(isQuizData)) {
        return parsedData;
      }
    }
  }

  // If the data starts with a JSON object, parse that separately.
  if (newData.startsWith('{')) {
    const closingPos = newData.indexOf('}');
    if (closingPos > 0) {
      const parsedObject = parseJson(newData.slice(0, closingPos + 1));
      if (isQuizSettings(parsedObject)) {
        quizSettings = parsedObject;
        newData = newData.slice(closingPos + 1).trimStart();
      }
    }
  }

  // Break the remaining data down into blocks separated by blank lines.
  const blocks = normalizeData(newData)
    .split('\n')
    .reduce<string[][]>((result, line) => {
      if (line.trim() === '') {
        if (result[result.length - 1]?.length) {
          result.push([]);
        }
      } else {
        if (result.length === 0) {
          result.push([]);
        }
        result[result.length - 1].push(line.trim());
      }
      return result;
    }, [])
    .filter(block => block.length > 0);

  // Process each block, using the number of lines in each to determine its type.
  const items: QuizData[] = [];
  let topic = '';
  blocks.forEach((block) => {
    if (block.length === 1) {
      topic = block[0];
    } else {
      items.push({ topic, question: block[0], answer: block[1] });
    }
  });

  return items;
};
