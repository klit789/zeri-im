import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { supportStory, submitReply } from '../api/client';
import { useRipple } from '../hooks/useRipple';

const CATEGORY_STYLES = {
  ngacmova: 'bg-rose-50 border-rose-200',
  heshta: 'bg-amber-50 border-amber-200',
  'pashë': 'bg-sky-50 border-sky-200',
  ide: 'bg-blue-50 border-blue-200',
};

const CATEGORY_ICONS = {
  ngacmova: '🛡️',
  heshta: '🤐',
  'pashë': '👁️',
  ide: '💡',
};

const CATEGORY_LABELS = {
  ngacmova: 'I was bullied',
  heshta: 'I stayed silent',
  'pashë': 'I witnessed bullying',
  ide: 'Ideas for school',
};

export function StoryCard({ story, onSupport, index = 0 }) {
  const { t, tr } = useLanguage();
  const ripple = useRipple();
  const [supportCount, setSupportCount] = useState(story.supportCount);
  const [supported, setSupported] = useState(false);
  const [replyOpen, setReplyOpen] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [replies, setReplies] = useState(story.replies || []);
  const [error, setError] = useState(null);

  const handleSupport = async (e) => {
    ripple(e);
    if (supported) return;
    try {
      const { supportCount: n } = await supportStory(story.id);
      setSupportCount(n);
      setSupported(true);
      onSupport?.(e);
    } catch (err) {
      if (err.code === 'already_supported') {
        setSupported(true);
        setError(t.alreadySupported);
      }
    }
  };

  const handleReply = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await submitReply(story.id, replyText);
      if (res.body) {
        setReplies((prev) => [...prev, { id: res.id, body: res.body, createdAt: new Date().toISOString() }]);
      }
      setReplyText('');
      setReplyOpen(false);
    } catch {
      setError(t.submitError);
    }
  };

  const bgStyle = CATEGORY_STYLES[story.category] || CATEGORY_STYLES.ide;
  const icon = CATEGORY_ICONS[story.category] || '📌';
  const label = CATEGORY_LABELS[story.category] || t.categories[story.category];

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.3 }}
      layout
      className={`masonry-item rounded-xl border p-4 shadow-sm ${bgStyle} transition-all hover:shadow-md`}
    >
      <div className="flex items-start gap-3">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.1 + index * 0.04, type: 'spring', stiffness: 200 }}
          className="w-10 h-10 rounded-lg bg-white/70 flex items-center justify-center flex-shrink-0 ring-1 ring-black/5 shadow-sm"
        >
          <span className="text-xl">{icon}</span>
        </motion.div>
        <div className="flex-1 min-w-0">
          <span className="inline-block rounded-full px-2.5 py-0.5 text-xs font-medium uppercase tracking-wide ring-1 ring-black/5 bg-white/80 text-gray-700">
            {label}
          </span>
          <motion.p
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + index * 0.04 }}
            className="mt-3 whitespace-pre-wrap text-base leading-relaxed text-gray-900"
          >
            {story.body}
          </motion.p>

          <AnimatePresence>
            {replies.length > 0 && (
              <motion.ul
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 space-y-2 border-t border-black/5 pt-3"
              >
                {replies.map((r, i) => (
                  <motion.li
                    key={r.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="rounded-lg bg-white/60 px-3 py-2.5 text-sm text-gray-800 border border-black/5"
                  >
                    {r.body}
                  </motion.li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.04 }}
            className="mt-4 flex flex-wrap items-center gap-2"
          >
            <motion.button
              type="button"
              onClick={handleSupport}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className={`rounded-full px-3 py-1.5 text-sm font-medium flex items-center gap-1.5 transition ${
                supported
                  ? 'bg-gradient-to-r from-rose-500 to-rose-600 text-white shadow-md shadow-rose-300/50'
                  : 'bg-white text-blue-800 hover:bg-blue-50 ring-1 ring-blue-200'
              }`}
            >
              <span>{supported ? '❤️' : '🤍'}</span>
              <span>{t.meToo} · {tr('meTooCount', { n: supportCount })}</span>
            </motion.button>
            <motion.button
              type="button"
              onClick={() => setReplyOpen((o) => !o)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="rounded-full bg-white px-3 py-1.5 text-sm font-medium text-blue-900 hover:bg-blue-50 ring-1 ring-blue-200 flex items-center gap-1.5"
            >
              <span>💬</span>
              {t.addReply}
            </motion.button>
          </motion.div>

          <AnimatePresence>
            {replyOpen && (
              <motion.form
                key="reply"
                initial={{ opacity: 0, height: 0, y: -10 }}
                animate={{ opacity: 1, height: 'auto', y: 0 }}
                exit={{ opacity: 0, height: 0, y: -10 }}
                onSubmit={handleReply}
                className="mt-3 space-y-2"
              >
                <div className="relative">
                  <input
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value.slice(0, 500))}
                    placeholder={t.replyPlaceholder}
                    className="w-full rounded-lg border border-blue-200 bg-white px-10 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition pl-8"
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg">💭</span>
                </div>
                <motion.button
                  type="submit"
                  disabled={replyText.trim().length < 3}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full rounded-full bg-blue-700 px-4 py-2 text-sm font-medium text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition"
                >
                  <span>📤</span>
                  {t.replySend}
                </motion.button>
              </motion.form>
            )}
          </AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 text-xs font-medium text-red-600 flex items-center gap-1"
            >
              <span>⚠️</span>
              {error}
            </motion.p>
          )}
        </div>
      </div>
    </motion.article>
  );
}
