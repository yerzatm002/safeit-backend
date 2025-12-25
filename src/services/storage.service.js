const supabase = require("../config/supabase");
const { SUPABASE_BUCKET, SUPABASE_URL } = require("../config/env");

async function uploadFile(path, buffer, contentType) {
  const { data, error } = await supabase.storage
    .from(SUPABASE_BUCKET)
    .upload(path, buffer, {
      contentType,
      upsert: false
    });

  if (error) {
    const err = new Error("Failed to upload file to storage");
    err.status = 500;
    err.errors = error;
    throw err;
  }

  // Public URL (работает если bucket public)
  const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/${SUPABASE_BUCKET}/${data.path}`;
  return { path: data.path, publicUrl };
}

async function deleteFile(path) {
  const { error } = await supabase.storage.from(SUPABASE_BUCKET).remove([path]);

  if (error) {
    const err = new Error("Failed to delete file from storage");
    err.status = 500;
    err.errors = error;
    throw err;
  }

  return true;
}

module.exports = {
  uploadFile,
  deleteFile
};
