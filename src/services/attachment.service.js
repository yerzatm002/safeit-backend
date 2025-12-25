const prisma = require("../config/prisma");
const { randomUUID } = require("crypto");
const storageService = require("./storage.service");
const { validateFile } = require("../utils/fileValidation");

async function uploadAttachment(instructionId, file) {
  // Проверка существования инструкции
  const instruction = await prisma.instruction.findUnique({
    where: { id: instructionId }
  });

  if (!instruction) {
    const err = new Error("Instruction not found");
    err.status = 404;
    throw err;
  }

  // Валидация файла
  const ext = validateFile(file);

  // Генерация уникального пути
  const fileId = randomUUID();
  const storagePath = `instructions/${instructionId}/${fileId}.${ext}`;

  // Upload в Supabase Storage
  const { publicUrl, path } = await storageService.uploadFile(
    storagePath,
    file.buffer,
    file.mimetype
  );

  // Запись в БД
  const attachment = await prisma.instructionAttachment.create({
    data: {
      instruction_id: instructionId,
      file_name: file.originalname,
      file_type: ext,
      file_url: publicUrl
    },
    select: {
      id: true,
      instruction_id: true,
      file_name: true,
      file_type: true,
      file_url: true,
      uploaded_at: true
    }
  });

  // Для удаления нам нужно помнить path (storagePath).
  // В таблице нет поля path, но мы можем извлекать его из file_url.
  // Лучше: добавить поле file_path в БД. Это не запрещено ТЗ и сильно упрощает.
  // Пока — вернём attachment + storagePath (для внутренней диагностики).
  return { attachment, storagePath, path };
}

function extractStoragePathFromUrl(fileUrl) {
  // ожидаемый формат:
  // https://xxxx.supabase.co/storage/v1/object/public/<bucket>/<path>
  const marker = "/storage/v1/object/public/";
  const idx = fileUrl.indexOf(marker);
  if (idx === -1) return null;

  const tail = fileUrl.substring(idx + marker.length);
  // tail = "<bucket>/<path>"
  const parts = tail.split("/");
  if (parts.length < 2) return null;
  // remove bucket
  parts.shift();
  return parts.join("/");
}

async function deleteAttachment(attachmentId) {
  const attachment = await prisma.instructionAttachment.findUnique({
    where: { id: attachmentId }
  });

  if (!attachment) {
    const err = new Error("Attachment not found");
    err.status = 404;
    throw err;
  }

  // Вычисляем storage path из URL
  const storagePath = extractStoragePathFromUrl(attachment.file_url);
  if (!storagePath) {
    const err = new Error("Cannot determine storage path from file_url");
    err.status = 500;
    throw err;
  }

  // Удаляем из Supabase Storage
  await storageService.deleteFile(storagePath);

  // Удаляем запись в БД
  await prisma.instructionAttachment.delete({
    where: { id: attachmentId }
  });

  return { id: attachmentId, deleted: true };
}

module.exports = {
  uploadAttachment,
  deleteAttachment
};
