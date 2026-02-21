// ============================================================
//  HUSHDIARY — Toast Notification System
// ============================================================
import React, { useState, useCallback, createContext, useContext } from 'react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((msg, type = 'ok') => {
    const id = Date.now();
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3600);
  }, []);

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      <div style={{
        position: 'fixed', bottom: 28, left: '50%',
        transform: 'translateX(-50%)', zIndex: 99999,
        display: 'flex', flexDirection: 'column',
        gap: 8, alignItems: 'center', pointerEvents: 'none',
      }}>
        {toasts.map(t => (
          <div key={t.id} style={{
            background: t.type === 'err' ? '#3a1010' : '#2c1a0e',
            color: '#e8d5b5',
            padding: '11px 26px',
            borderLeft: `3px solid ${t.type === 'err' ? '#c05050' : '#c49a6c'}`,
            fontFamily: "'Special Elite', cursive",
            fontSize: 12,
            letterSpacing: '1.5px',
            animation: 'toastSlide .4s ease both',
            boxShadow: '0 8px 32px rgba(0,0,0,.55)',
            whiteSpace: 'nowrap',
            maxWidth: '80vw',
          }}>
            {t.msg}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
