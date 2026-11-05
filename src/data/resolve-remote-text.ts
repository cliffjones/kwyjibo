import { isValidUrl } from './is-valid-url';
import { loadRemoteText } from './load-remote-text';

// Resolves any remote references in a data string, returning the combined text.
export const resolveRemoteText = async (text: string): Promise<string> => {
  const blocks = text
    .split(/\r?\n\r?\n/)
    .map(block => block.trim())
    .filter(Boolean);

  if (!blocks.length) {
    return text;
  }

  const resolvedBlocks: string[] = [];

  for (const block of blocks) {
    const lines = block.split(/\r?\n/).map(line => line.trim()).filter(Boolean);
    if (lines.length === 1 && isValidUrl(lines[0])) {
      const remoteText = await loadRemoteText(lines[0]);
      if (remoteText) {
        resolvedBlocks.push(remoteText);
      }
      continue;
    }

    resolvedBlocks.push(block);
  }

  return resolvedBlocks.join('\n\n');
};
