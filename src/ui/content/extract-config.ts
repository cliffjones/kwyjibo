import { parseJson } from "../../data/parse-json";

export const extractConfig = (text: string): { config: unknown; content: string } => {
  if (!text.startsWith('{')) {
    return { config: null, content: text };
  }

  const suffixPosition = text.indexOf('}');
  return suffixPosition < 1
    ? { config: null, content: text }
    : {
      config: parseJson(text.slice(0, suffixPosition + 1)),
      content: text.slice(suffixPosition + 1).trimStart(),
    };
};
