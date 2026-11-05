import type { ImgHTMLAttributes } from 'react';
import { getClassString } from '../get-class-string';
import './style.scss';

export const Image = ({ variant, ...props }: ImgHTMLAttributes<HTMLImageElement> & { variant?: string }) => (
  <img className={getClassString('image', variant)} {...props} />
);
