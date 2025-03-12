import jwt from 'jsonwebtoken'

export const authenticateToken = async (req, res, next) => {
  const token = req.cookies.yourAuthCookie;

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};