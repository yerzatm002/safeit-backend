const { z } = require("zod");

const instructionTypeEnum = z.enum(["text", "video", "pdf"]);

const createInstructionSchema = z.object({
  body: z.object({
    title: z.string().min(3, "title must be at least 3 characters"),
    type: instructionTypeEnum,
    content: z.string().optional().nullable(),
    video_url: z.string().url("video_url must be a valid URL").optional().nullable()
  })
});

const updateInstructionSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid instruction id")
  }),
  body: z.object({
    title: z.string().min(3).optional(),
    type: instructionTypeEnum.optional(),
    content: z.string().optional().nullable(),
    video_url: z.string().url().optional().nullable()
  })
});

const instructionIdSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid instruction id")
  })
});

module.exports = {
  createInstructionSchema,
  updateInstructionSchema,
  instructionIdSchema
};
