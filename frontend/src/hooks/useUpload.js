import { useRef } from 'react';
import api from '@/utils/api';

/**
 * useUpload — thin hook for uploading images to Cloudinary via backend.
 */
export function useUpload() {
  const abortRef = useRef(null);

  const upload = async (file, onProgress) => {
    const formData = new FormData();
    formData.append('image', file);

    const controller = new AbortController();
    abortRef.current = controller;

    const { data } = await api.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      signal: controller.signal,
      onUploadProgress: (e) => {
        if (onProgress && e.total) {
          onProgress(Math.round((e.loaded * 100) / e.total));
        }
      },
    });

    return data.data;
  };

  const cancel = () => abortRef.current?.abort();

  return { upload, cancel };
}
