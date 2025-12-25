const { fail } = require("../utils/response");

function roleMiddleware(requiredRole) {
  return (req, res, next) => {
    if (!req.user || req.user.role !== requiredRole) {
      return fail(res, 403, "Forbidden: insufficient permissions");
    }
    return next();
  };
}

module.exports = roleMiddleware;
