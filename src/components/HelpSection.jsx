import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

export function HelpSection() {
  const { t } = useLanguage();

  return (
    <section id="help" className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="rounded-3xl border-2 border-teal-200 bg-gradient-to-br from-teal-50 via-emerald-50 to-cyan-50 p-8 shadow-lg"
      >
        <h2 className="font-display text-2xl font-bold text-teal-950 sm:text-3xl">{t.helpTitle}</h2>
        <p className="mt-4 max-w-2xl text-lg text-teal-900/90">{t.helpBody}</p>
        <div className="mt-6 rounded-2xl bg-white/70 p-5 ring-1 ring-teal-200/80">
          <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">{t.helpContact}</p>
          <p className="mt-2 font-display text-xl font-bold text-teal-950">{t.helpPhone}</p>
          <a href={`mailto:${t.helpEmail}`} className="mt-1 inline-block text-teal-800 underline">
            {t.helpEmail}
          </a>
        </div>
      </motion.div>
    </section>
  );
}
