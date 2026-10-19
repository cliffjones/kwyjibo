import { Fragment, type ReactNode } from 'react';
import { Image } from '../../ui/image';
import { Link } from '../../ui/link';
import { DELIMS, LINK_PATTERN } from './constants';
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
    // Check specifically for links and images, which share virtually the same markup.
    const linkMatch = LINK_PATTERN.exec(newText.slice(pos));
    if (linkMatch) {
      const [, imageMarker, label, url, title] = linkMatch;
      const isImage = imageMarker === '!';

      if (url && isSafeUrl(url, isImage)) {
        if (pos > startingPos) {
          tokens.push({ type: 'text', text: newText.slice(startingPos, pos) });
        }
        tokens.push({
          type: isImage ? 'image' : 'link',
          text: label,
          url: url.trim(),
          ...(title === undefined ? {} : { title })
        });
        pos += linkMatch[0].length;
        startingPos = pos;
        continue;
      }
    }

    const delim = newText[pos];
    if (!(Object.values(DELIMS) as string[]).includes(delim)) {
      pos += 1;
      continue;
    }

    const closingPos = newText.indexOf(delim, pos + 1);
    const otherDelim = delim === DELIMS.code ? DELIMS.em : DELIMS.code;
    const otherPos = delim === DELIMS.em ? newText.indexOf(otherDelim, pos + 1) : -1;

    // Treat unmatched or crossing delimiters as plain text instead of swallowing another span.
    if (closingPos <= pos + 1 || (otherPos !== -1 && otherPos < closingPos)) {
      pos += 1;
      continue;
    }

    if (pos > startingPos) {
      tokens.push({ type: 'text', text: newText.slice(startingPos, pos) });
    }
    tokens.push({
      type: delim === DELIMS.code ? 'code' : 'em',
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
      result.push(<Image key={key++} src={token.url} alt={token.text} title={token.title} />);
      return result;
    }

    const children = renderText(token.text);
    if (token.type === 'text') {
      result.push(...children);
    } else if (token.type === 'link') {
      result.push(<Link key={key++} href={token.url} title={token.title}>{children}</Link>);
    } else {
      result.push(token.type === 'code'
        ? <code key={key++}>{children}</code>
        : <em key={key++}>{children}</em>);
    }
    return result;
  }, []);

  return <div className={`card-content${variant ? ` card-content--${variant}` : ''}`}>{content}</div>;
};
