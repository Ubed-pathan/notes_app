import { Router } from 'express';
import { z } from 'zod';
import Note from '../models/Note';
import { requireAuth, AuthRequest } from '../middleware/auth';

const router = Router();

router.get('/', requireAuth, async (req: AuthRequest, res) => {
  const notes = await Note.find({ userId: req.user!.id }).sort({ createdAt: -1 });
  return res.json({ notes });
});

router.post('/', requireAuth, async (req: AuthRequest, res) => {
  const schema = z.object({ title: z.string().min(1), content: z.string().optional() });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid payload' });
  const note = await Note.create({ userId: req.user!.id, title: parsed.data.title, content: parsed.data.content || '' });
  return res.status(201).json({ note });
});

router.delete('/:id', requireAuth, async (req: AuthRequest, res) => {
  const { id } = req.params;
  const deleted = await Note.findOneAndDelete({ _id: id, userId: req.user!.id });
  if (!deleted) return res.status(404).json({ error: 'Not found' });
  return res.json({ success: true });
});

export default router;
