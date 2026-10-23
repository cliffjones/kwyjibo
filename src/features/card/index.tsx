import type { ReactNode } from 'react';
import { Content } from '../../ui/content';
import { getTextSize } from './get-text-size';
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
        <Content text={content} />
      </div>
    ) : null}

    {children}
  </section>
);
