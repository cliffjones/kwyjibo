import type { TextareaHTMLAttributes } from 'react';
import './style.scss';

type InputBoxProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
};

export const InputBox = ({ label, className, ...props }: InputBoxProps) => (
  <label className="input-box-label">
    {label}
    <textarea
      className={['input-box', className].filter(Boolean).join(' ')}
      {...props}
    />
  </label>
);
