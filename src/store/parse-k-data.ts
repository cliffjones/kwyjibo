import { isConfigData } from './is-config-data';
import { isQuizData } from './is-quiz-data';
import { isTaskData } from './is-task-data';
import { parseJson } from './parse-json';
import { ConfigData, KData } from './types';

const normalizeData = (data: string) => {
  const normalData = data.replaceAll('\r', '');

  if (!normalData.includes('\t')) {
    return normalData;
  }

  // If the data contains tab characters, convert it from compact mode.
  return normalData.replaceAll('\n', '\n\n').replaceAll('\t', '\n');
};

export const parseKData = (data: string): [ConfigData, ...KData[]] => {
  let newData = data.trim();
  let configData: ConfigData = {};

  // If the data looks like a JSON array, treat it as such.
  if (newData.startsWith('[')) {
    const parsedData = parseJson(newData);
    if (Array.isArray(parsedData) && parsedData.length) {
      if (isConfigData(parsedData[0])) {
        configData = parsedData.shift();
      }
      if (parsedData.every((item) => isQuizData(item) || isTaskData(item))) {
        return [configData, ...parsedData];
      }
    }
  }

  // If the data starts with a JSON object, parse that separately.
  if (newData.startsWith('{')) {
    const closingPos = newData.indexOf('}');
    if (closingPos > 0) {
      const parsedObject = parseJson(newData.slice(0, closingPos + 1));
      if (isConfigData(parsedObject)) {
        configData = parsedObject;
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

  const items: KData[] = [];
  let topic = '';
  blocks.forEach((block) => {
    if (block.length === 1) {
      /** @todo: Look at the first character here to distinguish tasks from topics. */
      topic = block[0];
    } else {
      items.push({ topic, task: block[0], solution: block[1] });
    }
  });

  return [configData, ...items];
};
