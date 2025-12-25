const { ok, created } = require("../utils/response");
const userService = require("../services/user.service");

async function getAllUsers(req, res, next) {
  try {
    const users = await userService.getAllUsers();
    return ok(res, users, "Users fetched");
  } catch (err) {
    next(err);
  }
}

async function createUser(req, res, next) {
  try {
    const user = await userService.createUser(req.body);
    return created(res, user, "User created");
  } catch (err) {
    next(err);
  }
}

async function updateUser(req, res, next) {
  try {
    const { id } = req.params;
    const user = await userService.updateUser(id, req.body);
    return ok(res, user, "User updated");
  } catch (err) {
    next(err);
  }
}

async function deleteUser(req, res, next) {
  try {
    const { id } = req.params;
    const result = await userService.deleteUser(id);
    return ok(res, result, "User deleted");
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser
};
