import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLightMode, type AppDispatch, type RootState } from '../../store';
import { Button } from '../../ui/button';
import { Icon } from '../../ui/icon';
import { faceNumberToName } from '../../ui/icon/face-number-to-name';
import { IconName } from '../../ui/icon/types';
import { Link } from '../../ui/link';
import { ratingToPercent } from '../rating/rating-to-percent';
import './style.scss';

export const Header = ({
  confirmReset,
  confirmingReset,
  lastRating,
  ratingAnimationKey,
}: {
  confirmReset: () => void;
  confirmingReset: boolean;
  lastRating?: number;
  ratingAnimationKey?: number;
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const initializing = useSelector((state: RootState) => state.kwyjibo.initializing);
  const lightMode = useSelector((state: RootState) => state.kwyjibo.lightMode);
  const configData = useSelector((state: RootState) => state.kwyjibo.configData);
  const itemCount = useSelector((state: RootState) => state.kwyjibo.items.length);
  const remainingIds = useSelector((state: RootState) => state.kwyjibo.remainingIds);

  const isActive = !initializing && remainingIds.length > 0;

  useEffect(() => {
    document.documentElement.dataset.theme = lightMode ? 'light' : 'dark';
  }, [lightMode]);

  useEffect(() => {
    document.title = `Kwyjibo${configData.title ? `: ${configData.title}` : ''}`;
  }, [configData.title]);

  const ratingFace = lastRating ? faceNumberToName(lastRating) : '';

  let remainingMessage = `${itemCount} card${itemCount === 1 ? '' : 's'}`;
  if (remainingIds.length === itemCount) {
    remainingMessage = `${remainingMessage} loaded`;
  } else {
    remainingMessage = `${remainingIds.length} of ${remainingMessage} remaining`;
  }

  return (
    <header className="header">
      <h1 className={`header-title${isActive ? ' header-title--active' : ''}`} aria-label="Kwyjibo">
        <Link href="/k/" title="Refresh with no preloaded data.">
          <span className="header-title-part">Kwy</span>
          <span className="header-title-part">ji</span>
          <span className="header-title-part">bo</span>
        </Link>
      </h1>
      {configData.title ? <p className="header-title header-title--secondary">{configData.title}</p> : null}

      {lastRating && ratingFace ? (
        <div className="header-toolbar">
          <div
            key={ratingAnimationKey}
            className="header-toolbar-rating"
            title={`Rating applied: ${ratingToPercent(lastRating)}`}
          >
            <div className={`icon-dot icon-dot--${ratingFace}`}>
              <Icon name={`face-${ratingFace}` as IconName} />
            </div>
          </div>
        </div>
      ) : null}

      <div className="header-toolbar header-toolbar--right">
        <Button
          variant="text"
          onClick={() => dispatch(setLightMode(!lightMode))}
          title={`Switch to ${lightMode ? 'Dark' : 'Light'} Mode`}
        >
          <Icon name={lightMode ? 'moon' : 'sun'} />
        </Button>
      </div>

      {initializing || !remainingIds.length ? null : (
        <div className="header-info">
          {remainingMessage}
          {confirmingReset ? null : (
            <Button variant="text" onClick={confirmReset} title="Reset">
              <Icon name="reset" />
            </Button>
          )}
        </div>
      )}
    </header>
  );
};
