import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { Link } from '../../ui/link';
import './style.scss';

export const Footer = () => {
  const configData = useSelector((state: RootState) => state.kwyjibo.configData);

  return (
    <footer className="footer">
      {configData.footer || (<>
        By <Link href="https://gofund.me/e965a3bab" target="_blank" title="Donate on GoFundMe">Cliff Jones Jr.</Link>
      </>)}
    </footer>
  );
};
