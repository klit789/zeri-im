import { useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { fetchPublicStories } from '../api/client';
import { StoryCard } from './StoryCard';
import { FloatingHearts } from './FloatingHearts';

const CATEGORIES = ['all', 'ngacmova', 'heshta', 'pashë', 'ide'];

const CATEGORY_ICONS = {
  ngacmova: '🛡️',
  heshta: '🤐',
  'pashë': '👁️',
  ide: '💡',
};

const SORT_ICONS = {
  newest: '🕐',
  supported: '❤️',
};

export function PublicWall({ refreshKey }) {
  const { t } = useLanguage();
  const [stories, setStories] = useState([]);
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState('newest');
  const [loading, setLoading] = useState(true);
  const [hearts, setHearts] = useState([]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchPublicStories({
        category,
        sort: sort === 'supported' ? 'supported' : 'newest',
      });
      setStories(data);
    } catch {
      setStories([]);
    } finally {
      setLoading(false);
    }
  }, [category, sort]);

  useEffect(() => {
    load();
  }, [load, refreshKey]);

  const spawnHeart = (e) => {
    const id = crypto.randomUUID();
    setHearts((h) => [...h, { id, x: e.clientX - 12, y: e.clientY - 12 }]);
    setTimeout(() => setHearts((h) => h.filter((x) => x.id !== id)), 2200);
  };

  return (
    <section id="wall" className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <FloatingHearts hearts={hearts} />
      
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <motion.div
              initial={{ scale: 0, rotate: -90 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center"
            >
              <span className="text-2xl">🧱</span>
            </motion.div>
            <div>
              <h2 className="font-display text-2xl font-bold text-blue-950 sm:text-3xl">{t.wallTitle}</h2>
              <p className="text-sm text-blue-600">{stories.length} {stories.length === 1 ? 'voice' : 'voices'} shared</p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <div className="relative">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="rounded-lg border border-blue-200 bg-white px-4 py-2.5 pr-10 text-sm font-medium text-blue-900 appearance-none cursor-pointer"
              >
                <option value="newest">{SORT_ICONS.newest} {t.sortNewest}</option>
                <option value="supported">{SORT_ICONS.supported} {t.sortSupported}</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-blue-400">⌄</div>
            </div>
            <motion.button
              type="button"
              onClick={load}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="rounded-lg bg-blue-50 px-4 py-2.5 text-sm font-medium text-blue-800 ring-1 ring-blue-200 hover:bg-blue-100 flex items-center gap-2 transition"
            >
              <span>🔄</span>
              {t.refresh}
            </motion.button>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap gap-2"
        >
          {CATEGORIES.map((cat) => (
            <motion.button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.03 * CATEGORIES.indexOf(cat) }}
              className={`rounded-full px-4 py-2 text-sm font-medium flex items-center gap-2 ${
                category === cat
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-blue-50 text-blue-800 hover:bg-blue-100 border border-blue-100'
              }`}
            >
              <span>{cat !== 'all' ? CATEGORY_ICONS[cat] : '📋'}</span>
              {cat === 'all' ? t.filterAll : t.categories[cat]}
            </motion.button>
          ))}
        </motion.div>
      </motion.div>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-4 py-16"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
              className="w-12 h-12 rounded-full border-4 border-blue-200 border-t-blue-600"
            />
            <p className="text-blue-600 font-medium">Loading voices…</p>
            <div className="w-48 h-2 bg-blue-100 rounded-full overflow-hidden">
              <motion.div
                animate={{ width: ['0%', '100%'] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                className="h-full bg-gradient-to-r from-blue-500 to-blue-600"
              />
            </div>
          </motion.div>
        ) : stories.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border-2 border-dashed border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 py-16 px-6 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 150, delay: 0.2 }}
              className="text-6xl mb-4"
            >
              📭
            </motion.div>
            <p className="font-display text-lg font-bold text-blue-700 mb-2">{t.wallEmpty}</p>
            <p className="text-sm text-blue-500 max-w-md mx-auto">
              Be the first to share your story. Your voice matters.
            </p>
            <motion.button
              type="button"
              onClick={() => document.getElementById('share')?.scrollIntoView({ behavior: 'smooth' })}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3 font-display text-base font-semibold text-white shadow-lg hover:bg-blue-700"
            >
              <span>✍️</span>
              Share Your Story
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="masonry"
          >
            {stories.map((s, i) => (
              <StoryCard key={s.id} story={s} index={i} onSupport={spawnHeart} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
