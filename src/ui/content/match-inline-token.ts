import {
  MD_DELIMS,
  MD_IMAGE_LINK_PATTERN,
  MD_IMAGE_PATTERN,
  MD_LINK_PATTERN
} from './constants';
import { isSafeUrl } from './is-safe-url';
import type { InlineMatch } from './types';

export const matchInlineToken = (value: string, position: number): InlineMatch | null => {
  const remainingText = value.slice(position);
  const imageLinkMatch = MD_IMAGE_LINK_PATTERN.exec(remainingText);
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

  const imageMatch = MD_IMAGE_PATTERN.exec(remainingText);
  if (imageMatch) {
    const [, label, url] = imageMatch;
    if (isSafeUrl(url)) {
      return {
        token: { type: 'image', text: label, url: url.trim() },
        length: imageMatch[0].length
      };
    }
  }

  const linkMatch = MD_LINK_PATTERN.exec(remainingText);
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
  if (!Object.values(MD_DELIMS).includes(delimiter)) {
    return null;
  }

  const closingPosition = value.indexOf(delimiter, position + 1);
  const otherDelimiter = delimiter === MD_DELIMS.code ? MD_DELIMS.em : MD_DELIMS.code;
  const otherPosition = delimiter === MD_DELIMS.em
    ? value.indexOf(otherDelimiter, position + 1)
    : -1;

  // Unmatched or crossing delimiters remain plain text instead of swallowing another span.
  if (closingPosition <= position + 1 || (otherPosition !== -1 && otherPosition < closingPosition)) {
    return null;
  }

  return {
    token: {
      type: delimiter === MD_DELIMS.code ? 'code' : 'em',
      text: value.slice(position + 1, closingPosition)
    },
    length: closingPosition - position + 1
  };
};
