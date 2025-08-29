import { Router } from 'express';
import { z } from 'zod';
import User from '../models/User';
import Otp from '../models/Otp';
import { sendOtpEmail } from '../utils/email';
import { signJwt } from '../utils/jwt';
import { OAuth2Client } from 'google-auth-library';

const router = Router();

const emailSchema = z.object({ email: z.string().email() });

router.post('/request-otp', async (req, res) => {
  try {
    const parsed = emailSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'Invalid email' });

    const { email } = parsed.data;
    const code = (Math.floor(100000 + Math.random() * 900000)).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await Otp.create({ email, code, expiresAt, consumed: false });
    await sendOtpEmail(email, code);

    return res.json({ message: 'OTP sent' });
  } catch (e: any) {
    console.error(e);
    return res.status(500).json({ error: 'Failed to send OTP' });
  }
});

const verifySchema = z.object({
  email: z.string().email(),
  code: z.string().length(6),
  name: z.string().min(1).optional(),
  dateOfBirth: z.string().optional(), // ISO date string from client
});
router.post('/verify-otp', async (req, res) => {
  try {
    const parsed = verifySchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'Invalid payload' });

  const { email, code, name, dateOfBirth } = parsed.data;
    const otp = await Otp.findOne({ email, code, consumed: false, expiresAt: { $gt: new Date() } });
    if (!otp) return res.status(400).json({ error: 'Invalid or expired OTP' });

    otp.consumed = true;
    await otp.save();

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        email,
        provider: 'email',
        name,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
      });
    } else if (name || dateOfBirth) {
      if (name) user.name = name;
      if (dateOfBirth) user.dateOfBirth = new Date(dateOfBirth);
      await user.save();
    }

    const token = signJwt({ id: user.id, email: user.email, name: user.name });
    return res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Failed to verify OTP' });
  }
});

router.post('/google', async (req, res) => {
  try {
    const schema = z.object({ idToken: z.string().min(10) });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'Invalid payload' });

    const clientId = process.env.GOOGLE_CLIENT_ID || '';
    const client = new OAuth2Client(clientId);
    const ticket = await client.verifyIdToken({ idToken: parsed.data.idToken, audience: clientId });
    const payload = ticket.getPayload();
    if (!payload || !payload.email) return res.status(400).json({ error: 'Invalid Google token' });

    let user = await User.findOne({ email: payload.email });
    if (!user) {
      user = await User.create({ email: payload.email, name: payload.name, provider: 'google', googleId: payload.sub });
    }
    const token = signJwt({ id: user.id, email: user.email, name: user.name });
    return res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Google login failed' });
  }
});

export default router;
