import { renderHook, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { useNetworkStatus } from '../src/hooks/useNetworkStatus';

describe('useNetworkStatus', () => {
  beforeEach(() => {
    Object.defineProperty(navigator, 'onLine', {
      get: vi.fn().mockReturnValue(true),
      configurable: true,
    });
    // No Network Information API by default
    Object.defineProperty(navigator, 'connection', {
      get: vi.fn().mockReturnValue(null),
      configurable: true,
    });
    Object.defineProperty(navigator, 'mozConnection', {
      get: vi.fn().mockReturnValue(null),
      configurable: true,
    });
    Object.defineProperty(navigator, 'webkitConnection', {
      get: vi.fn().mockReturnValue(null),
      configurable: true,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns isOnline=true and 4g defaults when there is no connection API', () => {
    const { result } = renderHook(() => useNetworkStatus());
    expect(result.current.isOnline).toBe(true);
    expect(result.current.effectiveType).toBe('4g');
    expect(result.current.saveData).toBe(false);
    expect(result.current.isSlowConnection).toBe(false);
    expect(result.current.isMediumConnection).toBe(false);
  });

  it('reflects navigator.onLine=false at initial render', () => {
    Object.defineProperty(navigator, 'onLine', {
      get: vi.fn().mockReturnValue(false),
      configurable: true,
    });
    const { result } = renderHook(() => useNetworkStatus());
    expect(result.current.isOnline).toBe(false);
  });

  it('sets isOnline=false when the offline event fires', () => {
    const { result } = renderHook(() => useNetworkStatus());
    act(() => {
      globalThis.dispatchEvent(new Event('offline'));
    });
    expect(result.current.isOnline).toBe(false);
  });

  it('sets isOnline=true when the online event fires', () => {
    Object.defineProperty(navigator, 'onLine', {
      get: vi.fn().mockReturnValue(false),
      configurable: true,
    });
    const { result } = renderHook(() => useNetworkStatus());
    act(() => {
      globalThis.dispatchEvent(new Event('online'));
    });
    expect(result.current.isOnline).toBe(true);
  });

  it('reads effectiveType and saveData from navigator.connection', () => {
    const mockConn = {
      effectiveType: '3g',
      saveData: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };
    Object.defineProperty(navigator, 'connection', {
      get: vi.fn().mockReturnValue(mockConn),
      configurable: true,
    });
    const { result } = renderHook(() => useNetworkStatus());
    expect(result.current.effectiveType).toBe('3g');
    expect(result.current.isMediumConnection).toBe(true);
    expect(result.current.isSlowConnection).toBe(false);
  });

  it('isSlowConnection=true for slow-2g effectiveType', () => {
    const mockConn = {
      effectiveType: 'slow-2g',
      saveData: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };
    Object.defineProperty(navigator, 'connection', {
      get: vi.fn().mockReturnValue(mockConn),
      configurable: true,
    });
    const { result } = renderHook(() => useNetworkStatus());
    expect(result.current.isSlowConnection).toBe(true);
  });

  it('isSlowConnection=true for 2g effectiveType', () => {
    const mockConn = {
      effectiveType: '2g',
      saveData: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };
    Object.defineProperty(navigator, 'connection', {
      get: vi.fn().mockReturnValue(mockConn),
      configurable: true,
    });
    const { result } = renderHook(() => useNetworkStatus());
    expect(result.current.isSlowConnection).toBe(true);
  });

  it('isSlowConnection=true when saveData is true', () => {
    const mockConn = {
      effectiveType: '4g',
      saveData: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };
    Object.defineProperty(navigator, 'connection', {
      get: vi.fn().mockReturnValue(mockConn),
      configurable: true,
    });
    const { result } = renderHook(() => useNetworkStatus());
    expect(result.current.saveData).toBe(true);
    expect(result.current.isSlowConnection).toBe(true);
  });

  it('updates effectiveType and saveData when connection change event fires', () => {
    let changeHandler;
    const mockConn = {
      effectiveType: '4g',
      saveData: false,
      addEventListener: vi.fn((event, handler) => {
        if (event === 'change') changeHandler = handler;
      }),
      removeEventListener: vi.fn(),
    };
    Object.defineProperty(navigator, 'connection', {
      get: vi.fn().mockReturnValue(mockConn),
      configurable: true,
    });

    const { result } = renderHook(() => useNetworkStatus());
    expect(result.current.effectiveType).toBe('4g');

    // Simulate the network degrading to 2g
    mockConn.effectiveType = '2g';
    act(() => {
      if (changeHandler) changeHandler();
    });

    expect(result.current.effectiveType).toBe('2g');
    expect(result.current.isSlowConnection).toBe(true);
  });

  it('onChange skips state update when connection is null', () => {
    let changeHandler;
    // First call returns mockConn (for useEffect setup), subsequent calls return null
    const mockConn = {
      effectiveType: '4g',
      saveData: false,
      addEventListener: vi.fn((event, handler) => {
        if (event === 'change') changeHandler = handler;
      }),
      removeEventListener: vi.fn(),
    };
    const getterMock = vi.fn()
      .mockReturnValueOnce(mockConn)  // useState initialiser for effectiveType
      .mockReturnValueOnce(mockConn)  // useState initialiser for saveData
      .mockReturnValueOnce(mockConn)  // useEffect conn for addEventListener
      .mockReturnValue(null);         // onChange: getConnection() returns null → early return

    Object.defineProperty(navigator, 'connection', {
      get: getterMock,
      configurable: true,
    });

    const { result } = renderHook(() => useNetworkStatus());
    act(() => {
      if (changeHandler) changeHandler();
    });
    // effectiveType should remain '4g' since onChange returned early
    expect(result.current.effectiveType).toBe('4g');
  });

  it('removes online/offline listeners on unmount', () => {
    const removeSpy = vi.spyOn(globalThis, 'removeEventListener');
    const { unmount } = renderHook(() => useNetworkStatus());
    unmount();
    expect(removeSpy).toHaveBeenCalledWith('online', expect.any(Function));
    expect(removeSpy).toHaveBeenCalledWith('offline', expect.any(Function));
  });

  it('removes connection change listener on unmount', () => {
    const mockConn = {
      effectiveType: '4g',
      saveData: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };
    Object.defineProperty(navigator, 'connection', {
      get: vi.fn().mockReturnValue(mockConn),
      configurable: true,
    });

    const { unmount } = renderHook(() => useNetworkStatus());
    unmount();
    expect(mockConn.removeEventListener).toHaveBeenCalledWith('change', expect.any(Function));
  });
});
