import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';

const router = Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Too many login attempts' },
});

router.post('/login', loginLimiter, async (req, res) => {
  const { password } = req.body;
  const expected = process.env.ADVOCATE_PASSWORD;
  if (!expected) {
    return res.status(500).json({ error: 'Advocate not configured' });
  }
  const ok =
    password === expected ||
    (await bcrypt.compare(password, expected).catch(() => false));
  if (!ok) {
    return res.status(401).json({ error: 'Invalid password' });
  }
  const token = jwt.sign({ role: 'advocate' }, process.env.JWT_SECRET, {
    expiresIn: '8h',
  });
  res.json({ token });
});

export default router;
