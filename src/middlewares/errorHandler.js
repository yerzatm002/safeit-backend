const { fail } = require("../utils/response");

function errorHandler(err, req, res, next) {
  console.error("[ERROR]", err);

  const status = err.status || 500;
  const message = err.message || "Internal Server Error";
  if (err.code === "LIMIT_FILE_SIZE") {
  return fail(res, 400, "File is too large. Max size is 20MB");
}
  return fail(res, status, message, err.errors || null);
}

module.exports = errorHandler;
