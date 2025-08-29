import jwt from 'jsonwebtoken';

export interface JwtUser {
  id: string;
  email: string;
  name?: string;
}

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

export function signJwt(payload: JwtUser, expiresIn: string | number = '7d') {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

export function verifyJwt<T = JwtUser>(token: string): T | null {
  try {
    return jwt.verify(token, JWT_SECRET) as T;
  } catch {
    return null;
  }
}
