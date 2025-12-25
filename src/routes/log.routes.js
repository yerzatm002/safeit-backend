const router = require("express").Router();

const logController = require("../controllers/log.controller");
const authMiddleware = require("../middlewares/authMiddleware");
const validate = require("../middlewares/validate");

const { ackLogQuerySchema, testLogQuerySchema } = require("../validators/log.schema");

router.use(authMiddleware);

// GET /api/logs/acks
router.get("/acks", validate(ackLogQuerySchema), logController.getAckLogs);

// GET /api/logs/tests
router.get("/tests", validate(testLogQuerySchema), logController.getTestLogs);

module.exports = router;
