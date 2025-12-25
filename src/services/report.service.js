const prisma = require("../config/prisma");
const { parseDateRange } = require("../utils/dateRange");

/**
 * Instructions report (instruction_ack)
 */
async function getInstructionReport(requestUser, filters) {
  const { user_id, instruction_id, date_from, date_to } = filters;
  const { from, to } = parseDateRange(date_from, date_to);

  const where = {};

  if (requestUser.role === "admin") {
    if (user_id) where.user_id = user_id;
  } else {
    where.user_id = requestUser.id;
  }

  if (instruction_id) where.instruction_id = instruction_id;

  if (from || to) {
    where.acknowledged_at = {};
    if (from) where.acknowledged_at.gte = from;
    if (to) where.acknowledged_at.lte = to;
  }

  const rows = await prisma.instructionAck.findMany({
    where,
    orderBy: { acknowledged_at: "desc" },
    select: {
      acknowledged_at: true,
      user: {
        select: { id: true, full_name: true, email: true, group_name: true }
      },
      instruction: {
        select: { id: true, title: true, type: true }
      }
    }
  });

  return rows;
}

/**
 * Tests report (test_results)
 */
async function getTestReport(requestUser, filters) {
  const { user_id, test_id, instruction_id, date_from, date_to } = filters;
  const { from, to } = parseDateRange(date_from, date_to);

  const where = {};

  if (requestUser.role === "admin") {
    if (user_id) where.user_id = user_id;
  } else {
    where.user_id = requestUser.id;
  }

  if (test_id) where.test_id = test_id;

  if (from || to) {
    where.created_at = {};
    if (from) where.created_at.gte = from;
    if (to) where.created_at.lte = to;
  }

  const rows = await prisma.testResult.findMany({
    where: {
      ...where,
      ...(instruction_id ? { test: { instruction_id } } : {})
    },
    orderBy: { created_at: "desc" },
    select: {
      score: true,
      passed: true,
      created_at: true,
      user: {
        select: { id: true, full_name: true, email: true, group_name: true }
      },
      test: {
        select: {
          id: true,
          title: true,
          pass_score: true,
          instruction: { select: { id: true, title: true } }
        }
      }
    }
  });

  return rows;
}

module.exports = {
  getInstructionReport,
  getTestReport
};
