import { useSelector } from 'react-redux';
import { LANG, PLACEHOLDER_PATTERN } from '../../constants';
import { RootState } from '../../store';
import { Content } from '../../ui/content';
import { Icon } from '../../ui/icon';
import { Link } from '../../ui/link';
import './style.scss';

export const Footer = () => {
  const configData = useSelector((state: RootState) => state.kwyjibo.configData);

  const footerContent = (configData.byline || LANG.byline).replace(PLACEHOLDER_PATTERN, '[Cliff Jones Jr.](/)');

  return (
    <footer className="footer">
      <Content text={footerContent} />
      <Link href="https://ko-fi.com/cliff" title={configData.donationMessage || LANG.donationMessage}>
        <Icon name="heart" />
      </Link>
    </footer>
  );
};
