import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { ALTERNATION_PATTERN, DEFAULT_LANG, LANG, PLACEHOLDER_PATTERN } from '../../constants';
import { setLightMode, type AppDispatch, type RootState } from '../../store';
import { Button } from '../../ui/button';
import { Icon } from '../../ui/icon';
import { faceNumberToName } from '../../ui/icon/face-number-to-name';
import { IconName } from '../../ui/icon/types';
import { Link } from '../../ui/link';
import { Selector } from '../../ui/selector';
import { ratingToPercent } from '../rating/rating-to-percent';
import './style.scss';

const LANGUAGES = [
  { code: 'arb', name: 'العربية الفصحى' },
  { code: 'arz', name: 'العربية المصرية' },
  { code: 'bn', name: 'বাংলা' },
  { code: 'de', name: 'Deutsch' },
  { code: 'en', name: 'English' },
  { code: 'eo', name: 'Esperanto' },
  { code: 'es', name: 'Español' },
  { code: 'fa', name: 'فارسی' },
  { code: 'fr', name: 'Français' },
  { code: 'hi', name: 'हिन्दी' },
  { code: 'id', name: 'Bahasa Indonesia' },
  { code: 'it', name: 'Italiano' },
  { code: 'ja', name: '日本語' },
  { code: 'ko', name: '한국어' },
  { code: 'nl', name: 'Nederlands' },
  { code: 'pcm', name: 'Naijá' },
  { code: 'pl', name: 'Polski' },
  { code: 'pt', name: 'Português' },
  { code: 'ru', name: 'Русский' },
  { code: 'sk', name: 'Slovenčina' },
  { code: 'tr', name: 'Türkçe' },
  { code: 'ur', name: 'اردو' },
  { code: 'zh', name: '中文' },
];

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
  const navigate = useNavigate();
  const initializing = useSelector((state: RootState) => state.kwyjibo.initializing);
  const lightMode = useSelector((state: RootState) => state.kwyjibo.lightMode);
  const configData = useSelector((state: RootState) => state.kwyjibo.configData);
  const itemCount = useSelector((state: RootState) => state.kwyjibo.items.length);
  const remainingIds = useSelector((state: RootState) => state.kwyjibo.remainingIds);
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
      <h1 className={`header-title${isActive ? ' header-title--active' : ''}`} aria-label="Kwyjibo">
        <Link href={`/k/${configData.language ?? ''}`} title={configData.homeMessage || LANG.homeMessage}>
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
            title={`${configData.ratingMessage || LANG.ratingMessage} ${ratingToPercent(lastRating)}`}
          >
            <div className={`icon-dot icon-dot--${ratingFace}`}>
              <Icon name={`face-${ratingFace}` as IconName} />
            </div>
          </div>
        </div>
      ) : null}

      <div className="header-toolbar header-toolbar--right">
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
