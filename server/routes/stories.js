import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import pool from '../db/pool.js';
import { analyzeStory, filterPublicText } from '../lib/moderation.js';
import { getSubmitterHash } from '../middleware/submitter.js';
import { requireAdvocate } from '../middleware/auth.js';

const router = Router();

const submitLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: { error: 'rate_limit' },
  standardHeaders: true,
  legacyHeaders: false,
});

const supportLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  message: { error: 'rate_limit' },
});

function mapPublicStory(row, replies = []) {
  return {
    id: row.id,
    body: filterPublicText(row.body),
    category: row.category,
    supportCount: row.support_count,
    createdAt: row.created_at,
    replies: replies.map((r) => ({
      id: r.id,
      body: filterPublicText(r.body),
      createdAt: r.created_at,
    })),
  };
}

router.get('/public', async (req, res) => {
  try {
    const category = req.query.category;
    const sort = req.query.sort === 'supported' ? 'supported' : 'newest';
    let sql = `
      SELECT id, body, category, support_count, created_at
      FROM stories
      WHERE visibility = 'public' AND status = 'approved'
    `;
    const params = [];
    if (category && category !== 'all') {
      sql += ' AND category = ?';
      params.push(category);
    }
    sql += sort === 'supported' ? ' ORDER BY support_count DESC, created_at DESC' : ' ORDER BY created_at DESC';
    sql += ' LIMIT 100';
    const [rows] = await pool.query(sql, params);
    if (rows.length === 0) {
      return res.json([]);
    }
    const ids = rows.map((r) => r.id);
    const [replyRows] = await pool.query(
      `SELECT id, story_id, body, created_at FROM replies
       WHERE story_id IN (?) AND status = 'approved' ORDER BY created_at ASC`,
      [ids],
    );
    const byStory = replyRows.reduce((acc, r) => {
      (acc[r.story_id] ||= []).push(r);
      return acc;
    }, {});
    res.json(rows.map((row) => mapPublicStory(row, byStory[row.id] || [])));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', submitLimiter, async (req, res) => {
  try {
    const { body, category, visibility } = req.body;
    if (!body || typeof body !== 'string' || body.trim().length < 10) {
      return res.status(400).json({ error: 'too_short' });
    }
    if (body.length > 1000) {
      return res.status(400).json({ error: 'too_long' });
    }
    const validCategories = ['ngacmova', 'heshta', 'pashë', 'ide'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({ error: 'invalid_category' });
    }
    const vis = visibility === 'private' ? 'private' : 'public';
    const flags = analyzeStory(body);
    const submitterHash = getSubmitterHash(req);

    const status = vis === 'public' ? 'pending' : 'approved';

    const [result] = await pool.query(
      `INSERT INTO stories (body, category, visibility, status, flagged_self_harm, flagged_profanity, flagged_names, submitter_hash)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        body.trim(),
        category,
        vis,
        status,
        flags.flaggedSelfHarm ? 1 : 0,
        flags.flaggedProfanity ? 1 : 0,
        flags.flaggedNames ? 1 : 0,
        submitterHash,
      ],
    );

    res.status(201).json({
      id: result.insertId,
      visibility: vis,
      status,
      flaggedSelfHarm: flags.flaggedSelfHarm,
      flaggedNames: flags.flaggedNames,
      message:
        vis === 'public'
          ? 'pending_review'
          : 'private_saved',
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/:id/support', supportLimiter, async (req, res) => {
  try {
    const storyId = Number(req.params.id);
    if (!storyId) return res.status(400).json({ error: 'Invalid id' });
    const hash = getSubmitterHash(req);

    const [stories] = await pool.query(
      `SELECT id FROM stories WHERE id = ? AND visibility = 'public' AND status = 'approved'`,
      [storyId],
    );
    if (stories.length === 0) return res.status(404).json({ error: 'Not found' });

    try {
      await pool.query(
        'INSERT INTO story_supports (story_id, supporter_hash) VALUES (?, ?)',
        [storyId, hash],
      );
      await pool.query('UPDATE stories SET support_count = support_count + 1 WHERE id = ?', [storyId]);
    } catch (e) {
      if (e.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ error: 'already_supported' });
      }
      throw e;
    }

    const [[row]] = await pool.query('SELECT support_count FROM stories WHERE id = ?', [storyId]);
    res.json({ supportCount: row.support_count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/:id/replies', submitLimiter, async (req, res) => {
  try {
    const storyId = Number(req.params.id);
    const { body } = req.body;
    if (!body || body.trim().length < 3 || body.length > 500) {
      return res.status(400).json({ error: 'invalid_reply' });
    }
    const [stories] = await pool.query(
      `SELECT id FROM stories WHERE id = ? AND visibility = 'public' AND status = 'approved'`,
      [storyId],
    );
    if (stories.length === 0) return res.status(404).json({ error: 'Not found' });

    const flags = analyzeStory(body);
    const status = flags.flaggedProfanity || flags.flaggedNames ? 'pending' : 'approved';

    const [result] = await pool.query(
      'INSERT INTO replies (story_id, body, status) VALUES (?, ?, ?)',
      [storyId, body.trim(), status],
    );

    res.status(201).json({
      id: result.insertId,
      status,
      body: status === 'approved' ? filterPublicText(body.trim()) : undefined,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/advocate/all', requireAdvocate, async (req, res) => {
  try {
    const category = req.query.category;
    let sql = `
      SELECT id, body, category, visibility, status, support_count,
             flagged_self_harm, flagged_profanity, flagged_names, advocate_read, created_at
      FROM stories
      WHERE 1=1
    `;
    const params = [];
    if (category && category !== 'all') {
      sql += ' AND category = ?';
      params.push(category);
    }
    sql += ` ORDER BY flagged_self_harm DESC, advocate_read ASC, created_at DESC LIMIT 500`;
    const [rows] = await pool.query(sql, params);
    res.json(
      rows.map((r) => ({
        id: r.id,
        body: r.body,
        category: r.category,
        visibility: r.visibility,
        status: r.status,
        supportCount: r.support_count,
        flaggedSelfHarm: !!r.flagged_self_harm,
        flaggedProfanity: !!r.flagged_profanity,
        flaggedNames: !!r.flagged_names,
        advocateRead: !!r.advocate_read,
        createdAt: r.created_at,
      })),
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.patch('/advocate/:id/read', requireAdvocate, async (req, res) => {
  try {
    await pool.query('UPDATE stories SET advocate_read = 1 WHERE id = ?', [req.params.id]);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.patch('/advocate/:id/status', requireAdvocate, async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ['pending', 'approved', 'hidden', 'rejected'];
    if (!allowed.includes(status)) return res.status(400).json({ error: 'Invalid status' });
    await pool.query('UPDATE stories SET status = ? WHERE id = ?', [status, req.params.id]);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/advocate/:id', requireAdvocate, async (req, res) => {
  try {
    await pool.query('DELETE FROM stories WHERE id = ?', [req.params.id]);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
