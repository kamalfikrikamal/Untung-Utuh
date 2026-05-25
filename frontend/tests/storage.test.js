import { describe, it, expect, beforeEach } from 'vitest';
import { storage } from '@/utils/storage';

describe('storage', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it('getToken returns null when nothing is stored', () => {
    expect(storage.getToken()).toBeNull();
  });

  it('setToken stores the token in sessionStorage', () => {
    storage.setToken('my-token');
    expect(sessionStorage.getItem('auth_token')).toBe('my-token');
  });

  it('getToken returns the stored token', () => {
    storage.setToken('hello-world');
    expect(storage.getToken()).toBe('hello-world');
  });

  it('clearToken removes the token from sessionStorage', () => {
    storage.setToken('to-be-cleared');
    storage.clearToken();
    expect(storage.getToken()).toBeNull();
  });

  it('setToken overwrites a previously stored token', () => {
    storage.setToken('old-token');
    storage.setToken('new-token');
    expect(storage.getToken()).toBe('new-token');
  });
});
