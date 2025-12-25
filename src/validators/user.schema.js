const { z } = require("zod");

const createUserSchema = z.object({
  body: z.object({
    full_name: z.string().min(2, "full_name must be at least 2 characters"),
    group_name: z.string().optional().nullable(),
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "password must be at least 6 characters"),
    role: z.enum(["admin", "user"]).optional().default("user")
  })
});

const updateUserSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid user id")
  }),
  body: z.object({
    full_name: z.string().min(2).optional(),
    group_name: z.string().optional().nullable(),
    email: z.string().email().optional(),
    password: z.string().min(6).optional(),
    role: z.enum(["admin", "user"]).optional()
  })
});

const userIdSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid user id")
  })
});

module.exports = {
  createUserSchema,
  updateUserSchema,
  userIdSchema
};
