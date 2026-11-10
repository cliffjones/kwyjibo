import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LANG } from './constants';
import { Card } from './features/card';
import { Footer } from './features/footer';
import { Header } from './features/header';
import { Rating } from './features/rating';
import { Setup } from './features/setup';
import { getResults } from './get-results';
import { getTime } from './processing/get-time';
import { sortResponses } from './processing/sort-responses';
import { rateItem, reset, setCustomData, type AppDispatch, type RootState } from './store';
import './style/index.scss';
import { Button } from './ui/button';
import { ButtonSet } from './ui/button/button-set';
import { Icon } from './ui/icon';

export const App = ({ path }: { path: string }) => {
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

  const [revealed, setRevealed] = useState(false);
  const [confirmingReset, setConfirmingReset] = useState(false);
  const [lastRating, setLastRating] = useState(0);
  const [ratingAnimationKey, setRatingAnimationKey] = useState(0);
  const [endTime, setEndTime] = useState(0);

  const handleReveal = () => {
    setRevealed(true);
  };

  const handleRating = (rating: number) => {
    setRevealed(false);
    setLastRating(rating);
    setRatingAnimationKey((value) => value + 1);
    setEndTime(getTime());
    dispatch(rateItem(rating));
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

  const sortedResponses = sortResponses(currentItem?.responses ?? []);

  return (
    <main className="app" data-path={path}>
      <Header
        confirmReset={confirmReset}
        confirmingReset={confirmingReset}
        lastRating={lastRating}
        ratingAnimationKey={ratingAnimationKey}
      />

      {initializing ? (
        <Setup customData={customData} handleTextChange={({ target: { value } }) => dispatch(setCustomData(value))} />
      ) : confirmingReset ? (
        <Card heading="Really reset the cards?">
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
            {currentItem.type === 'quiz' && sortedResponses.length ? (
              <ButtonSet variant="responses">
                {sortedResponses.map((response, index) => (
                  <Button key={index} onClick={() => handleRating(response.value)}>
                    {response.text}
                  </Button>
                ))}
              </ButtonSet>
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

      <Footer />
    </main>
  );
};
