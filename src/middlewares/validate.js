const { fail } = require("../utils/response");

function validate(schema) {
  return (req, res, next) => {
    try {
      schema.parse({
        body: req.body,
        params: req.params,
        query: req.query
      });
      next();
    } catch (err) {
      return fail(res, 422, "Validation error", err.errors);
    }
  };
}

module.exports = validate;
