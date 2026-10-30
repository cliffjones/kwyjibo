import {
  CONTENT_DELIMS,
  CONTENT_IMAGE_LINK_PATTERN,
  CONTENT_IMAGE_PATTERN,
  CONTENT_LINK_PATTERN
} from './constants';
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
          image: { text: imageText, url: imageUrl.trim() }
        },
        length: imageLinkMatch[0].length
      };
    }
  }

  const imageMatch = CONTENT_IMAGE_PATTERN.exec(remainingText);
  if (imageMatch) {
    const [, label, url] = imageMatch;
    if (isSafeUrl(url)) {
      return {
        token: { type: 'image', text: label, url: url.trim() },
        length: imageMatch[0].length
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
          ...(title ? { title } : {})
        },
        length: linkMatch[0].length
      };
    }
  }

  const delimiter = value[position];
  if (!Object.values(CONTENT_DELIMS).includes(delimiter)) {
    return null;
  }

  const closingPosition = value.indexOf(delimiter, position + 1);
  const otherDelimiter = delimiter === CONTENT_DELIMS.code ? CONTENT_DELIMS.em : CONTENT_DELIMS.code;
  const otherPosition = delimiter === CONTENT_DELIMS.em
    ? value.indexOf(otherDelimiter, position + 1)
    : -1;

  // Unmatched or crossing delimiters remain plain text instead of swallowing another span.
  if (closingPosition <= position + 1 || (otherPosition !== -1 && otherPosition < closingPosition)) {
    return null;
  }

  return {
    token: {
      type: delimiter === CONTENT_DELIMS.code ? 'code' : 'em',
      text: value.slice(position + 1, closingPosition)
    },
    length: closingPosition - position + 1
  };
};
