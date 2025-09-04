const jwt = require('jsonwebtoken');

function requireAuth(roles = []) {
  return (req, res, next) => {
    try {
      const hdr = req.headers.authorization || '';
      const token = hdr.startsWith('Bearer ') ? hdr.slice(7) : null;
      if (!token) return res.status(401).json({ message: 'No token' });

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // { id, role }
      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({ message: 'Forbidden' });
      }
      next();
    } catch (e) {
      res.status(401).json({ message: 'Invalid token' });
    }
  };
}
module.exports = { requireAuth };
