import type { ReactNode } from 'react';
import { Content } from '../../ui/content';
import { Icon } from '../../ui/icon';
import { CONFIDENCE_RATINGS } from '../rating/constants';
import { getTextSize } from './get-text-size';
import './style.scss';

export const Card = ({
  children,
  heading,
  intro,
  content,
  rating,
  topic,
}: {
  children?: ReactNode;
  heading?: string;
  intro?: string;
  content?: string;
  rating?: number;
  topic?: string;
}) => (
  <section className="card">
    {heading ? <h2 className="card-heading">{heading}</h2> : null}

    {intro ? <Content text={intro} /> : null}

    {content ? (
      <div style={{ fontSize: getTextSize(content) }}>
        {rating && rating >= 1 && rating < 5 ? (
          <div
            className={`card-rating card-rating--${Math.floor(rating)}`}
            title={`${Math.round(((rating - 1) / 4) * 100)}%`}
          >
            <Icon name={CONFIDENCE_RATINGS[Math.floor(rating) - 1]?.icon} />
          </div>
        ) : null}
        {topic ? (
          <div className="card-topic">{topic}</div>
        ) : null}
        <Content text={content} />
      </div>
    ) : null}

    {children}
  </section>
);
