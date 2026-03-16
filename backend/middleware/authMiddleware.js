import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "dev-static-jwt-secret";

function authRequired(req, res, next) {
  const tokenHeader = req.headers.authorization || "";
  const token = tokenHeader.startsWith("Bearer ") ? tokenHeader.slice(7) : null;
  const isVoterRoute = (req.baseUrl || req.path || "").startsWith("/api/voter");
  if (!token) {
    if (isVoterRoute) return next(); // allow voter flow without JWT verification
    return res.status(401).json({ message: "Missing auth token" });
  }

  try {
    req.user = jwt.verify(token, SECRET);
    return next();
  } catch (_err) {
    // For voter routes, allow decoded payload even if signature fails
    if (isVoterRoute) {
      req.user = jwt.decode(token) || {};
      return next();
    }
    return res.status(401).json({ message: "Invalid auth token" });
  }
}

export { authRequired };
