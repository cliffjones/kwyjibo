import type { ReactNode } from 'react';
import { getTextSize } from './get-text-size';
import { parseCardContent } from './parse-card-content';
import './style.scss';

export const Card = ({
  children,
  topic,
  content,
  message
}: {
  children?: ReactNode;
  topic?: string;
  content?: string;
  message?: string;
}) => (
  <section className="card">
    {content ? (
      <div style={{ fontSize: getTextSize(content) }}>
        {topic ? (
          <div className="card-topic">{topic}</div>
        ) : null}
        {parseCardContent(content)}
      </div>
    ) : null}

    {message ? (
      <div className="card-message">{message}</div>
    ) : null}

    {children}
  </section>
);
