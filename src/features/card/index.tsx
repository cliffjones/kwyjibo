import type { ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { LANG } from '../../constants';
import { ratingToPercent } from '../../processing/rating-to-percent';
import { RootState } from '../../store';
import { Button } from '../../ui/button';
import { Content } from '../../ui/content';
import { Icon } from '../../ui/icon';
import { faceNumberToName } from '../../ui/icon/face-number-to-name';
import { RATING_ICONS } from '../rating/constants';
import { getTextSize } from './get-text-size';
import './style.scss';

export const Card = ({
  children,
  heading,
  intro,
  content,
  rating,
  topic,
  shareHint,
  onShare,
  closeHint,
  onClose,
}: {
  children?: ReactNode;
  heading?: string;
  intro?: string;
  content?: string;
  rating?: number;
  topic?: string;
  shareHint?: string;
  onShare?: () => void;
  closeHint?: string;
  onClose?: () => void;
}) => {
  const configData = useSelector((state: RootState) => state.kwyjibo.configData);

  const validRating = rating && rating >= 1 && rating < 5 ? rating : 0;

  return (
    <section className="card">
      <div className="card-toolbar">
        {topic ? <div className="card-topic">{topic}</div> : null}
        {validRating ? (
          <div className="card-rating">
            <div
              className={`icon-dot icon-dot--${faceNumberToName(validRating)}`}
              title={`${configData.lastRatingMessage || LANG.lastRatingMessage} ${ratingToPercent(validRating)}%`}
            >
              <Icon name={RATING_ICONS[Math.floor(validRating) - 1]} />
            </div>
          </div>
        ) : null}
      </div>

      <div className="card-toolbar card-toolbar--right">
        {onShare ? (
          <Button variant="text" onClick={onShare} title={shareHint}>
            <Icon name="share" />
          </Button>
        ) : null}

        {onClose ? (
          <Button variant="text" onClick={onClose} title={closeHint}>
            <Icon name="x" />
          </Button>
        ) : null}
      </div>

      {heading ? <h2 className="card-heading">{heading}</h2> : null}

      {intro ? <Content text={intro} /> : null}

      {content ? (
        <div style={{ fontSize: getTextSize(content) }}>
          <Content text={content} />
        </div>
      ) : null}

      {children}
    </section>
  );
};
