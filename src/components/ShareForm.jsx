import { useState } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useLanguage } from '../context/LanguageContext';
import { CATEGORY_CHIP } from '../i18n/translations';
import { submitStory } from '../api/client';
import { useRipple } from '../hooks/useRipple';

const CATEGORIES = ['ngacmova', 'heshta', 'pashë', 'ide'];

export function ShareForm({ sectionRef, onSubmitted }) {
  const { t, tr } = useLanguage();
  const ripple = useRipple();
  const [body, setBody] = useState('');
  const [category, setCategory] = useState('ngacmova');
  const [visibility, setVisibility] = useState('public');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [selfHarm, setSelfHarm] = useState(false);

  const fireConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.65 },
      colors: ['#c084fc', '#f472b6', '#fcd34d', '#67e8f9'],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setSelfHarm(false);
    setLoading(true);
    try {
      const result = await submitStory({ body, category, visibility });
      if (result.flaggedSelfHarm) setSelfHarm(true);
      setMessage(
        visibility === 'private' ? t.submitSuccessPrivate : t.submitSuccessPublic,
      );
      setBody('');
      fireConfetti();
      onSubmitted?.();
    } catch (err) {
      if (err.code === 'rate_limit') setMessage(t.rateLimit);
      else if (err.code === 'too_short') setMessage(t.tooShort);
      else setMessage(t.submitError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section ref={sectionRef} id="share" className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.5 }}
        className="rounded-3xl border border-white/70 bg-white/60 p-6 shadow-lg backdrop-blur-md sm:p-8"
      >
        <h2 className="font-display text-2xl font-bold text-violet-950 sm:text-3xl">{t.shareTitle}</h2>

        {selfHarm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-4 rounded-2xl border border-rose-300 bg-gradient-to-r from-rose-50 to-orange-50 p-4 text-rose-950"
          >
            <p className="font-display font-bold">{t.selfHarmTitle}</p>
            <p className="mt-2 text-sm sm:text-base">{t.selfHarmBody}</p>
            <p className="mt-2 text-sm font-medium">{t.selfHarmHelp}</p>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value.slice(0, 1000))}
              placeholder={t.sharePlaceholder}
              rows={6}
              className="w-full resize-y rounded-2xl border border-violet-200/80 bg-white/90 px-4 py-3 text-base shadow-inner outline-none ring-violet-400 transition focus:ring-2"
            />
            <p className="mt-1 text-right text-sm text-violet-600">{tr('charCount', { n: body.length })}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`rounded-full px-4 py-2 text-sm font-semibold ring-2 transition hover:-translate-y-0.5 ${
                  category === cat
                    ? `${CATEGORY_CHIP[cat]} ring-offset-2`
                    : 'bg-white/80 text-slate-700 ring-transparent hover:ring-violet-200'
                }`}
              >
                {t.categories[cat]}
              </button>
            ))}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {['public', 'private'].map((vis) => (
              <button
                key={vis}
                type="button"
                onClick={() => setVisibility(vis)}
                className={`rounded-2xl border-2 p-4 text-left transition hover:-translate-y-0.5 ${
                  visibility === vis
                    ? 'border-violet-500 bg-violet-50 shadow-md'
                    : 'border-violet-100 bg-white/70'
                }`}
              >
                <span className="font-display font-bold text-violet-950">
                  {vis === 'public' ? t.visibilityPublic : t.visibilityPrivate}
                </span>
                <p className="mt-1 text-sm text-violet-800/75">
                  {vis === 'public' ? t.visibilityPublicHint : t.visibilityPrivateHint}
                </p>
              </button>
            ))}
          </div>

          <p className="flex items-start gap-2 rounded-xl bg-amber-50 px-4 py-3 text-sm font-medium text-amber-950 ring-1 ring-amber-200">
            <span aria-hidden>⚠️</span>
            {t.nameWarning}
          </p>

          {message && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-900 ring-1 ring-emerald-200"
            >
              {message}
            </motion.p>
          )}

          <button
            type="submit"
            disabled={loading || body.trim().length < 10}
            onClick={ripple}
            className="w-full rounded-full bg-violet-600 py-4 font-display text-lg font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:px-12"
          >
            {loading ? t.submitting : t.submit}
          </button>
        </form>
      </motion.div>
    </section>
  );
}
