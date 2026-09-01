import React from 'react';
import { render, screen } from '@testing-library/react';

jest.mock('react-router-dom', () => {
  return {
    BrowserRouter: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    Routes: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    Route: ({ element }: { element: React.ReactNode }) => <div>{element}</div>,
    Link: ({ children, to, ...props }: any) => <a href={to} {...props}>{children}</a>,
    useLocation: () => ({ pathname: '/' }),
    useNavigate: () => () => {},
    useParams: () => ({ id: '1', serviceId: 'svc-1' }),
  };
});

import App from './App';

test('renders SIARA dashboard application shell', () => {
  render(<App />);
  const brandElements = screen.getAllByText(/SIARA/i);
  expect(brandElements.length).toBeGreaterThan(0);
});
