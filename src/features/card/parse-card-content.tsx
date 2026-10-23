import { Fragment, type ReactNode } from 'react';
import { Image } from '../../ui/image';
import { Link } from '../../ui/link';
import { MD_DELIMS, MD_IMAGE_PATTERN, MD_LINK_PATTERN } from './constants';
import { isSafeUrl } from './is-safe-url';
import type { InlineToken } from './types';

// Converts a given string of Kwyjibo data into a node formatted for display.
export const parseCardContent = (text: string): ReactNode => {
  // Look for formatting details tacked onto the end inside curly braces.
  let newText = text;
  let variant = '';
  if (newText.endsWith('}')) {
    const suffixPos = newText.lastIndexOf('{');
    if (suffixPos > -1) {
      variant = newText.slice(suffixPos + 1, -1);
      newText = newText.slice(0, suffixPos);
    }
  }

  let key = 0;
  const renderText = (value: string): ReactNode[] => {
    const lines = value.split(/( {2} *)/g);
    return lines.map((part, index) => {
      if (index % 2 === 0) {
        return part;
      }

      // Preserve indentation after the line break. HTML would otherwise collapse these spaces.
      return (
        <Fragment key={key++}>
          <br />
          {part.slice(2).replaceAll(' ', '\u00a0')}
        </Fragment>
      );
    });
  };

  const tokens: InlineToken[] = [];
  let pos = 0;
  let startingPos = pos;

  // Step through the text using delimiters to split it into a set of tokens.
  while (pos < newText.length) {
    // Check for an image tag to convert.
    const imageMatch = MD_IMAGE_PATTERN.exec(newText.slice(pos));
    if (imageMatch) {
      const [match, label, url] = imageMatch;
      if (url && isSafeUrl(url)) {
        if (pos > startingPos) {
          tokens.push({ type: 'text', text: newText.slice(startingPos, pos) });
        }
        tokens.push({
          type: 'image',
          text: label,
          url: url.trim(),
        });
        pos += match.length;
        startingPos = pos;
        continue;
      }
    }

    // Check for a link tag to convert.
    const linkMatch = MD_LINK_PATTERN.exec(newText.slice(pos));
    if (linkMatch) {
      const [match, label, url, title] = linkMatch;
      if (url && isSafeUrl(url, true)) {
        if (pos > startingPos) {
          tokens.push({ type: 'text', text: newText.slice(startingPos, pos) });
        }
        tokens.push({
          type: 'link',
          text: label,
          url: url.trim(),
          ...(title ? { title } : {})
        });
        pos += match.length;
        startingPos = pos;
        continue;
      }
    }

    // If no delimiter is found, move along.
    const delim = newText[pos];
    if (!Object.values(MD_DELIMS).includes(delim)) {
      pos += 1;
      continue;
    }

    const closingPos = newText.indexOf(delim, pos + 1);
    const otherDelim = delim === MD_DELIMS.code ? MD_DELIMS.em : MD_DELIMS.code;
    const otherPos = delim === MD_DELIMS.em ? newText.indexOf(otherDelim, pos + 1) : -1;

    // Treat unmatched or crossing delimiters as plain text instead of swallowing another span.
    if (closingPos <= pos + 1 || (otherPos !== -1 && otherPos < closingPos)) {
      pos += 1;
      continue;
    }

    if (pos > startingPos) {
      tokens.push({ type: 'text', text: newText.slice(startingPos, pos) });
    }
    tokens.push({
      type: delim === MD_DELIMS.code ? 'code' : 'em',
      text: newText.slice(pos + 1, closingPos)
    });
    pos = closingPos + 1;
    startingPos = pos;
  }
  if (startingPos < newText.length) {
    tokens.push({ type: 'text', text: newText.slice(startingPos) });
  }

  // Stitch all the tokens back together with markup added based on their types.
  const content: ReactNode[] = tokens.reduce<ReactNode[]>((result, token) => {
    if (token.type === 'image') {
      result.push(<Image key={key++} src={token.url} alt={token.text} />);
      return result;
    }

    const children = renderText(token.text);
    if (token.type === 'link') {
      result.push(<Link key={key++} href={token.url} title={token.title}>{children}</Link>);
    } else if (token.type === 'code') {
      result.push(<code key={key++}>{children}</code>);
    } else if (token.type === 'em') {
      result.push(<em key={key++}>{children}</em>);
    } else {
      result.push(...children);
    }
    return result;
  }, []);

  return <div className={`card-content${variant ? ` card-content--${variant}` : ''}`}>{content}</div>;
};
