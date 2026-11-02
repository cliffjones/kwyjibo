import type { TextareaHTMLAttributes } from 'react';
import { getClassString } from '../get-class-string';
import './style.scss';

export const InputBox = ({
  label,
  variant,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  variant?: string;
}) => (
  <label className="input-box-label">
    {label}
    <textarea
      className={getClassString('input-box', variant)}
      {...props}
    />
  </label>
);
