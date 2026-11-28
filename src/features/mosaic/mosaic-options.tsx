import { useDispatch, useSelector } from 'react-redux';
import { LANG } from '../../constants';
import { countDaysSince } from '../../processing/count-days-since';
import { setMosaicColor, type AppDispatch, type RootState } from '../../store';
import { Button } from '../../ui/button';
import { MAX_MOSAIC_COLOR_OPTIONS, MIN_MOSAIC_COLOR_OPTIONS } from './constants';

export const MosaicOptions = () => {
  const dispatch = useDispatch<AppDispatch>();
  const configData = useSelector((state: RootState) => state.kwyjibo.configData);
  const activeSince = useSelector((state: RootState) => state.activeSince);
  const colorOptions = useSelector((state: RootState) => state.mosaic.colorOptions);
  const currentColor = useSelector((state: RootState) => state.mosaic.currentColor);
  const optionCount = Math.max(
    MIN_MOSAIC_COLOR_OPTIONS,
    Math.min(countDaysSince(activeSince), MAX_MOSAIC_COLOR_OPTIONS),
  );

  return (
    <div className="mosaic-options">
      {configData.mosaicOptionsPrompt || LANG.mosaicOptionsPrompt}
      {colorOptions.slice(0, optionCount).map((color, index) => (
        <Button
          aria-pressed={color === currentColor}
          key={`${index} ${color}`}
          onClick={() => dispatch(setMosaicColor(color))}
          style={{ background: color, color }}
          title={color}
          variant={color === currentColor ? 'selected' : undefined}
        >
          {color}
        </Button>
      ))}
    </div>
  );
};
