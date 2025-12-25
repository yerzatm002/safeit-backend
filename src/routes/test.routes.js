const router = require("express").Router();

const testController = require("../controllers/test.controller");

const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");
const validate = require("../middlewares/validate");

const {
  createTestSchema,
  testIdSchema,
  submitTestSchema
} = require("../validators/test.schema");

// Все тесты требуют авторизации
router.use(authMiddleware);

// GET list and details accessible for admin + user
router.get("/", testController.getAllTests);
router.get("/:id", validate(testIdSchema), testController.getTestById);

// Admin creates tests
router.post("/", roleMiddleware("admin"), validate(createTestSchema), testController.createTest);

// User submits (admin тоже может, но это не запрещено)
router.post("/:id/submit", validate(submitTestSchema), testController.submitTest);

module.exports = router;
