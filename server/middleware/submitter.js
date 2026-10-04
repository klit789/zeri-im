import crypto from 'crypto';

export function getSubmitterHash(req) {
  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket.remoteAddress || 'unknown';
  const ua = req.headers['user-agent'] || '';
  return crypto.createHash('sha256').update(`${ip}|${ua}`).digest('hex');
}
