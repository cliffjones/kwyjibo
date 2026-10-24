import { Fragment, type ReactNode } from 'react';
import { Image } from '../image';
import { Link } from '../link';
import { splitVariant } from './split-variant';
import './style.scss';
import { tokenizeContent } from './tokenize-content';
import { tokenizeInline } from './tokenize-inline';
import type { ContentToken, InlineToken } from './types';

// Converts runs of spaces into line breaks or gaps while preserving indentation.
const renderText = (value: string): ReactNode[] => {
  const lines = value.split(/( {2} *)/g);
  return lines.map((part, index) => {
    if (index % 2 === 0) {
      return part;
    }

    // Preserve indentation after the line break, since HTML collapses regular spaces.
    const spaceCount = part.startsWith('   ') && !part.startsWith('    ') ? 3 : 2;
    return (
      <Fragment key={index}>
        {spaceCount === 2 ? <br /> : <div className="content-gap"></div>}
        {part.slice(spaceCount).replaceAll(' ', '\u00a0')}
      </Fragment>
    );
  });
};

// Renders one parsed inline token as its corresponding element.
const renderInlineToken = (token: InlineToken, key: number): ReactNode => {
  if (token.type === 'image') {
    return <Image key={key} src={token.url} alt={token.text} />;
  }

  if (token.type === 'link') {
    const children = token.image
      ? <Image src={token.image.url} alt={token.image.text} />
      : renderText(token.text);
    return <Link key={key} href={token.url} title={token.title}>{children}</Link>;
  }

  const children = renderText(token.text);
  return token.type === 'code'
    ? <code key={key}>{children}</code>
    : token.type === 'em'
      ? <em key={key}>{children}</em>
      : children;
};

// Tokenizes and renders inline markup within a text segment.
const renderInline = (value: string): ReactNode[] =>
  tokenizeInline(value).map((token, index) => renderInlineToken(token, index));

// Renders text segments and groups consecutive list items into lists.
const renderContent = (tokens: ContentToken[]): ReactNode[] => {
  const content: ReactNode[] = [];
  let index = 0;

  while (index < tokens.length) {
    const token = tokens[index];
    if (token.type === 'text') {
      content.push(...renderInline(token.text));
      index += 1;
      continue;
    }

    const items: ReactNode[] = [];
    while (tokens[index]?.type === 'list-item') {
      const item = tokens[index];
      if (item.type === 'list-item') {
        items.push(
          <li key={items.length} className="content-list-item">
            {renderInline(item.text)}
          </li>
        );
      }
      index += 1;
    }
    content.push(<ul key={index} className="content-list">{items}</ul>);
  }

  return content;
};

export const Content = ({ text }: { text: string }) => {
  const { content, variant } = splitVariant(text);
  return (
    <div className={`content${variant ? ` content--${variant}` : ''}`}>
      {renderContent(tokenizeContent(content))}
    </div>
  );
};
