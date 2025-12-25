const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/env");
const { fail } = require("../utils/response");

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return fail(res, 401, "Unauthorized: missing Authorization header");
  }

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return fail(res, 401, "Unauthorized: invalid Authorization format");
  }

  const token = parts[1];
  if (!token) {
    return fail(res, 401, "Unauthorized: missing token");
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    return next();
  } catch (err) {
    return fail(res, 401, "Unauthorized: invalid or expired token");
  }
}

module.exports = authMiddleware;
