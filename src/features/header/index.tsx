import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLightMode, type AppDispatch, type RootState } from '../../store';
import { Button } from '../../ui/button';
import { Icon } from '../../ui/icon';
import './style.scss';

export const Header = ({
  confirmReset,
  confirmingReset
}: {
  confirmReset: () => void;
  confirmingReset: boolean;
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

  let remainingMessage = `${itemCount} card${itemCount === 1 ? '' : 's'}`;
  if (remainingIds.length === itemCount) {
    remainingMessage = `${remainingMessage} loaded`;
  } else {
    remainingMessage = `${remainingIds.length} of ${remainingMessage} remaining`;
  }

  return (<header className="header">
    <h1
      className={`header-title${isActive ? ' header-title--active' : ''}`}
      aria-label="Kwyjibo"
    >
      <span>Kwy</span><span>ji</span><span>bo</span>
    </h1>
    {configData.title
      ? <p className="header-title header-title--secondary">{configData.title}</p>
      : null}

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
  </header>);
};
