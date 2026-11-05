import { isLineConfigData } from './is-line-config-data';
import { parseJson } from './parse-json';
import { LineConfigData } from './types';

export const extractLineConfig = (text: string): { config: LineConfigData | null; content: string } => {
  const basicOutput = { config: null, content: text };
  if (!text.startsWith('{')) {
    return basicOutput;
  }

  const suffixPosition = text.indexOf('}');
  if (suffixPosition < 1) {
    return basicOutput;
  }

  const config = parseJson(text.slice(0, suffixPosition + 1));
  if (!isLineConfigData(config)) {
    return basicOutput;
  }

  return { config, content: text.slice(suffixPosition + 1).trimStart() };
};
