const prisma = require("../config/prisma");

async function getAllInstructions() {
  return prisma.instruction.findMany({
    select: {
      id: true,
      title: true,
      type: true,
      content: true,
      video_url: true,
      created_at: true,
      updated_at: true
    },
    orderBy: { created_at: "desc" }
  });
}

async function getInstructionById(id) {
  const instruction = await prisma.instruction.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      type: true,
      content: true,
      video_url: true,
      created_at: true,
      updated_at: true,
      attachments: {
        select: {
          id: true,
          file_name: true,
          file_type: true,
          file_url: true,
          uploaded_at: true
        },
        orderBy: { uploaded_at: "desc" }
      }
    }
  });

  if (!instruction) {
    const err = new Error("Instruction not found");
    err.status = 404;
    throw err;
  }

  return instruction;
}

async function createInstruction(data) {
  const instruction = await prisma.instruction.create({
    data: {
      title: data.title,
      type: data.type,
      content: data.content ?? null,
      video_url: data.video_url ?? null
    },
    select: {
      id: true,
      title: true,
      type: true,
      content: true,
      video_url: true,
      created_at: true,
      updated_at: true
    }
  });

  return instruction;
}

async function updateInstruction(id, data) {
  const existing = await prisma.instruction.findUnique({ where: { id } });

  if (!existing) {
    const err = new Error("Instruction not found");
    err.status = 404;
    throw err;
  }

  const updated = await prisma.instruction.update({
    where: { id },
    data: {
      title: data.title ?? undefined,
      type: data.type ?? undefined,
      content: data.content ?? undefined,
      video_url: data.video_url ?? undefined
    },
    select: {
      id: true,
      title: true,
      type: true,
      content: true,
      video_url: true,
      created_at: true,
      updated_at: true
    }
  });

  return updated;
}

async function deleteInstruction(id) {
  const existing = await prisma.instruction.findUnique({ where: { id } });

  if (!existing) {
    const err = new Error("Instruction not found");
    err.status = 404;
    throw err;
  }

  await prisma.instruction.delete({ where: { id } });

  return { id, deleted: true };
}

module.exports = {
  getAllInstructions,
  getInstructionById,
  createInstruction,
  updateInstruction,
  deleteInstruction
};
