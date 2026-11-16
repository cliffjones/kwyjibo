import { useLayoutEffect, useRef, useState, type ChangeEvent, type FocusEvent, type SelectHTMLAttributes } from 'react';
import { Button } from '../button';
import { getClassString } from '../get-class-string';
import { Icon } from '../icon';
import type { IconName } from '../icon/types';
import './style.scss';

export const Selector = ({
  variant,
  icon,
  onChange,
  onBlur,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & { variant?: string; icon?: IconName }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectorRef = useRef<HTMLSelectElement>(null);
  const pickerRequested = useRef(false);

  useLayoutEffect(() => {
    if (!icon || !isOpen || !pickerRequested.current) {
      return;
    }

    pickerRequested.current = false;
    const select = selectorRef.current;
    if (!select) {
      return;
    }

    select.focus();
    if (typeof select.showPicker === 'function') {
      select.showPicker();
    }
  }, [icon, isOpen]);

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    onChange?.(event);
    if (icon) {
      setIsOpen(false);
    }
  };

  const handleBlur = (event: FocusEvent<HTMLSelectElement>) => {
    onBlur?.(event);
    if (icon) {
      setIsOpen(false);
    }
  };

  const handleOpen = () => {
    pickerRequested.current = true;
    setIsOpen(true);
  };

  if (icon && !isOpen) {
    return (
      <Button
        variant="text"
        onClick={handleOpen}
        title={props.title}
        aria-label={props['aria-label'] ?? props.title}
        disabled={props.disabled}
      >
        <Icon name={icon} />
      </Button>
    );
  }

  return (
    <select
      ref={selectorRef}
      className={getClassString('selector', variant)}
      autoFocus={Boolean(icon)}
      onChange={handleChange}
      onBlur={handleBlur}
      {...props}
    >
      {children}
    </select>
  );
};
