import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export function Layout({ children }) {
  const { t, setLang } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-fuchsia-50 to-amber-100">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-pink-300/30 blur-3xl" />
        <div className="absolute right-0 top-1/3 h-80 w-80 rounded-full bg-violet-300/30 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-cyan-300/25 blur-3xl" />
      </div>

      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col"
        >
          <span className="font-display text-2xl font-extrabold tracking-tight text-violet-900 sm:text-3xl">
            {t.appName}
          </span>
          <span className="text-sm font-medium text-violet-700/80">{t.school}</span>
        </motion.div>
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={setLang}
            className="rounded-full bg-white/70 px-4 py-2 text-sm font-semibold text-violet-800 shadow-sm ring-1 ring-violet-200/80 backdrop-blur transition hover:bg-white hover:shadow-md"
          >
            {t.langToggle}
          </button>
          <Link
            to="/advocate"
            className="hidden rounded-full bg-violet-600/90 px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-violet-700 sm:inline-block"
          >
            {t.advocateLink}
          </Link>
        </div>
      </header>

      <main className="relative z-10">{children}</main>

      <footer className="relative z-10 mx-auto max-w-6xl px-4 py-10 text-center text-sm text-violet-800/70 sm:px-6">
        {t.footer}
        <Link to="/advocate" className="mt-2 block text-violet-700 underline sm:hidden">
          {t.advocateLink}
        </Link>
      </footer>
    </div>
  );
}
