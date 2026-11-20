import { getClassString } from '../get-class-string';
import './style.scss';
import type { InputProps, TextAreaProps } from './types';

export const Input = ({
  label,
  variant,
  ...props
}: (InputProps | TextAreaProps) & {
  label?: string;
  variant?: string;
}) => {
  const variants: string[] = variant?.split(' ') ?? [];
  if (variants.includes('long')) {
    return (
      <label className="input-label">
        {label}
        <textarea className={getClassString('input', variant)} {...(props as TextAreaProps)} />
      </label>
    );
  }

  return (
    <label className="input-label">
      {label}
      <input type="text" className={getClassString('input', variant)} {...(props as InputProps)} />
    </label>
  );
};
