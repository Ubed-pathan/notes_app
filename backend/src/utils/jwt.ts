import jwt, { Secret, SignOptions } from 'jsonwebtoken';

export interface JwtUser {
  id: string;
  email: string;
  name?: string;
}

const JWT_SECRET: Secret = (process.env.JWT_SECRET || 'dev_secret') as Secret;

export function signJwt(payload: JwtUser, expiresIn: string | number = '7d') {
  const options: SignOptions = { expiresIn } as SignOptions;
  return jwt.sign(payload, JWT_SECRET, options);
}

export function verifyJwt<T = JwtUser>(token: string): T | null {
  try {
    return jwt.verify(token, JWT_SECRET) as T;
  } catch {
    return null;
  }
}
