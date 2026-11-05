import { isValidUrl } from './is-valid-url';

// Determines whether a given data string contains a remote reference in its own block.
export const hasRemoteBlock = (text: string): boolean => {
  const blocks = text
    .split(/\r?\n\r?\n/)
    .map((block) => block.trim())
    .filter(Boolean);

  return blocks.some((block) => {
    const lines = block
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);
    return lines.length === 1 && isValidUrl(lines[0]);
  });
};
