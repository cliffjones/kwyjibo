import type { ImgHTMLAttributes } from 'react';
import './style.scss';

export const Image = ({ className, children, ...props }: ImgHTMLAttributes<HTMLImageElement>) => (
  <img
    className={['image', className].filter(Boolean).join(' ')}
    {...props}
  />
);
