import { CONTENT_DELIMS, CONTENT_IMAGE_LINK_PATTERN, CONTENT_IMAGE_PATTERN, CONTENT_LINK_PATTERN } from './constants';
import { isSafeUrl } from './is-safe-url';
import type { InlineMatch } from './types';

export const matchInlineToken = (value: string, position: number): InlineMatch | null => {
  const remainingText = value.slice(position);
  const imageLinkMatch = CONTENT_IMAGE_LINK_PATTERN.exec(remainingText);
  if (imageLinkMatch) {
    const [, imageText, imageUrl, url, title] = imageLinkMatch;
    if (isSafeUrl(imageUrl) && isSafeUrl(url, true)) {
      return {
        token: {
          type: 'link',
          text: '',
          url: url.trim(),
          ...(title ? { title } : {}),
          image: { text: imageText, url: imageUrl.trim() },
        },
        length: imageLinkMatch[0].length,
      };
    }
  }

  const imageMatch = CONTENT_IMAGE_PATTERN.exec(remainingText);
  if (imageMatch) {
    const [, label, url] = imageMatch;
    if (isSafeUrl(url)) {
      return {
        token: { type: 'image', text: label, url: url.trim() },
        length: imageMatch[0].length,
      };
    }
  }

  const linkMatch = CONTENT_LINK_PATTERN.exec(remainingText);
  if (linkMatch) {
    const [, label, url, title] = linkMatch;
    if (isSafeUrl(url, true)) {
      return {
        token: {
          type: 'link',
          text: label,
          url: url.trim(),
          ...(title ? { title } : {}),
        },
        length: linkMatch[0].length,
      };
    }
  }

  const delimiter = value[position];
  if (!Object.values(CONTENT_DELIMS).includes(delimiter)) {
    return null;
  }

  const closingPosition = value.indexOf(delimiter, position + 1);
  const firstOtherPosition = delimiter === CONTENT_DELIMS.code
    ? Number.POSITIVE_INFINITY
    : Math.min(
      ...Object.values(CONTENT_DELIMS)
        .filter((otherDelimiter) => otherDelimiter !== delimiter)
        .map((otherDelimiter) => value.indexOf(otherDelimiter, position + 1))
        .filter((otherPosition) => otherPosition !== -1),
      Number.POSITIVE_INFINITY,
    );

  // Unmatched or crossing delimiters remain plain text instead of swallowing another span.
  if (closingPosition <= position + 1 || firstOtherPosition < closingPosition) {
    return null;
  }

  return {
    token: {
      type: delimiter === CONTENT_DELIMS.code ? 'code' : delimiter === CONTENT_DELIMS.em ? 'em' : 'strong',
      text: value.slice(position + 1, closingPosition),
    },
    length: closingPosition - position + 1,
  };
};
