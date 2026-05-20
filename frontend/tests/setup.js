import '@testing-library/jest-dom';

// JSDOM does not implement matchMedia — provide a minimal stub
globalThis.matchMedia = globalThis.matchMedia ?? ((query) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: () => {},
  removeListener: () => {},
  addEventListener: () => {},
  removeEventListener: () => {},
  dispatchEvent: () => false,
}));
