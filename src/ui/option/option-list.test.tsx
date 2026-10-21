import { render, screen } from '@testing-library/react';
import { Option } from './index';
import { OptionList } from './option-list';

describe('OptionList', () => {
  it('renders an optional legend around its children', () => {
    render(<OptionList label="Topics"><Option label="Science" /></OptionList>);

    expect(screen.getByRole('group', { name: 'Topics' })).toContainElement(
      screen.getByRole('checkbox', { name: 'Science' })
    );
  });
});
