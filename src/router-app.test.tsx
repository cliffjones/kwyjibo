import { cleanup, render, screen } from '@testing-library/react';
import { useLocation } from 'react-router';
import { RouterApp } from './router-app';
import { loadItems } from './store/load-items';
import type { QuizItem } from './store/types';

jest.mock('react-router', () => ({
  useLocation: jest.fn()
}));

jest.mock('./store/load-items', () => ({
  loadItems: jest.fn()
}));

const mockedUseLocation = jest.mocked(useLocation);
const mockedLoadItems = jest.mocked(loadItems);

const items: QuizItem[] = [
  { id: 0, topic: 'Science', question: 'What is a cell?', answer: 'A basic unit of life.', confidence: 0 }
];

describe('RouterApp', () => {
  beforeEach(() => {
    window.localStorage.clear();
    mockedUseLocation.mockReturnValue({ pathname: '/science' } as ReturnType<typeof useLocation>);
  });

  afterEach(() => {
    cleanup();
  });

  it('shows loading state before rendering the loaded application', async () => {
    let resolveItems!: (items: QuizItem[]) => void;
    mockedLoadItems.mockReturnValue(new Promise(resolve => {
      resolveItems = resolve;
    }));

    render(<RouterApp />);
    expect(screen.getByText('Loading…')).toBeInTheDocument();

    resolveItems(items);
    expect(await screen.findByRole('heading', { name: 'Kwyjibo' })).toBeInTheDocument();
    expect(screen.getByText('What do you want to work on today?')).toBeInTheDocument();
    expect(mockedLoadItems).toHaveBeenCalledWith('/science');
  });

  it('renders an alert when cards fail to load', async () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => { });
    mockedLoadItems.mockRejectedValue(new Error('network failure'));

    render(<RouterApp />);
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Unable to load cards for this path.'
    );
    expect(consoleError).toHaveBeenCalledWith(
      'Unable to load "/science".',
      expect.any(Error)
    );

    consoleError.mockRestore();
  });
});
