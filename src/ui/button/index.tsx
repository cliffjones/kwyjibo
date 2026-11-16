import type { ButtonHTMLAttributes } from 'react';
import { getClassString } from '../get-class-string';
import './style.scss';

export const Button = ({ variant, type, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: string }) => (
  <button className={getClassString('button', variant)} type={type ?? 'button'} {...props} />
);
