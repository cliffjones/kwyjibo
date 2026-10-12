import { Button } from '../../ui/button';
import { ButtonSet } from '../../ui/button/button-set';
import { Icon } from '../../ui/icon';
import { CONFIDENCE_RATINGS } from './constants';

type ConfidenceProps = {
  handleRating: (rating: number) => void;
};

export const Confidence = ({ handleRating }: ConfidenceProps) => (
  <ButtonSet>
    Got it?
    <Button
      className="button--rating button--no"
      onClick={() => handleRating(1)}
      title={CONFIDENCE_RATINGS[0].label}
    ><Icon name={CONFIDENCE_RATINGS[0].icon} /></Button>
    <Button
      className="button--rating button--negative"
      onClick={() => handleRating(2)}
      title={CONFIDENCE_RATINGS[1].label}
    ><Icon name={CONFIDENCE_RATINGS[1].icon} /></Button>
    <Button
      className="button--rating button--neutral"
      onClick={() => handleRating(3)}
      title={CONFIDENCE_RATINGS[2].label}
    ><Icon name={CONFIDENCE_RATINGS[2].icon} /></Button>
    <Button
      className="button--rating button--positive"
      onClick={() => handleRating(4)}
      title={CONFIDENCE_RATINGS[3].label}
    ><Icon name={CONFIDENCE_RATINGS[3].icon} /></Button>
    <Button
      className="button--rating button--yes"
      onClick={() => handleRating(5)}
      title={CONFIDENCE_RATINGS[4].label}
    ><Icon name={CONFIDENCE_RATINGS[4].icon} /></Button>
  </ButtonSet>
);
