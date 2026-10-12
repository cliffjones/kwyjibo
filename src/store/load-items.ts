import { DATA_PATH } from './constants';
import { isQuizData } from './is-quiz-data';
import { parseQuizData } from './parse-quiz-data';
import type { QuizItem } from './types';

export const loadItems = async (path = '/'): Promise<QuizItem[]> => {
  const pathSegments = path.split('/').filter(Boolean);
  const files = [...new Set(pathSegments.flatMap(segment => {
    let stem: string;
    try {
      stem = decodeURIComponent(segment);
    } catch {
      return [];
    }

    if (!stem || stem === '.' || stem === '..' || /[\\/]/.test(stem)) {
      return [];
    }

    return [`${stem}.kwyz`];
  }))];

  const itemGroups = await Promise.all(
    files.map(async file => {
      const response = await fetch(`${DATA_PATH}${encodeURIComponent(file)}`);
      if (response.status === 403 || response.status === 404) {
        return [];
      }

      if (!response.ok) {
        throw new Error(`Unable to load ${file}: ${response.status}`);
      }

      const data = await response.text();
      if (
        response.headers.get('content-type')?.includes('text/html')
        || /^\s*(?:<!doctype\s+html|<html\b)/i.test(data)
      ) {
        return [];
      }

      return parseQuizData(data);
    })
  );

  return itemGroups.flat().filter(isQuizData).map((item, index) => ({
    ...item,
    id: index,
    topic: item.topic ?? '',
    confidence: 0
  }));
};
