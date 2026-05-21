import { renderHook, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { useInstallPrompt } from '../src/hooks/useInstallPrompt';

describe('useInstallPrompt', () => {
  beforeEach(() => {
    // Default: not in standalone (installable) mode
    Object.defineProperty(globalThis, 'matchMedia', {
      value: vi.fn().mockReturnValue({ matches: false }),
      configurable: true,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns canInstall=false and isInstalled=false by default', () => {
    const { result } = renderHook(() => useInstallPrompt());
    expect(result.current.canInstall).toBe(false);
    expect(result.current.isInstalled).toBe(false);
  });

  it('sets isInstalled=true immediately when already in standalone mode', () => {
    Object.defineProperty(globalThis, 'matchMedia', {
      value: vi.fn().mockReturnValue({ matches: true }),
      configurable: true,
    });
    const { result } = renderHook(() => useInstallPrompt());
    expect(result.current.isInstalled).toBe(true);
    expect(result.current.canInstall).toBe(false);
  });

  it('sets canInstall=true when beforeinstallprompt fires', () => {
    const { result } = renderHook(() => useInstallPrompt());

    act(() => {
      const e = new Event('beforeinstallprompt');
      e.preventDefault = vi.fn();
      e.prompt = vi.fn();
      e.userChoice = Promise.resolve({ outcome: 'dismissed' });
      globalThis.dispatchEvent(e);
    });

    expect(result.current.canInstall).toBe(true);
  });

  it('sets isInstalled=true and clears deferredPrompt when appinstalled fires', () => {
    const { result } = renderHook(() => useInstallPrompt());

    // First set deferredPrompt via beforeinstallprompt
    act(() => {
      const e = new Event('beforeinstallprompt');
      e.preventDefault = vi.fn();
      e.prompt = vi.fn();
      e.userChoice = Promise.resolve({ outcome: 'dismissed' });
      globalThis.dispatchEvent(e);
    });
    expect(result.current.canInstall).toBe(true);

    act(() => {
      globalThis.dispatchEvent(new Event('appinstalled'));
    });

    expect(result.current.isInstalled).toBe(true);
    expect(result.current.canInstall).toBe(false);
  });

  it('install() does nothing when deferredPrompt is null', async () => {
    const { result } = renderHook(() => useInstallPrompt());
    await act(async () => {
      await result.current.install();
    });
    expect(result.current.isInstalled).toBe(false);
  });

  it('install() calls prompt() and sets isInstalled=true on accepted outcome', async () => {
    const { result } = renderHook(() => useInstallPrompt());
    const mockPrompt = vi.fn();

    act(() => {
      const e = new Event('beforeinstallprompt');
      e.preventDefault = vi.fn();
      e.prompt = mockPrompt;
      e.userChoice = Promise.resolve({ outcome: 'accepted' });
      globalThis.dispatchEvent(e);
    });

    await act(async () => {
      await result.current.install();
    });

    expect(mockPrompt).toHaveBeenCalledTimes(1);
    expect(result.current.isInstalled).toBe(true);
    expect(result.current.canInstall).toBe(false);
  });

  it('install() keeps isInstalled=false on dismissed outcome', async () => {
    const { result } = renderHook(() => useInstallPrompt());
    const mockPrompt = vi.fn();

    act(() => {
      const e = new Event('beforeinstallprompt');
      e.preventDefault = vi.fn();
      e.prompt = mockPrompt;
      e.userChoice = Promise.resolve({ outcome: 'dismissed' });
      globalThis.dispatchEvent(e);
    });

    await act(async () => {
      await result.current.install();
    });

    expect(result.current.isInstalled).toBe(false);
    // deferredPrompt is cleared regardless
    expect(result.current.canInstall).toBe(false);
  });

  it('dismiss() clears deferredPrompt so canInstall becomes false', () => {
    const { result } = renderHook(() => useInstallPrompt());

    act(() => {
      const e = new Event('beforeinstallprompt');
      e.preventDefault = vi.fn();
      e.prompt = vi.fn();
      e.userChoice = Promise.resolve({ outcome: 'dismissed' });
      globalThis.dispatchEvent(e);
    });
    expect(result.current.canInstall).toBe(true);

    act(() => {
      result.current.dismiss();
    });
    expect(result.current.canInstall).toBe(false);
  });

  it('removes event listeners on unmount', () => {
    const removeSpy = vi.spyOn(globalThis, 'removeEventListener');
    const { unmount } = renderHook(() => useInstallPrompt());
    unmount();
    expect(removeSpy).toHaveBeenCalledWith('beforeinstallprompt', expect.any(Function));
    expect(removeSpy).toHaveBeenCalledWith('appinstalled', expect.any(Function));
  });
});
