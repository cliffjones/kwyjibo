import type { ReactNode } from 'react';
import './style.scss';

type ButtonSetProps = {
  children: ReactNode;
};

export const ButtonSet = ({ children }: ButtonSetProps) => (
  <div className="button-set">{children}</div>
);
