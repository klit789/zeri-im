import { useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { CATEGORY_CHIP } from '../i18n/translations';
import {
  advocateLogin,
  deleteStory,
  fetchAdvocateStories,
  markStoryRead,
  setAdvocateToken,
  setStoryStatus,
} from '../api/client';

const CATEGORIES = ['all', 'ngacmova', 'heshta', 'pashë', 'ide'];

const CATEGORY_ICONS = {
  ngacmova: '🛡️',
  heshta: '🤐',
  'pashë': '👁️',
  ide: '💡',
};

const STATUS_ICONS = {
  pending: '⏳',
  approved: '✅',
  hidden: '🙈',
  rejected: '❌',
};

const VISIBILITY_ICONS = {
  public: '🌍',
  private: '🔒',
};

export function AdvocatePage() {
  const { t } = useLanguage();
  const [token, setToken] = useState(() => sessionStorage.getItem('zeri_advocate_token'));
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(false);
  const [stories, setStories] = useState([]);
  const [category, setCategory] = useState('all');
  const [deleteModal, setDeleteModal] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const load = useCallback(async () => {
    if (!token) return;
    try {
      const data = await fetchAdvocateStories(category);
      setStories(data);
    } catch {
      setToken(null);
      setAdvocateToken(null);
    }
  }, [token, category]);

  useEffect(() => {
    load();
  }, [load]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError(false);
    try {
      const { token: jwt } = await advocateLogin(password);
      setAdvocateToken(jwt);
      setToken(jwt);
      setPassword('');
    } catch {
      setLoginError(true);
    }
  };

  const logout = () => {
    setAdvocateToken(null);
    setToken(null);
    setStories([]);
  };

  const markRead = async (id) => {
    await markStoryRead(id);
    setStories((s) => s.map((x) => (x.id === id ? { ...x, advocateRead: true } : x)));
  };

  const openDeleteModal = (story) => {
    setDeleteModal(story);
  };

  const closeDeleteModal = () => {
    setDeleteModal(null);
  };

  const confirmDelete = async () => {
    if (!deleteModal) return;
    setDeletingId(deleteModal.id);
    try {
      await deleteStory(deleteModal.id);
      load();
    } catch {
      // Error handled by UI state
    } finally {
      setDeletingId(null);
      closeDeleteModal();
    }
  };

  if (!token) {
    return (
      <div className="mx-auto max-w-md px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-blue-200 bg-white p-8 shadow-lg"
        >
          <div className="text-center mb-6">
            <span className="text-5xl">🛡️</span>
            <h1 className="mt-3 font-display text-2xl font-bold text-blue-950">{t.advocateTitle}</h1>
            <p className="mt-1 text-sm text-blue-600">Secure access to moderation panel</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-blue-800">{t.advocatePassword}</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full rounded-lg border border-blue-200 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-400 transition"
                placeholder="Enter password"
                autoFocus
              />
            </div>
            {loginError && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-red-600 flex items-center gap-1"
              >
                <span>⚠️</span>
                {t.advocateLoginError}
              </motion.p>
            )}
            <button
              type="submit"
              className="w-full rounded-full bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 transition flex items-center justify-center gap-2"
            >
              <span>🔐</span>
              {t.advocateLogin}
            </button>
          </form>
          <Link to="/" className="mt-4 block text-center text-sm text-blue-600 underline hover:text-blue-800">
            ← {t.appName}
          </Link>
        </motion.div>
      </div>
    );
  }

  const danger = stories.filter((s) => s.flaggedSelfHarm);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap items-center justify-between gap-4 mb-6"
      >
        <div className="flex items-center gap-3">
          <span className="text-3xl">🛡️</span>
          <h1 className="font-display text-xl font-bold text-blue-950 sm:text-2xl">{t.advocateTitle}</h1>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={load}
            className="rounded-lg bg-blue-50 px-4 py-2 text-sm font-medium text-blue-800 ring-1 ring-blue-200 hover:bg-blue-100 flex items-center gap-2 transition"
          >
            <span>🔄</span>
            {t.refresh}
          </button>
          <button
            type="button"
            onClick={logout}
            className="rounded-lg bg-blue-900 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800 flex items-center gap-2 transition"
          >
            <span>🚪</span>
            {t.advocateLogout}
          </button>
        </div>
      </motion.header>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-4 flex flex-wrap items-center gap-2 text-sm text-blue-700"
      >
        <span>📋</span>
        <span>{t.advocateAllStories}</span>
        <span className="text-blue-300">|</span>
        <span className="font-medium text-blue-900">{stories.length} {stories.length === 1 ? 'story' : 'stories'}</span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mb-4 flex flex-wrap gap-1.5"
      >
        {CATEGORIES.map((cat) => (
          <motion.button
            key={cat}
            type="button"
            onClick={() => setCategory(cat)}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.05 * CATEGORIES.indexOf(cat) }}
            className={`rounded-full px-3 py-1.5 text-sm font-medium flex items-center gap-1.5 ${
              category === cat ? 'bg-blue-600 text-white shadow-sm' : 'bg-blue-50 text-blue-800 hover:bg-blue-100'
            }`}
            whileTap={{ scale: 0.97 }}
          >
            <span>{CATEGORY_ICONS[cat] || '📌'}</span>
            {cat === 'all' ? t.filterAll : t.categories[cat]}
          </motion.button>
        ))}
      </motion.div>

      {danger.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mb-6 rounded-xl border-2 border-rose-300 bg-gradient-to-r from-rose-50 to-rose-100 p-4"
        >
          <div className="flex items-center gap-2 text-rose-900 mb-3">
            <span className="text-xl">🚨</span>
            <p className="font-display font-bold">{t.advocateFlagDanger}</p>
            <span className="ml-auto bg-rose-200 text-rose-800 text-xs font-bold px-2 py-0.5 rounded-full">
              {danger.length}
            </span>
          </div>
          <ul className="space-y-2">
            {danger.map((s) => (
              <motion.li
                key={s.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="rounded-lg bg-white/80 p-3 text-sm text-rose-950 border border-rose-200"
              >
                <span className="font-mono text-rose-600">#{s.id}</span>
                <span className="ml-2">{s.body.slice(0, 140)}…</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      )}

      <AnimatePresence>
        {stories.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-2xl border-2 border-dashed border-blue-200 bg-blue-50 py-16 text-center"
          >
            <span className="text-5xl block mb-3">📭</span>
            <p className="text-blue-700 font-medium">No stories found</p>
            <p className="mt-1 text-sm text-blue-500">Try changing the filter or check back later</p>
          </motion.div>
        ) : (
          <motion.ul
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-3"
          >
            {stories.map((s, index) => (
              <motion.li
                key={s.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.03, duration: 0.3 }}
                layout
                className={`rounded-xl border p-4 shadow-sm transition-all ${
                  s.flaggedSelfHarm ? 'border-rose-200 bg-rose-50' : 'border-blue-100 bg-white'
                } ${!s.advocateRead ? 'ring-2 ring-blue-300' : ''} hover:shadow-md`}
              >
                <div className="flex flex-wrap items-center gap-2 text-xs font-medium mb-3">
                  <span className={`rounded-full px-2.5 py-0.5 flex items-center gap-1 ${CATEGORY_CHIP[s.category]}`}>
                    <span>{CATEGORY_ICONS[s.category] || '📌'}</span>
                    {t.categories[s.category]}
                  </span>
                  <span className="flex items-center gap-1 text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                    <span>{VISIBILITY_ICONS[s.visibility]}</span>
                    {s.visibility === 'private' ? t.advocatePrivate : 'Public'}
                  </span>
                  <span className="flex items-center gap-1 text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                    <span>{STATUS_ICONS[s.status]}</span>
                    {s.status === 'pending' ? t.advocatePending : s.status}
                  </span>
                  {!s.advocateRead && (
                    <span className="flex items-center gap-1 text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full animate-pulse">
                      <span>🔵</span>
                      {t.advocateUnread}
                    </span>
                  )}
                  {s.flaggedProfanity && (
                    <span className="flex items-center gap-1 text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">
                      <span>⚠️</span>
                      profanity
                    </span>
                  )}
                  {s.flaggedNames && (
                    <span className="flex items-center gap-1 text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">
                      <span>👤</span>
                      names
                    </span>
                  )}
                </div>
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-800 bg-gray-50/50 rounded-lg p-3 mb-3">{s.body}</p>
                <div className="flex flex-wrap gap-2">
                  {!s.advocateRead && (
                    <motion.button
                      type="button"
                      onClick={() => markRead(s.id)}
                      whileTap={{ scale: 0.95 }}
                      className="rounded-full bg-blue-100 px-3 py-1.5 text-xs font-medium text-blue-800 hover:bg-blue-200 flex items-center gap-1.5 transition"
                    >
                      <span>✓</span>
                      {t.advocateRead}
                    </motion.button>
                  )}
                  {s.visibility === 'public' && s.status === 'pending' && (
                    <motion.button
                      type="button"
                      onClick={async () => {
                        await setStoryStatus(s.id, 'approved');
                        load();
                      }}
                      whileTap={{ scale: 0.95 }}
                      className="rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700 flex items-center gap-1.5 transition"
                    >
                      <span>✅</span>
                      {t.advocateApprove}
                    </motion.button>
                  )}
                  {s.status === 'approved' && (
                    <motion.button
                      type="button"
                      onClick={async () => {
                        await setStoryStatus(s.id, 'hidden');
                        load();
                      }}
                      whileTap={{ scale: 0.95 }}
                      className="rounded-full bg-amber-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-amber-600 flex items-center gap-1.5 transition"
                    >
                      <span>🙈</span>
                      {t.advocateHide}
                    </motion.button>
                  )}
                  <motion.button
                    type="button"
                    onClick={() => openDeleteModal(s)}
                    whileTap={{ scale: 0.95 }}
                    className="rounded-full bg-rose-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-rose-700 flex items-center gap-1.5 transition"
                  >
                    <span>🗑️</span>
                    {t.advocateDelete}
                  </motion.button>
                </div>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-8 pt-6 border-t border-blue-100"
      >
        <Link to="/" className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 underline">
          <span>←</span>
          {t.appName}
        </Link>
      </motion.div>

      <AnimatePresence>
        {deleteModal && (
          <motion.div
            key="delete-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={closeDeleteModal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-modal-title"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 ring-1 ring-blue-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-16 h-16 mx-auto mb-3 rounded-full bg-rose-100 flex items-center justify-center"
                >
                  <span className="text-3xl">🗑️</span>
                </motion.div>
                <h2 id="delete-modal-title" className="font-display text-xl font-bold text-gray-900">
                  Delete Story?
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                  This will permanently remove story <span className="font-mono font-bold text-blue-600">#{deleteModal.id}</span>.
                  This action cannot be undone.
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 mb-4 text-sm text-gray-700">
                <p className="font-medium truncate">{deleteModal.body.slice(0, 100)}…</p>
                <p className="mt-1 text-xs text-gray-500">
                  Category: {t.categories[deleteModal.category]} • {deleteModal.visibility === 'private' ? 'Private' : 'Public'}
                </p>
              </div>
              <div className="flex gap-3">
                <motion.button
                  type="button"
                  onClick={closeDeleteModal}
                  disabled={deletingId !== null}
                  whileTap={{ scale: 0.97 }}
                  className="flex-1 rounded-lg bg-gray-100 py-2.5 font-medium text-gray-700 hover:bg-gray-200 transition disabled:opacity-50"
                >
                  Cancel
                </motion.button>
                <motion.button
                  type="button"
                  onClick={confirmDelete}
                  disabled={deletingId !== null}
                  whileTap={{ scale: 0.97 }}
                  className="flex-1 rounded-lg bg-rose-600 py-2.5 font-medium text-white hover:bg-rose-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {deletingId === deleteModal.id ? (
                    <>
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                      >
                        ⏳
                      </motion.span>
                      Deleting…
                    </>
                  ) : (
                    <>
                      <span>🗑️</span>
                      Delete Permanently
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
