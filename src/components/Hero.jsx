import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { useRipple } from '../hooks/useRipple';

export function Hero({ onCtaClick }) {
  const { t } = useLanguage();
  const ripple = useRipple();

  return (
    <section className="mx-auto max-w-6xl px-4 pb-8 pt-4 sm:px-6 sm:pb-12">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="rounded-3xl border border-white/60 bg-white/50 p-8 shadow-xl shadow-violet-200/40 backdrop-blur-md sm:p-12"
      >
        <motion.h1
          className="font-display text-4xl font-extrabold leading-tight text-violet-950 sm:text-5xl md:text-6xl"
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
        >
          {t.heroTitle}
          <span className="mt-2 block bg-gradient-to-r from-fuchsia-600 via-violet-600 to-indigo-600 bg-clip-text text-transparent">
            {t.heroSubtitle}
          </span>
        </motion.h1>
        <motion.p
          className="mt-5 max-w-2xl text-lg text-violet-900/85 sm:text-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {t.heroBody}
        </motion.p>
        <motion.button
          type="button"
          onClick={(e) => {
            ripple(e);
            onCtaClick?.();
          }}
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-fuchsia-500 via-violet-500 to-indigo-500 px-8 py-4 font-display text-lg font-bold text-white shadow-lg shadow-violet-400/40 transition hover:-translate-y-0.5 hover:shadow-xl"
          animate={{
            boxShadow: [
              '0 10px 30px rgba(139, 92, 246, 0.35)',
              '0 14px 40px rgba(217, 70, 239, 0.45)',
              '0 10px 30px rgba(139, 92, 246, 0.35)',
            ],
          }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="text-xl" aria-hidden>
            ✦
          </span>
          {t.heroCta}
        </motion.button>
      </motion.div>
    </section>
  );
}
