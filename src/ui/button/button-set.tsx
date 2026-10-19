import type { ReactNode } from 'react';
import './style.scss';

export const ButtonSet = ({ children }: { children: ReactNode }) => (
  <div className="button-set">{children}</div>
);
