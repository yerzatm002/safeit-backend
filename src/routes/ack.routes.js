const router = require("express").Router();

const authMiddleware = require("../middlewares/authMiddleware");
const validate = require("../middlewares/validate");
const { instructionIdSchema } = require("../validators/instruction.schema");
const ackController = require("../controllers/ack.controller");

// POST /api/instructions/:id/ack
router.post(
  "/:id/ack",
  authMiddleware,
  validate(instructionIdSchema),
  ackController.acknowledgeInstruction
);

module.exports = router;
