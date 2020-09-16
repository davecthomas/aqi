import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('renders AQI button', () => {
  const { getByText } = render(<App />);
  const element = getByText(/Air Quality Index/i);
  expect(element).toBeInTheDocument();
});
