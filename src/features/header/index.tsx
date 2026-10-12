import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setDarkMode, type AppDispatch, type RootState } from '../../store';
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
  const darkMode = useSelector((state: RootState) => state.kwyjibo.darkMode);
  const itemCount = useSelector((state: RootState) => state.kwyjibo.items.length);
  const remainingIds = useSelector((state: RootState) => state.kwyjibo.remainingIds);

  useEffect(() => {
    document.documentElement.dataset.theme = darkMode ? 'dark' : 'light';
  }, [darkMode]);

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
          onClick={() => dispatch(setDarkMode(!darkMode))}
          title={`Switch to ${darkMode ? 'Light' : 'Dark'} Mode`}
        ><Icon name={darkMode ? 'sun' : 'moon'} /></Button>
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
