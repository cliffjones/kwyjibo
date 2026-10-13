import { Fragment, type ReactNode } from 'react';

const DELIMS = {
  code: '`',
  em: '*'
} as const;

type InlineToken = {
  type: 'text' | 'code' | 'em';
  text: string;
};

export const parseCardContent = (text: string): ReactNode => {
  const tokens: InlineToken[] = [];
  let pos = 0;
  let startingPos = pos;

  while (pos < text.length) {
    const delim = text[pos];
    if (!(Object.values(DELIMS) as string[]).includes(delim)) {
      pos += 1;
      continue;
    }

    const closingPos = text.indexOf(delim, pos + 1);
    const otherDelim = delim === DELIMS.code ? DELIMS.em : DELIMS.code;
    const otherPos = delim === DELIMS.em ? text.indexOf(otherDelim, pos + 1) : -1;
    if (closingPos <= pos + 1 || (otherPos !== -1 && otherPos < closingPos)) {
      pos += 1;
      continue;
    }

    if (pos > startingPos) {
      tokens.push({ type: 'text', text: text.slice(startingPos, pos) });
    }
    tokens.push({
      type: delim === DELIMS.code ? 'code' : 'em',
      text: text.slice(pos + 1, closingPos)
    });
    pos = closingPos + 1;
    startingPos = pos;
  }

  if (startingPos < text.length) {
    tokens.push({ type: 'text', text: text.slice(startingPos) });
  }

  let multiLine = false;
  let key = 0;
  const renderText = (value: string): ReactNode[] =>
    value.split(/( {2} *)/g).map((part, index) => {
      if (index % 2 === 0) {
        return part;
      }

      multiLine = true;
      return (
        <Fragment key={key++}>
          <br />
          {part.slice(2).replaceAll(' ', '\u00a0')}
        </Fragment>
      );
    });

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

  return <div className={`card-content${multiLine ? ' card-content--multi-line' : ''}`}>{content}</div>;
};
