const prisma = require("../config/prisma");

/**
 * Admin creates test with questions + answers
 */
async function createTest(data) {
  // check instruction exists
  const instruction = await prisma.instruction.findUnique({
    where: { id: data.instruction_id }
  });

  if (!instruction) {
    const err = new Error("Instruction not found");
    err.status = 404;
    throw err;
  }

  // validate: each question must have exactly ONE correct answer
  for (const q of data.questions) {
    const correctCount = q.answers.filter((a) => a.is_correct).length;
    if (correctCount !== 1) {
      const err = new Error(
        "Each question must have exactly one correct answer"
      );
      err.status = 400;
      throw err;
    }
  }

  const test = await prisma.test.create({
    data: {
      instruction_id: data.instruction_id,
      title: data.title,
      pass_score: data.pass_score ?? 70,
      questions: {
        create: data.questions.map((q) => ({
          text: q.text,
          answers: {
            create: q.answers.map((a) => ({
              text: a.text,
              is_correct: a.is_correct
            }))
          }
        }))
      }
    },
    select: {
      id: true,
      instruction_id: true,
      title: true,
      pass_score: true,
      created_at: true,
      questions: {
        select: {
          id: true,
          text: true,
          answers: {
            select: { id: true, text: true, is_correct: true }
          }
        }
      }
    }
  });

  return test;
}

/**
 * User/Admin get list of tests
 * - returns only safe data (without is_correct)
 */
async function getAllTests() {
  return prisma.test.findMany({
    select: {
      id: true,
      instruction_id: true,
      title: true,
      pass_score: true,
      created_at: true
    },
    orderBy: { created_at: "desc" }
  });
}

/**
 * User/Admin get test by id with questions+answers (NO is_correct)
 */
async function getTestByIdSafe(testId) {
  const test = await prisma.test.findUnique({
    where: { id: testId },
    select: {
      id: true,
      instruction_id: true,
      title: true,
      pass_score: true,
      created_at: true,
      questions: {
        select: {
          id: true,
          text: true,
          answers: {
            select: { id: true, text: true } // no is_correct
          }
        }
      }
    }
  });

  if (!test) {
    const err = new Error("Test not found");
    err.status = 404;
    throw err;
  }

  return test;
}

/**
 * User submits answers:
 * - checks correctness
 * - calculates score
 * - stores test_result
 */
async function submitTest(userId, testId, answersPayload) {
  // fetch test with correct answers
  const test = await prisma.test.findUnique({
    where: { id: testId },
    select: {
      id: true,
      pass_score: true,
      questions: {
        select: {
          id: true,
          answers: {
            select: { id: true, is_correct: true }
          }
        }
      }
    }
  });

  if (!test) {
    const err = new Error("Test not found");
    err.status = 404;
    throw err;
  }

  const questions = test.questions;

  // map: questionId -> correctAnswerId
  const correctMap = new Map();
  for (const q of questions) {
    const correct = q.answers.find((a) => a.is_correct);
    if (correct) {
      correctMap.set(q.id, correct.id);
    }
  }

  // scoring
  let correctCount = 0;

  // ensure user answered for existing questions only
  for (const item of answersPayload) {
    if (!correctMap.has(item.questionId)) {
      const err = new Error("Invalid questionId in submitted answers");
      err.status = 400;
      throw err;
    }
  }

  // count correct by comparing submitted answer with correct answer
  for (const q of questions) {
    const submitted = answersPayload.find((a) => a.questionId === q.id);
    if (!submitted) continue; // allow unanswered, counts as wrong

    const correctAnswerId = correctMap.get(q.id);
    if (submitted.answerId === correctAnswerId) {
      correctCount += 1;
    }
  }

  const totalQuestions = questions.length;
  const score = totalQuestions === 0 ? 0 : Math.round((correctCount / totalQuestions) * 100);
  const passed = score >= test.pass_score;

  // store result
  const result = await prisma.testResult.create({
    data: {
      user_id: userId,
      test_id: test.id,
      score,
      passed
    },
    select: {
      id: true,
      user_id: true,
      test_id: true,
      score: true,
      passed: true,
      created_at: true
    }
  });

  return {
    score,
    passed,
    correctCount,
    totalQuestions,
    result
  };
}

module.exports = {
  createTest,
  getAllTests,
  getTestByIdSafe,
  submitTest
};
