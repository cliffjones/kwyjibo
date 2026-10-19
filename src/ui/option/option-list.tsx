import type { ReactNode } from 'react';
import './style.scss';

export const OptionList = ({
  children,
  label
}: {
  children: ReactNode;
  label?: string;
}) => (
  <fieldset className="option-list">
    {label ? <legend className="option-list-label">{label}</legend> : null}
    {children}
  </fieldset>
);
