const bcrypt = require("bcrypt");
const prisma = require("../src/config/prisma");
const {
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
  ADMIN_FULL_NAME,
  ADMIN_GROUP_NAME
} = require("../src/config/env");

async function main() {
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    throw new Error("Missing ADMIN_EMAIL or ADMIN_PASSWORD in .env");
  }

  const existing = await prisma.user.findUnique({
    where: { email: ADMIN_EMAIL }
  });

  if (existing) {
    console.log(`✅ Admin already exists: ${ADMIN_EMAIL}`);
    return;
  }

  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);

  const admin = await prisma.user.create({
    data: {
      full_name: ADMIN_FULL_NAME || "System Admin",
      group_name: ADMIN_GROUP_NAME || "Administration",
      email: ADMIN_EMAIL,
      password_hash: passwordHash,
      role: "admin"
    }
  });

  console.log("✅ Admin created successfully:");
  console.log({
    id: admin.id,
    email: admin.email,
    role: admin.role,
    full_name: admin.full_name
  });
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
