import type { AnchorHTMLAttributes } from 'react';
import './style.scss';

export const Link = ({ className, children, href, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) => {
  const isExternal = href?.startsWith('http');
  if (isExternal) {
    props.target = '_blank';
  }

  return (<a
    className={['link', className].filter(Boolean).join(' ')}
    href={href}
    {...props}
  >{children}</a>);
};
