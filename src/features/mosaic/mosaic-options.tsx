import { useDispatch, useSelector } from 'react-redux';
import { countDaysSince } from '../../processing/count-days-since';
import { setMosaicColor, type AppDispatch, type RootState } from '../../store';
import { Button } from '../../ui/button';
import { Icon } from '../../ui/icon';

export const MosaicOptions = () => {
  const dispatch = useDispatch<AppDispatch>();
  const activeSince = useSelector((state: RootState) => state.activeSince);
  const colorOptions = useSelector((state: RootState) => state.mosaic.colorOptions);
  const currentColor = useSelector((state: RootState) => state.mosaic.currentColor);
  const optionCount = Math.min(4, Math.max(1, countDaysSince(activeSince)));

  return (
    <div className="mosaic-options">
      Color options:{' '}
      {colorOptions.slice(0, optionCount).map((color, index) => (
        <Button
          aria-pressed={color === currentColor}
          key={`${index} ${color}`}
          onClick={() => dispatch(setMosaicColor(color))}
          style={{ color }}
          title={`Use ${color}`}
          variant={color === currentColor ? 'selected' : undefined}
        >
          <Icon name="tile" />
        </Button>
      ))}
    </div>
  );
};
