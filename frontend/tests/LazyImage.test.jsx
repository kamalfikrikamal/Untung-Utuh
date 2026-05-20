import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import LazyImage from '@/components/ui/LazyImage';

vi.mock('@/hooks/useNetworkStatus', () => ({
  useNetworkStatus: vi.fn(),
}));

import { useNetworkStatus } from '@/hooks/useNetworkStatus';

let intersectCallback;
let observespy;
let disconnectSpy;

beforeEach(() => {
  intersectCallback = null;
  observespy = vi.fn();
  disconnectSpy = vi.fn();

  class MockIntersectionObserver {
    constructor(callback) {
      intersectCallback = callback;
    }
    observe() { observespy(); }
    disconnect() { disconnectSpy(); }
  }
  globalThis.IntersectionObserver = MockIntersectionObserver;

  useNetworkStatus.mockReturnValue({ isSlowConnection: false, isMediumConnection: false });
  vi.clearAllMocks();
});

describe('LazyImage', () => {
  it('renders skeleton placeholder before becoming visible', () => {
    const { container } = render(
      <LazyImage src="https://cdn/img.jpg" alt="test" />
    );
    // The skeleton overlay (aria-hidden pulse div) is visible
    expect(container.querySelector('[aria-hidden="true"]')).toBeTruthy();
    // The actual img is NOT rendered yet
    expect(screen.queryByRole('img')).toBeNull();
  });

  it('renders img element when element enters viewport', () => {
    render(<LazyImage src="https://cdn/img.jpg" alt="product" />);
    act(() => {
      intersectCallback([{ isIntersecting: true }]);
    });
    expect(screen.getByRole('img')).toBeTruthy();
    expect(screen.getByAltText('product')).toBeTruthy();
  });

  it('shows error state on image load error', () => {
    render(<LazyImage src="https://cdn/broken.jpg" alt="broken" />);
    act(() => {
      intersectCallback([{ isIntersecting: true }]);
    });
    const img = screen.getByRole('img');
    fireEvent.error(img);
    expect(screen.queryByRole('img')).toBeNull();
    expect(screen.getByText('📷')).toBeTruthy();
  });

  it('hides skeleton after image loads', () => {
    const { container } = render(
      <LazyImage src="https://cdn/img.jpg" alt="loaded" />
    );
    act(() => {
      intersectCallback([{ isIntersecting: true }]);
    });
    const img = screen.getByRole('img');
    fireEvent.load(img);
    // The skeleton pulse div should be gone
    expect(container.querySelector('.animate-pulse')).toBeNull();
  });

  it('does not render img when src is empty', () => {
    render(<LazyImage src="" alt="empty" />);
    act(() => {
      intersectCallback?.([{ isIntersecting: true }]);
    });
    expect(screen.queryByRole('img')).toBeNull();
  });

  it('does not trigger observer when element is not intersecting', () => {
    render(<LazyImage src="https://cdn/img.jpg" alt="hidden" />);
    act(() => {
      intersectCallback([{ isIntersecting: false }]);
    });
    expect(screen.queryByRole('img')).toBeNull();
  });

  it('uses slow-connection Cloudinary quality when isSlowConnection=true', () => {
    useNetworkStatus.mockReturnValue({ isSlowConnection: true, isMediumConnection: false });
    render(
      <LazyImage src="https://res.cloudinary.com/demo/image/upload/v123/photo.jpg" alt="slow" />
    );
    act(() => {
      intersectCallback([{ isIntersecting: true }]);
    });
    const img = screen.getByRole('img');
    expect(img.src).toContain('q_30');
    expect(img.src).toContain('w_400');
  });

  it('uses medium-connection Cloudinary quality when isMediumConnection=true', () => {
    useNetworkStatus.mockReturnValue({ isSlowConnection: false, isMediumConnection: true });
    render(
      <LazyImage src="https://res.cloudinary.com/demo/image/upload/v123/photo.jpg" alt="mid" />
    );
    act(() => {
      intersectCallback([{ isIntersecting: true }]);
    });
    const img = screen.getByRole('img');
    expect(img.src).toContain('q_60');
    expect(img.src).toContain('w_800');
  });

  it('uses auto quality for fast connection', () => {
    render(
      <LazyImage src="https://res.cloudinary.com/demo/image/upload/v123/photo.jpg" alt="fast" />
    );
    act(() => {
      intersectCallback([{ isIntersecting: true }]);
    });
    const img = screen.getByRole('img');
    expect(img.src).toContain('q_auto');
  });

  it('returns non-Cloudinary URL unchanged', () => {
    render(<LazyImage src="https://example.com/img.jpg" alt="other" />);
    act(() => {
      intersectCallback([{ isIntersecting: true }]);
    });
    const img = screen.getByRole('img');
    expect(img.src).toBe('https://example.com/img.jpg');
  });

  it('accepts className and imgClassName props', () => {
    const { container } = render(
      <LazyImage
        src="https://cdn/img.jpg"
        alt="styled"
        className="wrapper-class"
        imgClassName="img-class"
      />
    );
    expect(container.firstChild.className).toContain('wrapper-class');
    act(() => {
      intersectCallback([{ isIntersecting: true }]);
    });
    expect(screen.getByRole('img').className).toContain('img-class');
  });
});
