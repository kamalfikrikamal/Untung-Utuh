const TOKEN_KEY = 'auth_token';
const SUBSCRIPTION_KEY = 'subscription_status';

export const storage = {
  getToken: () => {
    return sessionStorage.getItem(TOKEN_KEY);
  },
  setToken: (token) => {
    sessionStorage.setItem(TOKEN_KEY, token);
  },
  clearToken: () => {
    sessionStorage.removeItem(TOKEN_KEY);
  },
  getSubscription: () => {
    const sub = sessionStorage.getItem(SUBSCRIPTION_KEY);
    return sub ? JSON.parse(sub) : null;
  },
  setSubscription: (subscription) => {
    sessionStorage.setItem(SUBSCRIPTION_KEY, JSON.stringify(subscription));
  },
  clearSubscription: () => {
    sessionStorage.removeItem(SUBSCRIPTION_KEY);
  },
  clearAll: () => {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(SUBSCRIPTION_KEY);
  },
};
