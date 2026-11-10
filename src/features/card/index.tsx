import type { ReactNode } from 'react';
import { Content } from '../../ui/content';
import { Icon } from '../../ui/icon';
import { faceNumberToName } from '../../ui/icon/face-number-to-name';
import { RATING_ICONS } from '../rating/constants';
import { ratingToPercent } from '../rating/rating-to-percent';
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
          <div className="card-rating">
            <div
              className={`icon-dot icon-dot--${faceNumberToName(rating)}`}
              title={`Last rating for this card: ${ratingToPercent(rating)}`}
            >
              <Icon name={RATING_ICONS[Math.floor(rating) - 1]} />
            </div>
          </div>
        ) : null}
        {topic ? <div className="card-topic">{topic}</div> : null}
        <Content text={content} />
      </div>
    ) : null}

    {children}
  </section>
);
