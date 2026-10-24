import { Fragment, type ReactNode } from 'react';
import { Image } from '../image';
import { Link } from '../link';
import {
  MD_DELIMS,
  MD_IMAGE_LINK_PATTERN,
  MD_IMAGE_PATTERN,
  MD_LINK_PATTERN,
  MD_LIST_ITEM_PATTERN
} from './constants';
import { isSafeUrl } from './is-safe-url';
import './style.scss';
import type { InlineToken } from './types';

export const Content = ({ text }: { text: string }) => {
  // Formatting variants are encoded as a suffix inside curly braces.
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

      // Preserve indentation after the line break, since HTML collapses regular spaces.
      let spaceCount = 2;
      if (part.startsWith('   ') && !part.startsWith('    ')) {
        spaceCount++;
      }
      console.log({ part, spaceCount, index });
      return (
        <Fragment key={key++}>
          {spaceCount === 2 ? <br /> : <div className="content-gap"></div>}
          {part.slice(spaceCount).replaceAll(' ', '\u00a0')}
        </Fragment>
      );
    });
  };

  const renderInline = (value: string): ReactNode[] => {
    const inlineTokens: InlineToken[] = [];
    let inlinePos = 0;
    let inlineStartingPos = inlinePos;

    while (inlinePos < value.length) {
      const imageLinkMatch = MD_IMAGE_LINK_PATTERN.exec(value.slice(inlinePos));
      if (imageLinkMatch) {
        const [, imageText, imageUrl, url, title] = imageLinkMatch;
        if (isSafeUrl(imageUrl) && isSafeUrl(url, true)) {
          if (inlinePos > inlineStartingPos) {
            inlineTokens.push({ type: 'text', text: value.slice(inlineStartingPos, inlinePos) });
          }
          inlineTokens.push({
            type: 'link',
            text: '',
            url: url.trim(),
            ...(title ? { title } : {}),
            image: { text: imageText, url: imageUrl.trim() }
          });
          inlinePos += imageLinkMatch[0].length;
          inlineStartingPos = inlinePos;
          continue;
        }
      }

      const imageMatch = MD_IMAGE_PATTERN.exec(value.slice(inlinePos));
      if (imageMatch) {
        const [match, label, url] = imageMatch;
        if (url && isSafeUrl(url)) {
          if (inlinePos > inlineStartingPos) {
            inlineTokens.push({ type: 'text', text: value.slice(inlineStartingPos, inlinePos) });
          }
          inlineTokens.push({ type: 'image', text: label, url: url.trim() });
          inlinePos += match.length;
          inlineStartingPos = inlinePos;
          continue;
        }
      }

      const linkMatch = MD_LINK_PATTERN.exec(value.slice(inlinePos));
      if (linkMatch) {
        const [match, label, url, title] = linkMatch;
        if (url && isSafeUrl(url, true)) {
          if (inlinePos > inlineStartingPos) {
            inlineTokens.push({ type: 'text', text: value.slice(inlineStartingPos, inlinePos) });
          }
          inlineTokens.push({
            type: 'link',
            text: label,
            url: url.trim(),
            ...(title ? { title } : {})
          });
          inlinePos += match.length;
          inlineStartingPos = inlinePos;
          continue;
        }
      }

      const delim = value[inlinePos];
      if (!Object.values(MD_DELIMS).includes(delim)) {
        inlinePos += 1;
        continue;
      }

      const closingPos = value.indexOf(delim, inlinePos + 1);
      const otherDelim = delim === MD_DELIMS.code ? MD_DELIMS.em : MD_DELIMS.code;
      const otherPos = delim === MD_DELIMS.em ? value.indexOf(otherDelim, inlinePos + 1) : -1;

      if (closingPos <= inlinePos + 1 || (otherPos !== -1 && otherPos < closingPos)) {
        inlinePos += 1;
        continue;
      }

      if (inlinePos > inlineStartingPos) {
        inlineTokens.push({ type: 'text', text: value.slice(inlineStartingPos, inlinePos) });
      }
      inlineTokens.push({
        type: delim === MD_DELIMS.code ? 'code' : 'em',
        text: value.slice(inlinePos + 1, closingPos)
      });
      inlinePos = closingPos + 1;
      inlineStartingPos = inlinePos;
    }

    if (inlineStartingPos < value.length) {
      inlineTokens.push({ type: 'text', text: value.slice(inlineStartingPos) });
    }

    return inlineTokens.flatMap(token => {
      if (token.type === 'image') {
        return <Image key={key++} src={token.url} alt={token.text} />;
      }

      const children = token.type === 'link' && token.image
        ? <Image src={token.image.url} alt={token.image.text} />
        : renderText(token.text);
      if (token.type === 'link') {
        return <Link key={key++} href={token.url} title={token.title}>{children}</Link>;
      }
      if (token.type === 'code') {
        return <code key={key++}>{children}</code>;
      }
      if (token.type === 'em') {
        return <em key={key++}>{children}</em>;
      }
      return children;
    });
  };

  const tokens: InlineToken[] = [];
  let pos = 0;
  let startingPos = pos;

  while (pos < newText.length) {
    const listItemMatch = MD_LIST_ITEM_PATTERN.exec(newText.slice(pos));
    if (listItemMatch) {
      const [match, value] = listItemMatch;
      if (value) {
        if (pos > startingPos) {
          tokens.push({ type: 'text', text: newText.slice(startingPos, pos) });
        }
        tokens.push({
          type: 'list-item',
          text: value.trim(),
        });
        pos += match.length;
        startingPos = pos;
        continue;
      }
    }

    pos += 1;
  }
  if (startingPos < newText.length) {
    tokens.push({ type: 'text', text: newText.slice(startingPos) });
  }

  const content: ReactNode[] = [];
  for (let index = 0; index < tokens.length; index += 1) {
    const token = tokens[index];
    if (token.type === 'list-item') {
      const items: ReactNode[] = [];
      while (tokens[index]?.type === 'list-item') {
        items.push(
          <li key={key++} className="content-list-item">
            {renderInline(tokens[index].text)}
          </li>
        );
        index += 1;
      }
      index -= 1;
      content.push(<ul key={key++} className="content-list">{items}</ul>);
    } else if (token.type === 'image') {
      content.push(<Image key={key++} src={token.url} alt={token.text} />);
    } else if (token.type === 'link') {
      const children = token.image
        ? <Image src={token.image.url} alt={token.image.text} />
        : renderText(token.text);
      content.push(<Link key={key++} href={token.url} title={token.title}>{children}</Link>);
    } else {
      content.push(...renderInline(token.text));
    }
  }

  return <div className={`content${variant ? ` content--${variant}` : ''}`}>{content}</div>;
};
