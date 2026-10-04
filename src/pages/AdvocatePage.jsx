import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
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

export function AdvocatePage() {
  const { t } = useLanguage();
  const [token, setToken] = useState(() => sessionStorage.getItem('zeri_advocate_token'));
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(false);
  const [stories, setStories] = useState([]);
  const [category, setCategory] = useState('all');

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

  if (!token) {
    return (
      <div className="mx-auto max-w-md px-4 py-16">
        <motion.form
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleLogin}
          className="rounded-3xl border border-white/70 bg-white/70 p-8 shadow-xl backdrop-blur"
        >
          <h1 className="font-display text-2xl font-bold text-violet-950">{t.advocateTitle}</h1>
          <label className="mt-6 block text-sm font-semibold text-violet-800">{t.advocatePassword}</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2 w-full rounded-xl border border-violet-200 px-4 py-3 outline-none focus:ring-2 focus:ring-violet-400"
          />
          {loginError && <p className="mt-2 text-sm text-rose-600">{t.advocateLoginError}</p>}
          <button type="submit" className="mt-6 w-full rounded-full bg-violet-600 py-3 font-bold text-white">
            {t.advocateLogin}
          </button>
          <Link to="/" className="mt-4 block text-center text-sm text-violet-700 underline">
            ← {t.appName}
          </Link>
        </motion.form>
      </div>
    );
  }

  const danger = stories.filter((s) => s.flaggedSelfHarm);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-2xl font-bold text-violet-950">{t.advocateTitle}</h1>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={load}
            className="rounded-full bg-white/80 px-4 py-2 text-sm font-semibold ring-1 ring-violet-200"
          >
            {t.refresh}
          </button>
          <button
            type="button"
            onClick={logout}
            className="rounded-full bg-slate-800 px-4 py-2 text-sm font-semibold text-white"
          >
            {t.advocateLogout}
          </button>
        </div>
      </div>

      <p className="mt-2 text-sm text-violet-800">{t.advocateAllStories}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setCategory(cat)}
            className={`rounded-full px-3 py-1.5 text-sm font-semibold ${
              category === cat ? 'bg-violet-600 text-white' : 'bg-white/80 text-violet-800'
            }`}
          >
            {cat === 'all' ? t.filterAll : t.categories[cat]}
          </button>
        ))}
      </div>

      {danger.length > 0 && (
        <div className="mt-6 rounded-2xl border-2 border-rose-400 bg-rose-50 p-4">
          <p className="font-display font-bold text-rose-900">{t.advocateFlagDanger}</p>
          <ul className="mt-2 space-y-2">
            {danger.map((s) => (
              <li key={s.id} className="rounded-xl bg-white p-3 text-sm text-rose-950">
                #{s.id} — {s.body.slice(0, 120)}…
              </li>
            ))}
          </ul>
        </div>
      )}

      <ul className="mt-8 space-y-4">
        {stories.map((s) => (
          <motion.li
            key={s.id}
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`rounded-2xl border p-5 shadow-sm ${
              s.flaggedSelfHarm ? 'border-rose-300 bg-rose-50/80' : 'border-violet-100 bg-white/80'
            } ${!s.advocateRead ? 'ring-2 ring-violet-400' : ''}`}
          >
            <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase">
              <span className={`rounded-full px-2 py-1 ${CATEGORY_CHIP[s.category]}`}>
                {t.categories[s.category]}
              </span>
              <span className="text-violet-600">{s.visibility === 'private' ? t.advocatePrivate : 'Public'}</span>
              <span className="text-amber-700">{s.status === 'pending' ? t.advocatePending : s.status}</span>
              {!s.advocateRead && <span className="text-violet-700">{t.advocateUnread}</span>}
              {s.flaggedProfanity && <span className="text-orange-600">profanity</span>}
              {s.flaggedNames && <span className="text-orange-600">names</span>}
            </div>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-slate-800">{s.body}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {!s.advocateRead && (
                <button
                  type="button"
                  onClick={() => markRead(s.id)}
                  className="rounded-full bg-violet-100 px-3 py-1.5 text-xs font-semibold text-violet-800"
                >
                  {t.advocateRead}
                </button>
              )}
              {s.visibility === 'public' && s.status === 'pending' && (
                <button
                  type="button"
                  onClick={async () => {
                    await setStoryStatus(s.id, 'approved');
                    load();
                  }}
                  className="rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white"
                >
                  {t.advocateApprove}
                </button>
              )}
              {s.status === 'approved' && (
                <button
                  type="button"
                  onClick={async () => {
                    await setStoryStatus(s.id, 'hidden');
                    load();
                  }}
                  className="rounded-full bg-amber-500 px-3 py-1.5 text-xs font-semibold text-white"
                >
                  {t.advocateHide}
                </button>
              )}
              <button
                type="button"
                onClick={async () => {
                  if (window.confirm('Delete?')) {
                    await deleteStory(s.id);
                    load();
                  }
                }}
                className="rounded-full bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white"
              >
                {t.advocateDelete}
              </button>
            </div>
          </motion.li>
        ))}
      </ul>
      <Link to="/" className="mt-8 inline-block text-violet-700 underline">
        ← {t.appName}
      </Link>
    </div>
  );
}
