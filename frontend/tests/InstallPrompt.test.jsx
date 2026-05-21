import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import InstallPrompt from '../src/components/ui/InstallPrompt';
import * as useInstallPromptModule from '../src/hooks/useInstallPrompt';

describe('InstallPrompt', () => {
  const mockInstall = vi.fn();
  const mockDismiss = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders nothing when canInstall is false', () => {
    vi.spyOn(useInstallPromptModule, 'useInstallPrompt').mockReturnValue({
      canInstall: false,
      isInstalled: false,
      install: mockInstall,
      dismiss: mockDismiss,
    });
    const { container } = render(<InstallPrompt />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders the install banner when canInstall is true', () => {
    vi.spyOn(useInstallPromptModule, 'useInstallPrompt').mockReturnValue({
      canInstall: true,
      isInstalled: false,
      install: mockInstall,
      dismiss: mockDismiss,
    });
    render(<InstallPrompt />);
    expect(screen.getByRole('complementary', { name: 'Install app prompt' })).toBeInTheDocument();
    expect(screen.getByText('Untung Utuh')).toBeInTheDocument();
    expect(screen.getByText('Pasang di layar utama')).toBeInTheDocument();
  });

  it('calls install() when the Pasang button is clicked', () => {
    vi.spyOn(useInstallPromptModule, 'useInstallPrompt').mockReturnValue({
      canInstall: true,
      isInstalled: false,
      install: mockInstall,
      dismiss: mockDismiss,
    });
    render(<InstallPrompt />);
    fireEvent.click(screen.getByText('Pasang'));
    expect(mockInstall).toHaveBeenCalledTimes(1);
  });

  it('calls dismiss() when the Nanti (close) button is clicked', () => {
    vi.spyOn(useInstallPromptModule, 'useInstallPrompt').mockReturnValue({
      canInstall: true,
      isInstalled: false,
      install: mockInstall,
      dismiss: mockDismiss,
    });
    render(<InstallPrompt />);
    fireEvent.click(screen.getByLabelText('Tutup'));
    expect(mockDismiss).toHaveBeenCalledTimes(1);
  });
});
