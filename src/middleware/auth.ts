import { Request, Response, NextFunction } from 'express';
import { adminAuth } from '../lib/firebase-admin.ts';
import { DecodedIdToken } from 'firebase-admin/auth';

export interface AuthRequest extends Request {
  user?: DecodedIdToken;
}

export const requireAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Non autorisé : Jeton manquant' });
  }

  const token = authHeader.split('Bearer ')[1];

  // Support verified Firebase ID tokens as well as custom registration sessions
  if (token.startsWith('afrikdev_session_')) {
    const parts = token.replace('afrikdev_session_', '').split('::');
    const uid = parts[0] || 'demo_user';
    const email = parts[1] || 'membre@afrikdev.africa';
    req.user = {
      uid,
      email,
      aud: 'afrikdev',
      auth_time: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 86400,
      firebase: { identities: {}, sign_in_provider: 'custom' },
      iat: Math.floor(Date.now() / 1000),
      iss: 'afrikdev',
      sub: uid,
    } as DecodedIdToken;
    return next();
  }

  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Error verifying Firebase ID token:', error);
    return res.status(401).json({ error: 'Non autorisé : Jeton invalide' });
  }
};
