import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router';
import { ALTERNATION_PATTERN, DEFAULT_LANG, LANG, PLACEHOLDER_PATTERN } from '../../constants';
import { showMosaic } from '../../features/mosaic/show-mosaic';
import { countDaysSince } from '../../processing/count-days-since';
import { ratingToPercent } from '../../processing/rating-to-percent';
import { setLightMode, type AppDispatch, type RootState } from '../../store';
import { Button } from '../../ui/button';
import { Icon } from '../../ui/icon';
import { faceNumberToName } from '../../ui/icon/face-number-to-name';
import { IconName } from '../../ui/icon/types';
import { Link } from '../../ui/link';
import { Selector } from '../../ui/selector';
import { LANGUAGES } from './constants';
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
  const navigate = useNavigate();
  const { pathname: path } = useLocation();
  const dispatch = useDispatch<AppDispatch>();

  const initializing = useSelector((state: RootState) => state.kwyjibo.initializing);
  const lightMode = useSelector((state: RootState) => state.kwyjibo.lightMode);
  const configData = useSelector((state: RootState) => state.kwyjibo.configData);
  const itemCount = useSelector((state: RootState) => state.kwyjibo.items.length);
  const remainingIds = useSelector((state: RootState) => state.kwyjibo.remainingIds);
  const pointBalance = useSelector((state: RootState) => state.pointBalance);
  const activeSince = useSelector((state: RootState) => state.activeSince);
  const streakLength = countDaysSince(activeSince);
  const currentLanguage = configData.language || DEFAULT_LANG;
  const languages = LANGUAGES.some(({ code }) => code === currentLanguage)
    ? LANGUAGES
    : [{ code: currentLanguage, name: currentLanguage }, ...LANGUAGES];

  const isActive = !initializing && remainingIds.length > 0;

  useEffect(() => {
    document.documentElement.dataset.theme = lightMode ? 'light' : 'dark';
  }, [lightMode]);

  useEffect(() => {
    document.title = `Kwyjibo${configData.title ? `: ${configData.title}` : ''}`;
  }, [configData.title]);

  const ratingFace = lastRating ? faceNumberToName(lastRating) : '';

  let remainingMessage;
  if (remainingIds.length === itemCount) {
    remainingMessage = (configData.cardsLoadedMessage || LANG.cardsLoadedMessage)
      .replace(PLACEHOLDER_PATTERN, itemCount.toString())
      .replace(ALTERNATION_PATTERN, itemCount === 1 ? '$1' : '$2');
  } else {
    remainingMessage = (configData.cardsRemainingMessage || LANG.cardsRemainingMessage)
      .replace(PLACEHOLDER_PATTERN, remainingIds.length.toString())
      .replace(PLACEHOLDER_PATTERN, itemCount.toString())
      .replace(ALTERNATION_PATTERN, itemCount === 1 ? '$1' : '$2');
  }

  return (
    <header className="header">
      <h1 className={`header-title${isActive ? ' header-title--active' : ''}`} aria-label="Kwyjibo" dir="ltr">
        <Link href={`/k/${configData.language ?? ''}`} title={configData.homeMessage || LANG.homeMessage}>
          <span className="header-title-part">Kwy</span>
          <span className="header-title-part">ji</span>
          <span className="header-title-part">bo</span>
        </Link>
      </h1>
      {configData.title ? <p className="header-title header-title--secondary">{configData.title}</p> : null}

      <div className="header-toolbar" dir="ltr">
        <div className="header-toolbar-line">
          <Button variant="text" onClick={() => showMosaic(path, navigate)} title="Show your mosaic">
            <Icon name="tile" />
            <span className="header-toolbar-text">{Math.floor(pointBalance).toLocaleString()}</span>
          </Button>

          {lastRating && ratingFace ? (
            <div
              key={ratingAnimationKey}
              className="header-toolbar-rating"
              title={`${configData.ratingMessage || LANG.ratingMessage} ${ratingToPercent(lastRating)}%`}
            >
              <div className={`icon-dot icon-dot--${ratingFace}`}>
                <Icon name={`face-${ratingFace}` as IconName} />
              </div>
            </div>
          ) : null}
        </div>

        {streakLength > 1 ? (
          <div className="header-toolbar-line">
            <div className="header-toolbar-line-unit" title="Your activity streak">
              <span className="icon-box">
                <Icon name="flame" />
              </span>
              <span className="header-toolbar-text">{streakLength.toLocaleString()}</span>
            </div>
          </div>
        ) : null}
      </div>

      <div className="header-toolbar header-toolbar--right" dir="ltr">
        <div className="header-toolbar-line">
          <Selector
            icon="globe"
            title={configData.languageMessage || LANG.languageMessage}
            onChange={({ currentTarget }) =>
              navigate(currentTarget.value === DEFAULT_LANG ? '/' : `/${currentTarget.value}`)
            }
            value={currentLanguage}
          >
            {languages.map(({ code, name }) => (
              <option key={code} value={code}>
                {name}
              </option>
            ))}
          </Selector>

          <Button
            variant="text"
            onClick={() => dispatch(setLightMode(!lightMode))}
            title={(configData.lightModeMessage || LANG.lightModeMessage).replace(
              ALTERNATION_PATTERN,
              lightMode ? '$1' : '$2',
            )}
          >
            <Icon name={lightMode ? 'moon' : 'sun'} />
          </Button>
        </div>
      </div>

      {initializing || !remainingIds.length ? null : (
        <div className="header-info">
          {remainingMessage}
          {confirmingReset ? null : (
            <Button variant="text" onClick={confirmReset} title={configData.resetButton || LANG.resetButton}>
              <Icon name="reset" />
            </Button>
          )}
        </div>
      )}
    </header>
  );
};
