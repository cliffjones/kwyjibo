import type { ButtonHTMLAttributes } from 'react';
import './style.scss';

export const Button = ({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    className={['button', className].filter(Boolean).join(' ')}
    {...props}
  />
);
