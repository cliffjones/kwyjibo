import type { InputHTMLAttributes } from 'react';
import './style.scss';

type OptionProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

export const Option = ({ label, ...props }: OptionProps) => (
  <label className="option">
    <input type="checkbox" {...props} />
    {label}
  </label>
);
