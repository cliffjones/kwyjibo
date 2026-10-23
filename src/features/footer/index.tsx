import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { parseCardContent } from '../card/parse-card-content';
import './style.scss';

export const Footer = () => {
  const configData = useSelector((state: RootState) => state.kwyjibo.configData);

  const footerContent = configData.footer
    || 'By [Cliff Jones Jr.](/) [❤︎](https://gofund.me/e965a3bab "Donate on GoFundMe")';

  return (
    <footer className="footer">
      {parseCardContent(footerContent)}
    </footer>
  );
};
