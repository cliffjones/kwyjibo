import type { SelectHTMLAttributes } from 'react';
import { getClassString } from '../get-class-string';
import './style.scss';

export const Selector = ({
  variant,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & { variant?: string }) => {
  return (
    <select className={getClassString('selector', variant)} {...props}>
      {children}
    </select>
  );
};
