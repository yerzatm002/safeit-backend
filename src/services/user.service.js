const bcrypt = require("bcrypt");
const prisma = require("../config/prisma");

async function getAllUsers() {
  return prisma.user.findMany({
    select: {
      id: true,
      full_name: true,
      group_name: true,
      email: true,
      role: true,
      created_at: true,
      updated_at: true
    },
    orderBy: { created_at: "desc" }
  });
}

async function createUser(data) {
  const existing = await prisma.user.findUnique({
    where: { email: data.email }
  });

  if (existing) {
    const err = new Error("User with this email already exists");
    err.status = 409;
    throw err;
  }

  const passwordHash = await bcrypt.hash(data.password, 10);

  const user = await prisma.user.create({
    data: {
      full_name: data.full_name,
      group_name: data.group_name ?? null,
      email: data.email,
      password_hash: passwordHash,
      role: data.role || "user"
    },
    select: {
      id: true,
      full_name: true,
      group_name: true,
      email: true,
      role: true,
      created_at: true,
      updated_at: true
    }
  });

  return user;
}

async function updateUser(id, data) {
  const user = await prisma.user.findUnique({
    where: { id }
  });

  if (!user) {
    const err = new Error("User not found");
    err.status = 404;
    throw err;
  }

  // Если меняют email — проверяем уникальность
  if (data.email && data.email !== user.email) {
    const existing = await prisma.user.findUnique({
      where: { email: data.email }
    });

    if (existing) {
      const err = new Error("User with this email already exists");
      err.status = 409;
      throw err;
    }
  }

  let passwordHash;
  if (data.password) {
    passwordHash = await bcrypt.hash(data.password, 10);
  }

  const updated = await prisma.user.update({
    where: { id },
    data: {
      full_name: data.full_name ?? undefined,
      group_name: data.group_name ?? undefined,
      email: data.email ?? undefined,
      role: data.role ?? undefined,
      password_hash: passwordHash ?? undefined
    },
    select: {
      id: true,
      full_name: true,
      group_name: true,
      email: true,
      role: true,
      created_at: true,
      updated_at: true
    }
  });

  return updated;
}

async function deleteUser(id) {
  const user = await prisma.user.findUnique({ where: { id } });

  if (!user) {
    const err = new Error("User not found");
    err.status = 404;
    throw err;
  }

  await prisma.user.delete({ where: { id } });

  return { id, deleted: true };
}

module.exports = {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser
};
