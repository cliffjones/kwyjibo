import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLightMode, type AppDispatch, type RootState } from '../../store';
import { Button } from '../../ui/button';
import { Icon } from '../../ui/icon';
import './style.scss';

type HeaderProps = {
  confirmReset: () => void;
  confirmingReset: boolean;
};

export const Header = ({ confirmReset, confirmingReset }: HeaderProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const initializing = useSelector((state: RootState) => state.kwyjibo.initializing);
  const lightMode = useSelector((state: RootState) => state.kwyjibo.lightMode);
  const itemCount = useSelector((state: RootState) => state.kwyjibo.items.length);
  const remainingIds = useSelector((state: RootState) => state.kwyjibo.remainingIds);

  useEffect(() => {
    document.documentElement.dataset.theme = lightMode ? 'light' : 'dark';
  }, [lightMode]);

  let remainingMessage = `${itemCount} card${itemCount === 1 ? '' : 's'}`;
  if (remainingIds.length === itemCount) {
    remainingMessage = `${remainingMessage} loaded`;
  } else {
    remainingMessage = `${remainingIds.length} of ${remainingMessage} remaining`;
  }

  return (<>
    <header className="header">
      <h1 className="header-title">Kwyjibo</h1>

      <div className="header-toolbar">
        <Button
          className="button--text"
          onClick={() => dispatch(setLightMode(!lightMode))}
          title={`Switch to ${lightMode ? 'Dark' : 'Light'} Mode`}
        ><Icon name={lightMode ? 'moon' : 'sun'} /></Button>
      </div>

      {initializing ? null : (
        <div className="header-info">
          {remainingMessage}
          {confirmingReset || !remainingIds.length ? null : (
            <Button
              className="button--text"
              onClick={confirmReset}
              title="Reset"
            ><Icon name="reset" /></Button>
          )}
        </div>
      )}
    </header>
  </>);
};
