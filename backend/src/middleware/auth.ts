import { Request, Response, NextFunction } from 'express';
import { verifyJwt, JwtUser } from '../utils/jwt.js';

export interface AuthRequest extends Request {
  user?: JwtUser;
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : undefined;
  if (!token) return res.status(401).json({ error: 'Missing token' });
  const user = verifyJwt<JwtUser>(token);
  if (!user) return res.status(401).json({ error: 'Invalid token' });
  req.user = user;
  next();
}
