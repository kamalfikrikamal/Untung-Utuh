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
import Register from '@/pages/Register';

const renderRegister = () =>
  render(
    <MemoryRouter>
      <Register />
    </MemoryRouter>,
  );

describe('Register', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the heading', () => {
    renderRegister();
    expect(screen.getByText('Create an Account')).toBeInTheDocument();
  });

  it('renders all form fields', () => {
    renderRegister();
    expect(screen.getByLabelText('Full Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
  });

  it('renders the submit button', () => {
    renderRegister();
    expect(screen.getByRole('button', { name: /Sign Up/i })).toBeInTheDocument();
  });

  it('renders link back to login', () => {
    renderRegister();
    expect(screen.getByRole('link', { name: /Log in/i })).toBeInTheDocument();
  });

  it('shows validation error for invalid email', async () => {
    renderRegister();
    fireEvent.change(screen.getByLabelText('Full Name'), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'bad-email' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: 'password123' } });
    fireEvent.submit(screen.getByRole('button', { name: /Sign Up/i }).closest('form'));
    await waitFor(() => {
      expect(screen.getByText('Format email tidak valid')).toBeInTheDocument();
    });
  });

  it('shows validation error for short password', async () => {
    renderRegister();
    fireEvent.change(screen.getByLabelText('Full Name'), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'user@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: '123' } });
    fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: '123' } });
    fireEvent.submit(screen.getByRole('button', { name: /Sign Up/i }).closest('form'));
    await waitFor(() => {
      expect(screen.getByText('Password minimal 8 karakter')).toBeInTheDocument();
    });
  });

  it('shows error when passwords do not match', async () => {
    renderRegister();
    fireEvent.change(screen.getByLabelText('Full Name'), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'user@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: 'different123' } });
    fireEvent.submit(screen.getByRole('button', { name: /Sign Up/i }).closest('form'));
    await waitFor(() => {
      expect(screen.getByText('Password tidak cocok')).toBeInTheDocument();
    });
  });

  it('calls api.post and navigates on successful registration', async () => {
    api.post.mockResolvedValue({ data: { token: 'reg-token' } });
    renderRegister();
    fireEvent.change(screen.getByLabelText('Full Name'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'user@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: 'password123' } });
    fireEvent.submit(screen.getByRole('button', { name: /Sign Up/i }).closest('form'));
    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/auth/register', expect.objectContaining({ email: 'user@example.com' }));
      expect(storage.setToken).toHaveBeenCalledWith('reg-token');
      expect(toast.success).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });
});
