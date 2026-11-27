import { useSelector } from 'react-redux';
import { countDaysSince } from '../../processing/count-days-since';
import { RootState } from '../../store';

export const MosaicEditorOptions = () => {
  const activeSince = useSelector((state: RootState) => state.activeSince);
  const streak = countDaysSince(activeSince);

  return <div>Color options: {streak}</div>;
};
