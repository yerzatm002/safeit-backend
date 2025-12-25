const allowedMimeTypes = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // docx
  "application/vnd.openxmlformats-officedocument.presentationml.presentation" // pptx
];

const allowedExtensions = ["pdf", "docx", "pptx"];

function getExtension(filename) {
  const parts = filename.split(".");
  return parts.length > 1 ? parts.pop().toLowerCase() : "";
}

function validateFile(file) {
  if (!file) {
    const err = new Error("File is required");
    err.status = 400;
    throw err;
  }

  const ext = getExtension(file.originalname);
  if (!allowedExtensions.includes(ext)) {
    const err = new Error("Invalid file extension. Allowed: pdf, docx, pptx");
    err.status = 400;
    throw err;
  }

  if (!allowedMimeTypes.includes(file.mimetype)) {
    const err = new Error("Invalid file type. Allowed: pdf, docx, pptx");
    err.status = 400;
    throw err;
  }

  return ext;
}

module.exports = { validateFile, getExtension };
