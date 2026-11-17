import { BASE_URL, EMPTY_PRIVATE_FILES } from './constants';
import { isPrivateFilesResponse } from './is-private-files-response';
import { PathSegmentFiles, PrivateFiles } from './types';

export const resolvePrivateFiles = async (
  pathSegments: PathSegmentFiles[],
  tokens: string[],
): Promise<PrivateFiles> => {
  if (!pathSegments.length || !tokens.length) {
    return EMPTY_PRIVATE_FILES;
  }

  try {
    const response = await fetch(`${BASE_URL}private.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ segments: pathSegments, tokens }),
    });
    if (!response.ok) {
      throw new Error(`Unable to resolve private files: ${response.status}.`);
    }

    const result: unknown = await response.json();
    const segmentFiles = new Map(pathSegments.map(({ segment, files }) => [segment, files]));
    if (
      !isPrivateFilesResponse(result) ||
      result.segments.some((segment) => !segmentFiles.has(segment)) ||
      result.files.some(
        ({ segment, name }) => !result.segments.includes(segment) || !segmentFiles.get(segment)?.includes(name),
      )
    ) {
      throw new Error('Unable to resolve private files: invalid response.');
    }

    return {
      segments: new Set(result.segments),
      files: new Map(result.files.map(({ name, content }) => [name, content])),
    };
  } catch (error) {
    console.error('Unable to check private files; loading public files only.', error);
    return EMPTY_PRIVATE_FILES;
  }
};
