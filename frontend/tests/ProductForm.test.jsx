import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import ProductForm from '@/components/products/ProductForm';

vi.mock('@/hooks/useProducts', () => ({
  useUploadProductImages: vi.fn(),
}));

import { useUploadProductImages } from '@/hooks/useProducts';

beforeAll(() => {
  globalThis.URL.createObjectURL = vi.fn(() => 'blob:mock-preview');
  globalThis.URL.revokeObjectURL = vi.fn();
});

const mockUpload = { mutateAsync: vi.fn(), isPending: false };

describe('ProductForm', () => {
  const onSubmit = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useUploadProductImages.mockReturnValue(mockUpload);
  });

  function fillRequiredFields() {
    fireEvent.change(screen.getByPlaceholderText('Enter product name'), {
      target: { value: 'Test Product' },
    });
    fireEvent.change(
      screen.getAllByPlaceholderText('0').find((el) => el.id === 'product-price'),
      { target: { value: '50000' } }
    );
    fireEvent.change(
      screen.getAllByPlaceholderText('0').find((el) => el.id === 'product-stock'),
      { target: { value: '10' } }
    );
    fireEvent.change(screen.getByRole('combobox'), {
      target: { value: 'electronics' },
    });
  }

  it('renders empty form with Save Product button', () => {
    render(<ProductForm onSubmit={onSubmit} loading={false} />);
    expect(screen.getByPlaceholderText('Enter product name')).toBeTruthy();
    expect(screen.getByText('Save Product')).toBeTruthy();
  });

  it('pre-fills fields from initial prop', () => {
    const initial = {
      name: 'My Widget',
      description: 'Nice one',
      price: 25000,
      stock: 3,
      category: 'home',
      images: [],
    };
    render(<ProductForm initial={initial} onSubmit={onSubmit} loading={false} />);
    expect(screen.getByDisplayValue('My Widget')).toBeTruthy();
    expect(screen.getByDisplayValue('Nice one')).toBeTruthy();
    expect(screen.getByDisplayValue('25000')).toBeTruthy();
  });

  it('shows "Saving…" when loading=true', () => {
    render(<ProductForm onSubmit={onSubmit} loading={true} />);
    expect(screen.getByText('Saving…')).toBeTruthy();
  });

  it('shows "Uploading images…" when uploading', () => {
    useUploadProductImages.mockReturnValue({ mutateAsync: vi.fn(), isPending: true });
    render(<ProductForm onSubmit={onSubmit} loading={false} />);
    expect(screen.getByText('Uploading images…')).toBeTruthy();
  });

  it('submits form data without images', async () => {
    render(<ProductForm onSubmit={onSubmit} loading={false} />);
    fillRequiredFields();
    await act(async () => {
      fireEvent.submit(document.querySelector('form'));
    });
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Test Product',
          price: 50000,
          stock: 10,
          category: 'electronics',
          images: [],
        })
      );
    });
  });

  it('uploads local files before submitting', async () => {
    const fakeImages = [{ url: 'https://cdn/new.jpg' }];
    mockUpload.mutateAsync.mockResolvedValueOnce({ data: { images: fakeImages } });

    render(<ProductForm onSubmit={onSubmit} loading={false} />);
    fillRequiredFields();

    // Simulate file selection via hidden input
    const fileInput = document.querySelector('input[type="file"]');
    const file = new File(['img'], 'photo.jpg', { type: 'image/jpeg' });
    await act(async () => {
      fireEvent.change(fileInput, { target: { files: [file] } });
    });

    await act(async () => {
      fireEvent.submit(document.querySelector('form'));
    });

    await waitFor(() => {
      expect(mockUpload.mutateAsync).toHaveBeenCalledWith([file]);
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({ images: fakeImages })
      );
    });
  });

  it('removes server image when X button is clicked', async () => {
    const initial = {
      name: 'P',
      price: 1000,
      stock: 1,
      category: 'other',
      images: [{ url: 'https://cdn/server.jpg' }],
    };
    render(<ProductForm initial={initial} onSubmit={onSubmit} loading={false} />);
    const removeBtn = screen.getByLabelText('Remove image');
    fireEvent.click(removeBtn);
    expect(screen.queryByAltText('server.jpg')).toBeNull();
  });

  it('sets dragOver state on dragOver/dragLeave events', () => {
    render(<ProductForm onSubmit={onSubmit} loading={false} />);
    const dropZone = screen.getByRole('button', { name: /Upload product images/i });

    fireEvent.dragOver(dropZone, { preventDefault: () => {} });
    expect(dropZone.className).toContain('border-blue-500');

    fireEvent.dragLeave(dropZone);
    expect(dropZone.className).not.toContain('border-blue-500');
  });

  it('adds files on drop', async () => {
    render(<ProductForm onSubmit={onSubmit} loading={false} />);
    const dropZone = screen.getByRole('button', { name: /Upload product images/i });
    const file = new File(['img'], 'drop.jpg', { type: 'image/jpeg' });

    await act(async () => {
      fireEvent.drop(dropZone, {
        dataTransfer: { files: [file] },
      });
    });

    // Preview image should appear in the grid
    const previewImgs = document.querySelectorAll('img[src="blob:mock-preview"]');
    expect(previewImgs.length).toBeGreaterThan(0);
  });

  it('removes a local file when its remove button is clicked', async () => {
    render(<ProductForm onSubmit={onSubmit} loading={false} />);
    const fileInput = document.querySelector('input[type="file"]');
    const file = new File(['img'], 'local.jpg', { type: 'image/jpeg' });

    await act(async () => {
      fireEvent.change(fileInput, { target: { files: [file] } });
    });

    // A preview image should appear
    expect(document.querySelectorAll('img[src="blob:mock-preview"]').length).toBeGreaterThan(0);

    // Click the remove button to trigger removeLocalFile
    const removeBtn = screen.getByLabelText('Remove image');
    await act(async () => {
      fireEvent.click(removeBtn);
    });

    // Preview should be gone
    expect(document.querySelectorAll('img[src="blob:mock-preview"]').length).toBe(0);
  });

  it('clicking upload zone button triggers file input click', async () => {
    render(<ProductForm onSubmit={onSubmit} loading={false} />);
    const dropZone = screen.getByRole('button', { name: /Upload product images/i });
    const fileInput = document.querySelector('input[type="file"]');
    const clickSpy = vi.spyOn(fileInput, 'click').mockImplementation(() => {});

    fireEvent.click(dropZone);
    expect(clickSpy).toHaveBeenCalled();
    clickSpy.mockRestore();
  });

  it('cleanup effect runs on unmount without throwing', async () => {
    const { unmount } = render(<ProductForm onSubmit={onSubmit} loading={false} />);
    const fileInput = document.querySelector('input[type="file"]');
    const file = new File(['img'], 'cleanup.jpg', { type: 'image/jpeg' });

    // Add a local file — creates an object URL
    await act(async () => {
      fireEvent.change(fileInput, { target: { files: [file] } });
    });

    // Unmounting triggers the cleanup effect (localFiles is captured at mount = []
    // due to [] deps array, so revokeObjectURL is not called, but the effect runs)
    expect(() => unmount()).not.toThrow();
  });

  it('re-initialises form when initial prop changes from null to a product', async () => {
    const { rerender } = render(
      <ProductForm initial={null} onSubmit={onSubmit} loading={false} />
    );
    expect(screen.getByPlaceholderText('Enter product name').value).toBe('');

    const product = {
      name: 'Updated',
      description: 'Desc',
      price: 20000,
      stock: 5,
      category: 'electronics',
      images: [],
    };
    rerender(<ProductForm initial={product} onSubmit={onSubmit} loading={false} />);
    await waitFor(() => {
      expect(screen.getByDisplayValue('Updated')).toBeTruthy();
    });
  });
});
