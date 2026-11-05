import { K_DELIMS } from './constants';
import { isConfigData } from './is-config-data';
import { isTaskData } from './is-task-data';
import { normalizeDataText } from './normalize-data-text';
import { parseJson } from './parse-json';
import type { ConfigData, ResponseData, TaskData } from './types';

// Parses a K-format data string into a configuration object and an array of task objects.
export const parseFileData = (data: string): [ConfigData, ...TaskData[]] => {
  let newData = data.trim();
  let configData: ConfigData = {};

  // If the data looks like a JSON array, treat it as such.
  if (newData.startsWith('[')) {
    const parsedData = parseJson(newData);
    if (Array.isArray(parsedData) && parsedData.length) {
      if (isConfigData(parsedData[0])) {
        configData = parsedData.shift();
      }
      if (parsedData.every(isTaskData)) {
        return [configData, ...parsedData];
      }
    }
  }

  // If the data starts with a JSON object, parse that separately.
  if (newData.startsWith('{')) {
    const closingPos = /\}(?:[ \t]*)(?=\r?$)/m.exec(newData)?.index ?? -1;
    if (closingPos > 0) {
      const parsedObject = parseJson(newData.slice(0, closingPos + 1));
      if (isConfigData(parsedObject)) {
        configData = parsedObject;
        newData = newData.slice(closingPos + 1).trimStart();
      }
    }
  }

  // Break the remaining data down into blocks separated by blank lines.
  const blocks = normalizeDataText(newData)
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
    .filter((block) => block.length > 0);

  // Step through each block to process it as a task item.
  const items: TaskData[] = [];
  let topic = '';
  blocks.forEach((block) => {
    if (block.length === 1) {
      // Topic or reminder.
      if (block[0].startsWith(K_DELIMS.topic)) {
        topic = block[0].slice(1).trim();
      } else {
        items.push({ topic, task: block[0], solution: '' });
      }
    } else if (block.length === 2) {
      // Simple flashcard.
      items.push({ topic, task: block[0], solution: block[1] });
    } else if (block.length >= 3) {
      // Multiple-choice question.
      const responses: ResponseData[] = block.slice(1).map((text, index) => ({ text, value: index ? 1 : 5, order: 0 }));
      items.push({ topic, task: block[0], responses });
    }
  });

  return [configData, ...items];
};
