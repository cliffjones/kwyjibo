import type { AnchorHTMLAttributes } from 'react';
import './style.scss';

export const Link = ({ className, children, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) => (
  <a
    className={['link', className].filter(Boolean).join(' ')}
    {...props}
  >{children}</a>
);
