const router = require("express").Router();

const reportController = require("../controllers/report.controller");

const authMiddleware = require("../middlewares/authMiddleware");
const validate = require("../middlewares/validate");

const {
  instructionReportQuerySchema,
  testReportQuerySchema,
  pdfReportQuerySchema
} = require("../validators/report.schema");

// all reports require auth
router.use(authMiddleware);

router.get("/instructions", validate(instructionReportQuerySchema), reportController.getInstructionReport);
router.get("/tests", validate(testReportQuerySchema), reportController.getTestReport);
router.get("/export/pdf", validate(pdfReportQuerySchema), reportController.exportPdf);

module.exports = router;
