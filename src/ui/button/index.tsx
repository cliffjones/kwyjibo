import type { ButtonHTMLAttributes } from 'react';
import './style.scss';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = ({ className, ...props }: ButtonProps) => (
  <button
    className={['button', className].filter(Boolean).join(' ')}
    {...props}
  />
);
