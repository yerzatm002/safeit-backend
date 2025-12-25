const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = require("../config/prisma");
const { JWT_SECRET } = require("../config/env");

async function login(email, password) {
  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    const err = new Error("Invalid email or password");
    err.status = 401;
    throw err;
  }

  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
    const err = new Error("Invalid email or password");
    err.status = 401;
    throw err;
  }

  const token = jwt.sign(
    {
      id: user.id,
      role: user.role
    },
    JWT_SECRET,
    {
      expiresIn: "7d"
    }
  );

  return {
    token,
    user: {
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      role: user.role
    }
  };
}

module.exports = { login };
