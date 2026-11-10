import { LANG } from '../../constants';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import { Button } from '../../ui/button';
import { ButtonSet } from '../../ui/button/button-set';
import { Icon } from '../../ui/icon';
import { RATING_ICONS } from './constants';

export const Rating = ({ handleRating }: { handleRating: (rating: number) => void }) => {
  const configData = useSelector((state: RootState) => state.kwyjibo.configData);

  return (
    <ButtonSet>
      {configData.ratingPrompt || LANG.ratingPrompt}
      <Button variant="rating no" onClick={() => handleRating(1)} title={configData.ratingLabel1 || LANG.ratingLabel1}>
        <Icon name={RATING_ICONS[0]} />
      </Button>
      <Button
        variant="rating negative"
        onClick={() => handleRating(2)}
        title={configData.ratingLabel2 || LANG.ratingLabel2}
      >
        <Icon name={RATING_ICONS[1]} />
      </Button>
      <Button
        variant="rating neutral"
        onClick={() => handleRating(3)}
        title={configData.ratingLabel3 || LANG.ratingLabel3}
      >
        <Icon name={RATING_ICONS[2]} />
      </Button>
      <Button
        variant="rating positive"
        onClick={() => handleRating(4)}
        title={configData.ratingLabel4 || LANG.ratingLabel4}
      >
        <Icon name={RATING_ICONS[3]} />
      </Button>
      <Button variant="rating yes" onClick={() => handleRating(5)} title={configData.ratingLabel5 || LANG.ratingLabel5}>
        <Icon name={RATING_ICONS[4]} />
      </Button>
    </ButtonSet>
  );
};
