const router = require("express").Router();

const instructionController = require("../controllers/instruction.controller");

const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");
const validate = require("../middlewares/validate");

const {
  createInstructionSchema,
  updateInstructionSchema,
  instructionIdSchema
} = require("../validators/instruction.schema");

// All instruction endpoints require auth
router.use(authMiddleware);

// Accessible for both admin + user
router.get("/", instructionController.getAllInstructions);
router.get("/:id", validate(instructionIdSchema), instructionController.getInstructionById);

// Admin only
router.post("/", roleMiddleware("admin"), validate(createInstructionSchema), instructionController.createInstruction);
router.put("/:id", roleMiddleware("admin"), validate(updateInstructionSchema), instructionController.updateInstruction);
router.delete("/:id", roleMiddleware("admin"), validate(instructionIdSchema), instructionController.deleteInstruction);

module.exports = router;
