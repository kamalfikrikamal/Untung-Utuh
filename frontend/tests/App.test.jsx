import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from '../src/App';

const Wrapper = ({ children }) => <BrowserRouter>{children}</BrowserRouter>;

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />, { wrapper: Wrapper });
    expect(document.body).toBeTruthy();
  });
});
