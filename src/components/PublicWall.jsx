import { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { fetchPublicStories } from '../api/client';
import { StoryCard } from './StoryCard';
import { FloatingHearts } from './FloatingHearts';

const CATEGORIES = ['all', 'ngacmova', 'heshta', 'pashë', 'ide'];

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
    <section id="wall" className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <FloatingHearts hearts={hearts} />
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <h2 className="font-display text-2xl font-bold text-violet-950 sm:text-3xl">{t.wallTitle}</h2>
        <div className="flex flex-wrap gap-2">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="rounded-full border border-violet-200 bg-white/80 px-4 py-2 text-sm font-semibold text-violet-900"
          >
            <option value="newest">{t.sortNewest}</option>
            <option value="supported">{t.sortSupported}</option>
          </select>
          <button
            type="button"
            onClick={load}
            className="rounded-full bg-white/80 px-4 py-2 text-sm font-semibold text-violet-800 ring-1 ring-violet-200"
          >
            {t.refresh}
          </button>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setCategory(cat)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              category === cat
                ? 'bg-violet-600 text-white shadow-md'
                : 'bg-white/70 text-violet-800 hover:bg-white'
            }`}
          >
            {cat === 'all' ? t.filterAll : t.categories[cat]}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
            className="h-10 w-10 rounded-full border-4 border-violet-300 border-t-violet-600"
          />
        </div>
      ) : stories.length === 0 ? (
        <p className="rounded-2xl bg-white/50 py-12 text-center text-violet-800">{t.wallEmpty}</p>
      ) : (
        <div className="masonry">
          {stories.map((s, i) => (
            <StoryCard key={s.id} story={s} index={i} onSupport={spawnHeart} />
          ))}
        </div>
      )}
    </section>
  );
}
