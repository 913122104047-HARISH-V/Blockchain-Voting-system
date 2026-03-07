const jwt = require("jsonwebtoken");

function authRequired(req, res, next) {
  const tokenHeader = req.headers.authorization || "";
  const token = tokenHeader.startsWith("Bearer ") ? tokenHeader.slice(7) : null;
  if (!token) {
    return res.status(401).json({ message: "Missing auth token" });
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || "dev-secret");
    return next();
  } catch (_err) {
    return res.status(401).json({ message: "Invalid auth token" });
  }
}

module.exports = {
  authRequired,
};
