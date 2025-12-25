const { ok, created } = require("../utils/response");
const attachmentService = require("../services/attachment.service");

async function uploadAttachment(req, res, next) {
  try {
    const { id } = req.params; // instructionId
    const file = req.file;

    const result = await attachmentService.uploadAttachment(id, file);

    // Возвращаем только attachment, без внутренних полей
    return created(res, result.attachment, "Attachment uploaded");
  } catch (err) {
    next(err);
  }
}

async function deleteAttachment(req, res, next) {
  try {
    const { id } = req.params; // attachmentId
    const result = await attachmentService.deleteAttachment(id);
    return ok(res, result, "Attachment deleted");
  } catch (err) {
    next(err);
  }
}

module.exports = {
  uploadAttachment,
  deleteAttachment
};
