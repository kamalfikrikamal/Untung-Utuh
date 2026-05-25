import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Fitur from '@/pages/Fitur';

const renderFitur = () =>
  render(
    <MemoryRouter>
      <Fitur />
    </MemoryRouter>,
  );

describe('Fitur', () => {
  it('renders all four category section titles', () => {
    renderFitur();
    expect(screen.getByText('Manajemen Toko & Branding')).toBeInTheDocument();
    expect(screen.getByText('Sistem Order & Penjualan')).toBeInTheDocument();
    // badge and title have the same text — use getAllByText
    expect(screen.getAllByText('Analisis & Pertumbuhan').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Teknologi & Keandalan').length).toBeGreaterThan(0);
  });

  it('renders the ROI calculator with a slider', () => {
    renderFitur();
    expect(screen.getByRole('slider')).toBeInTheDocument();
  });

  it('renders the ROI calculator label', () => {
    renderFitur();
    expect(screen.getByText(/Kalkulator ROI/i)).toBeInTheDocument();
  });

  it('updates the slider value on change', () => {
    renderFitur();
    const slider = screen.getByRole('slider');
    fireEvent.change(slider, { target: { value: '10000000' } });
    expect(slider.value).toBe('10000000');
  });

  it('renders the CTA section', () => {
    renderFitur();
    expect(screen.getByText(/Coba Fitur Dasar/i)).toBeInTheDocument();
  });

  it('renders the register CTA button', () => {
    renderFitur();
    expect(screen.getByText(/Buat Toko Online Sekarang/i)).toBeInTheDocument();
  });

  it('renders feature cards with bullets', () => {
    renderFitur();
    expect(screen.getByText('Kustomisasi Domain')).toBeInTheDocument();
    expect(screen.getByText('Integrasi WhatsApp Otomatis')).toBeInTheDocument();
  });
});
