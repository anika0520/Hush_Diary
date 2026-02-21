// ============================================================
//  HUSHDIARY — Database / Storage Utilities
// ============================================================

export const DB = {
  getUsers: () => {
    try { return JSON.parse(localStorage.getItem('hd_users') || '{}'); }
    catch { return {}; }
  },

  saveUsers: (users) => {
    localStorage.setItem('hd_users', JSON.stringify(users));
  },

  getSession: () => {
    try { return JSON.parse(localStorage.getItem('hd_session')); }
    catch { return null; }
  },

  setSession: (user) => {
    const { password, ...safe } = user;
    localStorage.setItem('hd_session', JSON.stringify(safe));
  },

  clearSession: () => {
    localStorage.removeItem('hd_session');
  },

  getEntries: (uid) => {
    try {
      const data = JSON.parse(localStorage.getItem('hd_entries') || '{}');
      return data[uid] || [];
    } catch { return []; }
  },

  saveEntries: (uid, entries) => {
    try {
      const data = JSON.parse(localStorage.getItem('hd_entries') || '{}');
      data[uid] = entries;
      localStorage.setItem('hd_entries', JSON.stringify(data));
    } catch (e) {
      console.warn('Storage error:', e);
      throw e;
    }
  },

  // Simple hash (not for production use — client-side demo only)
  hash: (pw) => btoa(encodeURIComponent(pw + '_hd_2025')),

  uid: (email) => btoa(email.toLowerCase().trim()).replace(/=/g, ''),
};
