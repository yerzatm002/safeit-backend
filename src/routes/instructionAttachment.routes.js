const router = require("express").Router();

const attachmentController = require("../controllers/attachment.controller");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");
const upload = require("../middlewares/uploadMiddleware");
const validate = require("../middlewares/validate");
const { instructionIdSchema } = require("../validators/instruction.schema");

// Admin only
router.use(authMiddleware);
router.use(roleMiddleware("admin"));

// POST /api/instructions/:id/attachments
router.post(
  "/:id/attachments",
  validate(instructionIdSchema),
  upload.single("file"),
  attachmentController.uploadAttachment
);

module.exports = router;
