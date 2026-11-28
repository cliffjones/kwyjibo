import { Suspense, lazy, useState, type ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { LANG, MOSAIC_PATH } from './constants';
import { Card } from './features/card';
import { Footer } from './features/footer';
import { Header } from './features/header';
import { Mosaic } from './features/mosaic';
import { copyMosaicUrl } from './features/mosaic/copy-mosaic-url';
import { decodeMosaic } from './features/mosaic/decode-mosaic';
import { hideMosaic } from './features/mosaic/hide-mosaic';
import { Rating } from './features/rating';
import { Setup } from './features/setup';
import { getResults } from './get-results';
import { ITEM_TYPES, K_DELIMS } from './processing/constants';
import { getTime } from './processing/get-time';
import { sortResponses } from './processing/sort-responses';
import { reset, respond, setCustomData, type AppDispatch, type RootState } from './store';
import './style/index.scss';
import { Button } from './ui/button';
import { ButtonSet } from './ui/button/button-set';
import { Content } from './ui/content';
import { Icon } from './ui/icon';
import { Input } from './ui/input';

const History = lazy(() => import('./features/history').then(({ History }) => ({ default: History })));

export const App = ({ path }: { path: string }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const initializing = useSelector((state: RootState) => state.kwyjibo.initializing);
  const customData = useSelector((state: RootState) => state.kwyjibo.customData);
  const configData = useSelector((state: RootState) => state.kwyjibo.configData);
  const remainingIds = useSelector((state: RootState) => state.kwyjibo.remainingIds);
  const itemCount = useSelector((state: RootState) => state.kwyjibo.items.length);
  const currentId = useSelector((state: RootState) => state.kwyjibo.currentId);
  const currentItem = useSelector((state: RootState) => state.kwyjibo.items.find(({ id }) => id === currentId));
  const startTime = useSelector((state: RootState) => state.kwyjibo.startTime);
  const ratingTotal = useSelector((state: RootState) => state.kwyjibo.ratingTotal);
  const ratingCount = useSelector((state: RootState) => state.kwyjibo.ratingCount);
  const history = useSelector((state: RootState) => state.kwyjibo.history);
  const pointBalance = useSelector((state: RootState) => state.pointBalance);
  const mosaicTiles = useSelector((state: RootState) => state.mosaic.tiles);

  const [revealed, setRevealed] = useState(false);
  const [confirmingReset, setConfirmingReset] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [lastRating, setLastRating] = useState(0);
  const [ratingAnimationKey, setRatingAnimationKey] = useState(0);
  const [endTime, setEndTime] = useState(0);

  const mosaicSegments = path
    .split('/')
    .filter(Boolean)
    .filter((segment) => segment === MOSAIC_PATH || segment.startsWith(`${MOSAIC_PATH}${K_DELIMS.namespace}`));
  const mosaicMode = mosaicSegments.length > 0;
  const mosaicEditable = pointBalance >= 1;
  const mosaicCode = mosaicSegments
    .find((segment) => segment.startsWith(`m${K_DELIMS.namespace}`))
    ?.slice(`m${K_DELIMS.namespace}`.length);
  const sharedMosaicCode = mosaicCode && decodeMosaic(mosaicCode) ? mosaicCode : undefined;

  const handleReveal = () => {
    setRevealed(true);
  };

  const handleRating = (rating: number, response?: string) => {
    setRevealed(false);
    setLastRating(rating);
    setRatingAnimationKey((value) => value + 1);
    setEndTime(getTime());
    dispatch(respond({ rating, response }));
  };

  const confirmReset = () => {
    setConfirmingReset(true);
  };

  const cancelReset = () => {
    setConfirmingReset(false);
  };

  const handleReset = async () => {
    setRevealed(false);

    try {
      // Keep the confirmation open on failure so the user can retry or cancel.
      await dispatch(reset(path)).unwrap();
      setConfirmingReset(false);
      setEndTime(0);
    } catch (error) {
      console.error('Unable to reload cards.', error);
    }
  };

  const shareMosaic = async () => {
    try {
      await copyMosaicUrl(mosaicTiles);
    } catch (error) {
      console.error('Unable to copy mosaic link.', error);
    }
  };

  const sortedResponses = sortResponses(currentItem?.responses ?? []);

  return (
    <main className="app" data-path={path}>
      <Header
        confirmReset={confirmReset}
        confirmingReset={confirmingReset}
        lastRating={lastRating}
        ratingAnimationKey={ratingAnimationKey}
      />

      {mosaicMode ? (
        <>
          {sharedMosaicCode && (
            <Card
              heading={configData.sharedMosaicHeading || LANG.sharedMosaicHeading}
              closeHint={configData.mosaicCloseHint || LANG.mosaicCloseHint}
              onClose={() => hideMosaic(path, navigate)}
            >
              <Mosaic code={sharedMosaicCode} />
            </Card>
          )}

          <Card
            heading={configData.mosaicHeading || LANG.mosaicHeading}
            intro={mosaicEditable ? undefined : configData.mosaicIntro || LANG.mosaicIntro}
            shareHint={configData.mosaicShareHint || LANG.mosaicShareHint}
            onShare={shareMosaic}
            closeHint={configData.mosaicCloseHint || LANG.mosaicCloseHint}
            onClose={() => hideMosaic(path, navigate)}
          >
            <Mosaic editable={mosaicEditable} />
          </Card>
        </>
      ) : (
        <>
          {initializing ? (
            <>
              <Setup
                customData={customData}
                handleTextChange={({ target: { value } }) => dispatch(setCustomData(value))}
              />

              {history.length ? (
                <Suspense fallback={null}>
                  <History />
                </Suspense>
              ) : null}
            </>
          ) : confirmingReset ? (
            <Card heading={configData.resetConfirmation || LANG.resetConfirmation}>
              <ButtonSet>
                <Button variant="yes" onClick={handleReset}>
                  <Icon name="check" />
                  {configData.yesButton || LANG.yesButton}
                </Button>
                <Button variant="no" onClick={cancelReset}>
                  <Icon name="x" />
                  {configData.noButton || LANG.noButton}
                </Button>
              </ButtonSet>
            </Card>
          ) : remainingIds.length && currentItem ? (
            <>
              <Card content={currentItem.task} topic={currentItem.topic} rating={currentItem.rating}>
                {currentItem.type === ITEM_TYPES.quiz && sortedResponses.length ? (
                  <ButtonSet variant="responses">
                    {sortedResponses.map((response, index) => (
                      <Button
                        key={`${index}: ${response.text}`}
                        onClick={() => handleRating(response.value, response.text)}
                      >
                        <Content text={response.text} />
                      </Button>
                    ))}
                  </ButtonSet>
                ) : currentItem.type === ITEM_TYPES.input ? (
                  <>
                    <Input
                      label={currentItem.solution}
                      value={inputValue}
                      onChange={({ target: { value } }: ChangeEvent<HTMLInputElement>) => setInputValue(value)}
                    />
                    <Rating
                      handleRating={(rating) => {
                        handleRating(rating, inputValue);
                        setInputValue('');
                      }}
                    />
                  </>
                ) : currentItem.solution ? (
                  revealed ? null : (
                    <ButtonSet>
                      <Button onClick={handleReveal}>
                        <Icon name="point-down" />
                        {configData.revealButton || LANG.revealButton}
                      </Button>
                    </ButtonSet>
                  )
                ) : (
                  <Rating handleRating={handleRating} />
                )}
              </Card>

              {currentItem.solution && revealed && (
                <Card content={currentItem.solution}>
                  <Rating handleRating={handleRating} />
                </Card>
              )}
            </>
          ) : (
            <Card heading={getResults(itemCount, ratingTotal, ratingCount, startTime, endTime, configData)}>
              <ButtonSet>
                <Button onClick={handleReset}>
                  <Icon name="reset" />
                  {configData.resetButton || LANG.resetButton}
                </Button>
              </ButtonSet>
            </Card>
          )}
        </>
      )}

      <Footer />
    </main>
  );
};
