const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Admin = require("../models/admin");

// General protect middleware
exports.protect = async (req, res, next) => {
  let token;
  if (!req.headers.authorization || !req.headers.authorization.startsWith("Bearer")) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role === "admin") {
      req.admin = await Admin.findById(decoded.id).select("-password");
    } else {
      req.user = await User.findById(decoded.id).select("-password -otp -otpExpires");
    }
    next();
  } catch (err) {
    return res.status(401).json({ message: "Not authorized, token invalid" });
  }
};


// Only admin can access
exports.adminProtect = (req, res, next) => {
  if (!req.admin) return res.status(403).json({ message: "Admin access only" });
  next();
};
