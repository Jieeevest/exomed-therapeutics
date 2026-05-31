export const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export const API_URLS = {
  auth: {
    login:    `${API_BASE}/api/auth/login`,
    register: `${API_BASE}/api/auth/register`,
    refresh:  `${API_BASE}/api/auth/refresh`,
    password: `${API_BASE}/api/auth/me/password`,
  },
  users: {
    me:           `${API_BASE}/api/users/me`,
    profile:      `${API_BASE}/api/users/profile`,
    subscription: `${API_BASE}/api/users/me/subscription`,
    all:          `${API_BASE}/api/users`,
    stats:        `${API_BASE}/api/users/stats`,
  },
  articles: {
    public: `${API_BASE}/api/articles`,
    admin:  `${API_BASE}/api/articles/admin/all`,
  },
  tickets: {
    create: `${API_BASE}/api/tickets`,
    mine:   `${API_BASE}/api/tickets/mine`,
    admin:  `${API_BASE}/api/tickets/admin/all`,
  },
  payment: {
    subscribe: `${API_BASE}/api/payment/subscribe`,
    history:   `${API_BASE}/api/payment/history`,
    admin:     `${API_BASE}/api/payment/admin/all`,
  },
}
