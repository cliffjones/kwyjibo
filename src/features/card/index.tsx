import type { ReactNode } from 'react';
import { Content } from '../../ui/content';
import { getTextSize } from './get-text-size';
import './style.scss';

export const Card = ({
  children,
  heading,
  intro,
  topic,
  content
}: {
  children?: ReactNode;
  heading?: string;
  intro?: string;
  topic?: string;
  content?: string;
}) => (
  <section className="card">
    {heading ? <h2 className="card-heading">{heading}</h2> : null}

    {intro ? <Content text={intro} /> : null}

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
