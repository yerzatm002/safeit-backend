const dotenv = require("dotenv");

dotenv.config();

const required = [
  "DATABASE_URL",
  "JWT_SECRET",
  "SUPABASE_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
  "SUPABASE_BUCKET",
  "ADMIN_EMAIL",
  "ADMIN_PASSWORD"
];

required.forEach((key) => {
  if (!process.env[key]) {
    console.warn(`[WARN] Missing env variable: ${key}`);
  }
});

module.exports = {
  PORT: process.env.PORT || 4000,
  NODE_ENV: process.env.NODE_ENV || "development",
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  SUPABASE_URL: process.env.SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  SUPABASE_BUCKET: process.env.SUPABASE_BUCKET,
  ADMIN_EMAIL: process.env.ADMIN_EMAIL,
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
  ADMIN_FULL_NAME: process.env.ADMIN_FULL_NAME || "System Admin",
  ADMIN_GROUP_NAME: process.env.ADMIN_GROUP_NAME || "Administration"
};
