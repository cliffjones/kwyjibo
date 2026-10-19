import { Fragment, type ReactNode } from 'react';
import { DELIMS } from './constants';
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
    const children = renderText(token.text);
    if (token.type === 'text') {
      result.push(...children);
    } else {
      result.push(token.type === 'code'
        ? <code key={key++}>{children}</code>
        : <em key={key++}>{children}</em>);
    }
    return result;
  }, []);

  return <div className={`card-content${variant ? ` card-content--${variant}` : ''}`}>{content}</div>;
};
