import { AnimatePresence, motion } from 'framer-motion';

export function FloatingHearts({ hearts }) {
  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      <AnimatePresence>
        {hearts.map((h) => (
          <motion.span
            key={h.id}
            initial={{ opacity: 1, x: h.x, y: h.y, scale: 0.6 }}
            animate={{ opacity: 0, y: h.y - 100, scale: 1.2 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2, ease: 'easeOut' }}
            className="absolute text-2xl"
            aria-hidden
          >
            💜
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  );
}
