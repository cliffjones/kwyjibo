import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card } from './features/card';
import { Confidence } from './features/confidence';
import { Footer } from './features/footer';
import { Header } from './features/header';
import { Setup } from './features/setup';
import {
  rateConfidence,
  reset,
  setCustomData,
  type AppDispatch,
  type RootState
} from './store';
import './style/index.scss';
import { Button } from './ui/button';
import { ButtonSet } from './ui/button/button-set';
import { Icon } from './ui/icon';

export const App = ({ path }: { path: string }) => {
  const dispatch = useDispatch<AppDispatch>();

  const initializing = useSelector((state: RootState) => state.kwyjibo.initializing);
  const customData = useSelector((state: RootState) => state.kwyjibo.customData);
  const remainingIds = useSelector((state: RootState) => state.kwyjibo.remainingIds);
  const currentId = useSelector((state: RootState) => state.kwyjibo.currentId);
  const currentItem = useSelector((state: RootState) =>
    state.kwyjibo.items.find(({ id }) => id === currentId)
  );

  const [revealed, setRevealed] = useState(false);
  const [confirmingReset, setConfirmingReset] = useState(false);

  const handleReveal = () => {
    setRevealed(true);
  };

  const handleRating = (rating: number) => {
    setRevealed(false);
    dispatch(rateConfidence(rating));
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
    } catch (error) {
      console.error('Unable to reload cards.', error);
    }
  };

  return (
    <main className="app" data-path={path}>
      <Header confirmReset={confirmReset} confirmingReset={confirmingReset} />

      {initializing ? (
        <Setup
          customData={customData}
          handleTextChange={({ target: { value } }) => dispatch(setCustomData(value))}
        />
      ) : confirmingReset ? (
        <Card heading="Really reset the cards?">
          <ButtonSet>
            <Button className="button--yes" onClick={handleReset}>
              <Icon name="check" />
              Yes
            </Button>
            <Button className="button--no" onClick={cancelReset}>
              <Icon name="x" />
              No
            </Button>
          </ButtonSet>
        </Card>
      ) : remainingIds.length && currentItem ? (<>
        <Card topic={currentItem.topic} content={currentItem.task}>
          {currentItem.solution ? (
            !revealed ? (
              <ButtonSet>
                <Button onClick={handleReveal}>
                  <Icon name="point-down" />
                  Reveal
                </Button>
              </ButtonSet>
            ) : null
          ) : <Confidence handleRating={handleRating} />}
        </Card>

        {currentItem.solution && revealed && (
          <Card content={currentItem.solution}>
            <Confidence handleRating={handleRating} />
          </Card>
        )}
      </>) : (
        <Card heading="You’ve got this.">
          <ButtonSet>
            <Button onClick={handleReset}>
              <Icon name="reset" />
              Reset
            </Button>
          </ButtonSet>
        </Card>
      )}

      <Footer />
    </main>
  );
};
