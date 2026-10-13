import type { InputHTMLAttributes } from 'react';
import './style.scss';

type OptionProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

export const Option = ({ value, label, ...props }: OptionProps) => (
  <label className="option">
    <input type="checkbox" value={value} {...props} />
    {value ? label : <em>{label}</em>}
  </label>
);
