import { verifyToken } from '../utils/token.js';

const read = (req) => verifyToken((req.headers.authorization || '').replace('Bearer ', ''));

export const optionalAuth = (req, _res, next) => { req.user = read(req); next(); };

export const requireAuth = (req, res, next) => {
  req.user = read(req);
  if (!req.user) return res.status(401).json({ error: 'Please log in' });
  next();
};
