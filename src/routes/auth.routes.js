const router = require("express").Router();

const authController = require("../controllers/auth.controller");
const validate = require("../middlewares/validate");
const { loginSchema } = require("../validators/auth.schema");

router.post("/login", validate(loginSchema), authController.login);

module.exports = router;
