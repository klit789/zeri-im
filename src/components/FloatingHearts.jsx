import { AnimatePresence, motion } from 'framer-motion';

const HEART_TYPES = ['❤️', '💙', '💜', '💚', '💛', '🧡', '💖', '💗', '💓', '💕'];

export function FloatingHearts({ hearts }) {
  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      <AnimatePresence>
        {hearts.map((h, i) => (
          <motion.span
            key={h.id}
            initial={{ 
              opacity: 1, 
              x: h.x, 
              y: h.y, 
              scale: 0.5,
              rotate: Math.random() * 30 - 15
            }}
            animate={{ 
              opacity: 0, 
              y: h.y - 80 - Math.random() * 40, 
              x: h.x + (Math.random() - 0.5) * 60,
              scale: 1.2,
              rotate: Math.random() * 60 - 30
            }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ 
              duration: 1.2 + Math.random() * 0.8, 
              ease: 'easeOut',
              delay: Math.random() * 0.1
            }}
            className="absolute text-xl filter drop-shadow-md"
            aria-hidden
            style={{ 
              left: h.x, 
              top: h.y,
              fontSize: `${16 + Math.random() * 12}px`
            }}
          >
            {HEART_TYPES[i % HEART_TYPES.length]}
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  );
}
