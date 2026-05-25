import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

vi.mock('@/services/api', () => ({
  api: { post: vi.fn() },
}));
vi.mock('@/utils/storage', () => ({
  storage: { setToken: vi.fn(), getToken: vi.fn(), clearToken: vi.fn() },
}));
vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, useNavigate: () => mockNavigate };
});

import { api } from '@/services/api';
import { storage } from '@/utils/storage';
import { toast } from 'sonner';
import Login from '@/pages/Login';

const renderLogin = () =>
  render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>,
  );

describe('Login', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the heading', () => {
    renderLogin();
    expect(screen.getByText('Welcome Back')).toBeInTheDocument();
  });

  it('renders email and password fields', () => {
    renderLogin();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
  });

  it('renders a submit button', () => {
    renderLogin();
    expect(screen.getByRole('button', { name: /Log In/i })).toBeInTheDocument();
  });

  it('renders link to register page', () => {
    renderLogin();
    expect(screen.getByRole('link', { name: /Sign up/i })).toBeInTheDocument();
  });

  it('shows validation error for invalid email', async () => {
    renderLogin();
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'not-an-email' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: '123456' } });
    fireEvent.submit(screen.getByRole('button', { name: /Log In/i }).closest('form'));
    await waitFor(() => {
      expect(screen.getByText('Format email tidak valid')).toBeInTheDocument();
    });
  });

  it('shows validation error for short password', async () => {
    renderLogin();
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'user@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: '123' } });
    fireEvent.submit(screen.getByRole('button', { name: /Log In/i }).closest('form'));
    await waitFor(() => {
      expect(screen.getByText('Password minimal 6 karakter')).toBeInTheDocument();
    });
  });

  it('calls api.post and navigates on successful login', async () => {
    api.post.mockResolvedValue({ data: { token: 'abc123' } });
    renderLogin();
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'user@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
    fireEvent.submit(screen.getByRole('button', { name: /Log In/i }).closest('form'));
    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/auth/login', expect.objectContaining({ email: 'user@example.com' }));
      expect(storage.setToken).toHaveBeenCalledWith('abc123');
      expect(toast.success).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('handles login with no token in response gracefully', async () => {
    api.post.mockResolvedValue({ data: {} });
    renderLogin();
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'user@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
    fireEvent.submit(screen.getByRole('button', { name: /Log In/i }).closest('form'));
    await waitFor(() => {
      expect(storage.setToken).not.toHaveBeenCalled();
    });
  });
});
