import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export function Layout({ children }) {
  const { t, setLang } = useLanguage();
  const navigate = useNavigate();
  const [showAdvocateModal, setShowAdvocateModal] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        setShowAdvocateModal(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const closeAdvocateModal = () => setShowAdvocateModal(false);

  return (
    <div className="min-h-screen bg-blue-50 relative">
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
        <motion.div
          animate={{
            x: [0, 20, 0],
            y: [0, -20, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-blue-200/30 blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -15, 0],
            y: [0, 15, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear', delay: 5 }}
          className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-blue-200/20 blur-3xl"
        />
      </div>

      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col"
        >
          <div className="flex items-center gap-2">
            <motion.span
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="text-2xl sm:text-3xl"
            >
              🛡️
            </motion.span>
            <span className="font-display text-2xl font-extrabold tracking-tight text-blue-900 sm:text-3xl">
              {t.appName}
            </span>
          </div>
          <span className="text-sm font-medium text-blue-700/80">{t.school}</span>
        </motion.div>
        <motion.button
          type="button"
          onClick={setLang}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-800 shadow-sm ring-1 ring-blue-200 transition hover:bg-blue-200 hover:shadow-md flex items-center gap-2"
        >
          <span>🌐</span>
          {t.langToggle}
        </motion.button>
      </header>

      <main className="relative z-10">{children}</main>

      <footer className="relative z-10 mx-auto max-w-6xl px-4 py-10 text-center text-sm text-blue-700/70 sm:px-6">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex items-center justify-center gap-2"
        >
          <span>💙</span>
          {t.footer}
        </motion.p>
      </footer>

      {showAdvocateModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          onClick={closeAdvocateModal}
          role="dialog"
          aria-modal="true"
          aria-labelledby="advocate-modal-title"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 ring-1 ring-blue-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🔐</span>
                <h2 id="advocate-modal-title" className="font-display text-xl font-bold text-blue-900">
                  {t.advocateTitle}
                </h2>
              </div>
              <motion.button
                type="button"
                onClick={closeAdvocateModal}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                className="text-blue-500 hover:text-blue-700 text-2xl leading-none p-1"
                aria-label="Close"
              >
                ×
              </motion.button>
            </div>
            <p className="text-sm text-blue-600 mb-4 flex items-center gap-1">
              <span>⌨️</span>
              {t.advocateLoginHint || 'Press Ctrl+Shift+A to open this panel'}
            </p>
            <AdvocateLoginModal onClose={closeAdvocateModal} />
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

function AdvocateLoginModal({ onClose }) {
  const { t } = useLanguage();
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(false);
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      sessionStorage.setItem('zeri_advocate_token', data.token);
      onClose();
      window.location.href = '/advocate';
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="advocate-password" className="block text-sm font-medium text-blue-800 mb-1">
          {t.advocatePassword}
        </label>
        <input
          id="advocate-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-xl border border-blue-200 px-4 py-3 text-base outline-none focus:ring-2 focus:ring-blue-400 transition"
          placeholder="Enter password"
          autoFocus
        />
      </div>
      {error && <p className="text-sm text-red-600">{t.advocateLoginError}</p>}
      <button
        type="submit"
        disabled={loading || !password.trim()}
        className="w-full rounded-full bg-blue-600 py-3 font-bold text-white transition hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? t.advocateLoginLoading || 'Signing in...' : t.advocateLogin}
      </button>
    </form>
  );
}
