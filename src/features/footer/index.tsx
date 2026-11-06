import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { Content } from '../../ui/content';
import './style.scss';

export const Footer = () => {
  const configData = useSelector((state: RootState) => state.kwyjibo.configData);

  const footerContent = configData.footer || 'By [Cliff Jones Jr.](/) [❤︎](https://ko-fi.com/cliff "Donate on Ko-fi")';

  return (
    <footer className="footer">
      <Content text={footerContent} />
    </footer>
  );
};
