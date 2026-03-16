function voterOnly(req, res, next) {
  // Temporarily disable voter role enforcement
  return next();
}

export { voterOnly };
