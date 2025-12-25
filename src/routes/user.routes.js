const router = require("express").Router();

const userController = require("../controllers/user.controller");

const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");
const validate = require("../middlewares/validate");

const {
  createUserSchema,
  updateUserSchema,
  userIdSchema
} = require("../validators/user.schema");

// Admin only
router.use(authMiddleware);
router.use(roleMiddleware("admin"));

router.get("/", userController.getAllUsers);
router.post("/", validate(createUserSchema), userController.createUser);
router.put("/:id", validate(updateUserSchema), userController.updateUser);
router.delete("/:id", validate(userIdSchema), userController.deleteUser);

module.exports = router;
