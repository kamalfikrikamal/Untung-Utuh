import { render, screen } from '@testing-library/react';
import { vi, describe, it, expect, afterEach } from 'vitest';
import OfflineBanner from '../src/components/ui/OfflineBanner';
import * as useNetworkStatusModule from '../src/hooks/useNetworkStatus';

describe('OfflineBanner', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders nothing when the device is online', () => {
    vi.spyOn(useNetworkStatusModule, 'useNetworkStatus').mockReturnValue({
      isOnline: true,
    });
    const { container } = render(<OfflineBanner />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders the offline alert banner when the device is offline', () => {
    vi.spyOn(useNetworkStatusModule, 'useNetworkStatus').mockReturnValue({
      isOnline: false,
    });
    render(<OfflineBanner />);
    const banner = screen.getByRole('alert');
    expect(banner).toBeInTheDocument();
    expect(banner).toHaveAttribute('aria-live', 'assertive');
    expect(screen.getByText(/offline/i)).toBeInTheDocument();
  });
});
