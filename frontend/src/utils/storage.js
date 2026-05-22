const TOKEN_KEY = 'auth_token';

export const storage = {
  getToken: () => {
    // If backend uses httpOnly cookies, this might be a fallback or just return null
    return sessionStorage.getItem(TOKEN_KEY);
  },
  setToken: (token) => {
    sessionStorage.setItem(TOKEN_KEY, token);
  },
  clearToken: () => {
    sessionStorage.removeItem(TOKEN_KEY);
  },
};
