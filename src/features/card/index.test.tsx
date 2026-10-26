import { render, screen } from '@testing-library/react';
import { Card } from './index';

describe('Card', () => {
  it('renders card content, topic, heading, and children', () => {
    render(<Card topic="Science" content="What is a cell?" heading="Question">
      <button type="button">Answer</button>
    </Card>);

    expect(screen.getByText('Science', { selector: '.card-topic' })).toBeInTheDocument();
    expect(screen.getByText('Question')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Answer' })).toBeInTheDocument();
  });

  it('uses a content gap for exactly three spaces', () => {
    render(<Card content="Line one.   Indented line." />);

    const content = screen.getByText('Line one.', { exact: false });
    expect(content.querySelector('.content-gap')).toBeInTheDocument();
    expect(content.querySelector('br')).not.toBeInTheDocument();
    expect(content.textContent).toBe('Line one.Indented line.');
  });

  it('renders backtick code spans and italic spans without changing their contents', () => {
    render(<Card content="Use `x * y`  *carefully*." />);

    expect(screen.getByText('x * y', { selector: 'code' })).toBeInTheDocument();
    expect(screen.getByText('carefully', { selector: 'em' })).toBeInTheDocument();
    expect(screen.getByText('Use', { exact: false }).querySelector('br')).toBeInTheDocument();
  });

  it('uses content gaps for exactly three spaces inside formatted spans', () => {
    render(<Card content="`first   second` *third   fourth*" />);

    const code = screen.getByText('first', { exact: false, selector: 'code' });
    const emphasis = screen.getByText('third', { exact: false, selector: 'em' });
    expect(code.querySelector('.content-gap')).toBeInTheDocument();
    expect(code.querySelector('br')).not.toBeInTheDocument();
    expect(code.textContent).toBe('firstsecond');
    expect(emphasis.querySelector('.content-gap')).toBeInTheDocument();
    expect(emphasis.querySelector('br')).not.toBeInTheDocument();
    expect(emphasis.textContent).toBe('thirdfourth');
  });

  it('preserves extra indentation as non-breaking spaces in backtick code spans', () => {
    render(<Card content="`first    second`" />);

    const code = screen.getByText('first', { exact: false, selector: 'code' });
    expect(code.querySelector('br')).toBeInTheDocument();
    expect(code.textContent).toBe('first\u00a0\u00a0second');
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
