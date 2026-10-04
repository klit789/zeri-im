import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

export function HelpSection() {
  const { t } = useLanguage();

  return (
    <section id="help" className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.5 }}
        className="relative rounded-2xl overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800" />
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/10 blur-3xl" aria-hidden />
        <div className="absolute -bottom-30 -left-30 w-96 h-96 rounded-full bg-white/5 blur-3xl" aria-hidden />
        
        <div className="relative z-10 p-6 sm:p-8 text-white">
          <div className="flex items-center gap-3 mb-4">
            <motion.div
              initial={{ scale: 0, rotate: -90 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center"
            >
              <span className="text-3xl">🆘</span>
            </motion.div>
            <div>
              <h2 className="font-display text-2xl font-bold sm:text-3xl">{t.helpTitle}</h2>
              <p className="text-blue-100 text-sm">You don't have to face this alone</p>
            </div>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-2xl text-base sm:text-lg text-blue-100/90 leading-relaxed"
          >
            {t.helpBody}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 grid gap-4 sm:grid-cols-3"
          >
            <motion.a
              href="tel:+355XXXXXXXXX"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group rounded-xl bg-white/10 backdrop-blur-sm p-5 border border-white/20 transition hover:bg-white/20"
            >
              <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <span className="text-2xl">📞</span>
              </div>
              <p className="text-sm text-blue-100/70 uppercase tracking-wider">Call School</p>
              <p className="font-display text-lg font-bold mt-1">{t.helpPhone}</p>
            </motion.a>

            <motion.a
              href={`mailto:${t.helpEmail}`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group rounded-xl bg-white/10 backdrop-blur-sm p-5 border border-white/20 transition hover:bg-white/20"
            >
              <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <span className="text-2xl">✉️</span>
              </div>
              <p className="text-sm text-blue-100/70 uppercase tracking-wider">Email Support</p>
              <p className="font-display text-lg font-bold mt-1 truncate">{t.helpEmail}</p>
            </motion.a>

            <motion.div
              className="group rounded-xl bg-white/10 backdrop-blur-sm p-5 border border-white/20"
            >
              <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center mb-3">
                <span className="text-2xl">🛡️</span>
              </div>
              <p className="text-sm text-blue-100/70 uppercase tracking-wider">Trusted Adult</p>
              <p className="font-display text-lg font-bold mt-1">Teacher / Counselor / Parent</p>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
