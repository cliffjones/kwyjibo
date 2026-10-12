import type { ReactNode } from 'react';
import { getTextSize } from './get-text-size';
import { parseCardContent } from './parse-card-content';
import './style.scss';

type CardProps = {
  children?: ReactNode;
  topic?: string;
  content?: string;
  message?: string;
};

export const Card = ({
  children,
  topic,
  content,
  message,
}: CardProps) => (
  <section className="card">
    {content ? (
      <div style={{ fontSize: getTextSize(content) }} title={topic}>
        {parseCardContent(content)}
      </div>
    ) : null}

    {message ? (
      <div className="card-message">{message}</div>
    ) : null}

    {children}
  </section>
);
