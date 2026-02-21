// ============================================================
//  HUSHDIARY — Root App Component
// ============================================================
import React, { useState } from 'react';
import { ToastProvider } from './components/Toast';
import { Particles } from './components/SharedUI';
import { DB } from './utils/db';
import LoginPage  from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import MainApp    from './pages/MainApp';

export default function App() {
  const [page, setPage] = useState(() => DB.getSession() ? 'app' : 'login');
  const [user, setUser] = useState(() => DB.getSession());

  const handleLogin = (u) => {
    setUser(u);
    setPage('app');
  };

  const handleLogout = () => {
    setUser(null);
    setPage('login');
  };

  return (
    <ToastProvider>
      {/* Film grain overlay */}
      <div className="grain-layer" />
      {/* Vignette */}
      <div className="vignette-layer" />
      {/* Floating particles (only on auth pages) */}
      {page !== 'app' && <Particles />}

      {page === 'login'  && <LoginPage  onNav={setPage} onLogin={handleLogin} />}
      {page === 'signup' && <SignupPage onNav={setPage} onLogin={handleLogin} />}
      {page === 'app' && user && <MainApp user={user} onLogout={handleLogout} />}
    </ToastProvider>
  );
}
