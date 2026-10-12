import type { ReactNode } from 'react';
import './style.scss';

type OptionListProps = {
  children: ReactNode;
  label?: string;
};

export const OptionList = ({ children, label }: OptionListProps) => (
  <fieldset className="option-list">
    {label ? <legend className="option-list-label">{label}</legend> : null}
    {children}
  </fieldset>
);
