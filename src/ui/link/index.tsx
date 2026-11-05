import type { AnchorHTMLAttributes } from 'react';
import { getClassString } from '../get-class-string';
import './style.scss';

export const Link = ({
  variant,
  children,
  href,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & { variant?: string }) => {
  const isExternal = href?.startsWith('http');
  if (isExternal) {
    props.target = '_blank';
  }
  return (
    <a className={getClassString('link', isExternal ? `${variant} external` : variant)} href={href} {...props}>
      {children}
    </a>
  );
};
