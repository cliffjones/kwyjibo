import { render, screen } from '@testing-library/react';
import { ButtonSet } from './button-set';
import { Button } from './index';

describe('ButtonSet', () => {
  it('groups button children', () => {
    render(<ButtonSet><Button>Continue</Button></ButtonSet>);

    expect(screen.getByRole('button', { name: 'Continue' }).parentElement).toHaveClass('button-set');
  });
});
