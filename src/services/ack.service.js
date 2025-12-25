const prisma = require("../config/prisma");

async function acknowledgeInstruction(userId, instructionId) {
  // Проверяем, что инструкция существует
  const instruction = await prisma.instruction.findUnique({
    where: { id: instructionId }
  });

  if (!instruction) {
    const err = new Error("Instruction not found");
    err.status = 404;
    throw err;
  }

  // Upsert по уникальному ключу (user_id + instruction_id)
  const ack = await prisma.instructionAck.upsert({
    where: {
      user_id_instruction_id: {
        user_id: userId,
        instruction_id: instructionId
      }
    },
    update: {
      acknowledged_at: new Date()
    },
    create: {
      user_id: userId,
      instruction_id: instructionId,
      acknowledged_at: new Date()
    },
    select: {
      id: true,
      user_id: true,
      instruction_id: true,
      acknowledged_at: true
    }
  });

  return ack;
}

module.exports = { acknowledgeInstruction };
