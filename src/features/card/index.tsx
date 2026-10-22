import type { ReactNode } from 'react';
import { getTextSize } from './get-text-size';
import { parseCardContent } from './parse-card-content';
import './style.scss';

export const Card = ({
  children,
  topic,
  message,
  content
}: {
  children?: ReactNode;
  topic?: string;
  message?: string;
  content?: string;
}) => (
  <section className="card">
    {message ? (
      <div className="card-message">{message}</div>
    ) : null}

    {content ? (
      <div style={{ fontSize: getTextSize(content) }}>
        {topic ? (
          <div className="card-topic">{topic}</div>
        ) : null}
        {parseCardContent(content)}
      </div>
    ) : null}

    {children}
  </section>
);
