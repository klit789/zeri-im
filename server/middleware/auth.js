import jwt from 'jsonwebtoken';

export function requireAdvocate(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  try {
    const token = header.slice(7);
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (payload.role !== 'advocate') {
      return res.status(403).json({ error: 'Forbidden' });
    }
    req.advocate = payload;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
}
