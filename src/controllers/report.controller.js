const { ok } = require("../utils/response");
const reportService = require("../services/report.service");
const { generatePdfReport } = require("../services/pdfReport.service");

async function getInstructionReport(req, res, next) {
  try {
    const rows = await reportService.getInstructionReport(req.user, req.query);
    return ok(res, rows, "Instruction report fetched");
  } catch (err) {
    next(err);
  }
}

async function getTestReport(req, res, next) {
  try {
    const rows = await reportService.getTestReport(req.user, req.query);
    return ok(res, rows, "Test report fetched");
  } catch (err) {
    next(err);
  }
}

async function exportPdf(req, res, next) {
  try {
    const instructionRows = await reportService.getInstructionReport(req.user, req.query);
    const testRows = await reportService.getTestReport(req.user, req.query);

    const generatedBy = req.user?.id ? `${req.user.role.toUpperCase()} (${req.user.id})` : null;

    // stream PDF
    generatePdfReport(res, { instructionRows, testRows, generatedBy });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getInstructionReport,
  getTestReport,
  exportPdf
};
