const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'fanfic_twitter_secret_2024';

function authRequired(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: 'Unauthorized' });
  const token = header.split(' ')[1];
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

function authOptional(req, res, next) {
  const header = req.headers.authorization;
  if (header) {
    const token = header.split(' ')[1];
    try {
      req.user = jwt.verify(token, JWT_SECRET);
    } catch {}
  }
  next();
}

module.exports = { authRequired, authOptional, JWT_SECRET };
