const { ok } = require("../utils/response");
const authService = require("../services/auth.service");

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const result = await authService.login(email, password);

    return ok(res, result, "Login successful");
  } catch (err) {
    next(err);
  }
}

module.exports = { login };
