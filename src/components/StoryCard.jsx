import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { CATEGORY_STYLES } from '../i18n/translations';
import { supportStory, submitReply } from '../api/client';
import { useRipple } from '../hooks/useRipple';

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

  const gradient = CATEGORY_STYLES[story.category] || CATEGORY_STYLES.ide;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={`masonry-item rounded-2xl border bg-gradient-to-br p-5 shadow-md ${gradient}`}
    >
      <span className="inline-block rounded-full bg-white/60 px-3 py-1 text-xs font-bold uppercase tracking-wide">
        {t.categories[story.category]}
      </span>
      <p className="mt-3 whitespace-pre-wrap text-base leading-relaxed">{story.body}</p>

      {replies.length > 0 && (
        <ul className="mt-4 space-y-2 border-t border-black/5 pt-3">
          {replies.map((r) => (
            <li key={r.id} className="rounded-xl bg-white/50 px-3 py-2 text-sm">
              {r.body}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={handleSupport}
          className={`relative rounded-full px-4 py-2 text-sm font-bold transition hover:shadow-md ${
            supported ? 'bg-violet-600 text-white' : 'bg-white/80 text-violet-800 hover:bg-white'
          }`}
        >
          {t.meToo} · {tr('meTooCount', { n: supportCount })}
        </button>
        <button
          type="button"
          onClick={() => setReplyOpen((o) => !o)}
          className="rounded-full bg-white/60 px-4 py-2 text-sm font-semibold text-violet-900 hover:bg-white/90"
        >
          {t.addReply}
        </button>
      </div>

      {replyOpen && (
        <form onSubmit={handleReply} className="mt-3 space-y-2">
          <input
            value={replyText}
            onChange={(e) => setReplyText(e.target.value.slice(0, 500))}
            placeholder={t.replyPlaceholder}
            className="w-full rounded-xl border border-violet-200 bg-white/90 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-400"
          />
          <button
            type="submit"
            disabled={replyText.trim().length < 3}
            className="rounded-full bg-violet-700 px-4 py-1.5 text-sm font-semibold text-white disabled:opacity-50"
          >
            {t.replySend}
          </button>
        </form>
      )}
      {error && <p className="mt-2 text-xs font-medium text-rose-700">{error}</p>}
    </motion.article>
  );
}
