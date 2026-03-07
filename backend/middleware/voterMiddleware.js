function voterOnly(req, res, next) {
  if (!req.user || req.user.role !== "voter") {
    return res.status(403).json({ message: "Voter access required" });
  }
  return next();
}

module.exports = {
  voterOnly,
};
