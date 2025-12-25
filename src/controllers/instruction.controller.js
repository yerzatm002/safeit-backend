const { ok, created } = require("../utils/response");
const instructionService = require("../services/instruction.service");

async function getAllInstructions(req, res, next) {
  try {
    const instructions = await instructionService.getAllInstructions();
    return ok(res, instructions, "Instructions fetched");
  } catch (err) {
    next(err);
  }
}

async function getInstructionById(req, res, next) {
  try {
    const { id } = req.params;
    const instruction = await instructionService.getInstructionById(id);
    return ok(res, instruction, "Instruction fetched");
  } catch (err) {
    next(err);
  }
}

async function createInstruction(req, res, next) {
  try {
    const instruction = await instructionService.createInstruction(req.body);
    return created(res, instruction, "Instruction created");
  } catch (err) {
    next(err);
  }
}

async function updateInstruction(req, res, next) {
  try {
    const { id } = req.params;
    const instruction = await instructionService.updateInstruction(id, req.body);
    return ok(res, instruction, "Instruction updated");
  } catch (err) {
    next(err);
  }
}

async function deleteInstruction(req, res, next) {
  try {
    const { id } = req.params;
    const result = await instructionService.deleteInstruction(id);
    return ok(res, result, "Instruction deleted");
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAllInstructions,
  getInstructionById,
  createInstruction,
  updateInstruction,
  deleteInstruction
};
