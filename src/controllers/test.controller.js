const { ok, created } = require("../utils/response");
const testService = require("../services/test.service");

async function createTest(req, res, next) {
  try {
    const test = await testService.createTest(req.body);
    return created(res, test, "Test created");
  } catch (err) {
    next(err);
  }
}

async function getAllTests(req, res, next) {
  try {
    const tests = await testService.getAllTests();
    return ok(res, tests, "Tests fetched");
  } catch (err) {
    next(err);
  }
}

async function getTestById(req, res, next) {
  try {
    const { id } = req.params;
    const test = await testService.getTestByIdSafe(id);
    return ok(res, test, "Test fetched");
  } catch (err) {
    next(err);
  }
}

async function submitTest(req, res, next) {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { answers } = req.body;

    const result = await testService.submitTest(userId, id, answers);

    return ok(res, result, "Test submitted");
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createTest,
  getAllTests,
  getTestById,
  submitTest
};
