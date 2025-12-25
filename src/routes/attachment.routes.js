const router = require("express").Router();

const attachmentController = require("../controllers/attachment.controller");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");
const validate = require("../middlewares/validate");
const { z } = require("zod");

const attachmentIdSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid attachment id")
  })
});

// Admin only
router.use(authMiddleware);
router.use(roleMiddleware("admin"));

// DELETE /api/attachments/:id
router.delete("/:id", validate(attachmentIdSchema), attachmentController.deleteAttachment);

module.exports = router;
