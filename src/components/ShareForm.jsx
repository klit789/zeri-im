import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useLanguage } from '../context/LanguageContext';
import { CATEGORY_CHIP } from '../i18n/translations';
import { submitStory } from '../api/client';
import { useRipple } from '../hooks/useRipple';

const CATEGORIES = ['ngacmova', 'heshta', 'pashë', 'ide'];

const CATEGORY_ICONS = {
  ngacmova: '🛡️',
  heshta: '🤐',
  'pashë': '👁️',
  ide: '💡',
};

const CATEGORY_DESC = {
  ngacmova: 'Someone was mean to you',
  heshta: 'You saw something but stayed quiet',
  'pashë': 'You saw someone being bullied',
  ide: 'Ideas to make school better',
};

const VISIBILITY_ICONS = {
  public: '🌍',
  private: '🔒',
};

export function ShareForm({ sectionRef, onSubmitted }) {
  const { t, tr } = useLanguage();
  const ripple = useRipple();
  const [body, setBody] = useState('');
  const [category, setCategory] = useState('ngacmova');
  const [visibility, setVisibility] = useState('public');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState('success');
  const [selfHarm, setSelfHarm] = useState(false);

  const fireConfetti = () => {
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#3b82f6', '#60a5fa', '#93c5fd', '#1e40af'],
      scalar: 1.2,
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
      setMessageType('success');
      setMessage(
        visibility === 'private' ? t.submitSuccessPrivate : t.submitSuccessPublic,
      );
      setBody('');
      fireConfetti();
      onSubmitted?.();
    } catch (err) {
      setMessageType('error');
      if (err.code === 'rate_limit') setMessage(t.rateLimit);
      else if (err.code === 'too_short') setMessage(t.tooShort);
      else setMessage(t.submitError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section ref={sectionRef} id="share" className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.5 }}
        className="rounded-2xl border border-blue-200 bg-white shadow-sm overflow-hidden"
      >
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-5 sm:px-8">
          <div className="flex items-center gap-3">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
              className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center"
            >
              <span className="text-2xl">✍️</span>
            </motion.div>
            <div>
              <h2 className="font-display text-2xl font-bold text-white">{t.shareTitle}</h2>
              <p className="text-blue-100 text-sm">Your voice matters — share anonymously</p>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8">
          <AnimatePresence mode="wait">
            {selfHarm && (
              <motion.div
                key="selfharm"
                initial={{ opacity: 0, height: 0, y: -10 }}
                animate={{ opacity: 1, height: 'auto', y: 0 }}
                exit={{ opacity: 0, height: 0, y: -10 }}
                className="mb-6 rounded-xl border border-rose-300 bg-gradient-to-r from-rose-50 to-orange-50 p-4 text-rose-950"
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl mt-0.5">💙</span>
                  <div>
                    <p className="font-display font-bold">{t.selfHarmTitle}</p>
                    <p className="mt-2 text-sm sm:text-base">{t.selfHarmBody}</p>
                    <p className="mt-2 text-sm font-medium">{t.selfHarmHelp}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-blue-800 mb-2 flex items-center gap-2">
                <span className="text-lg">📝</span>
                Your Story
              </label>
              <div className="relative">
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value.slice(0, 1000))}
                  placeholder={t.sharePlaceholder}
                  rows={6}
                  className="w-full resize-y rounded-xl border border-blue-200 bg-white px-4 py-3 text-base outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition placeholder:text-blue-400"
                />
                <div className="absolute bottom-2 right-2 flex items-center gap-1 text-sm text-blue-400">
                  <span className="font-mono">{body.length}</span>
                  <span className="text-blue-200">/</span>
                  <span className="font-mono">1000</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-800 mb-2 flex items-center gap-2">
                <span className="text-lg">🏷️</span>
                Category
              </label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                  <motion.button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.05 * CATEGORIES.indexOf(cat) }}
                    className={`rounded-xl px-4 py-3 text-sm font-medium flex flex-col items-center gap-1 min-w-[120px] ${
                      category === cat
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-blue-50 text-blue-800 hover:bg-blue-100 border border-blue-100'
                    }`}
                  >
                    <span className="text-2xl">{CATEGORY_ICONS[cat]}</span>
                    <span className="font-medium">{t.categories[cat]}</span>
                    <span className="text-xs opacity-75">{CATEGORY_DESC[cat]}</span>
                  </motion.button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-800 mb-2 flex items-center gap-2">
                <span className="text-lg">👁️</span>
                Visibility
              </label>
              <div className="grid gap-3 sm:grid-cols-2">
                {['public', 'private'].map((vis) => (
                  <motion.button
                    key={vis}
                    type="button"
                    onClick={() => setVisibility(vis)}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className={`rounded-xl border-2 p-4 text-left flex items-start gap-3 ${
                      visibility === vis
                        ? 'border-blue-500 bg-blue-50 shadow-md'
                        : 'border-blue-100 bg-white hover:bg-blue-50 hover:border-blue-200'
                    }`}
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.1 * (vis === 'public' ? 1 : 2), type: 'spring' }}
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-white shadow-sm"
                    >
                      <span className="text-2xl">{VISIBILITY_ICONS[vis]}</span>
                    </motion.div>
                    <div>
                      <span className="font-display font-bold text-blue-950 block">
                        {vis === 'public' ? t.visibilityPublic : t.visibilityPrivate}
                      </span>
                      <p className="mt-1 text-sm text-blue-700">
                        {vis === 'public' ? t.visibilityPublicHint : t.visibilityPrivateHint}
                      </p>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-3 rounded-xl bg-amber-50 px-4 py-3 text-sm font-medium text-amber-950 ring-1 ring-amber-200"
            >
              <span className="text-lg mt-0.5">⚠️</span>
              <span>{t.nameWarning}</span>
            </motion.div>

            <AnimatePresence mode="wait">
              {message && (
                <motion.div
                  key={messageType}
                  initial={{ opacity: 0, y: -10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.98 }}
                  className={`rounded-xl p-4 text-sm font-medium flex items-start gap-3 ${
                    messageType === 'success'
                      ? 'bg-emerald-50 text-emerald-900 ring-1 ring-emerald-200'
                      : 'bg-rose-50 text-rose-900 ring-1 ring-rose-200'
                  }`}
                >
                  <span className="text-lg mt-0.5">{messageType === 'success' ? '✅' : '⚠️'}</span>
                  <span>{message}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              type="submit"
              disabled={loading || body.trim().length < 10}
              onClick={ripple}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="w-full rounded-full bg-gradient-to-r from-blue-600 to-blue-700 py-4 font-display text-base font-semibold text-white shadow-lg shadow-blue-300/40 transition hover:from-blue-700 hover:to-blue-800 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-blue-600 disabled:hover:to-blue-700 sm:w-auto sm:px-12 flex items-center justify-center gap-2"
            >
              <motion.span
                animate={{ x: loading ? 0 : [0, 5, 0] }}
                transition={{ delay: 0.2, repeat: Infinity, duration: 1.5 }}
              >
                {loading ? '⏳' : '📤'}
              </motion.span>
              {loading ? t.submitting : t.submit}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </section>
  );
}
