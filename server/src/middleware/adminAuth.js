const adminAuth = (req, res, next) => {
  const headerToken = req.headers["x-admin-token"];
  const authHeader = req.headers.authorization;
  const bearerToken = authHeader?.startsWith("Bearer ")
    ? authHeader.slice(7)
    : null;

  const providedToken = headerToken || bearerToken;
  if (!providedToken || providedToken !== process.env.ADMIN_TOKEN) {
    return res.status(401).json({ message: "Unauthorized admin access." });
  }

  return next();
};

module.exports = adminAuth;
