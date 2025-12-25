const { ok } = require("../utils/response");
const ackService = require("../services/ack.service");

async function acknowledgeInstruction(req, res, next) {
  try {
    const userId = req.user.id;
    const instructionId = req.params.id;

    const ack = await ackService.acknowledgeInstruction(userId, instructionId);

    return ok(res, ack, "Acknowledged");
  } catch (err) {
    next(err);
  }
}

module.exports = { acknowledgeInstruction };
