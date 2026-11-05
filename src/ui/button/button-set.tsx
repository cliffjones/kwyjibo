import type { HTMLAttributes } from 'react';
import { getClassString } from '../get-class-string';
import './style.scss';

export const ButtonSet = ({ variant, children, ...props }: HTMLAttributes<HTMLDivElement> & { variant?: string }) => (
  <div className={getClassString('button-set', variant)} {...props}>
    {children}
  </div>
);
