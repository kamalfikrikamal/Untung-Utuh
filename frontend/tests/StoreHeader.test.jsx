import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import StoreHeader from '@/components/store/StoreHeader';

const baseStore = { name: 'Toko Mantap', description: null, whatsapp: null };

describe('StoreHeader', () => {
  it('renders store name', () => {
    render(<StoreHeader store={baseStore} />);
    expect(screen.getByText('Toko Mantap')).toBeTruthy();
  });

  it('shows description when provided', () => {
    render(
      <StoreHeader store={{ ...baseStore, description: 'Best store in town' }} />
    );
    expect(screen.getByText('Best store in town')).toBeTruthy();
  });

  it('hides description when absent', () => {
    render(<StoreHeader store={baseStore} />);
    expect(screen.queryByText('Best store in town')).toBeNull();
  });

  it('shows WhatsApp link when whatsapp is provided', () => {
    render(
      <StoreHeader store={{ ...baseStore, whatsapp: '081234567890' }} />
    );
    const link = screen.getByRole('link', { name: /Contact via WhatsApp/i });
    expect(link.getAttribute('href')).toContain('wa.me');
  });

  it('hides WhatsApp link when absent', () => {
    render(<StoreHeader store={baseStore} />);
    expect(screen.queryByRole('link', { name: /WhatsApp/i })).toBeNull();
  });

  it('strips non-digit characters from whatsapp number', () => {
    render(
      <StoreHeader store={{ ...baseStore, whatsapp: '+62 812-3456-7890' }} />
    );
    const link = screen.getByRole('link', { name: /Contact via WhatsApp/i });
    expect(link.getAttribute('href')).toBe('https://wa.me/6281234567890');
  });
});
