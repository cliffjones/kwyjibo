import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { Content } from '../../ui/content';
import { Icon } from '../../ui/icon';
import { Link } from '../../ui/link';
import './style.scss';

export const Footer = () => {
  const configData = useSelector((state: RootState) => state.kwyjibo.configData);

  const footerContent = configData.footer || 'By [Cliff Jones Jr.](/)';

  return (
    <footer className="footer">
      <Content text={footerContent} />
      <Link href="https://ko-fi.com/cliff" title="Donate on Ko-fi">
        <Icon name="heart" />
      </Link>
    </footer>
  );
};
