import type { InputHTMLAttributes } from 'react';
import './style.scss';

export const Option = ({
  value,
  label,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & {
  label: string;
}) => (
  <label className="option">
    <input type="checkbox" value={value} {...props} />
    {value ? label : <em>{label}</em>}
  </label>
);
