const { ok } = require("../utils/response");
const logService = require("../services/log.service");

async function getAckLogs(req, res, next) {
  try {
    const logs = await logService.getAckLogs(req.user, req.query);
    return ok(res, logs, "Ack logs fetched");
  } catch (err) {
    next(err);
  }
}

async function getTestLogs(req, res, next) {
  try {
    const logs = await logService.getTestLogs(req.user, req.query);
    return ok(res, logs, "Test logs fetched");
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAckLogs,
  getTestLogs
};
