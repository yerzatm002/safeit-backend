const multer = require("multer");

// В памяти, потом отправляем в Supabase
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 20 * 1024 * 1024 // 20MB
  }
});

module.exports = upload;
