import { render, screen } from '@testing-library/react';
import { Card } from './index';

describe('Card', () => {
  it('renders card content, topic, message, and children', () => {
    render(<Card topic="Science" content="What is a cell?" message="Question">
      <button type="button">Answer</button>
    </Card>);

    expect(screen.getByText('Science', { selector: '.card-topic' })).toBeInTheDocument();
    expect(screen.getByText('Question')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Answer' })).toBeInTheDocument();
  });

  it('converts double spaces to line breaks and preserves following spaces', () => {
    render(<Card content="Line one.   Indented line." />);

    const content = screen.getByText('Line one.', { exact: false });
    expect(content.querySelector('br')).toBeInTheDocument();
    expect(content.textContent).toBe('Line one.\u00a0Indented line.');
  });

  it('renders backtick code spans and italic spans without changing their contents', () => {
    render(<Card content="Use `x * y`  *carefully*." />);

    expect(screen.getByText('x * y', { selector: 'code' })).toBeInTheDocument();
    expect(screen.getByText('carefully', { selector: 'em' })).toBeInTheDocument();
    expect(screen.getByText('Use', { exact: false }).querySelector('br')).toBeInTheDocument();
  });

  it('preserves double-space line breaks and indentation inside formatted spans', () => {
    render(<Card content="`first   second` *third   fourth*" />);

    const code = screen.getByText('first', { exact: false, selector: 'code' });
    const emphasis = screen.getByText('third', { exact: false, selector: 'em' });
    expect(code.querySelector('br')).toBeInTheDocument();
    expect(code.textContent).toBe('first\u00a0second');
    expect(emphasis.querySelector('br')).toBeInTheDocument();
    expect(emphasis.textContent).toBe('third\u00a0fourth');
  });

  it('does not retain formatted spans or line breaks when card content changes', () => {
    const { rerender } = render(<Card content="Before  *mirror*  after" />);

    expect(screen.getByText('mirror', { selector: 'em' })).toBeInTheDocument();

    rerender(<Card content="How should a front end handle API failures?" />);

    const content = screen.getByText('How should a front end handle API failures?');
    expect(content.querySelector('em')).not.toBeInTheDocument();
    expect(content.querySelector('br')).not.toBeInTheDocument();
    expect(content.textContent).toBe('How should a front end handle API failures?');
  });
});
