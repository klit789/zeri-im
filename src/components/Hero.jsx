import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { useRipple } from '../hooks/useRipple';

export function Hero({ onCtaClick }) {
  const { t } = useLanguage();
  const ripple = useRipple();

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative rounded-2xl border border-blue-200 bg-white p-8 shadow-sm sm:p-12 overflow-hidden"
      >
        <div className="absolute -top-10 -right-10 w-64 h-64 rounded-full bg-blue-100/50 blur-3xl" aria-hidden />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-blue-100/30 blur-3xl" aria-hidden />
        
        <div className="relative z-10 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-center gap-3 mb-4"
          >
            <motion.span
              initial={{ scale: 0, rotate: -90 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="text-4xl"
            >
              🛡️
            </motion.span>
            <span className="font-display text-lg font-bold text-blue-600 uppercase tracking-wider">
              SHFK Penestia
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-display text-3xl font-bold leading-tight text-blue-950 sm:text-4xl md:text-5xl"
          >
            {t.heroTitle}
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-2 block text-blue-600 font-medium"
            >
              {t.heroSubtitle}
            </motion.span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="mt-5 max-w-2xl text-base text-blue-900/80 sm:text-lg leading-relaxed"
          >
            {t.heroBody}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <motion.button
              type="button"
              onClick={(e) => {
                ripple(e);
                onCtaClick?.();
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-7 py-3.5 font-display text-base font-semibold text-white shadow-lg shadow-blue-300/40 transition hover:bg-blue-700 hover:shadow-xl"
            >
              <span className="text-lg" aria-hidden>✍️</span>
              {t.heroCta}
            </motion.button>
            <motion.button
              type="button"
              onClick={() => document.getElementById('wall')?.scrollIntoView({ behavior: 'smooth' })}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 font-display text-base font-semibold text-blue-700 border border-blue-200 shadow-sm transition hover:bg-blue-50 hover:border-blue-300"
            >
              <span className="text-lg" aria-hidden>📖</span>
              Read Stories
            </motion.button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55 }}
            className="mt-10 flex flex-wrap gap-6 text-sm text-blue-600"
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">🔒</span>
              <span>Anonymous</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg">🛡️</span>
              <span>Safe Space</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg">💙</span>
              <span>Respectful</span>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
